import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Settings } from 'src/app/classes/settings';
import { DataService } from 'src/app/services/data.service';
import { FormattingService } from 'src/app/services/formatting.service';

@Component({
  selector: 'app-ogrodje',
  templateUrl: './ogrodje.component.html',
  styleUrls: ['./ogrodje.component.css']
})
export class OgrodjeComponent implements OnInit {
  public settings: Settings = JSON.parse(localStorage.getItem('settings')) || this.formattingService.newSettings()
  private message: string

  constructor(
    private router: Router,
    private formattingService: FormattingService,
    private dataService: DataService
  ) { }

  tab = 2
  scale1 = 'scale(1)'
  scale2 = 'scale(1)'
  scale3 = 'scale(1)'
  scale4 = 'scale(1)'

  public osebnoNapredovanje = false
  public potniEnabled = false

  public navigate(index: number) {
    this.tab = index
    this.scale1 = 'scale(1)'
    this.scale2 = 'scale(1)'
    this.scale3 = 'scale(1)'
    this.scale4 = 'scale(1)'
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
        case 3:
          this.router.navigate(['potni']);
          this.scale4 = 'scale(1.5)'
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
        case 3:
          this.router.navigate(['potni']);
          this.scale4 = 'scale(1.5)'
          break;
      }
    }
  }

  public refresh() {
    this.osebnoNapredovanje = false
    this.potniEnabled = this.settings.potniNalog.enabled
  }

  private checkCorrectRouting() {
    if (this.osebnoNapredovanje) this.router.navigate(['osebno-napredovanje'])
  }

  ngOnInit(): void {
    this.dataService.currentMessage.subscribe(message => {
      message === "potniEnabled" ? this.potniEnabled = true : this.potniEnabled = false
      console.log("Message revieved")
    })
    this.refresh()
    this.checkCorrectRouting()

    this.settings.potniNalog.enabled ? this.potniEnabled = true : this.potniEnabled = false
  }
}
