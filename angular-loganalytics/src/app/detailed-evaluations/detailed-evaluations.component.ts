import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../subjects/subject.service';
import { TeamService } from '../teams/team.service';
import { EvaluationService } from '../evaluations/evaluation.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from '../teams/team';
import { Subject } from '../subjects/subject';
import { Evaluation } from '../evaluations/evaluation';
import * as moment from 'moment';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-detailed-evaluations',
  templateUrl: './detailed-evaluations.component.html',
  styleUrls: ['./detailed-evaluations.component.css']
})
export class DetailedEvaluationsComponent implements OnInit {

  constructor(private subjectService: SubjectService,
    private teamService: TeamService,
    private evaluationService: EvaluationService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) { 
      router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  teams: Team[];
  subjects: Subject[];
  evaluation: Evaluation;
  
  maxDate: Date;
  private rendered: boolean;
  finished: boolean;

  selectedSubject: string;
  selectedTeam: string;
  startDate: string;
  endDate: string;

  metric: string;
  param: string;

  ngOnInit(): void {
    
    this.maxDate = new Date();
    this.rendered = false;
    this.finished = false;

    const additionalParams = history.state;
    this.selectedSubject = additionalParams.selectedSubject;
    this.selectedTeam = additionalParams.selectedTeam;
    this.startDate = additionalParams.startDate;
    this.endDate = additionalParams.endDate;

    this.route.paramMap.subscribe(params => {
      this.metric = params.get('metric')!;
      this.param = params.get('param')!;
    });

    if (this.startDate == undefined) {
      const aWeekAgo = new Date();
      aWeekAgo.setDate(aWeekAgo.getDate() - 7);
      this.startDate = moment(aWeekAgo).format("YYYY-MM-DD");
    }
    if (this.endDate == undefined) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      this.endDate = moment(yesterday).format("YYYY-MM-DD");
    }

    this.subjectService.getSubjects().subscribe((data: Subject[]) => {
      this.subjects = data; 
    });
  
    this.teamService.getTeams().subscribe((data: Team[]) => {
      this.teams = data; 
    });

    this.filterMetrics();
  }

  showErrorMessage(message: string): void {
    const dialogRef = this.dialog.open(ErrorPopupComponent, {
      width: '25%',
      data: { errorMessage: message }
    });
  }

  filterMetrics() : void {
    this.evaluation = undefined!;
    this.rendered = false;
    this.finished = false;
    if (this.startDate != undefined) this.startDate = moment(this.startDate).format("YYYY-MM-DD");
    if (this.endDate != undefined) this.endDate = moment(this.endDate).format("YYYY-MM-DD");
    
    if (this.selectedSubject == undefined && this.selectedTeam == undefined) {
      this.evaluationService.getHistoricalSpecific(this.metric, this.param, 
        this.startDate, this.endDate).subscribe((data: Evaluation) => {
        this.evaluation = data;
        this.finished = true;
      }, (error: any) => {
        this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
        this.ngOnInit();
      });
    }
    else {
      if (this.selectedSubject != undefined && this.selectedTeam != undefined) {
        this.showErrorMessage(`Error 400: Cannot filter by team and subject simultaneously`);
        this.removeFilters();
      }
      else if (this.selectedSubject != undefined) {
        this.evaluationService.getHistoricalSpecificBySubject(this.metric, this.param, 
          this.selectedSubject, this.startDate, this.endDate).subscribe((data: Evaluation) => {
            this.evaluation = data;
            this.finished = true;
          }, (error: any) => {
            this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
            this.removeFilters();
          });
      }
      else if (this.selectedTeam != undefined) {
        this.evaluationService.getHistoricalSpecificByTeam(this.metric, this.param, 
          this.selectedTeam, this.startDate, this.endDate).subscribe((data: Evaluation) => {
            this.evaluation = data;
            this.finished = true;
          }, (error: any) => {
            this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
            this.removeFilters();
          });
      }
    }
  }

  cleanParams() : void {
    this.selectedSubject = undefined!;
    this.selectedTeam = undefined!;
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    this.startDate = moment(aWeekAgo).format("YYYY-MM-DD");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.endDate = moment(yesterday).format("YYYY-MM-DD");
  }

  removeFilters() : void {
    this.rendered = false;
    this.cleanParams();
    this.filterMetrics();
  }

  ngAfterViewChecked() : void {
    if (this.evaluation && !this.rendered) {
      this.rendered = true;
      const canvas = document.getElementById(`chart`) as HTMLCanvasElement;
      var evalMap = new Map<string,number>(Object.entries(this.evaluation.entities));
      const chartLabels: string[] = Array.from( evalMap.keys() ).reverse();
      const chartData: number[] = Array.from( evalMap.values() ).reverse();

      canvas.width = 350;
      canvas.height = 350;

      let chartStatus = Chart.getChart(`chart`);
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }

      const chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: this.param,
              data: chartData,
              backgroundColor: ["#FFB3C6", "#FF8FAB", "#FB6F92", "#FF9EBB", "#FF7AA2"]
            }
          ]
        },
        options: {
          responsive: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: 'day',
                tooltipFormat: 'll'
              },
              ticks: {
                display: true
              }
            },
            y: {
              min: 0,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    }
  }
}
