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
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [technologies, setTechnologies] = useState("");
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
      setProjects(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (error) {
      alert("Failed to fetch projects: " + error.message);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(projects);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setProjects(reordered);

    try {
      await Promise.all(
        reordered.map((proj, index) =>
          updateDoc(doc(db, "projects", proj.id), { order: index })
        )
      );
    } catch (err) {
      console.error("Failed to save new order:", err);
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
    if (!title.trim() || !description.trim() || !summary.trim() || !technologies.trim()) {
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
          type:
            projects
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
          summary,
          technologies,
          description: DOMPurify.sanitize(description),
          media: finalMedia,
          timestamp: new Date(),
        });

        alert("Project updated successfully!");
      } else {
        finalMedia = uploadedMedia;
        await addDoc(projectsRef, {
          title,
          summary,
          technologies,
          description: DOMPurify.sanitize(description),
          media: finalMedia,
          timestamp: new Date(),
          order: projects.length,
        });
        alert("Project added successfully!");
      }

      setTitle("");
      setSummary("");
      setTechnologies("");
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
    setSummary(project.summary || "");
    setTechnologies(project.technologies || "");
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
    <section
      style={{
        minHeight: "100vh",
        padding: "2rem 1rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* --- COLORFUL TITLE --- */}
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            background: "linear-gradient(90deg, #ff7e5f, #feb47b, #86a8e7, #91eae4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          Manage Projects
        </h2>

        {/* --- COLORFUL BACK BUTTON --- */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            marginBottom: "1rem",
            padding: "0.6rem 1.2rem",
            background: "linear-gradient(45deg, #ff6a00, #ee0979, #00f260, #0575e6)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.filter = "brightness(1.2)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
        >
          ⬅ Back to Dashboard
        </button>

        {/* --- FORM AND MEDIA SECTION --- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: 10, fontSize: 16, borderRadius: 8, border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Short Description Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ padding: 10, fontSize: 16, borderRadius: 8, border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Technologies Used (comma-separated)"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            style={{ padding: 10, fontSize: 16, borderRadius: 8, border: "1px solid #ccc" }}
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
              borderRadius: "8px",
              backgroundColor: "white",
              overflowY: "auto",
            }}
          ></div>
          <input
            type="file"
            onChange={handleMediaChange}
            accept="image/*,video/*"
            multiple
            style={{ borderRadius: 6 }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "0.5rem" }}>
            {mediaPreviews.map((media, i) =>
              media.url.endsWith(".mp4") || media.url.includes("video") ? (
                <div key={i} style={{ position: "relative" }}>
                  <video controls width="150" height="100" style={{ borderRadius: 8 }} src={media.url} />
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
              alignSelf: "flex-start",
            }}
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>
        </div>

        {/* --- PROJECT LIST WITH DRAG/DROP --- */}
        <div style={{ marginTop: "2rem" }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="projects">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {projects.map((project, index) => (
                    <Draggable key={project.id} draggableId={project.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            background: "#f9f9f9",
                            padding: "1rem",
                            borderRadius: "10px",
                            marginBottom: "1rem",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>{project.title}</h3>
                          <p><strong>Summary:</strong> {project.summary}</p>
                          <p><strong>Technologies:</strong> {project.technologies}</p>
                          <div dangerouslySetInnerHTML={{ __html: project.description }} />
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {project.media &&
                              project.media.map((mediaItem, i) =>
                                mediaItem.type.startsWith("video") ? (
                                  <video key={i} controls width="150" height="100" style={{ borderRadius: 8 }}>
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </section>
  );
};

export default AdminProjects;
