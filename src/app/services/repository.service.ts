import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Settings } from '../classes/settings';
import { Strings } from '../classes/strings';
import { Udelezba } from '../classes/udelezba';
import { Udelezenec } from '../classes/udelezenec';
import { AlertService } from './alert.service';
import { FormattingService } from './formatting.service';


@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private formattingService: FormattingService
  ) { }
  private url_skeleton = environment.urlSkeleton;
  private data: Array<Udelezenec>;
  private header: Array<any>;


  // gets raw data
  public async getData(skupina: String = this.formattingService.getSettings().skupina, force: Boolean = false): Promise<Udelezenec[]> {

    // first return array in memory
    if (!force && this.data != undefined && this.data.length > 0) { return this.data }

    const apiKey = environment.apiKey;
    const settings: Settings = this.formattingService.getSettings() || this.formattingService.newSettings()

    if (settings == null || settings.id_preglednice == null) {
      throw 'Table URL not provided';
    }

    const HttpParams = {
      key: apiKey,
    };

    let new_url =
      this.url_skeleton +
      settings.id_preglednice +
      '/values/' +
      skupina;

    try {
      const udelezenci = await this.http
        .get(new_url, { params: HttpParams })
        .toPromise();
      let temp: any = udelezenci;
      return this.dataToObject(temp.values);
    } catch (napaka) {
      throw 'Reading from table error'
    }
  }


  // updates raw data
  public async updateData(data: any) {
    const googleProfile = this.formattingService.getProfile();
    const settings: Settings = this.formattingService.getSettings();
    const apiKey = environment.apiKey;

    const httpLastnosti = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${googleProfile.access_token}`,
        'Content-Type': 'application/json',
      }),
    };

    let new_url =
      this.url_skeleton +
      settings.id_preglednice +
      '/values/' +
      settings.skupina +
      '?valueInputOption=RAW&key=' +
      apiKey;

    const body = {
      majorDimension: 'DIMENSION_UNSPECIFIED',
      range: settings.skupina,
      values: data,
    };

    try {
      const odgovor = await this.http
        .put(new_url, body, httpLastnosti)
        .toPromise();
      return odgovor;
    } catch (napaka) {
      this.alertService.openSnackBar(Strings.noInternetConnectionError);
      RepositoryService.obdelajNapako(napaka);
      return null;
    }
  }


  public async updateSingleCell(cell: string, value: string) {
    const googleProfile = this.formattingService.getProfile();
    const settings: Settings = this.formattingService.getSettings();
    const apiKey = environment.apiKey;
    const range = `${settings.skupina}!${cell}`

    const httpLastnosti = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${googleProfile.access_token}`,
        'Content-Type': 'application/json',
      }),
    };

    let new_url =
      this.url_skeleton +
      settings.id_preglednice +
      '/values/' +
      range +
      '?valueInputOption=RAW&key=' +
      apiKey;

    const body = {
      majorDimension: 'DIMENSION_UNSPECIFIED',
      range: range,
      values: [[value]],
    };

    try {
      const odgovor = await this.http
        .put(new_url, body, httpLastnosti)
        .toPromise();
      return odgovor;
    } catch (napaka) {
      this.alertService.openSnackBar(Strings.noInternetConnectionError);
      throw "Writing to table error"
      // RepositoryService.obdelajNapako(napaka);
      // return null;
    }
  }


  // gets excel groups from excel table provided with idTabele
  public async getSheetInfo(idTabele) {
    const apiKey = environment.apiKey;

    const HttpParams = {
      key: apiKey,
    };

    let url = this.url_skeleton + idTabele;

    try {
      const data = await this.http
        .get(url, { params: HttpParams })
        .toPromise();
      return data as any;
    } catch (napaka) {
      return RepositoryService.obdelajNapako(napaka);
    }
  }


  // gets vodi
  public getVodi() {
    let keyword

    if (this.header.includes("Vod")) { keyword = "Vod" }
    else if (this.header.includes("vod")) { keyword = "vod" }
    else { return null }

    let vodi = []

    this.data.forEach(element => {

      vodi.push(element[`${keyword}`])
    });

    return [...new Set(vodi)]
  }


  // returns local header
  public getHeader(): Array<any> {
    if (this.header != undefined && this.header.length > 0) { return this.header }
    else { return null }
  }


  // puts raw data into an array of objects
  public dataToObject(rawData:any): Array<Udelezenec> {
    this.header = rawData[0].map(element => {return element.toLowerCase()});
    rawData.shift();

    let udelezenci = [];

    rawData.forEach((element) => {
      let udelezenec = new Udelezenec;
      udelezenec.udelezbe = []

      // we use this to see when to stop counting people
      let id_present = false

      for (let i = 0; i < this.header.length; i++) {
        if ((this.header[i] == 'id' || this.header[i] == 'Id') && !isNaN(element[i]) && element[i] != "") {id_present = true}

        if (this.header[i] == 'ime' ||
          this.header[i] == 'Ime')
        {
          udelezenec.ime = element[i]
        } else if (
          this.header[i] == 'id' ||
          this.header[i] == 'Id')
        {
          udelezenec.id = element[i]
        } else if (
          this.header[i] == 'Vod' ||
          this.header[i] == 'vod')
        {
          udelezenec.vod = element[i]
        } else if (this.formattingService.jeDatum(this.header[i])) {
          let udelezba = new Udelezba
          udelezba.datum = this.header[i]
          udelezba.prisotnost = element[i]

          udelezenec.udelezbe.push(udelezba)
        }
      }
      if (id_present) {

        // easier angular FE display
        udelezenec.prisotnost = new Object
        udelezenec.udelezbe.forEach(udelezba => {
          udelezenec.prisotnost[udelezba.datum] = udelezba.prisotnost
        })

        udelezenci.push(udelezenec);
        id_present = false
      }
    });
    this.data = udelezenci
    return udelezenci;
  }


  // prints error in human pretty way i guess
  private static obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka);
    return Promise.reject(napaka.message || napaka);
  }
}
