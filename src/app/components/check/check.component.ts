import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {

  constructor() { }

  udelezenci = [
    {
      ime: "Janez Novak"
    }
  ]

  ngOnInit(): void {
  }

}
