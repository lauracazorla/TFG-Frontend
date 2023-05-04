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
  constructor(private http:HttpClient) { }
}
