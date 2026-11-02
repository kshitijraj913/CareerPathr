# CareerPathr — PBL Presentation (8 Slides)

---

## Slide 1 — Title

**CareerPathr**
**Goal Oriented Planner**

Python Programming · PBL Project

**Group D1**

**Team Members:**
- Waghmare Kiran
- Haibate Kshithij
- Varaganti Sai Ram Yadav
- Gudikandula Sravan

**Guide:** Mr. Paindla Thirupathi

---

## Slide 2 — Problem Statement & Objectives

### THE PROBLEM

Students struggle to manage long-term career and academic goals in a structured way.

**Problems include:**
- Goals are difficult to organize
- Large goals hard to break into smaller tasks
- Deadlines are frequently missed
- Progress is hard to track over time
- Planning info scattered across notes/apps
- No unified system for career planning

### OUR OBJECTIVES

Build a terminal-based Python tool that helps students plan and track career goals.

**Objectives:**
- Create and manage career goals
- Break goals into milestones
- Create actionable tasks with deadlines
- Track task and goal completion
- Manage reminders and deadlines
- Provide progress analytics

---

## Slide 3 — Proposed System — CareerPathr

CareerPathr is a terminal-based Python application that helps students organize career goals into milestones and actionable tasks, with progress tracking and deadline management.

**Workflow:**

```
Career Goal
     ↓
Milestones
     ↓
Tasks
     ↓
Completion
     ↓
Progress
     ↓
Analytics
```

**Key Features:**
- Centralized goal planning
- Milestone-based goal breakdown
- Task creation with priorities
- Progress tracking per goal
- Deadline & reminder management
- Analytics & statistics view
- Simple terminal interaction

**Benefits:**
- No internet required
- Lightweight and fast
- Works on any OS with Python
- Structured career hierarchy
- Easy to learn and use
- Single-user local storage
- Focused on student needs

---

## Slide 4 — System Architecture & Technology

**Architecture:**

```
                 USER
                   ↓
            TERMINAL / CLI
                   ↓
          PYTHON APPLICATION
                   ↓
      ┌────────────┼────────────┐
      ↓            ↓            ↓
    GOALS        TASKS       REMINDERS
      ↓            ↓            ↓
 MILESTONES    PROGRESS     DEADLINES
      └────────────┼────────────┘
                   ↓
             DATA STORAGE
          (JSON / File-based)
```

**Technologies:**
- Python 3
- Modular Design
- OOP Concepts
- File Handling
- JSON Storage
- CLI Interface

---

## Slide 5 — Main Modules

1. **User / Profile Management** — Register, login, and manage user profile information
2. **Goal Management** — Create, edit, delete, and complete career goals
3. **Milestone Management** — Break goals into smaller trackable stages
4. **Task Management** — Create, assign, and track actionable tasks
5. **Reminders** — Auto-generate deadline and progress reminders
6. **Analytics** — View statistics, progress, and category breakdown

---

## Slide 6 — Working & Sample Terminal Flow

**Workflow:**

```
START
  ↓
Login / User Access
  ↓
Main Menu
  ↓
Create Career Goal
  ↓
Add Milestones
  ↓
Add Tasks
  ↓
Complete Tasks
  ↓
Track Progress
  ↓
View Analytics
  ↓
EXIT
```

**Sample Terminal Output:**

```
========================================
       CAREERPATHR
    GOAL ORIENTED PLANNER
========================================

  1. Goals
  2. Milestones
  3. Tasks
  4. Reminders
  5. Analytics
  6. Profile
  7. Settings
  8. Exit

Enter choice: _
```

---

## Slide 7 — Testing & Results

| Feature | Status |
|---|---|
| User Registration & Login | PASS |
| Goal CRUD Operations | PASS |
| Milestone Management | PASS |
| Task Management | PASS |
| Progress Tracking | PASS |
| Reminder Generation | PASS |
| Analytics / Statistics | PASS |
| Input Validation | PASS |
| Error Handling | PASS |
| Application Restart | PASS |

**Testing Approach:**
- CRUD testing for all modules
- Progress calculation verification
- Invalid input handling tested
- Empty data edge cases checked
- Reminder auto-generation verified
- Application restart persistence
- Error messages validated
- Boundary value testing performed

---

## Slide 8 — Conclusion & Future Scope

### CONCLUSION

CareerPathr provides a structured way to manage long-term career goals by dividing them into milestones and actionable tasks.

**Key achievements:**
- Goal → Milestone → Task hierarchy
- Progress tracking and analytics
- Deadline and reminder management
- Simple Python terminal interface
- Lightweight, no external dependencies

### FUTURE SCOPE

**Potential improvements for later versions:**
- GUI version (Tkinter / PyQt)
- Mobile application
- Cloud synchronization
- Advanced notifications
- Personalized career recommendations
- Advanced analytics and reports
- Multi-device support
