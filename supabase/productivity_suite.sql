-- MultiTracker Productivity Suite
-- Run in Supabase SQL Editor. Safe to re-run (IF NOT EXISTS / DROP POLICY IF EXISTS).

-- ── shared updated_at trigger function ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── academic_task (restore if missing) ──────────────────────────────────────
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

-- ── class_slot (recurring weekly timetable) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.class_slot (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_name   text NOT NULL,
  course_code  text,
  instructor   text,
  room         text,
  day_of_week  smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time   time NOT NULL,
  end_time     time NOT NULL,
  color        text NOT NULL DEFAULT '#8b5cf6',
  is_break     boolean NOT NULL DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  CHECK (end_time > start_time)
);

DROP TRIGGER IF EXISTS class_slot_updated_at ON public.class_slot;
CREATE TRIGGER class_slot_updated_at
  BEFORE UPDATE ON public.class_slot
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.class_slot ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "class_slot_select_own" ON public.class_slot;
DROP POLICY IF EXISTS "class_slot_insert_own" ON public.class_slot;
DROP POLICY IF EXISTS "class_slot_update_own" ON public.class_slot;
DROP POLICY IF EXISTS "class_slot_delete_own" ON public.class_slot;

CREATE POLICY "class_slot_select_own" ON public.class_slot
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "class_slot_insert_own" ON public.class_slot
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "class_slot_update_own" ON public.class_slot
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "class_slot_delete_own" ON public.class_slot
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS class_slot_user_id_idx     ON public.class_slot(user_id);
CREATE INDEX IF NOT EXISTS class_slot_day_of_week_idx ON public.class_slot(day_of_week);

-- ── daily_event (date-specific events) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.daily_event (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  event_time  time,
  end_time    time,
  location    text,
  notes       text,
  event_date  date NOT NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Existing DBs: add optional end_time + soft range check
ALTER TABLE public.daily_event
  ADD COLUMN IF NOT EXISTS end_time time;

ALTER TABLE public.daily_event
  DROP CONSTRAINT IF EXISTS daily_event_end_after_start;
ALTER TABLE public.daily_event
  ADD CONSTRAINT daily_event_end_after_start
  CHECK (end_time IS NULL OR event_time IS NULL OR end_time > event_time);

DROP TRIGGER IF EXISTS daily_event_updated_at ON public.daily_event;
CREATE TRIGGER daily_event_updated_at
  BEFORE UPDATE ON public.daily_event
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.daily_event ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "daily_event_select_own" ON public.daily_event;
DROP POLICY IF EXISTS "daily_event_insert_own" ON public.daily_event;
DROP POLICY IF EXISTS "daily_event_update_own" ON public.daily_event;
DROP POLICY IF EXISTS "daily_event_delete_own" ON public.daily_event;

CREATE POLICY "daily_event_select_own" ON public.daily_event
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "daily_event_insert_own" ON public.daily_event
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_event_update_own" ON public.daily_event
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_event_delete_own" ON public.daily_event
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS daily_event_user_id_idx    ON public.daily_event(user_id);
CREATE INDEX IF NOT EXISTS daily_event_event_date_idx ON public.daily_event(event_date);

-- ── master_todo (persistent checklist) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.master_todo (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text NOT NULL,
  notes        text,
  is_completed boolean NOT NULL DEFAULT false,
  sort_order   integer NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS master_todo_updated_at ON public.master_todo;
CREATE TRIGGER master_todo_updated_at
  BEFORE UPDATE ON public.master_todo
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.master_todo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "master_todo_select_own" ON public.master_todo;
DROP POLICY IF EXISTS "master_todo_insert_own" ON public.master_todo;
DROP POLICY IF EXISTS "master_todo_update_own" ON public.master_todo;
DROP POLICY IF EXISTS "master_todo_delete_own" ON public.master_todo;

CREATE POLICY "master_todo_select_own" ON public.master_todo
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "master_todo_insert_own" ON public.master_todo
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "master_todo_update_own" ON public.master_todo
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "master_todo_delete_own" ON public.master_todo
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS master_todo_user_id_idx      ON public.master_todo(user_id);
CREATE INDEX IF NOT EXISTS master_todo_is_completed_idx ON public.master_todo(is_completed);

-- ── notebook_note ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notebook_note (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text NOT NULL DEFAULT 'Untitled',
  content_html text NOT NULL DEFAULT '',
  checklist    jsonb NOT NULL DEFAULT '[]',
  tags         text[] NOT NULL DEFAULT '{}',
  is_pinned    boolean NOT NULL DEFAULT false,
  is_archived  boolean NOT NULL DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS notebook_note_updated_at ON public.notebook_note;
CREATE TRIGGER notebook_note_updated_at
  BEFORE UPDATE ON public.notebook_note
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.notebook_note ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notebook_note_select_own" ON public.notebook_note;
DROP POLICY IF EXISTS "notebook_note_insert_own" ON public.notebook_note;
DROP POLICY IF EXISTS "notebook_note_update_own" ON public.notebook_note;
DROP POLICY IF EXISTS "notebook_note_delete_own" ON public.notebook_note;

CREATE POLICY "notebook_note_select_own" ON public.notebook_note
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notebook_note_insert_own" ON public.notebook_note
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notebook_note_update_own" ON public.notebook_note
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notebook_note_delete_own" ON public.notebook_note
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS notebook_note_user_id_idx     ON public.notebook_note(user_id);
CREATE INDEX IF NOT EXISTS notebook_note_is_pinned_idx   ON public.notebook_note(is_pinned);
CREATE INDEX IF NOT EXISTS notebook_note_is_archived_idx ON public.notebook_note(is_archived);
CREATE INDEX IF NOT EXISTS notebook_note_updated_at_idx  ON public.notebook_note(updated_at DESC);


-- ── savings_goal ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.savings_goal (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  target      numeric(12,2) NOT NULL DEFAULT 0,
  current     numeric(12,2) NOT NULL DEFAULT 0,
  deadline    date,
  notes       text,
  emoji       text NOT NULL DEFAULT '🖼️',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS savings_goal_updated_at ON public.savings_goal;
CREATE TRIGGER savings_goal_updated_at
  BEFORE UPDATE ON public.savings_goal
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.savings_goal ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "savings_goal_select_own" ON public.savings_goal;
DROP POLICY IF EXISTS "savings_goal_insert_own" ON public.savings_goal;
DROP POLICY IF EXISTS "savings_goal_update_own" ON public.savings_goal;
DROP POLICY IF EXISTS "savings_goal_delete_own" ON public.savings_goal;

CREATE POLICY "savings_goal_select_own" ON public.savings_goal
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "savings_goal_insert_own" ON public.savings_goal
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "savings_goal_update_own" ON public.savings_goal
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "savings_goal_delete_own" ON public.savings_goal
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS savings_goal_user_id_idx ON public.savings_goal(user_id);
