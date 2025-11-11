export enum Opcode {
  HALT = 0x00,
  PUSH = 0x01,
  ADD = 0x02,
  SUB = 0x03,
  MUL = 0x04,
  DIV = 0x05,
  JUMP = 0x06,
  JZ = 0x07, // Jump if Zero
  PRINT = 0x08, // Prints a number from the stack
  PRINT_STR = 0x09, // Prints a string from the string table
}
