# Migración de procesos Stripe a Nicté Ha

## Alcance
Conservar la cuenta Stripe existente de Guadalupe. No desconectar ETERNI, crear cuentas, cambiar precios, habilitar cobros ni transferir fondos como parte de esta preparación.

## Inventario verificado 2026-11-26
Workspace destino: guadalupe-gomez-pezuela. La cuenta Connect original está registrada en ETERNI; la restricción única (provider,stripe_account_id) impide duplicar su conexión. La última sincronización registrada es de agosto de 2026; comprobar estado actual con autorización del titular antes de cualquier transición.

| Código histórico | Destino candidato | Bloqueo |
|---|---|---|
| eterni_faro_taller_g1_1199 | curso la-mujer-del-faro | borrador; validar equivalencia y precio |
| eterni_faro_taller_g2_1499 | curso la-mujer-del-faro | borrador; validar equivalencia y precio |
| eterni_faro_taller_g3_1799 | curso la-mujer-del-faro | borrador; validar equivalencia y precio |
| eterni_mujer_faro_webinar_450 | sin asignación automática | oferta histórica inactiva |
| eterni_legado_relato_3000 | curso el-legado-que-trasciende | borrador; definir derechos del paquete 1 |
| eterni_legado_libro_6800 | curso el-legado-que-trasciende | borrador; definir derechos del paquete 2 |
| eterni_cuentos_sanar_150 | biblioteca | sin registro de libro |
| eterni_audiolibro_cuentos_sanar_150 | audiolibro | sin registro verificado |
| eterni_libro_faro_250 | biblioteca | sin registro de libro |
| eterni_ixchel_mensual_650 | comunidad | definir vencimiento, renovación y cancelación |

## Condiciones previas a producción
1. Confirmar cuenta Stripe autorizada y estado LIVE sin crear cargos.
2. Resolver en Compás One la asociación de cuenta a workspace y la compatibilidad con eventos históricos y suscripciones existentes; no relajar la validación de cuenta.
3. Validar catálogo, moneda, precios y derechos exactos; nunca usar un precio enviado por el navegador.
4. Implementar destino independiente nicte-ha en el servidor; exigir pago confirmado, cuenta y workspace verificados, producto permitido y correo vinculado a identidad verificada.
5. Registrar procesamiento idempotente por identificador de compra/evento, con reintentos seguros. No otorgar acceso desde parámetros de retorno de Checkout.
6. Validar renovación, cancelación y reembolso sin revocar accesos legítimos adquiridos por otras vías.
7. Probar en entorno de pruebas pagos exitosos, fallidos, duplicados, reembolsos, eventos fuera de orden y aislamiento entre workspaces.
8. Publicar únicamente productos listos para entrega; mantener pendientes bloqueados.

No se realizaron cambios en Stripe ni se otorgaron accesos. Este documento no implementa un endpoint de pago.
