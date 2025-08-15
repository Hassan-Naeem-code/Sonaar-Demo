
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome! How can I support your mental health today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', fontFamily: 'Inter, Arial', background: '#f7f8fa', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
      <header style={{ background: '#4f8cff', color: '#fff', padding: '18px 0', borderRadius: '16px 16px 0 0', textAlign: 'center', fontWeight: 600, fontSize: 22 }}>
        Mental Health Support Bot
      </header>
      <div style={{ padding: 20, minHeight: 320, maxHeight: 320, overflowY: 'auto', background: '#fff', borderRadius: '0 0 16px 16px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', margin: '10px 0' }}>
            <div style={{
              background: msg.sender === 'user' ? '#4f8cff' : '#e9ecef',
              color: msg.sender === 'user' ? '#fff' : '#333',
              padding: '10px 16px',
              borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
              maxWidth: '75%',
              fontSize: 16,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', padding: 18, background: '#f7f8fa', borderRadius: '0 0 16px 16px', borderTop: '1px solid #e9ecef' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, padding: '10px 14px', fontSize: 16, borderRadius: 8, border: '1px solid #e9ecef', outline: 'none', marginRight: 10 }}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          style={{ background: '#4f8cff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 500, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
