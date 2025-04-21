import { commandList } from '../commandProcessor';

export type CompiledInstruction = {
  opcode: string;
  argument?: string;
};

export function compileSource(text: string): CompiledInstruction[] {
  const lines = text
    .split(';')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return lines.map(line => {
    const [instruction, ...args] = line.split(' ');
    const command = commandList.get(instruction.toUpperCase());
    if (!command) throw new Error(`Unknown instruction: ${instruction}`);

    return {
      opcode: command.code,
      argument: args.join(' ') || undefined,
    };
  });
}
