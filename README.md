# StudyFlow

A productivity tracker built to help students (me) lock into deep work sessions, ditch cramming, and keep a clean, persistent log of actual study hours.

Instead of juggling random timer websites and losing track of progress, StudyFlow ties your focus intervals directly to a backend service that records every completed session, pause, and abandonment into a relational database.

---

## Preview



---

## What It Actually Does

* **Custom Focus Presets**: Switch between standard setups like Pomodoro (25/5), longer blocks like Deep Work (50/10), or custom sprint configurations.
* **Stateful Sessions**: Sessions aren't just local timer ticks; they follow a lifecycle (`IN_PROGRESS` -> `COMPLETED` or `CANCELLED`) with server-calculated durations to avoid clock manipulation.
* **Daily Breakdown & Historical Log**: Real-time aggregation of today's focus minutes and completions, paired with an instant search filter over past sessions.
* **Centralized Error Feedback**: Custom business exceptions return standardized JSON payloads instead of blank UI crashes.

---

## Architecture & Tech Stack

The app uses a decoupled client-server architecture designed around separation of concerns and clear data flow:

```
[ React + TypeScript Client ]
        |
        |  REST API (JSON over HTTP)
        v
[ Spring Boot 3 Controller Layer ]
        |
        |  DTO Validation
        v
[ Service Layer & Transaction Boundaries ]
        |
        |  Spring Data JPA / Hibernate
        v
[ PostgreSQL 16 (Docker Container) ]
```

### Backend
* **Runtime & Framework**: Java 21, Spring Boot 3.3.4
* **Persistence**: Spring Data JPA, Hibernate ORM, PostgreSQL
* **Testing**: JUnit 5, Mockito, Spring WebMvcTest
* **Build Tool**: Maven

### Frontend
* **Client Core**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS
* **Icons & Notifications**: Lucide React, Sonner

### Infrastructure
* **Database Containerization**: Docker (`postgres:16-alpine`)

---

## Engineering Decisions Worth Mentioning

1. **Calculated Durations on the Server**: Timers in browser tabs get throttled in background tabs. To ensure accurate stats, the backend computes session length dynamically on the `complete` mutation using actual timestamps.
2. **Defensive Testing**: The service and controller layers carry automated unit tests validating edge cases (such as sub-minute sessions defaulting to a 1-minute minimum, non-existent entity IDs triggering 404 responses, and transaction boundaries).

---

## Local Setup

### 1. Database
Make sure Docker Desktop is running, then spin up the PostgreSQL container:

```bash
docker run --name studyflow-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=studyflow \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 2. Backend Service
From the backend directory:

```bash
cd untitled
./mvnw spring-boot:run
```
The REST API will be available at `http://localhost:8080`.

### 3. Frontend Client
From the frontend directory:

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---