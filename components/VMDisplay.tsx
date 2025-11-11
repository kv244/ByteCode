import React from 'react';
import { VMResult } from '../services/vmService';

interface VMDisplayProps {
  result: VMResult;
}

const Status: React.FC<{ error: string | null; steps: number }> = ({ error, steps }) => {
  if (error) {
    return <p className="text-red-400">{error}</p>;
  }
  return <p className="text-green-400">Execution successful in {steps} steps. Program halted.</p>;
};

export const VMDisplay: React.FC<VMDisplayProps> = ({ result }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
       <h3 className="text-xl font-semibold text-white mb-4">Virtual Machine Execution</h3>
       <div className="space-y-4">
        <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Status</h4>
            <div className="p-3 font-mono text-sm bg-gray-950 border border-gray-700 rounded-lg">
                <Status error={result.error} steps={result.steps} />
            </div>
        </div>
        <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Output</h4>
            <div className="p-3 font-mono text-sm bg-gray-950 border border-gray-700 rounded-lg min-h-[4rem]">
                {result.output.length > 0 ? (
                    <pre className="text-gray-200 whitespace-pre-wrap">{result.output.join('\n')}</pre>
                ) : (
                    <p className="text-gray-500">No output was printed.</p>
                )}
            </div>
        </div>
        <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Final Stack State</h4>
             <div className="p-3 font-mono text-sm bg-gray-950 border border-gray-700 rounded-lg min-h-[4rem]">
                {result.finalStack.length > 0 ? (
                    <p className="text-gray-200 break-words">[ {result.finalStack.join(', ')} ]</p>
                ) : (
                    <p className="text-gray-500">[ Empty ]</p>
                )}
            </div>
        </div>
       </div>
    </div>
  );
};
