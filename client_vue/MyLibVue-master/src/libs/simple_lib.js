export function printJson(sstr, DEBUG_MODE, objjson)
{
  if (DEBUG_MODE === false) return;
  console.log(sstr + JSON.stringify(objjson));
}

export function printString(sstr, DEBUG_MODE, objstr)
{
  if (DEBUG_MODE === false) return;
  console.log(sstr + objstr);
}

export function copyObject(o)
{ // copy object or array
  let output, v, key;
  output = Array.isArray(o) ? [] : {};

  for (key in o)
  {
    v = o[key];
    if (v)
    {
      output[key] = (typeof v === "object") ? copyObject(v) : v;
    } else
    {
      output[key] = v;
    }
  }
  return output;
}

export function isEmpty(obj)
{
  for (let key in obj)
  {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

export function setUpperCaseFunction(sstr)
{
  if (sstr === undefined)
    return ("");

  return (sstr.toUpperCase());
}

export function setUpperCaseFirstCharFunction(sstr)
{
  if (sstr === undefined)
    return ("");

  if (sstr.length > 0)
    return (sstr.charAt(0).toUpperCase() + sstr.slice(1));
  else
    return ("");
}

export function convertObjectToStringFunction(sstr)
{
  if (sstr === undefined)
    return ("");

  let tmpstr = JSON.stringify(sstr);
  tmpstr = tmpstr.replace("[", "").replace("]", "");
  tmpstr = tmpstr.replace(/"/g, "");
  return (tmpstr);
}