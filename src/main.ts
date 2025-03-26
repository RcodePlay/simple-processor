import { initializeCommands, processCommand } from './commandProcessor.ts';

export function setupProcessor(outputElement: HTMLElement) {
  initializeCommands();

  document.getElementById('button-reset')?.addEventListener('click', () => {
    processCommand("RST");
  });

  const form = document.getElementById('command-form') as HTMLFormElement;
  const inputElement = document.getElementById('command-input') as HTMLInputElement;

  if (form && inputElement) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const inputValue = inputElement.value.trim();
      if (!inputValue) return;

      // Parsing the command
      const parts = inputValue.split(" "); // Example: "WRITE A 42"
      const command = parts[0].toUpperCase();
      const params: any = {};

      // Breaking it down to smaller parts
      if (command === "WRITE" && parts.length >= 2) {
        params.reg = parts[1].toUpperCase();
        params.writeValue = parseInt(parts[2], 10);
        // params.key = parts[3].toLowerCase() || "default";
      }

      if (command === "READ" && parts.length >= 2) {
        params.reg = parts[1].toUpperCase();
      }

      if (command === "ADD" && parts.length == 3) {
        params.numA = parseInt(parts[1], 10);
        params.numB = parseInt(parts[2], 10);
      }

      if (command === "SUBT" && parts.length >= 3) {
        params.numA = parseInt(parts[1], 10);
        params.numB = parseInt(parts[2], 10);
      }

      if (command === "DIVS" && parts.length >= 3) {
        params.numA = parseInt(parts[1], 10);
        params.numB = parseInt(parts[2], 10);
      }

      if (command === "MULT" && parts.length >= 3) {
        params.numA = parseInt(parts[1], 10);
        params.numB = parseInt(parts[2], 10);
      }

      if (command === "INP" && parts.length >= 1) {
        params.input = parseInt(parts[1], 10);
      }

      processCommand(command, params);
      inputElement.value = ""; // Clear input after execution

    });
  }
}

setupProcessor(document.getElementById('processor-output') as HTMLElement);
