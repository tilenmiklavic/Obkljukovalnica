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
  imena = []
  prisotnostPoLjudeh = []
  prisotnostPoLjudehMax = 1
  skupine = []
  prisotni = 0
  odsotni = 0
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  public miniamal_presence = parseInt(localStorage.getItem("minimal_presence")) || 50
  public low_presence = parseInt(localStorage.getItem("low_presence")) || 70

  dayGraphType = ''
  dayGraphPodatki = {}
  dayGraphOptions = {}
  dayGraphLabels = []

  peopleGraphType = ''
  peopleGraphPodatki = {}
  peopleGraphOptions = {}
  peopleGraphLabels = []

  private setupDayGraph() {

    this.dayGraphLabels = this.formattingService.vrniDatume(this.sheetService.getHeader())
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
      maintainAspectRatio: false,
      aspectRatio: 1.2
    };
  }

  private setupPeopleGraph() {
    this.peopleGraphLabels = this.formattingService.vrniImena(this.data)
    this.peopleGraphPodatki = this.formattingService.prisotnostPoLjudeh(this.data, this.dayGraphLabels)

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
      maintainAspectRatio: false,
      aspectRatio: 1.2
    };
  }

  ngOnInit(): void {
    // set date for correct querying
    let date = new Date()
    let month = date.getMonth() + 1
    this.datum = `${date.getDate()}.${month}.`

    this.sheetService.getUdelezenci(localStorage.getItem('skupina'))
    .then(udelezenci => {
      this.data = udelezenci
      this.loaded = true
    })
    .finally(() => {
      this.setupDayGraph();
      this.setupPeopleGraph();
      this.imena = this.formattingService.vrniImena(this.data)
      this.prisotnostPoLjudeh = this.formattingService.prisotnostPoLjudeh(this.data, this.sheetService.getHeader())
      this.prisotnostPoLjudehMax = this.formattingService.steviloIzvedenihSrecanj(this.data, this.sheetService.getHeader())
    })
  }
}
