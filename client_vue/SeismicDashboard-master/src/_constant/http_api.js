import axios from "axios";
import {getConfigMapUrl, globalVar} from "../../config";

const DEBUG_MODE = true;
const DEBUG_SERVER = true;
const SERVER_DEVEL = 2;
const DEMO_MODE = false;

export function appDebugMode() {
  return (DEBUG_MODE);
}
export function appDebugServer() {
  return (DEBUG_SERVER);
}
export function appDemoMode() {
  return (DEMO_MODE);
}
export function getLocalMapServer() {
  return (getConfigMapUrl());
}

export function url_http_post(userData) {
  return axios.post(getApronServerAPI() + '/app-scripts', userData);
}

export function getDefaultUserIcon()
{
  return(getAssetServer() + "general/user_default.svg");
}

export function getMapPinMarker()
{
  //return(getAssetServer() + "general/pin_location.png");
  return(globalVar()["SERVER_ADDRESS"] + "/static/marker_drag.png")
}

export function getWellPinMarker()
{
  //return(getAssetServer() + "general/pin_location.png");
  return(globalVar()["SERVER_ADDRESS"] + "/static/marker-well.png")
}

export function getMarkerColor(item, statusSetting)
{
  let idx = item.state;
  let n = statusSetting['marker_color'].length;
  if(idx>=n)
    return (statusSetting['marker_color'][n-1])
  return(statusSetting['marker_color'][idx]);
}

export function getMapServer()
{
  return ('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  // return ('http://117.54.250.86:8080/styles/osm-bright/{z}/{x}/{y}.png');
}

export function getApronServerAPI()
{
  if (SERVER_DEVEL === 1)
  {
    return ('http://jasdig.com:5154'); // return ('http://jasdig.com:5155');
  }
  else if(SERVER_DEVEL === 0)
  {
    return ('https://rest.dazbor.com/'); //'http://jasdig.com:5156/apron/api';
  }
  else
  {
    // return ('http://jasdig.com:5151')
    return globalVar()["SERVER_ADDRESS"];
  }
}

export function getAssetServer()
{
  return("http://117.54.250.85:91/image/");
}
export function create_auth_header()
{
  let auth_headers = {
    // 'Authorization': 'Bearer ' + userData['token'],
    // 'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  return(auth_headers);
}
export function create_auth_header_v1(user)
{
  let auth_headers = {
    'x-access-token': user['token'],
    // 'Authorization': 'Bearer ' + user['token'],
    'Content-Type': 'application/json'
  };
  return(auth_headers);
}

export function auto_error_message_parse(error)
{
  // console.log('Error no valid: ', error);
  let str_msg = "Error Network";
  let n = 200;
  if (error !== undefined)
  {
    error = JSON.stringify(error);
    if (error.length > n)
      str_msg = error.substr(0, n);
    else
      str_msg = error;
  }
  return(str_msg);
}

export function url_http_post_with_header(url_api, header, userData)
{
  axios.defaults.headers = header;
  return axios.post(getApronServerAPI() + url_api, userData,
    {
      // headers: header
    });
}

export function url_http_get_with_header(url_api, header, userData)
{
  axios.defaults.headers = header;
  return axios.get(getApronServerAPI() + url_api, userData,
    {
      // headers: header
    });
}
