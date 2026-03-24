# Genetic Insight — Full Project Context for AI-Assisted Development

> **Document Purpose:** This file consolidates the complete product specification, business rules, technical architecture, use cases, Q&A decisions, and data models for the **Genetic Insight** health platform. It is intended as the single source of truth for any AI system assisting with design, development, code generation, or testing.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [User Roles & Access Model](#2-user-roles--access-model)
3. [Authentication & Registration](#3-authentication--registration)
4. [Onboarding & User Profile](#4-onboarding--user-profile)
5. [Consent Management](#5-consent-management)
6. [Questionnaire Engine — Technical Specification](#6-questionnaire-engine--technical-specification)
7. [Questionnaire Navigation & Lifecycle](#7-questionnaire-navigation--lifecycle)
8. [Questionnaire Content — Fields & Domains](#8-questionnaire-content--fields--domains)
9. [Questionnaire Answer Types](#9-questionnaire-answer-types)
10. [Lifestyle & Mental Health Data Collection](#10-lifestyle--mental-health-data-collection)
11. [Medical History Data Collection](#11-medical-history-data-collection)
12. [Test Files Upload & Processing](#12-test-files-upload--processing)
13. [Dashboard & Results](#13-dashboard--results)
14. [AI Assistant](#14-ai-assistant)
15. [Billing Engine & Monetization](#15-billing-engine--monetization)
16. [Token System & Paywall](#16-token-system--paywall)
17. [Subscriptions (Out of MVP)](#17-subscriptions-out-of-mvp)
18. [Marketplace & Orders](#18-marketplace--orders)
19. [Consultations](#19-consultations)
20. [Admin Panel — Access & Authentication](#20-admin-panel--access--authentication)
21. [Admin Panel — User Management](#21-admin-panel--user-management)
22. [Admin Panel — Operations & File Management](#22-admin-panel--operations--file-management)
23. [Admin Panel — Questionnaire Builder](#23-admin-panel--questionnaire-builder)
24. [Admin Panel — Marketplace & Consultation Configuration](#24-admin-panel--marketplace--consultation-configuration)
25. [Admin Panel — Token Configuration](#25-admin-panel--token-configuration)
26. [Audit Logging](#26-audit-logging)
27. [Email Notifications](#27-email-notifications)
28. [In-App Notifications](#28-in-app-notifications)
29. [Providers & Reference Data](#29-providers--reference-data)
30. [Key Decisions & Q&A Log](#30-key-decisions--qa-log)
31. [Epics & User Stories Reference](#31-epics--user-stories-reference)
32. [Non-Functional Requirements Summary](#32-non-functional-requirements-summary)

---

## 1. Project Overview

**Genetic Insight** is a personalized health analytics platform that creates a "Digital Twin" for each user by combining genetic data (DNA), laboratory test results, and comprehensive health questionnaire responses. The platform uses AI to interpret health data, generate risk assessments, provide plain-language explanations, and deliver actionable recommendations.

### Core Value Proposition

- Users upload DNA files and lab reports; the platform extracts, processes, and interprets the data.
- A comprehensive health questionnaire captures lifestyle, medical history, mental health, and family history.
- An AI assistant provides unlimited, context-aware health insights using all user data.
- A personalized dashboard displays risk scores, trends, daily recommendations, and genetic insights.
- Doctors can be granted read-only access to patient dashboards.
- A marketplace offers DNA tests, lab panels, and consultations — orders are manually fulfilled by admins in MVP.

### MVP / PoC Scope

- **In MVP:** Token economy, marketplace, consultations (manual fulfillment), questionnaire engine (configurable via admin), AI assistant with full context access, DNA + blood test processing, dashboard with risk scores.
- **Out of MVP:** Subscription plans, region-aware pricing, multi-currency, automatic lab routing, conditional follow-up questions in questionnaire, auto-calculated fields, PDF report generation, advanced commission models.
- **Payment gateway:** Paysera (EUR only for MVP).
- **2FA:** Google Authenticator only for MVP (mandatory for admins).

---

## 2. User Roles & Access Model

| Role | Description | Access |
|------|-------------|--------|
| **Patient** | Default role on self-registration. End user of the platform. | Questionnaire, dashboard, AI assistant, marketplace, consultations, file uploads, token wallet, profile management. |
| **Doctor** | Created/managed via admin panel. Read-only access to shared patient data. | View patient dashboard (same view as patient), view genetic insights, lab results, health profile. Cannot modify data. |
| **Admin** | First account seeded via DB script. Mandatory 2FA. | Full admin panel access: user management, questionnaire builder, marketplace config, token config, consultation config, audit logs, orders, impersonation ("Login as User"). |

### Doctor Access Flow (MVP)

Patient enters doctor's email → Doctor receives email notification → Doctor logs in → Doctor sees patient's dashboard in read-only mode. No admin confirmation required for MVP. Simple sharing model.

---

## 3. Authentication & Registration

### 3.1 Register via Email (UC-01-1)

1. User selects "Register with Email".
2. System prompts for email → validates format and uniqueness.
3. System sends 6-digit OTP (expires in 15 minutes) with session security phrase.
4. User enters OTP → system verifies (max 3 attempts, then 5-min lockout; CAPTCHA after first failure).
5. System presents 2FA setup (QR code for Google Authenticator) → user scans and verifies.
6. System prompts for optional profile fields: first name, last name, date of birth. All optional — user can skip.
7. Account created with role "Patient", status "active".
8. User redirected to Questionnaire.

**Business Rules:** Email must be unique. Default role is Patient. Account is immediately active. Session timeout: 15 min inactivity.

### 3.2 Register via Google (UC-01-3)

1. User selects "Continue with Google" → Google OAuth consent screen.
2. Google returns email, first name, last name, date of birth.
3. System checks email uniqueness → creates account with role "Patient".
4. 2FA setup required.
5. User redirected to Questionnaire.

**Business Rules:** Google email is considered verified. No OTP needed. Default role is Patient.

### 3.3 Authenticate via Email (UC-01-2)

1. User enters email → system validates account exists.
2. System sends 6-digit OTP with security phrase, IP, device info.
3. User enters OTP (max 3 attempts, 15-min expiry).
4. If 2FA enabled → prompt for authenticator code.
5. Patient redirected to: questionnaire (if not completed) OR dashboard (if completed). Doctor redirected to patient selection page.

### 3.4 Authenticate via Google (UC-01-4)

1. User selects "Login with Google" → Google OAuth.
2. System checks email exists in DB → logs in (no account creation).
3. If 2FA enabled → prompt before final login.

### 3.5 Delete Account (UC-1401)

1. User navigates to Profile → "Delete Account".
2. System displays warning about permanent deletion.
3. System sends OTP for verification.
4. Upon confirmation: account deactivated immediately, data permanently deleted, confirmation email sent, user logged out.

**Business Rules:** Account closure requires email verification. For traceability and legal reasons, system should archive and securely store deleted user's data for X amount of time.

### 3.6 Email Templates for Auth

- **OTP Email (EMA-101):** Subject: "Your login code for {{PlatformName}}" — includes OTP, session phrase, expiry, IP, device info.
- **Session phrase:** 4-character cryptographically random code (charset: ABCDEFGHJKLMNPQRSTUVWXYZ); same TTL as OTP; bound to session_id and user_id.
- **REQUEST_DEVICE format:** "{{Browser}} on {{Operating System}} (Desktop)" or "{{Browser}} on {{Device Type}} (Mobile)" or "Unknown device".

---

## 4. Onboarding & User Profile

### 4.1 Manage User Profile (UC-01-5)

- Fields: Email (read-only), First name (editable), Last name (editable), Date of birth (editable, age 18-120), Role (displayed, not editable).
- Names: letters, spaces, hyphens, apostrophes allowed.
- Email cannot be changed via profile.

### 4.2 Body Metrics (Questionnaire — Anthropometrics)

| Field | UC | Type | Required | Notes |
|-------|-----|------|----------|-------|
| Height | UC-236 | Number (cm) | Yes | Range: 50-300 cm (configurable) |
| Weight | UC-237 | Number (kg) | Yes | Range: 0.1-300 kg (configurable) |
| BMI | UC-238 | Auto-calculated | N/A | Formula: weight(kg) / (height(m))². Read-only. Categories: <18.5 Underweight, 18.5-24.9 Normal, 25.0-29.9 Overweight, ≥30.0 Obesity |
| Body Fat % | UC-239 | Number (%) | No | Range: 0.01-100% |
| Hobbies | UC-267 | Free text | No | Max 300 characters |

---

## 5. Consent Management

### Capture Initial Consent (UC-105)

After registration, system presents consent screen:

| Consent Type | Required | Default |
|--------------|----------|---------|
| **Data Processing** — Collection and processing of personal health data (questionnaire, genetic, lab) for Digital Twin | Yes | Unchecked |
| **AI Usage** — AI analysis for summaries, risk assessments, recommendations | Yes | Unchecked |
| **Data Sharing** — De-identified data sharing with explicitly authorized healthcare providers | Yes | Unchecked |
| **Marketing** — Marketing communications about features, products, health insights | No | Unchecked |

**Business Rules:** Required consents must be actively checked (never pre-checked). "Accept" button disabled until all required consents checked. Each consent stored as separate record with: type, status, timestamp, consent version ID, user agent. Consent records are immutable for audit.

---

## 6. Questionnaire Engine — Technical Specification

### 6.1 Purpose

Config-driven health questionnaire system with dynamic rendering from JSON/DB schema, conditional logic, versioned storage, and normalized outputs for recommendations, lab suggestions, and DNA-based risk interpretation.

### 6.2 Core Entities

#### Questionnaire

| Field | Description |
|-------|-------------|
| `code` | Stable identifier (e.g., `health_core`) |
| `version` | Integer or semver |
| `status` | `draft` / `published` / `archived` |
| `locale_default` | Default locale (e.g., "en") |
| `title`, `description` | Display metadata |
| `sections[]` | Array of sections |
| `created_at`, `updated_at`, `published_at` | Timestamps |

**Rules:** Published version is immutable. Any structural change requires a new version. Responses are always tied to a specific `questionnaire_version`.

#### Section

Fields: `code`, `title`, `description`, `order`, `visibility_rules` (optional), `is_repeatable` (optional), `questions[]`.

#### Question

Fields: `code` (stable, never reused), `type`, `text`, `help_text`, `required` (boolean), `required_rules` (conditional), `visibility_rules`, `validation` (JSON), `ui` (placeholder, unit, mask, step, multiline), `options[]`, `calculation` (for auto-calculated).

#### Option (for select/multi-select)

Fields: `value`, `label`, `order`, `is_other` (optional), `other_question_code` (optional linked follow-up).

#### Response

Fields: `response_id`, `questionnaire_code`, `questionnaire_version`, `user_id`, `status` (`in_progress` / `submitted`), `answers` (map: question_code → typed_value), `schema_hash`, `started_at`, `submitted_at`, `progress_percent`, `last_completed_section_code`, `sections_status` (map), `last_activity_at`, `is_complete` (boolean).

### 6.3 Supported Question Types & Typed Value Formats

| Type | Typed Value Format |
|------|--------------------|
| `checkbox` | `{ "bool": true }` |
| `select` | `{ "selected": "value" }` |
| `multi_select` | `{ "selected": ["value1", "value2"] }` |
| `text` | `{ "text": "example" }` |
| `numeric` | `{ "number": 72.5, "unit": "kg" }` |
| `date` | `{ "date": "YYYY-MM-DD" }` |
| `scale` | `{ "scale": 7 }` |
| `auto_calculated` | `{ "computed": 23.4, "inputs": { "anthro.height_cm": 180, "anthro.weight_kg": 76 } }` |

### 6.4 Validation Rules

- Required (if visible), non-empty string (trimmed), min/max length (text), regex pattern, numeric min/max, step validation, date constraints (e.g., no future dates), multi-select minSelected/maxSelected, mutual exclusion logic ("None of the above").
- Validation errors returned per `question_code`. API provides structured error responses. Frontend highlights specific invalid fields.
- Hidden questions must not trigger required validation. Required evaluation occurs after visibility evaluation.

### 6.5 Conditional Logic Engine

**Logical operators:** `AND`, `OR`, `NOT`

**Comparison operators:** `equals`, `not_equals`, `in`, `not_in`, `gt`, `gte`, `lt`, `lte`, `exists`

**Example rule:**
```json
{
  "and": [
    { "q": "substance.smoking_status", "op": "equals", "v": "current" },
    { "q": "demographics.age_years", "op": "gte", "v": 18 }
  ]
}
```

Rules must not create circular dependencies. Hidden questions must not trigger required validation.

### 6.6 Auto-Calculated Fields (Out of MVP)

Type: `auto_calculated`. Must define input dependencies and formula. Recalculated in real time when inputs change. If required inputs missing → `computed = null` + reason.

Examples: BMI = weight_kg / (height_m²), Age = current_date − date_of_birth, Pack-years = (cigs_per_day / 20) × smoking_years.

### 6.7 Versioning & Schema Management

Each response stores: `questionnaire_code`, `questionnaire_version`, `schema_hash`. Published versions are immutable. Draft edits do not affect existing responses. Question codes remain stable across versions.

### 6.8 API Requirements

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/questionnaires/{code}?version=latest\|{version}` | GET | Retrieve schema (sections, questions, options, rules, UI metadata) |
| `/responses` | POST | Create new response |
| `/responses/{id}` | PATCH | Autosave partial answers |
| `/responses/{id}/submit` | POST | Validate + finalize |
| `/responses/{id}` | GET | Retrieve response |
| `/users/{user_id}/responses/latest?questionnaire=health_core` | GET | Get latest response |

**Events emitted:** `questionnaire.submitted` → triggers recommendation engine, DNA risk recalculation, lab suggestion pipeline.

### 6.9 Section-Based Draft Saving & Progressive Completion

- Users can start, stop at any moment, resume later, submit only after completing all required fields.
- Questionnaire displayed and persisted section by section. Each section is an independent draft unit.
- **Section Status:** `not_started`, `in_progress`, `completed`, `invalid` (optional).
- **Save triggers:** "Save & Continue" click, auto-save timeout (2-5 sec after last change), navigation away from section.
- **Save behavior:** Only current section answers validated (visible fields only). Section marked `completed` if all required valid, else `in_progress`. Response status remains `in_progress`.
- **Submission:** Allowed only when all sections completed and no required visible fields missing. Sets `status = submitted`, records `submitted_at`, disables draft editing.
- **Resume:** Load latest `in_progress` response, navigate to first incomplete section, pre-fill saved answers.
- **Autosave:** Idempotent, debounced, network-failure resilient, optimistic locking.

---

## 7. Questionnaire Navigation & Lifecycle

### 7.1 Landing Page (UC-201)

Welcome message, section list with descriptions, privacy reassurance, "Start" / "Continue" button (if draft exists).

### 7.2 Navigation Between Sections (UC-202)

All sections accessible at any time (non-linear). When leaving a section with incomplete required fields, warning displayed but navigation NOT blocked. Section completion based on required fields only.

### 7.3 Save Section Answers — Autosave (UC-203)

System validates visible fields only. Formats answers using typed value format. Merges answers (does not overwrite other sections). Updates section status. Displays subtle "Saved" indicator. Data saved regardless of validation status.

### 7.4 View Completion Progress (UC-204)

Progress bar (percentage), section list with status icons (✓ completed / • in progress / ○ not started). Based on required fields only.

### 7.5 Manually Save & Exit (UC-205)

Save current section → confirmation → redirect to dashboard.

### 7.6 Resume Saved Draft (UC-206)

System loads latest `in_progress` response → navigates to first incomplete section → pre-fills saved answers.

### 7.7 Submit Questionnaire (UC-215)

- "Submit" button always visible.
- If required fields missing: warning displayed but submission NOT blocked. Creates response with `is_complete: false`.
- Emits `questionnaire.submitted` event.
- Downstream processes work with available data.

### 7.8 View Submitted Questionnaire (UC-216)

Read-only formatted view of all submitted answers from Profile, grouped by section.

### 7.9 Edit Submitted Questionnaire (UC-217)

User clicks "Edit" in Profile → warning about insight/recommendation changes → creates new `in_progress` response → user makes changes → re-submits. Editing allowed at any time for MVP.

### 7.10 Handle Version Change (UC-VERSION-01)

When admin publishes new version:
- **Identical questions (same code/type/options):** Auto-migrated.
- **Minor changes (same code/type, changed options):** Migrated if selected option still exists; cleared if not.
- **Major changes (different type):** Cleared, marked "needs review".
- **Removed questions:** Answer removed.
- **New questions:** Left empty.
- Status set to `in_progress_requires_review`. In-app + email notification sent.

### 7.11 Validate Section on Navigation (UC-214)

System checks required fields on navigation attempt. Warning displayed but navigation NEVER blocked.

### 7.12 Validate Logical Consistency (UC-219)

Real-time cross-field validation based on schema rules. Inline error messages for inconsistencies.

### 7.13 Reset/Clear Section (UC-207) — Out of MVP

User clears all answers in a section. Confirmation required.

---

## 8. Questionnaire Content — Fields & Domains

### Questionnaire Domains

1. **Anamnesis & Current Health** — Subjective well-being, known conditions, allergies, medications, supplements
2. **Anthropometrics & BMI** — Height, weight, BMI (auto), body fat %, waist circumference, weight change
3. **Cardiometabolic** — Resting heart rate, blood pressure, diagnosed hypertension/diabetes, HRV
4. **Medical History** — Surgeries, injuries, hospitalizations, past diagnoses, cancer history, pregnancy history, medication history, borderline markers, screenings
5. **Family History** — Cardiovascular, oncology, diabetes/metabolic, neurological, autoimmune, other hereditary risks
6. **Lifestyle (Addictions)** — Sport/activity, sleep, nutrition, smoking, alcohol, drug use
7. **Environment & Social Support** — Living area, work conditions, social support, noise/air quality, hobbies
8. **Psychological & Emotional** — Stress, mood, anxiety symptoms, depression symptoms, burnout, cognitive performance, sleep impact, mental health care, safety check, subjective health score

### Field Summary Table

| Domain | Field | Required | Type | Notes |
|--------|-------|----------|------|-------|
| Anthropometrics | Height (cm) | Y | numeric | BMI calculation; range 50-300 |
| Anthropometrics | Weight (kg) | Y | numeric | Range 0.1-300 |
| Anthropometrics | BMI | Auto | auto_calculated | Read-only |
| Anthropometrics | Body fat % | N | numeric | 0.01-100% |
| Anthropometrics | Waist circumference (cm) | N | numeric | Cardiometabolic risk predictor |
| Anthropometrics | Weight change (5 yrs) | N | select | Stable / Gain / Loss |
| Cardiometabolic | Resting heart rate | N | numeric | Longevity marker |
| Cardiometabolic | Known blood pressure | N | numeric | Cardiovascular risk |
| Cardiometabolic | Diagnosed hypertension | N | yes/no | Risk stratification |
| Cardiometabolic | Diagnosed diabetes | N | yes/no | Longevity modifier |
| Cardiometabolic | HRV (avg last 30 days) | N | numeric (ms) | Autonomic balance |
| Anamnesis | Subjective well-being | Y | select | Very good / Good / Average / Poor |
| Anamnesis | Known medical conditions | Y | multi-select | Categorized comprehensive list + Other |
| Anamnesis | Allergies | Y | multi-select + severity | Drug, food, environmental, insect, material + Other |
| Anamnesis | Current medications | N | free text (chips) | Keyword suggestions, dosage, frequency |
| Anamnesis | Supplements | N | free text (chips) | Keyword suggestions, dosage |
| Lifestyle | Sport/activity | Y | select | None / 1-2x / 3-5x / Daily |
| Lifestyle | Sleep duration (hrs) | Y | numeric | 0-24 hours, decimals allowed |
| Lifestyle | Sleep quality | Y | scale 1-5 | Very poor to Excellent |
| Lifestyle | Nutrition pattern | Y | select + Other | Balanced / High-carb / Keto / Vegetarian / Vegan / Other |
| Lifestyle | Smoking | Y | select | No / Occasionally / Daily |
| Lifestyle | Alcohol | Y | select | No / Rarely / Weekly / Daily |
| Lifestyle | Drug use | Y | select | No / Occasionally / Regularly |
| Environment | Living area | Y | select | Urban / Suburban / Rural / Nature |
| Environment | Work conditions | Y | select | Office / Remote / Physical / Mixed / Not working |
| Environment | Social support | Y | scale 1-3 | Low / Medium / High |
| Environment | Noise/air quality | Y | yes/no + free text | Conditional follow-up |
| Environment | Hobbies | N | free text | Max 300 chars |
| Psychological | Stress level | Y | scale 0-10 | Past 2 weeks; optional stressor follow-up |
| Psychological | Mood/emotional state | Y | select + Other | Stable / Fluctuating / Low / Irritable / High anxiety / Other |
| Psychological | Anxiety symptoms | Y | multi-select | With "None of the above" mutual exclusion |
| Psychological | Depression symptoms | Y | multi-select | With "None of the above" mutual exclusion |
| Psychological | Burnout/exhaustion | N | scale 0-10 | Past 2 weeks |
| Psychological | Cognitive performance | Y | scale 1-5 | Compared to usual; optional memory/focus follow-up |
| Psychological | Sleep impact (mental) | N | select | None / Mild / Moderate / Severe |
| Psychological | Mental health care | N | multi-select + Other | With "None" mutual exclusion |
| Psychological | Safety check | Y | select | Yes / No / Prefer not to answer |
| Psychological | Subjective health score | Y | scale 0-10 | Overall physical + mental |

### Safety Check (UC-276)

Question: "In the past 2 weeks, have you had thoughts of harming yourself?" Options: Yes / No / Prefer not to answer. If "Yes": display compassionate message with crisis resources (988 Lifeline, Crisis text line, 911, professional guidance). Does NOT block questionnaire progress. Required field.

---

## 9. Questionnaire Answer Types

| UC | Type | Description |
|----|------|-------------|
| UC-208 | Single/Multi-Select | Radio buttons (single) or checkboxes (multi). Support for "Other" with linked free-text. |
| UC-209 | Free-Text | Single-line or textarea (configurable via `ui.multiline`). Min/max length, regex validation. |
| UC-210 | Scale/Slider | Number scale (min/max/step from schema). Displayed as slider or radio buttons. |
| UC-211 | Date | Calendar picker. ISO 8601 format. Configurable constraints (e.g., no future dates). |
| UC-212 | Numeric | Number input with optional unit. Range validation (min/max/step). |
| UC-213 | Conditional Follow-Up (Out of MVP) | Visibility rules evaluated in real-time. Hidden questions not validated, data cleared. |
| UC-218 | Derived Metrics (Out of MVP) | System-computed scores (BMI, stress score, sleep score). Recomputed on data change. |

---

## 10. Lifestyle & Mental Health Data Collection

### Detailed Use Cases

| UC | Field | Type | Required | Options/Range |
|----|-------|------|----------|---------------|
| UC-256 | Sport/activity level | single-select | Y | None / 1-2x/week / 3-5x/week / Daily |
| UC-257 | Sleep duration | numeric (hours) | Y | 0-24 hrs, decimals allowed |
| UC-258 | Sleep quality | scale 1-5 | Y | Very poor → Excellent |
| UC-259 | Nutrition pattern | single-select + Other | Y | Balanced / High-carb / Keto / Vegetarian / Vegan / Other |
| UC-260 | Smoking status | single-select | Y | No / Occasionally / Daily |
| UC-261 | Alcohol consumption | single-select | Y | Never / Rarely / Weekly / Daily |
| UC-262 | Drug use | single-select | Y | No / Occasionally / Regularly |
| UC-263 | Living area | single-select | Y | Urban / Suburban / Rural / Nature |
| UC-264 | Work conditions | single-select | Y | Office / Remote / Physical / Mixed / Not working |
| UC-265 | Social support | scale 1-3 | Y | Low / Medium / High |
| UC-266 | Noise/air quality | single-select + conditional text | Y main | Yes/No; if Yes → free-text (max 200 chars) |
| UC-267 | Hobbies | free text | N | Max 300 chars |
| UC-268 | Stress level | scale 0-10 | Y | No stress → Extreme stress; optional multi-select stressors |
| UC-269 | Mood/emotional state | single-select + Other | Y | Stable / Fluctuating / Low mood / Irritable / High anxiety / Other |
| UC-270 | Anxiety symptoms | multi-select | Y | Restlessness, Worrying, Racing thoughts, Heart rate, Panic, Concentration, Sleep, Avoidance, None (exclusive) |
| UC-271 | Depression symptoms | multi-select | Y | Low mood, Loss of interest, Fatigue, Sleep, Appetite, Hopelessness, Concentration, Low motivation, None (exclusive) |
| UC-272 | Burnout/exhaustion | scale 0-10 | N | No burnout → Complete exhaustion |
| UC-273 | Cognitive performance | scale 1-5 | Y | Much worse → Much better; optional memory/focus follow-up |
| UC-274 | Sleep impact (mental) | single-select | N | None / Mild / Moderate / Severe |
| UC-275 | Mental health care | multi-select + Other | N | None (exclusive), Therapy, Psychiatrist, Medications, Support group, Other |
| UC-276 | Safety check | single-select | Y | Yes / No / Prefer not to answer |
| UC-277 | Subjective health score | scale 0-10 | Y | Worst → Best possible health |

---

## 11. Medical History Data Collection

### Anamnesis & Current Health

| UC | Field | Type | Notes |
|----|-------|------|-------|
| UC-231 | Subjective well-being | select (4 options) | Very good / Good / Average / Poor |
| UC-232 | Known medical conditions | multi-select (categorized) | Comprehensive list: cardiovascular, GI, metabolic, respiratory, neurological, musculoskeletal, autoimmune, mental health, renal, oncology, other. "None of the above" mutual exclusion. |
| UC-232.1 | Condition-specific details | conditional follow-ups | For hypertension, diabetes, heart rhythm, asthma, high cholesterol: medication use, readings, control status |
| UC-233 | Allergies | multi-select (categorized) + severity | Drug, food, environmental, insect, material. Severity: Mild/Moderate/Severe/Anaphylaxis. |
| UC-234 | Current medications | chip input + suggestions | Name, dosage, frequency. Keyword suggestions from database. |
| UC-235 | Supplements | chip input + suggestions | Name, dosage. Keyword suggestions from list. |

### Medical History

| UC | Field | Type | Notes |
|----|-------|------|-------|
| UC-240 | Prior surgeries/procedures | repeatable group | Procedure name (required), year, reason, notes |
| UC-241 | Prior injuries/major events | repeatable group | Event type (dropdown), year, lasting limitations, notes |
| UC-242 | Hospitalizations (non-surgical) | repeatable group | Reason (dropdown), year, duration, notes |
| UC-243 | Past diagnoses | multi-select + conditional | Categorized by system. Cancer triggers additional fields. |
| UC-244 | Cancer treatment history | conditional repeatable | Cancer type, year, treatment types (multi-select), radiation area, chemo agents, remission status |
| UC-245 | Pregnancy history | conditional | Gestational diabetes, preeclampsia, preterm, recurrent miscarriage, number of pregnancies |
| UC-246 | Medication history (risk-relevant) | repeatable group | Medication name, years taken, reason |
| UC-247 | Borderline markers | repeatable group | Marker type (dropdown), approximate year, value, notes |
| UC-248 | Preventive screening & immunizations | multi-select + year | Colonoscopy, mammogram, PSA, vaccines, etc. |
| UC-249 | Functional limitations | repeatable group | Symptom type, duration, severity (1-5), notes |

### Family History

| UC | Field | Type | Conditions |
|----|-------|------|------------|
| UC-250 | Cardiovascular disease | repeatable group | Heart attack, Stroke, Hypertension, High cholesterol, Sudden cardiac death, Inherited disorder, Other |
| UC-251 | Oncology | repeatable group | Breast, Ovarian, Colon, Prostate, Pancreatic, Melanoma, Other. Multiple cancers flag. Pattern detection. |
| UC-252 | Diabetes & metabolic | repeatable group | T1, T2, Gestational, Obesity/metabolic syndrome, Gout, Other. Insulin-treated early flag. |
| UC-253 | Neurological/cognitive | repeatable group | Alzheimer's, Parkinson's, Stroke, Epilepsy, Other. Early onset flag, rapid progression, unusual patterns. |
| UC-254 | Autoimmune/inflammatory | repeatable group | Hashimoto's, RA, T1D, Celiac, IBD, Psoriasis, SLE, Other |
| UC-255 | Other hereditary risks | free text (500 chars) | Guidance: BRCA, Lynch, FH, clotting disorders, kidney disease, connective tissue disorders |

**All family history entries capture:** Condition, Relative (dropdown: Mother/Father/Sibling/Child/Grandparent/Aunt/Uncle/Multiple/Unknown), Age at diagnosis (0-120), Notes. "None known" is mutually exclusive with adding entries.

---

## 12. Test Files Upload & Processing

### 12.1 Upload Laboratory Test File (UC-705)

- Uploads via AI assistant or dashboard.
- **Supported formats:** .txt, .csv, .vcf, .json, .docx, .pdf, .jpg, .png
- **Max file size:** 100 MB per file, 100 MB total per upload.
- **Supported test panels:** CBC, Basic Biochemical Profile, Lipid Panel + ApoB, TSH.
- Files stored in MinIO: `users/{userId}/imports/{timestamp}_{filename}`.
- Upload records created with status "pending". OCR processing queued.
- Original files retained for re-validation and debugging.

### 12.2 Upload DNA File via AI Assistant (UC-702)

- Conversational upload via AI assistant chat widget.
- Same format/size limits.
- Assistant guides user, shows progress, disables new uploads/messages during processing.
- On completion: "Your genetic insights are now ready!"

### 12.3 Process Lab Report with OCR (UC-707)

1. System retrieves file from MinIO.
2. Sends to OCR service (with language hints).
3. Parses extracted text for core test panels:

**CBC:** WBC, RBC, Hemoglobin, Hematocrit, MCV, MCH, MCHC, RDW, Platelets, Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils.

**Basic Biochemical:** Glucose, Creatinine, eGFR, ALT, AST, + optional: BUN/Urea, Sodium, Potassium, Chloride, CO2, Alkaline Phosphatase, Total Bilirubin, Albumin, Total Protein.

**Lipid Panel + ApoB:** Total Cholesterol, LDL-C, HDL-C, Triglycerides, ApoB, + optional: Non-HDL, VLDL, LDL/HDL ratio.

**TSH:** Thyroid Stimulating Hormone.

4. For each test: extract value, unit, reference range. Calculate flags (High/Low/Normal).
5. Store structured results. Update dashboard.
6. AI determines file type (DNA vs blood test vs unknown) automatically.

### 12.4 Process DNA File with Whitelist SNP Filtering (UC-719)

1. Load whitelist of target SNPs (~30-50 clinically relevant variants).
2. Stream uploaded file line by line (not loaded into memory).
3. For each line: parse rsID, check against whitelist, extract genotype if match.
4. Calculate risk allele count for each matched SNP.
5. Produce structured JSON with only relevant variants.
6. Pass to Version and Store → AI Summarization.

**Key Rule:** LLM receives ONLY structured JSON (~30 SNPs), never raw file (2M+ lines).

### 12.5 Process with Monica's Algorithm (UC-703)

1. Parse raw DNA file into rsID → genotype mapping.
2. Execute Monica's proprietary algorithm.
3. Output structured JSON: categories (Cardiovascular, Metabolic, Nutrients, Pharmacogenomics, etc.), genes, SNPs, genotypes, risk alleles, interpretations, confidence levels.
4. Store with versioning → trigger AI summarization.

### 12.6 Version and Store Genetic Insights (UC-704)

- Each version: `user_id`, `version_id`, `previous_version_id`, `created_at`, `algorithm_version`, `data` (JSON), `status` (active/archived).
- Previous active version archived when new one stored.
- All historical versions retained indefinitely.
- `last_genetic_update` timestamp updated.

### 12.7 Handle Failed Processing (UC-708)

After max retries: status → "failed", user notification (friendly, non-technical), admin alert with full error details. Admin investigates manually.

### 12.8 View Upload Status (UC-713) & View Files (UC-713.1)

- Files displayed in reverse chronological order.
- Each file shows: name, upload date, type (DNA Test / Blood Test / Unknown), status (Completed / Failed), download option.
- Upload history retained indefinitely.

### 12.9 Request Data Deletion (UC-709)

Options: delete all data, delete specific files, delete insights only. Identity verification required (2FA or OTP). Permanent deletion from MinIO + DB. Confirmation email sent. Audit log retained.

### 12.10 Supported Tests Reference Table

| Panel | Test Name | Abbreviation | Gender |
|-------|-----------|-------------|--------|
| CBC | Complete Blood Count | CBC | All |
| Urinalysis | Urinalysis | UA | All |
| Lipid Panel | Lipid Panel | Lipidograma | All |
| Metabolic | Glucose Test | GLU | All |
| Liver | ALT | SGPT | All |
| Liver | AST | SGOT | All |
| Kidney | Creatinine | CRE | All |
| Kidney | eGFR | GFR | All |
| Hormone | TSH | Thyroid Stimulating Hormone | Women only |
| Hormone | PSA | Prostate Specific Antigen | Men only |
| Vitamin | Vitamin D, 25-Hydroxy | 25-OH | All |

---

## 13. Dashboard & Results

### 13.1 Main Dashboard — Patient (UC-10-1)

After login, patient sees personalized health overview:

**A. Dynamic Daily To-Do List** — AI-generated actionable suggestions based on abnormal lab values, genetic risk factors, lifestyle gaps. Categories: Nutrition, Exercise, Mindfulness, Supplement.

**B. Blood Test Results Grid** — Cards showing: test name, panel, status indicator (Normal/Critical/Suboptimal with color), value + unit. Critical values get AI-generated explanatory note. Link to detailed history.

**C. AI Assistant Panel** — Key genetic insights with explanations. Biological age comparison (calculated vs chronological). "Explore full DNA profile" button. Free-form question input + context-aware suggested prompts.

**D. Overall Health Risk Score (UC-714)** — AI-generated percentage based on weighted combination of: genetic risk variants, lab test results, questionnaire responses. Severity: Low (0-33%), Moderate (34-66%), High (67-100%). Top 3-5 contributing factors. Key metrics graphs. "What to Do Next" recommendations.

### 13.2 Doctor View (UC-10-2)

Same layout as patient dashboard, strictly read-only. All interactive elements disabled. Doctor cannot ask AI questions.

### 13.3 Detailed Test Analysis (UC-715)

Clicking a test card → dedicated page:
- Header with breadcrumb, test name, date.
- Summary card with key value, status badge, reference range, AI summary.
- Full test panel table: Test / Value / Unit / Reference Range / Flag.
- Historical trend chart (line chart, hover tooltips, reference range bands).
- AI-generated clinical interpretation.
- Recommendations section.
- Related insights (genetic ↔ lab connections).
- AI Assistant corner with context-specific prompts.

### 13.4 Drill Down (UC-10-3)

For blood tests: summary card, full panel table (color-coded flags: green=normal, orange/yellow=high/low, red=borderline), historical trend chart, AI interpretation, recommendations.

For genetic insights: marker name, genotype, risk level (color-coded), plain-language summary, detailed scientific explanation (gene function, variant impact, population frequency, evidence level).

### 13.5 Empty Dashboard State (UC-10-6)

New users see onboarding prompts: "Complete your health profile", "Upload first lab report", "Upload DNA data". AI assistant provides onboarding guidance.

### 13.6 Generate AI Summaries from DNA (UC-706)

System generates plain-language summaries: executive summary, category-organized insights, high-risk findings, lifestyle/monitoring suggestions, disclaimers. Output as markdown. Summaries versioned alongside genetic data.

### 13.7 Generate Genetic Insights PDF Report (UC-1301) — Out of MVP

Comprehensive PDF: cover page, executive summary, methodology, results by category (Cardiovascular, Metabolic, Nutrients, Pharmacogenomics, Secondary Findings), disclaimers. Stored in MinIO: `users/{userId}/reports/genetic_report_{timestamp}.pdf`.

---

## 14. AI Assistant

### 14.1 Interact with AI Assistant — Unlimited Context (UC-904)

- **Full context access:** AI assistant has access to ALL user data — not limited to current page. Can answer about genetic insights, lab results, questionnaire responses, lifestyle, AND general medical knowledge.
- **WebSocket connection** for real-time interaction.
- **Follow-up questions** handled naturally, maintaining context.
- **Safety guardrails:** Non-diagnostic language, appropriate disclaimers. Never provides definitive diagnoses or medication recommendations.
- If user asks about another person → "I can only provide information about your own health data."
- **Conversation history** maintained for session; summarized periodically.

### 14.2 Context-Aware Suggested Prompts (UC-905)

System detects current context (critical lab values, genetic insights, general) and displays up to 4 relevant prompts. Auto-fills and submits on click. Examples: "Explain my LDL result", "What does this genetic variant mean?", "What lifestyle changes would help?"

### 14.3 Conversation Summarization (UC-718)

When session expires or user closes browser: system summarizes full conversation to 2-3 sentences (clinically relevant). Stores summary with metadata. Discards detailed history, retains last N messages. Summary included in future prompts for context continuity.

### 14.4 Clarification for Ambiguous Questions (UC-904.2)

When question could refer to on-screen data or general knowledge: assistant asks for clarification with referencing options.

### 14.5 AI Summary Output Format

Markdown format. Must include appropriate disclaimers. LLM instructed to avoid definitive diagnostic language and clearly communicate uncertainty.

---

## 15. Billing Engine & Monetization

### Architecture Principles

- Decoupled monetization layers (subscriptions ≠ marketplace ≠ consultations).
- Config-driven pricing — no hardcoded values.
- All token costs configurable via admin panel.
- MVP: single region, EUR only, Paysera payment gateway.

### Monetization Layers (MVP)

1. **Token/Credit System** — Required for MVP.
2. **Marketplace Orders (DNA & Labs)** — Required, manual fulfillment.
3. **Consultation Booking** — Required, manual scheduling.
4. **Subscription Plans** — Skipped for MVP.

### Token Economy

**Token Wallet:** `current_balance`, `monthly_allocation`, `purchased_balance`, `expiration_rules`.

**Token Transactions (immutable ledger):** `transaction_id`, `user_id`, `amount`, `type` (allocation / consumption / purchase / expiration / admin_adjustment), `source`, `timestamp`.

**Token-consuming actions (configurable costs):**
- AI Question
- Disease Deep Dive
- DNA Full Interpretation
- Lab Risk Recalculation
- Consultation Summary

### Conversion Logic / Paywall

When user attempts action requiring tokens but balance insufficient: paywall displays required amount, current balance, shortfall, "Buy Tokens" CTA.

---

## 16. Token System & Paywall

### 16.1 Token Configuration Dashboard (UC-812)

Admin overview: token costs per action, initial balance, expiration policy (Out of MVP), token packs.

### 16.2 Configure Token Costs per Action (UC-812.1)

Table: Action ID, Action Name, Token Cost, Description. Admin can edit, add new actions, deactivate. All costs non-negative integers. No hardcoded values.

### 16.3 Configure Initial Token Balance (UC-812.2)

Number of tokens for new users on registration. Can be zero.

### 16.4 Configure Token Packs (UC-812.4)

Packs: name, token amount, price (EUR), description. Users purchase via token wallet.

### 16.5 Configure Transaction Types (UC-812.5)

Types: allocation, consumption, purchase, expiration, admin_adjustment. Can add: bonus, refund, etc.

### 16.6 Consume Tokens (UC-808)

1. User attempts token-cost action.
2. System checks cost (from config) and balance.
3. If sufficient → deduct and proceed.
4. If insufficient → trigger paywall.

### 16.7 View Token Wallet (UC-806)

Current balance, transaction history (consumption, purchase). Wallet auto-created for every user with configured initial balance.

### 16.8 Paywall Enforcement (UC-816)

Displays: required tokens, current balance, upgrade CTA, buy tokens CTA. User can purchase tokens and retry.

### 16.9 Purchase Token Pack (UC-807)

User selects pack → Paysera payment → webhook → validate → credit tokens → record in ledger as "purchase".

---

## 17. Subscriptions (Out of MVP)

Planned subscription tiers: Free, Core, Pro, Custom. Features include: token quotas, rollover policy, consultation discounts, priority booking, advanced modules access, DNA full interpretation access, lab monitoring access. Prorated upgrades, end-of-cycle downgrades, cancellation at period end. Free trial (time-based or usage-based). Skip subscription option available.

---

## 18. Marketplace & Orders

### 18.1 Marketplace Products

Unified `MarketplaceProduct` entity: `product_id`, `name`, `description`, `type` (dna / lab_panel), `category` (metabolic, oncology, hormonal, cardiovascular, etc.), `provider_id`, `price` (EUR), `status` (active/inactive).

### 18.2 Order Flow — Patient (UC-809)

1. User browses marketplace → selects product.
2. System displays: price, description, estimated turnaround.
3. User proceeds to checkout → Paysera payment.
4. On payment success: order created with status "pending".
5. Admin receives notification → handles order manually.
6. User receives confirmation email.

### 18.3 Admin — Marketplace Configuration (UC-813)

CRUD operations for products: create, edit, clone (new ID, draft status), archive (remove from user-facing), delete (only if no orders). Paginated table with filters (type, category, provider, status).

### 18.4 Admin — Orders Management (UC-1120)

Paginated table: Order ID, type (Test/Consultation), user, product, amount, payment status, order status, date. Filters: type, payment status, order status, date range.

**Order Status Transitions:** pending → processing → completed; (pending | processing) → cancelled.

**View Order Details (UC-1120.1):** Order summary, user info, product/service details, action buttons.

**Update Status (UC-1120.2):** Dropdown with allowed transitions. Confirmation required. "Completed" triggers user notification.

**Cancel Order (UC-1120.5):** Reason (optional), user notification, audit log.

---

## 19. Consultations

### 19.1 Consultation Types

Entity: `consultation_type_id`, `name`, `description`, `duration_minutes`, `base_price` (EUR), `status`.

### 19.2 Book Consultation — Patient (UC-810)

1. User browses consultation types (e.g., 30 min, DNA review).
2. System displays price and description.
3. User proceeds to checkout → Paysera payment.
4. On success: booking created with status "pending".
5. Admin receives notification → handles scheduling manually.
6. User receives confirmation: "We will contact you to confirm the appointment."

**No automatic calendar sync in MVP.** Admin handles scheduling manually.

### 19.3 Admin — Consultation Type Management

CRUD: create (UC-814.1), edit (UC-814.2), clone (UC-814.4, new ID + inactive status), archive (UC-814.3), delete (UC-814.5, only if no bookings). Pricing configuration (UC-814.7): default currency.

---

## 20. Admin Panel — Access & Authentication

### 20.1 Admin Login (UC-1101)

1. Admin navigates to admin login page.
2. Login via email+OTP or Google.
3. System verifies Admin role.
4. Mandatory 2FA prompt (Google Authenticator).
5. Redirected to user management (default landing page).

**2FA is mandatory for ALL admin accounts.**

### 20.2 Seed First Admin (UC-1129)

Database seed script during initial deployment. Creates admin with: email, name, role "Admin", status "active". First login forces 2FA setup.

### 20.3 Configure 2FA (UC-1128.4)

Enable: display QR code → scan with authenticator → verify 6-digit code → display recovery codes (one-time display). Disable: verify current 2FA code → disable. Recovery codes generated once.

### 20.4 Admin Side Menu (UC-1102.1)

Menu items: User Management, Orders, Questionnaire Builder, Marketplace Configuration, Token Configuration, Consultation Types, Audit Logs, My Profile.

---

## 21. Admin Panel — User Management

### 21.1 List Users (UC-1103)

Default landing page. Paginated table: User ID, Email, Name, Role, Status, Actions. Filter by role/status, search by name/email, sort by any column. Actions per user: View Details, Edit, Deactivate/Activate, Log in as User, Adjust Tokens, Delete.

### 21.2 View User Details (UC-1104)

Tabs: Profile (email, name, DOB, phone, role, status + Edit button), Subscription & Tokens (balance, transaction history + Adjust button).

### 21.3 Edit User (UC-1105)

Editable: email, first name, last name, date of birth, phone. Email uniqueness validated.

### 21.4 Deactivate/Activate User (UC-1106)

Toggle status. 2FA confirmation required. Deactivated users cannot log in.

### 21.5 Delete User — Permanent (UC-1124)

Strong warning. Admin types 2FA code. Permanently deletes: profile, MinIO files, test results, insights, questionnaire responses, token wallet, all user data. Audit logged. Irreversible.

### 21.6 Login as User — Impersonation (UC-1114)

1. Admin selects "Log in as User" → 2FA confirmation.
2. System creates new session for target user.
3. Admin sees platform exactly as user.
4. Persistent banner: "LOGGED IN AS [UserName] — Return to Admin Panel".
5. Admin can perform any user actions (upload files, ask AI, book consultations).
6. All actions logged with both admin ID and user ID.
7. Click "Return to Admin Panel" to exit.

**Rules:** Admin cannot impersonate another admin. Not allowed for deactivated accounts. Same session timeout as regular users.

---

## 22. Admin Panel — Operations & File Management

### 22.1 View User Dashboard (via impersonation)

Admin sees full user dashboard with "LOGGED IN AS USER" banner. Can navigate, click risk cards, view details.

### 22.2 View User's Files (UC-1123)

While impersonated: navigate to "My Files" → see all uploads (name, date, size, type). Same view as user.

### 22.3 Download User File (UC-1115)

While impersonated: click "Download" → file retrieved from MinIO. Logged with both user ID and admin ID.

### 22.4 Import Test for User (UC-1116)

While impersonated: upload test file → same processing pipeline as user upload. Source: "admin_import". Logged with both IDs.

### 22.5 Manually Adjust Tokens (UC-816/UC-816125)

Admin enters: number of tokens to add/remove, reason. 2FA confirmation. Transaction recorded as "admin_adjustment". User may receive notification.

---

## 23. Admin Panel — Questionnaire Builder

### 23.1 Landing Page (UC-ADM-00)

List of questionnaires: code, title, latest version, status, last modified, actions (Edit Draft, Clone, Preview, Publish, Archive, Delete).

### 23.2 Create Questionnaire (UC-ADM-01)

Fields: code (unique), title, description, locale_default. Creates draft (version 1). Code must be unique. Initial version always draft.

### 23.3 Manage Sections & Questions (UC-ADM-02)

Drag-and-drop ordering. Add section (code, title, description, order). Add question to section (select type, enter code, text, help text). Configure properties. No duplicate codes within questionnaire.

### 23.4 Configure Question Properties (UC-ADM-03)

Per type: code, text, help_text, required, required_rules, visibility_rules. Select/multi-select: options list, "Other" flag, linked follow-up. Numeric: min, max, step, unit. Text: min/max length. Date: min/max date, future allowed?. Scale: min, max, step. Auto-calculated (Out of MVP): input dependencies, formula.

### 23.5 Preview Questionnaire (UC-ADM-05)

Renders as user would see. Conditional logic applied. Interactive.

### 23.6 Publish Version (UC-ADM-06)

Final validation (no broken references, no duplicate codes). Sets status "published", locks version (immutable). Audit logged.

### 23.7 Clone (UC-ADM-07)

New code + title → creates copy as draft.

### 23.8 Archive / Unarchive (UC-ADM-09/10)

Archive: hidden from users, existing responses preserved. Cannot be edited/published. Unarchive: restores to draft for reuse.

### 23.9 Version History (UC-ADM-11)

List: version number, status, published date. Click to view read-only schema. Immutable, append-only.

### 23.10 Import/Export Schema (UC-ADM-08)

Export: JSON file download. Import: validate JSON, show diff preview, create new draft.

### 23.11 Conditional Logic Rules (UC-ADM-04) — Out of MVP

Rule builder UI with AND/OR/NOT operators, comparison operators, question code references. Saved in JSON format.

---

## 24. Admin Panel — Marketplace & Consultation Configuration

### Marketplace Products (UC-813.x)

CRUD: create (ID, name, description, type, category, provider, price, status), edit, clone (new ID + draft), archive, delete (only if no orders).

### Providers (UC-813.7)

CRUD: provider_id, name, type (dna_lab / clinical_lab / partner_network), status. Linked to products via provider_id.

### Consultation Types (UC-814.x)

CRUD: ID, name, description, duration, base_price, status. Clone creates inactive copy. Archive removes from booking. Delete only if no bookings.

### Commission per Provider (UC-814.12) — Out of MVP

Commission percentage and fixed fee per booking per provider.

---

## 25. Admin Panel — Token Configuration

### Token Configuration Dashboard (UC-812)

Summary: token costs per action, initial balance, expiration policy (Out of MVP), token packs.

### Token Costs per Action (UC-812.1)

Table of all actions with editable costs. Can add/deactivate. Non-negative integers only.

### Initial Balance (UC-812.2)

Configurable initial token grant for new users. Can be zero.

### Token Packs (UC-812.4)

Name, token amount, price (EUR), description. Displayed in user purchase UI.

### Transaction Types (UC-812.5)

Manage types: allocation, consumption, purchase, expiration, admin_adjustment, bonus, refund.

---

## 26. Audit Logging

### System-Wide Audit Logging (UC-2005)

**Trigger events:**

- **User actions:** Login, logout, profile update, questionnaire submission/saving/editing, file upload, data share (with doctor), consultation booking, token purchase, marketplace purchase, data deletion.
- **Admin actions:** User management (create, edit, deactivate, delete), questionnaire configuration (create, edit, publish, clone, archive), pricing changes.
- **System events:** Failed login attempts, processing failures, API errors, payment webhooks.

**Captured fields:** Timestamp (ISO 8601), Actor (user_id / admin_id / "system"), Action type, Resource, After state, User agent, Status (success/failure), Error details.

**Rules:** Logs are immutable. Cannot be altered or deleted. Access restricted to authorized personnel. Encrypted at rest.

### Admin View Audit Logs (UC-1117)

Paginated table: Timestamp, Actor (email), Actor role, Action type, Resource, Status, Details (expandable). Default: newest first.

### Filter Logs (UC-1117.1)

Date range, actor (email search), action type (multi-select), resource type, status, IP address.

### View Log Details (UC-1117.3)

Expand row: full action description, after state, user agent, session ID, additional metadata.

---

## 27. Email Notifications

### Authentication & Account

| ID | Trigger | Recipient | Subject |
|----|---------|-----------|---------|
| EMA-101 | Login OTP request | Patient/Doctor/Admin | "Your login code for {{PlatformName}}" |
| EMA-102 | Account deletion | Patient | "Your {{PlatformName}} account has been closed" |
| EMA-103 | Admin deactivates account | Patient | "Important: Your {{PlatformName}} account status has changed" |
| EMA-104 | Admin reactivates account | Patient | "Your {{PlatformName}} account has been reactivated" |

### Genetic & Lab Processing

| ID | Trigger | Subject |
|----|---------|---------|
| EMA-201 | DNA processing complete | "Your DNA insights are ready on {{PlatformName}}" |
| EMA-202 | DNA processing failed | "Update on your DNA processing" |
| EMA-204 | Data deletion requested | "Your data deletion request has been received" |
| EMA-205 | Data deletion completed | "Your data has been deleted" |
| EMA-301 | Lab report processing complete | "Your lab results are ready" |
| EMA-302 | Lab report processing failed | "Update on your lab report processing" |

### Doctor Access

| ID | Trigger | Recipient | Subject |
|----|---------|-----------|---------|
| EMA-401 | Patient grants access | Patient | "You've shared your health data with {{DoctorEmail}}" |
| EMA-403 | Patient grants access | Doctor | "A patient has shared their health data with you" |

### Marketplace & Consultations

| ID | Trigger | Subject |
|----|---------|---------|
| EMA-501 | Order placed | "Your {{PlatformName}} order has been received" |
| EMA-502 | Order completed | "Your {{PlatformName}} order is complete" |
| EMA-503 | Order cancelled | "Your {{PlatformName}} order has been cancelled" |
| EMA-504 | Consultation booked | "Your consultation request has been received" |
| EMA-505 | Consultation confirmed | "Your consultation has been confirmed" |

### Tokens & Payments

| ID | Trigger | Subject |
|----|---------|---------|
| EMA-601 | Token purchase successful | "Your token purchase was successful" |
| EMA-602 | Payment failed | "Payment failed for your {{PlatformName}} transaction" |

### Admin Actions (Patient-Facing)

| ID | Trigger | Subject |
|----|---------|---------|
| EMA-701 | Admin imports test results | "Test results have been added to your account" |
| EMA-702 | Admin adds tokens | "Tokens have been added to your account" |

**Localization:** Default language = user's browser language. Fallback = EN.

---

## 28. In-App Notifications

| Trigger | Message |
|---------|---------|
| Questionnaire version updated | "The health questionnaire has been updated. Some of your previous answers could not be automatically transferred. Please review and complete your questionnaire." |
| Questionnaire submitted | "Your health profile is complete! Thank you for providing your information." |
| DNA processing started | "Your DNA analysis has started. You will be notified when your genetic insights are ready." |
| DNA processing completed | "Your genetic insights are now ready! View them in your dashboard." |
| DNA processing failed | "We encountered technical difficulties processing your DNA file. Our team has been notified." |
| Lab report uploaded | "Your lab report has been uploaded successfully. Processing will begin shortly." |
| Lab report processing started | "Your lab results are being processed." |
| Lab report completed | "Your lab results are ready to view in your dashboard." |
| Lab report failed | "We encountered technical difficulties processing your lab report." |
| Doctor granted access | "Dr. [Doctor Name] now has access to your health data." |
| Order placed | "Your order has been placed. You will be contacted soon." |
| Order cancelled | "Your order #[Order ID] has been cancelled." |
| Consultation booked | "Your consultation request has been received." |
| Consultation confirmed | "Your consultation with [Specialist Name] has been confirmed for [Date] at [Time]." |
| Token purchase successful | "[X] tokens have been added to your wallet." |
| Profile updated | "Your profile has been updated successfully." |
| Tokens added by admin | "[X] tokens have been added to your wallet by an administrator. Reason: [reason]" |
| Test imported by admin | "Your test results have been uploaded by an administrator and are now available for review." |

---

## 29. Providers & Reference Data

### Provider Entity

`provider_id`, `name`, `type` (dna_lab / clinical_lab / partner_network), `regions_supported`, `api_integration_type`, `pricing_model`, `status`.

### Admin Profile (UC-1128)

View (UC-1128.1): read-only name, email, role, 2FA status. Edit (UC-1128.2): first name, last name (email may be read-only). 2FA configuration (UC-1128.4).

### Manage User Roles (UC-ADM-13) — Out of MVP

Roles: Admin, Editor, Publisher, Viewer. Only admins can change roles. Logged with before/after values.

---

## 30. Key Decisions & Q&A Log

### Registration & Auth

| Question | Decision |
|----------|----------|
| Registration fields? | Email, first name, last name, age — all optional (user can skip) |
| Login method? | Google (basic) or Email with OTP. 2FA via Google Authenticator. |
| OTP format? | 6-digit numeric, expires 15 min, max 3 attempts + CAPTCHA after first failure |
| User role selection? | Default Patient. Doctors created in admin panel. |
| Age restriction? | 18+ |
| Session timeout? | 15 minutes of inactivity |
| Account deletion? | User can delete. System archives data for X time for legal reasons. GDPR "Right to be forgotten" applicable. |

### Questionnaire

| Question | Decision |
|----------|----------|
| Which fields mandatory? | See Field Summary Table above |
| Retake questionnaire? | View in Profile, edit at any time |
| Save partial progress? | Yes, autosave per section |
| After completion? | Redirect to subscriptions page (skippable), then dashboard |
| Configurable questionnaire? | Yes, via admin panel (Questionnaire Builder) |

### Test Upload & Processing

| Question | Decision |
|----------|----------|
| File formats? | .txt, .csv, .vcf, .json, .docx, .pdf, .jpg, .png |
| File size limit? | 100 MB per file, 100 MB total |
| Upload limit per user? | No limit (each processing costs tokens) |
| File type detection? | AI analyzes automatically |
| Processing time expectation? | No limits for PoC |
| File retention? | Keep all files indefinitely |
| Failed processing? | Pass to admins for manual handling |
| Historical genetic versions? | Retained indefinitely |
| User data deletion? | Delete everything on request (GDPR) |

### AI Assistant

| Question | Decision |
|----------|----------|
| Context limitation? | NO — full access to all user data + general medical knowledge |
| Upload via AI assistant? | Yes, both DNA and lab files |
| Summaries storage? | Save in chat for now |
| Clear/recreate context? | Anonymous and main chats. Anonymous history cleared. |
| Suggested prompts? | Yes, MUST have context-aware prompts |
| Output format? | Markdown |

### Admin & Billing

| Question | Decision |
|----------|----------|
| Admin panel location? | Separate panel for users with Admin role |
| Subscriptions for MVP? | Skipped. Token economy required. |
| Payment gateway? | Paysera (EUR only) |
| Multi-currency? | Not for MVP |
| Region-aware pricing? | Not for MVP |
| Token packs? | Static amount + price, configurable via admin |
| Insufficient tokens during processing? | Each action has fixed token cost (check before processing) |
| Doctor access flow? | Simple sharing with email, no admin confirmation |
| Admin user view? | "Login as User" (impersonation) — easier and faster than separate view mode |
| 2FA for admin? | Mandatory, Google Authenticator only |
| Admin notifications for failures? | Via audit logs |
| User file display? | Categorized by type, reverse chronological |
| Token configuration? | All costs configurable via admin, no hardcoded values |
| Order processing? | Manual via admin panel |

---

## 31. Epics & User Stories Reference

| Epic | Key |
|------|-----|
| User Profile & Authentication | KAN-1 |
| Questionnaire Engine (Patient Facing) | KAN-10 |
| Dashboard & AI Assistant | KAN-29 |
| Genetic and Laboratory Data Processing | KAN-37 |

### Key User Stories

| Story | Key | Epic |
|-------|-----|------|
| Register via Email | KAN-2 | KAN-1 |
| Register via Google | KAN-3 | KAN-1 |
| Capture Initial Consent | KAN-4 | KAN-1 |
| Authenticate via Email | KAN-5 | KAN-1 |
| Authenticate via Google | KAN-6 | KAN-1 |
| Manage User Profile | KAN-7 | KAN-1 |
| Delete Account | KAN-8 | KAN-1 |
| View Uploaded Files | KAN-9 | KAN-1 |
| View Questionnaire Landing Page | KAN-11 | KAN-10 |
| Navigate Between Sections | KAN-12 | KAN-10 |
| Save Section Answers (Autosave) | KAN-13 | KAN-10 |
| View Completion Progress | KAN-14 | KAN-10 |
| Manually Save & Exit | KAN-15 | KAN-10 |
| Resume Saved Draft | KAN-16 | KAN-10 |
| Handle Version Change | KAN-17 | KAN-10 |
| Review Updated Questionnaire | KAN-18 | KAN-10 |
| Answer Single/Multi-Select | KAN-19 | KAN-10 |
| Answer Free-Text | KAN-20 | KAN-10 |
| Answer Scale/Slider | KAN-21 | KAN-10 |
| Answer Date | KAN-22 | KAN-10 |
| Input Numerical Value | KAN-23 | KAN-10 |
| Validate Section on Navigation | KAN-24 | KAN-10 |
| Submit Questionnaire | KAN-25 | KAN-10 |
| View Submitted Questionnaire | KAN-26 | KAN-10 |
| Edit Submitted Questionnaire | KAN-27 | KAN-10 |
| Validate Logical Consistency | KAN-28 | KAN-10 |
| View Main Dashboard (Patient) | KAN-30 | KAN-29 |
| View Dashboard (Doctor) | KAN-31 | KAN-29 |
| Drill Down into Risk Card | KAN-32 | KAN-29 |
| Interact with AI Assistant | KAN-33 | KAN-29 |
| Context-Aware Prompts | KAN-34 | KAN-29 |
| Handle Empty Dashboard | KAN-35 | KAN-29 |
| AI Clarification | KAN-36 | KAN-29 |
| Upload DNA File | KAN-38 | KAN-37 |
| Process DNA with Whitelist | KAN-39 | KAN-37 |
| Version & Store Genetic Insights | KAN-40 | KAN-37 |
| Handle Failed Processing | KAN-41 | KAN-37 |
| Request Data Deletion | KAN-42 | KAN-37 |
| View Upload Status | KAN-43 | KAN-37 |
| View Test Results on Dashboard | KAN-44 | KAN-37 |
| View Detailed Test Analysis | KAN-45 | KAN-37 |
| AI Conversation Summarization | KAN-46 | KAN-29 |
| Upload Lab Test File | KAN-47 | KAN-37 |
| Process Lab Report with OCR | KAN-48 | KAN-37 |
| Process Core Test Set | KAN-49 | KAN-37 |

---

## 32. Non-Functional Requirements Summary

| Category | Requirement |
|----------|-------------|
| **Performance** | Schema fetch < 300ms (cached). Submit < 1 sec. Autosave resilient to network interruptions. |
| **Reliability** | Idempotent autosave. Optimistic locking for concurrent edits. Rule engine must not cause infinite loops. |
| **Observability** | Structured logs. Rule evaluation errors logged. Correlation IDs for tracing. |
| **Security** | Role-based access. Encryption at rest. GDPR compliance (data deletion support). PCI-compliant payments. 2FA mandatory for admins. |
| **Audit** | Immutable audit logs. All admin/user/system actions tracked. Encrypted at rest. |
| **Payments** | Idempotent charge handling. Refund handling. Failed payment retry logic. Webhook-based updates. |
| **Sessions** | 15-minute inactivity timeout. WebSocket resilient to network interruptions. |
| **File Processing** | Memory allocation for files up to 100 MB. Retry with exponential backoff (max 3). |
| **AI Assistant** | WebSocket connection. Follow-up questions with context. Non-diagnostic language. Disclaimers required. |
| **Localization** | Default: browser language. Fallback: EN. Email templates support multiple languages. |

---

> **End of Document.** This file contains the complete project specification for Genetic Insight. All use cases, business rules, data models, Q&A decisions, and technical requirements are included. Use this as the primary reference for development, testing, and AI-assisted code generation.
