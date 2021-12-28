import { HttpClient, HttpHeaders, HttpParams, HttpClientModule } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../classes/shramba';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  constructor(@Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage, private http: HttpClient) { }
  private url_skeleton = environment.urlSkeleton;


  public getSkupine(): Promise<any> {

    const apiKey = environment.apiKey

    const HttpParams = {
      key: apiKey
    }

    let url = this.url_skeleton + localStorage.getItem('idTabele')

    console.log("url", url)

    return this.http
    .get(url, {params: HttpParams})
    .toPromise()
    .then(data => data as any)
    .catch(SheetsService.obdelajNapako)
  }

  public getUdelezenci(skupina): Promise<any[]> {

    const apiKey = environment.apiKey

    const HttpParams = {
      key: apiKey
    }

    let new_url = this.url_skeleton + localStorage.getItem('idTabele') + '/values/' + skupina


    return this.http
      .get(new_url, {params: HttpParams})
      .toPromise()
      .then(udelezenci => udelezenci as any[])
      .catch(SheetsService.obdelajNapako)
  }

  public updateData(data: any) {
    const apiKey = environment.apiKey
    const access_token = localStorage.getItem('access_token')

    const HttpParams = {
      key: apiKey,
      valueInputOption: 'RAW'
    }

    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      })
    }

    let new_url = this.url_skeleton + localStorage.getItem('idTabele') + '/values/' + localStorage.getItem('skupina') + '?valueInputOption=RAW&key=' + apiKey

    const body = {
      "majorDimension": "DIMENSION_UNSPECIFIED",
      'range': localStorage.getItem('skupina'),
      'values': data
    }

    let options = { params: HttpParams, headers: httpLastnosti}

    return this.http
      .put(new_url, body, httpLastnosti)
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(napaka => {
        console.log("Napaka", napaka)
        SheetsService.obdelajNapako(napaka)
      })
  }

  private static obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka);
    return Promise.reject(napaka.message || napaka);
  }
}
