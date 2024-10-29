// app.routes.ts
import { Routes } from '@angular/router';
import { TeacherComponent } from './admin/teacher/teacher.component';
import { StudentComponent } from './admin/student/student.component';

export const routes: Routes = [
    {
        path: 'admin',
        children: [
            { path: 'teachers', component: TeacherComponent },
        {path: 'students', component: StudentComponent}
        ]
    }
    // ... your other routes
];