// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";

// const TeacherModules = () => {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();
//   const [modules, setModules] = useState([]);
//   const [newModule, setNewModule] = useState({ name: "", description: "", video: null });
//   const [loading, setLoading] = useState(false);

//   // Redirect unauthorized users
//   useEffect(() => {
//     if (isLoaded && user?.publicMetadata?.role !== "teacher") {
//       router.replace("/dashboard/student");
//     }
//   }, [isLoaded, user, router]);

//   // Fetch modules
//   useEffect(() => {
//     const fetchModules = async () => {
//       try {
//         const response = await axios.get("/api/modules/getModules");
//         setModules(response.data.modules || []);
//       } catch (error) {
//         console.error("Error fetching modules:", error);
//         alert("Failed to load modules.");
//       }
//     };
//     if (isLoaded) fetchModules();
//   }, [isLoaded, user]);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     setNewModule({ ...newModule, [e.target.name]: e.target.value });
//   };

//   // Handle file upload
//   const handleFileChange = (e) => {
//     setNewModule({ ...newModule, video: e.target.files[0] });
//   };

//   // Submit new module
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!newModule.name || !newModule.description || !newModule.video) {
//       alert("Please fill all fields!");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Upload video to Cloudinary
//       const formData = new FormData();
//       formData.append("file", newModule.video);
//       formData.append("upload_preset", "module_videos");
//       formData.append("folder", "learning-modules");

//       const uploadRes = await axios.post(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
//         formData
//       );

//       const videoUrl = uploadRes.data.secure_url;

//       // Create module
//       await axios.post("/api/modules/createModule", {
//         name: newModule.name,
//         description: newModule.description,
//         videoUrl,
//       });

//       alert("Module added successfully!");
//       setNewModule({ name: "", description: "", video: null });
//       document.getElementById("moduleVideo").value = "";

//       // Refresh modules list
//       setModules((prevModules) => [{ name: newModule.name, description: newModule.description, videoUrl }, ...prevModules]);
//     } catch (error) {
//       console.error("Error adding module:", error);
//       alert("An error occurred while adding the module.");
//     }
//     setLoading(false);
//   };

//   // Delete module
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this module?")) return;

//     try {
//       await axios.delete(`/api/modules/deleteModule?id=${id}`);
//       setModules(modules.filter((mod) => mod._id !== id));
//       alert("Module deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting module:", error);
//       alert("Failed to delete module.");
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6">Manage Modules</h1>

//       <div className="bg-white shadow-md p-6 rounded-lg mb-6">
//         <h2 className="text-xl font-semibold mb-4">Create New Module</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="name" placeholder="Module Name" value={newModule.name} onChange={handleInputChange} className="border p-2 w-full mb-3" />
//           <textarea name="description" placeholder="Module Description" value={newModule.description} onChange={handleInputChange} className="border p-2 w-full mb-3" />
//           <label className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer inline-block mb-3">
//             Upload Video
//             <input id="moduleVideo" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
//           </label>
//           <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
//             {loading ? "Uploading..." : "Add Module"}
//           </button>
//         </form>
//       </div>

//       <div className="bg-white shadow-md p-6 rounded-lg">
//         <h2 className="text-xl font-semibold mb-4">All Modules</h2>
//         {modules.length === 0 ? (
//           <p>No modules found.</p>
//         ) : (
//           modules.map((mod) => (
//             <div key={mod._id} className="border-b p-4 flex justify-between items-center">
//               <div>
//                 <h3 className="text-lg font-semibold">{mod.name}</h3>
//                 <a href={mod.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
//                   Watch Video
//                 </a>
//               </div>
//               <button onClick={() => handleDelete(mod._id)} className="bg-red-500 text-white px-3 py-1 rounded-md">
//                 Delete
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherModules;

"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const TeacherModules = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ name: "", description: "", video: null });
  const [loading, setLoading] = useState(false);

  // Redirect unauthorized users
  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== "teacher") {
      router.replace("/dashboard/student");
    }
  }, [isLoaded, user, router]);

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get("/api/modules/getModules");
        setModules(response.data.modules);
      } catch (error) {
        console.error("Error fetching modules:", error);
        alert("Failed to load modules. Please try again later.");
      }
    };
    fetchModules();
  }, []);

  // Handle input changes for module creation
  const handleInputChange = (e) => {
    setNewModule({ ...newModule, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setNewModule({ ...newModule, video: e.target.files[0] });
  };

  // Submit new module
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newModule.name || !newModule.description || !newModule.video) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      // Upload video to Cloudinary
      const formData = new FormData();
      formData.append("file", newModule.video);
      formData.append("upload_preset", "module_videos");
      formData.append("folder", "learning-modules");

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        formData
      );

      const videoUrl = uploadRes.data.secure_url;

      // Save module data to MongoDB
      const response = await axios.post("/api/modules/createModule", {
        name: newModule.name,
        description: newModule.description,
        videoUrl,
      });

      // Prepend new module to list
      setModules([response.data.module, ...modules]);

      alert("Module added successfully!");
      setNewModule({ name: "", description: "", video: null });

      // Reset file input
      document.getElementById("moduleVideo").value = "";
    } catch (error) {
      console.error("Error adding module:", error);
      alert("An error occurred while adding the module. Please try again.");
    }
    setLoading(false);
  };

  // Delete module
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      const response = await axios.delete(`/api/modules/deleteModule?id=${id}`);
      if (response.status === 200) {
        setModules(modules.filter((mod) => mod._id !== id));
        alert("Module deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Modules</h1>

      {/* Module Creation Form */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Module</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Module Name"
            value={newModule.name}
            onChange={handleInputChange}
            className="border p-2 w-full mb-3"
          />
          <textarea
            name="description"
            placeholder="Module Description"
            value={newModule.description}
            onChange={handleInputChange}
            className="border p-2 w-full mb-3"
          />

          <label className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer inline-block mb-3">
            Upload Video
            <input id="moduleVideo" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
          </label>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            {loading ? "Uploading..." : "Add Module"}
          </button>
        </form>
      </div>

      {/* Modules List */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">All Modules</h2>
        {modules.length === 0 ? (
          <p>No modules found.</p>
        ) : (
          modules.map((mod) => (
            <div key={mod._id} className="border-b p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{mod.name}</h3>
                <a href={mod.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Watch Video
                </a>
              </div>
              <button
                onClick={() => handleDelete(mod._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherModules;
