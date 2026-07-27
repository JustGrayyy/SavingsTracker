# Technical Summary: MultiTracker Rebrand & Academic Task Tracker

## 1. Overview
The application has been successfully rebranded from "SavingsTracker" to "MultiTracker". The codebase has been expanded to support a new domain—academic task tracking—while preserving all existing savings functionality and maintaining exact feature parity in UI patterns.

## 2. Architecture & Tech Stack
The project remains a vanilla JS multi-page application bundled with Vite. No framework migration was performed.
- **Data Layer:** Supabase via `@supabase/supabase-js`.
- **CSS:** Inline block styling per HTML file (maintaining the existing architectural pattern to avoid regression).
- **Build System:** Vite (`vite.config.js` updated for new entry points).

## 3. Database Schema (Supabase)
A new `academic_task` table was created. The required SQL script has been committed to `supabase/academic_task.sql` for execution in the Supabase SQL editor.

**Schema Details:**
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to `auth.users`, cascades on delete)
- `subject`: text
- `title`: text
- `details`: text
- `links`: text (used for simple URL attachment)
- `task_type`: enum `('assignment','exam','project','reading','other')`
- `status`: enum `('todo','in_progress','done','overdue')`
- `priority`: enum `('low','medium','high','urgent')`
- `date_given`, `due_date`: date
- Standard `created_at` and `updated_at` timestamps (with a trigger to auto-update `updated_at`).

**Row Level Security (RLS):**
RLS is enabled on `academic_task` with strict policies ensuring users can only SELECT, INSERT, UPDATE, and DELETE rows where `user_id` matches `auth.uid()`.

## 4. Codebase Modifications

### A. Data Access (`src/tasks.js` & `src/database.types.ts`)
- Created `src/tasks.js` mirroring the pattern in `src/goals.js`. It provides `fetchTasks`, `createTask`, `updateTask`, and `deleteTask`.
- Added a `mapRow` function to map snake_case DB columns to camelCase JS properties (e.g., `due_date` -> `dueDate`).
- Updated `src/database.types.ts` to include the exact `academic_task` Row/Insert/Update types and enums.

### B. UI & Views
- **Tasks Page (`tasks.html`):** Built entirely new Notion-style card grid mirroring `cards.html`. Added filtering by status/type/priority and an inline `<select>` on cards for quick status updates. Implemented an auto-overdue rule (if `due_date` is past and not `done`, updates to `overdue` on render).
- **Savings Page:** Renamed `cards.html` to `savings.html` to clearly distinguish the two trackers.
- **Dashboard (`dashboard.html`):** Added a new "Academic Tasks" stats section with 4 metrics (Pending, Due This Week, Overdue, Completed) sitting above the existing savings stats.
- **Profile (`profile.html`):** Expanded hero stats to include total tasks and tasks done. Added a Task Summary info card. Added a new "Academic Achievements" badge grid alongside the savings badges (dynamically unlocks badges like "Scholar", "Deadline Crusher", "Clear Desk").

### C. Branding & Navigation
- All `<title>` tags and logo elements updated to "MultiTracker".
- Navigation globally updated to: `Tasks | Savings | Dashboard | Profile`.
- Subtitles on `signin.html` and `login.html` adjusted to "track savings & academic tasks".
- Note: The auth domain `users.savingstracker.app` in `src/auth.js` remains unchanged, as mandated, ensuring zero friction or breakage for existing users.

## 5. Security & Risk Notes
- **Hardcoded Anon Key:** `src/supabaseClient.js` contains a hardcoded fallback Supabase URL and anon key. While an anon key is public by design in Supabase apps (protected by RLS), baking it in via code fallback rather than purely via `.env` is a minor risk if the project is open-sourced. Left as-is per existing patterns.
- **Migrations:** The repo lacks an established migration toolchain (e.g. Supabase CLI `supabase migration`). To enforce `academic_task.sql`, the user must run it manually via the Supabase web UI.
- **Auto-Overdue Racing:** The auto-overdue script triggers silent updates when a task's `due_date` has passed but status isn't updated. This keeps the UI self-correcting but could cause minor sequential writes on the first login of a day.

## 6. Verification
- `npm run build` completed successfully in ~250ms with all 6 HTML outputs generated (`tasks.html`, `savings.html`, etc.).
- A strict global `grep` confirms "SavingsTracker" strings only exist in the authentication domain construction in `src/auth.js`.

 CREATE TABLE IF NOT EXISTS public.academic_task (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject     text NOT NULL,
    title       text NOT NULL,
    details     text,
    links       text,
    task_type   text NOT NULL DEFAULT 'other'
                CHECK (task_type IN ('assignment','exam','project','reading','other')),
    status      text NOT NULL DEFAULT 'todo'
                CHECK (status IN ('todo','in_progress','done','overdue')),
    priority    text NOT NULL DEFAULT 'medium'
                CHECK (priority IN ('low','medium','high','urgent')),
    date_given  date,
    due_date    date,
    created_at  timestamptz DEFAULT now(),
    updated_at  timestamptz DEFAULT now()
  );

  CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$;

  DROP TRIGGER IF EXISTS academic_task_updated_at ON public.academic_task;
  CREATE TRIGGER academic_task_updated_at
    BEFORE UPDATE ON public.academic_task
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

  ALTER TABLE public.academic_task ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "academic_task_select_own" ON public.academic_task;
  DROP POLICY IF EXISTS "academic_task_insert_own" ON public.academic_task;
  DROP POLICY IF EXISTS "academic_task_update_own" ON public.academic_task;
  DROP POLICY IF EXISTS "academic_task_delete_own" ON public.academic_task;

  CREATE POLICY "academic_task_select_own" ON public.academic_task
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "academic_task_insert_own" ON public.academic_task
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "academic_task_update_own" ON public.academic_task
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "academic_task_delete_own" ON public.academic_task
    FOR DELETE USING (auth.uid() = user_id);

  CREATE INDEX IF NOT EXISTS academic_task_user_id_idx  ON public.academic_task(user_id);
  CREATE INDEX IF NOT EXISTS academic_task_due_date_idx ON public.academic_task(due_date);
  CREATE INDEX IF NOT EXISTS academic_task_status_idx   ON public.academic_task(status);

---

# Technical Summary Addendum: Student Productivity Suite

## 1. Overview
MultiTracker expanded into a student productivity suite: weekly class schedule + daily overview (events, academic deadlines, master to-do) and a notebook with contenteditable editor. Academic task cards redesigned for density. Savings domain untouched.

## 2. New Database Tables
SQL: `supabase/productivity_suite.sql` (includes academic_task restore + 4 new tables). Run in Supabase SQL Editor.

| Table | Purpose | Key fields |
|-------|---------|------------|
| `class_slot` | Recurring Mon–Sun timetable | day_of_week (0–6 JS), start/end time, color, is_break |
| `daily_event` | Date-specific events | event_date, event_time, end_time, location, notes |
| `master_todo` | Persistent global checklist | title, is_completed, sort_order |
| `notebook_note` | Notes | title, content_html, checklist jsonb, tags text[], pin/archive |

All tables: `user_id` FK → auth.users CASCADE, RLS select/insert/update/delete own, `set_updated_at` trigger, indexes on user_id + domain columns.

## 3. Service Modules
Pattern mirrors `src/tasks.js` / `src/goals.js`:

| Module | Exports |
|--------|---------|
| `src/schedule.js` | fetchClassSlots, createClassSlot, updateClassSlot, deleteClassSlot |
| `src/events.js` | fetchEvents, fetchEventsByDate, createEvent, updateEvent, deleteEvent |
| `src/todos.js` | fetchTodos, createTodo, updateTodo, toggleTodo, deleteTodo |
| `src/notes.js` | fetchNotes, createNote, updateNote, togglePin, toggleArchive, deleteNote |

`src/database.types.ts` updated with all four tables + DayOfWeek / ChecklistItem helpers.

## 4. UI Surfaces

### `schedule.html`
- Weekly grid Mon→Sun, hours 07:00–20:00, lunch band 12–13, color class cards, empty-cell create
- **Active Day**: weekday header click; Daily Overview re-filters
- **Events**: CRUD modal, filtered by Active Day; optional `end_time` supported; timed events also paint on weekly grid with dashed borders and pink/purple gradient
- **Slot modal (Class | Event)**: toggle to choose entry type when adding from grid; Class creates recurring slot, Event creates one-off `daily_event` for column date
- **Deadlines**: `fetchTasks()` filtered `dueDate === activeDay` (reuses academic_task)
- **Master To-Do**: persistent; checkbox toggle + inline add; not day-scoped
- FAB → add class/event slot modal

### `notes.html`
- Desktop: list sidebar + editor; mobile: exclusive list/editor with back
- contenteditable + toolbar (bold/italic/underline/lists/checklist/undo/redo)
- Auto-save debounce 800ms; HTML sanitize allowlist; checklist → jsonb
- Search, sort latest/A–Z, filter active/pinned/archived

### `tasks.html` card redesign
- Removed 110px header strip; compact 14px radius cards
- Left accent bar by priority; denser meta chips; compact status select
- Done: opacity + strikethrough; hover translateY(-2px) only

## 5. Navigation & Build
Nav on all auth pages: **Tasks | Schedule | Notes | Savings | Dashboard | Profile**

`vite.config.js` entries: `schedule`, `notes` added.

## 6. Prerequisites / Risks
- User must run `supabase/productivity_suite.sql` before new CRUD works
- No Supabase CLI/MCP in this environment — DDL is manual
- contenteditable paste/sanitize edge cases; checklist sync best-effort
- Timetable overlaps stack via absolute positioning by minute offset
- Large inline HTML pages by design (existing architecture)
