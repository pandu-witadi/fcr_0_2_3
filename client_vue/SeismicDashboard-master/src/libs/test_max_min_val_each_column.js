


export function matrix_col_optimum(nrow, ncol, mode, mat) {
	let ret = [];

	// minimum
	for (let icol = 0; icol < ncol; icol++ )
	{
		let v_op = mat[0][icol];
		for (let irow = 0; irow < nrow; irow++)
		{
			let v = mat[irow][icol];
			if (mode === 'min' && v_op > v)
				v_op = v;
			if (mode === 'max' && v_op < v)
				v_op = v;
			if (mode === 'opt' && Math.abs(v_op) < Math.abs(v))
				v_op = v;

		}
		ret[icol] = v_op
	}

	return ret
}

export function matrix_col_optimum_v1(nrow, ncol, mode, mat, row_start, xx, dy, ny)
{
  let ret = [];

  let series_info = [];

  // minimum
  let iy, vx, vy;
  iy = 0;

  let rr = ny-row_start-nrow;
  for (let icol = 0; icol < ncol; icol++ )
  {
    vx = xx[icol];

    let v_op = mat[0][icol];
    iy = rr;
    for (let irow = 0; irow < nrow; irow++)
    {
      let v = mat[irow][icol];

      if (mode === 'min' && v_op > v)
      {
        v_op = v;
        iy = rr + irow;
      }
      if (mode === 'max' && v_op < v)
      {
        v_op = v;
        iy = rr + irow;
      }
      if (mode === 'opt' && Math.abs(v_op) < Math.abs(v))
      {
        v_op = v;
        iy = rr + irow;
      }
    }

    //console.log(rr + " " + iy)
    ret[icol] = v_op;
    //vy = (ny-iy+1) * dy; //posisi y dibalik
    vy = iy * dy; //posisi y dibalik
    series_info.push({x: vx, y:vy})
  }

  return ({opt: ret, info: series_info});
}

export function matrix_col_optimum_v2(nrow, ncol, mode, mat, row_start, xx, dy, ystart)
{
  let ret_data = [];
  let series_info = [];

  // minimum
  let iy, vy;
  for (let icol = 0; icol < ncol; icol++ )
  {
    iy = row_start;
    let v_op = mat[0][icol];
    for (let irow = 0; irow < nrow; irow++)
    {
      let v = mat[irow][icol];
      if (mode === 'min' && v_op > v)
      {
        v_op = v;
        iy = row_start + irow;
      }
      if (mode === 'max' && v_op < v)
      {
        v_op = v;
        iy = row_start + irow;
      }
      if (mode === 'opt' && Math.abs(v_op) < Math.abs(v))
      {
        v_op = v;
        iy = row_start + irow;
      }
    }

    ret_data.push(v_op);
    vy = ystart + (iy*dy);
    series_info.push({x: xx[icol], y:vy})
  }

  return ({opt: ret_data, info: series_info});
}
