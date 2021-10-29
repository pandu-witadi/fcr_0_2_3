
export function globalVar()
{
  let gv = {
    // set your server address location
    SERVER_ADDRESS: 'http://jasdig.com:5151'
  };
  return(gv);
}

export function getConfigMapUrl()
{
  // return('http://localhost/map16');
  return('http://jasdig.com:5151/static/map16');
}
