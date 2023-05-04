import { Component, OnInit, ViewChild } from '@angular/core';
import { Log } from './log';
import { LogService } from './log.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenav } from '@angular/material/sidenav';

interface Subject {
  acronym: string;
}

interface Team {
  id: string;
  semestes: string;
  subject: Subject;
}

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  
  constructor(private logService: LogService) { }
  
  logs: Log[] = [];
  teams: Team[] = [];
  subjects: Subject[] = [];

  selectedSubject: string;
  selectedTeam: string;
  startDate: string;
  endDate: string;
  keyword: string;

  displayColumns: string[] = ['message'];
  dataSource = new MatTableDataSource<Log>(this.logs);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  ngOnInit(): void {
    this.logService.getLogs().subscribe((data: Log[]) => {
      this.logs = data.sort((a, b) => b.time - a.time);
      this.dataSource = new MatTableDataSource<Log>(this.logs);
      this.dataSource.paginator = this.paginator;
    });
  }

  sidebarOpened(): void {
    //Pedir asignaturas
    //Pedir equipos
  }

}
