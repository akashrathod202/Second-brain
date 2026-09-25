import {
    FaArrowRight,
    FaPlus,
    FaWandMagicSparkles,
  } from "react-icons/fa6";
  import { useNavigate } from "react-router-dom";

  // import { useState } from "react";
  // import CreateContentModal from "../../Components/Content/CreateContentModal";
  
  const HomeHero = () => {
     const navigate=useNavigate()
    // const[isCreateOpen,setIsCreateOpen]=useState(false)
    return (
      <section
        className="
          group relative mt-7 overflow-hidden rounded-2xl
          border border-zinc-800 bg-zinc-900/50
        "
      >
        {/* Animated glow */}
        <div
          className="
            pointer-events-none absolute -right-20 -top-32
            h-80 w-80 animate-pulse rounded-full
            bg-amber-400/10 blur-3xl
          "
        />
  
        <div
          className="
            pointer-events-none absolute -bottom-32 right-40
            h-64 w-64 rounded-full
            bg-purple-500/5 blur-3xl
          "
        />
  
        {/* Decorative grid */}
        <div
          className="
            pointer-events-none absolute inset-0 opacity-[0.025]
            [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
            [background-size:40px_40px]
          "
        />
  
        <div className="relative flex min-h-[300px] items-center">
          {/* Content */}
          <div className="max-w-2xl px-7 py-10 md:px-10">
            {/* Badge */}
            <div
              className="
                inline-flex items-center gap-2 rounded-full
                border border-amber-400/20 bg-amber-400/5
                px-3 py-1.5 text-[11px] font-medium
                text-amber-400
              "
            >
              <FaWandMagicSparkles size={11} />
              <span>AI KNOWLEDGE WORKSPACE</span>
            </div>
  
            {/* Heading */}
            <h2
              className="
                mt-5 text-3xl font-semibold leading-tight
                tracking-tight md:text-4xl
              "
            >
              Turn everything you learn
              <br />
  
              <span
                className="
                  bg-gradient-to-r from-white
                  via-zinc-300 to-amber-400
                  bg-clip-text text-transparent
                "
              >
                into your second brain.
              </span>
            </h2>
  
            {/* Description */}
            <p
              className="
                mt-4 max-w-lg text-sm
                leading-6 text-zinc-500
              "
            >
              Save your notes, links and videos. Organize your
              knowledge and let AI help you connect the dots.
            </p>
  
            {/* Actions */}
            <div className="mt-7 flex flex-wrap gap-3">
              {/* Ask SecondBrain */}
              <button  onClick={()=>{
                navigate('/Ask')
               alert("👋 Hey! The page is coming soon 🚀✨");
              }}
                type="button"
                className="
                  group/ai inline-flex items-center gap-2.5
                  rounded-xl bg-amber-400 px-4 py-2.5
                  text-sm font-semibold text-black
                  shadow-[0_0_25px_rgba(251,191,36,0.12)]
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-amber-300
                  hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]
                  active:translate-y-0
                "
              >
                <FaWandMagicSparkles size={13} />
  
                <span>Ask SecondBrain</span>
  
                <FaArrowRight
                  size={11}
                  className="
                    transition-transform duration-200
                    group-hover/ai:translate-x-1
                  "
                />
              </button>
  
              {/* Create */}
              <button onClick={()=>{
                navigate("/create")
                
                
                // setIsCreateOpen(true)
               alert("👋 Hey! The page is coming soon 🚀✨");
              }
                
              }
                type="button"
                className="
                  group/create inline-flex items-center gap-2.5
                  rounded-xl border border-zinc-700
                  bg-zinc-900/80 px-4 py-2.5
                  text-sm font-medium text-zinc-300
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:border-zinc-600
                  hover:bg-zinc-800
                  hover:text-white
                  active:translate-y-0
                "
              >
                <FaPlus
                  size={12}
                  className="
                    text-zinc-500
                    transition-colors duration-200
                    group-hover/create:text-amber-400
                  "
                />
  
                <span>Create</span>
              </button>
                

                {/* <CreateContentModal

                

                  /> */}
                  
                {/* // isOpen={isCreateOpen}
                // onClose={()=>setIsCreateOpen(false) }
                 */}

               

            </div>
          </div>
  
          {/* Right AI visual */}
          <div
            className="
              pointer-events-none absolute right-10 top-1/2
              hidden -translate-y-1/2 lg:block
            "
          >
            <div
              className="
                relative flex h-52 w-52
                items-center justify-center
              "
            >
              {/* Outer ring */}
              <div
                className="
                  absolute inset-3 animate-[spin_18s_linear_infinite]
                  rounded-full border border-dashed
                  border-amber-400/20
                "
              />
  
              {/* Middle ring */}
              <div
                className="
                  absolute inset-10
                  animate-[spin_12s_linear_infinite_reverse]
                  rounded-full border border-amber-400/20
                "
              />
  
              {/* Core */}
              <div
                className="
                  flex h-24 w-24 items-center justify-center
                  rounded-full border border-amber-400/30
                  bg-amber-400/10 text-4xl
                  shadow-[0_0_60px_rgba(251,191,36,0.15)]
                "
              >
                🧠
              </div>
  
              {/* Amber floating dot */}
              <span
                className="
                  absolute right-2 top-12 h-2 w-2
                  animate-pulse rounded-full bg-amber-400
                  shadow-[0_0_12px_rgba(251,191,36,0.8)]
                "
              />
  
              {/* Purple floating dot */}
              <span
                className="
                  absolute bottom-10 left-6 h-1.5 w-1.5
                  animate-pulse rounded-full bg-purple-400
                "
              />
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default HomeHero;