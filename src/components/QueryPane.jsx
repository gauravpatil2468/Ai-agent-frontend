import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

export default function QueryPane({ mode, sessionId }) {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [loading, setLoading] = useState(false);
    const baseUrl = 'https://multi-agent-api-g6gf.onrender.com';

    useEffect(() => {
        setQuery('');
        setResponse('');
        setDisplayedText('');
    }, [mode]);

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
    return (
        <div className="flex flex-col bg-[#0B1739]" style={{ minHeight: 'calc(100vh - 80px)' }}>

        
            <div className="flex flex-col flex-1 p-6 space-y-4">
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
                    <div className="flex-1 overflow-auto bg-[#0B1739] border border-gray-600 rounded-lg p-4">
                        <div className="prose text-white whitespace-pre-wrap">
                            <ReactMarkdown>{displayedText}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

        
            <Footer mode={mode} />
        </div>
    );


}


function Footer({ mode }) {
    const getModeInfo = () => {
        if (mode === 'support') {
            return {
                title: 'Support Agent Assistant',
                description: 'Use this assistant to manage client orders, classes, and communication efficiently.',
                examples: [
                    'What classes are available this week?',
                    'Has order #12345 been paid?',
                    'Create an order for Yoga Beginner for client Priya Sharma'
                ]
            };
        } else {
            return {
                title: 'Dashboard Insights Agent',
                description: 'Ask data-driven questions about revenue, attendance, and client behavior from your database.',
                examples: [
                    'How much revenue did we generate this month?',
                    'Which course has the highest enrollment?',
                    'What is the attendance percentage for Pilates?',
                    'How many inactive clients do we have?'
                ]
            };
        }
    };

    const { title, description, examples } = getModeInfo();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="mt-8 border-t border-gray-700 pt-4 text-sm text-[#AEB9E1]"
            >
                <h2 className="text-base font-semibold mb-1">{title}</h2>
                <p className="mb-2">{description}</p>
                <p className="text-xs opacity-80">Sample queries:</p>
                <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                    {examples.map((ex, i) => (
                        <li key={i}>"{ex}"</li>
                    ))}
                </ul>
            </motion.div>
        </AnimatePresence>
    );
}
