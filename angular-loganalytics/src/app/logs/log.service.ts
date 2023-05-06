import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Constants } from '../config/constants';
import { Log } from './log';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private baseURL = Constants.API_ENDPOINT + "logs";

  constructor(private http:HttpClient) { }

  getLogs(page: number, size: number, 
    dateBefore: string, dateAfter: string, subject: string, 
    team: string, keyword: string): Observable<Log[]>{
    let params = new HttpParams();
    if (page != undefined)
      params = params.append("page", page);
    if (size != undefined)
      params = params.append("size", size);
    if (dateBefore != undefined)
      params = params.append("dateBefore", dateBefore);
    if (dateAfter != undefined)
      params = params.append("dateAfter", dateAfter);
    if (subject != undefined && subject != "undefined")
      params = params.append("subject", subject);
    if (team != undefined && team != "undefined")
      params = params.append("team", team);
    if (keyword != undefined)
      params = params.append("keyword", keyword);
    return this.http.get<Log[]>(`${this.baseURL}`, {params: params});
  }

}
