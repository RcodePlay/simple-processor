import { executeCommand } from './Core/processorCore.ts';
import { compileSource } from './Core/compiler.ts';
import { updateCommandOutput } from './parser.ts';

import { commands, initialize } from './commandRegistry.ts';
import { parseCommand } from './parser.ts';

export function setupProcessor(outputElement: HTMLElement) {
  initialize();

  document.getElementById('button-reset')?.addEventListener('click', () => {
    executeCommand({ opcode: "0002" });
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
      const inputValue = inputElement.value
      if (!inputValue) return;

      const parsedCommand = parseCommand(inputValue);
      console.log(parsedCommand);

      const compiledInstruction = commands.compile(parsedCommand);
      updateCommandOutput(executeCommand(compiledInstruction));

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
            .map(inst => `${inst.opcode}${inst.args ? ' ' + JSON.stringify(inst.args) : ''}`)
            .join('\n');
        }


        compiled.forEach(inst => {
          updateCommandOutput(executeCommand(inst))
          executeCommand({ opcode: "0003" }); // increment PC after every line of program
        });

      } catch (error) {
        console.error('Compilation error:', error);
        alert(`Error during compilation: ${error instanceof Error ? error.message : error}`);
      }
    });
  }
}

setupProcessor(document.getElementById('processor-output') as HTMLElement);
