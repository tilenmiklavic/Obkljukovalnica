import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { FormattingService } from 'src/app/services/formatting.service';
import { SheetsService } from 'src/app/services/sheets.service';

@Component({
  selector: 'app-pregled',
  templateUrl: './pregled.component.html',
  styleUrls: ['./pregled.component.css']
})
export class PregledComponent implements OnInit {

  constructor(
    private sheetService: SheetsService,
    private formattingService: FormattingService
  ) { }

  datum = '12.6.'
  header = ''
  loaded = false
  data = []
  skupine = []
  prisotni = 0
  odsotni = 0
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  dayGraphType = ''
  dayGraphPodatki = {}
  dayGraphOptions = {}
  dayGraphLabels = []

  peopleGraphType = ''
  peopleGraphPodatki = {}
  peopleGraphOptions = {}
  peopleGraphLabels = []

  private setupDayGraph() {

    this.dayGraphLabels = this.formattingService.vrniDatume(this.header)
    this.dayGraphPodatki = this.formattingService.pregledPrisotnih(this.data, this.dayGraphLabels)

    this.dayGraphType = 'bar';
    this.dayGraphPodatki = {
      labels: this.dayGraphLabels,
      datasets: [
        {
          label: "Pregled po osebah",
          data: this.dayGraphPodatki
        }
      ]
    };
    this.dayGraphOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }


  private setupPeopleGraph() {
    this.peopleGraphLabels = this.formattingService.vrniImena(this.data)
    this.peopleGraphPodatki = this.formattingService.prisotnostPoLjudeh(this.data, this.dayGraphLabels)

    this.formattingService.vrniImena(this.data)
    this.peopleGraphType = 'bar';
    this.peopleGraphPodatki = {
      labels: this.peopleGraphLabels,
      datasets: [
        {
          label: "Pregled po dnevih",
          data: this.peopleGraphPodatki
        }
      ]
    };
    this.peopleGraphOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }


  private invalidFormating() {
    // this._snackBar.open("Tabela prisotnosti ni pravilno formatirana. Poglej navodila.", "Close")
    this.loaded = true
  }


  ngOnInit(): void {
    // set date for correct querying
    let date = new Date()
    let month = date.getMonth() + 1
    this.datum = `${date.getDate()}.${month}.`

    this.sheetService.getUdelezenci(localStorage.getItem('skupina'))
    .then(udelezenci => {
      let response = udelezenci.values

      // header prestavlja imena stolpcev
      // naprej uporabimo header za določanje imen v objektih
      this.header = response[0]

      if (!this.header.includes("Id") || !this.header.includes("Ime") ) {
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
      // this.prestej_prisotne()


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
        // this._snackBar.open("Za to skupino ni podatkov.", "Close")
      }
    })
    .finally(() => {
      this.setupDayGraph();
      this.setupPeopleGraph();
    })
  }
}
