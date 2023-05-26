import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { EvaluationsComponent } from './evaluations/evaluations.component';
import { DetailedEvaluationsComponent } from './detailed-evaluations/detailed-evaluations.component';

const routes: Routes = [
  {path: '', redirectTo: 'metrics', pathMatch: 'full'},
  {path: 'logs', component: LogsComponent},
  {path: 'metrics', component: EvaluationsComponent},
  {path: 'metrics/:metric/:param', component: DetailedEvaluationsComponent}
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
