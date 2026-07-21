import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const q = query(collection(db, "certificates"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        setCertificates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[var(--color-surface-dark)]">
        <div className="loading-spinner"><p className="text-slate-400 mt-4">Loading Certificates...</p></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--color-surface-dark)] py-20 sm:py-24">
      <div className="section-center">
        <motion.h2 className="section-heading" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className="gradient-text">Certificates</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" style={{ maxWidth: "72rem", margin: "0 auto" }}>
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedCert(cert)}
              className="glass rounded-2xl overflow-hidden cursor-pointer group hover:bg-white/[0.07] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 text-left"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                {cert.fileType === "image" ? (
                  <img src={cert.fileUrl} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <iframe src={cert.fileUrl} title={cert.title} className="w-full h-full border-0 pointer-events-none" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-dark)] via-transparent to-transparent opacity-60" />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{cert.title}</h3>
                {cert.description && <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">{cert.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCert && (
          <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCert(null)}>
            <motion.div className="bg-[var(--color-surface)] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white">{selectedCert.title}</h3>
                <button onClick={() => setSelectedCert(null)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-all flex-shrink-0">✕</button>
              </div>
              {selectedCert.description && <p className="text-sm sm:text-base text-slate-300 mb-3 sm:mb-4">{selectedCert.description}</p>}
              {selectedCert.fileType === "image" ? (
                <img src={selectedCert.fileUrl} alt={selectedCert.title} className="w-full rounded-xl max-h-[70vh] object-contain" />
              ) : (
                <iframe src={selectedCert.fileUrl} title={selectedCert.title} className="w-full rounded-xl border-0" style={{ height: "70vh" }} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
