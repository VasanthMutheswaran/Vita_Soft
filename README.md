# Task Manager Dashboard

Hey! Thanks for checking out my submission for the Full-Stack Integration Task. I've built a secure task management dashboard connecting a React frontend to a Spring Boot backend.

## Tech Stack
* **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA, PostgreSQL, Lombok, and Swagger for API docs.
* **Frontend:** React, TypeScript, Vite, Tailwind v4, Framer Motion for animations, Zustand for state, React Query for data fetching, and Axios.

## Core Features
- Full JWT Authentication flow (Register and Login).
- CRUD operations for tasks (Create, Read, Update, Delete, and Complete toggles).
- Smooth UI transitions using Framer Motion.
- JWT tokens are stored securely and managed via Zustand.
- Strict TypeScript configurations across both the client and server.

## Getting Started

### 1. Database Setup
First, make sure you have PostgreSQL running. Create a new database called `task_manager`. 
You might need to update the passwords in `backend/src/main/resources/application.properties` to match your local setup (I currently left the password as `1234` for testing).

### 2. Running the Backend
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```
The API will spin up on `http://localhost:8080`. 
You can view all the Swagger docs at `http://localhost:8080/swagger-ui/index.html`.

### 3. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

## Package Decisions
- **React Query:** Honestly, it just makes handling loading states and caching data so much easier than doing it manually with useEffects.
- **Zustand:** I went with Zustand over Redux because Redux felt like overkill just to hold a JWT token and user state.
- **Framer Motion:** Added this to give the UI a more premium, modern feel.
- **Tailwind CSS:** Speeds up styling significantly while keeping the bundle clean.

## Future Improvements (If I had more time)
- **Testing:** I would definitely add some unit and integration tests using Jest and Cypress.
- **Token Refresh:** Right now, the JWT expires after a day. A proper refresh token flow would be better for production.
- **Filtering:** Adding a way to filter tasks by "Pending" or "Completed" would be a nice touch.
- **Pagination:** If the task list gets massive, pagination or infinite scroll would be needed.
