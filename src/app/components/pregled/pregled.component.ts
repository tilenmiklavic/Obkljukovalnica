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
  steviloIzvedenihSrecanj = 1
  skupine = []
  prisotni = 0
  odsotni = 0
  settings = JSON.parse(localStorage.getItem('settings')) || this.formattingService.newSettings()
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  public sortiranjePoVodih = false

  dayGraph = {
    type: '',
    podatki: {},
    options: {},
    labels: [],
  }

  peopleGraph = {
    type: '',
    podatki: {},
    options: {},
    labels: [],
  }

  private async setupDayGraph() {

    this.dayGraph.labels = this.pregledService.vrniDatume()
    this.pregledService.pregledPrisotnih(this.settings.skupina, this.dayGraph.labels)
      .then(dayGraphPodatki => {
        this.dayGraph.podatki = dayGraphPodatki
        this.dayGraph.type = 'bar';
        this.dayGraph.podatki = {
          labels: this.dayGraph.labels,
          datasets: [
            {
              label: "Pregled po osebah",
              data: this.dayGraph.podatki
            }
          ]
        };
        this.dayGraph.options = {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1.2
        };
      })
  }

  private setupPeopleGraph() {
    this.peopleGraph.labels = this.pregledService.vrniImena(this.settings.skupina)
    this.peopleGraph.podatki = this.formattingService.prisotnostPoLjudeh(this.data, this.dayGraph.labels)

    this.peopleGraph.type = 'bar';
    this.peopleGraph.podatki = {
      labels: this.peopleGraph.labels,
      datasets: [
        {
          label: "Pregled po dnevih",
          data: this.peopleGraph.podatki
        }
      ]
    };
    this.peopleGraph.options = {
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
      this.vodi = this.pregledService.vrniVode()

      this.pregledService.prisotnostPoLjudeh(this.settings.skupina)
        .then(prisotnostPoLjudeh => {
          this.prisotnostPoLjudeh = prisotnostPoLjudeh
        })


      this.pregledService.steviloIzvedenihSrecanj(this.settings.skupina)
        .then(steviloIzvedenihSrecanj => {
          this.steviloIzvedenihSrecanj = steviloIzvedenihSrecanj
        })

      this.pregledService.prisotnostPoVodih(this.settings.skupina)
        .then(prisotnostPoVodih => {
          this.prisotnostPoVodih = prisotnostPoVodih
        })
    })
  }
}
