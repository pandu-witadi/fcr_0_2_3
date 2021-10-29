import * as pako from "pako";

export function getDefaultModel(msg) {
  let model = {};
  for(let i=0; i<msg.length; i++)
  {
    model[msg[i].model] = msg[i].default;
  }

  return(model);
}

export function createRandomCode()
{
  let r_n = Math.floor(Math.random() * 10000);
  let r = '?rnd=' + r_n;
  return(r);
}

export function getRandomImageUrl(img_url)
{
  if (img_url === undefined)
    return ("")
  if (img_url.trim().length>0)
    return(img_url + createRandomCode());
  else
    return ("")
}

export function getCurrentTimeInMs() {
  let milliseconds = (new Date).getTime();
  return(milliseconds);
}
export function getParkirColor(itarget, ivalue) {
  let my_colors = ['#FF0000', '#F03500' ,'#E26400', '#D48D00', '#C6B000' ,
    '#A3B800', '#71AA00' ,'#459C00', '#1F8E00', '#008000'];
  let idx = (ivalue / itarget) * 10;

  if(idx<0) return(my_colors[0]);
  else if(idx>=my_colors.length) return(my_colors[my_colors.length-1]);
  else return(my_colors[idx]);
}

export function checkHeaderFile(strsplit, str_data_identified, nlines) {
  let nstr_check = str_data_identified.length;
  let idx = -1;
  for (let i = 0; i < nlines; i++) {
    let str_line = strsplit[i];
    if (str_line.length <= 3) continue; //no text data
    let str_sub = str_line.substr(0, nstr_check);

    if (str_sub === str_data_identified) {
      idx = i;
      break;
    }
  }
  return (idx); //return line number
}

export function readHeader(str_header) {
  let arr = str_header.split(" ");
  arr = arr.filter(Boolean); //remove empty string

  let newArray = [];
  let idx = 0;
  for(let i=0; i<arr.length; i++){
    if(arr[i][0]==="~" || arr[i][0]==="\r")
      continue;

    newArray[idx] = arr[i];
    idx = idx+1;
  }
  return(newArray);
}

export function readData(strsplit, idx_data, nlines, ncol) {
  let R = [];
  let nrow = nlines-idx_data;
  for(let i=0; i<nrow; i++)
    R[i] = [];

  //console.log("nlines:" + nlines + " idx_data:" + idx_data + " nrow:" + nrow);

  let idx = 0;
  for(let i=idx_data; i<nlines; i++)
  {
    let str_line = strsplit[i];
    if(str_line.length<=3) continue; //no text data

    let arr = str_line.split(" ");
    arr = arr.filter(Boolean); //remove empty string
    if(arr.length<ncol) continue;

    for(let j=0; j<ncol; j++)
      R[j][idx] = arr[j]*1.0;

    idx = idx+1;
  }

  //console.log("idx:" + idx);
  //console.log(JSON.stringify(R[0]));

  return(R);
}

export function createDataReport(headers, data) {
  let R = [];
  for(let i=0; i<headers.length; i++){
    R[i] = {
      key: headers[i],
      min:Math.min.apply(null, data[i]),
      max:Math.max.apply(null, data[i]),
      selected:1
    }
  }
  return(R);
}

export function readCompressedLasFromServer(user_id, filename, sstr, skip_data) {
  let byte_data = atob(sstr);
  let restored_file = pako.inflate(byte_data, { to: 'string' });
  return(parseLasFile(user_id, filename, restored_file, skip_data, false));
}

export function createHeaderData(hdrs) {
  let headerkey = [];
  for(let i=0; i<hdrs.length; i++){
    headerkey[i] = {"value": i, "text" : hdrs[i]};
  }
  return(headerkey);
}

export function parseLasFile(user_id, filename, sstr, skip_data, compress_file) {
  let R = {};
  let strsplit = sstr.split("\n");
  let nlines = strsplit.length;

  //set global header
  R.status = 1;
  R.filesize = sstr.length;
  R.lines = nlines;
  R.filename = filename;

  let idx_data = checkHeaderFile(strsplit, "~A", nlines); //read header
  if(idx_data<=0)
  {
    R.status = 0;
    R.msg = "Error input file. please check your file";
    return(R);
  }

  //get header column
  R.headers = readHeader(strsplit[idx_data]);
  if(R.headers.length<2){
    R.status = 0;
    R.msg = "file has less than 2 columns";
  }

  R.headerkey = createHeaderData(R.headers);
  R.data = readData(strsplit, idx_data+1, nlines, R.headers.length);
  R.reports = createDataReport(R.headers, R.data);
  R.ndata = R.data[0].length;
  R.nheader = idx_data;
  R.ncolumn = R.headers.length;

  R.server_filename = user_id.padStart(5, '0') + '_' + getCurrentTimeInMs();
  R.charts = [
    {name: "-1", x: -1, y: -1},
    // {name: "Chart 2", x: -1, y: -1},
    // {name: "Chart 3", x: -1, y: -1},
    // {name: "Chart 4", x: -1, y: -1}
  ];

  //compress data
  let compressed_sstr = "";
  if(compress_file)
    compressed_sstr = pako.deflate(sstr, { to: 'string' });
  //var restored_file = pako.inflate(compressed_file, { to: 'string' });
  //console.log(compressed_file.length);
  //console.log(restored_file.length);
  if(skip_data)
    R.data = [];
  return([R, compressed_sstr]);
}

export function stringToFormattedDate(responseDate) {
  let dateComponents = responseDate.split('T');
  let time_without_ms = dateComponents[1].split('.');

  let datePieces = dateComponents[0].split("-");
  let timePieces = dateComponents[1].split(":");
  // return(new Date(datePieces[2], (datePieces[1] - 1), datePieces[0], timePieces[0], timePieces[1], timePieces[2]))

  return(dateComponents[0] + " " + time_without_ms[0]);
}
