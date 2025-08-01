import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import './NameForm.css';

const NameForm = () => {
  const [name, setName] = useState('');
  const [reversed, setReversed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState([]);
  const dropdownRef = useRef(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/names')
      .then(res => {
        if (res.data.reversed) {
          setReversed(res.data.reversed);
          setHistory([res.data.reversed]);
        }
      })
      .catch(err => console.error('Error getting name', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitName = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/names', { name });
      setReversed(res.data.reversed);
      setError(null);
      setShowResult(true);
      setHistory(prev => [res.data.reversed, ...prev.filter(h => h !== res.data.reversed)]);
      setShowHistory(false);
    } catch (err) {
      console.error('Error submitting name', err);
      setError('Failed to reverse name');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setReversed('');
    setShowResult(false);
    setError(null);
  };

  return (
<div className="name-form-container">
     <h2>Recent Reversed Names</h2>
        <p className="info-text">
          Enter your name and press "Reverse" to see it reversed. 
        </p>
    <section className="name-form-header" ref={dropdownRef}>
      {!showResult ? (
        <div className="form-row">
          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={e => setName(e.target.value)}
            className="name-input"
            onKeyDown={e => e.key === 'Enter' && submitName()}
            disabled={loading}
            aria-label="Enter name"
          />
          <button
            onClick={submitName}
            className="submit-btn"
            disabled={loading || !name.trim()}
            aria-label="Reverse name"
          >
            {loading ? (
              <>
                <FiRefreshCw className="icon-spin" /> Reversing...
              </>
            ) : (
              <>
                <FiCheckCircle /> Reverse
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="result-popup">
          <span><strong>Reversed:</strong> {reversed}</span>
          <button className="reset-btn" onClick={resetForm} aria-label="Reset form">
            <FiXCircle /> Reverse another
          </button>
        </div>
      )}

      <button
        className="history-toggle"
        onClick={() => setShowHistory(!showHistory)}
        aria-expanded={showHistory}
        aria-controls="history-list"
        aria-label="Toggle recent reversed names"
      >
        <FiClock />
      </button>

      {showHistory && history.length > 0 && (
        <ul id="history-list" className="history-dropdown" role="list" aria-label="Recent reversed names">
          {history.map((item, idx) => (
            <li key={idx} tabIndex="0" className="history-item">{item}</li>
          ))}
        </ul>
      )}

      {error && <p className="error-text" role="alert">{error}</p>}
    </section>
    </div>
  );
};

export default NameForm;
