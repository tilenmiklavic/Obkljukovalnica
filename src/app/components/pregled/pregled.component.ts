import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { FormattingService } from 'src/app/services/formatting.service';
import { PregledService } from 'src/app/services/pregled.service';
import * as moment from 'moment';

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
    this.dayGraph.labels = this.pregledService.vrniKratkeDatume()
    this.pregledService.pregledPrisotnih(this.settings.skupina, this.pregledService.vrniDatume())
      .then(dayGraphPodatki => {
        console.log(dayGraphPodatki)
        this.dayGraph.podatki = dayGraphPodatki
        this.dayGraph.type = 'bar';
        this.dayGraph.podatki = {
          labels: this.dayGraph.labels,
          datasets: [
            {
              label: "Pregled po dnevih",
              data: this.dayGraph.podatki
            }
          ]
        };
        this.dayGraph.options = {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1.2,
          scales: {
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true
              }
            }]
          }
        };
      })
  }

  public sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("peopleTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
        if (dir == "asc") {
          if (x.innerHTML > y.innerHTML) {
            //if so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML < y.innerHTML) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  ngOnInit(): void {
    // set date for correct querying
    this.datum = this.formattingService.getDate()

    this.pregledService.getUdelezenci(this.settings.skupina)
    .then(udelezenci => {
      this.data = udelezenci
      this.loaded = true

      console.log(this.data)
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
        })


      this.pregledService.steviloIzvedenihSrecanj(this.settings.skupina)
        .then(steviloIzvedenihSrecanj => {
          this.steviloIzvedenihSrecanj = steviloIzvedenihSrecanj
        })
    })
  }
}
