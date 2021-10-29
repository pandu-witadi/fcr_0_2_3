export function getIndexFromArray(x, dx)
{
  let p = Math.round(x/dx);
  return(p)
}

export function getIndexFromArray3(x, dx, dstart)
{
  let p = Math.round((x - dstart)/dx);
  return(p)
}

export function setPositionFromIndex(idx, dx, dstart)
{
  let p = dstart + (idx*dx);
  return(p.toFixed(3));
}

export function getPinMarker()
{
  return("https://storage.googleapis.com/public-datas/pin_location.png");
}

export function getMapServer(imode)
{
  if(imode===0)
    return ('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  else
    return('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
}

export function getMarkerColor(item, statusSetting)
{
  let idx = item.state;
  let n = statusSetting['marker_color'].length;
  if(idx>=n)
    return (statusSetting['marker_color'][n-1])
  return(statusSetting['marker_color'][idx]);
}

export function getBoundaryData(x, y, max_perc)
{
  // x coord
  let xmin = Math.min.apply(null, x);
  let xmax = Math.max.apply(null, x);
  let dx = Math.abs(xmax-xmin);

  // y coord
  let ymin = Math.min.apply(null, y);
  let ymax = Math.max.apply(null, y);
  let dy = Math.abs(ymax-ymin);

  let XL = 0.0;
  let XR = 0.0;
  let YB = 0.0;
  let YU = 0.0;
  if (dx>dy)
  {
    let ddx = dx * max_perc;
    XL = xmin - ddx;
    XR = xmax + ddx;

    let ddy = ((dx + (ddx*2.0)) - dy) / 2;
    YB = ymin - ddy;
    YU = ymax + ddy;
  }
  else
  {
    let ddy = dy * max_perc;
    YB = ymin - ddy;
    YU = ymax + ddy;

    let ddx = ((dy + (ddy*2.0)) - dx) / 2;
    XL = xmin - ddx;
    XR = xmax + ddx;
  }
  // console.log(XR-XL)
  // console.log(YU - YB)
  return([XL, XR, YB, YU]);
}
export function getBoundaryDataV2(x, y, max_perc)
{
  let p_ = getBoundaryData(x, y, max_perc);
  return([
    [p_[0], p_[2]],
    [p_[1], p_[2]],
    [p_[1], p_[3]],
    [p_[0], p_[3]],
  ])
}

export function getJsonPythonId(obj) {
  return(obj["_id"]["$oid"])
}

export function rgbToHex1(r, g, b)
{
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function rgbToHex2(color_)
{
  let r = Math.round(color_[0]*255);
  let g = Math.round(color_[1]*255);
  let b = Math.round(color_[2]*255);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function rgbToHexColormap(rgb_) {
  let hex_cm = [];
  for(let i=0; i<rgb_.length; i++)
  {
    hex_cm.push(rgbToHex2(rgb_[i]));
  }
  return(hex_cm);
}

export function getColormapColorv1(colormap_, cm_val) {
  //input hex colormap
  let n_cm = colormap_.length;
  let d_cm = 1.0 / n_cm;
  let idx_cm = Math.fround(cm_val/d_cm);
  if(idx_cm<0)
    idx_cm = 0;
  else if(idx_cm>=n_cm)
    idx_cm = n_cm-1;
  return(colormap_[idx_cm]);
}

export function getColormapColorv2(colormap_, cm_val, b_reverse) {
  //input rgb colormap
  let n_cm = colormap_.length;
  let d_cm = 1.0 / n_cm;
  let idx_cm = Math.round(cm_val/d_cm);
  if(idx_cm<0)
    idx_cm = 0;
  else if(idx_cm>=n_cm)
    idx_cm = n_cm-1;
  if(b_reverse === true)
    return(rgbToHex2(colormap_[255-idx_cm]));
  else
    return(rgbToHex2(colormap_[idx_cm]));
}

import { CRS } from "leaflet";
import * as L from "leaflet";
export function createLeafletCrs(m)
{
  let mapMinResolution = Math.pow(2, m.maxZoom) * m.mapMaxResolution;

  let crs = CRS.Simple;
  crs.transformation = new L.Transformation(1, -m.tileExtent[0], -1, m.tileExtent[3]);
  crs.scale = function(zoom) {
    return Math.pow(2, zoom) / mapMinResolution;
  };
  crs.zoom = function(scale) {
    return Math.log(scale * mapMinResolution) / Math.LN2;
  };
  return(crs);
}

export function createLeafletColormap(idx) {
  let list_color = [
    "#ff0000", "#40ff00", "#8000ff", "#ff8000",
    "#ffff00", "#bfff00", "#00ffff", "#00bfff",
    "#0040ff", "#4000ff", "#ff00ff", "#ff0080"
  ]
  if(idx<list_color.length)
    return(list_color[idx]);
  else
    return (list_color[0]);
}

export function fillLeafletAreaVariable(m, coordinate, idx_color)
{
  if(idx_color===0)
    m.crs = createLeafletCrs(m);

  m.polygon.push([
    [coordinate["p1"]["y"], coordinate["p1"]["x"]],
    [coordinate["p2"]["y"], coordinate["p2"]["x"]],
    [coordinate["p3"]["y"], coordinate["p3"]["x"]],
    [coordinate["p4"]["y"], coordinate["p4"]["x"]]
  ]);

  if(idx_color===0) {
    let x = [coordinate["p1"]["x"], coordinate["p2"]["x"], coordinate["p3"]["x"], coordinate["p4"]["x"]];
    let xmin = Math.min.apply(null, x);
    let xmax = Math.max.apply(null, x);
    let dx = Math.abs(xmax - xmin);
    let y = [coordinate["p1"]["y"], coordinate["p2"]["y"], coordinate["p3"]["y"], coordinate["p4"]["y"]];
    let ymin = Math.min.apply(null, y);
    let ymax = Math.max.apply(null, y);
    let dy = Math.abs(ymax - ymin);
    m.center = L.latLng(ymin + dy/2, xmin + dx/2);
  }

  m.poly_color.push(createLeafletColormap(idx_color));
  return(m);
}

export function createLeafletAreaPolygon(poly_name, coordinate, idx_color)
{
  let pp = {
    "name": poly_name,
    "polygon" : [
      [coordinate["p1"]["y"], coordinate["p1"]["x"]],
      [coordinate["p2"]["y"], coordinate["p2"]["x"]],
      [coordinate["p3"]["y"], coordinate["p3"]["x"]],
      [coordinate["p4"]["y"], coordinate["p4"]["x"]]
    ],
    "color": createLeafletColormap(idx_color)
  };
  return(pp);
}
