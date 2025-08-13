// src/pages/EducationPage.jsx
import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Education from "../components/Education";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

import "../App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const EducationPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <About />
      <Education />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
};

export default EducationPage;
