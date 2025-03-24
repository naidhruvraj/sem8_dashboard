
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MCQAssessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [score, setScore] = useState(null);
  const [category, setCategory] = useState('');
  const router = useRouter();

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/getPreAssessmentQuestions');
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  // Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  const toggleFlag = (qid) => {
    setFlags({ ...flags, [qid]: !flags[qid] });
  };

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')} : ${String(timeLeft % 60).padStart(2, '0')}`;

  const evaluateScore = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });

    const percentage = (correctCount / questions.length) * 100;
    const category = percentage >= 70 && timeLeft >= 300 ? 'Average' : 'Mild';

    setScore(correctCount);
    setCategory(category);
  };

  const handleSubmit = () => {
    evaluateScore();
    setShowConfirmation(false);

    setTimeout(() => {
      router.push('/dashboard?message=You have successfully completed the Pre-Assessment! Proceed with modules.');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen p-4 bg-gray-100">
      {/* Left Panel */}
      <div className="w-1/6 bg-white shadow-lg p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Questions</h2>
        <div className="grid grid-cols-3 gap-2">
          {questions.map((q) => (
            <button
              key={q.id}
              className={`w-10 h-10 rounded-full ${flags[q.id] ? 'bg-red-300' : 'bg-gray-200'} ${currentQuestion === q.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setCurrentQuestion(q.id)}
            >
              {q.id}
            </button>
          ))}
        </div>
        <button
          className="bg-green-500 text-white px-2 py-1 mt-4 rounded-md"
          onClick={() => setShowConfirmation(true)}
        >
          Submit
        </button>
        {showConfirmation && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>Are you sure you want to submit?</p>
            <div className="flex gap-2 mt-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleSubmit}>Yes</button>
              <button className="bg-red-400 text-white px-3 py-1 rounded" onClick={() => setShowConfirmation(false)}>No</button>
            </div>
          </div>
        )}
      </div>

      {/* Center Panel */}
      <div className="w-4/6 px-8">
        {questions
          .filter((q) => q.id === currentQuestion)
          .map((q) => (
            <div key={q.id} className="bg-white p-6 shadow-md rounded-lg mb-6">
              <h3 className="text-xl mb-4">{q.id}. {q.question}</h3>
              <div className="space-y-3">
                {q.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === opt}
                      onChange={() => handleOptionSelect(q.id, opt)}
                      className="mr-3"
                    />
                    <label>{opt}</label>
                  </div>
                ))}
              </div>
              <button
                onClick={() => toggleFlag(q.id)}
                className={`mt-4 px-4 py-1 rounded-md border ${flags[q.id] ? 'bg-red-400 text-white' : 'border-red-400 text-red-400'}`}
              >
                {flags[q.id] ? 'Flagged' : 'Flag 🚩'}
              </button>
            </div>
          ))}
        {score !== null && (
          <div className="bg-green-100 p-4 rounded-lg mt-4">
            <p>Your Score: {score}/{questions.length}</p>
            <p>Category: {category}</p>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-1/6 bg-white shadow-lg p-4 rounded-lg flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2 text-red-500">Timer</h2>
        <p className="text-2xl mb-2">{formattedTime}</p>
        <p className="text-sm">Minutes : Seconds</p>
      </div>
    </div>
  );
};

export default MCQAssessment;


