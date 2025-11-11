import { Opcode } from '../types';

const MAX_STEPS = 10000; // Prevents infinite loops

export interface VMResult {
  output: string[];
  error: string | null;
  finalStack: number[];
  steps: number;
}

export const execute = (bytecode: number[], stringTable: string[]): VMResult => {
  if (!bytecode || bytecode.length === 0) {
    return { output: [], error: 'No bytecode to execute.', finalStack: [], steps: 0 };
  }

  const stack: number[] = [];
  let ip = 0; // Instruction Pointer
  const output: string[] = [];
  let steps = 0;

  while (ip < bytecode.length && steps < MAX_STEPS) {
    const instruction = bytecode[ip];
    ip++;
    steps++;

    switch (instruction) {
      case Opcode.HALT:
        return { output, error: null, finalStack: stack, steps };

      case Opcode.PUSH: {
        if (ip >= bytecode.length) return { output, error: `Runtime Error: PUSH expects an argument but found end of code.`, finalStack: stack, steps };
        const value = bytecode[ip];
        ip++;
        stack.push(value);
        break;
      }

      case Opcode.ADD:
      case Opcode.SUB:
      case Opcode.MUL:
      case Opcode.DIV: {
        if (stack.length < 2) return { output, error: `Runtime Error: Stack underflow on arithmetic operation.`, finalStack: stack, steps };
        const b = stack.pop()!;
        const a = stack.pop()!;
        if (instruction === Opcode.ADD) stack.push(a + b);
        if (instruction === Opcode.SUB) stack.push(a - b);
        if (instruction === Opcode.MUL) stack.push(a * b);
        if (instruction === Opcode.DIV) {
            if (b === 0) return { output, error: `Runtime Error: Division by zero.`, finalStack: stack, steps };
            stack.push(Math.floor(a / b));
        }
        break;
      }
      
      case Opcode.PRINT: {
        if (stack.length < 1) return { output, error: `Runtime Error: Stack underflow on PRINT.`, finalStack: stack, steps };
        const value = stack.pop()!;
        output.push(value.toString());
        break;
      }

      case Opcode.PRINT_STR: {
        if (ip >= bytecode.length) return { output, error: `Runtime Error: PRINT_STR expects an argument but found end of code.`, finalStack: stack, steps };
        const strIndex = bytecode[ip];
        ip++;
        if (strIndex >= stringTable.length) return { output, error: `Runtime Error: Invalid string index ${strIndex}.`, finalStack: stack, steps };
        output.push(stringTable[strIndex]);
        break;
      }

      case Opcode.JUMP: {
        if (ip >= bytecode.length) return { output, error: `Runtime Error: JUMP expects an address but found end of code.`, finalStack: stack, steps };
        const addr = bytecode[ip];
        if (addr >= bytecode.length) return { output, error: `Runtime Error: JUMP address ${addr} is out of bounds.`, finalStack: stack, steps };
        ip = addr;
        break;
      }

      case Opcode.JZ: { // Jump if Zero
        if (ip >= bytecode.length) return { output, error: `Runtime Error: JZ expects an address but found end of code.`, finalStack: stack, steps };
        const addr = bytecode[ip];
        ip++; // Consume address argument now
        if (stack.length < 1) return { output, error: `Runtime Error: Stack underflow on JZ.`, finalStack: stack, steps };
        const value = stack.pop()!;
        if (value === 0) {
            if (addr >= bytecode.length) return { output, error: `Runtime Error: JZ address ${addr} is out of bounds.`, finalStack: stack, steps };
            ip = addr;
        }
        break;
      }

      default:
        return { output, error: `Runtime Error: Unknown opcode 0x${instruction.toString(16).toUpperCase()} at address ${ip - 1}.`, finalStack: stack, steps };
    }
  }

  if (steps >= MAX_STEPS) {
    return { output, error: 'Runtime Error: Maximum execution steps exceeded. Possible infinite loop.', finalStack: stack, steps };
  }

  return { output, error: 'Runtime Error: Execution finished without a HALT instruction.', finalStack: stack, steps };
};
