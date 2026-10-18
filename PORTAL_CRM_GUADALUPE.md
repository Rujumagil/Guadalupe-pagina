# CRM privado de Guadalupe — conectado a Compás One

## Arquitectura
La administración de Guadalupe dispone de una interfaz propia en /panel/ dentro de su sitio, también verificable en la vista previa de GitHub Pages. El diseño y las páginas son propios, no los módulos genéricos de Compás One.

Los datos se almacenan en el Supabase de Compás One y se consultan con la cuenta autenticada de Guadalupe, publishable key y políticas RLS por workspace. Las bases comerciales de ETERNI y Guadalupe se mantienen separadas.

## Módulos incluidos
- Inicio: contactos, prospectos, mensajes, solicitudes, próximas sesiones y tráfico.
- Mi CRM: buscar, registrar contactos y actualizar etapa del embudo.
- Mensajes: bandeja y lectura del historial; enviar mensajes externos todavía requiere abrir Compás One para conservar el envío por proveedor. No simulamos envíos desde la base.
- Reservas: crear solicitudes, consultar estados y confirmar horarios, con verificación básica de solapamientos.
- Calendario: agenda mensual de sesiones confirmadas.
- Tráfico: visitas, páginas vistas, fuentes y dispositivos del workspace de Cloudflare.
- Agentes: estado del agente y acceso a configuración central.

## Activación pendiente
El espacio de Guadalupe ya existe y su cuenta tiene rol de propietaria, pero todavía carece de una asignación de plan activa. Las políticas de Compás One protegen el acceso a las funciones; sin plan, algunas consultas pueden aparecer vacías y los cambios pueden ser rechazados. Activar explícitamente CRM, conversaciones, agenda, integraciones y superagente según configuración comercial; no eludir licencias ni habilitar cobros no autorizados.

Falta conectar Cloudflare Web Analytics del sitio, enlazar formularios y reservas públicas mediante endpoints seguros, configurar el canal de mensajería y Compás Fly Front, y validar reservas con disponibilidad real y recordatorios.

## Seguridad
La interfaz no carga los rastreadores públicos de marketing. Solo se usa la publishable key y nunca el service_role. Se comprueba la membresía activa y RLS en todas las consultas. No se deben guardar historias personales de coaching ni datos médicos en CRM. El portal utiliza sessionStorage por sesión; para una operación sensible a gran escala conviene migrar a un BFF con cookies HttpOnly en Cloudflare Worker.

El navegador puede visualizar el código HTML/JS del formulario de acceso (como toda web estática), pero los datos de contactos requieren autorización real en Supabase.

## Validaciones
node --check public/panel/config.js
node --check public/panel/panel.js
node --test tests/portal-crm.test.mjs
npm run typecheck
npm run lint
npm run build

## Dominio futuro
El acceso inicialmente se ofrece en /panel/. Para crm.guadalupegomezpezuela.com se deberá configurar DNS/rutas Cloudflare y, preferiblemente, un backend seguro dedicado conectado con Compás One.
