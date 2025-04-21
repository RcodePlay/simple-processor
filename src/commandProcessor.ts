import { executeCommand } from './Core/processorCore.ts';

let commandList = new Map<string, { code: string; handler?: Function }>();

/**
 * Initializes available commands and their handlers.
 */
function initializeCommands() {
  console.log("Processor was initialized successfully.");
  updateCommandOutput("Processor initialize", "info");
  commandList.clear();

  commandList.set("NOP", { code: "0000" }); // No operation
  commandList.set("IRQ", { code: "0001" }); // Interrupt request
  commandList.set("RST", { code: "0002" }); // Reset
  commandList.set("INC", { code: "0003" }); // Increment program counter
  commandList.set("JUMP", { code: "0004" }); // Jump and skip the next instruction
  commandList.set("GPC", { code: "0005" }); // Get program counter

  // Define WRITE command with handler
  commandList.set("WRITE", {
    code: "0006",
    handler: (params: { reg: string; writeValue: number }) => {
      if (!params || !params.reg || params.writeValue === undefined) {
        updateCommandOutput("WRITE command missing required parameters.", "error");
        return;
      }
      const result = executeCommand("0006", params);
      updateCommandOutput(`WRITE executed: ${JSON.stringify(result)}`, "success");
    },
  });

  // Define READ command with handler
  commandList.set("READ", {
    code: "0007",
    handler: (params: { reg: string }) => {
      if (!params || !params.reg) {
        updateCommandOutput("READ command missing required params.", "error");
        return;
      }
      const result = executeCommand("0007", params);
      updateCommandOutput(`READ result: ${JSON.stringify(result)}`, "success");
    },
  });

  commandList.set("ADD", {
    code: "0008",
    handler: (params: { numA: number; numB: number }) => {
      if (!params || !params.numA || !params.numB ) {
        updateCommandOutput("ADD command missing required params.", "error");
        return;
      }
      const result = executeCommand("0008", params);
      updateCommandOutput(`ADD result: ${JSON.stringify(result)}`, "success");
    }
  });

  commandList.set("SUBT", {
    code: "0009",
    handler: (params: { numA: number; numB: number }) => {
      if (!params || !params.numA || !params.numB) {
        updateCommandOutput("SUBT command missing required params.", "error");
        return;
      }
      const result = executeCommand("0009", params);
      updateCommandOutput(`SUBT result: ${JSON.stringify(result)}`, "success");
    }
  })

  commandList.set("DIVS", {
    code: "0010",
    handler: (params: { numA: number; numB: number }) => {
      if (!params || !params.numA || !params.numB) {
        updateCommandOutput("DIVS command missing required params.", "error");
        return;
      }
      const result = executeCommand("0010", params);
      updateCommandOutput(`DIVS result: ${JSON.stringify(result)}`, "success");
    }
  })

  commandList.set("MULT", {
    code: "0011",
    handler: (params: { numA: number; numB: number }) => {
      if (!params || !params.numA || !params.numB) {
        updateCommandOutput("MULT command missing required params.", "error");
        return;
      }
      const result = executeCommand("0011", params);
      updateCommandOutput(`MULT result: ${JSON.stringify(result)}`, "success");
    }
  })

  commandList.set("LDA", { code: "0012" }) // Load memory word to accumulator
  commandList.set("STA", { code: "0013" }) // Store accumulator content in memory
  commandList.set("BUN", { code: "0014" }) // Branch unconditionally
  commandList.set("CLA", { code: "0015" }) // Clear accumulator
  commandList.set("CLE", { code: "0016" }) // Clear carry bit
  commandList.set("INP", {
    code: "0017",
    handler: (params: { input: number }) => {
      if (!params || !params.input) {
        updateCommandOutput("INP command missing required params.", "error")
        return;
      }
      const result = executeCommand("0017", params);
      updateCommandOutput(`INP result: ${JSON.stringify(result)}`, "success");
    } // Store input in AC
  })

  commandList.set("RDE", { code: "0018" }) // Read carry

  commandList.set("CLER", { code: "1000" })

}

/**
 * Processes a command, executing its associated handler if it exists.
 */
function processCommand(command: string, params?: any) {
  if (!commandList.has(command)) {
    updateCommandOutput(`Unknown command: ${command}`, "error");
    return;
  }

  if (command === "CLER") {
    const outputElement = document.getElementById("processor-output");
    if (outputElement) {
      outputElement.innerHTML = "";
    }
  }

  const commandObj = commandList.get(command);
  if (commandObj) {
    console.debug(`Processing command: ${command} (${commandObj.code})`);

    // Execute the handler if it exists
    if (commandObj.handler) {
      return commandObj.handler(params); // Executes handler if available
    }

    // If there's no handler, fallback to executing the command directly
    const result = executeCommand(commandObj.code, params);
    updateCommandOutput(`Command executed: ${JSON.stringify(result)}`, "info");
  }
}

/**
 * Retrieves a command's information from the command list.
 */
function getCommand(command: string) {
  if (!commandList.has(command)) {
    updateCommandOutput(`Unknown command: ${command}`, "error");
    return null;
  }
  return commandList.get(command);
}

/**
 * Updates the command output UI in the HTML page.
 */
export function updateCommandOutput(message: string, type: "info" | "error" | "success" = "info") {
  const outputElement = document.getElementById("processor-output");
  if (outputElement) {
    const timestamp = new Date().toLocaleTimeString();
    const color = {
      info: "#ccc",
      error: "#f88",
      success: "#8f8"
    }[type];

    const newLine = document.createElement("div");
    newLine.style.color = color;
    newLine.innerText = `[${timestamp}] ${message}`;

    outputElement.appendChild(newLine);
    outputElement.scrollTop = outputElement.scrollHeight; // Auto-scroll to bottom
  }
}



export { initializeCommands, processCommand, getCommand, commandList };
