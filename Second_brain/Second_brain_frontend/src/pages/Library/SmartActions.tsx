// import {
//     FiPlus,
//     FiSearch,
//     FiStar,
//     FiClock,
//   } from "react-icons/fi";
  
//    function SmartActions ()  {
//     const actions = [
//       {
//         label: "Add Note",
//         icon: FiPlus,
//       },
//       {
//         label: "Search Online",
//         icon: FiSearch,
//       },
//       {
//         label: "Favorites",
//         icon: FiStar,
//       },
//       {
//         label: "Recently Added",
//         icon: FiClock,
//       },
//     ];
  
//     return (
//       <div className="mt-8">
  
//         <h2 className="text-lg font-semibold">
//           Quick Actions
//         </h2>
  
//         <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
  
//           {actions.map((action) => {
//             const Icon = action.icon;
  
//             return (
//               <button
//                 key={action.label}
//                 type="button"
//                 className="
//                   flex items-center gap-3
//                   rounded-xl
//                   border border-zinc-800
//                   bg-zinc-900
//                   px-4 py-3
//                   text-left
//                   text-sm text-zinc-400
//                   transition
//                   hover:border-zinc-700
//                   hover:bg-zinc-900
//                   hover:text-white
//                 "
//               >
//                 <Icon
//                   size={17}
//                   className="text-amber-400"
//                 />
  
//                 {action.label}
//               </button>
//             );
//           })}
  
//         </div>
//       </div>
//     );
//   };
  
//   export default SmartActions;