import React from 'react';

const instructions = [
  { name: 'VAR <name> <num>', desc: 'Declares a numeric variable (0-255).' },
  { name: 'STR <name> "str"', desc: 'Declares a string variable.' },
  { name: 'PUSH <num|var>', desc: 'Pushes a number or a numeric variable onto the stack.' },
  { name: 'ADD', desc: 'Pops two values, adds them, pushes result.' },
  { name: 'SUB', desc: 'Pops two values, subtracts, pushes result.' },
  { name: 'MUL', desc: 'Pops two values, multiplies them, pushes result.' },
  { name: 'DIV', desc: 'Pops two values, divides them, pushes result.' },
  { name: 'JUMP <addr>', desc: 'Sets instruction pointer to the address.' },
  { name: 'JZ <addr>', desc: 'Pops a value; if it is zero, jumps to address.' },
  { name: 'PRINT', desc: 'Pops a number from the stack and prints it.' },
  { name: 'PRINT <str_var>', desc: 'Prints the value of a string variable.' },
  { name: 'HALT', desc: 'Stops execution.' },
  { name: '; comment', desc: 'Lines can be commented out using a semicolon.' },
];

export const InstructionGuide: React.FC = () => (
  <div className="bg-gray-800 rounded-lg p-6 max-w-4xl mx-auto">
    <h3 className="text-xl font-semibold text-white mb-3">Language Guide</h3>
    <p className="text-gray-400 mb-4">The compiler processes directives (`VAR`, `STR`) first, then compiles instructions.</p>
    <ul className="space-y-2">
      {instructions.map((inst) => (
        <li key={inst.name} className="flex flex-col sm:flex-row">
          <code className="text-cyan-400 font-mono font-bold w-40 flex-shrink-0">{inst.name}</code>
          <span className="text-gray-300">{inst.desc}</span>
        </li>
      ))}
    </ul>
  </div>
);
