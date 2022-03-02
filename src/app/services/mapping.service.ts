import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  constructor() { }

  // extracts id, ime and vod from raw data
  public basicInfoFromData(data, header) {
    let basicInfo = []

    data.forEach(element => {
      let temp = {}

      if (header.includes("id")) { temp["id"] = element["id"] }
      if (header.includes("ime")) { temp["ime"] = element["ime"] }
      if (header.includes("vod")) { temp["vod"] = element["vod"] }

      basicInfo.push(temp)
    });

    return basicInfo
  }
}
