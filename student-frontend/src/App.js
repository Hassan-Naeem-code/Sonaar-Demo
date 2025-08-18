import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, Card, CardContent, Avatar, TextField, Button, CircularProgress, Container, Chip, Rating, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, IconButton, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import MoodIcon from '@mui/icons-material/Mood';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LockIcon from '@mui/icons-material/Lock';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import Joyride from 'react-joyride';

const badges = [
  { label: 'Streak: 5 days', color: 'primary' },
  { label: 'First Chat', color: 'success' },
  { label: 'Feedback Given', color: 'info' }
];

const drawerWidth = 220;

function ChatTab({ messages, input, setInput, sendMessage, loading }) {
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
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          value={input}
          onChange={e => setInput(e.target.value)}
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

function MoodTab() {
  const [mood, setMood] = useState(3);
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">How are you feeling today?</Typography>
      <Rating name="mood" value={mood} max={5} onChange={(_, v) => setMood(v)} />
      <Typography sx={{ mt: 2 }}>Your mood: {mood}/5</Typography>
      <Box sx={{ mt: 4 }}>
        <Card sx={{ p: 2, bgcolor: '#e3f2fd' }}>
          <Typography variant="body2">Mood trend (demo):</Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 2 }}>
            {[2, 3, 4, 3, 5].map((val, i) => (
              <Box key={i} sx={{ width: 24, height: val * 16, bgcolor: '#1976d2', borderRadius: 1 }} />
            ))}
          </Box>
          <Typography variant="caption" sx={{ mt: 1 }}>Last 5 days</Typography>
        </Card>
      </Box>
    </Box>
  );
}

function BadgesTab() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Your Badges</Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        {badges.map((badge, i) => (
          <Chip key={i} label={badge.label} color={badge.color} />
        ))}
      </Box>
      <Box sx={{ mt: 4 }}>
        <Card sx={{ p: 2, bgcolor: '#fffde7' }}>
          <Typography variant="body2">Badge progress (demo):</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {[1, 2, 3].map((val, i) => (
              <Box key={i} sx={{ width: 32, height: 8 + val * 8, bgcolor: '#fbc02d', borderRadius: 1 }} />
            ))}
          </Box>
          <Typography variant="caption" sx={{ mt: 1 }}>Levels unlocked</Typography>
        </Card>
      </Box>
    </Box>
  );
}

function FeedbackTab() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Rate your experience</Typography>
      <Rating value={rating} onChange={(_, v) => setRating(v)} />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Feedback"
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setSubmitted(true)} disabled={submitted}>
        Submit
      </Button>
      {submitted && <Typography sx={{ mt: 2 }} color="success.main">Thank you for your feedback!</Typography>}
      <Box sx={{ mt: 4 }}>
        <Card sx={{ p: 2, bgcolor: '#e8f5e9' }}>
          <Typography variant="body2">Feedback stats (demo):</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {[3, 4, 5, 2, 4].map((val, i) => (
              <Box key={i} sx={{ width: 24, height: val * 10, bgcolor: '#43a047', borderRadius: 1 }} />
            ))}
          </Box>
          <Typography variant="caption" sx={{ mt: 1 }}>Last 5 ratings</Typography>
        </Card>
      </Box>
    </Box>
  );
}

function PrivacyTab() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Privacy Dashboard</Typography>
      <Typography sx={{ mt: 2 }}>You can view and manage your data here. (Demo only)</Typography>
      <Button variant="outlined" sx={{ mt: 2 }}>Download My Data</Button>
      <Button variant="outlined" color="error" sx={{ mt: 2, ml: 2 }}>Delete My Data</Button>
      <Box sx={{ mt: 4 }}>
        <Card sx={{ p: 2, bgcolor: '#fce4ec' }}>
          <Typography variant="body2">Privacy actions (demo):</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Chip label="Data Downloaded" color="info" />
            <Chip label="Data Deleted" color="error" />
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

function App() {
  const [tab, setTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome! How can I support your mental health today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [joyrideRun, setJoyrideRun] = useState(true);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'This is a demo response. In a real system, you would get personalized support here.' }]);
      setLoading(false);
    }, 1200);
  };

  const steps = [
    {
      target: '.dashboard-drawer',
      content: 'Use the sidebar to navigate between dashboard sections.',
    },
    {
      target: '.dashboard-tabs',
      content: 'Tabs let you switch between Chat, Mood, Badges, Feedback, and Privacy.',
    },
    {
      target: '.dashboard-main',
      content: 'Each section shows demo content. Try clicking around!',
    },
  ];

  const drawerItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, tab: 0 },
    { label: 'Chat', icon: <ChatIcon />, tab: 0 },
    { label: 'Mood', icon: <MoodIcon />, tab: 1 },
    { label: 'Badges', icon: <EmojiEventsIcon />, tab: 2 },
    { label: 'Feedback', icon: <FeedbackIcon />, tab: 3 },
    { label: 'Privacy', icon: <LockIcon />, tab: 4 },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Joyride
        steps={steps}
        run={joyrideRun}
        continuous
        showSkipButton
        styles={{ options: { zIndex: 2000 } }}
      />
      <Drawer
        className="dashboard-drawer"
        variant="permanent"
        sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#f5f5f5' } }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ color: '#1976d2' }}>Student Portal</Typography>
        </Toolbar>
        <Divider />
        <List>
          {drawerItems.map((item, i) => (
            <ListItem button key={item.label} selected={tab === item.tab} onClick={() => setTab(item.tab)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Container maxWidth="md" sx={{ mt: 4, ml: `${drawerWidth}px` }}>
        <AppBar position="static" color="primary" sx={{ borderRadius: 2 }}>
          <Tabs className="dashboard-tabs" value={tab} onChange={(_, v) => setTab(v)} centered>
            <Tab label="Chat" />
            <Tab label="Mood" />
            <Tab label="Badges" />
            <Tab label="Feedback" />
            <Tab label="Privacy" />
          </Tabs>
        </AppBar>
        <Box className="dashboard-main" sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 2, mt: 2 }}>
          {tab === 0 && <ChatTab messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} loading={loading} />}
          {tab === 1 && <MoodTab />}
          {tab === 2 && <BadgesTab />}
          {tab === 3 && <FeedbackTab />}
          {tab === 4 && <PrivacyTab />}
        </Box>
      </Container>
    </Box>
  );
}

export default App;
