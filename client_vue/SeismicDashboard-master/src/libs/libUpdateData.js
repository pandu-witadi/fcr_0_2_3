import {createLeafletAreaPolygon, createLeafletColormap, createLeafletCrs, fillLeafletAreaVariable} from "./simpleLib";


export function addPlotDataToTableArea(map_var, datas)
{
  for (let i = 0; i < datas.length; i++)
  {
    let item = datas[i];
    map_var = fillLeafletAreaVariable(map_var, item["coordinate"], i);
    item.poly = createLeafletAreaPolygon(item["name"], item["coordinate"], i);
    item.layer_show = false;
    item.heatmap_available = false;
    item.heatmap_show = false;
    item.heatmap_data = [];
  }
  return(datas);
}

export function getAreaFirstCoordinate(datas)
{
  let coord = {
    lat: datas[0]["coordinate"]["p1"]["x"],
    lng: datas[0]["coordinate"]["p1"]["y"]};
  return(coord);
}

export function createTableFromHeatmapFullData(datas) {
  let r = [];
  let n = datas.length;

  let tmp =["Prob 500 - 600", "Prob 600 - 700", "Prob 700 - 800", "Prob 800 - 900", "Prob 900 - 1000"];
  for(let i=0; i<n; i++)
  {
    let x = {
      "name": tmp[i],
      "min": datas[i]["sum"]["min"],
      "max": datas[i]["sum"]["max"],
      "show_layer": false,
    };
    r.push(x);
  }
  return(r);
}

export function getMaxHeatmapData(datas) {
  let n = datas.length;
  let r = {min:0, max:0};

  if(n<=0)
    return(r);
  let max_data = datas[0]["max"];
  for(let i=0; i<n; i++)
  {
    if(max_data < datas[i]["max"])
      max_data = datas[i]["max"];
  }
  r["max"] = max_data;
  return (r);
}

export function createDefaultSectionAreaParameter() {
  let param = [
    {
      title: "XLine",
      min: 1,
      max: 3201,
      step: 1,
      vmin: 20,
      vmax: 80
    },
    {
      title: "InLine",
      min: 1,
      max: 100,
      step: 1,
      vmin: 20,
      vmax: 80
    },
    {
      title: "Depth",
      min: 1,
      max: 400,
      step: 1,
      vmin: 20,
      vmax: 80
    }
  ];
  return(param);
}

export function convertProposeExcaBoxObjectToArray(datas) {
  let R = [];
  // if(_.isEmpty(datas))
  //   return (R);
  let item = datas.exca;
  R.push({
    name: "XLine",
    min: item["xline"]["min"],
    max: item["xline"]["max"],
  });
  R.push({
    name: "InLine",
    min: item["iline"]["min"],
    max: item["iline"]["max"],
  });
  R.push({
    name: "Z",
    min: item["z"]["min"],
    max: item["z"]["max"],
  });

  return(R);
}

export function convertProposeProspectBoxObjectToArray(datas) {
  let R = [];
  // if(_.isEmpty(datas))
  //   return (R);

  let item = datas.boxa["p1"];
  R.push({
    name: "P1",
    iline: item["iline"],
    xline: item["xline"],
    x: item["x"],
    y: item["y"],
  })
  item = datas.boxa["p2"];
  R.push({
    name: "P2",
    iline: item["iline"],
    xline: item["xline"],
    x: item["x"],
    y: item["y"],
  })
  item = datas.boxa["p3"];
  R.push({
    name: "P3",
    iline: item["iline"],
    xline: item["xline"],
    x: item["x"],
    y: item["y"],
  })
  item = datas.boxa["p4"];
  R.push({
    name: "P4",
    iline: item["iline"],
    xline: item["xline"],
    x: item["x"],
    y: item["y"],
  })
  return(R);
}

export function fillLeafletProspectMapVariable(m, datas, idx) {
  m.crs = createLeafletCrs(m);

  // m.polygon.push([
  //   [coordinate["p1"]["y"], coordinate["p1"]["x"]],
  //   [coordinate["p2"]["y"], coordinate["p2"]["x"]],
  //   [coordinate["p3"]["y"], coordinate["p3"]["x"]],
  //   [coordinate["p4"]["y"], coordinate["p4"]["x"]]
  // ]);
  m.poly_color.push(createLeafletColormap(idx));

  let coordinate = datas["boxa"];
  let x = [coordinate["p1"]["x"], coordinate["p2"]["x"], coordinate["p3"]["x"], coordinate["p4"]["x"]];
  let xmin = Math.min.apply(null, x);
  let xmax = Math.max.apply(null, x);
  let dx = Math.abs(xmax - xmin);
  let y = [coordinate["p1"]["y"], coordinate["p2"]["y"], coordinate["p3"]["y"], coordinate["p4"]["y"]];
  let ymin = Math.min.apply(null, y);
  let ymax = Math.max.apply(null, y);
  let dy = Math.abs(ymax - ymin);
  m.center = L.latLng(ymin + dy/2, xmin + dx/2);

  return(m);
}

export function addPlotDataToProspectMap(map_var, datas)
{
  map_var = fillLeafletProspectMapVariable(map_var, datas, 0);
  // datas.poly = createLeafletProspectMapPolygon(m, datas);
  datas.area_show = false;
  datas.heatmap_show = true;
  datas.ndata = datas["label_z"].length;

  let layers = [];
  for(let i=0; i<datas.ndata; i++) {
    layers.push({
      no: i+1,
      z: datas["label_z"][i],
      show: false,
      heatmap: datas["prob_list"][i]
    })
  }
  return(layers);
}

export function addPlotDataToProspectEdit(datas) {
  datas.area_show = false;
  datas.heatmap_show = true;
  datas.ndata = datas["label_z"].length;

  let layers = [];
  for(let i=0; i<datas.ndata; i++) {
    layers.push({
      no: i+1,
      z: datas["label_z"][i],
      show: false,
      heatmap: datas["val_list"][i]
    })
  }
  return(layers);
}
export function addPlotDataToProspectEditMultiData(datas) {
  datas.area_show = false;
  datas.heatmap_show = true;

  let id_no = 0;
  let np = datas["label_z"].length;
  let layers = [];
  for(let i=0; i<np; i++) {
    let nc = datas["label_z"][i].length;
    for(let j=0; j<nc; j++)
    {
      layers.push({
        no: id_no+1,
        z: datas["label_z"][i][j],
        show: false,
        heatmap: datas["val_list"][i][j],
        cmap: i,
      });
      id_no = id_no + 1;
    }
  }
  datas.ndata = id_no;

  return(layers);
}

export function uncheckAllData(datas) {
  let ndata = datas.length;
  for(let i=0; i<ndata; i++)
  {
    datas[i]["show"] = false;
  }
}

export function setDmpMarkerStatus(datas, key_parent, key_child, default_value) {
  let ndata = datas.length;
  for(let i=0; i<ndata; i++)
  {
    if (key_parent in datas[i]["dmp"])
      datas[i]["dmp"][key_parent][key_child] = default_value;
    // datas[i]["show"] = default_value;
  }
}

export function fillAreaLayerList(table_area, selected_area, layer_list) {
  let n_area = table_area.length;
  for(let i=0; i<n_area; i++)
  {
    if(table_area[i]["id_area"] !== selected_area)
      continue;

    let n_layer = layer_list.length;
    let tmp_layers = []
    for(let j=0; j<n_layer; j++)
    {
      tmp_layers.push({
        check: false,
        isAvailable: false,
        show: false,
        isDefault: layer_list[j].isDefault,
        id_area: layer_list[j].id_area,
        layer: layer_list[j].layer,
        label: layer_list[j].label,
        filename: layer_list[j].filename,
        heatmap: {}
      })
    }
    table_area[i]["layers"] = tmp_layers;
    table_area[i]["layer_available"] = true;
  }
}

export function fillAreaLayerListWithHeatmapData(table_area, selected_area, data_selected_layer, data_heatmap) {
  let n_area = table_area.length;
  for(let i=0; i<n_area; i++) {
    if (table_area[i]["id_area"] !== selected_area)
      continue;

    for(let j=0; j<data_selected_layer.length; j++)
    {
      let idx_layer = data_selected_layer[j].idx;
      table_area[i]["layers"][idx_layer]["isAvailable"] = true;
      table_area[i]["layers"][idx_layer]["heatmap"] = data_heatmap[j];
    }
    break;
  }
}
