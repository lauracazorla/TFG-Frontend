import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation } from './evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private baseURL = Constants.API_ENDPOINT + "evaluations/";
  private baseURLSubject = Constants.API_ENDPOINT + "subjectEvaluations/";
  private baseURLTeam = Constants.API_ENDPOINT + "teamEvaluations/";

  constructor(private http:HttpClient) { }

  getCurrent() : Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.baseURL}` + "current");
  }
  
  getHistorical(dateBefore: string, dateAfter: string) : Observable<Evaluation[]> {
    let params = new HttpParams();
    if (dateBefore != undefined) params = params.append("dateBefore", dateBefore);
    if (dateAfter != undefined) params = params.append("dateAfter", dateAfter);
    return this.http.get<Evaluation[]>(`${this.baseURL}` + "historical", {params: params});
  }
  
  getHistoricalSpecific(metric: string, param: string, 
    dateBefore: string, dateAfter: string) : Observable<Evaluation> {
    let params = new HttpParams();
    if (dateBefore != undefined) params = params.append("dateBefore", dateBefore);
    if (dateAfter != undefined) params = params.append("dateAfter", dateAfter);
    return this.http.get<Evaluation>(`${this.baseURL}historical/${metric}/${param}`, { params: params });
  }

  getCurrentBySubject(subject: string) : Observable<Evaluation[]> {
    let params = new HttpParams();
    if (subject != undefined) params = params.append("subject", subject);
    return this.http.get<Evaluation[]>(`${this.baseURLSubject}` + "current", { params: params });
  }

  getHistoricalBySubject(subject: string, dateBefore: string, dateAfter: string) : Observable<Evaluation[]> {
    let params = new HttpParams();
    if (dateBefore != undefined) params = params.append("dateBefore", dateBefore);
    if (dateAfter != undefined) params = params.append("dateAfter", dateAfter);
    if (subject != undefined) params = params.append("subject", subject);
    return this.http.get<Evaluation[]>(`${this.baseURLSubject}` + "historical", { params: params });
  }

  getHistoricalSpecificBySubject(metric: string, param: string, 
    subject: string, dateBefore: string, dateAfter: string) : Observable<Evaluation> {
    let params = new HttpParams();
    if (subject != undefined) params = params.append("subject", subject);
    if (dateBefore != undefined) params = params.append("dateBefore", dateBefore);
    if (dateAfter != undefined) params = params.append("dateAfter", dateAfter);
    return this.http.get<Evaluation>(`${this.baseURLSubject}historical/${metric}/${param}`, { params: params });
  }

  getCurrentByTeam(team: string) : Observable<Evaluation[]> {
    let params = new HttpParams();
    if (team != undefined) params = params.append("team", team);
    return this.http.get<Evaluation[]>(`${this.baseURLTeam}` + "current", { params: params });
  }

  getHistoricalByTeam(team: string, dateBefore: string, dateAfter: string) : Observable<Evaluation[]> {
    let params = new HttpParams();
    if (dateBefore != undefined) params = params.append("dateBefore", dateBefore);
    if (dateAfter != undefined) params = params.append("dateAfter", dateAfter);
    if (team != undefined) params = params.append("team", team);
    return this.http.get<Evaluation[]>(`${this.baseURLTeam}` + "historical", { params: params });
  }

  getHistoricalSpecificByTeam(metric: string, param: string, 
    team: string, dateBefore: string, dateAfter: string) : Observable<Evaluation> {
    let params = new HttpParams();
    if (team != undefined) params = params.append("team", team);
    if (dateBefore != undefined) params = params.append("dateBefore", dateBefore);
    if (dateAfter != undefined) params = params.append("dateAfter", dateAfter);
    return this.http.get<Evaluation>(`${this.baseURLTeam}historical/${metric}/${param}`, { params: params });
  }
}
