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

  ngOnInit(): void {
    console.log("Here")
    this.sheetService.getUdelezenci()
      .then(udelezenci => {
        console.log(udelezenci.values)

        let response = udelezenci.values
        let data_titles = response[0]

        for (let i = 1; i < response.length; i++) {
          let foo = {}

          for (let j = 0; j < response[i].length; j++) {
            foo[data_titles[j]] = response[i][j]
          }
          this.data.push(foo)
        }
        console.log(this.data)
      })
  }

}
