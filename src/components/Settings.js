// src/components/Settings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Settings.css';

const API_BASE_URL = 'https://natural-trust-production.up.railway.app';

const Settings = () => {
  const [currency, setCurrency] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/settings`)
      .then(res => {
        setCurrency(res.data.currency);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching settings', err);
        setError('Failed to load settings.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="settings-section">
      <p>Store Currency:</p>
      {loading ? (
        <p className="loading">Loading currency...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <p className="currency-display">
          <strong>{currency}</strong>
        </p>
      )}
    </section>
  );
};

export default Settings;
