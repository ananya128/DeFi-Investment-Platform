import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CryptoStats.css'; // Import the CSS file for styling

const CryptoStats = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/global');
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching data from CoinGecko API', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="crypto-stats">
      <div className="stats-container">
        <h1 className="title">Crypto Market Insights</h1>
        <div className="stats-grid">
          <div className="stat">
            <h2 className="value">
              ${stats.total_market_cap?.usd?.toLocaleString() || 'Loading...'}
            </h2>
            <p className="label">Global Crypto Market Cap</p>
          </div>
          <div className="stat">
            <h2 className="value">
              {stats.active_cryptocurrencies || 'Loading...'}
            </h2>
            <p className="label">Cryptocurrencies Available</p>
          </div>
          <div className="stat">
            <h2 className="value">
              ${stats.total_volume?.usd?.toLocaleString() || 'Loading...'}
            </h2>
            <p className="label">24h Trading Volume</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoStats;
