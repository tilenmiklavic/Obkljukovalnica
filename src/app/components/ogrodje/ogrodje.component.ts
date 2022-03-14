import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ogrodje',
  templateUrl: './ogrodje.component.html',
  styleUrls: ['./ogrodje.component.css'],
  animations: [
    trigger('icon1', [
      state('0', style({
        scale: 1.5
      })),
      state('1', style({
        scale: 1
      })),
      state('2', style({
        scale: 1
      })),
      transition('0 => 1', animate('100ms ease-out')),
      transition('0 => 2', animate('100ms ease-out')),
      transition('1 => 0', animate('50ms ease-in')),
      transition('2 => 0', animate('50ms ease-in'))
    ]),
    trigger('icon2', [
      state('0', style({
        scale: 1
      })),
      state('1', style({
        scale: 1.5
      })),
      state('2', style({
        scale: 1
      })),
      transition('1 => 0', animate('100ms ease-out')),
      transition('1 => 2', animate('100ms ease-out')),
      transition('0 => 1', animate('50ms ease-in')),
      transition('2 => 1', animate('50ms ease-in'))
    ]),
    trigger('icon3', [
      state('0', style({
        scale: 1
      })),
      state('1', style({
        scale: 1
      })),
      state('2', style({
        scale: 1.5
      })),
      transition('2 => 0', animate('100ms ease-out')),
      transition('2 => 1', animate('100ms ease-out')),
      transition('0 => 2', animate('50ms ease-in')),
      transition('1 => 2', animate('50ms ease-in'))
    ])
  ]
})
export class OgrodjeComponent implements OnInit {

  constructor(
    private router: Router
  ) { }


  page = "0"
  tab = 2

  public osebnoNapredovanje = false

  public navigate(index: number) {
    this.tab = index
    this.page = index.toString()
    this.refresh()

    if (this.osebnoNapredovanje) {
      switch(index) {
        case 0:
          this.router.navigate(['osebno-napredovanje']);
          break;
        case 1:
          this.router.navigate(['osebno-napredovanje/pregled']);
          break;
        case 2:
          this.router.navigate(['settings']);
          break;
      }
    } else {
      switch(index) {
        case 0:
          this.router.navigate(['/']);
          break;
        case 1:
          this.router.navigate(['pregled']);
          break;
        case 2:
          this.router.navigate(['settings']);
          break;
      }
    }
  }

  public refresh() {
    this.osebnoNapredovanje = JSON.parse(localStorage.getItem('osebnoNapredovanjeEnabled')) || false
  }

  private checkCorrectRouting() {
    if (this.osebnoNapredovanje) this.router.navigate(['osebno-napredovanje'])
  }

  ngOnInit(): void {
    this.refresh()
    this.checkCorrectRouting()
  }
}
