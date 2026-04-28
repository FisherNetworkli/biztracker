-- Allow skipping a written ask when the user selects "no need from the group" (mirrors blocker_question).
alter table public.daily_entries
  alter column what_i_need drop not null;
