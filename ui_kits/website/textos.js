// =============================================================================
// Textos editables — el puente entre la base y las pantallas.
//
// Cada texto se pide con T('clave', 'texto por defecto'). El valor por defecto
// es el que está escrito en el código, así que si la base no carga, por lo que
// sea, el sitio se ve exactamente igual que si esta tabla no existiera.
//
// Eso es deliberado: la base MEJORA el sitio, no lo sostiene. Un sitio que se
// queda en blanco porque no cargó una tabla de textos es peor que uno que no
// se puede editar.
// =============================================================================

// No se pisa lo que ya hubiera: así el orden de carga de los scripts deja de
// importar, y unos textos ya puestos no se borran por volver a cargar esto.
window.TEXTOS = window.TEXTOS || {};

window.T = function (clave, porDefecto) {
  var v = window.TEXTOS[clave];
  // Cadena vacía cuenta como valor: significa "no publicar este dato", y es
  // justo lo que hace falta para el correo y el teléfono de contacto.
  return v === undefined || v === null ? porDefecto : v;
};
