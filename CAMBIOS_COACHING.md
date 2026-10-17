# Rediseño comercial — Guadalupe Gómez Pezuela

## Objetivo
Presentar el coaching personal y empresarial como las dos rutas principales para contratar a Guadalupe. ETERNI permanece como academia complementaria e independiente.

## Páginas prioritarias
- Inicio: \`/\`
- Coaching personal: \`/coaching-personal/\`
- Coaching empresarial: \`/empresas/\`
- Sobre Guadalupe: \`/sobre-mi/\`
- Contacto: \`/contacto/\`
- Recursos y academia ETERNI permanecen disponibles.

## Mejoras desarrolladas
- Nueva portada orientada a la contratación, con dos caminos claros.
- Descripción de modalidades, situaciones de trabajo, proceso y preguntas frecuentes para ambos tipos de coaching.
- Navegación y pie de página reorganizados.
- Actualización de títulos, metadatos y mapa del sitio con dominio de la marca personal.
- Respuestas por WhatsApp y consulta empresarial; el formulario **no guarda datos en un servidor** y solo prepara un mensaje.
- CSS nuevo aislado en \`styles/comercial.css\`, conservando las variables, el logotipo y las fotos oficiales existentes.
- Nuevas páginas de biografía y contacto.
- Aviso de privacidad y términos con enlaces funcionales, pendientes de validación jurídica.

## Datos pendientes de confirmar antes del lanzamiento
- Modalidad, duración y precio de sesiones personales y empresariales.
- Correos del dominio nuevo: se conserva provisionalmente \`guadalupe@somoseterni.com\` para evitar crear una dirección inexistente.
- Testimonios autorizados y acreditaciones con denominación exacta.
- Configuración DNS del dominio \`guadalupegomezpezuela.com\` y destino de publicación en Cloudflare.
- Revisión legal completa del aviso de privacidad y términos.
- Medición de conversiones y consentimiento de analítica publicitaria.

## No integrado todavía
- El agente Compás Fly Front y el CRM Compás One no están conectados a esta versión.
- No se ha configurado una agenda de reserva ni pago directo.
- No se han implementado redirecciones del dominio anterior: confirmar URLs de origen antes de migrarlas.

## Validaciones
\`\`\`bash
npm ci
npm run typecheck
npm run lint
npm run build
\`\`\`

## Publicación
El repositorio incluye un workflow de GitHub Pages que se ejecuta al hacer push en \`main\` y un archivo de configuración para Cloudflare Workers. Verificar cuál es el despliegue activo antes de fusionar.
