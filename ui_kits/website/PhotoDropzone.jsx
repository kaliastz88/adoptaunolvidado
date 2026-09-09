// =============================================================================
// PhotoDropzone — zona para arrastrar y soltar la foto de una mascota.
//
// Vive aquí y no dentro del design system porque agregarlo a components/
// obligaría a regenerar _ds_bundle.js, que es el archivo que el navegador
// realmente ejecuta. El formulario del panel ya usa este patrón con su
// <textarea> escrito directamente en línea.
//
// La subida ocurre al soltar el archivo, no al guardar el formulario, para que
// puedas ver la foto real antes de confirmar. La limpieza de las fotos que
// quedaron de sobra la coordina AdminApp, que es quien sabe si guardaste o
// cancelaste.
//
// Props:
//   value          { photo, photo_path, photo_pos } del formulario
//   onChange       recibe los campos de foto que cambiaron
//   onUploadedPath se llama con la ruta de cada archivo recién subido, para que
//                  el padre pueda borrarlo si al final cancelas
//
// SOBRE EL ENCUADRE:
// La tarjeta del catálogo recorta la foto a un rectángulo apaisado. Casi todas
// las fotos vienen del celular y son verticales, así que recortar desde el
// centro corta la cara del perro. Aquí se puede arrastrar la imagen para elegir
// qué parte se ve.
//
// No se recorta el archivo: se guarda dónde mirar. Recortar destruiría el resto
// de la foto y el error sería irreversible; guardar el punto de enfoque se
// puede corregir siempre.
// =============================================================================

// Íconos en SVG en vez de <i data-lucide>. Lucide reemplaza el nodo <i> por un
// <svg>, y aquí el contenido cambia muchas veces por segundo mientras arrastras;
// dejar que una librería externa mute nodos que React controla es pedir
// problemas. En SVG directo no hay conflicto.
function IconoSubir({ size = 34, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 13v8" />
      <path d="m8 17 4-4 4 4" />
      <path d="M20.9 18.4A5 5 0 0 0 18 9.5h-1.3A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function IconoAlerta({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

function PhotoDropzone({ value, onChange, onUploadedPath }) {
  const [dragging, setDragging] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [preview, setPreview] = React.useState('');

  // Encuadre: se guarda como par de porcentajes, igual que background-position.
  const pos = (value && value.photo_pos) || '50% 50%';
  const [px, py] = pos.split(/\s+/).map((v) => parseFloat(v) || 50);
  const [arrastrando, setArrastrando] = React.useState(false);
  const marcoRef = React.useRef(null);

  const inputRef = React.useRef(null);
  // Un contador en vez de un booleano: al arrastrar sobre un elemento hijo el
  // navegador dispara dragleave del padre y dragenter del hijo, y con un
  // booleano el resaltado parpadea sin parar.
  const profundidad = React.useRef(0);
  // Guardamos la URL local en una ref además del estado para poder liberarla
  // en la limpieza sin volver a suscribir el efecto.
  const previewRef = React.useRef('');

  const fotoActual = preview || (value && value.photo) || '';
  const tieneFoto = !!fotoActual;

  function liberarPreview() {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = '';
    }
  }

  React.useEffect(() => liberarPreview, []);

  function validar(file) {
    if (!file) return 'No se recibió ningún archivo.';
    if (!/^image\//.test(file.type)) return 'Ese archivo no es una imagen. Usa JPG, PNG o WebP.';
    const max = (window.db && window.db.MAX_BYTES) || 5 * 1024 * 1024;
    if (file.size > max) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      return `La imagen pesa ${mb} MB y el máximo son ${Math.round(max / 1024 / 1024)} MB.`;
    }
    return '';
  }

  async function recibirArchivo(file) {
    const problema = validar(file);
    if (problema) { setError(problema); return; }

    setError('');
    liberarPreview();
    const url = URL.createObjectURL(file);
    previewRef.current = url;
    setPreview(url);
    setUploading(true);

    try {
      const subida = await window.db.uploadPhoto(file);
      if (onUploadedPath) onUploadedPath(subida.photo_path);
      onChange({ ...subida, photo_pos: '50% 50%' });
      // A partir de aquí manda la URL real de Supabase, así que soltamos la local.
      liberarPreview();
      setPreview('');
    } catch (e) {
      setError('No se pudo subir la imagen. ' + e.message);
      liberarPreview();
      setPreview('');
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    profundidad.current = 0;
    setDragging(false);
    if (uploading) return;
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    recibirArchivo(file);
  }

  function onDragEnter(e) {
    e.preventDefault();
    profundidad.current += 1;
    setDragging(true);
  }

  function onDragLeave(e) {
    e.preventDefault();
    profundidad.current -= 1;
    if (profundidad.current <= 0) { profundidad.current = 0; setDragging(false); }
  }

  // Sin esto el navegador abre la imagen en una pestaña nueva en vez de soltarla.
  function onDragOver(e) { e.preventDefault(); }

  function onPaste(e) {
    const items = (e.clipboardData && e.clipboardData.files) || [];
    if (items.length) { e.preventDefault(); recibirArchivo(items[0]); }
  }

  function abrirSelector() {
    if (!uploading && inputRef.current) inputRef.current.click();
  }

  function quitar(e) {
    e.stopPropagation();
    liberarPreview();
    setPreview('');
    setError('');
    onChange({ photo: '', photo_path: '', photo_pos: '50% 50%' });
  }

  // Se apunta a lo que se quiere ver: donde caiga el dedo o el cursor, ese es el
  // punto de enfoque. La alternativa era arrastrar la imagen como un mapa, que
  // se siente mejor pero obliga a rastrear el desplazamiento y a lidiar con los
  // bordes. Apuntar es más directo y con fotos de perros basta.
  function moverEncuadre(e) {
    const marco = marcoRef.current;
    if (!marco) return;
    const r = marco.getBoundingClientRect();
    const nx = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    const ny = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
    onChange({ photo_pos: `${Math.round(nx)}% ${Math.round(ny)}%` });
  }

  function iniciarArrastre(e) {
    if (!tieneFoto || uploading) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setArrastrando(true);
    moverEncuadre(e);
  }

  function centrar(e) {
    e.stopPropagation();
    onChange({ photo_pos: '50% 50%' });
  }

  const borde = error
    ? 'var(--terracotta-500)'
    : dragging
      ? 'var(--action-primary)'
      : 'var(--border-default)';

  const fondo = dragging ? 'var(--blue-100)' : tieneFoto ? 'var(--surface-sunken)' : 'var(--surface-alt)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
        Foto
      </span>

      <div
        ref={marcoRef}
        onClick={tieneFoto ? undefined : abrirSelector}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onPaste={onPaste}
        onPointerDown={iniciarArrastre}
        onPointerMove={(e) => { if (arrastrando) moverEncuadre(e); }}
        onPointerUp={() => setArrastrando(false)}
        onPointerCancel={() => setArrastrando(false)}
        onKeyDown={(e) => {
          if (!tieneFoto && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); abrirSelector(); return; }
          // Con foto, las flechas mueven el encuadre. Es la única forma de
          // ajustarlo sin ratón.
          const paso = 5;
          const mover = { ArrowUp: [0, -paso], ArrowDown: [0, paso], ArrowLeft: [-paso, 0], ArrowRight: [paso, 0] }[e.key];
          if (tieneFoto && mover) {
            e.preventDefault();
            onChange({ photo_pos: `${Math.min(100, Math.max(0, px + mover[0]))}% ${Math.min(100, Math.max(0, py + mover[1]))}%` });
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={tieneFoto ? 'Arrastra para encuadrar la foto, o usa las flechas' : 'Subir la foto de la mascota'}
        style={{
          position: 'relative',
          aspectRatio: '260 / 200',
          minHeight: 160,
          borderRadius: 'var(--radius-input)',
          border: `2px dashed ${borde}`,
          background: fondo,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 16,
          cursor: uploading ? 'progress' : tieneFoto ? 'default' : 'pointer',
          overflow: 'hidden',
          transition: 'var(--transition-hover)',
        }}
      >
        {tieneFoto ? (
          <React.Fragment>
            {/* El marco tiene la misma proporción que la tarjeta del catálogo,
                así que lo que se ve aquí es exactamente lo que se verá ahí. */}
            <img
              src={fotoActual}
              alt="Vista previa de la foto"
              draggable={false}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: `${px}% ${py}%`,
                opacity: uploading ? 0.45 : 1,
                cursor: 'crosshair',
                transition: arrastrando ? 'none' : 'var(--transition-hover)',
              }}
            />
            {!uploading ? (
              <React.Fragment>
                <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); abrirSelector(); }}
                    style={estiloBotonSobreFoto}
                  >
                    Reemplazar
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={centrar}
                    style={estiloBotonSobreFoto}
                  >
                    Centrar
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={quitar}
                    style={{ ...estiloBotonSobreFoto, color: 'var(--terracotta-600)' }}
                  >
                    Quitar
                  </button>
                </div>
                <span style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  padding: '6px 10px', background: 'rgba(0,0,0,0.55)', color: '#fff', textAlign: 'center',
                  fontSize: 'var(--text-2xs)', pointerEvents: 'none',
                }}>
                  Toca la parte que quieres mostrar · {px}% {py}%
                </span>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <IconoSubir color={dragging ? 'var(--action-primary)' : 'var(--blue-400)'} />
            <span style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {dragging ? 'Suelta la foto aquí' : 'Arrastra una foto aquí'}
            </span>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              o haz clic para elegir · JPG, PNG o WebP · hasta 5 MB
            </span>
          </div>
        )}

        {uploading ? (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, background: 'rgba(255,255,255,0.55)',
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              border: '2.5px solid var(--blue-200)',
              borderTopColor: 'var(--action-primary)',
              animation: 'adopta-spin 0.7s linear infinite',
            }} />
            <span style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--action-primary)' }}>
              Subiendo...
            </span>
          </div>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files && e.target.files[0];
            // Se limpia el valor para que elegir el mismo archivo dos veces
            // seguidas vuelva a disparar el change.
            e.target.value = '';
            recibirArchivo(f);
          }}
          style={{ display: 'none' }}
        />
      </div>

      {error ? (
        <span style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 'var(--text-2xs)', color: 'var(--terracotta-600)',
        }}>
          <IconoAlerta color="var(--terracotta-600)" />
          {error}
        </span>
      ) : null}
    </div>
  );
}

const estiloBotonSobreFoto = {
  border: 'none',
  background: 'rgba(255,255,255,0.94)',
  color: 'var(--action-primary)',
  font: 'var(--font-body-sm)',
  fontWeight: 700,
  padding: '8px 16px',
  borderRadius: 'var(--radius-pill)',
  cursor: 'pointer',
  boxShadow: 'var(--shadow-card)',
};

// La animación del indicador de carga necesita un @keyframes, y el proyecto no
// tiene hoja de estilos donde escribirlo. Se inyecta una sola vez.
if (!document.getElementById('adopta-spin-keyframes')) {
  const s = document.createElement('style');
  s.id = 'adopta-spin-keyframes';
  s.textContent = '@keyframes adopta-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}

window.PhotoDropzone = PhotoDropzone;
