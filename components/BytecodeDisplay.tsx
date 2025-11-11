
import React from 'react';

interface BytecodeDisplayProps {
  bytecode: number[] | null;
  error: string | null;
}

const formatBytecode = (bytecode: number[]): string => {
  return bytecode
    .map((byte) => `0x${byte.toString(16).padStart(2, '0').toUpperCase()}`)
    .join(' ');
};

export const BytecodeDisplay: React.FC<BytecodeDisplayProps> = ({ bytecode, error }) => {
  let content;

  if (error) {
    content = <p className="text-red-400 whitespace-pre-wrap">{error}</p>;
  } else if (bytecode) {
    if (bytecode.length === 0) {
      content = <p className="text-gray-500">No bytecode generated. Write some code and press compile.</p>;
    } else {
      content = <p className="text-green-400 whitespace-pre-wrap break-words">{formatBytecode(bytecode)}</p>;
    }
  } else {
    content = <p className="text-gray-500">Compiled bytecode will appear here.</p>;
  }

  return (
    <div>
      <label htmlFor="bytecode-output" className="block text-sm font-medium text-gray-300 mb-2">
        Compiled Bytecode
      </label>
      <div id="bytecode-output" className="w-full h-96 p-4 font-mono text-sm bg-gray-950 border border-gray-700 rounded-lg overflow-auto shadow-inner">
        {content}
      </div>
    </div>
  );
};
