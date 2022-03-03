export interface ISettings {
  preglednica: String;
  shranjene_preglednice: Array<any>;
  skupina: String;
  izbran_stolpec: String;
  povezava: String;
  simboli: {
    prisoten_symbol: String;
    odsoten_symbol: String;
    upraviceno_odsoten_symbol: String;
  },
  minimal_presence: string;
  low_presence: string;
}
