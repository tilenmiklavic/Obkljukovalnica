import { Component, OnInit } from '@angular/core';
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
  skupine = []




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

      })
      .catch(napaka => {
        console.error(napaka)
      })
  }

}
