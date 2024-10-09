# Web-Based Courses Platform

Welcome to the Web-Based Courses Platform! This application is designed to help schools manage their courses and users effectively, providing a seamless experience for students, teachers, and administrators.

## Tech Stack

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express.js**: A web application framework for Node.js to create APIs.
- **MongoDB**: A NoSQL database for storing user and course data.
- **Angular**: A front-end framework for building dynamic web applications.
- **Logger**: For logging application events and errors.
- **Jest**: A testing framework for unit testing JavaScript code.
- **Karma/Jasmine**: Tools for running unit tests and behavior-driven development.
- **SonarQube**: For analyzing code quality and detecting potential issues.
- **Git**: Version control system to track changes in the codebase.

## Key Features

### User Authentication & Authorization

- User registration and login functionality.
- Role definitions (admin, student, parent, teacher) with access restrictions.

### School Management

- Create, read, update, and delete APIs for all necessary entities.
- Assign courses to students with defined start and end dates.
- Categorize students based on their enrolled courses.
- Search and view teachers associated with specific courses.

### Application Logging

- Implement logging for important events, errors, and user activities.

### Express.js and MongoDB

- Utilize Express.js for the API layer.
- Design a MongoDB schema to manage user information, tasks, and related data.

### Exception Handling

- Global exception handling for graceful error management.
- Log exceptions using the Logger.

### Unit Testing

- Write unit tests using Jest for critical parts of the application.
- Validate controllers, services, and data access layers with Karma and Jasmine.

### SonarQube Integration

- Analyze code quality with SonarQube and identify potential issues.

### Git Version Control

- Utilize Git for version control, with branching and merging strategies.

## Components & Screens

### 1. Sign Up / Log In

- **Components**: Sign-up form, Log-in form
- **Operations**: User registration and authentication, Redirect to the main application upon successful login.

### 2. Dashboard (List of Courses)

- **Components**: List of students/teachers' courses.
- **Operations**: Fetch user-specific courses, Display courses, Navigate to course details or log out.

### 3. Edit / Add New Courses (For Admin)

- **Components**: Course information form.
- **Operations**: Create or edit a course, Save changes to the backend.

### 4. Edit / Add New User (For Admin)

- **Components**: User information form.
- **Operations**: Create or edit a user, Save changes to the backend.

### 5. User Profile (Optional)

- **Components**: User details, Logout button.
- **Operations**: Display user information, Logout functionality.
