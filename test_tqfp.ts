import { fp } from "@tscircuit/footprinter";
console.log("pad x:", fp.string("tqfp64").circuitJson().filter(c => c.type === "pcb_smtpad")[0].x);
console.log("pad width:", fp.string("tqfp64").circuitJson().filter(c => c.type === "pcb_smtpad")[0].width);
