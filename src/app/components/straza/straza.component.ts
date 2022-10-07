import { Component, OnInit } from '@angular/core';
import { StrazaService } from 'src/app/services/straza.service';

@Component({
  selector: 'app-straza',
  templateUrl: './straza.component.html',
  styleUrls: ['./straza.component.css']
})
export class StrazaComponent implements OnInit {

  constructor(
    private strazaService: StrazaService
  ) { }

  ngOnInit(): void {
    this.strazaService.getImena()
      .then(odgovor => {
        console.log(odgovor)
      })
  }
}
