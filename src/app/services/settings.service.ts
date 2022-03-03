import { Injectable } from '@angular/core';
import { FormattingService } from './formatting.service';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private repositoryService: RepositoryService,
    private formattingService: FormattingService
  ) { }


  public getData() {
    let settings = this.formattingService.getSettings()
    return this.repositoryService.getData(settings.skupina)
  }


  public getSheetInfo(idTabele) {
    return this.repositoryService.getSheetInfo(idTabele)
  }
}
