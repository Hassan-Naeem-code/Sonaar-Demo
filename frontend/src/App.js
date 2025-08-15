import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome! How can I support your mental health today?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    try {
      const res = await axios.post('http://localhost:8000/api/chat', { message: input });
      setMessages(msgs => [...msgs, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'Arial' }}>
      <h2>Mental Health Support Bot</h2>
      <div style={{ border: '1px solid #ccc', padding: 20, minHeight: 300 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '10px 0' }}>
            <b>{msg.sender === 'user' ? 'You' : 'Bot'}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '80%', padding: 8 }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} style={{ padding: '8px 16px', marginLeft: 8 }}>Send</button>
      </div>
    </div>
  );
}

export default App;
