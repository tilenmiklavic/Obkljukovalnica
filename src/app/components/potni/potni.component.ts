import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { PotniNalog } from 'src/app/classes/potni-nalog';
import { FormattingService } from 'src/app/services/formatting.service';
import { PotniService } from 'src/app/services/potni.service';

@Component({
  selector: 'app-potni',
  templateUrl: './potni.component.html',
  styleUrls: ['./potni.component.css']
})
export class PotniComponent implements OnInit {
  constructor(
    private formattingService: FormattingService,
    private potniService: PotniService
  ) { }
  public settings;
  newPotForm = new FormGroup({
    datumZacetka: new FormControl('', [Validators.required]),
    datumKonca: new FormControl('', [Validators.required]),
    relacija: new FormControl('', [Validators.required]),
    dolzina: new FormControl('', [Validators.required, Validators.min(0)]),
    vloga: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
    this.settings = this.formattingService.getSettings()
  }

  public shraniPot() {
    let pot = new PotniNalog(
      this.settings.potniNalog.ime,
      this.settings.potniNalog.priimek,
      this.settings.potniNalog.naslov,
      this.newPotForm.value.vloga,
      this.newPotForm.value.datumZacetka,
      this.newPotForm.value.datumKonca,
      this.newPotForm.value.relacija,
      this.settings.potniNalog.tarifa,
      this.newPotForm.value.dolzina
    )

    console.log(pot)

    this.potniService.shraniPot(pot)
  }
}
