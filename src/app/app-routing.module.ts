import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from './test/test.component';
import { ListComponent } from './list/list.component';
import { AuthGuard } from './auth.guard';
import { UploadComponent } from './upload/upload.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListComponent
      },
      {
        path: 'test',
        component: TestComponent
      },
      {
        path: 'upload',
        component: UploadComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
