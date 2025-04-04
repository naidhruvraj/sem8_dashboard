// 'use client';

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Header from "@/app/dashboard/_components/Header"; 

// const gradients = [
//   "from-pink-100 to-pink-200",
//   "from-blue-100 to-blue-200",
//   "from-green-100 to-green-200",
//   "from-yellow-100 to-yellow-200",
//   "from-purple-100 to-purple-200",
//   "from-red-100 to-red-200",
//   "from-teal-100 to-teal-200",
// ];

// const TeacherAssessment = () => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedModule, setSelectedModule] = useState('');

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const res = await axios.get('/api/fetchStudentData');
//         setStudents(res.data.students || []);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching student data:', err);
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const allModules = Array.from(
//     new Set(
//       students.flatMap((student) =>
//         (student.postAssessmentResults || []).map((r) => r.moduleName)
//       )
//     )
//   );

//   const filteredStudents = students.filter((student) => {
//     const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesModule =
//       !selectedModule ||
//       (student.postAssessmentResults || []).some(
//         (r) => r.moduleName === selectedModule
//       );
//     return matchesSearch && matchesModule;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-lg font-semibold text-gray-700">Fetching student data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-300">
//       <div className="relative z-50 bg-white shadow-md">
//         <Header />
//       </div>

//       <div className="mt-20" />

//       <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
//         📊 Students' Assessment Results
//       </h1>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 justify-center mb-8 px-4">
//         <input
//           type="text"
//           placeholder="Search by student name..."
//           className="px-4 py-2 rounded-lg shadow-sm border border-gray-300 w-full md:w-1/3"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <select
//           value={selectedModule}
//           onChange={(e) => setSelectedModule(e.target.value)}
//           className="px-4 py-2 rounded-lg shadow-sm border border-gray-300 w-full md:w-1/3"
//         >
//           <option value="">🔄 No Filter</option>
//           {allModules.map((module, idx) => (
//             <option key={idx} value={module}>
//               {module}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="px-4 md:px-12 lg:px-24 pb-10">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {filteredStudents.map((student, idx) => {
//             const gradient = gradients[idx % gradients.length];
//             return (
//               <div
//                 key={idx}
//                 className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-lg border border-gray-200 transition-transform transform hover:scale-[1.02]`}
//               >
//                 <h2 className="text-2xl font-bold mb-4 text-indigo-800">
//                   {student.name}
//                 </h2>

//                 <div className="space-y-1 text-gray-800">
//                   <p><strong>Email:</strong> {student.email}</p>
//                   <p><strong>Age:</strong> {student.age}</p>
//                   <p><strong>Address:</strong> {student.address}</p>
//                   <p><strong>Mobile:</strong> {student.mobile}</p>
//                   <p><strong>Blood Group:</strong> {student.bloodGroup}</p>
//                   <p><strong>Motor Skills:</strong> {student.motorSkills}</p>
//                   <p><strong>Communication Skills:</strong> {student.communicationSkills}</p>
//                   <p><strong>Social Skills:</strong> {student.socialSkills}</p>
//                   <p><strong>Pre-Assessment Completed:</strong> {student.preAssessmentCompleted ? "✅ Yes" : "❌ No"}</p>
//                   <p><strong>Category:</strong> {student.category}</p>
//                 </div>

//                 {student.postAssessmentResults && student.postAssessmentResults.length > 0 ? (
//                   <div className="mt-4">
//                     <h3 className="text-xl font-semibold text-indigo-700 mb-2">
//                       Post-Assessment Scores:
//                     </h3>
//                     <ul className="space-y-2">
//                       {student.postAssessmentResults.map((result, i) => (
//                         <li
//                           key={i}
//                           className="bg-white/70 rounded-lg p-3 shadow-sm border border-gray-300"
//                         >
//                           <p><strong>Module:</strong> {result.moduleName}</p>
//                           <p><strong>Score:</strong> {result.score}</p>
//                           <p><strong>Date:</strong> {new Date(result.submittedAt).toLocaleString()}</p>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ) : (
//                   <p className="mt-4 text-red-600 font-medium">
//                     No post-assessment results available.
//                   </p>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherAssessment;
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "@/app/dashboard/_components/Header";
import * as XLSX from 'xlsx';

const TeacherAssessment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('/api/fetchStudentData');
        setStudents(res.data.students || []);
      } catch (err) {
        console.error('Error fetching student data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleExportExcel = () => {
    const data = [];

    students.forEach(s => {
      if (s.postAssessmentResults && s.postAssessmentResults.length > 0) {
        s.postAssessmentResults.forEach((result) => {
          data.push({
            Name: s.name,
            Email: s.email,
            Age: s.age,
            Address: s.address,
            Mobile: s.mobile,
            'Blood Group': s.bloodGroup,
            Category: s.category,
            'Motor Skills': s.motorSkills,
            'Communication Skills': s.communicationSkills,
            'Social Skills': s.socialSkills,
            'Pre-Assessment Completed': s.preAssessmentCompleted ? 'Yes' : 'No',
            'Module': result.moduleName,
            'Score': result.score,
            'Submitted At': new Date(result.submittedAt).toLocaleString()
          });
        });
      } else {
        data.push({
          Name: s.name,
          Email: s.email,
          Age: s.age,
          Address: s.address,
          Mobile: s.mobile,
          'Blood Group': s.bloodGroup,
          Category: s.category,
          'Motor Skills': s.motorSkills,
          'Communication Skills': s.communicationSkills,
          'Social Skills': s.socialSkills,
          'Pre-Assessment Completed': s.preAssessmentCompleted ? 'Yes' : 'No',
          'Module': 'N/A',
          'Score': 'N/A',
          'Submitted At': 'N/A'
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Results");
    XLSX.writeFile(wb, "Student_Assessment_Results.xlsx");
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedModule === '' || student.postAssessmentResults?.some(r => r.moduleName === selectedModule))
  );

  const allModules = Array.from(new Set(students.flatMap(s =>
    s.postAssessmentResults?.map(r => r.moduleName) || []
  )));

  const getCardBackground = (index) => {
    const options = ['bg-white', 'bg-gray-50', 'bg-gray-100'];
    return options[index % options.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Fetching student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-300 pb-10">
      <div className="relative z-50 bg-white shadow-md">
        <Header />
      </div>

      <div className="mt-20 px-4 md:px-12 lg:px-24">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">📊 Students' Assessment Results</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by student name..."
            className="p-3 rounded-xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="p-3 rounded-xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-1/3"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value="">No Filter</option>
            {allModules.map((mod, idx) => (
              <option key={idx} value={mod}>{mod}</option>
            ))}
          </select>

          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={handleExportExcel} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow">
              Export to Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {filteredStudents.map((student, idx) => (
            <div
              key={idx}
              onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
              className={`cursor-pointer transition-transform transform hover:scale-[1.01] p-6 rounded-xl shadow-xl border-4 ${
                expandedCard === idx
                  ? 'border-indigo-400'
                  : 'border-transparent hover:border-blue-300'
              } ${getCardBackground(idx)}`}
            >
              <h2 className="text-2xl font-bold mb-2 text-indigo-700">{student.name}</h2>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> {student.email}</p>
              <p className="text-gray-600"><strong>Category:</strong> {student.category}</p>

              {expandedCard === idx && (
                <>
                  <div className="mt-4 space-y-1 text-gray-800 text-sm">
                    <p><strong>Age:</strong> {student.age}</p>
                    <p><strong>Address:</strong> {student.address}</p>
                    <p><strong>Mobile:</strong> {student.mobile}</p>
                    <p><strong>Blood Group:</strong> {student.bloodGroup}</p>
                    <p><strong>Motor Skills:</strong> {student.motorSkills}</p>
                    <p><strong>Communication Skills:</strong> {student.communicationSkills}</p>
                    <p><strong>Social Skills:</strong> {student.socialSkills}</p>
                    <p><strong>Pre-Assessment Completed:</strong> {student.preAssessmentCompleted ? '✅ Yes' : '❌ No'}</p>
                  </div>

                  {student.postAssessmentResults?.length > 0 ? (
                    <div className="mt-4">
                      <h3 className="text-md font-semibold text-indigo-600 mb-2">Post-Assessment Scores:</h3>
                      <ul className="space-y-2">
                        {student.postAssessmentResults.map((result, i) => (
                          <li key={i} className="bg-white rounded-lg p-3 shadow-sm border border-gray-300">
                            <p><strong>Module:</strong> {result.moduleName}</p>
                            <p><strong>Score:</strong> {result.score}</p>
                            <p><strong>Date:</strong> {new Date(result.submittedAt).toLocaleString()}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-4 text-red-600 font-medium">No post-assessment results available.</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherAssessment;

