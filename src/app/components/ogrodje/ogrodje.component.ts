import { Component, OnInit } from '@angular/core';
import { setClassMetadata } from '@angular/core/src/r3_symbols';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-ogrodje',
  templateUrl: './ogrodje.component.html',
  styleUrls: ['./ogrodje.component.css']
})
export class OgrodjeComponent implements OnInit {

  constructor() { }

  tab = 2
  scale1 = 'scale(1)'
  scale2 = 'scale(1)'
  scale3 = 'scale(1)'

  public changeTab(index) {
    this.tab = index

    this.scale1 = 'scale(1)'
    this.scale2 = 'scale(1)'
    this.scale3 = 'scale(1)'

    switch(index) {
      case 0:
        this.scale1 = 'scale(1.5)'
        break;
      case 1:
        this.scale2 = 'scale(1.5)'
        break;
      case 2:
        this.scale3 = 'scale(1.5)'
        break;
    }

  }

  ngOnInit(): void {
    console.log("Ogrodje")
  }

}
