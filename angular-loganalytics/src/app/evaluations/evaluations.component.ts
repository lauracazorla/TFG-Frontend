import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Category } from '../categories/category';
import { CategoryService } from '../categories/category.service';
import { MatSidenavContent } from '@angular/material/sidenav';
import { Constants } from '../config/constants';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.css']
})
export class EvaluationsComponent implements OnInit {

  constructor(private subjectService: SubjectService,
    private teamService: TeamService,
    private categoryService: CategoryService,
    private evaluationService: EvaluationService,
    private dialog: MatDialog,
    private router: Router) { 
      router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  teams: Team[];
  subjects: Subject[];
  categories: Category[];
  evaluations: Evaluation[];

  selectedSubject: string;
  selectedTeam: string;
  startDate: string;
  endDate: string;
  
  @ViewChild(MatSidenavContent) sidenavContent: MatSidenavContent;
  
  private rendered: boolean;
  historical: boolean;
  maxDate: Date;
  colors: string[] = Constants.COLORS;

  ngOnInit(): void {
    
    this.rendered = false;
    this.historical = false;
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.colors = this.shuffleArray(this.colors);

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
    
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
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

  formatNumber(n : number) : string {
    const decimalPlaces = (n.toString().split('.')[1] || '').length;
    const formattedNum = decimalPlaces > 2 ? n.toFixed(2) : n.toFixed(decimalPlaces)
    return formattedNum;
  }

  shuffleArray(array: any[]) {
    const newArray = array.slice();
    let currentIndex = newArray.length;
    let temporaryValue;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = newArray[currentIndex];
      newArray[currentIndex] = newArray[randomIndex];
      newArray[randomIndex] = temporaryValue;
      if (currentIndex > 0 && newArray[currentIndex - 1] === newArray[currentIndex]) {
        const remainingElements = newArray.slice(0, currentIndex - 1).concat(newArray.slice(currentIndex));
        const randomRemainingIndex = Math.floor(Math.random() * remainingElements.length);
        newArray[currentIndex] = remainingElements[randomRemainingIndex];
        newArray[randomRemainingIndex] = temporaryValue;
      }
    }
    return newArray;
  }

  ngAfterViewChecked() : void {
    if (this.evaluations && !this.rendered) {
      this.rendered = true;
      this.evaluations.forEach(evaluation => {

        if (!evaluation.groupable) {
          if (!this.startDate && !this.endDate) {
            const valueElement = document.getElementById(`value-${evaluation.name}`) as HTMLElement;
            this.adjustFontSize(valueElement, this.formatNumber(evaluation.value));
            valueElement.innerText = this.formatNumber(evaluation.value);
          }
          else {
            const canvas = document.getElementById(`chart-${evaluation.name}`) as HTMLCanvasElement;
            var evalMap = new Map<string,number>(Object.entries(evaluation.entities));
            const chartLabels: string[] = Array.from( evalMap.keys() ).reverse();
            const chartData: number[] = Array.from( evalMap.values() ).reverse();
            //let chartLabels: string[] = ["2023-05-18", "2023-05-19", "2023-05-20", "2023-05-21", "2023-05-22", "2023-05-23", "2023-05-24", "2023-05-25", "2023-05-26", "2023-05-27", "2023-05-28", "2023-05-29", "2023-05-30", "2023-05-31", "2023-06-01", "2023-06-02"]
            //let chartData: number[];
            //if (evaluation.name == "30 days logins") chartData = [9, 3, 2, 2, 2, 6, 11, 0, 7, 4, 12, 6, 1, 9, 7, 1]
            //else if (evaluation.name == "7 days logins") chartData = [5, 4, 3, 8, 6, 2, 11, 12, 13, 6, 4, 8, 6, 0, 2, 7]
            //else chartData = [1, 5, 12, 9, 5, 5, 0, 1, 10, 3, 11, 6, 2, 9, 9, 8]
            canvas.width = 350;
            canvas.height = 350;
            let chartStatus = Chart.getChart(`chart-${evaluation.name}`);
            if (chartStatus != undefined) {
              chartStatus.destroy();
            }

            const chart = new Chart(canvas, {
              type: 'line',
              data: {
                labels: chartLabels,
                datasets: [
                  {
                    label: evaluation.name,
                    data: chartData,
                    backgroundColor: this.shuffleArray(this.colors)
                  }
                ]
              },
              options: {
                responsive: true,
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
                    min: 0
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                }
              }
            });

          }
        }

        else {
          const canvas = document.getElementById(`chart-${evaluation.name}`) as HTMLCanvasElement;
          var evalMap = new Map<string,number>(Object.entries(evaluation.entities));
          evalMap = this.filterEntities(evalMap);
          canvas.width = 350;
          canvas.height = 350;
          if (evalMap.size != 0) {
            const chartLabels: string[] = Array.from( evalMap.keys() );
            const chartData: number[] = Array.from( evalMap.values() );

            let chartStatus = Chart.getChart(`chart-${evaluation.name}`);
            if (chartStatus != undefined) {
              chartStatus.destroy();
            }
            
            const chart : Chart = new Chart(canvas, {
              type: 'bar',
              data: {
                labels: chartLabels,
                datasets: [
                  {
                    label: evaluation.name,
                    data: chartData,
                    backgroundColor: this.shuffleArray(this.colors)
                  }
                ]
              },
              options: {
                responsive: true,
                datasets: {
                  bar: {
                    maxBarThickness: 50
                  }
                },
                onClick: (event: any) => this.barClick(event, chart, evaluation.name),
                scales: {
                  x: {
                    ticks: {
                      display: false
                    }
                  },
                  y: {
                    min: 0
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                }
              }
            });
          }
          else {
            const ctx = canvas.getContext('2d')!;
            ctx.font = "20px Roboto";
            ctx.textAlign = "center";
            ctx.fillText("No data available", 175, 175);
          }
        }

      });
    }
  }

  barClick(event: any, chart: Chart, metric: string) {
    const activeBars = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
    if (activeBars.length > 0) {
      const index = activeBars[0].index; 
      const label = chart.data.labels![index];
      const additionalParams = {
        selectedSubject: this.selectedSubject,
        selectedTeam: this.selectedTeam,
        startDate: this.startDate,
        endDate: this.endDate
      }
      this.router.navigate(['/metrics', metric, label], { state: additionalParams });
    }
  }

  filterEntities(map : Map<string,number>): Map<string,number> {
    map.forEach((value, key)=> {
      if (value === 0) 
        map.delete(key);
    });
    const entries = Array.from(map);
    entries.sort((a, b) => b[1] - a[1]);
    entries.splice(20);
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
    else {
      if (this.selectedSubject != undefined && this.selectedTeam != undefined) {
        this.showErrorMessage(`Error 400: Cannot filter by team and subject simultaneously`);
        this.ngOnInit();
      }
      else if (this.selectedSubject != undefined) {
        if (this.startDate == undefined && this.endDate == undefined) {
          this.evaluationService.getCurrentBySubject(this.selectedSubject).subscribe((data: Evaluation[]) => {
            this.evaluations = data.sort((a, b) => a.name.localeCompare(b.name));
            this.rendered = false;
            this.historical = false;
            }, (error: any) => {
            this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
            this.ngOnInit();
          });
        }
        else {
          this.evaluationService.getHistoricalBySubject(this.selectedSubject, this.startDate, this.endDate).subscribe((data: Evaluation[]) => {
            this.evaluations = data.sort((a, b) => a.name.localeCompare(b.name));
            this.rendered = false;
            this.historical = true;
            }, (error: any) => {
            this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
            this.ngOnInit();
          });
        }
      }
      else if (this.selectedTeam != undefined) {
        if (this.startDate == undefined && this.endDate == undefined) {
          this.evaluationService.getCurrentByTeam(this.selectedTeam).subscribe((data: Evaluation[]) => {
            this.evaluations = data.sort((a, b) => a.name.localeCompare(b.name));
            this.rendered = false;
            this.historical = false;
            }, (error: any) => {
            this.showErrorMessage(`Error ${error.status}: ${error.error.message}`);
            this.ngOnInit();
          });
        }
        else {
          this.evaluationService.getHistoricalByTeam(this.selectedTeam, this.startDate, this.endDate).subscribe((data: Evaluation[]) => {
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

  adjustFontSize(valueElement: HTMLElement, number: string): void {
    const numberLength = number.toString().length;
    const maxWidth = 350;
    const maxHeight = 275;
    const maxFontSize = 100;
    valueElement.style.fontSize = '';
    const fontSize = Math.min(maxFontSize, Math.min(maxWidth / numberLength, maxHeight));
    valueElement.style.fontSize = `${fontSize}px`;
  }

  scrollToTop() {
    this.sidenavContent.scrollTo({top : 0, behavior: 'smooth'});
  }
  
}
