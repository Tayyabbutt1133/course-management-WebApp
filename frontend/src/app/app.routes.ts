import { Routes } from '@angular/router';
import { TeacherDashboardComponent } from './userteacher/userteacher.component';
import { StudentDashboardComponent } from './userstudent/userstudent.component';
import { TeacherComponent } from './admin/teacher/teacher.component';
import { StudentComponent } from './admin/student/student.component';

export const routes: Routes = [
    {
        path: 'admin',
        children: [
            { path: 'teachers', component: TeacherComponent },
            { path: 'students', component: StudentComponent }
        ]
    },
    {
        path: 'teacher',
        children: [
            { 
                path: 'dashboard', 
                component: TeacherDashboardComponent 
            }
        ]
    },
    {
        path: 'student',
        children: [
            { 
                path: 'dashboard', 
                component: StudentDashboardComponent 
            }
        ]
    },
    { 
        path: '', 
        redirectTo: '/login', 
        pathMatch: 'full' 
    }
];