# Secure Task Management Dashboard

A full-stack, secure task management dashboard connecting a React + TypeScript frontend to a Java Spring Boot API.
Built for the Pure FS Technical Assessment.

## Technologies Used
* **Backend:** Java 17, Spring Boot 3.x, Spring Security (JWT), Spring Data JPA, PostgreSQL, Lombok, Springdoc OpenAPI.
* **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Zustand (state management), React Query (data fetching), Axios, Lucide React (icons), Date-fns (date formatting).

## Features
- Complete JWT based User Authentication setup (Register & Login)
- Task CRUD capabilities (Create, Relational Read, Update, Delete, Toggle Complete)
- Advanced UI/UX with Framer Motion Layout Animations and Glassmorphism modals
- Centralized Data Store with React Query caching logic
- Fully strict typings across boundaries

## How to Run

### 1. Database Setup
Create a PostgreSQL database called `task_manager` (or configure a different name in `backend/src/main/resources/application.properties`).
Update the `spring.datasource.password` (currently set to `1234`) according to your local Postgres engine.

### 2. Backend Installation
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```
The server will start on `http://localhost:8080`.
Swagger UI can be assessed at `http://localhost:8080/swagger-ui/index.html`.

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```
The client will start on `http://localhost:5173`.

## Third-Party Package Choices
- **React Query:** Best in class declarative network caching. Handles loading/error states out of the box.
- **Zustand:** Ultra lightweight scalable token store vs Redux which is bloated for just JWT handling.
- **Framer Motion:** Required to hit the dynamic modern high-bar visual aesthetic required for a premium app feel.
- **Tailwind CSS:** Radically accelerates custom CSS generation via utility classes.

## Limitations & "If I had more time"
- Unit tests & end-to-end testing could be expanded with Jest / Cypress.
- Adding a refresh token rotation implementation inside Spring Security and Axios interconnects.
- Implementing filtering logic (e.g. "Pending Only", "Completed Only") for the tasks array.
- Role-based granular privileges (e.g. Admin users dashboard to see analytics).

## Submission Guidelines Complete
- Required: TypeScript backend/frontend type safety verified.
- Required: Clean Code (zero warnings, fully successful build).
- Required: UI built with Tailwind/Framer.
- Allowed extra credit:
  1. Swagger Implementation (Available at `/swagger-ui/index.html`)
  2. Commented logic in Java Backend 
  3. React Zustand Store Management
  4. Advanced Glassmorphism and animations for UI/UX

When ready, simply upload/commit this repo and email the link to `vitasoft.it@gmail.com` before the deadline! Good luck!
