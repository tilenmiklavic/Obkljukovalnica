import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SheetsService } from 'src/app/services/sheets.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {

  constructor(
    private sheetService: SheetsService,
    private _snackBar: MatSnackBar
  ) { }

  data = []
  header = []
  loaded = false
  datum = '12.6.'
  prisotni = 0
  odsotni = 0
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  public present(id: Number, present: Boolean) {

    if (!localStorage.getItem('access_token') || localStorage.getItem('access_token') == 'undefined') {
      this._snackBar.open("Najprej se moraš prijaviti!", "Close")
      return
    }

    console.log("Current data", this.data)
    console.log("Datum", this.datum)
    this.data.forEach(element => {
      if (element.Id == id) {
        if (present) {
          element[this.datum] = 'x'
        } else {
          element[this.datum] = '/'
        }
      }
    })

    let updated_data = []

    this.data.forEach(element => {
      let foo = []
      this.header.forEach(naslov => {
        foo.push(element[naslov])
      })

      updated_data.push(foo)
    })

    updated_data.unshift(this.header)
    console.log("Updated data", updated_data)

    this.sheetService.updateData(updated_data)
      .then(odgovor => {
        console.log("Odgovor", odgovor)
      })
      .catch(napaka => {
        console.error(napaka)
      })
    this.prestej_prisotne()

  }

  public prestej_prisotne() {
    console.log("Prestej prisotne")
    this.prisotni = 0
    this.odsotni = 0

    this.data.forEach(element => {
      if (element[this.datum] == 'x') { this.prisotni += 1 }
      if (element[this.datum] == '/') { this.odsotni += 1 }
    })

    console.log(this.data.length)
    console.log(this.prisotni)
    console.log(this.odsotni)
  }

  ngOnInit(): void {
    // get starting set of all people
    this.sheetService.getUdelezenci(localStorage.getItem('skupina'))
      .then(udelezenci => {
        console.log(udelezenci.values)

        let response = udelezenci.values
        this.header = response[0]

        for (let i = 1; i < response.length; i++) {
          let foo = {}

          for (let j = 0; j < this.header.length; j++) {
            if (!response[i][j]) {
              foo[this.header[j]] = ''
            } else {
              foo[this.header[j]] = response[i][j]
            }
          }
          this.data.push(foo)
        }
        console.log(this.data)
        this.loaded = true
        this.prestej_prisotne()

        if (this.data.length == 0) {
          this._snackBar.open("Za to skupino ni podatkov.", "Close")
        }
      })
      .catch(napaka => {
        console.log("Napaka")
        this.loaded = true

        if (!localStorage.getItem('access_token') || localStorage.getItem('access_token') == 'undefined' || localStorage.getItem('access_token') == 'null') {
          this._snackBar.open("Najprej se moraš prijaviti!", "Close")
        } else if (!localStorage.getItem('idTabele') || localStorage.getItem('idTabele') == 'undefined' || localStorage.getItem('idTabele') == 'null') {
          this._snackBar.open("Vpiši ID tabele!", "Close")
        } else if (!localStorage.getItem('skupina') || localStorage.getItem('skupina') == 'undefined' || localStorage.getItem('skupina') == 'null') {
          this._snackBar.open("Izberi skupino!", "Close")
        }
      })

    // set date for correct querying
    let date = new Date()
    let month = date.getMonth() + 1
    this.datum = `${date.getDate()}.${month}.`

    // check is today date doens't exist yet
    // make it
    let today = false
    this.header.forEach(element => {
      if (element == this.datum) {
        today = true
      }
    })

    if (!today) {
      this.header.push(this.datum)

      this.data.forEach(element => {
        element[this.datum] = ''
      })
    }
  }

}
