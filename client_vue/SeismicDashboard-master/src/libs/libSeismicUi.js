

export function createTabProcessIcon()
{
  let tabicon = ["fa fa-list", "fa fa-renren", "fa fa-map", "fa fa-window-restore", "fa fa-map-marker", "fa fa-line-chart", "fa fa-pie-chart"];
  // let tabicon = ["fa fa-list", "fa fa-renren", "fa fa-line-chart"];
  return(tabicon);
}

export function createTabProcessText()
{
  let tabtitle = ["Area List", "Geobody List", "Pick Geobody", "Section List", "Map Propagation", "Data Trend", "Recomendation"];
  // let tabtitle = ["Area List", "Geobody List", "Probability"];
  return(tabtitle);
}

export function createTabProcessIconV0(imode)
{
  // imode : 1=point, 0=geobody
  let tabicon = ["fa fa-list", "fa fa-renren", "fa fa-line-chart", "fa fa-pie-chart"];
  if(imode === 1)
    tabicon = ["fa fa-list", "fa fa-line-chart", "fa fa-pie-chart"];
  return(tabicon);
}

export function createTabProcessTextV0(imode)
{
  // imode : 1=point, 0=geobody
  let tabtitle = ["Area List", "Geobody List", "Probability", "Recomendation"];
  if(imode === 1)
    tabtitle = ["Area List", "Probability", "Recomendation"];
  return(tabtitle);
}
