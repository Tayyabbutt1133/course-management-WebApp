// teacher.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-teacher',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
    templateUrl: './teacher.component.html',
    styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
    teachers: any[] = [];
    courses: any[] = [];
    showAddModal = false;
    showEditModal = false;
    showDeleteModal = false;
    teacherForm: FormGroup;
    editTeacherForm: FormGroup;
    loading = false;
    error = '';
    teacherToDelete: string | null = null;
    editingTeacher: any = null;

    constructor(
        private http: HttpClient,
        private fb: FormBuilder
    ) {
        this.teacherForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            courseId: ['', Validators.required]
        });

        this.editTeacherForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            courseId: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadTeachers();
        this.loadCourses();
    }

    loadTeachers() {
        this.loading = true;
        this.http.get('http://localhost:5000/api/admin/teachers', {
            withCredentials: true
        }).subscribe({
            next: (res: any) => {
                this.teachers = res;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load teachers';
                this.loading = false;
            }
        });
    }

    loadCourses() {
        this.http.get('http://localhost:5000/api/admin/courses', {
            withCredentials: true
        }).subscribe({
            next: (res: any) => {
                this.courses = res;
            },
            error: (err) => {
                this.error = 'Failed to load courses';
            }
        });
    }

    openAddModal() {
        this.showAddModal = true;
        this.teacherForm.reset();
        this.error = '';
    }

    closeAddModal() {
        this.showAddModal = false;
        this.error = '';
    }

    openEditModal(teacher: any) {
        this.editingTeacher = teacher;
        this.showEditModal = true;
        this.editTeacherForm.patchValue({
            name: teacher.name,
            email: teacher.email,
            courseId: teacher.courses?.[0]?._id || ''
        });
        this.error = '';
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editingTeacher = null;
        this.editTeacherForm.reset();
        this.error = '';
    }

    onSubmit() {
        if (this.teacherForm.valid) {
            this.loading = true;
            this.http.post('http://localhost:5000/api/admin/teachers', this.teacherForm.value, {
                withCredentials: true
            }).subscribe({
                next: (res: any) => {
                    this.loading = false;
                    this.closeAddModal();
                    this.loadTeachers();
                },
                error: (err) => {
                    this.loading = false;
                    this.error = err.error.message || 'Failed to add teacher';
                }
            });
        }
    }

    onEditSubmit() {
        if (this.editTeacherForm.valid && this.editingTeacher) {
            this.loading = true;
            this.http.put(
                `http://localhost:5000/api/admin/teachers/${this.editingTeacher._id}`,
                this.editTeacherForm.value,
                { withCredentials: true }
            ).subscribe({
                next: (res: any) => {
                    this.loading = false;
                    this.closeEditModal();
                    this.loadTeachers();
                },
                error: (err) => {
                    this.loading = false;
                    this.error = err.error.message || 'Failed to update teacher';
                }
            });
        }
    }

    deleteTeacher(teacherId: string) {
        this.teacherToDelete = teacherId;
        this.showDeleteModal = true;
        this.error = '';
    }

    cancelDelete() {
        this.teacherToDelete = null;
        this.showDeleteModal = false;
        this.error = '';
    }

    confirmDelete() {
        if (this.teacherToDelete) {
            this.loading = true;
            this.http.delete(`http://localhost:5000/api/admin/teachers/${this.teacherToDelete}`, {
                withCredentials: true
            }).subscribe({
                next: () => {
                    this.loading = false;
                    this.showDeleteModal = false;
                    this.teacherToDelete = null;
                    this.loadTeachers();
                },
                error: (err) => {
                    this.loading = false;
                    this.error = err.error.message || 'Failed to delete teacher';
                    this.showDeleteModal = false;
                    this.teacherToDelete = null;
                }
            });
        }
    }
}
