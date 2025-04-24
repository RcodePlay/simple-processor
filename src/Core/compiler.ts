// import { getCommandInfo } from '../commandProcessor';
import { CompiledInstruction } from '../types.ts';
import { commands } from '../commandRegistry.ts';

export function compileSource(text: string): CompiledInstruction[] {
  const lines = text
    .split(';')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return lines.map(line => {
    const [instruction, ...args] = line.split(' ');
    const command = commands.getOpcode(instruction.toUpperCase());
    if (!command) throw new Error(`Unknown instruction: ${instruction}`);

    return {
      opcode: command,
      argument: args.join(' ') || undefined,
    };
  });
}
