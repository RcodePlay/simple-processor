Just a basic 'processor', that transpiles instruction words to op codes and executes the corresponding code.
<hr/>
Just some precautions for if you return to this project: 
<ol>
    <li>1. Don't use <code>processCommand()</code> function alone. It doesn't contain any checks nor precautions. Always use <code>tryExecute()</code></li>
    <li>2. Don't use high-level code blocks like <code>processCommand()</code> or <code>commandList</code> directly, rather use lower-level functions like <code>checkCommand()</code> or </li>
</ol>
<hr/>
The supported instructions with explanation:<br>
NOP: No operation<br>
IRQ: Interrupt request<br>
RST: Reset<br>
INC: Increment program counter<br>
JUMP: Jump next instruction<br>
GPC: Get program counter<br>
WRITE: Writes to register<br>
READ: Reads from register<br>
ADD: Adds two numbers<br>
SUBT: Subtracts two numbers<br>
DIVS: Divides two numbers<br>
MULT: Multiplies two numbers<br>
LDA: Loads register to AC<br>
STA: Stores AC in register<br>
BUN: Branch unconditionally<br>
CLA: Clear AC<br>
CLE: Clear Carry<br>
INP: Store input in carry<br>
RDE: Reads Carry<br>
CLER: Clears terminal<br>
