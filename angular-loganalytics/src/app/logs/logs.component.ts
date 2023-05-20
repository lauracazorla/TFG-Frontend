import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Log } from './log';
import { LogService } from './log.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import * as moment from 'moment';
import { Subject } from '../subjects/subject';
import { SubjectService } from '../subjects/subject.service';
import { Team } from '../teams/team';
import { TeamService } from '../teams/team.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { Router } from '@angular/router';
import { animate } from '@angular/animations';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  
  constructor(private logService: LogService,
    private subjectService: SubjectService,
    private teamService: TeamService,
    private dialog: MatDialog,
    private router: Router) { 
      router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  logs: Log[] = [];
  teams: Team[] = [];
  subjects: Subject[] = [];

  selectedSubject: string;
  selectedTeam: string;
  startDate: string;
  endDate: string;
  keyword: string;
  maxDate: Date;

  displayColumns: string[] = ['message'];
  dataSource = new MatTableDataSource<Log>(this.logs);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  @ViewChild(MatSidenavContent) sidenavContent: MatSidenavContent;

  ngOnInit(): void {
    
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);

    this.startDate = undefined!;
    this.endDate = undefined!;
    this.selectedSubject = undefined!;
    this.selectedTeam = undefined!;
    this.keyword = undefined!;
    
    this.logService.getLogs(1, 100, undefined!, 
    undefined!, undefined!, undefined!, undefined!).subscribe((data: Log[]) => {
      this.logs = data.sort((a, b) => b.time - a.time);
      this.dataSource = new MatTableDataSource<Log>(this.logs);
      this.dataSource.paginator = this.paginator;
      }, (error: any) => {
      this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
    });

    this.subjectService.getSubjects().subscribe((data: Subject[]) => {
      this.subjects = data;
    });
    
    this.teamService.getTeams().subscribe((data: Team[]) => {
      this.teams = data;
    });

  }

  filterLogs(): void {
    if (this.startDate != undefined) this.startDate = moment(this.startDate).format("YYYY-MM-DD");
    if (this.endDate != undefined) this.endDate = moment(this.endDate).format("YYYY-MM-DD");
    
    this.logService.getLogs(1, 100, this.startDate, 
    this.endDate, this.selectedSubject, this.selectedTeam, 
    this.keyword).subscribe((data: Log[]) => {
      this.logs = data.sort((a, b) => b.time - a.time);
      this.dataSource = new MatTableDataSource<Log>(this.logs);
      this.dataSource.paginator = this.paginator; 
      }, (error: any) => {
      this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
      this.ngOnInit();
    });
  }

  showErrorMessage(message: string): void {
    const dialogRef = this.dialog.open(ErrorPopupComponent, {
      width: '25%',
      data: { errorMessage: message }
    });
  }

  scrollToTop() {
    this.sidenavContent.scrollTo({top : 0, behavior: 'smooth'});
  }

}
