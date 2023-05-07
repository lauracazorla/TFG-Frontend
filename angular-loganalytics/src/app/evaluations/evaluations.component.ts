import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SubjectService } from '../subjects/subject.service';
import { TeamService } from '../teams/team.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Team } from '../teams/team';
import { Subject } from '../subjects/subject';
import { Metric } from '../metrics/metric';
import { MetricService } from '../metrics/metric.service';
import { EvaluationService } from './evaluation.service';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { Chart } from 'chart.js';
import { Evaluation } from './evaluation';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {

  constructor(private subjectService: SubjectService,
    private teamService: TeamService,
    private metricService: MetricService,
    private evaluationService: EvaluationService,
    private dialog: MatDialog,
    private router: Router) { 
      router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  teams: Team[] = [];
  subjects: Subject[] = [];
  evaluations: Evaluation[];
  displayableMetrics: Metric[];

  selectedSubject: string;
  selectedTeam: string;
  startDate: string;
  endDate: string;

  async ngOnInit(): Promise<void> {
    
    this.subjectService.getSubjects().subscribe((data: Subject[]) => {
      this.subjects = data; 
    });
  
    this.teamService.getTeams().subscribe((data: Team[]) => {
      this.teams = data; 
    });

    this.metricService.getDisplayableMetrics().subscribe((data: Metric[]) => {
      this.displayableMetrics = data; 
      }, (error: any) => {
      this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
    });
    
    this.evaluationService.getCurrentGlobal().subscribe((data: Evaluation[]) => {
      this.evaluations = data;
      }, (error: any) => {
      this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
    });
  }

  showErrorMessage(message: string): void {
    const dialogRef = this.dialog.open(ErrorPopupComponent, {
      width: '25%',
      data: { errorMessage: message }
    });
  }

  ngAfterViewChecked() : void {
    if (this.displayableMetrics) {
      this.displayableMetrics.forEach(metric => {
        if (!metric.controller) {
          const valueElement = document.getElementById(`value-${metric.name}`) as HTMLElement;
          this.evaluations.forEach(evaluation => {
            if (evaluation.internalMetric.name == metric.name) {
              valueElement.innerText = evaluation.value.toString();
            }
          }); 
        }
        else {
          
        }
      });
    }
  }
  
}
