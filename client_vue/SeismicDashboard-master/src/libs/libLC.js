import {SolidFill} from "@arction/lcjs";


export function forEachIn(object, clbk) {
  const obj = {};
  for (const a in object)
    obj[a] = clbk(object[a]);
  return obj
}

export function createColorObject(colors)
{
  return(forEachIn(colors, (color) => new SolidFill({ color })));
}
