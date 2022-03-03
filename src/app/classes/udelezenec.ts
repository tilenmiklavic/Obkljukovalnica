import { Udelezba } from "./udelezba";

export class Udelezenec {
  public id: Number;
  public ime: String;
  public vod: String;
  public udelezbe: Array<Udelezba>;
  public prisotnost: Object;
}
