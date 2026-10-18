# PROJECT 01 — TASKPILOT FULL STACK APPLICATION

I am conducting a hands-on AI-Assisted Software Engineering workshop for students.

I want you to act as a **Principal Software Architect, Senior Full Stack Engineer, UI/UX Designer, Product Owner, and AI Development Skills Engineer**.

We will develop five related projects throughout this workshop, but **this conversation must focus exclusively on Project 01: TaskPilot Full Stack**.

## 1. Project Objective

Build a professional, visually attractive, beginner-friendly Task Management SaaS application called **TaskPilot**.

This is a real, working full-stack application, not a static UI mockup.

The application must be simple enough for a live classroom demonstration while following professional software engineering standards.

We will later create two independent automation frameworks that test this application:

- Project 02: TestPilot PW — Playwright UI + API Automation with TypeScript and Codegen.
- Project 03: TestPilot BDD — Java, Selenium, Cucumber, REST Assured, Maven.
- Project 04: DataPulse — Python, Pandas, SQL, Data Engineering and Analytics.
- Project 05: DevFlow AI — Jira, Cursor, GitHub, Render and AI-Assisted Delivery.

Do not implement Projects 02–05 in this project. Design TaskPilot so they can integrate with it later.

## 2. Required Technology Stack

**Frontend**
- React + Vite + TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Table
- Lucide React
- Recharts for dashboard analytics
- Axios or a typed fetch client

**Backend**
- Python 3.11+
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic migrations
- Uvicorn
- pytest + HTTPX
- Swagger / OpenAPI

**Database**
- PostgreSQL
- SQLAlchemy ORM
- Synthetic seed data
- Database migrations

**Development & Delivery**
- Cursor AI
- GitHub
- Jira
- Render.com
- GitHub Actions
- Mermaid diagrams

## 3. UI Design Intelligence

Use these two open-source repositories as references:

1. https://github.com/hungdqdesign/ui-ux-pro-max-skill
2. https://github.com/vercel-labs/agent-skills

Create Cursor-compatible skills for UI design, frontend standards and accessibility.

Do not assume referencing a repository means it is installed. Verify the installation and use official instructions where appropriate.

Use shadcn/ui as the primary UI component system.

The UI should look like a polished, modern enterprise SaaS application with professional navigation, cards, tables, forms, typography, icons, and responsive layouts.

Avoid excessive visual complexity and unnecessary dependencies.

## 4. Application Functional Requirements

Build the following features:

**Dashboard**
- Total tasks
- Pending tasks
- In-progress tasks
- Completed tasks
- Overdue tasks
- Tasks by priority
- Recent activity

**Task Management**
- Create task
- View tasks
- Edit task
- Delete task
- Change task status
- Assign priority
- Add description
- Set due date
- Search tasks
- Filter by status and priority
- Sort tasks

**Task Fields**
- Task ID
- Title
- Description
- Priority: Low, Medium, High
- Status: Pending, In Progress, Completed
- Due Date
- Created At
- Updated At

**API**
- GET /health
- GET /api/v1/tasks
- POST /api/v1/tasks
- GET /api/v1/tasks/{id}
- PATCH /api/v1/tasks/{id}
- DELETE /api/v1/tasks/{id}
- GET /api/v1/dashboard/summary

All API endpoints must have Pydantic validation, appropriate HTTP status codes, error responses, and Swagger documentation.

## 5. Seed Data & Future Automation

Create at least 30 realistic synthetic tasks covering different statuses, priorities, and due dates.

Include:
- Deterministic seed scripts
- Idempotent seed loading
- Test-friendly identifiers
- Positive, negative and boundary cases
- API-based test data creation and cleanup
- Stable selectors such as data-testid where appropriate

The application must be suitable for later Playwright Codegen, Selenium, Cucumber and REST Assured automation.

## 6. Jira Requirements & Traceability

Prepare Jira-ready:

- One Epic
- User stories
- Acceptance criteria
- Technical tasks
- Definition of Done
- Requirements traceability matrix

Reserve two stories for a live Jira demonstration:

**Story A — Due Date Validation**
Reject past due dates for newly created tasks, with clear UI and API validation.

**Story B — Priority Filtering**
Allow users to filter tasks by High, Medium and Low priority.

These two stories should initially remain unimplemented so students can later observe the Jira → Cursor → Code → Test workflow.

## 7. Cursor Project Rules & Skills

Create a professional, minimal-but-extensible project structure.

Include:

- AGENTS.md
- .cursor/rules/
- .cursor/skills/

Generate meaningful skill files with proper SKILL.md structure, triggers, instructions, expected outputs and verification criteria.

Required skills:

1. requirements-reader
2. project-planning
3. ui-design
4. frontend-development
5. backend-development
6. database-management
7. api-contract-validation
8. test-case-generation
9. jira-story-reader
10. git-workflow
11. render-deployment
12. documentation-and-diagrams

Make skills practical and reusable rather than generic descriptions.

## 8. Architecture & Diagrams

Provide a professional full-stack architecture diagram showing:

User → React UI → FastAPI → PostgreSQL

Also show GitHub, Jira, Cursor AI, and Render deployment.

Generate Mermaid diagrams for:

- Full-stack architecture
- Frontend architecture
- Backend architecture
- Database ERD
- User task workflow
- API request lifecycle
- Jira-to-development workflow
- Deployment architecture

Provide one colorful, student-friendly architecture visual if image generation is available.

Keep all Mermaid files in docs/architecture/.

## 9. GitHub & Render Deployment

Use a single GitHub repository with:

- frontend/
- backend/
- database/
- docs/
- .cursor/
- .github/
- render.yaml

Plan deployment as:

- React frontend → Render Static Site
- FastAPI backend → Render Web Service
- PostgreSQL → Render Managed Database

Provide:
- Render configuration
- Environment variable templates
- Build and start commands
- Database migration process
- Health checks
- CORS configuration
- Deployment verification checklist

Never include credentials or secrets in source code.

Do not execute deployments or publish to external services without my approval.

## 10. Implementation Quality

Requirements:
- Clean modular architecture
- Reusable components
- Typed API contracts
- Clear validation errors
- Responsive UI
- Accessible forms and navigation
- Loading and empty states
- Error handling
- Basic security best practices
- Unit and integration tests
- GitHub CI checks
- Accurate documentation

Avoid overengineering, unnecessary authentication complexity and microservices.

## 11. Deliverables — In This Exact Order

I want you to prepare each stage separately:

**Phase 1:** Project overview, tools and technology stack.

**Phase 2:** Product requirements, user stories, acceptance criteria and Jira-ready content.

**Phase 3:** Full professional project folder structure.

**Phase 4:** Colorful architecture diagram and Mermaid flowcharts.

**Phase 5:** Cursor AGENTS.md, project rules and specialized SKILL.md files, with complete file contents.

**Phase 6:** Comprehensive Cursor development master prompt, including development checkpoints and verification.

**Phase 7:** Database schema, seed data and API contract.

**Phase 8:** GitHub integration, Render deployment and PostgreSQL setup.

**Phase 9:** Testing strategy, Definition of Done and workshop demonstration checklist.

**Important:** Do not deliver everything in one enormous response. Start with Phase 1 only. Wait for me to say "Next" before continuing.

Use clear professional English for all project deliverables, requirements, prompts, skill files and diagrams.

Explain key decisions simply enough for students to understand.

Our final goal is to build a working application with Cursor AI while demonstrating the complete professional software development lifecycle.