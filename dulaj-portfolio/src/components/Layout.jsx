import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1" style={{ paddingTop: "5.5rem" }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
