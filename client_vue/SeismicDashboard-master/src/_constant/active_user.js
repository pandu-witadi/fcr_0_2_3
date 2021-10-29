// utils/active-user.js
const key_active_user = "user";
const key_dashboard_user = "dashuser";
// const key_selected_user = "selected_user";
// const key_projects = "projects";
// const key_location = "location";

const key_research_user = "research_user";
const key_research_project = "research_projects";
const key_chart_color = "chart_color";

export function researchIsValidUser(item_) {
  if(item_==null) //null data
    return(false);

  if (item_['TOKEN'].length > 2)
    return (true);
  else
    return (false);
}


export function getDefaultColor() {
  let data = JSON.parse(localStorage.getItem(key_chart_color));
  return(data);
}

export function saveDefaultChartColor(chartColor){
  // let chart_color = {
  //   0: chartColor,
  //   1: chartColor,
  //   2: chartColor,
  //   3: chartColor,
  // };
  localStorage.setItem(key_chart_color, JSON.stringify(chartColor)); //save chart color data
  return(chartColor);
}
export function deleteDefaultChartColor(){
  if (localStorage.getItem(key_chart_color) !== null) {
    localStorage.removeItem(key_chart_color);
  }
}

export function researchLogOut()
{
  if (localStorage.getItem(key_research_user) !== null) {
    localStorage.removeItem(key_research_user);
  }
}

export function researchSaveProjects(item_)
{
  localStorage.setItem(key_research_project, JSON.stringify(item_)); //save data
}
export function researchGetProjects()
{
  return(JSON.parse(localStorage.getItem(key_research_project)));
}


export function logOut()
{
  if (localStorage.getItem(key_active_user) !== null)
    localStorage.removeItem(key_active_user);
  if (localStorage.getItem(key_dashboard_user) !== null)
    localStorage.removeItem(key_dashboard_user);
}
export function isValidUser(item_) {
  if((item_ === undefined) || (item_=== null))
    return (false);

  if("user" in item_)
    return (true);

  return (false);
}
export function saveUserDashboard(item_)
{
  let data = {
    dashboard: true,
    user: item_
  };
  writeData(key_dashboard_user, data);
}
export function readUserDashboard()
{
  let user = JSON.parse(localStorage.getItem(key_dashboard_user));
  return(user);
}

export function saveUser(item_)
{
  let data = {
    dashboard: false,
    user: item_
  };
  writeData(key_active_user, data);
}
export function deleteUser()
{
  let data = {
  };
  writeData(key_active_user, data);
  writeData(key_dashboard_user, data);
}

export function readUser()
{
  let user = JSON.parse(localStorage.getItem(key_active_user));
  return(user);
}

export function saveProspectData(item) {
  localStorage.setItem(item["id"], JSON.stringify(item))
}
export function readProspectData(key_id) {
  let r = localStorage.getItem(key_id);
  return(JSON.parse(r));
}

export function writeData(key_, value_)
{
  localStorage.setItem(key_, JSON.stringify(value_));
}

export function readData(key_)
{
  if (localStorage.getItem(key_) !== null)
    return (JSON.parse(localStorage.getItem(key_)));
  else
    return null
}

export function deleteData(key_)
{
  if (localStorage.getItem(key_) !== null)
  {
    localStorage.removeItem(key_);
  }
}
