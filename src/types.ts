export type ParsedCommand = {
  name: string;
  args: string[];
};

export type CompiledInstruction = {
  opcode: string;
  args?: string;
};
