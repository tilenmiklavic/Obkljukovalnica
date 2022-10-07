import { Injectable } from '@angular/core';
import { Strazar } from '../classes/strazar';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class StrazaService {

  constructor(
    private repositoryService: RepositoryService
  ) { }

  public getImena(): Promise<Strazar[]> {

    return this.repositoryService.getData("1J-PiW1gUnqk7l7TpD9AMzaTQmNh2EDRNM0GkzLECiuE", "List1", true)

  }
}
