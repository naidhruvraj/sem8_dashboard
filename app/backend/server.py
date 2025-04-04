import os
import io
import pymongo
import requests
import whisper
import ffmpeg
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from bson import ObjectId
import json
from fastapi.middleware.cors import CORSMiddleware
import subprocess  # Needed for FFmpeg processing

# ✅ Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

# ✅ Initialize FastAPI app
app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# ✅ Connect to MongoDB
print("🔗 Connecting to MongoDB...")
client = pymongo.MongoClient(MONGO_URI)
db = client["storage"]
students_collection = db["students"]
modules_collection = db["modules"]
print("✅ MongoDB connection successful.")

# ✅ Load Whisper Model
print("🔍 Loading Whisper model...")
whisper_model = whisper.load_model("base")
print("✅ Whisper model loaded successfully.")

# ✅ Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)
print("✅ Gemini API configured.")

# ✅ Define Gemini model configuration
generation_config = {
    "temperature": 0.7,
    "top_p": 0.9,
    "max_output_tokens": 1000,
    "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)
print("✅ Gemini model initialized.")

# ✅ Pydantic Model for Request Data
class AssessmentRequest(BaseModel):
    student_email: str
    module_id: str

# ✅ Extract text from video
def extract_text_from_video(video_url):
    try:
        print(f"📥 Downloading video from: {video_url}")
        response = requests.get(video_url, stream=True)
        if response.status_code != 200:
            print("❌ Failed to download video.")
            raise HTTPException(status_code=400, detail="Failed to download video")

        video_data = response.content  # Store video in memory

        # Save video to a temporary file
        temp_video_path = "temp_video.mp4"
        with open(temp_video_path, "wb") as f:
            f.write(video_data)
        print("✅ Video downloaded and saved.")

        # Extract audio using FFmpeg
        temp_audio_path = "temp_audio.wav"
        try:
            print("🎵 Extracting audio from video...")
            subprocess.run(
                [
                    "ffmpeg",
                    "-i", temp_video_path,
                    "-vn",  # No video
                    "-acodec", "pcm_s16le",
                    "-ar", "16000",
                    "-ac", "1",
                    temp_audio_path,
                ],
                check=True
            )
            print("✅ Audio extracted successfully.")
        except subprocess.CalledProcessError as e:
            print(f"❌ FFmpeg failed: {e}")
            raise HTTPException(status_code=500, detail=f"FFmpeg error: {str(e)}")

        # Transcribe audio using Whisper
        print("📝 Transcribing audio...")
        result = whisper_model.transcribe(temp_audio_path)
        print("✅ Transcription completed.")

        # Cleanup temp files
        os.remove(temp_video_path)
        os.remove(temp_audio_path)
        print("🧹 Temporary files removed.")

        return result["text"]

    except Exception as e:
        print(f"❌ Error processing video: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

# ✅ Generate questions based on difficulty level
def generate_questions(extracted_text, student_category, num_questions=15):
    try:
        print(f"📜 Generating {num_questions} questions for category: {student_category}")

        # Define difficulty level prompts
        if student_category == "Mild":
            difficulty = "challenging questions with in-depth analysis"
        elif student_category == "Moderate":
            difficulty = "moderate difficulty questions covering essential concepts"
        else:  # Severe category
            difficulty = "basic, simple, and easy-to-understand questions"

        prompt = f"""
        Generate {num_questions} questions based on the following content.
        The questions should be {difficulty}.
        Include:
        - Multiple-choice questions (MCQs) with four options
        - Fill in the blanks
        - True or false questions
        - Multiple select questions (MSQs)

        Each question should clearly indicate the correct answer.

        Content:
        {extracted_text}

        Return output in JSON format:
        {{
            "questions": [
                {{"type": "mcq", "question": "What is XYZ?", "options": ["A", "B", "C", "D"], "answer": "A"}},
                {{"type": "fill_in_the_blank", "question": "The capital of France is ___.", "answer": "Paris"}},
                {{"type": "true_false", "question": "The sun rises in the west.", "answer": "False"}},
                {{"type": "msq", "question": "Select the prime numbers:", "options": ["2", "3", "4", "5"], "answer": ["2", "3", "5"]}}
            ]
        }}
        """

        response = model.generate_content(prompt)
        print("✅ Gemini API response received.")

        # ✅ Ensure valid JSON parsing
        try:
            return json.loads(response.text.strip())
        except json.JSONDecodeError:
            print("❌ Error parsing JSON from Gemini API.")
            raise HTTPException(status_code=500, detail="Gemini API returned invalid JSON")

    except Exception as e:
        print(f"❌ Error generating questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")

# ✅ Generate Assessment with Category-Based Difficulty
@app.post("/generate_assessment")
async def generate_assessment(data: AssessmentRequest):
    try:
        print("📩 Received assessment generation request.")
        print(f"📧 Student Email: {data.student_email}, 🆔 Module ID: {data.module_id}")

        # ✅ Validate ObjectId format
        try:
            module_id = ObjectId(data.module_id)
        except:
            print("❌ Invalid module ID format.")
            raise HTTPException(status_code=400, detail="Invalid module ID format")

        # ✅ Fetch student details to get the category
        print("🔎 Fetching student details...")
        student = students_collection.find_one({"email": data.student_email})
        if not student:
            print("❌ Student not found in database.")
            raise HTTPException(status_code=404, detail="Student not found")

        student_category = student.get("category", "Moderate")  # Default to Moderate if missing
        print(f"📊 Student Category: {student_category}")

        # ✅ Fetch module from MongoDB
        print("🔎 Fetching module from database...")
        module = modules_collection.find_one({"_id": module_id})
        if not module:
            print("❌ Module not found in database.")
            raise HTTPException(status_code=404, detail="Module not found")

        video_url = module.get("videoUrl")
        if not video_url:
            print("❌ Module does not have a video URL.")
            raise HTTPException(status_code=400, detail="Module does not have a video URL")

        print("✅ Module found. Extracting text from video...")
        # ✅ Extract text from video
        extracted_text = extract_text_from_video(video_url)

        print("✅ Text extracted. Generating questions based on category...")
        # ✅ Generate questions based on student category
        questions = generate_questions(extracted_text, student_category)

        print("✅ Assessment generation completed successfully.")
        return {"questions": questions}

    except Exception as e:
        print(f"❌ Error generating assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# import os
# import io
# import pymongo
# import requests
# import whisper
# import ffmpeg
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from dotenv import load_dotenv
# import google.generativeai as genai
# from bson import ObjectId
# import json
# from fastapi.middleware.cors import CORSMiddleware
# import subprocess  # Needed for FFmpeg processing

# # Load environment variables
# load_dotenv()
# MONGO_URI = os.getenv("MONGODB_URI")
# GEMINI_API_KEY = os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")

# # Initialize FastAPI app
# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  
#     allow_credentials=True,
#     allow_methods=["*"],  
#     allow_headers=["*"],  
# )

# # Connect to MongoDB
# client = pymongo.MongoClient(MONGO_URI)
# db = client["storage"]
# students_collection = db["students"]
# modules_collection = db["modules"]

# # Load Whisper Model
# whisper_model = whisper.load_model("base")

# # Configure Gemini API
# genai.configure(api_key=GEMINI_API_KEY)

# # Define Gemini model configuration
# generation_config = {
#     "temperature": 0.7,
#     "top_p": 0.9,
#     "max_output_tokens": 1000,
#     "response_mime_type": "application/json",
# }

# model = genai.GenerativeModel(
#     model_name="gemini-1.5-flash",
#     generation_config=generation_config,
# )

# # Pydantic Model for Request Data
# class AssessmentRequest(BaseModel):
#     student_email: str
#     module_id: str

# # ✅ FIXED: Extract text from video with temp file storage
# def extract_text_from_video(video_url):
#     try:
#         response = requests.get(video_url, stream=True)
#         if response.status_code != 200:
#             raise HTTPException(status_code=400, detail="Failed to download video")

#         video_data = response.content  # Store video in memory

#         # Save video to a temporary file
#         temp_video_path = "temp_video.mp4"
#         with open(temp_video_path, "wb") as f:
#             f.write(video_data)

#         # Extract audio using FFmpeg
#         temp_audio_path = "temp_audio.wav"
#         subprocess.run(
#             [
#                 "ffmpeg",
#                 "-i", temp_video_path,
#                 "-vn",  # No video
#                 "-acodec", "pcm_s16le",
#                 "-ar", "16000",
#                 "-ac", "1",
#                 temp_audio_path,
#             ],
#             check=True
#         )

#         # Transcribe audio using Whisper
#         result = whisper_model.transcribe(temp_audio_path)

#         # Cleanup temp files
#         os.remove(temp_video_path)
#         os.remove(temp_audio_path)

#         return result["text"]

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

# # ✅ FIXED: Ensure proper JSON parsing
# def generate_questions(extracted_text, num_questions=15):
#     try:
#         prompt = f"""
#         Generate {num_questions} questions based on the following content.
#         The questions should include:
#         - Multiple-choice questions (MCQs) with four options
#         - Fill in the blanks
#         - True or false questions
#         - Multiple select questions (MSQs)

#         Each question should clearly indicate the correct answer.

#         Content:
#         {extracted_text}

#         Return output in JSON format:
#         {{
#             "questions": [
#                 {{"type": "mcq", "question": "What is XYZ?", "options": ["A", "B", "C", "D"], "answer": "A"}},
#                 {{"type": "fill_in_the_blank", "question": "The capital of France is ___.", "answer": "Paris"}},
#                 {{"type": "true_false", "question": "The sun rises in the west.", "answer": "False"}},
#                 {{"type": "msq", "question": "Select the prime numbers:", "options": ["2", "3", "4", "5"], "answer": ["2", "3", "5"]}}
#             ]
#         }}
#         """

#         response = model.generate_content(prompt)

#         # ✅ DEBUG: Print response to identify issues
#         print("GEMINI RESPONSE:", response.text)

#         # ✅ Ensure valid JSON parsing
#         try:
#             return json.loads(response.text.strip())
#         except json.JSONDecodeError:
#             raise HTTPException(status_code=500, detail="Gemini API returned invalid JSON")

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")

# # ✅ FIXED: Validate MongoDB ObjectId before querying
# @app.post("/generate_assessment")
# async def generate_assessment(data: AssessmentRequest):
#     try:
#         # ✅ Validate ObjectId format
#         try:
#             module_id = ObjectId(data.module_id)
#         except:
#             raise HTTPException(status_code=400, detail="Invalid module ID format")

#         # ✅ Fetch module from MongoDB
#         module = modules_collection.find_one({"_id": module_id})
#         if not module:
#             raise HTTPException(status_code=404, detail="Module not found")

#         video_url = module.get("videoUrl")
#         if not video_url:
#             raise HTTPException(status_code=400, detail="Module does not have a video URL")

#         # ✅ Extract text from video
#         extracted_text = extract_text_from_video(video_url)

#         # ✅ Generate questions using Gemini API
#         questions = generate_questions(extracted_text)

#         return {"questions": questions}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# import os
# import io
# import pymongo
# import requests
# import whisper
# import ffmpeg
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from dotenv import load_dotenv
# import google.generativeai as genai
# from bson import ObjectId
# import json  # ✅ Added for JSON parsing
# from fastapi.middleware.cors import CORSMiddleware


# # Load environment variables
# load_dotenv()
# MONGO_URI = os.getenv("MONGODB_URI")
# GEMINI_API_KEY = os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")

# # Initialize FastAPI app
# app = FastAPI()


# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow all origins for testing; restrict in production
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all HTTP methods
#     allow_headers=["*"],  # Allow all headers
# )

# # Connect to MongoDB
# client = pymongo.MongoClient(MONGO_URI)
# db = client["storage"]
# students_collection = db["students"]
# modules_collection = db["modules"]

# # Load Whisper Model
# whisper_model = whisper.load_model("base")

# # Configure Gemini API
# genai.configure(api_key=GEMINI_API_KEY)

# # Define Gemini model configuration
# generation_config = {
#     "temperature": 0.7,
#     "top_p": 0.9,
#     "max_output_tokens": 1000,
#     "response_mime_type": "application/json",
# }

# model = genai.GenerativeModel(
#     model_name="gemini-1.5-flash",
#     generation_config=generation_config,
# )

# # Pydantic Model for Request Data
# class AssessmentRequest(BaseModel):
#     student_email: str
#     module_id: str

# # ✅ FIXED FUNCTION: Extract text from video
# def extract_text_from_video(video_url):
#     try:
#         # Download video
#         video_data = requests.get(video_url).content
#         video_path = "temp_video.mp4"

#         # Save the video locally
#         with open(video_path, "wb") as f:
#             f.write(video_data)

#         # Convert video to audio using ffmpeg
#         audio_path = "temp_audio.wav"
#         ffmpeg.input(video_path).output(audio_path, format="wav", acodec="pcm_s16le", ac=1, ar="16k").run()

#         # Transcribe audio using Whisper
#         result = whisper_model.transcribe(audio_path)
#         os.remove(video_path)  # Cleanup
#         os.remove(audio_path)  # Cleanup
#         return result["text"]

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")

# # ✅ FIXED FUNCTION: Generate questions with proper JSON output
# def generate_questions(extracted_text, num_questions=15):
#     try:
#         prompt = f"""
#         Generate {num_questions} questions based on the following content.
#         The questions should include:
#         - Multiple-choice questions (MCQs) with four options
#         - Fill in the blanks
#         - True or false questions
#         - Multiple select questions (MSQs)

#         Each question should clearly indicate the correct answer.

#         Content:
#         {extracted_text}

#         Return output in JSON format:
#         {{
#             "questions": [
#                 {{"type": "mcq", "question": "What is XYZ?", "options": ["A", "B", "C", "D"], "answer": "A"}},
#                 {{"type": "fill_in_the_blank", "question": "The capital of France is ___.", "answer": "Paris"}},
#                 {{"type": "true_false", "question": "The sun rises in the west.", "answer": "False"}},
#                 {{"type": "msq", "question": "Select the prime numbers:", "options": ["2", "3", "4", "5"], "answer": ["2", "3", "5"]}}
#             ]
#         }}
#         """

#         response = model.generate_content(prompt)

#         # ✅ Ensure we parse the JSON properly
#         return json.loads(response.text) if response else {"questions": []}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")

# # ✅ API Endpoint to Generate Questions for an Assessment
# @app.post("/generate_assessment")
# async def generate_assessment(data: AssessmentRequest):
#     # Fetch module details from MongoDB
#     module = modules_collection.find_one({"_id": ObjectId(data.module_id)})
#     if not module:
#         raise HTTPException(status_code=404, detail="Module not found")

#     video_url = module["videoUrl"]

#     # Extract text from video
#     extracted_text = extract_text_from_video(video_url)

#     # Generate questions using Gemini API
#     questions = generate_questions(extracted_text)

#     return {"questions": questions}
