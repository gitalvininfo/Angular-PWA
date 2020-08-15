import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AngularPWA';
  apiData = [];
  constructor(private http: HttpClient) {

  }

  ngOnInit() : void {
    this.http.get<any>('https://api.npoint.io/5ec5cc336d3bc0aa0c86').subscribe(res => {
      this.apiData = res;
    }, err => {
      console.log(err)
    })
  }
}
