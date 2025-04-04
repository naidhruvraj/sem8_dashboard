// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";

// const PostAssessment = () => {
//   const { user } = useUser();
//   const router = useRouter();

//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [moduleId, setModuleId] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(600); // 10-minute timer
//   const [flaggedQuestions, setFlaggedQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedModuleId = sessionStorage.getItem("selectedModuleId");
//       if (storedModuleId) {
//         setModuleId(storedModuleId);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       if (!moduleId || !user) return;

//       try {
//         const response = await axios.post("http://localhost:8000/generate_assessment", {
//           student_email: user.primaryEmailAddress.emailAddress,
//           module_id: moduleId,
//         });

//         if (response.data?.questions?.questions) {
//           setQuestions(response.data.questions.questions);
//         } else {
//           setQuestions([]);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching assessment questions:", error);
//         setLoading(false);
//       }
//     };

//     if (moduleId) fetchQuestions();
//   }, [moduleId, user]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       handleSubmit();
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => prevTime - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const handleAnswer = (index, value) => {
//     setAnswers((prev) => ({ ...prev, [index]: value }));
//   };

//   const handleMultipleSelect = (index, option) => {
//     setAnswers((prev) => {
//       const currentSelection = prev[index] || [];
//       if (currentSelection.includes(option)) {
//         return { ...prev, [index]: currentSelection.filter((o) => o !== option) };
//       } else {
//         return { ...prev, [index]: [...currentSelection, option] };
//       }
//     });
//   };

//   const toggleFlag = (index) => {
//     setFlaggedQuestions((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };

//   const handleSubmit = () => {
//     setShowConfirmModal(true);
//   };

//   const confirmSubmit = () => {
//     setShowConfirmModal(false);
//     setSubmitting(true);

//     // Simulate submission
//     setTimeout(() => {
//       router.push("/maintest/student");
//     }, 2000);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mb-6"></div>
//         <h2 className="text-2xl font-bold">Generating your assessment questions...</h2>
//         <p className="mt-2">Please wait a moment ⏳</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6 pb-20">
//       <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-900">📝 Post Assessment</h1>

//       {/* Fixed Timer and Submit Button on Right Side */}
//       <div className="fixed right-6 top-24 z-50 bg-white shadow-xl p-4 rounded-lg flex flex-col items-center gap-3">
//         <p className="text-lg font-semibold text-gray-700">
//           ⏳ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
//         </p>
//         <button
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-transform transform hover:scale-105"
//           onClick={handleSubmit}
//         >
//           Submit
//         </button>
//       </div>

//       {/* Questions Panel */}
//       <div className="max-w-3xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
//         {questions.length > 0 ? (
//           questions.map((q, index) => (
//             <div
//               key={index}
//               className={`mb-6 p-4 border rounded-lg shadow-sm transition-all duration-200 
//               ${flaggedQuestions.includes(index) ? "bg-yellow-300" : "bg-gray-100"}`}
//             >
//               <div className="flex justify-between items-center">
//                 <p className="font-semibold text-lg">
//                   {index + 1}. {q.question}
//                 </p>
//                 <button
//                   className={`px-3 py-1 rounded flex items-center gap-1 transition-all duration-150
//                   ${flaggedQuestions.includes(index) ? "bg-red-600 text-white" : "bg-gray-300"}`}
//                   onClick={() => toggleFlag(index)}
//                 >
//                   🚩 {flaggedQuestions.includes(index) ? "Unflag" : "Flag"}
//                 </button>
//               </div>

//               {/* MCQ */}
//               {q.type === "mcq" && (
//                 <ul className="mt-2">
//                   {q.options.map((option, i) => (
//                     <li
//                       key={i}
//                       className={`p-2 border rounded-md mt-1 cursor-pointer transition-all duration-150
//                       ${answers[index] === option ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
//                       onClick={() => handleAnswer(index, option)}
//                     >
//                       {option}
//                     </li>
//                   ))}
//                 </ul>
//               )}

//               {/* True/False */}
//               {q.type === "true_false" && (
//                 <div className="mt-2 flex gap-4">
//                   <button
//                     className={`p-2 rounded-lg transition-all duration-150
//                     ${answers[index] === "True" ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
//                     onClick={() => handleAnswer(index, "True")}
//                   >
//                     ✅ True
//                   </button>
//                   <button
//                     className={`p-2 rounded-lg transition-all duration-150
//                     ${answers[index] === "False" ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
//                     onClick={() => handleAnswer(index, "False")}
//                   >
//                     ❌ False
//                   </button>
//                 </div>
//               )}

//               {/* Fill in the Blank */}
//               {q.type === "fill_in_the_blank" && (
//                 <input
//                   type="text"
//                   className="mt-2 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Type your answer here..."
//                   onChange={(e) => handleAnswer(index, e.target.value)}
//                 />
//               )}

//               {/* MSQ */}
//               {q.type === "msq" && (
//                 <ul className="mt-2">
//                   {q.options.map((option, i) => (
//                     <li
//                       key={i}
//                       className={`p-2 border rounded-md mt-1 cursor-pointer transition-all duration-150
//                       ${answers[index]?.includes(option) ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
//                       onClick={() => handleMultipleSelect(index, option)}
//                     >
//                       {option}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-lg font-semibold">No questions available.</p>
//         )}
//       </div>

//       {/* Confirm Submit Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg text-center">
//             <h2 className="text-2xl font-bold mb-4">Confirm Submission</h2>
//             <p className="mb-6">Are you sure you want to submit the assessment?</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
//                 onClick={confirmSubmit}
//               >
//                 Yes, Submit
//               </button>
//               <button
//                 className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold"
//                 onClick={() => setShowConfirmModal(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Submitting Loading UI */}
//       {submitting && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50 text-white">
//           <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-white mb-4"></div>
//           <p className="text-xl font-semibold">Submitting your answers...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostAssessment;

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const PostAssessment = () => {
  const { user } = useUser();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleId, setModuleId] = useState(null);
  const [moduleName, setModuleName] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  useEffect(() => {
    const storedId = sessionStorage.getItem("selectedModuleId");
    const storedName = sessionStorage.getItem("selectedModuleName");
    if (storedId) setModuleId(storedId);
    if (storedName) setModuleName(storedName);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!moduleId || !user) return;

      try {
        const response = await axios.post("http://localhost:8000/generate_assessment", {
          student_email: user.primaryEmailAddress.emailAddress,
          module_id: moduleId,
        });

        console.log("API Response:", response.data);
        if (response.data?.questions?.questions) {
          setQuestions(response.data.questions.questions);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchQuestions();
  }, [moduleId, user]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setConfirmSubmit(true);
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (index, value) => setAnswers((prev) => ({ ...prev, [index]: value }));

  const handleMultipleSelect = (index, option) => {
    setAnswers((prev) => {
      const current = prev[index] || [];
      return {
        ...prev,
        [index]: current.includes(option) ? current.filter((o) => o !== option) : [...current, option],
      };
    });
  };

  const toggleFlag = (index) => {
    setFlaggedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (!userAnswer) return;

      if (q.type === "mcq" || q.type === "true_false" || q.type === "fill_in_the_blank") {
        if (userAnswer.toString().toLowerCase().trim() === q.answer.toString().toLowerCase().trim()) {
          correct++;
        }
      } else if (q.type === "msq") {
        const correctOptions = Array.isArray(q.answer) ? q.answer.sort() : [];
        const userOptions = Array.isArray(userAnswer) ? userAnswer.sort() : [];
        if (JSON.stringify(correctOptions) === JSON.stringify(userOptions)) {
          correct++;
        }
      }
    });
    return correct;
  };

  const handleFinalSubmit = async () => {
    const score = calculateScore();
    try {
      await axios.post("/api/savePostAssessmentResult", {
        email: user.primaryEmailAddress.emailAddress,
        moduleName: moduleName,
        score,
      });

      router.push("/maintest/student");
    } catch (err) {
      console.error("Failed to save results", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-6"></div>
        <p className="text-2xl font-semibold">Generating your personalized questions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6 pb-32">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-900">📝 Post Assessment</h1>

      {/* Fixed Timer & Submit */}
      <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-xl p-6 w-64 z-50">
        <p className="text-lg font-bold mb-3">
          ⏳ Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </p>
        <button
          className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all"
          onClick={() => setConfirmSubmit(true)}
        >
          Submit Assessment
        </button>
      </div>

      {/* Confirm Submission Modal */}
      {confirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
            <p className="mb-6">Are you sure you want to submit your answers?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                onClick={handleFinalSubmit}
              >
                Yes, Submit
              </button>
              <button
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400"
                onClick={() => setConfirmSubmit(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Display */}
      <div className="max-w-3xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
        {questions.map((q, index) => (
          <div
            key={index}
            className={`mb-6 p-4 border rounded-lg shadow-sm transition-all duration-200 
              ${flaggedQuestions.includes(index) ? "bg-yellow-300" : "bg-gray-100"}`}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">
                {index + 1}. {q.question}
              </p>
              <button
                className={`px-3 py-1 rounded flex items-center gap-1 transition-all duration-150
                  ${flaggedQuestions.includes(index) ? "bg-red-600 text-white" : "bg-gray-300"}`}
                onClick={() => toggleFlag(index)}
              >
                🚩 {flaggedQuestions.includes(index) ? "Unflag" : "Flag"}
              </button>
            </div>

            {/* Options */}
            {q.type === "mcq" && (
              <ul className="mt-2">
                {q.options.map((option, i) => (
                  <li
                    key={i}
                    className={`p-2 border rounded-md mt-1 cursor-pointer
                      ${answers[index] === option ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => handleAnswer(index, option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}

            {q.type === "true_false" && (
              <div className="mt-2 flex gap-4">
                {["True", "False"].map((val) => (
                  <button
                    key={val}
                    className={`p-2 rounded-lg
                      ${answers[index] === val ? (val === "True" ? "bg-green-500" : "bg-red-500") + " text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => handleAnswer(index, val)}
                  >
                    {val === "True" ? "✅" : "❌"} {val}
                  </button>
                ))}
              </div>
            )}

            {q.type === "fill_in_the_blank" && (
              <input
                type="text"
                className="mt-2 w-full p-2 border rounded-lg"
                placeholder="Type your answer here..."
                onChange={(e) => handleAnswer(index, e.target.value)}
              />
            )}

            {q.type === "msq" && (
              <ul className="mt-2">
                {q.options.map((option, i) => (
                  <li
                    key={i}
                    className={`p-2 border rounded-md mt-1 cursor-pointer
                      ${answers[index]?.includes(option) ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                    onClick={() => handleMultipleSelect(index, option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostAssessment;
