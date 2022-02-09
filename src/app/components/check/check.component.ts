import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SheetsService } from 'src/app/services/sheets.service';
import { Strings } from 'src/app/classes/strings';
import { CheckService } from 'src/app/services/check.service';
import { FormattingService } from 'src/app/services/formatting.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {

  constructor(
    private sheetService: SheetsService,
    private checkService: CheckService,
    private formattingService: FormattingService,
    private _snackBar: MatSnackBar
  ) { }

  data = []
  imena = []
  foo = null
  valid_data = false
  header = []
  loaded = false
  datum = null
  prisotni = 0
  odsotni = 0
  today = true
  pending_date = null
  settings = JSON.parse(localStorage.getItem('settings')) || this.formattingService.newSettings()
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  public present(id: Number, present: number) {

    this.checkService.nastaviPrisotnost(id, present)
      .then((odgovor) => {
        if (odgovor) {

          console.log(odgovor)
          this.today = true
          // this.data = bar
        }
      })
      .catch((napaka) => {
        this._snackBar.open(Strings.noInternetConnectionError, "Zapri")
      })
      .finally(() => {
        this.prestej_prisotne()
      })
  }

  public prestej_prisotne() {
    this.prisotni = 0
    this.odsotni = 0

    this.data.forEach(element => {
      if (element[this.datum] == 'x') { this.prisotni += 1 }
      if (element[this.datum] == '/' || element[this.datum] == 'o') { this.odsotni += 1 }
    })
  }

  public changeDate(future: boolean) {

    let datumChanged = this.sheetService.changeDate(future, this.pending_date, this.datum, this.today)

    console.log(datumChanged)

    if (datumChanged) {
      this.today = datumChanged.today
      this.pending_date = datumChanged.pendingDate
      this.datum = datumChanged.datum
    }
  }

  public clearInput() {
    let bar = this.data.map(el => {return {...el}})

    for (let i = 0; i < bar.length; i++) {
      bar[i][this.datum] = "";
    }

    this.sheetService.nastaviPrisotnost(bar)
      .then((odgovor) => {
        if (odgovor) {
          this.today = true
          this.data = bar
        }
      })
      .catch((napaka) => {
        this._snackBar.open(Strings.noInternetConnectionError, "Zapri")
      })
      .finally(() => {
        this.prestej_prisotne()
      })
  }

  ngOnInit(): void {
    this.datum = this.formattingService.getDate()

    // get starting set of all people
    this.checkService.getUdelezenci(this.settings.skupina)
      .then(udelezenci => {

        this.data = udelezenci
        this.loaded = true
        this.valid_data = true
        this.prestej_prisotne()

        // dobimo kot odgovor prazno tabelo
        if (this.data.length == 0) {
          this._snackBar.open(Strings.noDataErrorNotification, "Close")
        } else {
          let odgovor: any = this.checkService.checkTodayDate()
          this.today = odgovor.today

          if (!odgovor.today) {
            this.data.forEach(element => {
              element[this.datum] = ''
            })
          }
        }
      })
      .catch(napaka => {
        console.log("Napaka", napaka)
        this.loaded = true

        if (!localStorage.getItem('access_token') || localStorage.getItem('access_token') == 'undefined' || localStorage.getItem('access_token') == 'null') {
          this._snackBar.open(Strings.signUpNotification, "Zapri")
        } else if (!localStorage.getItem('idTabele') || localStorage.getItem('idTabele') == 'undefined' || localStorage.getItem('idTabele') == 'null') {
          this._snackBar.open(Strings.tableIdInputNotification, "Zapri")
        } else if (!localStorage.getItem('skupina') || localStorage.getItem('skupina') == 'undefined' || localStorage.getItem('skupina') == 'null') {
          this._snackBar.open(Strings.groupSelectNoticiation, "Zapri")
        }
      })
  }
}
