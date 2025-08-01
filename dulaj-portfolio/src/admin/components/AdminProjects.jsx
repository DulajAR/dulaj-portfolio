import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import DOMPurify from "dompurify";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();
  const projectsRef = collection(db, "projects");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const snapshot = await getDocs(projectsRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    } catch (error) {
      alert("Failed to fetch projects: " + error.message);
    }
  };

  const handleMediaChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      name: file.name,
    }));
    setMediaPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = null;
  };

  const handleRemoveMedia = (index) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    setMediaFiles((prev) => {
      const newPreviewsBefore = mediaPreviews
        .slice(0, index)
        .filter((p) => p.isNew).length;
      return prev.filter((_, i) => i !== newPreviewsBefore);
    });
  };

  const uploadMediaFiles = async (files) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileRef = ref(storage, `projects/${uuidv4()}-${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        return { url, type: file.type };
      });
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error("Upload failed: " + error.message);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      let uploadedMedia = [];
      if (mediaFiles.length > 0) {
        uploadedMedia = await uploadMediaFiles(mediaFiles);
      }

      let finalMedia = [];
      if (editingId) {
        const oldMedia = mediaPreviews.filter((p) => !p.isNew).map((p) => ({
          url: p.url,
          type: projects
            .find((pr) => pr.id === editingId)
            ?.media.find((m) => m.url === p.url)?.type || "",
        }));

        finalMedia = [...oldMedia, ...uploadedMedia];

        const originalProject = projects.find((p) => p.id === editingId);
        const removedMedia = originalProject.media.filter(
          (m) => !finalMedia.some((fm) => fm.url === m.url)
        );

        await Promise.all(
          removedMedia.map(async (m) => {
            try {
              const mediaRef = ref(storage, m.url);
              await deleteObject(mediaRef);
            } catch {}
          })
        );

        const docRef = doc(db, "projects", editingId);
        await updateDoc(docRef, {
          title,
          description: DOMPurify.sanitize(description),
          media: finalMedia,
          timestamp: new Date(),
        });

        alert("Project updated successfully!");
      } else {
        finalMedia = uploadedMedia;
        await addDoc(projectsRef, {
          title,
          description: DOMPurify.sanitize(description),
          media: finalMedia,
          timestamp: new Date(),
        });
        alert("Project added successfully!");
      }

      setTitle("");
      setDescription("");
      setMediaFiles([]);
      setMediaPreviews([]);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    if (project.media && project.media.length > 0) {
      setMediaPreviews(project.media.map((m) => ({ url: m.url, isNew: false })));
    } else {
      setMediaPreviews([]);
    }
    setMediaFiles([]);
    setEditingId(project.id);
  };

  const handleDelete = async (id, mediaArray) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      if (mediaArray && mediaArray.length > 0) {
        await Promise.all(
          mediaArray.map(async (mediaItem) => {
            try {
              const mediaRef = ref(storage, mediaItem.url);
              await deleteObject(mediaRef);
            } catch {}
          })
        );
      }
      await deleteDoc(doc(db, "projects", id));
      alert("Project deleted successfully.");
      fetchProjects();
    } catch (error) {
      alert("Failed to delete project: " + error.message);
    }
  };

  return (
    <section style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h2>🚀 Manage Projects</h2>
      <button
        onClick={() => navigate("/admin/dashboard")}
        style={{ margin: "1rem 0", padding: "0.5rem 1rem" }}
      >
        ⬅ Back to Dashboard
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setDescription(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: description }}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            minHeight: "100px",
            borderRadius: "4px",
            backgroundColor: "white",
            overflowY: "auto"
          }}
        ></div>

        <input
          type="file"
          onChange={handleMediaChange}
          accept="image/*,video/*"
          multiple
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "0.5rem" }}>
          {mediaPreviews.map((media, i) =>
            media.url.endsWith(".mp4") || media.url.includes("video") ? (
              <div key={i} style={{ position: "relative" }}>
                <video
                  controls
                  width="150"
                  height="100"
                  style={{ borderRadius: 8 }}
                  src={media.url}
                />
                <button
                  onClick={() => handleRemoveMedia(i)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "rgba(255,0,0,0.7)",
                    border: "none",
                    borderRadius: "50%",
                    color: "white",
                    cursor: "pointer",
                    width: 20,
                    height: 20,
                    lineHeight: "20px",
                    textAlign: "center",
                  }}
                  title="Remove media"
                >
                  &times;
                </button>
              </div>
            ) : (
              <div key={i} style={{ position: "relative" }}>
                <img
                  src={media.url}
                  alt={`Preview ${i + 1}`}
                  style={{ width: 150, height: 100, objectFit: "cover", borderRadius: 8 }}
                />
                <button
                  onClick={() => handleRemoveMedia(i)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "rgba(255,0,0,0.7)",
                    border: "none",
                    borderRadius: "50%",
                    color: "white",
                    cursor: "pointer",
                    width: 20,
                    height: 20,
                    lineHeight: "20px",
                    textAlign: "center",
                  }}
                  title="Remove media"
                >
                  &times;
                </button>
              </div>
            )
          )}
        </div>

        <button
          onClick={handleAddOrUpdate}
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          {editingId ? "Update Project" : "Add Project"}
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              background: "#f9f9f9",
              padding: "1rem",
              borderRadius: "10px",
              marginBottom: "1rem",
            }}
          >
            <h3>{project.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: project.description }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {project.media &&
                project.media.map((mediaItem, i) =>
                  mediaItem.type.startsWith("video") ? (
                    <video
                      key={i}
                      controls
                      width="150"
                      height="100"
                      style={{ borderRadius: 8 }}
                    >
                      <source src={mediaItem.url} />
                    </video>
                  ) : (
                    <img
                      key={i}
                      src={mediaItem.url}
                      alt={`${project.title} media ${i + 1}`}
                      style={{ width: 150, height: 100, objectFit: "cover", borderRadius: 8 }}
                    />
                  )
                )}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => handleEdit(project)}
                style={{
                  marginRight: "0.5rem",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id, project.media)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminProjects;
