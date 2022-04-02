import { Injectable } from '@angular/core';
import { PotniNalog } from '../classes/potni-nalog';
import { FormattingService } from './formatting.service';

@Injectable({
  providedIn: 'root'
})
export class PotniService {

  constructor(
    private formattingService: FormattingService
  ) { }

  public shraniPot(pot: PotniNalog) {
    let settings = this.formattingService.getSettings()

    console.log(settings)

    if (settings.potniNalog.poti) {
      settings.potniNalog.poti.append(pot)
    } else {
      settings.potniNalog.poti = [pot]
    }

    this.formattingService.saveSettings(settings)
  }
}
