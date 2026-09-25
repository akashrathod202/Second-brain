 


// import { useState } from "react";
// import {
//   FaArrowLeft,
//   FaBrain,
//   FaLink,
//   FaYoutube,
//   FaVideo,
//   FaFilePdf,
//   FaCode,
//   FaNoteSticky,
//   FaTag,
//   FaPlus,
//   FaXmark,
//   FaCheck,
//   FaCircleExclamation,
//   FaSpinner,
// } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";

// type ContentType =
//   | "link"
//   | "note"
//   | "youtube"
//   | "videos"
//   | "pdf"
//   | "code";

// const contentTypes = [
//   {
//     value: "link",
//     label: "Link",
//     description: "Save a useful website",
//     icon: FaLink,
//   },
//   {
//     value: "youtube",
//     label: "YouTube",
//     description: "Save a YouTube video",
//     icon: FaYoutube,
//   },
//   {
//     value: "videos",
//     label: "Video",
//     description: "Save a video",
//     icon: FaVideo,
//   },
//   {
//     value: "pdf",
//     label: "PDF",
//     description: "Save a document",
//     icon: FaFilePdf,
//   },
//   {
//     value: "note",
//     label: "Note",
//     description: "Save a quick note",
//     icon: FaNoteSticky,
//   },
//   {
//     value: "code",
//     label: "Code",
//     description: "Save useful code",
//     icon: FaCode,
//   },
// ];

// const initialFormData = {
//   title: "",
//   link: "",
//   type: "link" as ContentType,
//   tags: [] as string[],
// };

// const CreateContent = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState(initialFormData);
//   const [tagInput, setTagInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;

//     setError("");
//     setSuccess(false);

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleTypeChange = (type: ContentType) => {
//     setError("");
//     setSuccess(false);

//     setFormData((prev) => ({
//       ...prev,
//       type,
//     }));
//   };

//   const addTag = () => {
//     const tag = tagInput.trim();

//     if (!tag) return;

//     if (formData.tags.includes(tag)) {
//       setTagInput("");
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       tags: [...prev.tags, tag],
//     }));

//     setTagInput("");
//   };

//   const removeTag = (tagToRemove: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((tag) => tag !== tagToRemove),
//     }));
//   };

//   const handleTagKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       addTag();
//     }

//     if (e.key === "Backspace" && !tagInput && formData.tags.length) {
//       removeTag(formData.tags[formData.tags.length - 1]);
//     }
//   };

//   const resetForm = () => {
//     setFormData(initialFormData);
//     setTagInput("");
//   };

//   const handleSubmit = async (
//     e: React.FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault();

//     setError("");
//     setSuccess(false);

//     if (!formData.title.trim()) {
//       setError("Please enter a title.");
//       return;
//     }

//     if (!formData.link.trim()) {
//       setError("Please enter a link.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Your session has expired. Please login again.");
//         return;
//       }

//       const response = await fetch(
//         "http://localhost:8000/api/v1/content/createcontent",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             title: formData.title.trim(),
//             link: formData.link.trim(),
//             type: formData.type,
//             tags: formData.tags,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to create content"
//         );
//       }

//       // Reset everything after successful creation
//       resetForm();

//       // Show success UI
//       setSuccess(true);

//       // Automatically hide success message after a few seconds
//       setTimeout(() => {
//         setSuccess(false);
//       }, 3500);
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
//       {/* ================= BACKGROUND ================= */}

//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         {/* Grid */}
//         <div
//           className="
//             absolute inset-0 opacity-[0.025]
//             [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
//             [background-size:50px_50px]
//           "
//         />

//         {/* Amber glow */}
//         <div
//           className="
//             absolute -left-40 -top-40
//             h-[500px] w-[500px]
//             rounded-full
//             bg-amber-400/10
//             blur-[120px]
//           "
//         />

//         {/* Purple glow */}
//         <div
//           className="
//             absolute -bottom-40 -right-40
//             h-[500px] w-[500px]
//             rounded-full
//             bg-purple-500/10
//             blur-[120px]
//           "
//         />

//         {/* Brain network */}
//         <div className="absolute right-[-100px] top-1/2 hidden -translate-y-1/2 lg:block">
//           <div className="relative h-[500px] w-[500px]">
//             {/* Outer rings */}
//             <div
//               className="
//                 absolute inset-10
//                 animate-[spin_30s_linear_infinite]
//                 rounded-full border border-amber-400/10
//               "
//             />

//             <div
//               className="
//                 absolute inset-20
//                 animate-[spin_20s_linear_infinite_reverse]
//                 rounded-full border border-purple-400/10
//               "
//             />

//             <div
//               className="
//                 absolute inset-32
//                 rounded-full border border-amber-400/10
//               "
//             />

//             {/* Brain */}
//             <div
//               className="
//                 absolute left-1/2 top-1/2
//                 flex h-36 w-36
//                 -translate-x-1/2 -translate-y-1/2
//                 items-center justify-center
//                 rounded-full
//                 border border-amber-400/20
//                 bg-amber-400/5
//                 shadow-[0_0_100px_rgba(251,191,36,0.12)]
//               "
//             >
//               <FaBrain
//                 className="text-amber-400/60"
//                 size={58}
//               />
//             </div>

//             {/* Floating nodes */}
//             <span className="absolute right-20 top-24 h-2 w-2 animate-pulse rounded-full bg-amber-400" />

//             <span className="absolute bottom-24 left-20 h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />

//             <span className="absolute left-12 top-1/2 h-2 w-2 animate-pulse rounded-full bg-amber-300" />

//             <span className="absolute bottom-16 right-32 h-1.5 w-1.5 animate-pulse rounded-full bg-purple-300" />
//           </div>
//         </div>
//       </div>

//       {/* ================= CONTENT ================= */}

//       <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:px-10">
//         {/* ================= TOP BAR ================= */}

//         <div className="flex items-center justify-between">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             disabled={loading}
//             className="
//               group inline-flex items-center gap-2
//               rounded-xl border border-zinc-800
//               bg-zinc-900/60 px-4 py-2.5
//               text-sm text-zinc-400
//               transition-all duration-200
//               hover:border-zinc-700
//               hover:bg-zinc-800
//               hover:text-white
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//           >
//             <FaArrowLeft
//               size={12}
//               className="transition-transform group-hover:-translate-x-0.5"
//             />
//             Back
//           </button>

//           <div className="flex items-center gap-2 text-xs text-zinc-600">
//             <FaBrain className="text-amber-400/70" />
//             SecondBrain
//           </div>
//         </div>

//         {/* ================= HEADER ================= */}

//         <div className="mx-auto mt-12 max-w-3xl text-center md:mt-14">
//           <div
//             className="
//               mx-auto inline-flex items-center gap-2
//               rounded-full border border-amber-400/20
//               bg-amber-400/5
//               px-3 py-1.5
//               text-[11px] font-medium
//               tracking-wide
//               text-amber-400
//             "
//           >
//             <FaPlus size={10} />
//             CREATE KNOWLEDGE
//           </div>

//           <h1
//             className="
//               mt-5 text-3xl font-semibold
//               tracking-tight
//               sm:text-4xl
//               md:text-5xl
//             "
//           >
//             Add something to your{" "}
//             <span
//               className="
//                 bg-gradient-to-r
//                 from-white via-zinc-300 to-amber-400
//                 bg-clip-text text-transparent
//               "
//             >
//               second brain.
//             </span>
//           </h1>

//           <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500">
//             Capture something useful now. Organize it with tags
//             and make it easy to find later.
//           </p>
//         </div>

//         {/* ================= SUCCESS MESSAGE ================= */}

//         <div
//           className={`
//             mx-auto mt-6 max-w-3xl
//             overflow-hidden
//             transition-all duration-300
//             ${
//               success
//                 ? "max-h-40 opacity-100"
//                 : "pointer-events-none max-h-0 opacity-0"
//             }
//           `}
//         >
//           <div
//             className="
//               flex items-start gap-3
//               rounded-2xl
//               border border-emerald-400/20
//               bg-emerald-400/5
//               px-4 py-4
//               shadow-[0_0_40px_rgba(16,185,129,0.05)]
//             "
//           >
//             <div
//               className="
//                 flex h-9 w-9 shrink-0
//                 items-center justify-center
//                 rounded-full
//                 bg-emerald-400/10
//                 text-emerald-400
//               "
//             >
//               <FaCheck size={14} />
//             </div>

//             <div>
//               <p className="text-sm font-medium text-emerald-300">
//                 Knowledge saved successfully
//               </p>

//               <p className="mt-1 text-xs leading-5 text-emerald-400/60">
//                 Your content has been added to your Second Brain.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ================= FORM ================= */}

//         <form
//           onSubmit={handleSubmit}
//           className="mx-auto mt-8 max-w-3xl md:mt-10"
//         >
//           <div
//             className="
//               overflow-hidden
//               rounded-2xl
//               border border-zinc-800
//               bg-zinc-900/60
//               shadow-2xl
//               backdrop-blur-xl
//               md:rounded-3xl
//             "
//           >
//             {/* ================= TITLE ================= */}

//             <div className="border-b border-zinc-800 p-5 sm:p-6 md:p-8">
//               <label className="mb-3 block text-sm font-medium text-zinc-300">
//                 Title
//               </label>

//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 disabled={loading}
//                 autoFocus
//                 placeholder="e.g. React Server Components"
//                 className="
//                   w-full rounded-xl
//                   border border-zinc-800
//                   bg-zinc-950/70
//                   px-4 py-3.5
//                   text-sm text-white
//                   outline-none
//                   placeholder:text-zinc-700
//                   transition-all duration-200
//                   hover:border-zinc-700
//                   focus:border-amber-400/50
//                   focus:ring-4
//                   focus:ring-amber-400/5
//                   disabled:cursor-not-allowed
//                   disabled:opacity-60
//                 "
//               />
//             </div>

//             {/* ================= TYPE ================= */}

//             <div className="border-b border-zinc-800 p-5 sm:p-6 md:p-8">
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-zinc-300">
//                   Content Type
//                 </label>

//                 <p className="mt-1 text-xs text-zinc-600">
//                   What are you saving?
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
//                 {contentTypes.map((item) => {
//                   const Icon = item.icon;
//                   const selected = formData.type === item.value;

//                   return (
//                     <button
//                       key={item.value}
//                       type="button"
//                       disabled={loading}
//                       onClick={() =>
//                         handleTypeChange(
//                           item.value as ContentType
//                         )
//                       }
//                       className={`
//                         group rounded-xl border p-4
//                         text-left
//                         transition-all duration-200
//                         disabled:cursor-not-allowed
//                         disabled:opacity-60
//                         ${
//                           selected
//                             ? "border-amber-400/40 bg-amber-400/10 shadow-[0_0_25px_rgba(251,191,36,0.04)]"
//                             : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-800/50"
//                         }
//                       `}
//                     >
//                       <div
//                         className={`
//                           flex h-8 w-8 items-center justify-center
//                           rounded-lg
//                           transition-colors
//                           ${
//                             selected
//                               ? "bg-amber-400/10"
//                               : "bg-zinc-800/70 group-hover:bg-zinc-800"
//                           }
//                         `}
//                       >
//                         <Icon
//                           size={15}
//                           className={
//                             selected
//                               ? "text-amber-400"
//                               : "text-zinc-500 group-hover:text-zinc-300"
//                           }
//                         />
//                       </div>

//                       <p
//                         className={`
//                           mt-3 text-sm font-medium
//                           ${
//                             selected
//                               ? "text-white"
//                               : "text-zinc-300"
//                           }
//                         `}
//                       >
//                         {item.label}
//                       </p>

//                       <p className="mt-1 text-[11px] leading-4 text-zinc-600">
//                         {item.description}
//                       </p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* ================= LINK ================= */}

//             <div className="border-b border-zinc-800 p-5 sm:p-6 md:p-8">
//               <label className="mb-3 block text-sm font-medium text-zinc-300">
//                 Link
//               </label>

//               <div className="relative">
//                 <FaLink
//                   size={13}
//                   className="
//                     pointer-events-none
//                     absolute left-4 top-1/2
//                     -translate-y-1/2
//                     text-zinc-600
//                   "
//                 />

//                 <input
//                   type="url"
//                   name="link"
//                   value={formData.link}
//                   onChange={handleChange}
//                   disabled={loading}
//                   placeholder="https://..."
//                   className="
//                     w-full rounded-xl
//                     border border-zinc-800
//                     bg-zinc-950/70
//                     py-3.5 pl-10 pr-4
//                     text-sm text-white
//                     outline-none
//                     placeholder:text-zinc-700
//                     transition-all duration-200
//                     hover:border-zinc-700
//                     focus:border-amber-400/50
//                     focus:ring-4
//                     focus:ring-amber-400/5
//                     disabled:cursor-not-allowed
//                     disabled:opacity-60
//                   "
//                 />
//               </div>

//               <p className="mt-2 text-[11px] text-zinc-700">
//                 Paste the URL of the resource you want to remember.
//               </p>
//             </div>

//             {/* ================= TAGS ================= */}

//             <div className="p-5 sm:p-6 md:p-8">
//               <label className="mb-3 block text-sm font-medium text-zinc-300">
//                 Tags
//               </label>

//               <div
//                 className="
//                   flex min-h-12
//                   flex-wrap items-center gap-2
//                   rounded-xl
//                   border border-zinc-800
//                   bg-zinc-950/70
//                   p-2
//                   transition-all duration-200
//                   focus-within:border-amber-400/50
//                   focus-within:ring-4
//                   focus-within:ring-amber-400/5
//                 "
//               >
//                 {formData.tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="
//                       inline-flex items-center gap-1.5
//                       rounded-lg
//                       border border-amber-400/10
//                       bg-amber-400/10
//                       px-2.5 py-1.5
//                       text-xs text-amber-400
//                     "
//                   >
//                     <FaTag size={9} />

//                     {tag}

//                     <button
//                       type="button"
//                       disabled={loading}
//                       onClick={() => removeTag(tag)}
//                       className="
//                         ml-1
//                         text-amber-400/50
//                         transition-colors
//                         hover:text-amber-400
//                         disabled:opacity-40
//                       "
//                       aria-label={`Remove ${tag}`}
//                     >
//                       <FaXmark size={10} />
//                     </button>
//                   </span>
//                 ))}

//                 <input
//                   type="text"
//                   value={tagInput}
//                   disabled={loading}
//                   onChange={(e) => {
//                     setError("");
//                     setTagInput(e.target.value);
//                   }}
//                   onKeyDown={handleTagKeyDown}
//                   placeholder={
//                     formData.tags.length
//                       ? "Add another tag..."
//                       : "Type a tag and press Enter..."
//                   }
//                   className="
//                     min-w-[180px]
//                     flex-1
//                     bg-transparent
//                     px-2 py-1.5
//                     text-sm text-white
//                     outline-none
//                     placeholder:text-zinc-700
//                     disabled:cursor-not-allowed
//                     disabled:opacity-50
//                   "
//                 />
//               </div>

//               <div className="mt-2 flex items-center justify-between">
//                 <p className="text-xs text-zinc-600">
//                   Press Enter after each tag.
//                 </p>

//                 {formData.tags.length > 0 && (
//                   <p className="text-[11px] text-zinc-700">
//                     {formData.tags.length}{" "}
//                     {formData.tags.length === 1
//                       ? "tag"
//                       : "tags"}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* ================= ERROR ================= */}

//             <div
//               className={`
//                 overflow-hidden
//                 transition-all duration-200
//                 ${
//                   error
//                     ? "max-h-32 px-5 pb-5 opacity-100 sm:px-6 md:px-8"
//                     : "max-h-0 opacity-0"
//                 }
//               `}
//             >
//               <div
//                 className="
//                   flex items-start gap-3
//                   rounded-xl
//                   border border-red-500/20
//                   bg-red-500/5
//                   px-4 py-3
//                   text-sm text-red-400
//                 "
//               >
//                 <FaCircleExclamation
//                   className="mt-0.5 shrink-0"
//                   size={14}
//                 />

//                 <span>{error}</span>
//               </div>
//             </div>

//             {/* ================= FOOTER ================= */}

//             <div
//               className="
//                 flex flex-col gap-4
//                 border-t border-zinc-800
//                 bg-zinc-950/30
//                 p-5
//                 sm:flex-row
//                 sm:items-center
//                 sm:justify-between
//                 sm:p-6
//                 md:px-8
//               "
//             >
//               <div className="hidden items-center gap-2 text-xs text-zinc-600 sm:flex">
//                 <FaBrain size={12} />
//                 <span>Build your knowledge base</span>
//               </div>

//               <div className="ml-auto flex w-full gap-3 sm:w-auto">
//                 <button
//                   type="button"
//                   disabled={loading}
//                   onClick={() => navigate(-1)}
//                   className="
//                     flex-1
//                     rounded-xl
//                     border border-zinc-800
//                     px-5 py-2.5
//                     text-sm font-medium
//                     text-zinc-400
//                     transition-all duration-200
//                     hover:border-zinc-700
//                     hover:bg-zinc-800
//                     hover:text-white
//                     disabled:cursor-not-allowed
//                     disabled:opacity-50
//                     sm:flex-none
//                   "
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`
//                     inline-flex
//                     flex-1
//                     items-center
//                     justify-center
//                     gap-2
//                     rounded-xl
//                     px-5 py-2.5
//                     text-sm font-semibold
//                     transition-all duration-200
//                     disabled:cursor-not-allowed
//                     disabled:opacity-70
//                     sm:flex-none
//                     ${
//                       success
//                         ? "bg-emerald-400 text-black shadow-[0_0_25px_rgba(52,211,153,0.12)]"
//                         : "bg-amber-400 text-black hover:bg-amber-300 hover:shadow-[0_0_25px_rgba(251,191,36,0.12)]"
//                     }
//                   `}
//                 >
//                   {loading ? (
//                     <>
//                       <FaSpinner
//                         size={12}
//                         className="animate-spin"
//                       />
//                       Creating...
//                     </>
//                   ) : success ? (
//                     <>
//                       <FaCheck size={12} />
//                       Saved Successfully
//                     </>
//                   ) : (
//                     <>
//                       <FaPlus size={11} />
//                       Create Content
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Bottom hint */}
//           <p className="mt-5 text-center text-[11px] text-zinc-700">
//             Your knowledge is yours. Capture it, organize it,
//             remember it.
//           </p>
//         </form>
//       </div>
//     </main>
//   );
// };

// export default CreateContent;

import { useState } from "react";
import {
  FaArrowLeft,
  FaBrain,
  FaLink,
  FaYoutube,
  FaVideo,
  FaFilePdf,
  FaCode,
  FaNoteSticky,
  FaTag,
  FaPlus,
  FaXmark,
  FaCheck,
  FaCircleExclamation,
  FaSpinner,
  FaFolder,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

type ContentType =
  | "link"
  | "youtube"
  | "videos"
  | "pdf"
  | "note"
  | "code";

const contentTypes = [
  {
    value: "link" as ContentType,
    label: "Link",
    icon: FaLink,
  },
  {
    value: "youtube" as ContentType,
    label: "YouTube",
    icon: FaYoutube,
  },
  {
    value: "videos" as ContentType,
    label: "Video",
    icon: FaVideo,
  },
  {
    value: "pdf" as ContentType,
    label: "PDF",
    icon: FaFilePdf,
  },
  {
    value: "note" as ContentType,
    label: "Note",
    icon: FaNoteSticky,
  },
  {
    value: "code" as ContentType,
    label: "Code",
    icon: FaCode,
  },
];

const collections = [
  "Web Development",
  "DSA",
  "AI / GenAI",
  "DevOps",
  "Career",
  "Projects",
  "Personal",
];

const initialFormData = {
  title: "",
  content: "",
  type: "link" as ContentType,
  tags: [] as string[],
  collection: "Web Development",
  language: "JavaScript",
};

const CreateContent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedType = contentTypes.find(
    (item) => item.value === formData.type
  );

  const SelectedIcon = selectedType?.icon || FaLink;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setError("");
    setSuccess(false);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type: ContentType) => {
    setError("");
    setSuccess(false);

    setFormData((prev) => ({
      ...prev,
      type,
      content: "",
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (formData.tags.includes(tag)) {
      setTagInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }

    if (
      e.key === "Backspace" &&
      !tagInput &&
      formData.tags.length
    ) {
      removeTag(formData.tags[formData.tags.length - 1]);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setTagInput("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!formData.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!formData.content.trim()) {
      setError(
        formData.type === "note"
          ? "Please write something in your note."
          : "Please provide the required content."
      );
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/content/createcontent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            title: formData.title.trim(),
            link: formData.content.trim(),
            type: formData.type,
            tags: formData.tags,
            collection: formData.collection,
            language:
              formData.type === "code"
                ? formData.language
                : undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create content"
        );
      }

      resetForm();
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderContentInput = () => {
    switch (formData.type) {
      case "note":
        return (
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-300">
              Your Note
            </label>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              disabled={loading}
              rows={9}
              placeholder="Start writing your note..."
              className="
                w-full resize-none rounded-2xl
                border border-zinc-800
                bg-zinc-950/70
                px-4 py-4
                text-sm leading-6 text-white
                outline-none
                placeholder:text-zinc-700
                transition
                hover:border-zinc-700
                focus:border-amber-400/50
                focus:ring-4
                focus:ring-amber-400/5
              "
            />
          </div>
        );

      case "code":
        return (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                Code
              </label>

              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={loading}
                className="
                  rounded-lg
                  border border-zinc-800
                  bg-zinc-950
                  px-3 py-1.5
                  text-xs text-zinc-400
                  outline-none
                  focus:border-amber-400/40
                "
              >
                <option>JavaScript</option>
                <option>TypeScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>C++</option>
                <option>HTML</option>
                <option>CSS</option>
                <option>SQL</option>
                <option>JSON</option>
              </select>
            </div>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              disabled={loading}
              rows={10}
              placeholder="// Paste your useful code here..."
              className="
                w-full resize-none rounded-2xl
                border border-zinc-800
                bg-[#050505]
                px-4 py-4
                font-mono text-sm leading-6 text-zinc-300
                outline-none
                placeholder:text-zinc-800
                focus:border-amber-400/40
                focus:ring-4
                focus:ring-amber-400/5
              "
            />
          </div>
        );

      case "pdf":
        return (
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-300">
              PDF Resource
            </label>

            <div className="
              flex min-h-[190px]
              cursor-pointer flex-col
              items-center justify-center
              rounded-2xl
              border border-dashed border-zinc-700
              bg-zinc-950/50
              px-6
              text-center
              transition
              hover:border-amber-400/40
              hover:bg-amber-400/[0.02]
            ">
              <div className="
                flex h-12 w-12
                items-center justify-center
                rounded-xl
                bg-red-400/10
                text-red-400
              ">
                <FaFilePdf size={20} />
              </div>

              <p className="mt-4 text-sm font-medium text-zinc-300">
                Drop your PDF here
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                or click to browse
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="mb-3 block text-sm font-medium text-zinc-300">
              {formData.type === "youtube"
                ? "YouTube URL"
                : formData.type === "videos"
                ? "Video URL"
                : "Resource URL"}
            </label>

            <div className="relative">
              <SelectedIcon
                size={14}
                className="
                  pointer-events-none
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-zinc-600
                "
              />

              <input
                type="url"
                name="content"
                value={formData.content}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://..."
                className="
                  w-full rounded-2xl
                  border border-zinc-800
                  bg-zinc-950/70
                  py-4 pl-11 pr-4
                  text-sm text-white
                  outline-none
                  placeholder:text-zinc-700
                  transition
                  hover:border-zinc-700
                  focus:border-amber-400/50
                  focus:ring-4
                  focus:ring-amber-400/5
                "
              />
            </div>

            <p className="mt-2 text-[11px] text-zinc-600">
              Paste the URL of the resource you want to remember.
            </p>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="
            absolute inset-0 opacity-[0.025]
            [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
            [background-size:50px_50px]
          "
        />

        <div
          className="
            absolute -left-40 -top-40
            h-[450px] w-[450px]
            rounded-full
            bg-amber-400/10
            blur-[130px]
          "
        />

        <div
          className="
            absolute -bottom-40 -right-40
            h-[450px] w-[450px]
            rounded-full
            bg-purple-500/10
            blur-[130px]
          "
        />
      </div>

      <div className="
        relative mx-auto
        max-w-7xl
        px-4 py-6
        sm:px-6
        lg:px-8
      ">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="
              group flex items-center gap-2
              rounded-xl
              border border-zinc-800
              bg-zinc-900/60
              px-4 py-2.5
              text-sm text-zinc-400
              transition
              hover:border-zinc-700
              hover:bg-zinc-800
              hover:text-white
            "
          >
            <FaArrowLeft
              size={12}
              className="
                transition-transform
                group-hover:-translate-x-1
              "
            />
            Back
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <FaBrain className="text-amber-400/70" />
            SecondBrain
          </div>
        </div>

        {/* Header */}
        <div className="
          mx-auto mt-12
          max-w-2xl
          text-center
          md:mt-16
        ">
          <div className="
            mx-auto inline-flex
            items-center gap-2
            rounded-full
            border border-amber-400/20
            bg-amber-400/5
            px-3 py-1.5
            text-[11px]
            font-medium
            tracking-wide
            text-amber-400
          ">
            <FaPlus size={9} />
            CREATE KNOWLEDGE
          </div>

          <h1 className="
            mt-5
            text-3xl font-semibold
            tracking-tight
            sm:text-4xl
          ">
            Capture something useful{" "}
            <span className="
              bg-gradient-to-r
              from-white
              via-zinc-300
              to-amber-400
              bg-clip-text
              text-transparent
            ">
              for later.
            </span>
          </h1>

          <p className="
            mx-auto mt-4
            max-w-lg
            text-sm leading-6
            text-zinc-500
          ">
            Save knowledge, organize it with tags,
            and make it easy to find when you need it.
          </p>
        </div>

        {/* Success */}
        {success && (
          <div className="
            mx-auto mt-7
            max-w-5xl
            rounded-2xl
            border border-emerald-400/20
            bg-emerald-400/5
            px-5 py-4
          ">
            <div className="flex items-center gap-3">
              <div className="
                flex h-9 w-9
                items-center justify-center
                rounded-full
                bg-emerald-400/10
                text-emerald-400
              ">
                <FaCheck size={14} />
              </div>

              <div>
                <p className="
                  text-sm font-medium
                  text-emerald-300
                ">
                  Saved to your Second Brain
                </p>

                <p className="
                  mt-0.5
                  text-xs
                  text-emerald-400/60
                ">
                  Your knowledge has been captured successfully.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main */}
        <form
          onSubmit={handleSubmit}
          className="
            mx-auto mt-8
            max-w-5xl
          "
        >
          <div className="
            overflow-hidden
            rounded-3xl
            border border-zinc-800
            bg-zinc-900/60
            shadow-2xl
            backdrop-blur-xl
          ">
            <div className="
              grid
              lg:grid-cols-[1fr_340px]
            ">
              {/* LEFT */}
              <div className="
                border-b
                border-zinc-800
                p-5
                sm:p-7
                lg:border-b-0
                lg:border-r
                lg:p-8
              ">
                <div className="mb-7">
                  <p className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-amber-400
                  ">
                    Create
                  </p>

                  <h2 className="
                    mt-2
                    text-xl
                    font-semibold
                    text-white
                  ">
                    Create Content
                  </h2>
                </div>

                {/* Title */}
                <div>
                  <label className="
                    mb-3 block
                    text-sm font-medium
                    text-zinc-300
                  ">
                    Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={loading}
                    autoFocus
                    placeholder="What do you want to remember?"
                    className="
                      w-full
                      rounded-2xl
                      border border-zinc-800
                      bg-zinc-950/70
                      px-4 py-4
                      text-sm text-white
                      outline-none
                      placeholder:text-zinc-700
                      transition
                      hover:border-zinc-700
                      focus:border-amber-400/50
                      focus:ring-4
                      focus:ring-amber-400/5
                    "
                  />
                </div>

                {/* Dynamic Content */}
                <div className="mt-7">
                  {renderContentInput()}
                </div>

                {/* Tags */}
                <div className="mt-7">
                  <label className="
                    mb-3 block
                    text-sm font-medium
                    text-zinc-300
                  ">
                    Tags
                  </label>

                  <div className="
                    flex min-h-12
                    flex-wrap
                    items-center
                    gap-2
                    rounded-2xl
                    border border-zinc-800
                    bg-zinc-950/70
                    p-2
                    transition
                    focus-within:border-amber-400/50
                  ">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-lg
                          border border-amber-400/10
                          bg-amber-400/10
                          px-2.5 py-1.5
                          text-xs
                          text-amber-400
                        "
                      >
                        <FaTag size={9} />

                        {tag}

                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          disabled={loading}
                          className="
                            ml-1
                            text-amber-400/50
                            hover:text-amber-400
                          "
                        >
                          <FaXmark size={10} />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setError("");
                      }}
                      onKeyDown={handleTagKeyDown}
                      disabled={loading}
                      placeholder={
                        formData.tags.length
                          ? "Add another tag..."
                          : "Add a tag and press Enter..."
                      }
                      className="
                        min-w-[180px]
                        flex-1
                        bg-transparent
                        px-2 py-1.5
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-zinc-700
                      "
                    />
                  </div>
                </div>

                {/* Description */}
                {formData.type !== "note" &&
                  formData.type !== "code" && (
                    <div className="mt-7">
                      <label className="
                        mb-3 block
                        text-sm font-medium
                        text-zinc-300
                      ">
                        Description
                        <span className="
                          ml-2
                          text-xs
                          text-zinc-700
                        ">
                          Optional
                        </span>
                      </label>

                      <textarea
                        name="description"
                        rows={4}
                        disabled={loading}
                        placeholder="Add a short note about why this is useful..."
                        className="
                          w-full resize-none
                          rounded-2xl
                          border border-zinc-800
                          bg-zinc-950/70
                          px-4 py-3.5
                          text-sm
                          text-white
                          outline-none
                          placeholder:text-zinc-700
                          focus:border-amber-400/50
                        "
                      />
                    </div>
                  )}
              </div>

              {/* RIGHT */}
              <aside className="p-5 sm:p-7 lg:p-8">
                <p className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-amber-400
                ">
                  Organize
                </p>

                <h2 className="
                  mt-2
                  text-xl
                  font-semibold
                  text-white
                ">
                  Make it easy to find
                </h2>

                {/* Content Type */}
                <div className="mt-7">
                  <label className="
                    mb-3 block
                    text-sm font-medium
                    text-zinc-300
                  ">
                    Content Type
                  </label>

                  <div className="
                    grid
                    grid-cols-2
                    gap-2
                  ">
                    {contentTypes.map((item) => {
                      const Icon = item.icon;
                      const selected =
                        formData.type === item.value;

                      return (
                        <button
                          key={item.value}
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            handleTypeChange(item.value)
                          }
                          className={`
                            flex
                            items-center
                            gap-2.5
                            rounded-xl
                            border
                            px-3
                            py-3
                            text-left
                            transition
                            ${
                              selected
                                ? `
                                  border-amber-400/40
                                  bg-amber-400/10
                                  text-white
                                `
                                : `
                                  border-zinc-800
                                  bg-zinc-950/40
                                  text-zinc-500
                                  hover:border-zinc-700
                                  hover:text-zinc-300
                                `
                            }
                          `}
                        >
                          <Icon
                            size={14}
                            className={
                              selected
                                ? "text-amber-400"
                                : "text-zinc-600"
                            }
                          />

                          <span className="text-xs font-medium">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Collection */}
                <div className="mt-7">
                  <label className="
                    mb-3 block
                    text-sm font-medium
                    text-zinc-300
                  ">
                    Collection
                  </label>

                  <div className="relative">
                    <FaFolder
                      size={13}
                      className="
                        pointer-events-none
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-zinc-600
                      "
                    />

                    <select
                      name="collection"
                      value={formData.collection}
                      onChange={handleChange}
                      disabled={loading}
                      className="
                        w-full appearance-none
                        rounded-xl
                        border border-zinc-800
                        bg-zinc-950/70
                        py-3.5 pl-10 pr-4
                        text-sm
                        text-zinc-300
                        outline-none
                        focus:border-amber-400/50
                      "
                    >
                      {collections.map((collection) => (
                        <option
                          key={collection}
                          value={collection}
                        >
                          {collection}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="
                      mt-3
                      text-xs
                      text-zinc-600
                      transition
                      hover:text-amber-400
                    "
                  >
                    + Create new collection
                  </button>
                </div>

                {/* Preview */}
                <div className="mt-8">
                  <div className="
                    mb-3
                    flex
                    items-center
                    justify-between
                  ">
                    <label className="
                      text-sm
                      font-medium
                      text-zinc-300
                    ">
                      Preview
                    </label>

                    <span className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      text-zinc-700
                    ">
                      Live
                    </span>
                  </div>

                  <div className="
                    rounded-2xl
                    border border-zinc-800
                    bg-zinc-950/70
                    p-4
                  ">
                    <div className="flex items-start gap-3">
                      <div className="
                        flex h-9 w-9
                        shrink-0
                        items-center justify-center
                        rounded-lg
                        bg-amber-400/10
                        text-amber-400
                      ">
                        <SelectedIcon size={14} />
                      </div>

                      <div className="min-w-0">
                        <p className="
                          truncate
                          text-sm
                          font-medium
                          text-zinc-200
                        ">
                          {formData.title ||
                            "Your content title"}
                        </p>

                        <p className="
                          mt-1
                          text-[11px]
                          text-zinc-600
                        ">
                          {formData.collection}
                        </p>
                      </div>
                    </div>

                    {formData.content && (
                      <p className="
                        mt-4
                        line-clamp-3
                        break-all
                        text-xs
                        leading-5
                        text-zinc-600
                      ">
                        {formData.content}
                      </p>
                    )}

                    {formData.tags.length > 0 && (
                      <div className="
                        mt-4
                        flex
                        flex-wrap
                        gap-1.5
                      ">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="
                              rounded-md
                              bg-zinc-800
                              px-2 py-1
                              text-[10px]
                              text-zinc-500
                            "
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tip */}
                <div className="
                  mt-6
                  rounded-xl
                  border border-zinc-800
                  bg-zinc-950/40
                  p-4
                ">
                  <p className="
                    text-xs
                    font-medium
                    text-zinc-400
                  ">
                    💡 Quick tip
                  </p>

                  <p className="
                    mt-1.5
                    text-[11px]
                    leading-5
                    text-zinc-600
                  ">
                    Use specific tags so you can quickly
                    find this knowledge later.
                  </p>
                </div>
              </aside>
            </div>

            {/* Error */}
            {error && (
              <div className="
                border-t border-zinc-800
                px-5 py-5
                sm:px-7
                lg:px-8
              ">
                <div className="
                  flex items-start gap-3
                  rounded-xl
                  border border-red-500/20
                  bg-red-500/5
                  px-4 py-3
                  text-sm
                  text-red-400
                ">
                  <FaCircleExclamation
                    className="mt-0.5 shrink-0"
                    size={14}
                  />

                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="
              flex
              flex-col
              gap-4
              border-t border-zinc-800
              bg-zinc-950/40
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-7
              lg:px-8
            ">
              <div className="
                flex
                items-center
                gap-2
                text-xs
                text-zinc-600
              ">
                <FaBrain size={12} />
                Capture it. Organize it. Remember it.
              </div>

              <div className="
                flex
                w-full
                gap-3
                sm:w-auto
              ">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => navigate(-1)}
                  className="
                    flex-1
                    rounded-xl
                    border border-zinc-800
                    px-5 py-3
                    text-sm
                    font-medium
                    text-zinc-400
                    transition
                    hover:border-zinc-700
                    hover:bg-zinc-800
                    hover:text-white
                    sm:flex-none
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex-1
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-amber-400
                    px-6 py-3
                    text-sm
                    font-semibold
                    text-black
                    transition
                    hover:bg-amber-300
                    hover:shadow-[0_0_30px_rgba(251,191,36,0.12)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:flex-none
                  "
                >
                  {loading ? (
                    <>
                      <FaSpinner
                        size={12}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : success ? (
                    <>
                      <FaCheck size={12} />
                      Saved
                    </>
                  ) : (
                    <>
                      <FaPlus size={11} />
                      Save to Second Brain
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="
            mt-5
            text-center
            text-[11px]
            text-zinc-700
          ">
            Your knowledge is yours. Capture it, organize it,
            remember it.
          </p>
        </form>
      </div>
    </main>
  );
};

export default CreateContent;