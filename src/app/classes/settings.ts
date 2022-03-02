export class Settings {
  povezava: String;                     // URL do Google Sheets
  shranjene_preglednice: Array<any>;    // objekti shranjenih preglednic (ime + url)
  skupina: String;                      // trenutna izbrana skupina / list ()
  id_preglednice: String;               // id Preglednice, dobljen iz URL-ja
  simboli: {
    prisoten_symbol: String;
    odsoten_symbol: String;
    upraviceno_odsoten_symbol: String;
  };
  minimal_presence: string;             // used in pregled
  low_presence: string;                 // used in pregled
}

