import { Injectable } from '@angular/core'

@Injectable()
export class Constants {
    //bootRun + ng serve
    //public static API_ENDPOINT: string = 'http://localhost:8080/api/';
    //Docker deployed in local machine
    //public static API_ENDPOINT: string = 'http://localhost:8090/api/';
    //Docker deployed in remote server
    public static API_ENDPOINT: string = 'http://gessi-dashboard.essi.upc.edu:8090/api/';
    public static COLORS: string[] = ["#33A8C7", "#52E3E1", "#A0E426", "#FDF148", "#FFAB00", 
    "#F77976", "#F050AE", "#D883FF", "#9336FD", "#FB5607"];
}