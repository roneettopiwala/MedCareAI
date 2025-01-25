import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000')  // Flask backend URL
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.log('Error:', error));
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
    </div>
  );
}

export default App;
