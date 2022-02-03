import { Injectable } from '@angular/core';
import { Udelezenec } from '../classes/udelezenec';
import { AlertService } from './alert.service';
import { FormattingService } from './formatting.service';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root'
})
export class CheckService {

  constructor(
    private repositoryService: RepositoryService,
    private formattingService: FormattingService,
    private alertService: AlertService
  ) { }

  // gets data from repository service
  public getUdelezenci(skupina: String): Promise<Udelezenec[]> {

    return this.repositoryService.getData(skupina)

  }


  // changes current data coresponding to input
  // converts objects to raw data
  // updates data via repository service
  public async nastaviPrisotnost(id: Number, present: number): Promise<any> {

    let settings = this.formattingService.getSettings()
    let googleProfile = this.formattingService.getProfile()
    let datum = this.formattingService.getDate()

    this.repositoryService.getData(settings.skupina, false)
      .then(data => {

        let uporabnik = data.find(x => x.id == id)
        let udelezba = uporabnik.udelezbe.find(x => x.datum == datum)

        switch(present) {
          case 0:
            udelezba.prisotnost = settings.simboli.prisoten_symbol
            break;
          case 1:
            udelezba.prisotnost = settings.simboli.upraviceno_odsoten_symbol
            break;
          case 2:
            udelezba.prisotnost = settings.simboli.odsoten_symbol
            break;
        }

        if (
          !googleProfile.access_token ||
          googleProfile.access_token == 'undefined'
        ) {
          this.alertService.openSnackBar('Najprej se moraš prijaviti!');
          return null;
        }

        let updated_data = [];
        let header = this.repositoryService.getHeader()

        console.log(data)

        data.forEach((element) => {
          let foo = [];
          header.forEach((naslov) => {
            if (element[naslov] == undefined) {
              foo.push("")
            } else {
              foo.push(element[naslov]);
            }
          });
          updated_data.push(foo);
        });

        updated_data.unshift(header);

        return this.repositoryService.updateData(updated_data);
      })

      return null
  }


  public checkTodayDate() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let datum = `${date.getDate()}.${month}.`;
    let header = this.repositoryService.getHeader();

    // check is today date doesn't exist yet
    // make it
    let today = false;
    header.forEach((element) => {
      if (element.includes(datum)) {
        today = true;
      }
    });

    if (!today) {
      // set date for correct querying
      let novDatumIndex = 0;
      let prviDatum = false;
      header.forEach((element, index) => {
        if (this.formattingService.jeDatum(element)) {
          novDatumIndex = index + 1;
          prviDatum = true;
        } else if (!prviDatum) novDatumIndex = index + 1;
      });

      if (novDatumIndex > 0) {
        header.splice(novDatumIndex, 0, datum);
      } else {
        header.push(datum);
      }
    }

    return { today: today, header: header };
  }
}
