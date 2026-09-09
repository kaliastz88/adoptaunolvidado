// =============================================================================
// Donaciones — montos y enlaces de cobro
//
// Este es el único archivo que hay que tocar para cambiar montos o conectar los
// pagos. Ni Home.jsx ni Donar.jsx tienen nada escrito a mano.
//
// CÓMO CONECTAR LOS PAGOS:
// Cada monto necesita su propio enlace de cobro creado en Mercado Pago, uno
// para el donativo único y otro para el mensual. Pega cada URL en su lugar de
// abajo. Mientras un enlace esté vacío, ese botón aparece desactivado con un
// aviso, en vez de fingir que funciona.
//
// Los enlaces de Mercado Pago son públicos por diseño: son la dirección de una
// página de cobro, no una credencial. Es seguro que estén en el repositorio.
//
// NUNCA se pide el número de tarjeta en este sitio. El botón lleva a la página
// de Mercado Pago, que es quien está certificada para cobrar. Si alguien alguna
// vez propone capturar la tarjeta aquí, la respuesta es no.
// =============================================================================

window.DONACIONES = {
  moneda: 'MXN',
  montos: [100, 250, 500, 1000],
  preseleccionado: 250,

  enlaces: {
    'Dona una vez': {
      100:  '',
      250:  '',
      500:  '',
      1000: '',
    },
    'Mensual': {
      100:  '',
      250:  '',
      500:  '',
      1000: '',
    },
  },

  // Se muestra debajo de los botones cuando el donativo mensual todavía no
  // tiene enlaces. Mercado Pago no habilita suscripciones en todas las cuentas.
  avisoMensualPendiente: 'El donativo mensual todavía no está disponible. Por ahora puedes apoyarnos con un donativo único.',
};
