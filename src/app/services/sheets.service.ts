import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../classes/shramba';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  constructor(@Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage, private http: HttpClient) { }
  private url = environment.url;
  private edit_url = environment.update_url;
  private sheets_url = environment.sheets_url;


  public getSkupine(): Promise<any> {
    const apiKey = environment.apiKey

    const HttpParams = {
      key: apiKey
    }

    return this.http
    .get(this.sheets_url, {params: HttpParams})
    .toPromise()
    .then(data => data as any)
    .catch(SheetsService.obdelajNapako)
  }

  public getUdelezenci(): Promise<any[]> {
    const apiKey = environment.apiKey

    // const httpLastnosti = {
    //   headers: new HttpHeaders({
    //     key: apiKey
    //   })
    // }

    const HttpParams = {
      key: apiKey
    }

    return this.http
      .get(this.url, {params: HttpParams})
      .toPromise()
      .then(udelezenci => udelezenci as any[])
      .catch(SheetsService.obdelajNapako)
  }

  public updateData(data: any) {
    const apiKey = environment.apiKey
    const access_token = localStorage.getItem('access_token')

    console.log(access_token)

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

    let new_url = this.edit_url + '?valueInputOption=RAW&key=' + apiKey

    const body = {
      "majorDimension": "DIMENSION_UNSPECIFIED",
      'range': 'List1',
      'values': data
    }

    let options = { params: HttpParams, headers: httpLastnosti}

    return this.http
      .put(new_url, body, httpLastnosti)
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(napaka => {
        console.log(napaka)
        SheetsService.obdelajNapako(napaka)
      })
  }

  // public objaviOglas(oglas: any): Promise<any[]> {
  //   const url: string = `${this.apiUrl}/oglas`;

	// 	const httpLastnosti = {
	// 		headers: new HttpHeaders({
	// 			'Authorization': `Bearer ${this.avtentikacijaService.vrniZeton()}`
	// 		})
	// 	};

	// 	return this.http
	// 		.post(url, oglas, httpLastnosti)
	// 		.toPromise()
	// 		.then(oglas => oglas as Oglas)
	// 		.catch(OglasiService.obdelajNapako);
  // }

  private static obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka);
    return Promise.reject(napaka.message || napaka);
  }
}
