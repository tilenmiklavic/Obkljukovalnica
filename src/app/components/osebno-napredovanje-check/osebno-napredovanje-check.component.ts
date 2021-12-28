import { Component, OnInit } from '@angular/core';
import { OsebnoNapredovanjeService } from 'src/app/services/osebno-napredovanje-service.service';

@Component({
  selector: 'app-osebno-napredovanje-check',
  templateUrl: './osebno-napredovanje-check.component.html',
  styleUrls: ['./osebno-napredovanje-check.component.css']
})
export class OsebnoNapredovanjeCheckComponent implements OnInit {

  constructor(
    private osebnoNapredovanjeService: OsebnoNapredovanjeService
  ) { }

  public ONpodatki: Array<any> = null

  public opravilIzziv(udelezenec: any, izziv: any, opravil: boolean) {
    izziv.opravil = opravil
    this.osebnoNapredovanjeService.opravilIzziv(udelezenec, izziv, this.ONpodatki)
  }

  ngOnInit(): void {
    this.osebnoNapredovanjeService.getAll()
    .then(odgovor => {
      this.ONpodatki = odgovor
      console.log(odgovor)
    })
    .catch(napaka => {
      console.log("Napaka", napaka)
    })
  }
}
