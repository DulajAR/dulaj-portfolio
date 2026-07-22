import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import DOMPurify from "dompurify";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadToCloudinary } from "../../utils/cloudinary";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);

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
      const removedMedia = mediaPreviews[index];
      return prev.filter((f) => f.name !== removedMedia?.name);
    });
  };

  const uploadMediaFiles = async (files) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const uploadedFile = await uploadToCloudinary(file, { folder: "portfolio_upload/projects" });
        return {
          url: uploadedFile.url,
          publicId: uploadedFile.publicId,
          resourceType: uploadedFile.resourceType,
          type: file.type,
          name: file.name,
        };
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
        const originalProject = projects.find((p) => p.id === editingId);
        finalMedia = mediaPreviews
          .map((p) => {
            if (!p.isNew) {
              return originalProject?.media.find((m) => m.url === p.url);
            } else {
              return uploadedMedia.find((um) => um.name === p.name);
            }
          })
          .filter((m) => m !== undefined);

        await updateDoc(doc(db, "projects", editingId), {
          title, summary, technologies,
          description: DOMPurify.sanitize(description),
          media: finalMedia, timestamp: new Date(),
        });
        alert("Project updated successfully!");
      } else {
        finalMedia = uploadedMedia;
        await addDoc(projectsRef, {
          title, summary, technologies,
          description: DOMPurify.sanitize(description),
          media: finalMedia, timestamp: new Date(), order: projects.length,
        });
        alert("Project added successfully!");
      }

      setTitle(""); setSummary(""); setTechnologies(""); setDescription("");
      setMediaFiles([]); setMediaPreviews([]); setEditingId(null);
      fetchProjects();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (project) => {
    setTitle(project.title);
    setSummary(project.summary || "");
    setTechnologies(project.technologies || "");
    setDescription(project.description || "");
    if (project.media && project.media.length > 0) {
      setMediaPreviews(project.media.map((m) => ({ url: m.url, isNew: false, name: m.url })));
    } else {
      setMediaPreviews([]);
    }
    setMediaFiles([]);
    setEditingId(project.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      alert("Project deleted successfully.");
      fetchProjects();
    } catch (error) {
      alert("Failed to delete project: " + error.message);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.title}>Manage Projects</h2>

        <div style={styles.form}>
          <input type="text" placeholder="Project Title" value={title}
            onChange={(e) => setTitle(e.target.value)} style={styles.input} />
          <input type="text" placeholder="Short Description Summary" value={summary}
            onChange={(e) => setSummary(e.target.value)} style={styles.input} />
          <input type="text" placeholder="Technologies Used (comma-separated)" value={technologies}
            onChange={(e) => setTechnologies(e.target.value)} style={styles.input} />
          <div contentEditable suppressContentEditableWarning
            onInput={(e) => setDescription(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: description }}
            style={styles.descriptionEditor}
          ></div>

          <input type="file" onChange={handleMediaChange} accept="image/*,video/*" multiple
            style={{ borderRadius: 6 }} />

          <DragDropContext onDragEnd={(result) => {
            if (!result.destination) return;
            const reordered = Array.from(mediaPreviews);
            const [moved] = reordered.splice(result.source.index, 1);
            reordered.splice(result.destination.index, 0, moved);
            setMediaPreviews(reordered);
            const newFilesOnly = reordered.filter((p) => p.isNew);
            setMediaFiles(newFilesOnly.map((p) => mediaFiles.find((f) => f.name === p.name)));
          }}>
            <Droppable droppableId="media" direction="horizontal">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}
                  style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "0.5rem" }}>
                  {mediaPreviews.map((media, index) => (
                    <Draggable key={index} draggableId={index.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          style={{ position: "relative", ...provided.draggableProps.style }}>
                          {media.url.endsWith(".mp4") || media.url.includes("video") ? (
                            <video controls width="150" height="100" style={{ borderRadius: 8 }} src={media.url} />
                          ) : (
                            <img src={media.url} alt={`Preview ${index + 1}`}
                              style={{ width: 150, height: 100, objectFit: "cover", borderRadius: 8 }} />
                          )}
                          <button onClick={() => handleRemoveMedia(index)} style={styles.mediaRemoveBtn} title="Remove media">&times;</button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <button onClick={handleAddOrUpdate} style={styles.submitBtn}>
            {editingId ? "Update Project" : "Add Project"}
          </button>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="projects">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {projects.map((project, index) => (
                    <Draggable key={project.id} draggableId={project.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          style={{ ...styles.projectCard, ...provided.draggableProps.style }}>
                          <h3 style={styles.projectTitle}>{project.title}</h3>
                          <p><strong>Summary:</strong> {project.summary}</p>
                          <p><strong>Technologies:</strong> {project.technologies}</p>
                          <div dangerouslySetInnerHTML={{ __html: project.description }} />
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {project.media && project.media.map((mediaItem, i) =>
                              mediaItem.type.startsWith("video") ? (
                                <video key={i} controls width="150" height="100" style={{ borderRadius: 8 }}>
                                  <source src={mediaItem.url} />
                                </video>
                              ) : (
                                <img key={i} src={mediaItem.url} alt={`${project.title} media ${i + 1}`}
                                  style={{ width: 150, height: 100, objectFit: "cover", borderRadius: 8 }} />
                              )
                            )}
                          </div>
                          <div style={{ marginTop: "1rem", display: "flex", gap: 8 }}>
                            <button onClick={() => handleEdit(project)} style={styles.editBtn}>Edit</button>
                            <button onClick={() => handleDelete(project.id)} style={styles.deleteBtn}>Delete</button>
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
    </div>
  );
};

const styles = {
  pageContainer: { padding: "2rem", minHeight: "100vh" },
  contentWrapper: {
    maxWidth: "900px", width: "100%", backgroundColor: "#fff",
    padding: "2rem", borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },
  title: {
    textAlign: "center", marginBottom: "1.5rem", fontSize: "1.5rem",
    fontWeight: 700, color: "#1e1b4b",
  },
  form: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  input: { padding: 10, fontSize: 16, borderRadius: 8, border: "1px solid #d1d5db" },
  descriptionEditor: {
    border: "1px solid #d1d5db", padding: "10px", minHeight: "100px",
    borderRadius: 8, backgroundColor: "white", overflowY: "auto",
  },
  submitBtn: {
    backgroundColor: "#10b981", color: "#fff", padding: "10px 20px",
    borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600,
    alignSelf: "flex-start", marginTop: "0.5rem",
  },
  mediaRemoveBtn: {
    position: "absolute", top: 2, right: 2,
    background: "rgba(255,0,0,0.7)", border: "none", borderRadius: "50%",
    color: "white", cursor: "pointer", width: 20, height: 20,
    lineHeight: "20px", textAlign: "center",
  },
  projectCard: {
    background: "#f9fafb", padding: "1rem", borderRadius: 12,
    marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  projectTitle: { marginBottom: "0.5rem", color: "#1e1b4b", fontWeight: 700 },
  editBtn: {
    marginRight: "0.5rem", backgroundColor: "#6366f1", color: "#fff",
    padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600,
  },
  deleteBtn: {
    backgroundColor: "#ef4444", color: "#fff",
    padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600,
  },
};

export default AdminProjects;
