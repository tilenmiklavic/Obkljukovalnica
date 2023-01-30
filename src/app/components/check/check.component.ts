import { Component, OnInit, ViewEncapsulation, OnDestroy, VERSION } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Strings } from 'src/app/classes/strings';
import { CheckService } from 'src/app/services/check.service';
import { FormattingService } from 'src/app/services/formatting.service';
import { FormControl } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { RepositoryService } from 'src/app/services/repository.service';
import { AlertService } from 'src/app/services/alert.service';
import { fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';


@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckComponent implements OnInit, OnDestroy {

  constructor(
    private checkService: CheckService,
    private formattingService: FormattingService,
    private repositoryService: RepositoryService,
    private alertService: AlertService,
    private _snackBar: MatSnackBar,
  ) { }

  data = []
  loaded = false
  datum = null
  datumi = []
  today = true
  izbranDatum = new FormControl(new Date())
  izbranDatumIsValid = true
  settings = JSON.parse(localStorage.getItem('settings')) || this.formattingService.newSettings()
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;


  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    // Highlight dates with existing columns
    if (view === 'month') {
      const date = moment(cellDate)
      // const date = cellDate.getDate();
      // const month = cellDate.getMonth() + 1;
      // const datum = `${date}.${month}.`

      var className = '';
      this.datumi.forEach(el => {
        if (el.isSame(date, 'day')) {
          className = 'example-custom-date-class'
        }
      })
      return className;
    }

    return '';
  };

  // nastavljanje prisotnosti
  public present(id: Number, present: number) {
    this.checkService.nastaviPrisotnost(id, present, this.datum)
      .then((odgovor) => {
        let uporabnik = this.data.find(x => x.id == id);
        uporabnik.prisotnost[this.datum.format("D. M. YYYY")] = this.formattingService.vrniSimbol(present, this.settings)
      })
      .catch((napaka) => {
        this._snackBar.open(Strings.noInternetConnectionError, "Zapri")
      })
  }

  // izbira datuma v koledarju
  public dateChange() {
    this.datum = moment(this.izbranDatum.value)

    let currentDate = moment()

    if (this.datum.isSame(currentDate, 'day')) { this.today = true }
    else { this.today = false }

    this.izbranDatumIsValid = false;
    this.datumi.forEach(el => {
      if (el.isSame(this.datum, 'day')) {
        this.izbranDatumIsValid = true
      }
    })
  }

  // brisanje vseh vnosov za danasnji dan
  public clearInput() {
    let bar = this.data.map(el => {return {...el}})

    for (let i = 0; i < bar.length; i++) {
      bar[i][this.datum] = "";
    }

    this.checkService.pobrisiPrisotnosti(this.datum)
      .then((odgovor) => {
        if (odgovor) {
          this.data = odgovor
        }
      })
      .catch((napaka) => {
        this._snackBar.open(Strings.noInternetConnectionError, "Zapri")
      })
  }

  // dodajanje novega stolpca v tabelo
  public dodajStolpec() {
    this.checkService.dodajStolpec()
      .then(odgovor => {
        this.izbranDatumIsValid = true
        this.checkService.getUdelezenci(this.settings.skupina, true)
          .then(rezultat => {
            this.data = rezultat
            this.datumi.push(this.datum)
            this.alertService.openSnackBar("Stolpec dodan")
          })
      })
  }

  // refresh data
  public refresh() {
    this.loaded = false
    this.checkService.getUdelezenci(this.settings.skupina, true)
      .then(udelezenci => {
        this.data = udelezenci
        this.loaded = true
      })
  }

  ngOnInit(): void {
    this.datum = moment();

    // get starting set of all people
    this.checkService.getUdelezenci(this.settings.skupina, true)
      .then(udelezenci => {

        this.data = udelezenci
        this.loaded = true
        this.datumi = this.formattingService.vrniDatume(this.repositoryService.getHeader())

        this.izbranDatumIsValid = this.datumi.some(element => {
          if (element.isSame(this.datum, 'day')) {
            return true;
          }
          return false;
        })

        // dobimo kot odgovor prazno tabelo
        if (this.data.length == 0) {
          this._snackBar.open(Strings.noDataErrorNotification, "Close")
        }
      })
      .catch(napaka => {
        console.log("Napaka", napaka)
        this.loaded = true

        if (!localStorage.getItem('access_token') || localStorage.getItem('access_token') == 'undefined' || localStorage.getItem('access_token') == 'null') {
          this._snackBar.open(Strings.signUpNotification, "Zapri")
        } else if (!localStorage.getItem('idTabele') || localStorage.getItem('idTabele') == 'undefined' || localStorage.getItem('idTabele') == 'null') {
          this._snackBar.open(Strings.tableIdInputNotification, "Zapri")
        } else if (!localStorage.getItem('skupina') || localStorage.getItem('skupina') == 'undefined' || localStorage.getItem('skupina') == 'null') {
          this._snackBar.open(Strings.groupSelectNoticiation, "Zapri")
        }
      })

    this.checkNetworkStatus();
  }

  ngAfterViewInit(): void {
    // var gapi: any

    gapi.signin2.render('my-signin2-2', {
      'scope': 'profile email https://www.googleapis.com/auth/spreadsheets',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'outline',
      'onsuccess': this.onSuccess,
      'onfailure': this.onFailure
    })
  }

  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
  }

  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        this.networkStatus = status;
      });
  }

  public onSuccess(googleUser) {
    let googleProfile = {
      profile: googleUser.getBasicProfile(),
      access_token: googleUser.getAuthResponse().access_token
    }

    localStorage.setItem('googleProfile', JSON.stringify(googleProfile))
  }

  public onFailure() {
    console.log("Sign in unsuccesful")
  }
}
