// import { useEffect, useState } from "react";
// import { getcontent } from "../services/contentService";
// import type { Content } from "../Types/content";
// import { ContentCard } from "../Components/Library/ContentCard";

// export const Library = () => {
//   const [contents, setContent] = useState<Content[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchContent = async () => {
//       try {
//         const data = await getcontent();

//         console.log("DATA FROM API:", data);

//         setContent(data);
//       } catch (error) {
//         console.log("Failed to fetch contents", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContent();
//   }, []);

//   // Loading UI
//   if (loading) {
//     return (
//       <div className="p-8">
//         <p className="text-slate-500">
//           Loading your knowledge...
//         </p>
//       </div>
//     );
//   }

//   // Main UI
//   return (
//     <div className="p-8">
//       {contents.length === 0 ? (
//         // No content
//         <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
//           <h2 className="text-lg font-semibold text-slate-900">
//             No content yet
//           </h2>

//           <p className="mt-2 text-sm text-slate-500">
//             Start adding knowledge to your Second Brain.
//           </p>
//         </div>
//       ) : (
//         // Content exists
//         <div className="grid grid-cols-3 gap-5">
//           {contents.map((content) => (
//             <ContentCard
//               key={content._id}
//               content={content}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };