import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Metric } from './metric';

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  private baseURL = Constants.API_ENDPOINT + "internalMetrics";

  constructor(private http:HttpClient) { }

  getMetrics() : Observable<Metric[]> {
    return this.http.get<Metric[]>(`${this.baseURL}`);
  }

  getDisplayableMetrics() : Observable<Metric[]> {
    return this.http.get<Metric[]>(`${this.baseURL}`)
    .pipe(
      map(metrics => {
        const undefinedControllerMetrics = metrics.filter(metric => typeof metric.controller === undefined);
        const definedControllerMetrics = metrics.filter(metric => typeof metric.controller !== undefined);
        const uniqueDefinedControllerMetrics = definedControllerMetrics.reduce((acc: Metric[], metric) => {
          if (!acc.find(m => m.controller === metric.controller)) {
            acc.push(metric);
          }
          return acc;
        }, []);
        return undefinedControllerMetrics.concat(uniqueDefinedControllerMetrics);
      })
    );
  }
}
