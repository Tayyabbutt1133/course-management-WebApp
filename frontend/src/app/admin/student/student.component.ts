import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit {
  students: any[] = [];
  courses: any[] = [];
  teachers: any[] = [];
  filteredTeachers: any[] = [];
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  studentForm: FormGroup;
  editStudentForm: FormGroup;
  loading = false;
  error = '';
  studentToDelete: string | null = null;
  editingStudent: any = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      courseId: ['', Validators.required],
      teacherId: ['', Validators.required]
    });

    this.editStudentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      courseId: ['', Validators.required],
      teacherId: ['', Validators.required]
    });

    // Listen for course changes
    this.studentForm.get('courseId')?.valueChanges.subscribe(courseId => {
      this.updateFilteredTeachers(courseId, 'add');
    });

    this.editStudentForm.get('courseId')?.valueChanges.subscribe(courseId => {
      this.updateFilteredTeachers(courseId, 'edit');
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
    this.loadTeachers();
  }

  updateFilteredTeachers(courseId: string, formType: 'add' | 'edit') {
    if (courseId) {
      const course = this.courses.find(c => c._id === courseId);
      this.filteredTeachers = course?.teachers || [];
      
      // Reset teacher selection
      if (formType === 'add') {
        this.studentForm.patchValue({ teacherId: '' });
      } else {
        this.editStudentForm.patchValue({ teacherId: '' });
      }
    } else {
      this.filteredTeachers = [];
    }
  }

  loadStudents() {
    this.loading = true;
    this.http
      .get('http://localhost:5000/api/admin/students', {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.students = res;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load students';
          this.loading = false;
        },
      });
  }

  loadCourses() {
    this.http
      .get('http://localhost:5000/api/admin/courses', {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.courses = res;
        },
        error: (err) => {
          this.error = 'Failed to load courses';
        },
      });
  }

  loadTeachers() {
    this.http
      .get('http://localhost:5000/api/admin/teachers', {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.teachers = res;
        },
        error: (err) => {
          this.error = 'Failed to load teachers';
        },
      });
  }

  openAddModal() {
    this.showAddModal = true;
    this.studentForm.reset();
    this.filteredTeachers = [];
    this.error = '';
  }

  closeAddModal() {
    this.showAddModal = false;
    this.error = '';
  }

  openEditModal(student: any) {
    this.editingStudent = student;
    this.showEditModal = true;

    const courseId = student.courses?.[0]?._id || '';
    if (courseId) {
      this.updateFilteredTeachers(courseId, 'edit');
    }

    this.editStudentForm.patchValue({
      name: student.name,
      email: student.email,
      courseId: courseId,
      teacherId: student.teachers?.[0]?._id || ''
    });
    this.error = '';
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingStudent = null;
    this.editStudentForm.reset();
    this.filteredTeachers = [];
    this.error = '';
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.loading = true;
      const formData = this.studentForm.value;

      this.http
        .post(
          'http://localhost:5000/api/admin/students',
          formData,
          {
            withCredentials: true,
          }
        )
        .subscribe({
          next: (res: any) => {
            if (formData.teacherId) {
              this.assignTeacherToStudent(
                res.student.id,
                formData.teacherId,
                formData.courseId
              );
            } else {
              this.loading = false;
              this.closeAddModal();
              this.loadStudents();
            }
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error.message || 'Failed to add student';
          },
        });
    }
  }

  onEditSubmit() {
    if (this.editStudentForm.valid && this.editingStudent) {
      this.loading = true;
      const formData = this.editStudentForm.value;

      this.http
        .put(
          `http://localhost:5000/api/admin/students/${this.editingStudent._id}`,
          formData,
          { withCredentials: true }
        )
        .subscribe({
          next: (res: any) => {
            if (formData.teacherId) {
              this.assignTeacherToStudent(
                this.editingStudent._id,
                formData.teacherId,
                formData.courseId
              );
            } else {
              this.loading = false;
              this.closeEditModal();
              this.loadStudents();
            }
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error.message || 'Failed to update student';
          },
        });
    }
  }

  assignTeacherToStudent(studentId: string, teacherId: string, courseId: string) {
    this.http.post(
      'http://localhost:5000/api/admin/assign-teacher',
      {
        studentId,
        teacherId,
        courseId
      },
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.loading = false;
        this.closeAddModal();
        this.closeEditModal();
        this.loadStudents();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message || 'Failed to assign teacher';
      }
    });
  }

  deleteStudent(studentId: string) {
    this.studentToDelete = studentId;
    this.showDeleteModal = true;
    this.error = '';
  }

  cancelDelete() {
    this.studentToDelete = null;
    this.showDeleteModal = false;
    this.error = '';
  }

  confirmDelete() {
    if (this.studentToDelete) {
      this.loading = true;
      this.http
        .delete(
          `http://localhost:5000/api/admin/students/${this.studentToDelete}`,
          {
            withCredentials: true,
          }
        )
        .subscribe({
          next: () => {
            this.loading = false;
            this.showDeleteModal = false;
            this.studentToDelete = null;
            this.loadStudents();
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error.message || 'Failed to delete student';
            this.showDeleteModal = false;
            this.studentToDelete = null;
          },
        });
    }
  }
}