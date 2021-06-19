import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(ngZone: NgZone) {
    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));
  }

  onSignIn(googleUser) {
    //now it gets called
    console.log(googleUser)
  }

  ngOnInit(): void {
  }
}
