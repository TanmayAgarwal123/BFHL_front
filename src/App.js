import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';
import { FaSpinner } from 'react-icons/fa';
import logo from './assets/logo.png'; // Import your logo here

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const parsedData = JSON.parse(jsonInput);
      const response = await axios.post('https://bfhl-0zk7.onrender.com/bfhl', { data: parsedData.data });
      setResponseData(response.data);
      setError('');
    } catch (err) {
      setError('Invalid JSON format or request error');
      setResponseData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const filteredData = selectedOptions.reduce((acc, option) => {
      if (responseData[option.value] && responseData[option.value].length > 0) {
        acc[option.label] = responseData[option.value].join(', ');
      }
      return acc;
    }, {});

    return (
      <div className="response">
        {Object.entries(filteredData).map(([key, value]) => (
          <div key={key} className="response-item">
            <strong>{key}: </strong> {value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <h1>BFHL Frontend</h1>
      <div className="card">
        <textarea
          rows="5"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON here'
          className="input-textarea"
        />
        <button onClick={handleSubmit} className="submit-button">
          {loading ? <FaSpinner className="spinner" /> : 'Submit'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {responseData && (
          <>
            <Select
              isMulti
              options={options}
              onChange={handleSelectChange}
              className="react-select"
            />
            {renderResponse()}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
