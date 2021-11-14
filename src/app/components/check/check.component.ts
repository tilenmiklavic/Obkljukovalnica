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
  datum = null
  prisotni = 0
  odsotni = 0
  today = true
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  public prisoten_symbol = localStorage.getItem("prisoten_symbol") || 'x'
  public odsoten_symbol = localStorage.getItem("odsoten_symbol") || '/'
  public upraviceno_odsoten_symbol = localStorage.getItem("upraviceno_odsoten_symbol") || 'o'

  public present(id: Number, present: number) {

    if (!localStorage.getItem('access_token') || localStorage.getItem('access_token') == 'undefined') {
      this._snackBar.open("Najprej se moraš prijaviti!", "Close")
      return
    }

    console.log("Current data", this.data)
    console.log("Datum", this.datum)
    this.data.forEach(element => {

      if (element.Id == id) {
        switch(present) {
          case 0:
            element[this.datum] = this.prisoten_symbol
          break;
          case 1:
            element[this.datum] = this.upraviceno_odsoten_symbol
          break;
          case 2:
            element[this.datum] = this.odsoten_symbol
          break;
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
    this.prisotni = 0
    this.odsotni = 0

    this.data.forEach(element => {
      if (element[this.datum] == 'x') { this.prisotni += 1 }
      if (element[this.datum] == '/' || element[this.datum] == 'o') { this.odsotni += 1 }
    })
  }

  private invalidFormating() {
    this._snackBar.open("Tabela prisotnosti ni pravilno formatirana. Poglej navodila.", "Close")
    this.loaded = true
  }

  public changeDate(future: boolean) {
    let current_index = 0

    this.header.forEach((element, index) => {
      if (element == this.datum) {
        current_index = index
      }
    })

    console.log(current_index)

    let new_index = current_index

    if (future) new_index++
    else new_index--

    this.datum = this.header[new_index]
  }

  ngOnInit(): void {
    // get starting set of all people
    this.sheetService.getUdelezenci(localStorage.getItem('skupina'))
      .then(udelezenci => {

        let response = udelezenci.values

        // header prestavlja imena stolpcev
        // naprej uporabimo header za določanje imen v objektih
        this.header = response[0]

        console.log(this.header)
        if (!this.header.includes("Id") || !this.header.includes("Ime") ) {
          console.log("Yes")
          this.invalidFormating()
          return
        }

        // vsako posamezno vrstico v tabeli spremenimo v objekt
        // shranimo v spremenljivko data
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
        this.loaded = true
        this.prestej_prisotne()


        // odstranimo vse vrstice, ki nimajo ID-ja
        // torej niso predvidene osebe
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].Id == undefined || isNaN(this.data[i].Id) || this.data[i].Id.length == 0) {
            this.data.splice(i,1);
            i--;
          }
        }

        // dobimo kot odgovor prazno tabelo
        if (this.data.length == 0) {
          this._snackBar.open("Za to skupino ni podatkov.", "Close")
        } else {
          // check is today date doens't exist yet
          // make it
          this.today = false
          this.header.forEach(element => {
            if (element == this.datum) {
              this.today = true
            }
          })

          if (!this.today) {
            // set date for correct querying
            let date = new Date()
            let month = date.getMonth() + 1
            this.datum = `${date.getDate()}.${month}.`

            this.header.push(this.datum)

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
          this._snackBar.open("Najprej se moraš prijaviti!", "Close")
        } else if (!localStorage.getItem('idTabele') || localStorage.getItem('idTabele') == 'undefined' || localStorage.getItem('idTabele') == 'null') {
          this._snackBar.open("Vpiši ID tabele!", "Close")
        } else if (!localStorage.getItem('skupina') || localStorage.getItem('skupina') == 'undefined' || localStorage.getItem('skupina') == 'null') {
          this._snackBar.open("Izberi skupino!", "Close")
        }
      })
  }
}
