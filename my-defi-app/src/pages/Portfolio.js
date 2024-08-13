import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './Portfolio.css';

const Portfolio = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', amount: '', date: '' });

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log('Token size:', token.length); // Log the size of the token

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Essential header
        };

        console.log('Headers:', headers); // Log the headers

        const response = await axios.get('/portfolio', { headers });
        setInvestments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching investments', error);
        setLoading(false);
      }
    };
    fetchInvestments();
  }, [getAccessTokenSilently]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddInvestment = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Token size:', token.length); // Log the size of the token

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Essential header
      };

      console.log('Headers:', headers); // Log the headers

      const response = await axios.post('/portfolio', formData, { headers });
      setInvestments([...investments, response.data]);
      setFormData({ name: '', amount: '', date: '' });
    } catch (error) {
      console.error('Error adding investment', error);
    }
  };

  const handleDeleteInvestment = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Token size:', token.length); // Log the size of the token

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Essential header
      };

      console.log('Headers:', headers); // Log the headers

      await axios.delete(`/portfolio/${id}`, { headers });
      setInvestments(investments.filter((investment) => investment._id !== id));
    } catch (error) {
      console.error('Error deleting investment', error);
    }
  };

  const data = investments.map(investment => ({
    name: investment.name,
    amount: investment.amount,
  }));

  return (
    <div className="portfolio-page">
      <h1>Portfolio Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="investment-list">
            {investments.map((investment) => (
              <div key={investment._id} className="investment-item">
                <p>{investment.name}</p>
                <p>{investment.amount}</p>
                <p>{new Date(investment.date).toLocaleDateString()}</p>
                <button onClick={() => handleDeleteInvestment(investment._id)}>Delete</button>
              </div>
            ))}
          </div>
          <div className="investment-form">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Investment Name"
            />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Date"
            />
            <button onClick={handleAddInvestment}>Add Investment</button>
          </div>
          <div className="investment-charts">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="amount"
                isAnimationActive={false}
                data={data}
                cx={200}
                cy={200}
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <BarChart width={600} height={300} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
