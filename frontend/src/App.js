


import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Tabs, Tab, Box, Typography, Card, CardContent, Avatar, TextField, Button, CircularProgress, Container } from '@mui/material';

function ChatTab({ messages, input, setInput, sendMessage, loading, messagesEndRef, handleKeyDown }) {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ minHeight: 320, maxHeight: 320, overflowY: 'auto', mb: 2 }}>
        {messages.map((msg, i) => (
          <Card key={i} sx={{ mb: 1, maxWidth: '80%', ml: msg.sender === 'user' ? 'auto' : 0, bgcolor: msg.sender === 'user' ? '#4f8cff' : '#e9ecef' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: msg.sender === 'user' ? '#1976d2' : '#fff', color: msg.sender === 'user' ? '#fff' : '#1976d2', mr: 2 }}>{msg.sender === 'user' ? 'U' : 'B'}</Avatar>
              <Typography variant="body1" sx={{ color: msg.sender === 'user' ? '#fff' : '#333' }}>{msg.text}</Typography>
            </CardContent>
          </Card>
        ))}
        {loading && (
          <Box sx={{ textAlign: 'center', color: '#4f8cff', mt: 2 }}>
            <CircularProgress size={24} color="primary" /> Bot is typing...
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
        />
        <Button variant="contained" onClick={sendMessage} disabled={loading} sx={{ minWidth: 100 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [userId, setUserId] = useState('demo_user');
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/history/${userId}`);
      setHistory(res.data.messages || []);
    } catch {
      setHistory([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <Box sx={{ p: 2 }}>
      <TextField label="User ID" value={userId} onChange={e => setUserId(e.target.value)} size="small" sx={{ mb: 2 }} />
      <Button variant="outlined" onClick={fetchHistory} sx={{ mb: 2 }}>Refresh</Button>
      {loading ? <CircularProgress /> : (
        <Box>
          {history.length === 0 ? <Typography>No history found.</Typography> : history.map((msg, i) => (
            <Card key={i} sx={{ mb: 1 }}><CardContent>{msg}</CardContent></Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

function AnalyticsTab() {
  const [userId, setUserId] = useState('demo_user');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/analytics/${userId}`);
      setAnalytics(res.data);
    } catch {
      setAnalytics(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <Box sx={{ p: 2 }}>
      <TextField label="User ID" value={userId} onChange={e => setUserId(e.target.value)} size="small" sx={{ mb: 2 }} />
      <Button variant="outlined" onClick={fetchAnalytics} sx={{ mb: 2 }}>Refresh</Button>
      {loading ? <CircularProgress /> : (
        analytics ? <Typography>Messages sent: {analytics.message_count}</Typography> : <Typography>No analytics found.</Typography>
      )}
    </Box>
  );
}

function App() {
  const [tab, setTab] = useState(0);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome! How can I support your mental health today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/chat', { message: input });
      setMessages(msgs => [...msgs, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <AppBar position="static" color="primary" sx={{ borderRadius: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="Chat" />
          <Tab label="History" />
          <Tab label="Analytics" />
        </Tabs>
      </AppBar>
      <Box sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 2, mt: 2 }}>
        {tab === 0 && <ChatTab messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} loading={loading} messagesEndRef={messagesEndRef} handleKeyDown={handleKeyDown} />}
        {tab === 1 && <HistoryTab />}
        {tab === 2 && <AnalyticsTab />}
      </Box>
    </Container>
  );
}

export default App;
