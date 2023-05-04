import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Log } from './log';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private baseURL = Constants.API_ENDPOINT + "logs";

  constructor(private http:HttpClient) { }

  getLogs(): Observable<Log[]>{
    return this.http.get<Log[]>(`${this.baseURL}`);
  }

}
