import React from "react";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 bg-[var(--color-surface-dark)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <span className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Dulaj Ranasinghe. All rights
              reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">
              Built with React &amp; Firebase
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
