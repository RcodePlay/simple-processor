import { initializeCommands, processCommand, updateCommandOutput } from './commandProcessor.ts';
import { executeCommand } from './Core/processorCore.ts';
import { compileSource } from './Core/compiler.ts';

export function setupProcessor(outputElement: HTMLElement) {
  initializeCommands();

  document.getElementById('button-reset')?.addEventListener('click', () => {
    processCommand("RST");
  });

  document.getElementById("clear-output")?.addEventListener("click", () => {
    const outputElement = document.getElementById("processor-output");
    if (outputElement) {
      outputElement.innerHTML = "";
    }
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

  // === FILE UPLOAD HANDLER ===
  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
  const outputDiv = document.getElementById('output') as HTMLDivElement;

  if (fileInput) {
    fileInput.addEventListener('change', async (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) {
        alert('No file selected!');
        return;
      }

      try {
        const text = await file.text();
        const compiled = compileSource(text);

        console.log('Compiled Instructions:', compiled);

        if (outputDiv) {
          outputDiv.innerText = compiled
            .map(inst => `${inst.opcode}${inst.argument ? ' ' + inst.argument : ''}`)
            .join('\n');
        }


        compiled.forEach(inst => {
          updateCommandOutput(executeCommand(inst.opcode, inst.argument))
          executeCommand("0003")
        });

      } catch (error) {
        console.error('Compilation error:', error);
        alert(`Error during compilation: ${error instanceof Error ? error.message : error}`);
      }
    });
  }
}

setupProcessor(document.getElementById('processor-output') as HTMLElement);
