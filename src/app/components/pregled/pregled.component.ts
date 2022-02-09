import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { FormattingService } from 'src/app/services/formatting.service';
import { PregledService } from 'src/app/services/pregled.service';

@Component({
  selector: 'app-pregled',
  templateUrl: './pregled.component.html',
  styleUrls: ['./pregled.component.css']
})
export class PregledComponent implements OnInit {

  constructor(
    private formattingService: FormattingService,
    private pregledService: PregledService
  ) { }

  datum = '12.6.'
  header = ''
  loaded = false
  data = []
  vodi = []
  prisotnostPoVodih = []
  prisotnostPoLjudeh = []
  prisotnostPoLjudehMax = 1
  skupine = []
  prisotni = 0
  odsotni = 0
  settings = JSON.parse(localStorage.getItem('settings')) || this.formattingService.newSettings()
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  public sortiranjePoVodih = false

  dayGraphType = ''
  dayGraphPodatki = {}
  dayGraphOptions = {}
  dayGraphLabels = []

  peopleGraphType = ''
  peopleGraphPodatki = {}
  peopleGraphOptions = {}
  peopleGraphLabels = []

  private async setupDayGraph() {

    this.dayGraphLabels = this.pregledService.vrniDatume()
    this.pregledService.pregledPrisotnih(this.settings.skupina, this.dayGraphLabels)
      .then(dayGraphPodatki => {

        console.log(dayGraphPodatki)

        this.dayGraphPodatki = dayGraphPodatki

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
      })
  }

  private setupPeopleGraph() {
    this.peopleGraphLabels = this.pregledService.vrniImena(this.settings.skupina)
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
    this.datum = this.formattingService.getDate()

    this.pregledService.getUdelezenci(this.settings.skupina)
    .then(udelezenci => {
      this.data = udelezenci
      this.loaded = true
    })
    .finally(() => {
      this.setupDayGraph();
      // this.setupPeopleGraph();
      this.vodi = this.pregledService.getVodi()


      // this.prisotnostPoLjudeh = this.pregledService.prisotnostPoLjudeh(this.settings.skupina)
      // this.prisotnostPoVodih = this.pregledService.prisotnostPoVodih(this.settings.skupina)
      // this.prisotnostPoLjudehMax = this.pregledService.steviloIzvedenihSrecanj(this.data, this.sheetService.getHeader())
    })
  }
}
