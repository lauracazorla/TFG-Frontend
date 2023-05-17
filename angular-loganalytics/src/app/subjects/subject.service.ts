import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
import { HttpClient } from '@angular/common/http';
import { Subject } from './subject';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private baseURL = Constants.API_ENDPOINT + "subjects";

  constructor(private http:HttpClient) { }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.baseURL}`)
    .pipe(map(subjects => subjects.sort((a, b) => a.acronym.localeCompare(b.acronym))));
  }
}
