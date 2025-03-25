// The Arithmetic and Logic Unit

function add(a: number, b: number) {
  return a + b;
}

function subtract(a: number, b: number) {
  return a - b;
}

function multiply(a: number, b: number) {
  return a * b;
}

function divide(a: number, b: number) {
  return a / b;
}

function and(inputA: number, inputB: number) {
  return inputA == 1 && inputB == 1;
}

function or(inputA: number, inputB: number) {
  return inputA == 1 || inputB == 1;
}

function not(input: number) {
  return input == 0;
}

function xor(inputA: number, inputB: number) {
  return inputA !== inputB;
}

function squareRoot(input: number) {
  return Math.sqrt(input);
}

export { add, subtract, multiply, divide, and, or, not, xor, squareRoot };