import { Component, OnInit } from '@angular/core';
import { AreaService } from '../area.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  constructor(private _area: AreaService) { }

  // include the SVG frame and the group element in which the visualization will be actually displayed

  // format the data
  processTemperatireData() {
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
    const result = data.map(d => {
      return {
        date: new Date(d[0]),
        value: +d[1]
      };
    });
    return result;
  }



  ngOnInit() {
    this._area.drawAreaChart({
      container: "#app",
      width: 600,
      height: 300,
      data: this.processTemperatireData(),
      Xlable: "date",
      Ylabel: "value",
      minYvalue: 90,
      maxYvalue: 105,
      highlightHline1: 95,
      highlightHline2: 103
    });
  }

}
