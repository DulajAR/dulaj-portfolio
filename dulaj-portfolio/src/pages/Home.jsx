import React from 'react';
import Header from '../components/Header';

const Home = () => {
  return (
    <div>
      <Header />
      <main className="p-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Hi, I'm Dulaj 👋</h2>
        <p className="text-lg text-gray-600">A passionate Software Engineer from Sri Lanka.</p>
      </main>
    </div>
  );
};

export default Home;
