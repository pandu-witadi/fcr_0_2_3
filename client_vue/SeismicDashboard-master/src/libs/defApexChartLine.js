export function getDefaultDarkColor() {
  let dark_color = ["#0000CD", "#FF0000", "#008000", "#FF00FF"];
  return (dark_color);
}

export function getDefaultDarkColorAtIdx(ii) {
  let dark_color = ["#0000CD", "#FF0000", "#008000", "#FF00FF"];
  return (dark_color[ii]);
}


export function createDefaultColor(idx1, idx2, idxc) {
  let list_color = [
    // "#FFFF00", "#FFFFE0", "#FFFACD", "#FAFAD2",
    // "#FFEFD5", "#FFE4B5", "#FFDAB9", "#EEE8AA",
    // "#F0E68C", "#BDB76B", "#FFD700", "#FFF8DC",
    // "#FFEBCD", "#FFE4C4", "#FFDEAD", "#F5DEB3",
    "#DEB887", "#D2B48C", "#BC8F8F", "#F4A460",
    "#DAA520", "#B8860B", "#CD853F", "#D2691E",
    // "#00FFFF", "#E0FFFF", "#AFEEEE", "#7FFFD4",
    "#40E0D0", "#FF1493", "#DB7093", "#C71585",
    "#FFA07A", "#FA8072", "#E9967A", "#F08080",
    "#CD5C5C", "#FF4500", "#FF6347", "#778899",
    "#708090", "#2F4F4F", "#556B2F", "#808000",
    "#6B8E23", "#9ACD32", "#32CD32", "#00FF00",
    "#7CFC00", "#9932CC", "#8B008B", "#800080",
    "#4B0082", "#483D8B", "#6A5ACD", "#7B68EE",
    "#FFC0CB", "#FFB6C1", "#FF69B4", "#7FFF00",
    "#ADFF2F", "#00FF7F", "#00FA9A", "#90EE90",
    "#98FB98", "#8FBC8F", "#66CDAA", "#3CB371",
    // "#E6E6FA", "#48D1CC", "#00CED1", "#20B2AA",
    // "#5F9EA0", "#00FFFF", "#00FFFF", "#E0FFFF",
    // "#AFEEEE", "#7FFFD4", "#40E0D0", "#48D1CC",
    "#00CED1", "#20B2AA", "#5F9EA0", "#DCDCDC",
    "#D3D3D3", "#C0C0C0", "#A9A9A9", "#808080",
    "#696969", "#D8BFD8", "#DDA0DD", "#EE82EE",
    "#DA70D6", "#FF00FF", "#FF00FF", "#BA55D3",
    "#9370DB", "#8A2BE2", "#9400D3", "#FF7F50",
    "#FF8C00", "#FFA500"];

  let dark_color = getDefaultDarkColor();
  let tmp_color = [];
  let ii = 0;
  let idark = 0;
  for (let i = idx1; i <= idx2; i++) {
    if (i === idxc[idark]) {
      tmp_color.push(dark_color[idark]);
      idark = idark + 1;
    } else {
      tmp_color.push(list_color[ii]);
      ii = ii + 1;
    }
  }
  return (tmp_color);
}

export function createDefaultMarker(idx1, idx2, idxc, center_size, other_size) {
  let tmp_marker = [];
  let idx_marker = 0;
  for (let i = idx1; i <= idx2; i++) {
    if (i === idxc[idx_marker]) {
      tmp_marker.push(center_size);
      idx_marker = idx_marker + 1;
    } else
      tmp_marker.push(other_size);
  }

  return ({size: tmp_marker});
}

export function createDefaultParam() {
  let chartOptions = {
    chart: {
      id: "chart-data",
      animations: {
        speed: 50
      }
    },
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
        customIcons: []
      },
      export: {
        csv: {
          filename: 'Seismic',
          columnDelimiter: ',',
          headerCategory: 'numeric',
          headerValue: 'value',
        }
      },
      autoSelected: 'zoom'
    },
    title: {
      // text: this.title,
      align: 'left',
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: 'top',
      horizontalAlign: 'left',
      floating: false,
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      },
    },
    markers: {
      size: [4, 0, 0, 0]
    },
    colors: ['#FF8000', '#1E90FF', '#008000', '#800000', '#800080'],
    stroke: {
      show: true,
      width: 2,
    },
    plotOptions: {
      line: {
        distributed: true
      }
    },
    xaxis: {
      type: 'numeric',
      position: 'top',
      title: {
        offsetY: -65,
        // text: this.xaxis["label"],
        style: {
          fontSize: "120%"
        }
      },
      // categories: this.xaxis["data"],
      labels: {
        offsetY: 10,
        show: true,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: undefined,
        maxHeight: 120,
      },
      axisBorder: {
        show: true,
        color: '#000000',
        height: 1.5,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#000000',
        height: 6,
        offsetX: 0,
        offsetY: 0
      },
    },
    yaxis: {
      title: {
        // text: "Amplitude",
        style: {
          fontSize: "120%"
        }
      },
      axisBorder: {
        show: true,
        color: '#000000',
        offsetX: -8,
        offsetY: 0,
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#000000',
        width: 3,
        offsetX: 8,
        offsetY: 0
      },
      labels: {
        show: true,
        align: 'left',
        formatter: (value) => {
          return value.toFixed(2)
        },
      },
    },
    grid: {
      show: true,
      borderColor: '#C0C0C0',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 5,
        right: 20,
        bottom: 5,
        left: 5
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
      },
      y: {
        formatter: function (value, {series, seriesIndex, dataPointIndex, w}) {
          return value.toFixed(6)
        },
        // title: {
        //   formatter: (seriesName) => seriesName,
        // },
      },
      marker: {
        show: true,
      },
    }
  };
  return (chartOptions);
}

export function apexChartSimpleProperties() {
  let chartOptions = {
    chart: {
      id: "chart-data",
      animations: {
        speed: 50
      },
      width: '100%',
      height: '100%',
    },
    colors: ['#FF8000', '#1E90FF', '#008000', '#800000', '#800080'],
    stroke: {
      show: true,
      width: 2,
    },
    plotOptions: {
      line: {
        distributed: true
      }
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: 'top',
      horizontalAlign: 'left',
      floating: false,
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      },
    },
    markers: {
      size: 4
    },
    xaxis: {
      type: 'numeric',
      labels: {
        show: true,
        align: 'left',
        formatter: (value) => {
          return value.toFixed(2)
        },
        min: undefined,
        max: undefined
      },
    },
    yaxis: {
      labels: {
        show: true,
        align: 'left',
        formatter: (value) => {
          return value.toFixed(2)
        },
        min: undefined,
        max: undefined
      },
    },
    // tooltip: {
    //   enabled: true,
    //   x: {
    //     show: true,
    //   },
    //   y: {
    //     formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
    //       return value.toFixed(2)
    //     },
    //   },
    //   marker: {
    //     show: true,
    //   },
    // },
    grid: {
      show: true,
      borderColor: '#C0C0C0',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
    },
  };
  return (chartOptions);
}

export function createAvgProbChartOptions() {
  let chartOptions = {
    chart: {
      type: 'bar',
      animations: {
        speed: 10
      },
    },
    plotOptions: {
      bar: {
        barHeight: '100%',
        distributed: true,
        // horizontal: false,
        dataLabels: {
          position: 'bottom'
        },
      }
    },
    colors: ['#313695'],
    dataLabels: {
      enabled: false,
      textAnchor: 'start',
      style: {
        colors: ['#fff']
      },
      formatter: function (val, opt) {
        return val.toFixed(3)
      },
      offsetX: 0,
      dropShadow: {
        enabled: true
      }
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      labels: {
        show: true,
        formatter: function (val, opt) {
          return val.toFixed(3)
        },
      }
    },
    title: {
      text: 'Custom DataLabels',
      align: 'center',
      floating: true
    },
    // subtitle: {
    //   text: 'Category Names as DataLabels inside bars',
    //     align: 'center',
    // },
    tooltip: {
      theme: 'dark',
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function () {
            return ''
          }
        }
      }
    },
    legend: {
      show: false
    }
  };
  return (chartOptions);
}

export function createEcdfChartOptions() {
  let chartOptions = {
    chart: {
      type: 'line',
      animations: {
        speed: 10
      },
    },
    colors: ['#990000', '#000000'],
    dataLabels: {
      enabled: false,
      textAnchor: 'start',
      style: {
        colors: ['#fff']
      },
      formatter: function (val, opt) {
        return val.toFixed(3)
      },
      offsetX: 0,
      dropShadow: {
        enabled: true
      }
    },
    stroke: {
      // curve: 'stepline',
      width: 1,
      // colors: ['#fff']
    },
    xaxis: {
      title: {text: "x"},
      tickAmount: 10,
      labels: {
        formatter: function(val) {
          return parseFloat(val).toFixed(2)
        }
      }
    },
    yaxis: {
      title: {text: "y"},
      labels: {
        show: true,
        formatter: function (val, opt) {
          return val.toFixed(3)
        },
      }
    },
    markers: {
      size: [4, 0, 0, 0]
    },
    title: {
      text: 'Custom DataLabels',
      align: 'center',
      floating: true
    },
    // subtitle: {
    //   text: 'Category Names as DataLabels inside bars',
    //     align: 'center',
    // },
    tooltip: {
      theme: 'dark',
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function () {
            return ''
          }
        }
      }
    },
    legend: {
      show: false
    }
  };
  return (chartOptions);
}

export function createProbMapParam() {
  let chartOptions = {
    chart: {
      id: "chart-data",
      animations: {
        speed: 20
      }
    },
    title: {
      text: "title",
      align: 'center',
    },
    legend: {
      show: false,
    },
    markers: {
      size: 6
    },
    colors: ['#FF8000', '#1E90FF', '#008000', '#800000', '#800080'],
    stroke: {
      show: false,
      width: 0,
    },
    plotOptions: {
      line: {
        distributed: true
      }
    },
    xaxis: {
      type: 'numeric',
      title: {
        text: "X",
      },
      labels: {
        show: true,
        formatter: function (val, opt) {
          return val.toFixed(0)
        },
      },
    },
    yaxis: {
      title: {
        text: "Y",
      },
      labels: {
        show: true,
        formatter: function (val, opt) {
          return val.toFixed(0)
        },
      },
    },
    grid: {
      show: true,
      borderColor: '#C0C0C0',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true
        },
      },
      yaxis: {
        lines: {
          show: true
        }
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
      },
      y: {
        // formatter: function (value, {series, seriesIndex, dataPointIndex, w}) {
        //   return ("X:" + value.toFixed(6));
        // },
        // title: {
        //   formatter: (seriesName) => seriesName,
        // },
      },
      marker: {
        show: true,
      },
    }
  };
  return (chartOptions);
}
