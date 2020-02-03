import { Component, OnInit } from '@angular/core';
import { AreaService } from '../area.service';
import * as d3 from "d3";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  constructor(private _area: AreaService) { }

  // include the SVG frame and the group element in which the visualization will be actually displayed
  // format the data
  processTemperatireData(data) {
    const result = data.map(d => {
      return {
        date: new Date(d[0]),
        value: +d[1]
      };
    });
    return result;
  }

  updateData: any;

  ngOnInit() {
    const data = [
      [1571308738000, 100.8],
      [1571308738000, 100.8],
      [1571308738000, 100.8],
      [1571308738000, 100.8],
      [1571585001000, 100.8],
      [1571585001000, 100.8],
      [1571585001000, 100.8],
      [1571585001000, 100.8],
      [1571671541000, 100.9],
      [1571671541000, 100.9],
      [1571671541000, 100.9],
      [1571671541000, 100.9],
      [1571764444000, 101.0],
      [1571764444000, 101.0],
      [1571764444000, 101.0],
      [1571764444000, 101.0],
      [1571844201000, 101.1],
      [1571844201000, 101.1],
      [1571844201000, 101.1],
      [1571844201000, 101.1],
      [1571930601000, 101.1],
      [1571930601000, 101.1],
      [1571930601000, 101.1],
      [1571930601000, 101.1],
      [1572017055000, 100.9],
      [1572017055000, 100.9],
      [1572017055000, 100.9],
      [1572017055000, 100.9],
      [1572103504000, 101.5],
      [1572103504000, 101.5],
      [1572103504000, 101.5],
      [1572103504000, 101.5],
      [1572189801000, 101.1],
      [1572189801000, 101.1],
      [1572189801000, 101.1],
      [1572189801000, 101.1],
      [1572276255000, 101.5],
      [1572276255000, 101.5],
      [1572276255000, 101.5],
      [1572276255000, 101.5],
      [1572362741000, 101.2],
      [1572449141000, 101.2],
      [1572449141000, 101.2],
      [1572449141000, 101.2],
      [1572449141000, 101.2]
    ]
    this._area.init({
      container: d3.select(".container-area-chart"),
      width: 600,
      height: 300,
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
    }, {}, {minValue : 90, maxValue: 105})

  this._area.createSVG(this.processTemperatireData(data))
  this._area.createAxis();
  this._area.createArcAndLine();
  this._area.createGrid()
  this._area.createMajorLine(95)
  this._area.createMajorLine(105)
  this._area.createTooltips();

  const threeMonthsData = [[1572612789000,98.8],[1572699189000,98.8],[1572785589000,98.8],[1572872229000,98.4],[1572958389000,98.8],[1573044789000,98.4],[1573140304000,98.4],[1573226741000,98.8],[1573295938000,98.8],[1573400338000,102.0],[1573468738000,98.8],[1573563189000,98.8],[1573641538000,98.6],[1573745938000,98.6],[1573814338000,98.8],[1573900738000,98.8],[1574177001000,98.8],[1574263541000,98.4],[1574356444000,98.6],[1574436201000,101.1],[1574522601000,101.1],[1574609055000,98.4],[1574695504000,98.6],[1574781801000,98.6],[1574868255000,98.6],[1574954741000,98.6],[1575041141000,98.6],[1575344702000,98.4],[1575431103000,98.5],[1575517504000,98.5],[1575603941000,98.6],[1575690344000,98.6],[1575776745000,98.6],[1575905055000,101.0],[1575982389000,100.8],[1576039989000,97.8],[1576129141000,98.6],[1576250461000,98.8],[1576296670000,99.2],[1576382470000,98.6],[1576468810000,97.8],[1576584010000,98.39],[1576643055000,98.6],[1576643055000,98.6],[1576643055000,98.6],[1576731189000,97.8],[1576731189000,97.8],[1576731189000,97.8],[1576731189000,97.8],[1576731189000,97.8],[1576843209000,98.7],[1576843209000,98.7],[1576843209000,98.7],[1576932789000,98.4],[1576932789000,98.4],[1576932789000,98.4],[1577019429000,98.4],[1577019429000,98.4],[1577019429000,98.4],[1577076789000,100.8],[1577076789000,97.8],[1577076789000,97.8],[1577076789000,100.8],[1577076789000,100.8],[1577168655000,102.6],[1577168655000,102.6],[1577168655000,102.6],[1577249589000,97.8],[1577249589000,97.8],[1577341455000,102.6],[1577341455000,102.6],[1577448009000,98.7],[1577448009000,98.7],[1577537589000,98.4],[1577537589000,98.4],[1577624229000,98.4],[1577624229000,98.4],[1577681589000,100.8],[1577681589000,100.8],[1577854389000,97.8],[1577854389000,97.8],[1577946255000,102.6],[1577946255000,102.6],[1578052809000,98.7],[1578052809000,98.7],[1578142389000,98.4],[1578142389000,98.4],[1578229029000,98.4],[1578229029000,98.4],[1578286389000,100.8],[1578286389000,100.8]];

  setTimeout( () => {
    this._area.reloadData(this.processTemperatireData(threeMonthsData))
  }, 5000)
  }
}
