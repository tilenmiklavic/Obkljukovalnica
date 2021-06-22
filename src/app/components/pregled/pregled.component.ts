import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { SheetsService } from 'src/app/services/sheets.service';

@Component({
  selector: 'app-pregled',
  templateUrl: './pregled.component.html',
  styleUrls: ['./pregled.component.css']
})
export class PregledComponent implements OnInit {

  constructor(
    private sheetsService: SheetsService
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




  ngOnInit(): void {
    // set date for correct querying
    let date = new Date()
    let month = date.getMonth() + 1
    this.datum = `${date.getDate()}.${month}.`

    // retrieve all groups
    this.sheetsService.getSkupine()
      .then(odgovor => {
        console.log(odgovor)
        odgovor.sheets.forEach(element => {
          let foo = {"id": element.properties.sheetId, "ime": element.properties.title}
          this.skupine.push(foo)
        })

        // get all skupine and data
        this.skupine.forEach(skupina => {

            // get starting set of all people
          this.sheetsService.getUdelezenci(skupina.ime)
          .then(udelezenci => {
            console.log(udelezenci.values)

            let response = udelezenci.values
            this.header = response[0]

            let vmesni = []

            for (let i = 1; i < response.length; i++) {
              let foo = {}

              for (let j = 0; j < this.header.length; j++) {
                if (!response[i][j]) {
                  foo[this.header[j]] = ''
                } else {
                  foo[this.header[j]] = response[i][j]
                }
              }
              vmesni.push(foo)

            }

            // setting completenes level for each group
            let total = 0
            let prisotni = 0
            let odsotni = 0
            vmesni.forEach(element => {
              total += 1

              if (element[this.datum] == 'x') { prisotni += 1; this.prisotni += 1 }
              else if (element[this.datum] == '/') { odsotni += 1; this.odsotni += 1 }

            })
            let procent = ((prisotni + odsotni) * 100 / total).toFixed(0)

            let bar = {"ime": skupina.ime, "values": vmesni, "total": total, "prisotni": prisotni, "odsotni": odsotni, "procent": procent}
            this.data.push(bar)
            console.log(bar)


            this.loaded = true
          })
        })
      })
      .catch(napaka => {
        console.error(napaka)
      })
  }

}
