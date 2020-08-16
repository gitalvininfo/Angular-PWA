import { Component, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AngularPWA';
  apiData = [];
  constructor(private http: HttpClient, private update: SwUpdate, private appRef: ApplicationRef) {
    this.updateClient();
    this.checkUpdate();
  }

  ngOnInit() : void {
    this.http.get<any>('https://api.npoint.io/f67fede347e7fc80093c').subscribe(res => {
      this.apiData = res;
    }, err => {
      console.log(err)
    })
  }

  updateClient() {
    if(!this.update.isEnabled) {
      console.log('not enabled');
      return;
    }

    this.update.available.subscribe((event) => {
      console.log(`current`, event.current, `available`, event.available);
        if(confirm('update available for the app please confirm...')) {
          this.update.activateUpdate().then(() => location.reload());
        }
    })

    this.update.activated.subscribe((event) => {
      console.log(`current`, event.previous, `available`, event.current)

    })
  }

  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if(isStable) {
        const timeInterval = interval(6000)

        timeInterval.subscribe(() => {
          this.update.checkForUpdate().then(() => console.log('checked'));
          console.log('update checked.')
        })
      }
    })
  }
}
