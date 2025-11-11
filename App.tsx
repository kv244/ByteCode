import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InstructionGuide } from './components/InstructionGuide';
import { CodeEditor } from './components/CodeEditor';
import { BytecodeDisplay } from './components/BytecodeDisplay';
import { CompileButton } from './components/CompileButton';
import { RunButton } from './components/RunButton';
import { VMDisplay } from './components/VMDisplay';
import { compile, CompilationResult } from './services/compilerService';
import { execute, VMResult } from './services/vmService';

const defaultCode = `; Variables Demo
; Defines a string and a number variable,
; then prints them to the VM output.

STR GREETING "Hello from the VM!"
VAR COUNT 10

PRINT GREETING ; Prints the string variable

PUSH COUNT     ; Pushes the value of COUNT (10)
PRINT          ; Pops 10 and prints it

HALT
`;

const App: React.FC = () => {
  const [sourceCode, setSourceCode] = useState<string>(defaultCode);
  const [compiledOutput, setCompiledOutput] = useState<CompilationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVmRunning, setIsVmRunning] = useState<boolean>(false);
  const [vmResult, setVmResult] = useState<VMResult | null>(null);


  const handleCompile = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setCompiledOutput(null);
    setVmResult(null);

    // Simulate a short delay for better UX
    setTimeout(() => {
      try {
        const result = compile(sourceCode);
        setCompiledOutput(result);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred during compilation.');
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [sourceCode]);

  const handleRun = useCallback(() => {
    if (!compiledOutput || compiledOutput.bytecode.length === 0) return;

    setIsVmRunning(true);
    setVmResult(null);

    // Simulate delay for UX
    setTimeout(() => {
        const result = execute(compiledOutput.bytecode, compiledOutput.stringTable);
        setVmResult(result);
        setIsVmRunning(false);
    }, 300);
  }, [compiledOutput]);

  const bytecode = compiledOutput?.bytecode ?? null;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <InstructionGuide />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <CodeEditor value={sourceCode} onChange={setSourceCode} />
          <BytecodeDisplay bytecode={bytecode} error={error} />
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <CompileButton onClick={handleCompile} isLoading={isLoading} />
          <RunButton onClick={handleRun} isLoading={isVmRunning} disabled={!bytecode || bytecode.length === 0 || !!error} />
        </div>
        {vmResult && (
            <div className="mt-8 max-w-4xl mx-auto">
                <VMDisplay result={vmResult} />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
