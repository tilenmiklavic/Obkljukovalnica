import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../classes/shramba';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  constructor(@Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage, private http: HttpClient) { }
  private url = environment.url;

  public getUdelezenci(): Promise<any[]> {
    const apiKey = environment.apiKey

    // const httpLastnosti = {
    //   headers: new HttpHeaders({
    //     'key': apiKey
    //   })
    // }

    const new_url = this.url + '?key=' + apiKey

    return this.http
      .get(new_url)
      .toPromise()
      .then(udelezenci => udelezenci as any[])
      .catch(SheetsService.obdelajNapako)
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
