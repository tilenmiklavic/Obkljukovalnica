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
  osebnoNapredovanje: {
    enabled: boolean,
    povezava: String
  };
  minimal_presence: string;             // used in pregled
  low_presence: string;                 // used in pregled
}

