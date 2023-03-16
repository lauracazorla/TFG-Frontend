import { Component, OnInit } from '@angular/core';
import { Constants } from './config/constants'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-loganalytics'
  private data : any = []
  constructor(private http:HttpClient) {

  }

  getData() {
    const url = Constants.API_ENDPOINT + "/api/user";
    this.http.get(url).subscribe((res) => {
      this.data = res
      console.log(this.data)
    })
  }

}
