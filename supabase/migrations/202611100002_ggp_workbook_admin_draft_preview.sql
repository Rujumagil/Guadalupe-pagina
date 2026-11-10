-- Permite al administrador matriculado probar su PROPIO cuaderno en borradores.
-- Nunca concede lectura de respuestas de otros alumnos ni publica los cursos.
alter policy ggp_workbook_self_read on public.ggp_academy_workbook_entries
 using (
   student_id=(select auth.uid()) and (
     public.ggp_academy_enrolled(course_id) or (
       public.ggp_academy_is_admin(workspace_id) and
       exists(select 1 from public.ggp_academy_enrollments e
         where e.course_id=ggp_academy_workbook_entries.course_id
           and e.workspace_id=ggp_academy_workbook_entries.workspace_id
           and e.student_id=(select auth.uid())
           and e.status in ('active','completed')
           and (e.expires_at is null or e.expires_at>now()))
     )
   )
 );
alter policy ggp_workbook_self_insert on public.ggp_academy_workbook_entries
 with check (
   student_id=(select auth.uid()) and (
     public.ggp_academy_enrolled(course_id) or (
       public.ggp_academy_is_admin(workspace_id) and
       exists(select 1 from public.ggp_academy_enrollments e
         where e.course_id=ggp_academy_workbook_entries.course_id
           and e.workspace_id=ggp_academy_workbook_entries.workspace_id
           and e.student_id=(select auth.uid())
           and e.status in ('active','completed')
           and (e.expires_at is null or e.expires_at>now()))
     )
   )
 );
alter policy ggp_workbook_self_update on public.ggp_academy_workbook_entries
 using (
   student_id=(select auth.uid()) and (
     public.ggp_academy_enrolled(course_id) or (
       public.ggp_academy_is_admin(workspace_id) and
       exists(select 1 from public.ggp_academy_enrollments e
         where e.course_id=ggp_academy_workbook_entries.course_id
           and e.workspace_id=ggp_academy_workbook_entries.workspace_id
           and e.student_id=(select auth.uid())
           and e.status in ('active','completed')
           and (e.expires_at is null or e.expires_at>now()))
     )
   )
 )
 with check (
   student_id=(select auth.uid()) and (
     public.ggp_academy_enrolled(course_id) or (
       public.ggp_academy_is_admin(workspace_id) and
       exists(select 1 from public.ggp_academy_enrollments e
         where e.course_id=ggp_academy_workbook_entries.course_id
           and e.workspace_id=ggp_academy_workbook_entries.workspace_id
           and e.student_id=(select auth.uid())
           and e.status in ('active','completed')
           and (e.expires_at is null or e.expires_at>now()))
     )
   )
 );
