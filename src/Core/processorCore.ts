let programCount = 0

// REGISTER FUNCTIONS
function getRegister(reg: 'A' | 'B'): any {
  const data = localStorage.getItem(`register_${reg}`);
  return data ? JSON.parse(data) : {};
}

function saveRegister(reg: 'A' | 'B', value: any): void {
  localStorage.setItem(`register_${reg}`, JSON.stringify(value));
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
      console.info("You triggered the NOP command, which stands for 'No operation', meaning, now happens absolutely nothing.")
      return "NOP triggered";
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
    "0004": (params: { reg: 'A' | 'B'; writeValue: any; key?: string }) => {
      if (!params || !params.reg || params.writeValue === undefined) {
        console.warn("WRITE command missing parameters.");
        return "WRITE failed: Missing parameters.";
      }
      const regData = getRegister(params.reg);
      regData[params.key || "default"] = params.writeValue;
      saveRegister(params.reg, regData);
      return `Written ${params.writeValue} to register ${params.reg}`;
    },
    "0005": (params: { reg: 'A' | 'B' }) => {
      if (!params || !params.reg) {
        console.warn("READ command missing parameters.");
        return "READ failed: Missing parameters.";
      }
      return getRegister(params.reg);
    },
    "0006": (params: { numA: number, numB: number})=> {
      if (!params || !params.numA || !params.numB ) {
        console.warn("ADD command missing parameters.");
        return "ADD failed: Missing parameters";
      }
      let result = params.numA + params.numB;
      console.log("ADD command result:", result);
      return `Result of ${params.numA} + ${params.numB} is ${result}`;
    },
    "0007": () => {
      jumpNextInstruction();
      return "Skipped 1 instruction";
    },
    "0008": () => {
      let currentLine = getProgramCounter();
      return `Current line is ${currentLine}`;
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
