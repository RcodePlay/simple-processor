import { executeCommand } from './Core/processorCore.ts';

let commandList = new Map<string, { code: string; handler?: Function }>();

/**
 * Initializes available commands and their handlers.
 */
function initializeCommands() {
  console.log("Processor was initialized successfully.");
  commandList.clear();

  commandList.set("NOP", { code: "0000" }); // No operation
  commandList.set("IRQ", { code: "0001" }); // Interrupt request
  commandList.set("RST", { code: "0002" }); // Reset
  commandList.set("INC", { code: "0003" }); // Increment program counter

  // Define WRITE command with handler
  commandList.set("WRITE", {
    code: "0004",
    handler: (params: { reg: string; writeValue: number }) => {
      if (!params || !params.reg || params.writeValue === undefined) {
        updateCommandOutput("WRITE command missing required parameters.");
        return;
      }
      const result = executeCommand("0004", params);
      updateCommandOutput(`WRITE executed: ${JSON.stringify(result)}`);
    },
  });

  // Define READ command with handler
  commandList.set("READ", {
    code: "0005",
    handler: (params: { reg: string }) => {
      if (!params || !params.reg) {
        updateCommandOutput("READ command missing required params.");
        return;
      }
      const result = executeCommand("0005", params);
      updateCommandOutput(`READ result: ${JSON.stringify(result)}`);
    },
  });

  commandList.set("ADD", {
    code: "0006",
    handler: (params: { numA: number; numB: number }) => {
      if (!params || !params.numA || !params.numB ) {
        updateCommandOutput("ADD command missing required params.");
        return;
      }
      const result = executeCommand("0006", params);
      updateCommandOutput(`ADD result: ${JSON.stringify(result)}`);
    }
  });

  commandList.set("JUMP", { code: "0007" }); // Jump and skip the next instruction
  commandList.set("GPC", { code: "0008" }); // Get program counter
}

/**
 * Processes a command, executing its associated handler if it exists.
 */
function processCommand(command: string, params?: any) {
  if (!commandList.has(command)) {
    updateCommandOutput(`Unknown command: ${command}`);
    return;
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
    updateCommandOutput(`Command executed: ${JSON.stringify(result)}`);
  }
}

/**
 * Retrieves a command's information from the command list.
 */
function getCommand(command: string) {
  if (!commandList.has(command)) {
    updateCommandOutput(`Unknown command: ${command}`);
    return null;
  }
  return commandList.get(command);
}

/**
 * Updates the command output UI in the HTML page.
 */
function updateCommandOutput(message: string) {
  const outputElement = document.getElementById("processor-output");
  if (outputElement) {
    outputElement.innerHTML = message;
  }
}

export { initializeCommands, processCommand, getCommand };
