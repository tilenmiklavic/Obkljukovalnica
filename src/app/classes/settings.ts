import { PotniNalog } from "./potni-nalog";

export class Settings {
  povezava: string;                     // URL do Google Sheets
  shranjene_preglednice: Array<any>;    // objekti shranjenih preglednic (ime + url)
  skupina: string;                      // trenutna izbrana skupina / list ()
  id_preglednice: string;               // id Preglednice, dobljen iz URL-ja
  simboli: {
    prisoten_symbol: string;
    odsoten_symbol: string;
    upraviceno_odsoten_symbol: string;
  };
  minimal_presence: string;             // used in pregled
  low_presence: string;                 // used in pregled
  potniNalog: {
    enabled: boolean                    // enable screen
    ime: string                         // ime voditelja
    priimek: string                     // priimek voditelja
    tarifa: number                      // tarifa po kateri se obracuna cena poti
    poti: Array<PotniNalog>             // seznam vseh shranjenih poti
  }
}

