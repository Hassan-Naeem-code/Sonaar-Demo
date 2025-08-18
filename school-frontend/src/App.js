import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, Card, CardContent, TextField, Button, CircularProgress, Container } from '@mui/material';

function OnboardingTab() {
  const [schoolName, setSchoolName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">School Onboarding</Typography>
      <TextField label="School Name" value={schoolName} onChange={e => setSchoolName(e.target.value)} sx={{ mt: 2 }} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setSubmitted(true)} disabled={submitted}>Submit</Button>
      {submitted && <Typography sx={{ mt: 2 }} color="success.main">Onboarding complete! (Demo)</Typography>}
    </Box>
  );
}

function StaffDashboardTab() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Staff Dashboard</Typography>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography>Student Engagement: 40%</Typography>
          <Typography>Improved Wellbeing: 80%</Typography>
          <Typography>Supported Students: 71%</Typography>
          <Typography>Reduced Absenteeism: 25%</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

function ReferralTab() {
  const [student, setStudent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Refer a Student</Typography>
      <TextField label="Student Name" value={student} onChange={e => setStudent(e.target.value)} sx={{ mt: 2 }} />
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setSubmitted(true)} disabled={submitted}>Refer</Button>
      {submitted && <Typography sx={{ mt: 2 }} color="success.main">Referral sent! (Demo)</Typography>}
    </Box>
  );
}

function CrisisTab() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Crisis Protocol</Typography>
      <Typography sx={{ mt: 2 }}>In a crisis, immediate support and escalation protocols are followed. (Demo only)</Typography>
      <Button variant="outlined" color="error" sx={{ mt: 2 }}>Escalate to Emergency</Button>
    </Box>
  );
}

function APIIntegrationTab() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">API/Data Sharing</Typography>
      <Typography sx={{ mt: 2 }}>Schools can access analytics and student data via secure API endpoints. (Demo only)</Typography>
      <Button variant="outlined" sx={{ mt: 2 }}>View API Docs</Button>
    </Box>
  );
}

function App() {
  const [tab, setTab] = useState(0);
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <AppBar position="static" color="primary" sx={{ borderRadius: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="Onboarding" />
          <Tab label="Staff Dashboard" />
          <Tab label="Referral" />
          <Tab label="Crisis" />
          <Tab label="API Integration" />
        </Tabs>
      </AppBar>
      <Box sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 2, mt: 2 }}>
        {tab === 0 && <OnboardingTab />}
        {tab === 1 && <StaffDashboardTab />}
        {tab === 2 && <ReferralTab />}
        {tab === 3 && <CrisisTab />}
        {tab === 4 && <APIIntegrationTab />}
      </Box>
    </Container>
  );
}

export default App;
