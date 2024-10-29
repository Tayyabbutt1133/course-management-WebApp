// admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherComponent } from './teacher/teacher.component';
import { StudentComponent } from './student/student.component';

const routes: Routes = [
    { 
        path: '', // empty path since we already have 'admin' in app.routes
        children: [
            { path: 'teachers', component: TeacherComponent },
            { path: '', redirectTo: 'teachers', pathMatch: 'full' }, // optional: redirect empty admin path to teachers
            {path: 'students', component: StudentComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }