// zingchart.RESIZESPEED = 0;
// zingchart.DEBOUNCESPEED = 0;
ZC.LICENSE = ['7b185ca19b4be2cba68fdcd369c663a9'];

zingchart.render({
  id: 'chart3',
  height: '100%',
  width: '100%',
  data: {
    type: 'line',
    backgroundColor: "#FFC107",
    title: {
      text: "Average Interaction",
      textAlign: "left",
      fontColor: "white"
    },
    tooltip: {
      fontColor: "#333"
    },
    plot: {
      margin: "dynamic",
      marker: {
        backgroundColor: "#FFC107",
        borderWidth: "2px"
      }
    },
    scaleX: {
      lineColor: "white",
      tick: {
        lineColor: "white"
      },
      item: {
        fontColor: "white"
      },
      guide: {
        lineColor: "#ffde7b"
      }
    },
    scaleY: {
      lineColor: "white",
      tick: {
        lineColor: "white"
      },
      item: {
        fontColor: "white"
      },
      guide: {
        lineColor: "#ffde7b"
      }
    },
    series: [{
      values: [5, 3, 4, 5, 6, 3, 5, 3, 4, 6, 4, 3, 1],
      lineColor: "white",
      lineWidth: "2px"
    }]

  }
});
zingchart.render({
  id: 'chart2',
  height: '100%',
  width: '100%',
  data: {
    type: "pie",
    backgroundColor: "#f24c4c",
    title: {
      text: "Utilization",
      textAlign: "left",
      marginLeft: "10px",
      adjustLayout: true,
      fontColor: "white"
    },
    subtitle: {
      text: "Amount of current usage",
      textAlign: "left",
      marginLeft: "10px",
      fontColor: "white"
    },
    borderRadius: 4,
    valueBox: {
      visible: true
    },
    plot: {
      slice: 90,
      refAngle: 270,
      detach: false,
      hoverState: {
        visible: false
      },
      valueBox: {
        visible: true,
        type: "first",
        connected: false,
        placement: "center",
        text: "%v%",
        fontColor: "white",
        fontSize: "20px"
      },
      tooltip: {
        fontColor: "#333",
        rules: [{
          rule: "%i == 0",
          text: "%v Created",
          shadow: false,
          borderRadius: 4
        }, {
          rule: "%i == 1",
          text: "%v Left",
          shadow: false,
          borderRadius: 4
        }]
      }
    },
    plotarea: {
      margin: "dynamic",
    },
    series: [{
      values: [30],
      backgroundColor: "#ffffff",
      borderWidth: "0px",
      shadow: 0
    }, {
      values: [70],
      backgroundColor: "#dadada",
      alpha: "0.5",
      borderWidth: "1px",
      borderWidth: "1px",
      shadow: 0,
      valueBox: {
        visible: false
      }
    }]

  }
});
zingchart.render({
  id: 'chart1',
  height: '100%',
  width: '100%',
  data: {
    type: "bar",
    stacked: true,
    stackType: "100%",
    backgroundColor: "#4CAF50",
    title: {
      text: "Load distribution",
      textAlign: "left",
      marginLeft: "10px",
      adjustLayout: true,
      fontColor: "#ffffff"
    },
    subtitle: {
      text: "Utilization across nodes",
      textAlign: "left",
      marginLeft: "10px",
      fontColor: "#ffffff"
    },
    plot: {
      barsSpaceLeft: 0,
      hoverState: {
        visible: false
      }
    },
    tooltip: {
      fontColor: "#333"

    },
    plotarea: {
      margin: "dynamic",
    },
    scaleY: {
      guide: {
        visible: false
      },
      lineWidth: "0px",
      tick: {
        lineWidth: "1px",
        lineColor: "#ffffff"
      },
      item: {
        fontColor: "#ffffff"
      },
      lineColor: "#ffffff"
    },
    scaleX: {
      guide: {
        visible: false
      },
      lineWidth: "1px",
      tick: {
        lineWidth: "1px",
        lineColor: "#ffffff"
      },
      item: {
        fontColor: "#ffffff"
      },
      lineColor: "#ffffff"
    },
    series: [{
      values: [20, 30, 50, 35],
      backgroundColor: "#92C351",
      valueBox: {
        text: "%v%",
        placement: "in",
        offsetY: "-10px"
      }
    }, {
      values: [40, 30, 30, 40],
      backgroundColor: "#e9ffcd",
    }]
  }
});
zingchart.render({
  id: 'chart4',
  height: '100%',
  width: '100%',
  data: {
    backgroundColor: "#28C2D1",
    type: "bar",
    stacked: true,
    title: {
      text: "Status Count",
      textAlign: "left",
      fontColor: "#fff"
    },
    legend: {
      verticalAlign: 'bottom',
      align: 'center',
      layout: "float",
      fontSize: "10px",
      backgroundColor: "transparent",
      borderColor: "transparent",
      shadowColor: "transparent",
      toggleAction: "remove",
      marker: {
        borderColor: "transparent"
      },
      item: {
        markerStyle: "rpoly6",
        fontColor: "#ffffff",

      }
    },
    series: [{
      values: [1637, 1619, 2464, 4289, 4859, 10186, 4285, 2707, 16618, 38444, 42541, 40284, 35921, 38673, 26457],
      text: "status 200",
      backgroundColor: "#d1fbff"

    }, {
      values: [229, 283, 671, 802, 1263, 2943, 2043, 497, 3068, 8265, 8754, 10403, 9558, 9991, 7907],
      text: "status 300",
      backgroundColor: "#3deeff"
    }, {
      values: [10, 4, 19, 17, 18, 59, 49, 14, 168, 392, 428, 438, 330, 431, 283],
      text: "status 400",
      backgroundColor: "#3d94ff"
    }, {
      values: [1, "", 1, "", "", 5, "", 1, ""],
      text: "status 500",
      backgroundColor: "#00626c"
    }],
    tooltip: {
      text: "%v",
      borderRadius: "5px",
      shadow: 0,
      fontColor: "black"
    },
    plot: {
      fontColor: "white",
      hoverState: {
        visible: false
      }
    },
    plotarea: {
      margin: "65px 50px 30px 65px"
    },
    scaleX: {
      transform: {
        type: "date",
        all: "%h:%i %A",
        guide: {
          visible: false
        },
        item: {
          visible: false
        }
      },
      minValue: 1437516814415,
      step: 3600000,
      guide: {
        visible: false
      },
      lineColor: "#ffffff",
      lineWidth: "1px",
      tick: {
        lineColor: "#ffffff",
        lineWidth: "1px"
      },
      item: {
        fontColor: "#ffffff"
      },
      refLine: {
        lineColor: "#ffffff"
      }
    },
    scaleY: {
      guide: {
        lineColor: "#ffffff"
      },
      lineColor: "#ffffff",
      lineWidth: "1px",
      tick: {
        lineColor: "#ffffff",
        lineWidth: "1px",
      },
      item: {
        fontColor: "#ffffff"
      },
      refLine: {
        lineColor: "#ffffff"
      }
    }
  }
})
zingchart.render({
  id: 'chart5',
  height: '100%',
  width: '100%',
  data: {
    type: 'line',
    backgroundColor: "#0277BD",
    title: {
      text: "Communication",
      textAlign: "left",
      fontColor: "white"
    },
    plot: {
      aspect: "spline",
      marker: {
        visible: false
      },
      margin: "dynamic"
    },
    tooltip: {
      fontColor: "#333"

    },
    scaleX: {
      visible: false
    },
    scaleY: {
      lineColor: "white",
      tick: {
        lineColor: "white"
      },
      item: {
        fontColor: "white"
      },
      guide: {
        lineColor: "#ffde7b"
      }
    },
    series: [{
      values: generateSeriesData(100),
      lineColor: "white",
      lineWidth: "2px"
    }]
  }
});
zingchart.render({
  id: 'chart6',
  height: '100%',
  width: '100%',
  data: {
    type: 'line',
    backgroundColor: "#333",
    scaleY: {
      visible: false
    },
    scaleX: {
      visible: false
    },
    labels: [{
      text: "33kw",
      x: "5%",
      y: "2%",
      fontSize: "50px",
      fontColor: "white"
    }],
    plot: {
      borderWidth: "2px",
      marker: {
        visible: false
      },
      rules: [{
        rule: "%v > 20",
        lineColor: "#0380ab"
      }, {
        rule: "%v < 5",
        lineColor: "#04a9e1"
      }]
    },
    plotarea: {
      margin: '70 20 20 20'
    },
    series: [{
      values: generateSeriesData(150),
      backgroundColor: "#EA172F",

    }]
  }
});
zingchart.render({
  id: 'chart7',
  height: '100%',
  width: '100%',
  data: {
    type: "area",
    backgroundColor: "#F01646",
    plot: {
      aspect: "spline",
      alphaArea: 1,
      marker: {
        visible: false
      },
      lineWidth: "1px"
    },
    scaleX: {
      visible: false
    },
    scaleY: {
      visible: false
    },
    plotarea: {
      margin: "70 0 0 0"
    },
    labels: [{
      text: "120bpm",
      x: "5%",
      y: "2%",
      fontSize: "24px",
      fontColor: "#FFF"
    }, {
      text: "70bpm",
      x: "40%",
      y: "2%",
      fontSize: "24px",
      fontColor: "#f690a6"
    }, {
      text: "20bpm",
      x: "70%",
      y: "2%",
      fontSize: "24px",
      fontColor: "#761027"
    }],
    series: [{
      values: [6, 7, 8, 7, 8, 7, 8, 9, 10, 6, 7, 8, 9, 5, 8],
      backgroundColor: "#fff",
      lineColor: "#fff"
    }, {
      values: [3, 3, 4, 5, 5, 6, 7, 5, 6, 5, 4, 3, 4, 4, 5],
      backgroundColor: "#f690a6",
      lineColor: "#f690a6"
    }, {
      values: [1, 2, 3, 2, 1, 2, 2, 3, 4, 4, 3, 2, 2, 2, 3],
      backgroundColor: "#761027",
      lineColor: "#761027"
    }, ]
  }
});
zingchart.render({
  id: 'chart8',
  height: '100%',
  width: '100%',
  data: {
    type: 'hbar',
    backgroundColor: '#5BC254',
    plotarea: {
      margin: 'dynamic'
    },
    title: {
      text: "Distribution",
      textAlign: "left",
      fontColor: "white",
      adjustLayout: true
    },
    subtitle: {
      fontColor: "white",
      textAlign: "left"
    },
    scaleX: {
      lineColor: "transparent",
      item: {
        fontColor: "white",
      },
      tick: {
        lineColor: "transparent",
      },
      labels: ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100"]
    },
    scaleY: {
      maxValue: 15,
      lineColor: "transparent",
      item: {
        fontColor: "white"
      },
      guide: {
        lineStyle: "solid",
        lineColor: "#a1dd9d"
      },
      tick: {
        lineColor: "#a1dd9d",
      }
    },
    plot: {
      hoverState: {
        visible: false
      },
      valueBox: {
        placement: 'top'
      },
      tooltip: {
        visible: false
      }
    },
    series: [{
      values: [2, 3, 5, 6, 8, 10, 12],
      backgroundColor: "#fff"
    }]
  }
})

function generateSeriesData(num) {
  var values = [];
  var startDate = 1349617440000;
  for (var i = 0; i < num; i++) {
    values.push([(startDate + (i * 50000)), Math.floor(Math.random() * 30)])
  }
  return values;
}

// make data appear to be moving
setInterval(function() {
  zingchart.exec('chart6', 'setseriesvalues', {
    plotindex: 0,
    values: generateSeriesData(150)
  });
}, 500);