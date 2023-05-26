import { Injectable } from '@angular/core'

@Injectable()
export class Constants {
    public static API_ENDPOINT: string = 'http://localhost:8080/api/';
    public static COLORS: string[] = ["#33A8C7", "#52E3E1", "#A0E426", "#FDF148", "#FFAB00", 
    "#F77976", "#F050AE", "#D883FF", "#9336FD", "#FB5607"];
}