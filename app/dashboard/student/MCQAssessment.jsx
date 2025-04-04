// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// const MCQAssessment = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(1);
//   const [answers, setAnswers] = useState({});
//   const [flags, setFlags] = useState({});
//   const [timeLeft, setTimeLeft] = useState(600);
//   const [loading, setLoading] = useState(true);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [score, setScore] = useState(null);
//   const [category, setCategory] = useState('');
//   const [quizStartedAt, setQuizStartedAt] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch('/api/getPreAssessmentQuestions');
//         const data = await res.json();
//         setQuestions(data);
//         setQuizStartedAt(Date.now());
//       } catch (error) {
//         console.error('Error fetching questions:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   useEffect(() => {
//     if (loading || timeLeft <= 0) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [loading, timeLeft]);

//   const handleOptionSelect = (qid, option) => {
//     setAnswers({ ...answers, [qid]: option });
//   };

//   const toggleFlag = (qid) => {
//     setFlags({ ...flags, [qid]: !flags[qid] });
//   };

//   const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')} : ${String(timeLeft % 60).padStart(2, '0')}`;

//   const evaluateScore = () => {
//     let correctCount = 0;
//     questions.forEach((q) => {
//       if (answers[q.id] === q.correct_answer) {
//         correctCount++;
//       }
//     });

//     const percentage = (correctCount / questions.length) * 100;
//     const timeTaken = (quizStartedAt ? (Date.now() - quizStartedAt) / 1000 : 600);

//     let category = 'Severe';
//     if (percentage >= 70 && timeTaken >= 300) {
//       category = 'Mild';
//     } else if (percentage >= 50) {
//       category = 'Moderate';
//     }

//     setScore(correctCount);
//     setCategory(category);
//     return { correctCount, category, timeTaken };
//   };

//   const handleSubmit = async () => {
//     const { correctCount, category, timeTaken } = evaluateScore();

//     try {
//       const res = await fetch('/api/completePreAssessment', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           answers,
//           score: correctCount,
//           category,
//           timeTaken,
//         }),
//       });

//       if (!res.ok) throw new Error('Failed to save assessment data');

//       localStorage.setItem('preAssessmentDone', 'true');
//       setShowConfirmation(false);

//       setTimeout(() => {
//         router.push('/dashboard/student');
//       }, 3000);
//     } catch (error) {
//       console.error('Error saving assessment data:', error);
//     }
//   };

//   return (
//     <div className="flex min-h-screen p-6 bg-gradient-to-br from-blue-100 to-purple-200">
//       {/* Left Panel - Question Navigation */}
//       <div className="w-1/5 bg-white shadow-lg p-6 rounded-lg text-center">
//         <h2 className="text-lg font-bold mb-4 text-blue-600">Questions</h2>

//         {loading ? (
//           <p className="text-gray-500 text-lg">Loading questions...</p>
//         ) : (
//           <div className="grid grid-cols-4 gap-3">
//             {questions.map((q) => {
//               const isAnswered = answers[q.id] !== undefined;
//               return (
//                 <button
//                   key={q.id}
//                   className={`w-12 h-12 rounded-full font-bold text-lg shadow-md transition duration-300 
//                     ${flags[q.id] ? 'bg-red-300 text-white' : isAnswered ? 'bg-green-300' : 'bg-gray-300'}
//                     ${currentQuestion === q.id ? 'ring-4 ring-blue-500' : ''}`}
//                   onClick={() => setCurrentQuestion(q.id)}
//                 >
//                   {q.id}
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         {!loading && (
//           <button
//             className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 mt-6 rounded-md w-full text-lg font-semibold"
//             onClick={() => setShowConfirmation(true)}
//           >
//             Submit Test
//           </button>
//         )}

//         {showConfirmation && (
//           <div className="mt-4 p-4 bg-gray-200 rounded-lg shadow-md">
//             <p className="text-lg font-semibold text-gray-800">Are you sure you want to submit?</p>
//             <div className="flex gap-4 mt-3">
//               <button className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold" onClick={handleSubmit}>
//                 Yes
//               </button>
//               <button className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold" onClick={() => setShowConfirmation(false)}>
//                 No
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Middle Panel - Question Display */}
//       <div className="w-3/5 px-10">
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <p className="text-2xl font-bold text-gray-600">Fetching questions...</p>
//           </div>
//         ) : (
//           questions
//             .filter((q) => q.id === currentQuestion)
//             .map((q) => (
//               <div key={q.id} className="bg-white p-8 shadow-xl rounded-lg mb-6 border-l-8 border-blue-500">
//                 <h3 className="text-2xl font-bold text-blue-700 mb-6">{q.id}. {q.question}</h3>
//                 <div className="space-y-4">
//                   {q.options.map((opt, idx) => (
//                     <div
//                       key={idx}
//                       className={`flex items-center px-6 py-3 rounded-lg cursor-pointer transition-all text-lg font-semibold
//                       ${answers[q.id] === opt ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-300'}`}
//                       onClick={() => handleOptionSelect(q.id, opt)}
//                     >
//                       {opt}
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   onClick={() => toggleFlag(q.id)}
//                   className={`mt-4 px-6 py-2 rounded-md text-lg font-semibold transition-all 
//                     ${flags[q.id] ? 'bg-red-500 text-white' : 'border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}`}
//                 >
//                   {flags[q.id] ? 'Flagged 🚩' : 'Flag 🚩'}
//                 </button>
//               </div>
//             ))
//         )}
//       </div>

//       {/* Right Panel - Timer */}
//       <div className="w-1/5 bg-white shadow-lg p-6 rounded-lg flex flex-col items-center">
//         <h2 className="text-xl font-bold mb-3 text-red-600">Timer ⏳</h2>
//         <p className="text-4xl font-extrabold text-gray-800">{formattedTime}</p>
//       </div>
//     </div>
//   );
// };

// export default MCQAssessment;

// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs"; // Import Clerk's user hook

// const MCQAssessment = () => {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(1);
//   const [answers, setAnswers] = useState({});
//   const [flags, setFlags] = useState({});
//   const [timeLeft, setTimeLeft] = useState(600);
//   const [loading, setLoading] = useState(true);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [score, setScore] = useState(null);
//   const [category, setCategory] = useState("");
//   const [quizStartedAt, setQuizStartedAt] = useState(null);
  
//   const { user } = useUser(); // Get logged-in user
//   const router = useRouter();

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("/api/getPreAssessmentQuestions");
//         const data = await res.json();
//         setQuestions(data);
//         setQuizStartedAt(Date.now());
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   useEffect(() => {
//     if (loading || timeLeft <= 0) return;
//     const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
//     return () => clearInterval(timer);
//   }, [loading, timeLeft]);

//   const handleOptionSelect = (qid, option) => {
//     setAnswers({ ...answers, [qid]: option });
//   };

//   const toggleFlag = (qid) => {
//     setFlags({ ...flags, [qid]: !flags[qid] });
//   };

//   const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")} : ${String(timeLeft % 60).padStart(2, "0")}`;

//   const evaluateScore = () => {
//     let correctCount = 0;
//     questions.forEach((q) => {
//       if (answers[q.id] === q.correct_answer) correctCount++;
//     });

//     const percentage = (correctCount / questions.length) * 100;
//     const timeTaken = quizStartedAt ? (Date.now() - quizStartedAt) / 1000 : 600;

//     let category = "Severe";
//     if (percentage >= 70 && timeTaken >= 300) {
//       category = "Mild";
//     } else if (percentage >= 50) {
//       category = "Moderate";
//     }

//     setScore(correctCount);
//     setCategory(category);
//     return { correctCount, category };
//   };

//   const handleSubmit = async () => {
//     const { correctCount, category } = evaluateScore();
    
//     try {
//       const email = user?.primaryEmailAddress?.emailAddress;
//       if (!email) {
//         console.error("User email not found, cannot submit assessment.");
//         return;
//       }

//       const res = await fetch("/api/completePreAssessment", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, category, preAssessmentDone: true }),
//       });

//       if (!res.ok) throw new Error("Failed to save assessment data");
//     } catch (error) {
//       console.error("Error saving assessment data:", error);
//     }

//     localStorage.setItem("preAssessmentDone", "true");
//     setShowConfirmation(false);

//     setTimeout(() => {
//       router.push("/dashboard/student");
//     }, 3000);
//   };

//   return (
//     <div className="flex min-h-screen p-6 bg-gradient-to-br from-blue-100 to-purple-200">
//       {/* Left Panel - Question Navigation */}
//       <div className="w-1/5 bg-white shadow-lg p-6 rounded-lg text-center">
//         <h2 className="text-lg font-bold mb-4 text-blue-600">Questions</h2>

//         {loading ? (
//           <p className="text-gray-500 text-lg">Loading questions...</p>
//         ) : (
//           <div className="grid grid-cols-4 gap-3">
//             {questions.map((q) => (
//               <button
//                 key={q.id}
//                 className={`w-12 h-12 rounded-full font-bold text-lg shadow-md transition duration-300 
//                   ${flags[q.id] ? "bg-red-300 text-white" : "bg-yellow-300"}
//                   ${currentQuestion === q.id ? "ring-4 ring-blue-500" : ""}`}
//                 onClick={() => setCurrentQuestion(q.id)}
//               >
//                 {q.id}
//               </button>
//             ))}
//           </div>
//         )}

//         {!loading && (
//           <button
//             className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 mt-6 rounded-md w-full text-lg font-semibold"
//             onClick={() => setShowConfirmation(true)}
//           >
//             Submit Test
//           </button>
//         )}

//         {showConfirmation && (
//           <div className="mt-4 p-4 bg-gray-200 rounded-lg shadow-md">
//             <p className="text-lg font-semibold text-gray-800">Are you sure you want to submit?</p>
//             <div className="flex gap-4 mt-3">
//               <button className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold" onClick={handleSubmit}>
//                 Yes
//               </button>
//               <button className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold" onClick={() => setShowConfirmation(false)}>
//                 No
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Middle Panel - Question Display */}
//       <div className="w-3/5 px-10">
//         {loading ? (
//           <div className="flex justify-center items-center h-full">
//             <p className="text-2xl font-bold text-gray-600">Fetching questions...</p>
//           </div>
//         ) : (
//           questions
//             .filter((q) => q.id === currentQuestion)
//             .map((q) => (
//               <div key={q.id} className="bg-white p-8 shadow-xl rounded-lg mb-6 border-l-8 border-blue-500">
//                 <h3 className="text-2xl font-bold text-blue-700 mb-6">{q.id}. {q.question}</h3>
//                 <div className="space-y-4">
//                   {q.options.map((opt, idx) => (
//                     <div
//                       key={idx}
//                       className={`flex items-center px-6 py-3 rounded-lg cursor-pointer transition-all text-lg font-semibold
//                       ${answers[q.id] === opt ? "bg-green-500 text-white" : "bg-gray-100 hover:bg-gray-300"}`}
//                       onClick={() => handleOptionSelect(q.id, opt)}
//                     >
//                       {opt}
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   onClick={() => toggleFlag(q.id)}
//                   className={`mt-4 px-6 py-2 rounded-md text-lg font-semibold transition-all 
//                     ${flags[q.id] ? "bg-red-500 text-white" : "border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"}`}
//                 >
//                   {flags[q.id] ? "Flagged 🚩" : "Flag 🚩"}
//                 </button>
//               </div>
//             ))
//         )}
//       </div>

//       {/* Right Panel - Timer */}
//       <div className="w-1/5 bg-white shadow-lg p-6 rounded-lg flex flex-col items-center">
//         <h2 className="text-xl font-bold mb-3 text-red-600">Timer ⏳</h2>
//         <p className="text-4xl font-extrabold text-gray-800">{formattedTime}</p>
//       </div>
//     </div>
//   );
// };

// export default MCQAssessment;

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const MCQAssessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [score, setScore] = useState(null);
  const [category, setCategory] = useState("");
  const [quizStartedAt, setQuizStartedAt] = useState(null);

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/getPreAssessmentQuestions");
        const data = await res.json();
        setQuestions(data);
        setQuizStartedAt(Date.now());
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (loading || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [loading, timeLeft]);

  const handleOptionSelect = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  const toggleFlag = (qid) => {
    setFlags((prevFlags) => ({ ...prevFlags, [qid]: !prevFlags[qid] }));
  };

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")} : ${String(timeLeft % 60).padStart(2, "0")}`;

  const evaluateScore = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) correctCount++;
    });

    const percentage = (correctCount / questions.length) * 100;
    const timeTaken = quizStartedAt ? (Date.now() - quizStartedAt) / 1000 : 600;

    let category = "Severe";
    if (percentage >= 70 && timeTaken <= 300) {
      category = "Mild";
    } else if (percentage >= 50) {
      category = "Moderate";
    }

    setScore(correctCount);
    setCategory(category);
    return { correctCount, category };
  };

  const handleSubmit = async () => {
    const { correctCount, category } = evaluateScore();

    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.error("User email not found, cannot submit assessment.");
        return;
      }

      const res = await fetch("/api/completePreAssessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category, preAssessmentCompleted: true }),
      });

      if (!res.ok) throw new Error("Failed to save assessment data");
    } catch (error) {
      console.error("Error saving assessment data:", error);
    }

    localStorage.setItem("preAssessmentCompleted", "true");
    setShowConfirmation(false);

    setTimeout(() => {
      router.push("/dashboard/student");
    }, 3000);
  };

  return (
    <div className="flex min-h-screen p-6 bg-gradient-to-br from-blue-100 to-purple-200">
      {/* Left Panel - Question Navigation */}
      <div className="w-1/5 bg-white shadow-lg p-6 rounded-lg text-center">
        <h2 className="text-lg font-bold mb-4 text-blue-600">Questions</h2>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading questions...</p>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {questions.map((q) => (
              <button
                key={q.id}
                className={`w-12 h-12 rounded-full font-bold text-lg shadow-md transition duration-300 
                  ${answers[q.id] ? "bg-green-400 text-white" : "bg-gray-300"}  
                  ${flags[q.id] ? "ring-4 ring-red-500" : ""}
                  ${currentQuestion === q.id ? "ring-4 ring-blue-500" : ""}`}
                onClick={() => setCurrentQuestion(q.id)}
              >
                {q.id}
              </button>
            ))}
          </div>
        )}

        {!loading && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 mt-6 rounded-md w-full text-lg font-semibold"
            onClick={() => setShowConfirmation(true)}
          >
            Submit Test
          </button>
        )}

        {showConfirmation && (
          <div className="mt-4 p-4 bg-gray-200 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-800">Are you sure you want to submit?</p>
            <div className="flex gap-4 mt-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold" onClick={handleSubmit}>
                Yes
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold" onClick={() => setShowConfirmation(false)}>
                No
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Middle Panel - Question Display */}
      <div className="w-3/5 px-10">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-full text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
        <p className="text-2xl font-semibold text-gray-700">Fetching your challenge... ⏳</p>
        <p className="text-lg text-gray-500 italic">"Stay focused, and trust your instincts!"</p>
        </div>
      ) : (
          questions
            .filter((q) => q.id === currentQuestion)
            .map((q) => (
              <div key={q.id} className="bg-white p-8 shadow-xl rounded-lg mb-6 border-l-8 border-blue-500">
                <h3 className="text-2xl font-bold text-blue-700 mb-6">{q.id}. {q.question}</h3>
                <div className="space-y-4">
                  {q.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center px-6 py-3 rounded-lg cursor-pointer transition-all text-lg font-semibold
                      ${answers[q.id] === opt ? "bg-green-500 text-white" : "bg-gray-100 hover:bg-gray-300"}`}
                      onClick={() => handleOptionSelect(q.id, opt)}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                <button 
                  className="mt-4 px-4 py-2 text-white font-semibold rounded-md transition bg-red-500 hover:bg-red-600"
                  onClick={() => toggleFlag(q.id)}
                >
                  {flags[q.id] ? "Unflag" : "Flag"} Question 🚩
                </button>
              </div>
            ))
        )}
      </div>

      {/* Right Panel - Timer */}
      <div className="w-1/5 bg-white shadow-lg p-6 rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-bold mb-3 text-red-600">Timer ⏳</h2>
        <p className="text-4xl font-extrabold text-gray-800">{formattedTime}</p>
      </div>
    </div>
  );
};

export default MCQAssessment;
