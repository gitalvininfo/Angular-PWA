import { Component, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { IndexedDbService } from "src/app/services/indexed-db.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AngularPWA';
  apiData = [];
  constructor(private idbService: IndexedDbService, private http: HttpClient, private update: SwUpdate, private appRef: ApplicationRef) {
    this.updateClient();
    // this.checkUpdate();
  }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/posts').subscribe(res => {
      this.apiData = res;
    }, err => {
      console.log(err)
    })
  }

  updateClient() {
    if (!this.update.isEnabled) {
      console.log('not enabled');
      return;
    }

    this.update.available.subscribe((event) => {
      console.log(`current`, event.current, `available`, event.available);
      if (confirm('update available for the app please confirm...')) {
        this.update.activateUpdate().then(() => location.reload());
      }
    })

    this.update.activated.subscribe((event) => {
      console.log(`current`, event.previous, `available`, event.current)

    })
  }

  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(20000)

        timeInterval.subscribe(() => {
          this.update.checkForUpdate().then(() => console.log('checked'));
          console.log('update checked.')
        })
      }
    })
  }


  postSync() {
    let obj = {
      name : "Alvin"
    }
    this.http.post('http://localhost:3000/posts', obj).subscribe((res) => {
      console.log(res)
      this.apiData.push(obj.name)
    }, (err) => {

      this.idbService.addUser(obj.name).then(this.backgroundSync).catch(console.log)
    })
  }

  backgroundSync() {
    navigator.serviceWorker.ready
      .then((swRegistration) => swRegistration.sync.register('post-data'))
      .catch(console.log);
  }
}
