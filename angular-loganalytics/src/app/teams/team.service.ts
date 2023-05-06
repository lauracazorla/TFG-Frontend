import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from './team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private baseURL = Constants.API_ENDPOINT + "teams";

  constructor(private http:HttpClient) { }

  getTeams() : Observable<Team[]> {
    return this.http.get<Team[]>(`${this.baseURL}`);
  }
}
