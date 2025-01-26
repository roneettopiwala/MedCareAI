import React, { useState } from 'react';

function App() {
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [gender, setGender] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: "7NN2joCC0IeKxSxzNflzPOHiF2m2",  // Use dynamic input if needed
      saved_item_id: "rg2DZxKt7rkJ9grwDKnhHZ",  // Use dynamic input if needed
      pipeline_inputs: [
        { input_name: 'Age', value: age },
        { input_name: 'Symptoms', value: symptoms },
        { input_name: 'Gender', value: gender },
      ],
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/trigger-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResponse(data);
      setError(null); // Reset error if successful
    } catch (err) {
      setError('Failed to trigger webhook');
      setResponse(null);
      console.error('Error:', err);
    }
  };

  return (
    <div className="App">
      <h1>Gumloop Webhook Trigger</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Symptoms:</label>
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit">Trigger Webhook</button>
      </form>

      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
