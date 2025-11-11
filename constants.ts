import { Opcode } from './types';

export const INSTRUCTION_MAP: Map<string, Opcode> = new Map([
  ['HALT', Opcode.HALT],
  ['PUSH', Opcode.PUSH],
  ['ADD', Opcode.ADD],
  ['SUB', Opcode.SUB],
  ['MUL', Opcode.MUL],
  ['DIV', Opcode.DIV],
  ['JUMP', Opcode.JUMP],
  ['JZ', Opcode.JZ],
  ['PRINT', Opcode.PRINT],
  // Note: PRINT_STR is used internally by the compiler for PRINT <string_var>
  ['PRINT_STR', Opcode.PRINT_STR],
]);

// Instructions that are followed by a 1-byte argument in the bytecode
export const INSTRUCTIONS_WITH_ARGS: Set<string> = new Set(['PUSH', 'JUMP', 'JZ', 'PRINT_STR']);
