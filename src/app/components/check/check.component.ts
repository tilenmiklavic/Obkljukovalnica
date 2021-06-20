import { Component, OnInit } from '@angular/core';
import { SheetsService } from 'src/app/services/sheets.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {

  constructor(
    private sheetService: SheetsService
  ) { }

  data = []
  header = []
  datum = '12.6.'

  public present(id: Number, present: Boolean) {

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
    console.log(updated_data)

    this.sheetService.updateData(updated_data)
      .then(odgovor => {
        console.log(odgovor)
      })
      .catch(napaka => {
        console.error(napaka)
      })
  }

  ngOnInit(): void {
    console.log("Here")
    this.sheetService.getUdelezenci()
      .then(udelezenci => {
        console.log(udelezenci.values)

        let response = udelezenci.values
        this.header = response[0]

        for (let i = 1; i < response.length; i++) {
          let foo = {}

          for (let j = 0; j < response[i].length; j++) {
            foo[this.header[j]] = response[i][j]
          }
          this.data.push(foo)
        }
        console.log(this.data)
      })
  }

}
