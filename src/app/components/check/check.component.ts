import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SheetsService } from 'src/app/services/sheets.service';
import { Strings } from 'src/app/classes/strings';
import { FormControl } from '@angular/forms';
import { FormattingService } from 'src/app/services/formatting.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {

  constructor(
    private sheetService: SheetsService,
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
  datumi = []
  prisotni = 0
  odsotni = 0
  today = true
  izbranDatum = new FormControl(new Date())
  izbranDatumIsValid = true
  pending_date = null
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  public prisoten_symbol = localStorage.getItem("prisoten_symbol") || 'x'
  public odsoten_symbol = localStorage.getItem("odsoten_symbol") || '/'
  public upraviceno_odsoten_symbol = localStorage.getItem("upraviceno_odsoten_symbol") || 'o'

  public present(id: Number, present: number) {

    let bar = this.data.map(el => {return {...el}})

    for (let i = 0; i < bar.length; i++) {
      if (bar[i].Id == id) {
        switch(present) {
          case 0:
            bar[i][this.datum] = this.prisoten_symbol
            break;
          case 1:
            bar[i][this.datum] = this.upraviceno_odsoten_symbol
            break;
          case 2:
            bar[i][this.datum] = this.odsoten_symbol
            break;
        }
      }
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

  public prestej_prisotne() {
    this.prisotni = 0
    this.odsotni = 0

    this.data.forEach(element => {
      if (element[this.datum] == 'x') { this.prisotni += 1 }
      if (element[this.datum] == '/' || element[this.datum] == 'o') { this.odsotni += 1 }
    })
  }

  public dateChange() {
    let day = this.izbranDatum.value.getUTCDate() + 1
    let month = this.izbranDatum.value.getUTCMonth() + 1
    this.datum = `${day}.${month}.`

    let currentDate = new Date()
    let currentMonth = currentDate.getMonth() + 1
    let currentDatum = `${currentDate.getDate()}.${currentMonth}.`

    if (this.datum == currentDatum) { this.today = true }
    else { this.today = false }

    if (this.datumi.includes(this.datum)) { this.izbranDatumIsValid = true }
    else { this.izbranDatumIsValid = false }
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
    let date = new Date()
    let month = date.getMonth() + 1
    this.datum = `${date.getDate()}.${month}.`

    // get starting set of all people
    this.sheetService.getUdelezenci(localStorage.getItem('skupina'))
      .then(udelezenci => {

        this.data = udelezenci
        this.loaded = true
        this.valid_data = true
        this.prestej_prisotne()

        for (const [key, value] of Object.entries(this.data[0])) {
          if (this.formattingService.jeDatum(key)) {
            this.datumi.push(key)
          }
        }

        if (this.datumi.includes(this.datum)) { this.izbranDatumIsValid = true }
        else { this.izbranDatumIsValid = false }

        // dobimo kot odgovor prazno tabelo
        if (this.data.length == 0) {
          this._snackBar.open(Strings.noDataErrorNotification, "Close")
        } else {
          let odgovor: any = this.sheetService.checkTodayDate(this.data)
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
