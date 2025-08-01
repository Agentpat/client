import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExchangeRate.css';

const currencies = [
  'USD', 'EUR', 'GBP', 'NGN', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'
];

const ExchangeRate = () => {
  const [base, setBase] = useState('USD');
  const [target, setTarget] = useState('EUR');
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (base === target) {
      setRate(1);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchRate = async () => {
      setLoading(true);
      setError(null);

      try {
        const options = {
          method: 'GET',
          url: 'https://currency-converter-pro1.p.rapidapi.com/latest-rates',
          params: { base },
          headers: {
            'X-Rapidapi-Key': 'fcab8f8aa4mshf1c1e34c42a57ffp11ec40jsn8594a806f680',
            'X-Rapidapi-Host': 'currency-converter-pro1.p.rapidapi.com',
          },
        };

        const response = await axios.request(options);
        const rates = response.data.result;

        if (rates && rates[target]) {
          setRate(rates[target]);
        } else {
          setRate(null);
          setError(`No rate found for ${target}`);
        }
      } catch (err) {
        setError('Failed to fetch exchange rate.');
        setRate(null);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [base, target]);

  return (
    <div className="exchange-rate-container">
      <h2 className="title">Currency Exchange</h2>
      <p className="description">Select currencies to view exchange rate</p>

      <div className="exchange-rate-controls">
        <label htmlFor="base-currency-select">
          Base Currency:
          <select
            id="base-currency-select"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            aria-label="Select base currency"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="target-currency-select">
          Target Currency:
          <select
            id="target-currency-select"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            aria-label="Select target currency"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="exchange-rate-display">
        {loading && <p className="loading-text">Fetching rate...</p>}

        {error && <p className="error-text" role="alert">{error}</p>}

        {!loading && !error && rate !== null && (
          <p className="rate-text">
            1 {base} = <strong>{rate.toFixed(4)}</strong> {target}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExchangeRate;
