import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../subjects/subject.service';
import { TeamService } from '../teams/team.service';
import { EvaluationService } from '../evaluations/evaluation.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Team } from '../teams/team';
import { Subject } from '../subjects/subject';
import { Evaluation } from '../evaluations/evaluation';

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
    private router: Router) { 
      router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  teams: Team[];
  subjects: Subject[];
  evaluation: Evaluation;
  
  maxDate: Date;
  selectedSubject: string;
  selectedTeam: string;
  startDate: string;
  endDate: string;

  ngOnInit(): void {
    
    this.maxDate = new Date();

    this.subjectService.getSubjects().subscribe((data: Subject[]) => {
      this.subjects = data; 
    });
  
    this.teamService.getTeams().subscribe((data: Team[]) => {
      this.teams = data; 
    });
  }

  filterMetrics() : void {

  }
}
