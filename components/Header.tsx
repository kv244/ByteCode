
import React from 'react';

export const Header: React.FC = () => (
  <header className="text-center p-4 md:p-6">
    <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">ByteCode Compiler</h1>
    <p className="text-lg text-gray-400 mt-2">A simple compiler for a toy assembly-like language.</p>
  </header>
);
