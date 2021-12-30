import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormattingService } from './formatting.service';

@Injectable({
  providedIn: 'root'
})
export class OsebnoNapredovanjeService {

  constructor(
    private http: HttpClient,
    private formattingService: FormattingService
  ) { }
  private header = []


  private url_skeleton = environment.urlSkeleton;

  public getMetadata(): Promise<any> {
    const apiKey = environment.apiKey

    const HttpParams = {
      key: apiKey
    }

    let idTabele = localStorage.getItem('ONPreglednicaUrl').split('/')[5]
    let url = this.url_skeleton + idTabele

    return this.http
    .get(url, {params: HttpParams})
    .toPromise()
    .then(data => data as any)
    .catch(OsebnoNapredovanjeService.obdelajNapako)
  }

  public getAll(): Promise<any[]> {

    const apiKey: string = environment.apiKey
    let UrlTabele: string = localStorage.getItem('ONPreglednicaUrl')
    let idTabele: string = UrlTabele.split('/')[5]
    let preglednice: Array<any> = JSON.parse(localStorage.getItem('ONShranjenePreglednice'))
    let skupina: string = null

    preglednice.forEach(element => {
      if (element.povezava === UrlTabele) {
        return skupina = element.skupina
      }
    });

    const HttpParams = {
      key: apiKey
    }

    let new_url = this.url_skeleton + idTabele + '/values/' + skupina


    return this.http
      .get(new_url, {params: HttpParams})
      .toPromise()
      .then(udelezenci => {
        this.header = udelezenci["values"][0]
        console.log(this.header)
        return this.formattingService.arrayToObject(udelezenci)
      })
      .catch(OsebnoNapredovanjeService.obdelajNapako)
  }

  public opravilIzziv(udelezenec: any, izziv: any, ONPodatki: any): Promise<any> {

    ONPodatki.forEach(element => {
      if (element.ime == udelezenec.ime) {
        element.naloge.forEach(naloga => {
          if (naloga.imeNaloge == izziv.imeNaloge) {
            return naloga = izziv
          }
        });
      }
    });

    let tabela = [this.header]

    ONPodatki.forEach(element => {
      let foo = []
      foo.push(element.id)
      foo.push(element.ime)
      foo.push(element.stopnja)

      element.naloge.forEach(naloga => {
        if (naloga.opravil) foo.push('x')
        else foo.push('')
      });

      tabela.push(foo)
    });

    return this.update(tabela)
  }

  public update(data: any) {
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

    let new_url = this.url_skeleton + localStorage.getItem('idTabeleON') + '/values/' + localStorage.getItem('skupinaON') + '?valueInputOption=RAW&key=' + apiKey

    const body = {
      "majorDimension": "DIMENSION_UNSPECIFIED",
      'range': localStorage.getItem('skupinaON'),
      'values': data
    }

    let options = { params: HttpParams, headers: httpLastnosti}

    return this.http
      .put(new_url, body, httpLastnosti)
      .toPromise()
      .then(odgovor => odgovor as any)
      .catch(napaka => {
        console.log("Napaka", napaka)
        OsebnoNapredovanjeService.obdelajNapako(napaka)
      })
  }

  private static obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka);
    return Promise.reject(napaka.message || napaka);
  }
}
