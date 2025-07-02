import React from 'react';

export default function NavBar({ active, onChange }) {
  return (
    <nav className="bg-[#0A1330] p-4 flex space-x-4">
      <button
        onClick={() => onChange('support')}
        className={`
          px-4 py-2 rounded-2xl font-semibold
          ${active === 'support'
            ? 'bg-[#CB3CFF] text-white'
            : 'text-[#AEB9E1] hover:bg-[#1E2C57]'}
        `}
      >
        Support Agent
      </button>
      <button
        onClick={() => onChange('dashboard')}
        className={`
          px-4 py-2 rounded-2xl font-semibold
          ${active === 'dashboard'
            ? 'bg-[#CB3CFF] text-white'
            : 'text-[#AEB9E1] hover:bg-[#1E2C57]'}
        `}
      >
        Dashboard Agent
      </button>
    </nav>
  );
}
