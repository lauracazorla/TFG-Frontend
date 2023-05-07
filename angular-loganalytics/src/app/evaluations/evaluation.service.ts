import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation } from './evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private baseURL = Constants.API_ENDPOINT;

  constructor(private http:HttpClient) { }

  getCurrentGlobal() : Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.baseURL}` + "evaluations/current");
  }
}
