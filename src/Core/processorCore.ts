import * as alu from './ALU.ts';
import { CompiledInstruction } from '../types.ts';

let programCount = 0;

// REGISTER FUNCTIONS
function getRegister(reg: 'A' | 'B') {
  const data = localStorage.getItem(`register_${reg}`);
  return data ? JSON.parse(data) : {};
}

function saveRegister(reg: 'A' | 'B', value: any) {
  localStorage.setItem(`register_${reg}`, JSON.stringify(value));
  return value;
}

function getAccumulator() {
  const data = localStorage.getItem("accumulator");
  return data ? JSON.parse(data) : {};
}

function storeAccumulator(value: any) {
  localStorage.setItem("accumulator", JSON.stringify(value));
  return value;
}

function getCarry() {
  const data = localStorage.getItem("carry");
  return data ? JSON.parse(data) : {};
}

function storeCarry(value: any) {
  localStorage.setItem("carry", JSON.stringify(value));
  return value;
}

// PROGRAM COUNTER FUNCTIONS
function incrementProgramCounter(incrementBy: number) {
  return programCount += incrementBy;
}

function resetProgramCounter() {
  return programCount = 0;
}

function getProgramCounter() {
  return programCount;
}

function jumpNextInstruction() {
  incrementProgramCounter(2);
}

export function executeCommand({ opcode, args }: CompiledInstruction) {
  const commandDispatch: { [key: string]: (params?: any) => any } = {
    "0000": () => "Executing NOP",
    "0001": () => "IRQ Triggered",
    "0002": () => {
      localStorage.removeItem("register_A");
      localStorage.removeItem("register_B");
      resetProgramCounter();
      return "System reset";
    },
    "0003": () => `Program line: ${incrementProgramCounter(1)}`,
    "0004": () => {
      jumpNextInstruction();
      return "Skipped 1 instruction";
    },
    "0005": () => `Current line is ${getProgramCounter()}`,
    "0006": ({ reg, writeValue }: { reg: 'A' | 'B'; writeValue: any }) =>
      `Written ${saveRegister(reg, writeValue)} to register ${reg}`,
    "0007": ({ reg }: { reg: 'A' | 'B' }) => getRegister(reg),
    "0008": ({ numA, numB }: { numA: number; numB: number }) =>
      `Result: ${alu.add(numA, numB)}`,
    "0009": ({ numA, numB }: { numA: number; numB: number }) =>
      `Result: ${alu.subtract(numA, numB)}`,
    "0010": ({ numA, numB }: { numA: number; numB: number }) =>
      `Result: ${alu.divide(numA, numB)}`,
    "0011": ({ numA, numB }: { numA: number; numB: number }) =>
      `Result: ${alu.multiply(numA, numB)}`,
    "0012": () => `Loaded ${storeAccumulator(getRegister("A"))} to AC.`,
    "0013": () => `Saved ${saveRegister("A", getAccumulator())} to reg A.`,
    "0014": () => "BRN not implemented.",
    "0015": () => `Cleared AC, current value: ${storeAccumulator(0)}`,
    "0016": () => `Cleared carry, current value: ${storeCarry(0)}`,
    "0017": ({ input }: { input: number }) =>
      `Loaded ${storeAccumulator(input)} from UI to AC.`,
    "0018": () => `Carry: ${getCarry()}`,
    "1000": () => "Cleared terminal"
  };

  const action = commandDispatch[opcode];
  return action ? action(args) : "Unknown command code.";
}

