import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpClientModule,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../classes/shramba';
import { AlertService } from './alert.service';
import { FormattingService } from './formatting.service';
import { Strings } from 'src/app/classes/strings';

@Injectable({
  providedIn: 'root',
})
export class SheetsService {
  constructor(
    @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage,
    private http: HttpClient,
    private formattingService: FormattingService,
    private alertService: AlertService
  ) {}
  private url = environment.url;
  private edit_url = environment.update_url;
  private sheets_url = environment.sheets_url;
  private url_skeleton = environment.urlSkeleton;
  private header = null;

  public getSkupine(): Promise<any> {
    const apiKey = environment.apiKey;

    const HttpParams = {
      key: apiKey,
    };

    let url = this.url_skeleton + localStorage.getItem('idTabele');

    return this.http
      .get(url, { params: HttpParams })
      .toPromise()
      .then((data) => data as any)
      .catch(SheetsService.obdelajNapako);
  }

  // get raw data from excel sheet
  public getUdelezenci(skupina): Promise<any[]> {
    const apiKey = environment.apiKey;

    const HttpParams = {
      key: apiKey,
    };

    let new_url =
      this.url_skeleton +
      localStorage.getItem('idTabele') +
      '/values/' +
      skupina;

    return this.http
      .get(new_url, { params: HttpParams })
      .toPromise()
      .then((udelezenci) => {
        let temp: any = udelezenci;
        return this.arrayToObject(temp.values);
      })
      .catch(SheetsService.obdelajNapako);
  }

  // update raw data to excel sheet
  public updateData(data: any) {
    const apiKey = environment.apiKey;
    const access_token = localStorage.getItem('access_token');

    const HttpParams = {
      key: apiKey,
      valueInputOption: 'RAW',
    };

    const httpLastnosti = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      }),
    };

    let new_url =
      this.url_skeleton +
      localStorage.getItem('idTabele') +
      '/values/' +
      localStorage.getItem('skupina') +
      '?valueInputOption=RAW&key=' +
      apiKey;

    const body = {
      majorDimension: 'DIMENSION_UNSPECIFIED',
      range: localStorage.getItem('skupina'),
      values: data,
    };

    let options = { params: HttpParams, headers: httpLastnosti };

    console.log(new_url, body, httpLastnosti)

    return this.http
      .put(new_url, body, httpLastnosti)
      .toPromise()
      .then((odgovor) => {
        return odgovor;
      })
      .catch((napaka) => {
        this.alertService.openSnackBar(Strings.noInternetConnectionError);
        SheetsService.obdelajNapako(napaka);
        return null;
      });
  }

  public nastaviPrisotnost(data: Array<any>): Promise<any> {
    if (
      !localStorage.getItem('access_token') ||
      localStorage.getItem('access_token') == 'undefined'
    ) {
      this.alertService.openSnackBar('Najprej se moraš prijaviti!');
      return null;
    }

    let updated_data = [];

    data.forEach((element) => {
      let foo = [];
      this.header.forEach((naslov) => {
        foo.push(element[naslov]);
      });
      updated_data.push(foo);
    });

    updated_data.unshift(this.header);

    return this.updateData(updated_data);
  }

  public changeDate(future: boolean, pending_date, datum, today): any {
    let current_index = 0;

    console.log(this.header);
    this.header.forEach((element, index) => {
      if (element.includes(datum)) {
        console.log(element, index);
        current_index = index;
      }
    });

    let new_index = current_index;

    if (future) new_index++;
    else new_index--;

    if (this.formattingService.jeDatum(this.header[new_index])) {
      if (!today) {
        return {
          today: true,
          pendingDate: datum,
          datum: this.header[new_index],
        };
      } else if (this.header[new_index] == pending_date) {
        return {
          today: false,
          pendingDate: pending_date,
          datum: this.header[new_index],
        };
      }

      return {
        today: today,
        pendingDate: pending_date,
        datum: this.header[new_index],
      };
    } else {
      if (future) {
        this.alertService.openSnackBar('Ne morem it bolj v prihodnost.');
      } else {
        this.alertService.openSnackBar('Ne morem it bolj v preteklost.');
      }
      return null;
    }
  }

  // convert raw data to object
  private arrayToObject(data: any) {
    this.header = data[0];
    data.shift();

    let udelezenci = [];

    data.forEach((element) => {

      console.log(element)
      let foo = {};
      let id_present = false
      for (let i = 0; i < this.header.length; i++) {
        if ((this.header[i] == 'id' || this.header[i] == 'Id') && !isNaN(element[i]) && element[i] != "") {id_present = true}
        if (
          this.header[i] == 'ime' ||
          this.header[i] == 'Ime' ||
          this.header[i] == 'id' ||
          this.header[i] == 'Id' ||
          this.formattingService.jeDatum(this.header[i])
        ) {
          foo[this.header[i]] = element[i];
        }
      }
      if (id_present) {
        udelezenci.push(foo);
        id_present = false
      }
    });

    console.log(udelezenci)
    return udelezenci;
  }

  public checkTodayDate(data: any) {
    let date = new Date();
    let month = date.getMonth() + 1;
    let datum = `${date.getDate()}.${month}.`;

    // check is today date doens't exist yet
    // make it
    let today = false;
    this.header.forEach((element) => {
      if (element.includes(datum)) {
        today = true;
      }
    });

    if (!today) {
      // set date for correct querying
      let novDatumIndex = 0;
      let prviDatum = false;
      this.header.forEach((element, index) => {
        if (this.formattingService.jeDatum(element)) {
          novDatumIndex = index + 1;
          prviDatum = true;
        } else if (!prviDatum) novDatumIndex = index + 1;
      });

      if (novDatumIndex > 0) {
        this.header.splice(novDatumIndex, 0, datum);
      } else {
        this.header.push(datum);
      }
    }

    return { today: today, header: this.header };
  }

  public getHeader() {
    return this.header;
  }

  private static obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka);
    return Promise.reject(napaka.message || napaka);
  }
}
