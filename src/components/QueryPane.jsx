import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function QueryPane({ mode, sessionId }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [loading, setLoading] = useState(false);
  const baseUrl = 'https://multi-agent-api-g6gf.onrender.com';

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    setDisplayedText('');
    try {
      const params = new URLSearchParams({ q: query });
      const url = `${baseUrl}/${mode}/query?${params}`;
      const headers = {};
      if (mode === 'support' && sessionId) {
        headers['session-id'] = sessionId;
      }

      const res = await fetch(url, { headers });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const json = await res.json();
      const raw = json?.data?.agent_response?.raw ?? json?.data?.agent_response;

      if (typeof raw !== 'string') {
        throw new Error('Unexpected response format');
      }

      setResponse(raw);
    } catch (err) {
      setResponse(`**Error:** ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    if (!response) return;

    let i = 0;
    const speed = 15; 

    const interval = setInterval(() => {
      setDisplayedText(prev => prev + response[i]);
      i++;
      if (i >= response.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [response]);

  useEffect(() => {
  setQuery('');
  setResponse('');
  setDisplayedText('');
}, [mode]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter your query..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 p-2 bg-[#0B1739] border border-gray-600 rounded-lg focus:outline-none text-[#AEB9E1]"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-[#00C2FF] rounded-2xl font-medium text-white hover:bg-[#1E2C57] disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </div>

      {displayedText && (
        <div className="bg-[#0B1739] border border-gray-600 rounded-lg p-4">
          <div className="prose text-white whitespace-pre-wrap">
            <ReactMarkdown>{displayedText}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
