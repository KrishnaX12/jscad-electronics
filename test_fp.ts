import { fp } from "@tscircuit/footprinter";
console.log(fp.string("tqfp64").circuitJson().filter(c => c.type === "pcb_smtpad")[0]);
