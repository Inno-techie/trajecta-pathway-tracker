# Trajecta: Your Career Path

Build a complete, polished, production-quality web application called:

TRAJECTA

Tagline:

"Track your journey. Shape your future."

TRAJECTA is a personal placement-preparation and career-tracking platform for students.

IMPORTANT:

This is NOT a quiz platform and users are NOT submitting aptitude/coding answers inside the application.

TRAJECTA is primarily a TRACKER.

The user records:

1. Jobs/internships they applied for

2. Daily aptitude practice

3. Daily coding practice

4. Technical/interview preparation

5. Overall preparation progress

The application should save the user's activity and show meaningful progress over time.

==================================================

1. DESIGN / BRANDING

==================================================

The website must look elegant, minimal, classy, modern and professional.

It should NOT look like:

- A basic college project

- A generic Bootstrap template

- A colorful children's dashboard

- An AI-generated template with excessive gradients

- A crowded productivity app

Design inspiration:

Premium modern SaaS / career platform.

Brand:

TRAJECTA

Tagline:

Track your journey. Shape your future.

Visual style:

- Elegant

- Minimal

- Premium

- Professional

- Calm

- Lots of whitespace

- Strong typography

- Subtle animations

- Clean cards

- Soft shadows

- Restrained use of color

Suggested palette:

- Deep charcoal/navy for primary text

- Muted teal as the main accent

- Warm off-white/light gray background

- White cards

- Very subtle borders

- Avoid excessive bright colors

Typography:

Use a modern professional font such as Inter, Manrope, DM Sans, or similar.

TRAJECTA should have a small elegant symbol/logo mark beside the word TRAJECTA.

Do not use an oversized complicated logo.

==================================================

2. LANDING PAGE

==================================================

When a visitor opens the website, show a beautiful landing page.

Hero section:

TRAJECTA

"Track your journey. Shape your future."

Supporting text:

"One place to track your applications, build consistent preparation habits, and see how far you've come."

Primary button:

"Get Started"

Secondary button:

"Sign In"

The landing page should clearly explain the purpose of TRAJECTA.

Include elegant feature cards/sections:

Career Tracking

"Never lose track of a job or internship application again."

Daily Preparation

"Build a consistent preparation routine and record your progress every day."

Coding Progress

"Track coding practice and problem-solving progress over time."

Progress Insights

"See your preparation journey through simple, meaningful statistics."

The landing page must be responsive.

Do not show the dashboard to unauthenticated visitors.

==================================================

3. AUTHENTICATION

==================================================

Implement complete authentication.

Pages:

/register

/login

/dashboard

Registration fields:

- Full Name

- Email

- Password

- Confirm Password

Login fields:

- Email

- Password

Requirements:

- Secure password hashing

- Email uniqueness

- Password validation

- Proper error messages

- Session management

- Logout

- Protected dashboard

Unauthenticated users trying to access /dashboard must be redirected to /login.

Authenticated users should be redirected to /dashboard after login.

After logout, redirect to the landing page.

Do not allow a user to see another user's private data.

==================================================

4. NAVIGATION

==================================================

Create a clean navigation bar.

Left:

TRAJECTA + small logo symbol

Navigation:

Dashboard

Applications

Preparation

Progress

Right:

User name/avatar

Profile

Logout

On mobile:

Use a clean responsive menu.

The navigation should be consistent across all authenticated pages.

==================================================

5. DASHBOARD

==================================================

The dashboard is the main page after login.

Greeting:

"Good morning/afternoon/evening, [Name]"

Below it:

"Keep moving forward. Every small step counts."

Automatically show today's date.

Top statistics cards:

Applications

Number of total job/internship applications

Aptitude

Number of days practiced

Coding

Number of problems solved

Overall Progress

Calculated preparation progress percentage

Do NOT use fake hard-coded statistics.

All statistics must come from the user's stored data.

==================================================

6. JOB / INTERNSHIP APPLICATION TRACKER

==================================================

This is one of the most important features.

The user may apply for jobs/internships on:

- LinkedIn

- Naukri

- Company websites

- Indeed

- Internshala

- Other platforms

The user can record each application.

There must be a prominent:

"+ Add Application"

button.

Clicking it opens an elegant modal/popup.

Fields:

Company

Role / Position

Platform

Application Date

Status

DO NOT include a Notes field.

Application Date should default to today's date but remain editable.

Status options:

Applied

Assessment

Interview

Selected

Rejected

Withdrawn

After saving, show the application in a clean table/list.

Columns:

Company

Role

Platform

Date

Status

Actions

Actions:

Edit

Delete

Sort newest applications first.

Allow filtering by status.

Allow searching by company or role.

The date must be stored permanently in the database.

The application must belong to the currently logged-in user.

Users must never see another user's applications.

Dashboard should show a small recent applications section with a:

"View all →"

link.

==================================================

7. DAILY PREPARATION TRACKER

==================================================

IMPORTANT:

This is NOT a quiz.

There is NO answer submission.

The purpose is simply to record whether the user practiced something today.

Create a "Today's Preparation" section.

Categories:

Aptitude

Coding

Technical

Interview Preparation

Each category should have a checkbox or elegant "Mark as practiced" control.

Example:

Today's Preparation

□ Aptitude

Practice aptitude today

□ Coding

Practice coding today

□ Technical

Revise technical concepts today

□ Interview

Practice interview preparation today

When the user marks one as practiced:

- Save it in the database

- Record today's date

- Change it to a completed state

- Show the completion visually

- Prevent duplicate records for the same category/date

Example:

✓ Aptitude

Practiced today

Also show:

Today's progress: 2 / 4

and a progress bar.

Do NOT use a "Submit Answer" button.

The action should be "Mark as practiced" or simply a checkbox.

==================================================

8. APTITUDE TRACKER

==================================================

Create a dedicated Preparation / Aptitude page.

Categories:

Quantitative Aptitude

Logical Reasoning

Verbal Ability

Data Interpretation

Probability

Permutations & Combinations

Percentages

Profit & Loss

Time & Work

Time, Speed & Distance

Number Systems

Averages

Ratios & Proportions

Each topic should have a simple tracking mechanism.

Example:

Arrays-style format is NOT required here.

Instead:

Quantitative Aptitude

□ Practiced today

Logical Reasoning

□ Practiced today

The system must store daily practice history.

For each category/topic show:

Last practiced:

Aug 15

Current streak:

X days

Total practice days:

X

Do not require the user to submit answers.

==================================================

9. CODING TRACKER

==================================================

Create a dedicated Coding page.

Coding topics:

Arrays

Strings

Linked Lists

Stacks

Queues

Trees

Graphs

Recursion

Sorting

Searching

Dynamic Programming

Greedy

Hashing

Two Pointers

Sliding Window

For each topic allow the user to track:

Problems Solved

Easy

Medium

Hard

Last Practiced

Example:

Arrays

Problems Solved: 17

Easy: 10

Medium: 6

Hard: 1

Last practiced: Aug 15

Allow the user to update these values.

Problems solved should be calculated:

Easy + Medium + Hard

Example:

10 + 6 + 1 = 17

Do not require uploading or submitting coding solutions.

This is a progress tracker only.

==================================================

10. TECHNICAL PREPARATION

==================================================

Create a Technical Preparation section.

Suggested categories:

Data Structures

Algorithms

DBMS

Operating Systems

Computer Networks

OOP

SQL

Java / Python / C++

Web Development

Software Engineering

Allow users to mark topics as practiced.

Track:

- Last practiced

- Total practice days

- Current streak

==================================================

11. INTERVIEW PREPARATION

==================================================

Create an Interview Preparation section.

Categories:

HR Interview

Technical Interview

Behavioral Questions

Resume Preparation

Self Introduction

Communication

Mock Interview

Allow daily practice tracking.

Again:

NO answer submission.

Only track whether preparation was done.

==================================================

12. PROGRESS PAGE

==================================================

Create a beautiful Progress page.

Show:

Overall Preparation Progress

Aptitude

Coding

Technical

Interview

Each should have a percentage and progress bar.

Also show:

Applications

Total applications

Interviews

Selected

Rejected

Preparation consistency:

Current streak

Longest streak

Practice days

Coding:

Total problems solved

Easy

Medium

Hard

Weekly activity chart:

Monday

Tuesday

Wednesday

Thursday

Friday

Saturday

Sunday

Show how many preparation activities were completed each day.

Monthly progress should also be visible if enough data exists.

Do NOT show fake data.

If the user has no data, show:

"No activity yet. Start today."

==================================================

13. DAILY ACTIVITY

==================================================

The application must record activities by DATE.

Example:

August 15:

Aptitude ✓

Coding ✓

August 16:

Aptitude ✓

Technical ✓

The user should be able to see their preparation history.

Do not overwrite previous days.

The application should preserve historical activity.

==================================================

14. LOGIN POPUP / DAILY REMINDER

==================================================

When the user logs into TRAJECTA, show a subtle elegant popup/toast near the top.

Example:

"Good afternoon, [Name] 👋

You haven't completed today's preparation yet.

Start today's preparation →"

If the user already completed all daily preparation:

"Great work, [Name] 🎉

You've completed today's preparation."

The popup should be dismissible.

Do not show an annoying popup repeatedly during the same session.

==================================================

15. DATABASE

==================================================

Use a proper relational database.

Recommended tables/models:

User

- id

- full_name

- email

- password_hash

- created_at

JobApplication

- id

- user_id

- company

- role

- platform

- application_date

- status

- created_at

- updated_at

DailyPractice

- id

- user_id

- category

- topic

- practice_date

- created_at

CodingTopic

- id

- user_id

- topic

- easy

- medium

- hard

- last_practiced

- updated_at

TechnicalPractice

- id

- user_id

- topic

- practice_date

InterviewPractice

- id

- user_id

- topic

- practice_date

Use proper foreign keys.

Ensure each user only sees their own records.

Prevent duplicate daily practice records for the same user/category/topic/date.

==================================================

16. DASHBOARD BEHAVIOR

==================================================

Dashboard must dynamically calculate:

Total Applications

Today's Practice

Aptitude Practice Days

Coding Problems

Overall Progress

Recent Applications:

Show the latest 5 applications.

Today's Preparation:

Show completion state based on actual database records.

Progress:

Calculate from actual stored activity.

No placeholder numbers.

No fake statistics.

==================================================

17. RESPONSIVE DESIGN

==================================================

The website must work beautifully on:

Desktop

Laptop

Tablet

Mobile

Dashboard cards should stack appropriately on smaller screens.

Tables should become responsive cards or horizontally scrollable.

Navigation should become a mobile menu.

Modals should fit mobile screens.

==================================================

18. UX DETAILS

==================================================

Use subtle animations:

- Button hover

- Card hover

- Modal opening

- Progress bar animation

- Toast notifications

Do not overuse animations.

Use empty states.

Examples:

"No applications yet."

"Start tracking your first application."

"No coding progress yet."

"Solve your first problem and start your journey."

"No preparation recorded today."

"Start with one small step."

==================================================

19. IMPORTANT UI RULES

==================================================

Do NOT:

- Use excessive gradients

- Use neon colors

- Use huge colorful illustrations

- Use childish icons

- Crowd the dashboard

- Add unnecessary features

- Add a Notes field to applications

- Turn aptitude/coding into quizzes

- Require answer submission

- Hard-code statistics

- Use fake user data

- Show dashboard before login

- Allow cross-user data access

==================================================

20. APPLICATION ARCHITECTURE

==================================================

Use a clean, maintainable architecture.

Separate:

Frontend UI

Backend/API

Database

Authentication

Business logic

Use reusable components.

Do not duplicate code unnecessarily.

Use clear naming conventions.

==================================================

21. IMPORTANT: EXISTING PROJECT

==================================================

If an existing TRAJECTA project is provided, inspect the existing code before modifying it.

Do NOT blindly overwrite working authentication or database code.

Preserve existing functionality where it is correct.

If changes are required, modify the existing implementation safely.

Do not delete existing user data.

Do not delete the existing SQLite database unless explicitly instructed.

If database schema changes are required, use migrations or safe schema updates.

==================================================

22. FINAL EXPECTED USER FLOW

==================================================

Visitor opens TRAJECTA:

Landing Page

        ↓

Get Started

        ↓

Register

        ↓

Login

        ↓

Dashboard

Dashboard:

Welcome message

Statistics

Today's Preparation

Recent Applications

Progress

User clicks:

"+ Add Application"

Modal opens.

User enters:

Google

Software Engineer Intern

LinkedIn

Aug 16 2026

Applied

Click Save.

Application is stored in database.

Dashboard immediately updates.

User goes to Today's Preparation.

Clicks:

✓ Aptitude

System stores:

Aptitude practiced

Date = Aug 16 2026

Dashboard updates:

Today's progress: 1 / 4

User goes to Coding.

Updates:

Arrays

Easy: 10

Medium: 6

Hard: 1

System displays:

Problems Solved: 17

Last practiced:

Aug 16

Progress page updates automatically.

==================================================

23. QUALITY REQUIREMENT

==================================================

Before considering the application complete:

Test:

Registration

Login

Logout

Protected routes

Database persistence

Adding application

Editing application

Deleting application

Filtering applications

Daily practice tracking

Duplicate prevention

Coding statistics

Progress calculation

User isolation

Responsive layout

Do not claim a feature is complete unless it actually works.

The final application should feel like a polished personal career-preparation product, not a prototype.

The core philosophy of TRAJECTA is:

"Track your journey. Shape your future."

Every feature should support that idea.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://trajecta-pathway-tracker.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a05b7a3f-aa5c-4336-8654-baba17d0f75b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
