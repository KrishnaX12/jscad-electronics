import fs from 'fs';
const indexFile = 'lib/index.ts';
let content = fs.readFileSync(indexFile, 'utf8');
content += 'export * from "./JSTPH2_0mm"\n';
content += 'export * from "./JSTXH2_5mm"\n';
fs.writeFileSync(indexFile, content);
