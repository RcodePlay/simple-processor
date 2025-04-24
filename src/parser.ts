import { ParsedCommand } from './types.ts';

export function parseCommand(input: string): ParsedCommand {
  const [name, ...args] = input.trim().split(/\s+/);
  return { name: name.toUpperCase(), args };
}

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