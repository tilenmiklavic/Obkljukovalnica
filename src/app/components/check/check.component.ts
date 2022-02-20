import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SheetsService } from 'src/app/services/sheets.service';
import { Strings } from 'src/app/classes/strings';
import { CheckService } from 'src/app/services/check.service';
import { FormattingService } from 'src/app/services/formatting.service';
import { FormControl } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckComponent implements OnInit {

  constructor(
    private checkService: CheckService,
    private formattingService: FormattingService,
    private _snackBar: MatSnackBar,
    private sheetService: SheetsService
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
  settings = JSON.parse(localStorage.getItem('settings')) || this.formattingService.newSettings()
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    // Highlight dates with existing columns
    if (view === 'month') {
      const date = cellDate.getDate();
      const month = cellDate.getMonth() + 1;
      const datum = `${date}.${month}.`

      return this.datumi.includes(datum) ? 'example-custom-date-class' : '';
    }

    return '';
  };

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
    this.datum = this.formattingService.getDate()

    // get starting set of all people
    this.checkService.getUdelezenci(this.settings.skupina)
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
