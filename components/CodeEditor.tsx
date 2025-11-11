
import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => (
  <div>
    <label htmlFor="source-code" className="block text-sm font-medium text-gray-300 mb-2">
      Source Code
    </label>
    <textarea
      id="source-code"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-96 p-4 font-mono text-sm bg-gray-950 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none shadow-inner"
      placeholder="Enter your code here..."
      spellCheck="false"
    />
  </div>
);
