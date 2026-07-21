import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { SiX } from "react-icons/si";
import { FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaGlobe, FaInstagram, FaFacebook, FaPaperPlane, FaHeadset } from "react-icons/fa";
import heroImg from "../assets/hero.png";

const iconMap = {
  email: { Icon: FaEnvelope, color: "text-indigo-400" },
  phone: { Icon: FaPhone, color: "text-emerald-400" },
  linkedin: { Icon: FaLinkedin, color: "text-blue-400" },
  github: { Icon: FaGithub, color: "text-white" },
  website: { Icon: FaGlobe, color: "text-cyan-400" },
  instagram: { Icon: FaInstagram, color: "text-pink-400" },
  facebook: { Icon: FaFacebook, color: "text-blue-500" },
  x: { Icon: SiX, color: "text-white" },
};

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "contacts"));
        setContacts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await addDoc(collection(db, "messages"), { ...formData, timestamp: serverTimestamp() });
      setSuccess("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[var(--color-surface-dark)]">
        <div className="loading-spinner"><p className="text-slate-400 mt-4">Loading Contact...</p></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--color-surface-dark)] py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />

      <div className="section-center relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25"
          >
            <FaHeadset className="text-white text-2xl" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Contact Me</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", maxWidth: "28rem", margin: "0 auto", textAlign: "center" }}>
            Connect with me through any of the platforms below or send a message directly
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full mx-auto mt-6" />
        </motion.div>

        <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
          {/* Profile */}
          <motion.div
            className="flex flex-col items-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative mb-5">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full blur-lg opacity-30" />
              <img src={heroImg} alt="Dulaj Ranasinghe" className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/10 object-cover" style={{ objectPosition: "center 5%" }} />
            </div>
          </motion.div>

          {/* Social icons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 sm:gap-5 mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {contacts.map((contact, idx) => {
              const key = contact.type.trim().toLowerCase();
              const { Icon, color } = iconMap[key] || { Icon: FaGlobe, color: "text-cyan-400" };
              const link = key === "email" ? `mailto:${contact.link}` : contact.link.startsWith("http") ? contact.link : `https://${contact.link}`;
              return (
                <motion.a
                  key={contact.id}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={contact.type}
                  whileHover={{ y: -6, scale: 1.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                  <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300">
                    <Icon className={`text-lg sm:text-xl ${color}`} />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="group relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-cyan-400/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />
            <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 sm:p-9">
              <h3 className="text-lg font-bold text-white mb-8" style={{ textAlign: "center" }}>Send a Message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
                <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
              </div>
              <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required rows="5" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none mb-8" />
              <button type="submit" disabled={sending} className="w-full px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <FaPaperPlane className="text-sm" />
                {sending ? "Sending..." : "Send Message"}
              </button>
              {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                  {success}
                </motion.div>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
