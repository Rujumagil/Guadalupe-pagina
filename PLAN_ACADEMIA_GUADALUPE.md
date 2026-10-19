# Academia Guadalupe Gómez Pezuela — propuesta de migración V1
**Fecha:** 18 de octubre de 2026
**Estatus:** diseño de arquitectura y migración; no publicar ni migrar datos sin auditoría de origen.

## Objetivo
Construir una academia digital centrada en **desarrollo humano, crecimiento personal y liderazgo profesional**, con identidad propia de Guadalupe y conexión al CRM propio en Compás One.

## Marcas y alcance
| Sistema | Función y dominio propuesto |
|---|---|
| Página pública | guadalupegomezpezuela.com — coaching y venta consultiva |
| Academia Guadalupe | academia.guadalupegomezpezuela.com — alumno, cursos, lecciones y progreso |
| CRM Guadalupe | guadalupegomezpezuela.com/panel/ — gestión comercial; integrar módulo Academia |
| Compás One | app.proyectocompas.app — backend comercial, reportes, automatizaciones y soporte técnico |
| Compás Fly Front | Atención comercial, elección de curso y seguimiento de inscripciones |
| ETERNI | academia.somos-eterni.com — **permanece independiente**: IXCHEL, libros, Legado y accesos existentes |

## Experiencia del estudiante
1. Descubre un curso desde la web de Guadalupe o el agente comercial.
2. Solicita información; se crea un prospecto de academia en el CRM de Guadalupe con consentimiento.
3. Se informa temario, modalidad, duración y condiciones. La cotización y pago se tramitan mediante un checkout verificado, sin conceder accesos solo por registro.
4. Tras confirmar el pago/asignación autorizada, se crea una matrícula en la academia.
5. El alumno entra a "Mi aprendizaje", ve sus programas activos, módulos, videos, audios, recursos, actividades y progreso.
6. En caso aplicable, completa evaluación y recibe constancia según sus condiciones reales.
7. Compás One recibe solo eventos de negocio: lead, inscripción, pago validado, matrícula, finalización; no registra reflexiones íntimas ni información de coaching privado.

## Oferta académica sugerida
### Ruta 1. Desarrollo personal
- Autoconocimiento, toma de decisiones, confianza, límites y comunicación.
- Aplicaciones prácticas para la vida; sin prometer resultados clínicos.

### Ruta 2. Comunicación, PNL y cambio de perspectiva
- Taller introductorio a PNL, comunicación y revisión de creencias.
- Curso avanzado de PNL (contenido y acreditaciones por verificar).

### Ruta 3. Coaching, liderazgo y equipos
- Liderazgo personal y ejecutivo, delegación, conversaciones difíciles, inteligencia emocional.
- Modalidad individual y corporativa: administradores designan licencias/asientos y ven *avance académico*, no respuestas personales privadas.

### Ruta 4. Formaciones especializadas de Guadalupe
- Hipnosis, constelaciones familiares y biodecodificación, **solo si Guadalupe confirma autorización, temario y posicionamiento**.
- Deben explicarse límites de evidencia, naturaleza no clínica y credenciales/alcance; nunca presentar como tratamiento médico ni emitir certificados oficiales sin acreditación verificable.

**Antecedente de catálogo (sujeto a revisión):** se habían propuesto cuatro cursos de 10 semanas (PNL, Hipnosis, Constelaciones Familiares y Biodecodificación). No activar esas duraciones ni los precios históricos sin nueva confirmación.

## Experiencia por curso
Ficha comercial (objetivo, público, programa, instructor, duración, modalidad, precio/solicitud, condiciones);
módulos y lecciones con medios privados; actividades descargables cuando correspondan;
evaluaciones opcionales; progreso; acceso temporal por producto;
soporte; constancia verificada solo si aplica.
Publicación controlada con estados borrador, revisión, publicado y archivado.

## Arquitectura recomendada
- **No mezclar tablas de formación de ETERNI con las del CRM**. CRM central del workspace Guadalupe para prospectos y ventas; LMS independiente para matrículas, lecciones, progreso y materiales privados.
- **Código:** crear repositorio `guadalupe-academia` desde una copia técnica revisada del LMS ETERNI, eliminando branding y módulos exclusivos de ETERNI antes de publicar. El repositorio ETERNI (`somoseternimx/eterni-academia`) no está disponible en las conexiones GitHub activas: se requiere acceso para ejecutar la copia.
- **Datos:** proyecto Supabase exclusivo o separación por tenant con RLS auditada. No reutilizar claves del proyecto ETERNI. Nunca poner service_role en frontend.
- **Infraestructura:** Cloudflare Workers para el LMS/API, Storage privado con URLs firmadas de vigencia corta, GitHub para despliegues, Supabase Auth.
- **Conexión Compás One:** endpoint firmado de eventos con idempotencia; `workspace_id` exclusivo Guadalupe; mapa `crm_contact_id ↔ academy_student_id`; eventos `lead_created`, `enrollment_requested`, `enrollment_activated`, `course_completed`. Uso de webhook autenticado, validación de firma y verificación de pago del lado servidor.
- **Mensajería/IA:** Compás Fly Front responde sobre catálogo/horarios y lleva al CRM; un segundo agente académico puede recomendar lecciones sin acceder a notas privadas.
- **Autenticación:** preferir inicio de sesión propio con invitación o SSO servidor-servidor revisado; no compartir passwords ni tokens entre academias.

## Matriz de migración
| Contenido/dato | Decisión |
|---|---|
| Cursos propios de Guadalupe autorizados | Copiar estructura, videos y recursos a la nueva academia; mantener original si sigue vendido |
| Alumnos de ETERNI | **No copiar automáticamente**; solo migración consentida y justificada, o nueva cuenta |
| Compras/entitlements/progreso ETERNI | Permanecen en ETERNI, salvo transferencia concreta de un producto y con reconciliación transaccional |
| Comunidad IXCHEL, audios y mensajes diarios | **No migrar** |
| Libros Cuentos para Sanar y La Mujer del Faro | Mantener catálogo ETERNI; enlazar desde Guadalupe si aplica |
| Legado que Trasciende | **No migrar** por defecto |
| Método MES® y cursos de terceros | No migrar por titularidad/metodología diferenciada |
| Datos de pago, tarjetas, claves, datos médicos | Nunca copiar a la nueva plataforma |
| Materiales especializados de Guadalupe | Copiar solo con licencia/permisos y revisión editorial |
| Agencia/CRM One | No duplicar base comercial: enlazar por IDs y webhooks seguros |

## Fases de implementación
1. **Inventario + respaldo:** exportar catálogo y esquema ETERNI (sin datos sensibles al repositorio), mapear activos, accesos y cursos autorizados. Confirmar permisos del LMS de origen.
2. **Marca y producto:** dominio academia.guadalupegomezpezuela.com, diseño Guadalupe, categorías, landing y catálogo editorial en borrador.
3. **Infraestructura:** repo independiente, Supabase LMS aislado, auth/RLS, storage privado, despliegue Cloudflare en staging.
4. **Cursos piloto:** publicar solo cursos realmente completos; ficha, módulos, lecciones y prueba de progreso y acceso.
5. **Integración Compás:** matriculación segura y CRM; automatizaciones de bienvenida, recordatorios y reportes con consentimiento.
6. **Transición:** pruebas con usuarios de ensayo, calidad móvil, respaldo, monitoreo y publicación progresiva. Mantener ETERNI activa sin redirecciones globales.

## Criterios para salir a producción
- El acceso a lecciones privadas requiere matrícula pagada/asignada y vigente.
- Una cuenta de ETERNI no ve los cursos de Guadalupe por compartir correo.
- Una matrícula de Guadalupe no habilita IXCHEL.
- Una persona sin permiso no ve contenido privado, incluso si conoce una URL.
- Se prueban registro, recuperación de contraseña, pago/asignación, progreso, expiración, cancelación, privacidad, móvil y revocación.
- El CRM recibe eventos comerciales sin mezclar workspaces ni almacenar reflexiones personales.
- Los contenidos y las credenciales profesionales publicadas están validados.
- Todas las redirecciones se revisan URL por URL; no se eliminan cuentas ni datos de alumnos sin plan firmado.

## Bloqueo actual
Se ha inspeccionado públicamente `academia.somos-eterni.com`, pero **no hay conexión con el repositorio `somoseternimx/eterni-academia` ni con su proyecto Supabase**. Por tanto, aún no puede ejecutarse una copia técnica ni inventario real de la base de ETERNI. Esta rama solo documenta el plan y **no modifica producción**.
