import * as alu from './ALU.ts';

let programCount = 0

// REGISTER FUNCTIONS
function getRegister(reg: 'A' | 'B'): any {
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
  console.log("Program count:", programCount);
  return programCount += incrementBy
}

function resetProgramCounter() {
  return programCount = 0
}

function getProgramCounter() {
  return programCount;
}

function jumpNextInstruction() {
  const currentLine = getProgramCounter()
  const newLine = incrementProgramCounter(2)
  console.log(`Jumped from ${currentLine} to ${newLine}`)
}

/*
 * The mother function of the whole processor (for now at least).
 * What does it do?
 * - Simple, it looks up the inputted opcode, then it runs the code that is defined under that opcode.
 */
export function executeCommand(code: string, params?: any) {
  const commandDispatch: { [key: string]: (params?: any) => any } = {
    "0000": () => {
      console.info("You triggered the NOP command, which stands for 'No operation', meaning, now happens... absolutely nothing.")
      return "Executing NOP";
    },
    "0001": () => {
      console.log("IRQ, process interrupted successfully");
      return "IRQ Triggered";
    },
    "0002": () => {
      console.log("RST, system reset successfully");
      localStorage.removeItem("register_A");
      localStorage.removeItem("register_B"); // Clear both registers
      resetProgramCounter(); // Reset the program counter to start again
      return "System reset";
    },
    "0003": () => {
      incrementProgramCounter(1);
      console.log("Incremented program counter")
      return `Program line: ${programCount}`;
    },
    "0004": () => {
      jumpNextInstruction();
      return "Skipped 1 instruction";
    },
    "0005": () => {
      let currentLine = getProgramCounter();
      return `Current line is ${currentLine}`;
    },
    "0006": (params: { reg: 'A' | 'B'; writeValue: any; key?: string }) => {
      if (!params || !params.reg || params.writeValue === undefined) {
        console.warn("WRITE command missing parameters.");
        return "WRITE failed: Missing parameters.";
      }
      // const regData = getRegister(params.reg);
      // regData[params.key || "default"] = params.writeValue;

      saveRegister(params.reg, params.writeValue);
      return `Written ${params.writeValue} to register ${params.reg}`;
    },
    "0007": (params: { reg: 'A' | 'B' }) => {
      if (!params || !params.reg) {
        console.warn("READ command missing parameters.");
        return "READ failed: Missing parameters.";
      }
      return getRegister(params.reg);
    },
    "0008": (params: { numA: number, numB: number})=> {
      if (!params || !params.numA || !params.numB ) {
        console.warn("ADD command missing parameters.");
        return "ADD failed: Missing parameters";
      }
      let result = alu.add(params.numA, params.numB);
      console.log("ADD command result:", result);
      return `Result of ${params.numA} + ${params.numB} is ${result}`;
    },
    "0009": (params: { numA: number, numB: number}) => {
      if (!params || !params.numA || !params.numB) {
        console.warn("SUBT command missing parameters.");
        return "SUBT failed: Missing parameters";
      }
      let result = alu.subtract(params.numA, params.numB);
      console.log("SUBT command result:", result);
      return `Result of ${params.numA} - ${params.numB} is ${result}`;
    },
    "0010": (params: {numA: number, numB: number}) => {
      if (!params || !params.numA || !params.numB) {
        console.warn("DIVS command missing parameters.");
        return "DIVS failed: Missing parameters";
      }
      let result = alu.divide(params.numA, params.numB);
      console.log("DIVS command result:", result);
      return `Result of ${params.numA} / ${params.numB} is ${result}`;
    },
    "0011": (params: {numA: number, numB: number}) => {
      if (!params || !params.numA || !params.numB) {
        console.warn("MULT command missing parameters.");
        return "MULT failed: Missing parameters";
      }
      let result = alu.multiply(params.numA, params.numB);
      console.log("MULT command result:", result);
      return `Result of ${params.numA} * ${params.numB} is ${result}`;
    },
    "0012": () => {
      let regData = getRegister("A");

      storeAccumulator(regData);
      return `Loaded ${regData} to AC.`;

    },
    "0013": () => {
      let acData = getAccumulator();
      let result = saveRegister("A", acData);
      return `Saved ${result} to reg A.`
    },
    "0014": () => {
      // Should branch unconditionally, but I don't have any ideas on how to implement this
    },
    "0015": () => {
      let acData = 0
      let result = storeAccumulator(acData);
      return `Cleared AC, current value: ${result}`
    },
    "0016": () => {
      let carryData = 0
      let result = storeCarry(carryData);
      return `Cleared carry, current value: ${result}`
    },
    "0017": (params: { input: number }) => {
      if (!params || !params.input) {
        console.warn("INP command missing parameters.");
        return "INP failed: Missing parameters";
      }
      let result = storeAccumulator(params.input);
      return `Loaded ${result} from UI to AC.`
    },
    "0018": () => {
      let result = getCarry();
      return `Carry: ${result}`;
    },
    "1000": () => {
      return "Cleared terminal"
    }
  };

  const action = commandDispatch[code];
  if (action) {
    return action(params);
  } else {
    console.error("Unknown command code:", code);
    return "Unknown command code.";
  }
}
