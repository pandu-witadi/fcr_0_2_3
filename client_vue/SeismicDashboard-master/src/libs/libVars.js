
export function createTableWellHeader()
{
  let table_headers = [
    {
      key: 'well_id',
      label: 'Well ID',
      sortable: true,
    },
    {
      key: 'area',
      label: 'Area',
      sortable: true
    },
    {
      key: 'X',
      label: 'X Coord',
      sortable: false,
    },
    {
      key: 'Y',
      label: 'Y Coord',
      sortable: false,
    },
    {
      key: 'Z',
      label: 'Z Coord',
      sortable: false,
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createTableWellHeaderV0()
{
  let table_headers = [
    {
      key: 'well_id',
      label: 'Well ID',
      sortable: true,
    },
    {
      key: 'xmd',
      label: 'X Coord',
      sortable: false,
    },
    {
      key: 'ymd',
      label: 'Y Coord',
      sortable: false,
    },
    {
      key: 'zmd',
      label: 'Z Coord',
      sortable: false,
    },
    {
      key: 'show_marker',
      label: 'Show',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center'
    },
    // {
    //   key: 'action',
    //   label: 'Action',
    //   sortable: false,
    // },
  ];
  return (table_headers);
}

// export function createTableGeobodyListHeader()
// {
//   let table_headers = [
//     {
//       key: 'area',
//       label: 'Area',
//       sortable: true
//     },
//     {
//       key: 'well_id',
//       label: 'Well ID',
//       sortable: true
//     },
//     {
//       key: 'X',
//       label: 'X Coord',
//       sortable: false,
//     },
//   ];
//   return (table_headers);
// }

// export function createTableAreaListHeader()
// {
//   let table_headers = [
//     {
//       key: 'area',
//       label: 'Area',
//       sortable: true
//     },
//     {
//       key: 'note',
//       label: 'Note',
//       sortable: true
//     },
//     // {
//     //   key: 'lat',
//     //   label: 'Latitude',
//     //   sortable: false,
//     // },
//     // {
//     //   key: 'lon',
//     //   label: 'Longitude',
//     //   sortable: false,
//     // },
//     {
//       key: 'action',
//       label: 'Action',
//       sortable: false,
//     },
//   ];
//   return (table_headers);
// }

export function createTableWellListHeader() {
  let table_headers = [
    // {
    //   key: 'area',
    //   label: 'Area',
    //   sortable: true
    // },
    {
      key: 'well_id',
      label: 'Well ID',
      sortable: true
    },
    {
      key: 'depth_corr',
      label: 'Depth Corr.',
      sortable: true
    },
    {
      key: 'check',
      label: 'Plot',
      sortable: false,
      thStyle: { width: '40px'}
    },
  ];
  return(table_headers);
}
export function createTableGeobodyListHeader()
{
  let table_headers = [
    {
      key: 'geobody_id',
      label: 'Geobody ID',
      sortable: true
    },
    {
      key: 'cls',
      label: 'Class',
      sortable: true
    },
    {
      key: 'nop',
      label: 'NPoints',
      sortable: true
    },
    {
      key: 'xcoord',
      label: 'X',
      sortable: false,
    },
    {
      key: 'ycoord',
      label: 'Y',
      sortable: false,
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}
export function createTableGeobodyListHeaderV0()
{
  let table_headers = [
    {
      key: 'geobody_id',
      label: 'Geobody ID',
      sortable: true
    },
    {
      key: 'cls',
      label: 'Class',
      sortable: true,
      // thClass: 'text-center',
    },
    {
      key: 'nop',
      label: 'NPoints',
      sortable: true,
      // thClass: 'text-center',
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      // thClass: 'text-center',
    },
    {
      key: 'show_marker',
      label: 'Show',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center'
    },
  ];
  return (table_headers);
}
export function createTableGeobodyListHeaderV1()
{
  let table_headers = [
    {
      key: 'geobody_id',
      label: 'Geobody ID',
      sortable: true
    },
    {
      key: 'cls',
      label: 'Class',
      sortable: true,
      // thClass: 'text-center',
    },
    {
      key: 'nop',
      label: 'NPoints',
      sortable: true,
      // thClass: 'text-center',
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      // thClass: 'text-center',
    },
    {
      key: 'show_marker',
      label: 'Show',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center'
    },
  ];
  return (table_headers);
}
export function createTableAreaListHeaderV0()
{
  let table_headers = [
    // {
    //   key: 'id_area',
    //   label: 'ID Area',
    //   sortable: true
    // },
    {
      key: 'area',
      label: 'Area Name',
      sortable: true
    },
    {
      key: 'note',
      label: 'Area Note',
      sortable: false
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createTableAreaListHeader()
{
  let table_headers = [
    {
      thStyle: '{width: 30px; min-width: 20px; max-width: 50px;}',
      key: 'id_color',
      label: '',
      sortable: false
    },
    {
      key: 'id_area',
      label: 'ID Area',
      sortable: true
    },
    {
      key: 'name',
      label: 'Area Name',
      sortable: true
    },
    // {
    //   key: 'coordinate',
    //   label: 'Coordinate',
    //   sortable: false
    // },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createTableGeobodyFileListHeader()
{
  let table_headers = [
    {
      key: 'col_geobody_id',
      label: 'Col Geobody ID',
      sortable: true
    },
    {
      key: 'cls_z',
      label: 'Class',
      sortable: true
    },
    {
      key: 'file_name',
      label: 'Filename',
      sortable: true
    },
    {
      key: 'note',
      label: 'Note',
      sortable: false,
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createTableWellHeaderBySelectedGeobody()
{
  let table_headers = [
    {
      key: 'well_id',
      label: 'Well ID',
      sortable: true
    },
    {
      key: 'eucd',
      label: 'EUCD',
      sortable: true
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createTableGatherHeader()
{
  let table_headers = [
    {
      key: 'check',
      label: '#',
      sortable: true,
      thStyle: { width: '40px'}
    },
    {
      key: 'iline',
      label: 'Inline',
      sortable: true
    },
    {
      key: 'xline',
      label: 'XLine',
      sortable: true
    },
    {
      key: 'freq',
      label: 'Number of Traces',
      sortable: true
    },
    // {
    //   key: 'action',
    //   label: 'Action',
    //   sortable: false,
    // },
  ];
  return (table_headers);
}

export function createTableSectionHeader()
{
  let table_headers = [
    {
      key: 'check',
      label: '#',
      sortable: true,
      thStyle: { width: '40px'}
    },
    {
      key: 'iline',
      label: 'Inline',
      sortable: true
    },
    {
      key: 'xline',
      label: 'XLine',
      sortable: true
    },
    {
      key: 'freq',
      label: 'Freq',
      sortable: true
    },
    {
      key: 'segy_file_id',
      label: 'SEGY ID',
      sortable: true
    },
    // {
    //   key: 'action',
    //   label: 'Action',
    //   sortable: false,
    // },
  ];
  return (table_headers);
}

export function createTableProbabilityHeader()
{
  let table_headers = [
    {
      key: 'check',
      label: '#',
      sortable: true,
      thStyle: { width: '40px'}
    },
    {
      key: 'iline',
      label: 'Inline',
      sortable: true
    },
    {
      key: 'xline',
      label: 'XLine',
      sortable: true
    },
    // {
    //   key: 'cdp_x',
    //   label: 'CDP X',
    //   sortable: true
    // },
    // {
    //   key: 'cdp_y',
    //   label: 'CDP Y',
    //   sortable: true
    // },
    {
      key: 'cdp_z',
      label: 'CDP Z',
      sortable: true
    },
    {
      key: 'eucd',
      label: 'EUCD',
      sortable: true
    },
    {
      key: 'prob',
      label: 'Prob',
      sortable: true
    },
    // {
    //   key: 'action',
    //   label: 'Action',
    //   sortable: false,
    // },
  ];
  return (table_headers);
}

export function createTableGeobodySectionHeaders() {
  let table_headers = [
    {
      key: 'check',
      label: '#',
      sortable: true,
      thStyle: { width: '40px'}
    },
    {
      key: 'iline',
      label: 'Inline',
      sortable: true
    },
    {
      key: 'xline',
      label: 'XLine',
      sortable: true
    },
    {
      key: 'num.trace',
      label: 'ntrc',
      sortable: true
    },
  ];
  return (table_headers);
}

export function createTableAvaHeaderV0()
{
  let table_headers = [
    {
      key: 'check',
      label: '#',
      sortable: true,
      thStyle: { width: '40px'}
    },
    {
      key: 'iline',
      label: 'Inline',
      sortable: true
    },
    {
      key: 'xline',
      label: 'XLine',
      sortable: true
    },
    {
      key: 'cdp_x',
      label: 'CDP X',
      sortable: true
    },
    {
      key: 'cdp_y',
      label: 'CDP Y',
      sortable: true
    },
    {
      key: 'cdp_z',
      label: 'CDP Z',
      sortable: true
    },
    // {
    //   key: 'action',
    //   label: 'Action',
    //   sortable: false,
    // },
  ];
  return (table_headers);
}

export function createTableProbHeaderV0()
{
  let table_headers = [
    {
      key: 'check',
      label: '#',
      sortable: true,
      thStyle: { width: '40px'}
    },
    {
      key: 'iline',
      label: 'Inline',
      sortable: true
    },
    {
      key: 'xline',
      label: 'XLine',
      sortable: true
    },
    {
      key: 'cdp_x',
      label: 'CDP X',
      sortable: true
    },
    {
      key: 'cdp_y',
      label: 'CDP Y',
      sortable: true
    },
    {
      key: 'cdp_z',
      label: 'CDP Z',
      sortable: true
    },
    // {
    //   key: 'count',
    //   label: 'Count',
    //   sortable: true
    // },
    // {
    //   key: 'prob1',
    //   label: 'Prob1',
    //   sortable: true
    // },
    // {
    //   key: 'prob2',
    //   label: 'Prob2',
    //   sortable: true
    // },
    {
      key: 'prob',
      label: 'Prob',
      sortable: true
    },
    // {
    //   key: 'cdp_z',
    //   label: 'CDP Z',
    //   sortable: true
    // },
    // {
    //   key: 'eucd',
    //   label: 'EUCD',
    //   sortable: true
    // },
    // {
    //   key: 'prob',
    //   label: 'Prob',
    //   sortable: true
    // },
    // {
    //   key: 'action',
    //   label: 'Action',
    //   sortable: false,
    // },
  ];
  return (table_headers);
}
export function createTableSegyListAdmin()
{
  let table_headers = [
    {
      key: 'label_name',
      label: 'Label',
      sortable: true
    },
    {
      key: 'file_loc',
      label: 'Location',
      sortable: true
    },
    {
      key: 'note',
      label: 'Note',
      sortable: true
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createAvaPointModel()
{
  let model_ava_point = {
    id_area: 0,
      gather_file_name: "",
      substack_file_name: "",
      xline: 0,
      iline: 0,
      cdp_z: 500,
      type: 'ilxl',
      rad_x: 100,
      rad_y: 50,
      rad_z: 15,
  };
  return(model_ava_point);
}

export function createAvaPointSchema()
{
  let schema_ava_point = {
    fields: [
      {
        type: 'select',
        label: 'Select Gather File',
        model: 'gather_file_name',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'select',
        label: 'Select SubStack File',
        model: 'substack_file_name',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'select',
        label: 'Select Data Type',
        model: 'type',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius X',
        model: 'rad_x',
        placeholder: 'Set Radius X',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius Y',
        model: 'rad_y',
        placeholder: 'Set Radius Y',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius Z',
        model: 'rad_z',
        placeholder: 'Set Radius Z',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'CDP Z',
        model: 'cdp_z',
        placeholder: 'Set CDP Z',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'XLine/X',
        model: 'xline',
        placeholder: 'Set XLine',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'ILine/Y',
        model: 'iline',
        placeholder: 'Set ILine',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_ava_point);
}

export function createAvaGeobodyModel()
{
  let model_ava_geobody = {
    id_area: 0,
    gather_file_name: "",
    substack_file_name: "",
    geobody_id: "",
    rad_x: 50,
    rad_y: 50,
    rad_z: 15
  };
  return(model_ava_geobody);
}
export function createAvaGeobodySchema()
{
  let schema_ava_geobody = {
    fields: [
      {
        type: 'select',
        label: 'Select Gather File',
        model: 'gather_file_name',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'select',
        label: 'Select SubStack File',
        model: 'substack_file_name',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius X',
        model: 'rad_x',
        placeholder: 'Set Radius X',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius Y',
        model: 'rad_y',
        placeholder: 'Set Radius Y',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Radius Z',
        model: 'rad_z',
        placeholder: 'Set Radius Z',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_ava_geobody);
}

export function createProbModel()
{
  let model_prob = {
      label_name: "",
    };
  return(model_prob);
}

export function createProbSchema()
{
  let schema_prob = {
    fields: [
      {
        type: 'select',
        label: 'Select File',
        model: 'label_name',
        selectOptions: {hideNoneSelectedText: true}
      },
    ]
  };
  return(schema_prob);
}

export function createAvaPlotModel()
{
  let model_prob = {
    label_name: "",
  };
  return(model_prob);
}
export function createAvaPlotSchema()
{
  let schema_prob = {
    fields: [
      {
        type: 'select',
        label: 'Select Gather File',
        model: 'label_name',
        selectOptions: {hideNoneSelectedText: true}
      },
    ]
  };
  return(schema_prob);
}

export function createListSectionModel() {
  let model = {
    stack_label_name: 0,
    rad: 100
  };
  return(model);
}
export function createListSectionSchema() {
  let schema_ = {
    fields: [
      {
        type: 'select',
        label: 'Select SubStack File',
        model: 'substack_file_name',
        selectOptions: {hideNoneSelectedText: true}
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Radius',
        model: 'rad',
        placeholder: 'Set Radius',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_);
}

export function createWellInGeobodyModel() {
  let model = {
    id_area: 0,
    x: 0,
    y: 0,
    rad: 100
  };
  return(model);
}

export function createWellInGeobodySchema()
{
  let schema_prob = {
    fields: [
      {
        type: 'input',
        inputType: 'text',
        label: 'X Location',
        model: 'x',
        placeholder: 'Set X location',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Y Location',
        model: 'y',
        placeholder: 'Set Y location',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Radius',
        model: 'rad',
        placeholder: 'Set Radius',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_prob);
}

export function createTableAreaListHeader_V1()
{
  let table_headers = [
    {
      key: 'id_area',
      field: 'id_area',
      label: 'ID',
      width: '50px',
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      key: 'name',
      field: 'name',
      label: 'Area Name',
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      key: 'layer_show',
      field: 'layer_show',
      label: 'Show',
      sortable: false,
      width: '60px',
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center',
    },
    {
      key: 'layer_available',
      field: 'layer_available',
      label: 'Data',
      sortable: false,
      width: '60px',
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center',
    },
    // {
    //   key: 'heatmap_show',
    //   field: 'heatmap_show',
    //   label: 'Layer',
    //   sortable: false,
    //   thClass: 'text-center vue-good-table-header-style',
    //   tdClass: 'text-left vue-good-table-td-style',
    // },
  ];
  return (table_headers);
}
export function createTableHeatmapLayerHeader()
{
  let table_headers = [
    {
      key: 'name',
      label: 'Layer Name',
      sortable: true,
      thClass: 'text-center',
    },
    {
      thStyle: '{width: 30px; min-width: 20px; max-width: 50px;}',
      key: 'show_layer',
      label: 'Show',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center'
    },
  ];
  return (table_headers);
}

export function createTableAreaListHeader2_V1()
{
  let table_headers = [
    {
      key: 'survey_name',
      label: 'Survey Name',
      sortable: true
    },
  ];
  return (table_headers);
}
export function createTableAreaListHeader3_V1()
{
  let table_headers = [
    {
      key: 'dataset_name',
      label: 'Dataset Name',
      sortable: true
    },
  ];
  return (table_headers);
}

export function createTableExcaBoxHeader()
{
  let table_headers = [
    {
      key: 'name',
      label: 'Label',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white'},
    },
    {
      key: 'min',
      label: 'Min',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white'},
    },
    {
      key: 'max',
      label: 'Max',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white'},
    },
  ];
  return (table_headers);
}

export function createTableProposeProspectBoxHeader()
{
  let table_headers = [
    {
      key: 'name',
      label: 'Label',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white'},
      // thClass: 'head-variant:primary; background-color: red;',
    },
    {
      key: 'iline',
      label: 'Inline',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white'},
    },
    {
      key: 'xline',
      label: 'XLine',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white'},
    },
    {
      key: 'x',
      label: 'X',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white'},
    },
    {
      key: 'y',
      label: 'Y',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white'},
    },
  ];
  return (table_headers);
}

export function createTableProspectMapHeader()
{
  let table_headers = [
    {
      key: 'no',
      label: 'No',
      thStyle: {'background-color': '#1E90FF', 'color': 'white', 'width': '60px'},
      thClass: 'text-center',
      tdClass: 'text-center'
    },
    {
      key: 'z',
      label: 'Layer',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white'},
      thClass: 'text-center',
    },
    {
      key: 'show',
      label: 'Visible',
      thStyle: {'background-color': '#1E90FF', 'color': 'white', 'width': '70px'},
      thClass: 'text-center',
      tdClass: 'text-center'
    },
  ];
  return (table_headers);
}

export function createTableProspectProjectHeader_V1()
{
  let table_headers = [
    {
      field: 'marker',
      label: 'Marker',
      width: '45px',
      sortable: false,
      thClass: 'text-center ',
      tdClass: 'text-center',
    },
    {
      field: 'id_area',
      label: 'Area',
      width: '70px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'name',
      label: 'Name',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'userId',
      label: 'User',
      width: '120px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'filename',
      label: 'Filename',
      width: '200px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'group',
      label: 'Group',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'dmp.analysis.probability.star',
      label: 'Probability',
      width: '110px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'dmp.analysis.substack.star',
      label: 'Substack',
      width: '110px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'dmp.analysis.AVA.star',
      label: 'AVA',
      width: '110px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'dmp.analysis.sweetness.star',
      label: 'Sweetness',
      width: '110px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'dmp.analysis.well_analogy.star',
      label: 'Well Analogy',
      width: '110px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'layer',
      label: 'Layer',
      width: '80px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'np',
      label: 'nPoint',
      width: '80px',
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'score',
      label: 'Score',
      width: '80px',
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-right vue-good-table-td-style',
    },
    {
      field: 'area',
      label: 'Area',
      width: '80px',
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-right vue-good-table-td-style',
    },
    {
      field: 'ctime',
      label: 'Time',
      width: '150px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      type: 'date',
      dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSSSS",
      dateOutputFormat: 'MM/dd/yyyy HH:mm:ss',
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-right vue-good-table-td-style',
    },
    {
      field: 'action',
      label: 'Action',
      width: '80px',
      sortable: false,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-right vue-good-table-td-style',
    },
  ];
  return (table_headers);
}

export function createTableUsersList()
{
  let table_headers = [
    {
      key: 'username',
      label: 'User Name',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'level',
      label: 'Level',
      sortable: true
    },
    {
      key: 'label',
      label: 'Label',
      sortable: true
    },
    {
      key: 'isLogin',
      label: 'Active',
      sortable: true
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
    },
  ];
  return (table_headers);
}

export function createAddUserModel()
{
  let model = {
    email: "",
    username: "",
    password: "",
    level: 0,
    label: ""
  };
  return(model);
}

export function createAddUserSchema()
{
  let schema = {
    fields: [
      {
        type: 'input',
        inputType: 'text',
        label: 'Email',
        model: 'email',
        placeholder: 'User email',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'User Name',
        model: 'username',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'password',
        label: 'Password',
        model: 'password',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Level',
        model: 'level',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'User Label',
        model: 'label',
        placeholder: '',
        featured: true,
        required: true
      }
    ]
  };
  return(schema);
}

export function createSaveProspectModel() {
  let model = {
    name: "",
    group: ""
  };
  return(model);
}
export function createSaveProspectSchema() {
  let schema_ = {
    fields: [
      {
        type: 'input',
        inputType: 'text',
        label: 'Save As',
        model: 'name',
        placeholder: 'Prospect name',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Group',
        model: 'group',
        placeholder: 'Set prospect group',
        featured: true,
        required: false
      },
    ]
  };
  return(schema_);
}

export function createUpdateProspectGroupModel() {
  let model = {
    group: ""
  };
  return(model);
}
export function createUpdateProspectGroupSchema() {
  let schema_ = {
    fields: [
      {
        type: 'input',
        inputType: 'text',
        label: 'New Group Name',
        model: 'group',
        placeholder: 'New prospect group',
        featured: true,
        required: false
      },
    ]
  };
  return(schema_);
}

export function createTableLayerListHeader_V1()
{
  let table_headers = [
    {
      key: 'check',
      label: '',
      thClass: 'text-center',
      tdClass: 'text-center'
    },
    {
      key: 'index',
      label: '#',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center'
    },
    {
      key: 'label',
      label: 'Label',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-left',
    },
    {
      key: 'show',
      label: 'show',
      sortable: false,
      thClass: 'text-center',
      tdClass: 'text-center',
    },
  ];
  return (table_headers);
}

export function createEditOpenGatherSchema() {
  let schema_ = {
    fields: [
      {
        type: 'input',
        inputType: 'number',
        label: 'Z Min',
        model: 'zmin',
        placeholder: '',
        featured: true,
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Z Max',
        model: 'zmax',
        placeholder: '',
        featured: true,
      },
    ]
  };
  return(schema_);
}

export function createTableWellAnalogyHeader() {
  let table_headers = [
    {
      key: 'index',
      label: 'No',
      thStyle: {'background-color': '#1E90FF', 'color': 'white', 'width': '40px', 'min-width': '40px'},
      thClass: 'text-center',
      tdClass: 'text-center'
    },
    {
      key: 'label',
      label: 'Label',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white', 'width': '130px', 'min-width': '130px'},
      thClass: 'text-center',
      tdClass: 'text-left',
    },
    {
      key: 'mode',
      label: 'Mode',
      sortable: true,
      thStyle: {'background-color': '#1E90FF', 'color': 'white'},
      thClass: 'text-center',
    },
    {
      key: 'neigh',
      label: 'Neigh',
      thStyle: {'background-color': '#1E90FF', 'color': 'white', 'width': '70px'},
      thClass: 'text-center',
      tdClass: 'text-center'
    },
    {
      key: 'iline',
      label: 'InLine',
      thStyle: {'background-color': '#1E90FF', 'color': 'white', 'width': '70px'},
      thClass: 'text-center',
      tdClass: 'text-center'
    },
    {
      key: 'xline',
      label: 'XLine',
      thStyle: {'background-color': '#1E90FF', 'color': 'white', 'width': '70px'},
      thClass: 'text-center',
      tdClass: 'text-center'
    },
    {
      key: 'z',
      label: 'Z',
      thStyle: {'background-color': '#1E90FF', 'color': 'white', 'width': '70px'},
      thClass: 'text-center',
      tdClass: 'text-center'
    },
  ];
  return (table_headers);
}

export function createWellAnalogySaveModel() {
  let model = {
    label: ""
  };
  return(model);
}
export function createWellAnalogySaveSchema() {
  let schema_ = {
    fields: [
      {
        type: 'input',
        inputType: 'text',
        label: 'Well Analogy Label',
        model: 'label',
        placeholder: '',
        featured: true,
        required: false
      },
    ]
  };
  return(schema_);
}

export function createTableProbMapListHeader()
{
  let table_headers = [
    {
      field: 'id_area',
      label: 'Area',
      width: '70px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'label',
      label: 'Label',
      width: '200px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'filename',
      label: 'Filename',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'layer',
      label: 'Layer',
      width: '80px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'loc',
      label: 'Loc',
      width: '170px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'action',
      label: 'Action',
      width: '80px',
      sortable: false,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
  ];
  return (table_headers);
}
export function createNewProbMapModel() {
  let model = {
    id_area: -1,
    layer: -1,
    filename: "",
    loc: "",
    label: "",
    isDefault: false
  };
  return(model);
}
export function createNewProbMapSchema() {
  let schema_ = {
    fields: [
      {
        type: 'input',
        inputType: 'number',
        label: 'ID Area',
        model: 'id_area',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Layer',
        model: 'layer',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Filename',
        model: 'filename',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Loc',
        model: 'loc',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Label',
        model: 'label',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: "checkbox",
        label: "Default",
        model: "isDefault",
        featured: false,
        default: false,
      }
    ]
  };
  return(schema_);
}

export function createTableAreaListHeader_V2()
{
  let table_headers = [
    {
      field: 'id_area',
      label: 'Area',
      width: '70px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'name',
      label: 'Name',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'layer_show',
      label: 'Draw',
      width: '80px',
      sortable: false,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'action',
      label: 'Action',
      width: '80px',
      sortable: false,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
  ];
  return (table_headers);
}

export function createNewAreaModel() {
  let model = {
    id_area: -1,
    name: "",
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    x3: 0,
    y3: 0,
    x4: 0,
    y4: 0
  };
  return(model);
}

export function createNewAreaSchema() {
  let schema_ = {
    fields: [
      {
        type: 'input',
        inputType: 'number',
        label: 'ID Area',
        model: 'id_area',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Name',
        model: 'name',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'X1',
        model: 'x1',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Y1',
        model: 'y1',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'X2',
        model: 'x2',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Y2',
        model: 'y2',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'X3',
        model: 'x3',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Y3',
        model: 'y3',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'X4',
        model: 'x4',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Y4',
        model: 'y4',
        placeholder: '',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_);
}
export function createTableUsersListHeader()
{
  let table_headers = [
    {
      field: 'email',
      label: 'Email',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'username',
      label: 'User Name',
      // width: '150px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'label',
      label: 'Label',
      // width: '150px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'level',
      label: 'Level',
      width: '100px',
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'isLogin',
      label: 'Status',
      width: '120px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'action',
      label: 'Action',
      width: '80px',
      sortable: false,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
  ];
  return (table_headers);
}
export function createNewUserModel() {
  let model = {
    username: "",
    email: "",
    password: "",
    level: 1,
    label: "",
    isLogin: false
  };
  return(model);
}
export function createNewUserSchema() {
  let schema_ = {
    fields: [
      {
        type: 'input',
        inputType: 'text',
        label: 'Username',
        model: 'username',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'email',
        label: 'Email',
        model: 'email',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'password',
        label: 'Password',
        model: 'password',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'number',
        label: 'Level',
        model: 'level',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Label',
        model: 'label',
        placeholder: '',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_);
}
export function createTableWellsLiteListHeader()
{
  let table_headers = [
    {
      field: 'filename',
      label: 'Filename',
      // width: '150px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'label',
      label: 'Label',
      // width: '150px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'vue-good-table-td-style',
    },
    {
      field: 'GTS',
      label: 'GTS',
      width: '120px',
      filterOptions: {
        enabled: true,
        placeholder: '',
        trigger: 'enter',
      },
      sortable: true,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
    {
      field: 'action',
      label: 'Action',
      width: '80px',
      sortable: false,
      thClass: 'text-center vue-good-table-header-style',
      tdClass: 'text-center vue-good-table-td-style',
    },
  ];
  return (table_headers);
}
export function createNewWellModel() {
  let model = {
    filename: "",
    label: "",
    GTS: "",
  };
  return(model);
}
export function createNewWellSchema() {
  let schema_ = {
    fields: [
      {
        type: 'input',
        inputType: 'text',
        label: 'Filename',
        model: 'filename',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'Label',
        model: 'label',
        placeholder: '',
        featured: true,
        required: true
      },
      {
        type: 'input',
        inputType: 'text',
        label: 'GTS',
        model: 'GTS',
        placeholder: '',
        featured: true,
        required: true
      },
    ]
  };
  return(schema_);
}
