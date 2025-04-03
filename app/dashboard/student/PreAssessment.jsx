// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { UserButton, useUser } from "@clerk/nextjs";

// const PreAssessment = () => {
//   const { user } = useUser();
//   const router = useRouter();
//   const [studentData, setStudentData] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     address: "",
//     mobile: "",
//     bloodGroup: "",
//     motorSkills: "",
//     communicationSkills: "",
//     socialSkills: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         const email = user?.primaryEmailAddress?.emailAddress;
//         if (!email) return;

//         const res = await fetch(`/api/saveStudentData?email=${email}`);
//         if (!res.ok) return;

//         const data = await res.json();
//         if (data?.message !== "Student not found") {
//           setStudentData(data);
//         }
//       } catch (error) {
//         console.error("Error fetching student data:", error);
//       }
//     };

//     if (user) fetchStudentData();
//   }, [user]);

//   const handleFormChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const res = await fetch("/api/saveStudentData", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...formData, email: user?.primaryEmailAddress?.emailAddress }),
//       });

//       if (res.ok) {
//         const savedData = await res.json();
//         setStudentData(savedData);
//       }
//     } catch (error) {
//       console.error("Error saving student data:", error);
//     }

//     setIsSubmitting(false);
//   };

//   const handleBeginTest = () => {
//     router.push("/dashboard/assessment");
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-300 to-purple-400 text-white p-8">
//       <main className="relative z-10 flex flex-col items-center justify-center p-10 bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 text-center w-[95%] max-w-2xl">
//         {!studentData ? (
//           <form onSubmit={handleFormSubmit} className="space-y-6 w-full">
//             <h1 className="text-4xl font-extrabold text-purple-700 mb-4">📝 Student Profile</h1>

//             <div className="grid grid-cols-1 gap-4">
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleFormChange}
//                 required
//                 placeholder="Full Name"
//                 className="w-full p-3 rounded-lg border text-gray-800 shadow-md"
//               />
//               <input
//                 type="number"
//                 name="age"
//                 value={formData.age}
//                 onChange={handleFormChange}
//                 required
//                 placeholder="Age"
//                 className="w-full p-3 rounded-lg border text-gray-800 shadow-md"
//               />
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleFormChange}
//                 required
//                 placeholder="Address"
//                 className="w-full p-3 rounded-lg border text-gray-800 shadow-md"
//               />
//               <input
//                 type="text"
//                 name="mobile"
//                 value={formData.mobile}
//                 onChange={handleFormChange}
//                 required
//                 placeholder="Mobile Number"
//                 className="w-full p-3 rounded-lg border text-gray-800 shadow-md"
//               />
//               <input
//                 type="text"
//                 name="bloodGroup"
//                 value={formData.bloodGroup}
//                 onChange={handleFormChange}
//                 required
//                 placeholder="Blood Group"
//                 className="w-full p-3 rounded-lg border text-gray-800 shadow-md"
//               />
//             </div>

//             {/* Hidden Skill Fields (Stored but NOT displayed later) */}
//             <div className="bg-[#EDE7F6] p-4 rounded-lg shadow-md border-2 border-purple-300 mt-4">
//               <h2 className="text-xl font-bold text-purple-800 mb-2">🛠 Skill Levels</h2>

//               <label className="block text-sm font-medium text-purple-700">Motor Skills:</label>
//               <select
//                 name="motorSkills"
//                 value={formData.motorSkills}
//                 onChange={handleFormChange}
//                 required
//                 className="w-full p-3 rounded-lg border text-gray-800 shadow-md bg-white"
//               >
//                 <option value="">Select Level</option>
//                 <option value="Excellent">Excellent</option>
//                 <option value="Good">Good</option>
//                 <option value="Average">Average</option>
//                 <option value="Needs Improvement">Needs Improvement</option>
//               </select>

//               <label className="block text-sm font-medium text-purple-700 mt-3">Communication Skills:</label>
//               <select
//                 name="communicationSkills"
//                 value={formData.communicationSkills}
//                 onChange={handleFormChange}
//                 required
//                 className="w-full p-3 rounded-lg border text-gray-800 shadow-md bg-white"
//               >
//                 <option value="">Select Level</option>
//                 <option value="Excellent">Excellent</option>
//                 <option value="Good">Good</option>
//                 <option value="Average">Average</option>
//                 <option value="Needs Improvement">Needs Improvement</option>
//               </select>

//               <label className="block text-sm font-medium text-purple-700 mt-3">Social Skills:</label>
//               <select
//                 name="socialSkills"
//                 value={formData.socialSkills}
//                 onChange={handleFormChange}
//                 required
//                 className="w-full p-3 rounded-lg border text-gray-800 shadow-md bg-white"
//               >
//                 <option value="">Select Level</option>
//                 <option value="Excellent">Excellent</option>
//                 <option value="Good">Good</option>
//                 <option value="Average">Average</option>
//                 <option value="Needs Improvement">Needs Improvement</option>
//               </select>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-300 w-full"
//             >
//               {isSubmitting ? "Saving..." : "Save Profile"}
//             </button>
//           </form>
//         ) : (
//           <>
//             <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700">
//               Welcome, {studentData.name}!
//             </h1>

//             <div className="bg-white text-gray-900 p-6 rounded-xl w-full text-left mt-6 shadow-lg border-2 border-gray-300">
//               <h2 className="text-2xl font-bold text-indigo-600 mb-3">📌 Profile Details</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
//                 <p><strong>👤 Name:</strong> {studentData.name}</p>
//                 <p><strong>🎂 Age:</strong> {studentData.age}</p>
//                 <p><strong>🏡 Address:</strong> {studentData.address}</p>
//                 <p><strong>📞 Mobile:</strong> {studentData.mobile}</p>
//                 <p><strong>🩸 Blood Group:</strong> {studentData.bloodGroup}</p>
//               </div>
//             </div>

//             <button
//               className="bg-blue-500 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform duration-300 mt-6"
//               onClick={handleBeginTest}
//             >
//               🎯 Start Pre-Assessment
//             </button>
//           </>
//         )}
//       </main>
//     </div>
//   );
// };

// export default PreAssessment;




"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

const PreAssessment = () => {
  const { user } = useUser();
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [preAssessmentStatus, setPreAssessmentStatus] = useState("not_completed"); // Default status
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    mobile: "",
    bloodGroup: "",
    motorSkills: "",
    communicationSkills: "",
    socialSkills: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Check if the user exists, only then fetch student data
  useEffect(() => {
    if (!user) return; // If user is not available, do nothing

    const fetchStudentData = async () => {
      try {
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) return;

        const res = await fetch(`/api/saveStudentData?email=${email}`);

        if (!res.ok) {
          console.warn("Student not found, showing form.");
          return; // Don't set any data, show the form
        }

        const data = await res.json();
        setStudentData(data);
        setPreAssessmentStatus(data.preAssessmentCompleted ? "completed" : "not_completed"); // ✅ Fix
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [user]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/saveStudentData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, email: user?.primaryEmailAddress?.emailAddress }),
      });

      if (res.ok) {
        const savedData = await res.json();
        setStudentData(savedData); // ✅ Now student exists
        setPreAssessmentStatus(savedData.preAssessmentCompleted ? "completed" : "not_completed"); // ✅ Fetch status after saving
      }
    } catch (error) {
      console.error("Error saving student data:", error);
    }

    setIsSubmitting(false);
  };

  const handleProceed = () => {
    if (preAssessmentStatus === "completed") {
      router.push("/modules/student"); // Redirect to Modules
    } else {
      router.push("/dashboard/assessment"); // Redirect to Pre-Assessment
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-300 to-purple-400 text-white p-8">
      <main className="relative z-10 flex flex-col items-center justify-center p-10 bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 text-center w-[95%] max-w-2xl">
        {/* ✅ If studentData doesn't exist, show the form */}
        {!studentData ? (
          <form onSubmit={handleFormSubmit} className="space-y-6 w-full">
            <h1 className="text-4xl font-extrabold text-purple-700 mb-4">📝 Student Profile</h1>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                placeholder="Full Name"
                className="w-full p-3 rounded-lg border text-gray-800 shadow-md"
              />
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleFormChange}
                required
                placeholder="Age"
                className="w-full p-3 rounded-lg border text-gray-800 shadow-md"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                required
                placeholder="Address"
                className="w-full p-3 rounded-lg border text-gray-800 shadow-md"
              />
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleFormChange}
                required
                placeholder="Mobile Number"
                className="w-full p-3 rounded-lg border text-gray-800 shadow-md"
              />
              <input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleFormChange}
                required
                placeholder="Blood Group"
                className="w-full p-3 rounded-lg border text-gray-800 shadow-md"
              />
            </div>

            {/* Hidden Skill Fields */}
            <div className="bg-[#EDE7F6] p-4 rounded-lg shadow-md border-2 border-purple-300 mt-4">
              <h2 className="text-xl font-bold text-purple-800 mb-2">🛠 Skill Levels</h2>

              <label className="block text-sm font-medium text-purple-700">Motor Skills:</label>
              <select
                name="motorSkills"
                value={formData.motorSkills}
                onChange={handleFormChange}
                required
                className="w-full p-3 rounded-lg border text-gray-800 shadow-md bg-white"
              >
                <option value="">Select Level</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Needs Improvement">Needs Improvement</option>
              </select>

              <label className="block text-sm font-medium text-purple-700 mt-3">Communication Skills:</label>
              <select
                name="communicationSkills"
                value={formData.communicationSkills}
                onChange={handleFormChange}
                required
                className="w-full p-3 rounded-lg border text-gray-800 shadow-md bg-white"
              >
                <option value="">Select Level</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Needs Improvement">Needs Improvement</option>
              </select>

              <label className="block text-sm font-medium text-purple-700 mt-3">Social Skills:</label>
              <select
                name="socialSkills"
                value={formData.socialSkills}
                onChange={handleFormChange}
                required
                className="w-full p-3 rounded-lg border text-gray-800 shadow-md bg-white"
              >
                <option value="">Select Level</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Needs Improvement">Needs Improvement</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-300 w-full"
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
          ) : (
            <>
              <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700">
                Welcome, {studentData.name}!
              </h1>
  
              <div className="bg-white text-gray-900 p-6 rounded-xl w-full text-left mt-6 shadow-lg border-2 border-gray-300">
                <h2 className="text-2xl font-bold text-indigo-600 mb-3">📌 Profile Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                  <p><strong>👤 Name:</strong> {studentData.name}</p>
                  <p><strong>🎂 Age:</strong> {studentData.age}</p>
                  <p><strong>🏡 Address:</strong> {studentData.address}</p>
                  <p><strong>📞 Mobile:</strong> {studentData.mobile}</p>
                  <p><strong>🩸 Blood Group:</strong> {studentData.bloodGroup}</p>
                </div>
              </div>

            {/* Dynamic Status Message */}
            <div className={`mt-6 p-4 rounded-xl shadow-md w-full text-lg font-medium text-white text-center border-2 
              ${preAssessmentStatus === 'completed' ? 'bg-green-600 border-green-400' : 'bg-red-500 border-red-400'}`}>
              {preAssessmentStatus === "completed" ? (
                <p>✅ <strong>You have successfully completed the Pre-Assessment.</strong> <br /> Proceed to explore the learning modules.</p>
              ) : (
                <p>⚠️ <strong>Please complete the Pre-Assessment first.</strong> <br /> You need to complete it to unlock the modules.</p>
              )}
            </div>

            {/* Dynamic Button */}
            <button
              className={`px-8 py-3 rounded-xl shadow-lg transition-transform duration-300 mt-6 w-full text-white text-lg font-semibold
                ${preAssessmentStatus === "completed" ? "bg-blue-600 hover:bg-blue-700 hover:scale-105" : "bg-orange-500 hover:bg-orange-600 hover:scale-105"}`}
              onClick={handleProceed}
            >
              {preAssessmentStatus === "completed" ? "📚 Proceed to Modules" : "🎯 Start Pre-Assessment"}
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default PreAssessment;
