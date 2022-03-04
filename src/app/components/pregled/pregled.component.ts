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
  loaded = false
  data = []
  vodi = []
  prisotnostPoVodih = []
  prisotnostPoLjudeh = []
  steviloIzvedenihSrecanj = 1
  settings = JSON.parse(localStorage.getItem('settings')) || this.formattingService.newSettings()
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  dayGraph = {
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

          this.data.forEach((udelezenec, index) => {
            udelezenec.graphValue = prisotnostPoLjudeh[index]
          })

          this.data.sort((a,b) => (a.vod > b.vod) ? 1 : ((b.vod > a.vod) ? -1 : 0))
        })


      this.pregledService.steviloIzvedenihSrecanj(this.settings.skupina)
        .then(steviloIzvedenihSrecanj => {
          this.steviloIzvedenihSrecanj = steviloIzvedenihSrecanj
        })
    })
  }
}
