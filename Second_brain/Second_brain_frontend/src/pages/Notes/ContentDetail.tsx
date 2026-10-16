
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiEdit2,
  FiRefreshCw,
  FiSave,
  FiTag,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

const API_URL = "http://localhost:8000/api/v1/content";

type Content = {
  _id: string;
  title: string;
  link: string;
  type: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  userId?: {
    _id: string;
    name: string;
  };
};

const ContentDetail = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit states
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ----------------------------------------
  // Fetch content
  // ----------------------------------------
  const fetchContent = async () => {
    if (!contentId) return;

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/getOneContent/${contentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch content"
        );
      }

      setContent(data.content);

      // Set edit fields
      setEditTitle(data.content.title || "");
      setEditContent(data.content.link || "");
    } catch (err) {
      console.error("FETCH CONTENT ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load content."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [contentId]);

  // ----------------------------------------
  // Update content
  // ----------------------------------------
  const handleUpdate = async () => {
    if (!contentId) return;

    if (!editTitle.trim()) {
      setError("Title cannot be empty.");
      return;
    }

    if (!editContent.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/updatecontent/${contentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            title: editTitle.trim(),
            link: editContent.trim(),
            tags: content?.tags || [],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update content"
        );
      }

      // Update UI with new content
      setContent(data.content);

      setEditTitle(data.content.title || "");
      setEditContent(data.content.link || "");

      setEditing(false);
    } catch (err) {
      console.error("UPDATE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update content."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // Delete content
  // ----------------------------------------
  const handleDelete = async () => {
    if (!contentId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this content?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      const response = await fetch(
       `${API_URL}/${contentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete content"
        );
      }

      // Go back to notes after successful deletion
      navigate("/notes");
    } catch (err) {
      console.error("DELETE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete content."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ----------------------------------------
  // Cancel editing
  // ----------------------------------------
  const handleCancelEdit = () => {
    if (!content) return;

    setEditTitle(content.title || "");
    setEditContent(content.link || "");

    setEditing(false);
    setError("");
  };

  // ----------------------------------------
  // Loading
  // ----------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <FiRefreshCw className="animate-spin" size={20} />
          Loading content...
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // Error / Content not found
  // ----------------------------------------
  if (!content) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate("/notes")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
          >
            <FiArrowLeft />
            Back to Notes
          </button>

          <div className="mt-10 rounded-xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="text-red-400">
              {error || "Content not found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // Main UI
  // ----------------------------------------
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate("/notes")}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8"
        >
          <FiArrowLeft size={18} />
          Back to Notes
        </button>

        {/* Main card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">

          {/* Header */}
          <div className="p-6 sm:p-8">

            {/* Type + Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-5">

              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                <FiBookOpen size={14} />
                {content.type}
              </span>

              {content.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400"
                >
                  <FiTag size={12} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            {editing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-2xl sm:text-3xl font-semibold text-white outline-none focus:border-amber-500"
              />
            ) : (
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                {content.title}
              </h1>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-5 mt-5 text-sm text-zinc-500">

              <div className="flex items-center gap-2">
                <FiCalendar size={15} />

                <span>
                  {new Date(
                    content.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {content.userId?.name && (
                <div className="flex items-center gap-2">
                  <FiUser size={15} />
                  <span>{content.userId.name}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-7">

              {!editing ? (
                <>
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditTitle(content.title || "");
                      setEditContent(content.link || "");
                      setEditing(true);
                      setError("");
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 size={16} />

                    {deleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </>
              ) : (
                <>
                  {/* Save */}
                  <button
                    onClick={handleUpdate}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSave size={16} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  {/* Cancel */}
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition disabled:opacity-50"
                  >
                    <FiX size={16} />
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-400">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Content */}
          <div className="p-6 sm:p-8">

            {editing ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Write your note..."
                rows={15}
                className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-base leading-7 text-zinc-200 outline-none focus:border-amber-500"
              />
            ) : (
              <article className="whitespace-pre-wrap text-base leading-8 text-zinc-300">
                {content.link}
              </article>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-800 px-6 py-5 sm:px-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <p className="text-xs text-zinc-600 break-all">
                Content ID: {content._id}
              </p>

              <button
                onClick={() => navigate("/notes")}
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                Back to Notes
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
 
