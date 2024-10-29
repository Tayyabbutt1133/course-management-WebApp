// admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    declarations: [], // Remove TeacherComponent from here
    imports: [
        CommonModule,
        AdminRoutingModule
    ]
})
export class AdminModule { }