/**
 * Adopta un Olvidado — recibe las solicitudes de la página y las escribe en
 * este Google Sheet. Cada solicitud nueva o cambiada llega aquí sola desde la
 * base de datos (Supabase). Instrucciones de instalación en LEEME.md.
 *
 * Pestañas que crea solas: «Adopciones», «Padrinos», «Alianzas».
 * Cada fila se identifica por la columna «id»: si la solicitud ya estaba, se
 * actualiza su fila (por ejemplo, cuando el equipo cambia el estado en el
 * panel); si es nueva, se agrega al final.
 */

// Debe ser IGUAL a la que se guarda en Supabase como 'sheets_secreto'.
// Cámbiala por una frase larga e inventada antes de publicar el script.
const SECRETO = 'CAMBIA-ESTA-CLAVE';

const PESTANAS = {
  adoption_requests: 'Adopciones',
  sponsorship_requests: 'Padrinos',
  ally_requests: 'Alianzas',
};

// Nombres de columna más claros para algunas claves técnicas.
const ENCABEZADOS = {
  created_at: 'fecha',
  animal_nombre: 'animal',
  animal_id: 'id del animal',
};

function doPost(e) {
  const datos = JSON.parse(e.postData.contents || '{}');
  if (datos.secreto !== SECRETO) return respuesta('clave incorrecta');

  const nombrePestana = PESTANAS[datos.tabla];
  if (!nombrePestana || !datos.fila || !datos.fila.id) return respuesta('datos incompletos');

  // Evita que dos solicitudes al mismo tiempo se escriban en la misma fila.
  const candado = LockService.getScriptLock();
  candado.waitLock(20000);
  try {
    const hoja = obtenerHoja(nombrePestana);
    if (datos.accion === 'borrar') {
      borrarFila(hoja, datos.fila.id);
    } else {
      guardarFila(hoja, datos.fila);
    }
  } finally {
    candado.releaseLock();
  }
  return respuesta('ok');
}

function obtenerHoja(nombre) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  return libro.getSheetByName(nombre) || libro.insertSheet(nombre);
}

function guardarFila(hoja, fila) {
  // Las claves en orden: id y fecha primero, el resto como vengan.
  const claves = ['id', 'created_at'].concat(Object.keys(fila).filter((k) => k !== 'id' && k !== 'created_at'));

  // Encabezados: se crean la primera vez y se agregan columnas si aparece un
  // campo nuevo en el formulario. Nunca se reordenan las que ya existen.
  let encabezados = hoja.getLastRow() > 0 ? hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0] : [];
  claves.forEach((k) => {
    const titulo = ENCABEZADOS[k] || k;
    if (encabezados.indexOf(titulo) === -1) encabezados.push(titulo);
  });
  hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight('bold');
  hoja.setFrozenRows(1);

  const valores = encabezados.map((titulo) => {
    const clave = Object.keys(ENCABEZADOS).find((k) => ENCABEZADOS[k] === titulo) || titulo;
    let v = fila[clave];
    if (v === null || v === undefined) return '';
    if (clave === 'created_at') return new Date(v);
    return typeof v === 'object' ? JSON.stringify(v) : v;
  });

  const filaExistente = buscarFila(hoja, fila.id);
  if (filaExistente) {
    hoja.getRange(filaExistente, 1, 1, valores.length).setValues([valores]);
  } else {
    hoja.appendRow(valores);
  }
}

function borrarFila(hoja, id) {
  const n = buscarFila(hoja, id);
  if (n) hoja.deleteRow(n);
}

function buscarFila(hoja, id) {
  if (hoja.getLastRow() < 2) return null;
  const ids = hoja.getRange(2, 1, hoja.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 2;
  }
  return null;
}

function respuesta(texto) {
  return ContentService.createTextOutput(texto);
}
