export class PotniNalog {
  ime: string
  priimek: string
  naslov: string
  vloga: string
  datumOdhoda: Date
  datumPrihoda: Date
  relacija: string
  tarifa: number
  dolzina: number

  constructor(ime, priimek, naslov, vloga, datumOdhoda, datumPrihoda, relacija, tarifa, dolzina) {
    this.ime = ime
    this.priimek = priimek
    this.naslov = naslov
    this.vloga = vloga
    this.datumOdhoda = datumOdhoda
    this.datumPrihoda = datumPrihoda
    this.relacija = relacija
    this.tarifa = tarifa
    this.dolzina = dolzina
  }
}
