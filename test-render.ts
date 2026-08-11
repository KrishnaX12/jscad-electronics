import { SOT457 } from "./lib/SOT-457";
import { h, Fragment } from "./lib/vanilla/h";
import { render } from "./lib/vanilla/render";
import * as jscad from "@jscad/modeling";

const vnode = h(SOT457);
const r = render(vnode, jscad);
console.log("Geometries:", r.geometries.length);
