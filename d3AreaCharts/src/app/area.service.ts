import { Injectable } from "@angular/core";
import * as d3 from "d3";

@Injectable({
  providedIn: "root"
})
export class AreaService {
  NO_OF_TICKS: 10
  CHART_PROPS: any
  DATA: any
  X_AXIS: any
  Y_AXIS: any
  CHART_CONTAINER: any
  ID: string
  SCALES : any
  LINE: any
  AREA: any
  constructor() {
    this.DATA = []
    this.SCALES = {
      XSCALE: {},
      YSCALE: {}
    }
    this.CHART_PROPS = {
      container: '',
      width: null,
      height: null,
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      innerHeght: () => {
        return this.CHART_PROPS.height - this.CHART_PROPS.margin.top - this.CHART_PROPS.margin.bottom
      },
      innerWidth: () => {
        return this.CHART_PROPS.width - this.CHART_PROPS.margin.left - this.CHART_PROPS.margin.right
      }
    }
    this.X_AXIS = {
      minValue : null,
      maxValue : null
    }
    this.Y_AXIS = {
      formate : null,
      noOfTicks : this.NO_OF_TICKS
    }

  }
  init(_props: any, _xAxis, _yAxis) {
    this.ID = '_' + Math.random().toString(36).substr(2, 9)
    this.CHART_PROPS.container = _props?_props.container : null

    this.CHART_PROPS.width = _props?_props.width : null
    this.CHART_PROPS.height = _props?_props.height: null
    this.CHART_PROPS.margin = _props?_props.margin: null
    this.X_AXIS = _xAxis
    this.Y_AXIS =_yAxis
  }
  createSVG(_data: any) {
    this.DATA = _data
    this.CHART_CONTAINER = this.CHART_PROPS.container
      .append("svg")
      .attr("id", this.ID)
      .attr("class", "svg")
      .attr(
        "viewBox",
        `0 0 ${this.CHART_PROPS.width} ${this.CHART_PROPS.height}`
      )
    .append("g")
    .attr("transform", `translate(${this.CHART_PROPS.margin.left}, ${this.CHART_PROPS.margin.top})`);
  }
  createAxis() {
    /* Y Axix */
    const yScale = d3
      .scaleLinear()
      .domain([this.Y_AXIS?this.Y_AXIS.minValue:d3.min(this.DATA, d => d.value),
        this.Y_AXIS?this.Y_AXIS.maxValue:d3.max(this.DATA, d => d.value)])
      .nice()
      .range([this.CHART_PROPS.height - this.CHART_PROPS.margin.bottom, this.CHART_PROPS.margin.top]);
    const yAxis = g => g.attr("transform", `translate(${this.CHART_PROPS.margin.left},0)`)
      .attr("id", "y-axis")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale));

    /* X axis */
    const xScale = d3
      .scaleUtc()
      .domain(d3.extent(this.DATA, (d: { date: any; }) => d.date))
      .range([this.CHART_PROPS.margin.left, this.CHART_PROPS.width - this.CHART_PROPS.margin.right]);

    const xAxis = g => g
      .attr("id", "x-axis")
      .attr("class", "axis")
      .attr("transform", `translate(0,${this.CHART_PROPS.height - this.CHART_PROPS.margin.bottom})`)
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
      .attr("transform", function(d: any) {
        return "rotate(-65)";
      });
    this.CHART_CONTAINER.append("g").call(yAxis);
    this.CHART_CONTAINER.append("g").call(xAxis);

    this.SCALES.XSCALE = xScale;
    this.SCALES.YSCALE = yScale;

  }
  makeGradientPattern() {
    var areaGradient = this.CHART_CONTAINER
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
  }
  createArcAndLine() {
    this.makeGradientPattern()
    const curve = d3.curveLinear;

    const line = d3
      .line()
      // .curve() allows to specify the behavior of the line itself
      .curve(curve)
      .x((d: { date: any; }) => this.SCALES.XSCALE(d.date))
      .y((d: { value: any; }) => this.SCALES.YSCALE(d.value));
    // include a path element for the line, specifying the `d` attribute through the line generator
    this.CHART_CONTAINER
      .append("path")
      .attr("class", "line")
      .attr("d", line(this.DATA));

    const area = d3
      .area()
      .curve(curve)
      .x((d: { date: any; }) => this.SCALES.XSCALE(d.date))
      .y0(this.SCALES.YSCALE(this.Y_AXIS.minValue))
      .y1((d: { value: any; }) => this.SCALES.YSCALE(d.value));

    this.CHART_CONTAINER
      .append("path")
      .datum(this.DATA)
      .attr("class", "area")
      .attr("d", area);

    this.LINE = line;
    this.AREA = area;
  }
  createGrid() {
    // GRID system
    // target all the horizontal ticks and include line elements making up vertical grid lines
    d3.selectAll("#" + this.ID + " #x-axis g.tick")
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", -(this.CHART_PROPS.height - (this.CHART_PROPS.margin.top + this.CHART_PROPS.margin.bottom)));

    // repeat the operation, but with regards to horizontal grid lines
    d3.selectAll("#" + this.ID + " #y-axis g.tick")
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", this.CHART_PROPS.width - (this.CHART_PROPS.margin.left + this.CHART_PROPS.margin.right))
      .attr("y1", 0)
      .attr("y2", 0);
  }
  createMajorLine(value: number){
    const INNER_HEIGHT = this.CHART_PROPS.innerHeght();
    const AVAILABLE_HEIGHT = this.Y_AXIS.maxValue - this.Y_AXIS.minValue;
    const RELATED_HEIGHT = AVAILABLE_HEIGHT - (value - this.Y_AXIS.minValue);
    const ACTUAL_HEIGHT = (RELATED_HEIGHT / AVAILABLE_HEIGHT) * INNER_HEIGHT;
    this.CHART_CONTAINER
      .append("g")
      .append("line")
      .attr("class", "highlightGrid")
      .attr("x1", this.CHART_PROPS.margin.left)
      .attr("x2", this.CHART_PROPS.width - this.CHART_PROPS.margin.right)
      .attr("y1", this.CHART_PROPS.margin.top + ACTUAL_HEIGHT)
      .attr("y2", this.CHART_PROPS.margin.top + ACTUAL_HEIGHT);
  }
  createTooltips() {
    const xScale = this.SCALES.XSCALE
    const yScale = this.SCALES.YSCALE
    const margin = this.CHART_PROPS.margin
    const data = this.DATA
    const width = this.CHART_PROPS.width
    const height = this.CHART_PROPS.height
    //Line chart mouse over
    const hoverLineGroup = this.CHART_CONTAINER
      .append("g")
      .attr("class", "hover-line")
      .style("opacity", 0);

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
      const bisect = d3.bisector(function(d: { date: any; }) {
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
    function hoverMouseOff(d: any) {
      hoverLineGroup.style("opacity", 1e-6);
    }

    function rightTooltipPath(width: number, height: number, offset: number, radius: number) {
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

    this.CHART_CONTAINER.on("mouseout", hoverMouseOff).on("mousemove", hoverMouseOn);
  }

  reloadData(newData: any) {
    this.DATA = newData;

    this.SCALES.XSCALE.domain(d3.extent(this.DATA, function(d: { date: any; }) { return d.date; }));
    this.SCALES.YSCALE.domain([this.Y_AXIS.minValue, this.Y_AXIS.maxValue]);

    // Select the section we want to apply our changes to
    d3.select("svg").transition();
    var svg = d3.select("#"+this.ID)

    // Make the changes
    d3.select("svg").transition().select(".line")
      .attr("d", this.LINE(this.DATA))
      .duration(500);

    svg
      .select(".area")
      .datum(this.DATA).transition()
      .duration(500)
      .attr("d", this.AREA)

    svg
      .select(".area")
      .exit()
      .remove();

    svg.selectAll("#x-axis").remove();
    const xAxis = g => g.attr("id", "x-axis")
      .attr("class", "axis")
      .attr("transform", `translate(0,${this.CHART_PROPS.height - this.CHART_PROPS.margin.bottom})`)
      .call(
        d3
          .axisBottom(this.SCALES.XSCALE)
          .ticks(10)
          .tickFormat(d3.utcFormat("%m/%d"))
      )
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d: any) {
        return "rotate(-65)";
      });
      this.CHART_CONTAINER.append("g").call(xAxis);
    this.createTooltips()
  }


}
