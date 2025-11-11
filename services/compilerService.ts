import { Opcode } from '../types';
import { INSTRUCTION_MAP, INSTRUCTIONS_WITH_ARGS } from '../constants';

export interface CompilationResult {
  bytecode: number[];
  stringTable: string[];
}

// Regular expression to validate variable names (alphanumeric + underscore, no starting digit)
const isValidVarName = (name: string): boolean => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);

export const compile = (sourceCode: string): CompilationResult => {
  const bytecode: number[] = [];
  const stringTable: string[] = [];
  const stringIndexMap: Map<string, number> = new Map();
  const literalVariables: Map<string, number> = new Map();
  const stringVariables: Map<string, string> = new Map();
  
  const lines = sourceCode.split('\n');

  // First pass: Process directives (VAR, STR)
  lines.forEach((line, index) => {
    const cleanedLine = line.split(';')[0].trim();
    if (cleanedLine === '') return;

    const parts = cleanedLine.split(/\s+/);
    const directive = parts[0].toUpperCase();

    if (directive === 'VAR') {
      if (parts.length !== 3) throw new Error(`VAR directive requires a name and a value on line ${index + 1}.`);
      const [_, name, valueStr] = parts;
      if (!isValidVarName(name)) throw new Error(`Invalid variable name "${name}" on line ${index + 1}.`);
      if (literalVariables.has(name) || stringVariables.has(name)) throw new Error(`Variable "${name}" already declared on line ${index + 1}.`);
      
      const value = parseInt(valueStr, 10);
      if (isNaN(value)) throw new Error(`Invalid number value for VAR "${name}" on line ${index + 1}.`);
      if (value < 0 || value > 255) throw new Error(`VAR value for "${name}" is out of range (0-255) on line ${index + 1}.`);

      literalVariables.set(name, value);
    } else if (directive === 'STR') {
      if (parts.length < 3) throw new Error(`STR directive requires a name and a string literal on line ${index + 1}.`);
      const name = parts[1];
      if (!isValidVarName(name)) throw new Error(`Invalid variable name "${name}" on line ${index + 1}.`);
      if (literalVariables.has(name) || stringVariables.has(name)) throw new Error(`Variable "${name}" already declared on line ${index + 1}.`);

      const strMatch = cleanedLine.match(/"(.*?)"/);
      if (!strMatch) throw new Error(`String literal for STR must be enclosed in double quotes on line ${index + 1}.`);
      
      stringVariables.set(name, strMatch[1]);
    }
  });

  // Second pass: Process instructions
  lines.forEach((line, index) => {
    const cleanedLine = line.split(';')[0].trim();
    if (cleanedLine === '') return;

    const parts = cleanedLine.split(/\s+/);
    const instruction = parts[0].toUpperCase();
    
    // Skip directives in this pass
    if (instruction === 'VAR' || instruction === 'STR') return;

    if (!INSTRUCTION_MAP.has(instruction)) {
      throw new Error(`Unknown instruction "${parts[0]}" on line ${index + 1}.`);
    }

    const opcode = INSTRUCTION_MAP.get(instruction)!;

    if (instruction === 'PUSH') {
      if (parts.length < 2) throw new Error(`Instruction "PUSH" requires an argument on line ${index + 1}.`);
      const argStr = parts[1];
      let value: number;

      if (literalVariables.has(argStr)) {
        value = literalVariables.get(argStr)!;
      } else {
        value = parseInt(argStr, 10);
        if (isNaN(value)) throw new Error(`Invalid argument "${argStr}" for PUSH on line ${index + 1}. Must be a number or a VAR name.`);
      }

      if (value < 0 || value > 255) throw new Error(`Argument "${value}" for PUSH on line ${index + 1} is out of range (0-255).`);
      
      bytecode.push(opcode);
      bytecode.push(value);
    } else if (instruction === 'PRINT') {
      if (parts.length === 1) {
        // PRINT a number from stack
        bytecode.push(opcode);
      } else if (parts.length === 2) {
        // PRINT a string variable
        const varName = parts[1];
        if (!stringVariables.has(varName)) throw new Error(`String variable "${varName}" not found for PRINT on line ${index + 1}.`);
        
        const strValue = stringVariables.get(varName)!;
        let strIndex: number;

        if (stringIndexMap.has(strValue)) {
          strIndex = stringIndexMap.get(strValue)!;
        } else {
          strIndex = stringTable.length;
          stringTable.push(strValue);
          stringIndexMap.set(strValue, strIndex);
        }
        bytecode.push(Opcode.PRINT_STR);
        bytecode.push(strIndex);
      } else {
        throw new Error(`PRINT instruction takes 0 or 1 argument, but got ${parts.length - 1} on line ${index + 1}.`);
      }
    } else if (INSTRUCTIONS_WITH_ARGS.has(instruction)) {
      if (parts.length < 2) throw new Error(`Instruction "${instruction}" requires an argument on line ${index + 1}.`);
      
      const arg = parseInt(parts[1], 10);
      if (isNaN(arg)) throw new Error(`Invalid argument "${parts[1]}" for ${instruction} on line ${index + 1}. Must be a number.`);
      if (arg < 0 || arg > 255) throw new Error(`Argument "${arg}" for ${instruction} on line ${index + 1} is out of range (0-255).`);
      
      bytecode.push(opcode);
      bytecode.push(arg);
    } else {
      if (parts.length > 1) throw new Error(`Instruction "${instruction}" does not take arguments on line ${index + 1}.`);
      bytecode.push(opcode);
    }
  });

  return { bytecode, stringTable };
};
