import NoteCard from "./NoteCard";

const notes = [
  {
    title: "Google Authentication with React",
    preview:
      "OAuth allows users to authenticate through an external provider without sharing their password with our application.",
    category: "Development",
    tags: ["React", "OAuth", "Backend"],
    updated: "2 min ago",
    favorite: true,
  },
  {
    title: "System Design Fundamentals",
    preview:
      "Important concepts around scalability, load balancing, caching, databases and horizontal scaling.",
    category: "Learning",
    tags: ["SystemDesign", "Backend"],
    updated: "1 hour ago",
  },
  {
    title: "Prefix Sum + HashMap",
    preview:
      "Prefix sum can be combined with a hashmap to solve subarray sum problems efficiently.",
    category: "DSA",
    tags: ["Python", "DSA", "Arrays"],
    updated: "Yesterday",
    favorite: true,
  },
  {
    title: "AI Agent Project Ideas",
    preview:
      "Ideas for building useful AI agents that interact with APIs, databases, email and external services.",
    category: "AI",
    tags: ["AI", "Agents", "Projects"],
    updated: "Yesterday",
  },
  {
    title: "Things to Learn About Docker",
    preview:
      "Containers, images, Dockerfiles, volumes, networking and Docker Compose.",
    category: "Development",
    tags: ["Docker", "DevOps"],
    updated: "2 days ago",
  },
  {
    title: "SecondBrain Feature Ideas",
    preview:
      "AI summaries, semantic search, automatic tagging, related knowledge and intelligent recommendations.",
    category: "Ideas",
    tags: ["SecondBrain", "AI"],
    updated: "3 days ago",
    favorite: true,
  },
];

const NotesGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

      {notes.map((note) => (
        <NoteCard
          key={note.title}
          {...note}
        />
      ))}

    </div>
  );
};

export default NotesGrid;