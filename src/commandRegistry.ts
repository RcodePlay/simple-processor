// commandRegistry.ts

import type { CompiledInstruction, ParsedCommand } from './types';

type CompileFunction = (args: string[]) => CompiledInstruction;

type CommandDefinition = {
  opcode: string;
  argCount: number;
  compileFn?: CompileFunction;
};

class CommandRegistry {
  private registry: Map<string, CommandDefinition> = new Map();

  register(name: string, opcode: string, argCount: number, compileFn?: CompileFunction) {
    this.registry.set(name.toUpperCase(), { opcode, argCount, compileFn });
  }

  compile(parsed: ParsedCommand): CompiledInstruction {
    const { name, args } = parsed;
    const definition = this.registry.get(name);

    if (!definition) {
      throw new Error(`Unknown command: ${name}`);
    }
    if (args.length !== definition.argCount) {
      throw new Error(`Invalid argument count for ${name}: expected ${definition.argCount}, got ${args.length}`);
    }
    if (definition.compileFn) {
      return definition.compileFn(args);
    }
    return {
      opcode: definition.opcode,
      args: args.join(' '),
    };
  }

  listCommands(): string[] {
    return Array.from(this.registry.keys());
  }

  getOpcode(name: string): string | undefined {
    const command = this.registry.get(name.toUpperCase());
    return command?.opcode;
  }

  clear() {
    this.registry.clear();
  }
}

export function initialize() {
  commands.register("NOP", "0000", 0); // No operation
  commands.register("IRQ", "0001", 0); // Interrupt request
  commands.register("RST", "0002", 0); // Reset
  commands.register("INC", "0003", 0); // Increment PC (program counter)
  commands.register("JUMP", "0004", 0); // Jump current instruction
  commands.register("GPC", "0005", 0); // Get PC
  commands.register("WRITE", "0006", 2); // Write value to register
  commands.register("READ",  "0007", 1); // Read from register
  commands.register("ADD",  "0008", 2); // Add two numbers
  commands.register("SUBT",    "0009", 2); // Subtract two numbers
  commands.register("DIVS", "0010", 2); // Divide two numbers
  commands.register("MULT",   "0011", 2); // Multiply two values
  commands.register("LDA", "0012", 0); // Load from reg to AC
  commands.register("STA", "0013", 0); // Store AC in reg
  commands.register("BUN",  "0014", 0); // Branch unconditionally
  commands.register("CLAC", "0015", 0) // Clear AC
  commands.register("CLE",  "0016", 0); // Clear Carry bit
  commands.register("INP",  "0017", 1); // Input to AC
  commands.register("RDE",  "0018", 0); // Read Carry bit
  commands.register("CLER", "1000", 0); // Clear terminal
}

export const commands = new CommandRegistry();