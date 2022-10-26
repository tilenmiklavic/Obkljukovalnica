import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from 'src/app/classes/settings';
import { FormattingService } from 'src/app/services/formatting.service';

@Component({
  selector: 'app-ogrodje',
  templateUrl: './ogrodje.component.html',
  styleUrls: ['./ogrodje.component.css']
})
export class OgrodjeComponent implements OnInit {

  constructor(
    private router: Router,
    private formattingService: FormattingService
  ) { }

  public settings: Settings = JSON.parse(localStorage.getItem('settings')) || this.formattingService.newSettings()

  tab = 2
  scale1 = 'scale(1)'
  scale2 = 'scale(1)'
  scale3 = 'scale(1)'

  public navigate(index: number) {
    this.tab = index
    this.scale1 = 'scale(1)'
    this.scale2 = 'scale(1)'
    this.scale3 = 'scale(1)'
    this.refresh()

    if (this.settings.osebnoNapredovanje.enabled) {
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
    // this.osebnoNapredovanje = JSON.parse(localStorage.getItem('osebnoNapredovanjeEnabled')) || false
  }

  private checkCorrectRouting() {
    // if (this.osebnoNapredovanje) this.router.navigate(['osebno-napredovanje'])
  }

  ngOnInit(): void {
    this.refresh()
    this.checkCorrectRouting()
  }
}
