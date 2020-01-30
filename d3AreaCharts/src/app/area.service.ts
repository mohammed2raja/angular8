import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor() { }
  draw() {
    return console.log('Wait it is drawing your chart...');
  }

/*
  option = {
    container: '', //selector ; class/id/element
    width: 600,
    height: 300,
    data: [], // array of data; each item should have
    x-lable: '', // X-axis values's 'label
    y-label: ,,, // Y-axis value's label
    is-X-date: true/false,
    min-X-value: 90,
    max-Y-value: d3.max(data, d => d.value),
    highlight-h-line1: 95,
    highlight-h-line2: 103
  }


*/
drawAreaChart(option) {
  const container = d3.select(option.container);
  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
  const width = option.width - margin.left - margin.right;
  const height = option.height - margin.top - margin.bottom;
  const minYAxisValue = option.minYvalue;
  const maxYAxisValue = option.maxYvalue;
  const highlightValue1 = option.highlightHline1;
  const highlightValue2 = option.highlightHline2;

  const svgContainer = container
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height +
        margin.top +
        margin.bottom}`
    );

  const svgCanvas = svgContainer
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const data = option.data;

  console.log(d3.max(data, d => d.value));
  /* Y Axix */
  const yScale = d3
    .scaleLinear()
    .domain([minYAxisValue, maxYAxisValue])
    // .domain([minYAxisValue, d3.max(data, d => d.value) + 2])
    .nice()
    .range([height - margin.bottom, margin.top]);
  const yAxis = g =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .attr("id", "y-axis")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale));

  /* X axis */
  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right]);

  const xAxis = g =>
    g
      .attr("id", "x-axis")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(20)
          .tickFormat(d3.utcFormat("%m/%d"))
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
        return "rotate(-65)";
      });

  var areaGradient = svgContainer
    .append("defs")
    .append("linearGradient")
    .attr("id", "temperature-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

  areaGradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#f00")
    .attr("stop-opacity", 0.6);
  areaGradient
    .append("stop")
    .attr("offset", "80%")
    .attr("stop-color", "white")
    .attr("stop-opacity", 0);

  const curve = d3.curveLinear;

  const line = d3
    .line()
    // .curve() allows to specify the behavior of the line itself
    .curve(curve)
    .x(d => xScale(d.date))
    .y(d => yScale(d.value));
  // include a path element for the line, specifying the `d` attribute through the line generator
  svgCanvas
    .append("path")
    .attr("class", "line")
    .attr("d", line(data));

  const area = d3
    .area()
    .curve(curve)
    .x(d => xScale(d.date))
    .y0(yScale(minYAxisValue))
    .y1(d => yScale(d.value));

  svgCanvas
    .append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);

  svgCanvas.append("g").call(yAxis);
  svgCanvas.append("g").call(xAxis);

  // GRID system
  // target all the horizontal ticks and include line elements making up vertical grid lines
  d3.selectAll(".area-chart-container #x-axis g.tick")
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", -(height - (margin.top + margin.bottom)));

  // repeat the operation, but with regards to horizontal grid lines
  d3.selectAll(".area-chart-container #y-axis g.tick")
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("x2", width - (margin.left + margin.right))
    .attr("y1", 0)
    .attr("y2", 0);

  const drawMajorLine = value => {
    const INNER_HEIGHT = height - (margin.top + margin.bottom);
    const AVAILABLE_HEIGHT = maxYAxisValue - minYAxisValue;
    const RELATED_HEIGHT = AVAILABLE_HEIGHT - (value - minYAxisValue);
    const ACTUAL_HEIGHT = (RELATED_HEIGHT / AVAILABLE_HEIGHT) * INNER_HEIGHT;
    svgCanvas
      .append("g")
      .append("line")
      .attr("class", "highlightGrid")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", margin.top + ACTUAL_HEIGHT)
      .attr("y2", margin.top + ACTUAL_HEIGHT);
  };
  drawMajorLine(highlightValue1);
  drawMajorLine(highlightValue2);

  function hoverMouseOn() {
    var mouse_x = d3.mouse(this)[0];
    var mouse_y = d3.mouse(this)[1];
    var graph_y = yScale.invert(mouse_y);
    var graph_x = xScale.invert(mouse_x);
    if (
      mouse_x <= margin.left ||
      mouse_x >= width - margin.right ||
      mouse_y >= height - margin.bottom
    ) {
      return;
    }

    hoverLine.attr("x1", mouse_x).attr("x2", mouse_x);
    hoverLineGroup.style("opacity", 1);

    var mouseDate = xScale.invert(mouse_x);
    const bisect = d3.bisector(function(d) {
      return d.date;
    }).right;
    const idx = bisect(data, graph_x);

    var d0 = data[idx - 1];
    var d1 = data[idx];
    if (d0 && d1) {
      var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
      tooltipsContr.attr(
        "transform",
        `translate(${mouse_x + 5},${yScale(d.value)})`
      );
      tooltipsContr.style("opacity", "1");
      tooltipsText.attr("x", "5.5em");
      tooltipsText.attr("y", "-0.3em");
      tooltipsText.text(d3.utcFormat("%b %d, %I:%M %p")(d.date));
      tooltipsTemp.attr("x", "3em");
      tooltipsTemp.attr("y", "1em");
      tooltipsTemp.text(d.value);

      cle
        .attr("cx", mouse_x)
        .attr("cy", yScale(d.value))
        .style("opacity", "1");
    }
  }
  function hoverMouseOff(d) {
    hoverLineGroup.style("opacity", 1e-6);
  }

  //Line chart mouse over
  const hoverLineGroup = svgCanvas
    .append("g")
    .attr("class", "hover-line")
    .style("opacity", 0);

  const hoverLine = hoverLineGroup
    .append("line")
    .attr("stroke", "rgba(0, 0, 0, 0.5)")
    .attr("stroke-dasharray", "1 1")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", margin.top)
    .attr("y2", height - margin.bottom);

  /* tooltips */
  const tooltipsContr = hoverLineGroup.append("g");
  tooltipsContr.style("opacity", "0");
  tooltipsContr
    .append("path")
    .style("fill", "white")
    .style("stroke", "black")
    .attr("d", rightTooltipPath(70, 30, 10, 5));

  const tooltipsText = tooltipsContr
    .append("text")
    .attr("text-anchor", "middle")
    .attr("class", "tooltips-text");

  const tooltipsTempCntr = tooltipsContr.append("text");
  const tooltipsTemp = tooltipsTempCntr
    .append("tspan")
    .attr("text-anchor", "middle")
    .attr("class", "tooltips-text tooltips-temp");

  var cle = hoverLineGroup
    .append("circle")
    .style("opacity", "0")
    .attr("stroke", "#f00")
    .attr("stroke-width", "1")
    .attr("fill", "#000")
    .attr("r", 4);

  svgCanvas.on("mouseout", hoverMouseOff).on("mousemove", hoverMouseOn);

  function rightTooltipPath(width, height, offset, radius) {
    const left = offset;
    const right = offset + width;
    const top = -height / 2;
    const bottom = height / 2;
    return `M 0,0
      L ${left},${-offset}
      V ${top + radius}
      Q ${left},${top} ${left + radius},${top}
      H ${right - radius}
      Q ${right},${top} ${right},${top + radius}
      V ${bottom - radius}
      Q ${right},${bottom} ${right - radius},${bottom}
      H ${left + radius}
      Q ${left},${bottom} ${left},${bottom - radius}
      V ${offset}
      L 0,0 z`;
  }
}
}