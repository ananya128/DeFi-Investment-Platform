import React from 'react';
import ProfileCard from '../components/ProfileCard';
import CryptoStats from '../components/CryptoStats';

const Home = () => {
  return (
    <div className="home-page">
      <ProfileCard />
      <CryptoStats />
    </div>
  );
};

export default Home;

