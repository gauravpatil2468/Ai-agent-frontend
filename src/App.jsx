import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import NavBar from './components/NavBar';
import QueryPane from './components/QueryPane';

export default function App() {
  const [mode, setMode] = useState('support');
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  return (
    <div className="min-h-screen bg-[#081028] text-white font-sans">
      <NavBar active={mode} onChange={setMode} />
      <QueryPane mode={mode} sessionId={sessionId} />
    </div>
  );
}
