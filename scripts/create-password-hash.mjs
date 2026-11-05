import { randomBytes, scryptSync } from "node:crypto";
// Read from stdin so the password never appears in the process argument list.
let password = "";
for await (const chunk of process.stdin) password += chunk;
password = password.replace(/\r?\n$/, "");
if (password.length < 14 || password.length > 256) throw new Error("Password must contain 14–256 characters");
const salt = randomBytes(16).toString("hex");
console.log(`scrypt$${salt}$${scryptSync(password, salt, 32).toString("hex")}`);
