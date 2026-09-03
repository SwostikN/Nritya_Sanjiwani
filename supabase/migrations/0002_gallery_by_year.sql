-- ============================================================
-- The gallery is organised by year, not by category.
--
-- `gallery_groups` (Movement, People, Process, …) is replaced by
-- `gallery_years`: one row per year, and each row becomes its own
-- page at /gallery/<year>. The pictures keep their old grouping as
-- an optional `section` sub-heading inside the year.
--
-- Nothing structural changes — `collections` is keyed by name, so
-- this is only the row-level policy catching up. Without it an
-- editor (a volunteer) could still add pictures but would be
-- refused when adding the year to file them under, which is the
-- first thing they would try to do.
-- ============================================================

drop policy if exists "editors write their collections" on public.collections;

create policy "editors write their collections" on public.collections
  for all using  (public.role_of(auth.uid()) = 'editor'
                  and collection in ('journal','gallery_years','gallery_items'))
      with check (public.role_of(auth.uid()) = 'editor'
                  and collection in ('journal','gallery_years','gallery_items'));
