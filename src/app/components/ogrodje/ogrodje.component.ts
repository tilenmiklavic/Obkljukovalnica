import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ogrodje',
  templateUrl: './ogrodje.component.html',
  styleUrls: ['./ogrodje.component.css']
})
export class OgrodjeComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  tab = 2
  scale1 = 'scale(1.5)'
  scale2 = 'scale(1)'
  scale3 = 'scale(1)'

  private osebnoNapredovanje = false
  private straza = false

  public navigate(index: number) {
    this.tab = index
    this.scale1 = 'scale(1)'
    this.scale2 = 'scale(1)'
    this.scale3 = 'scale(1)'
    this.refresh()

    if (this.osebnoNapredovanje) {
      switch(index) {
        case 0:
          this.router.navigate(['osebno-napredovanje']);
          this.scale1 = 'scale(1.5)'
          break;
        case 1:
          this.router.navigate(['osebno-napredovanje/pregled']);
          this.scale2 = 'scale(1.5)'
          break;
        case 2:
          this.router.navigate(['settings']);
          this.scale3 = 'scale(1.5)'
          break;
      }
    } else if (this.straza) {
      switch(index) {
        case 0:
          this.router.navigate(['straza']);
          this.scale1 = 'scale(1.5)'
          break;
        case 1:
          this.router.navigate(['straza/pregled']);
          this.scale2 = 'scale(1.5)'
          break;
        case 2:
          this.router.navigate(['settings']);
          this.scale3 = 'scale(1.5)'
          break;
      }
    } else {
      switch(index) {
        case 0:
          this.router.navigate(['/']);
          this.scale1 = 'scale(1.5)'
          break;
        case 1:
          this.router.navigate(['pregled']);
          this.scale2 = 'scale(1.5)'
          break;
        case 2:
          this.router.navigate(['settings']);
          this.scale3 = 'scale(1.5)'
          break;
      }
    }
  }

  public refresh() {
    let settings = JSON.parse(localStorage.getItem('settings'))

    this.osebnoNapredovanje = settings.osebnoNapredovanje?.enabled || false
    this.straza = settings.straza?.enabled || false
  }

  private checkCorrectRouting() {
    if (this.osebnoNapredovanje) this.router.navigate(['osebno-napredovanje'])
    if (this.straza) this.router.navigate(['straza'])
  }

  ngOnInit(): void {
    this.refresh()
    this.checkCorrectRouting()
  }
}
