import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SubjectService } from '../subjects/subject.service';
import { TeamService } from '../teams/team.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Team } from '../teams/team';
import { Subject } from '../subjects/subject';
import { EvaluationService } from './evaluation.service';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { Chart } from 'chart.js/auto';
import { Evaluation } from './evaluation';
import * as moment from 'moment';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {

  constructor(private subjectService: SubjectService,
    private teamService: TeamService,
    private evaluationService: EvaluationService,
    private dialog: MatDialog,
    private router: Router) { 
      router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  teams: Team[];
  subjects: Subject[];
  evaluations: Evaluation[];

  selectedSubject: string;
  selectedTeam: string;
  startDate: string;
  endDate: string;
  private rendered: boolean;
  historical: boolean;
  maxDate: Date;

  ngOnInit(): void {
    
    this.rendered = false;
    this.historical = false;
    this.maxDate = new Date();
    //this.maxDate.setDate(this.maxDate.getDate() - 1);

    this.evaluations = undefined!;
    this.selectedSubject = undefined!;
    this.selectedTeam = undefined!;
    this.startDate = undefined!;
    this.endDate = undefined!;

    this.subjectService.getSubjects().subscribe((data: Subject[]) => {
      this.subjects = data; 
    });
  
    this.teamService.getTeams().subscribe((data: Team[]) => {
      this.teams = data; 
    });
    
    this.evaluationService.getCurrent().subscribe((data: Evaluation[]) => {
      this.evaluations = data.sort((a, b) => a.name.localeCompare(b.name));
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
    if (this.evaluations && !this.rendered) {
      this.rendered = true;
      this.evaluations.forEach(evaluation => {

        if (!evaluation.groupable) {
          if (!this.startDate && !this.endDate) {
            const valueElement = document.getElementById(`value-${evaluation.name}`) as HTMLElement;
            valueElement.innerText = evaluation.value.toString();
          }
          else {
            const canvas = document.getElementById(`chart-${evaluation.name}`) as HTMLCanvasElement;
            var evalMap = new Map<string,number>(Object.entries(evaluation.entities));
            const chartLabels: string[] = Array.from( evalMap.keys() ).reverse();
            const chartData: number[] = Array.from( evalMap.values() ).reverse();

            canvas.width = 350;
            canvas.height = 350;

            let chartStatus = Chart.getChart(`chart-${evaluation.name}`);
            if (chartStatus != undefined) {
              chartStatus.destroy();
            }

            new Chart(canvas, {
              type: 'line',
              data: {
                labels: chartLabels,
                datasets: [
                  {
                    label: evaluation.name,
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
                      unit: 'day'
                    },
                    ticks: {
                      display: true
                    }
                  }
                }
              }
            });

          }
        }

        else {
          const canvas = document.getElementById(`chart-${evaluation.name}`) as HTMLCanvasElement;
          var evalMap = new Map<string,number>(Object.entries(evaluation.entities));
          evalMap = this.filterEntities(evalMap);
          const chartLabels: string[] = Array.from( evalMap.keys() );
          const chartData: number[] = Array.from( evalMap.values() );
          
          canvas.width = 350;
          canvas.height = 350;

          let chartStatus = Chart.getChart(`chart-${evaluation.name}`);
          if (chartStatus != undefined) {
            chartStatus.destroy();
          }
          
          new Chart(canvas, {
            type: 'bar',
            data: {
              labels: chartLabels,
              datasets: [
                {
                  label: evaluation.name,
                  data: chartData,
                  backgroundColor: ["#FFB3C6", "#FF8FAB", "#FB6F92", "#FF9EBB", "#FF7AA2"]
                }
              ]
            },
            options: {
              responsive: false,
              scales: {
                x: {
                  ticks: {
                    display: false
                  }
                },
                y: {
                  min: 0
                }
              }
            }
          });

        }

      });
    }
  }

  filterEntities(map : Map<string,number>): Map<string,number> {
    const entries = Array.from(map);
    entries.sort((a, b) => b[1] - a[1]);
    entries.splice(10);
    return new Map(entries);
  }

  filterMetrics(): void {
    if (this.startDate != undefined) this.startDate = moment(this.startDate).format("YYYY-MM-DD");
    if (this.endDate != undefined) this.endDate = moment(this.endDate).format("YYYY-MM-DD");
    
    this.evaluations = undefined!

    if (this.selectedSubject == undefined && this.selectedTeam == undefined) {
      if (this.startDate == undefined && this.endDate == undefined) {
        this.evaluationService.getCurrent().subscribe((data: Evaluation[]) => {
          this.evaluations = data.sort((a, b) => a.name.localeCompare(b.name));
          this.rendered = false;
          this.historical = false;
          }, (error: any) => {
          this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
          this.ngOnInit();
        });
      }
      else {
        this.evaluationService.getHistorical(this.startDate, this.endDate).subscribe((data: Evaluation[]) => {
          this.evaluations = data.sort((a, b) => a.name.localeCompare(b.name));
          this.rendered = false;
          this.historical = true;
          }, (error: any) => {
          this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
          this.ngOnInit();
        });
      }
    }
  }
  
}
