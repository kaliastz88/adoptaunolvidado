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
//   value          { photo, photo_path } del formulario
//   onChange       recibe { photo, photo_path } cuando cambia la foto
//   onUploadedPath se llama con la ruta de cada archivo recién subido, para que
//                  el padre pueda borrarlo si al final cancelas
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
      onChange(subida);
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
    onChange({ photo: '', photo_path: '' });
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
        onClick={tieneFoto ? undefined : abrirSelector}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onPaste={onPaste}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirSelector(); } }}
        tabIndex={0}
        role="button"
        aria-label={tieneFoto ? 'Reemplazar la foto de la mascota' : 'Subir la foto de la mascota'}
        style={{
          position: 'relative',
          height: 180,
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
            <img
              src={fotoActual}
              alt="Vista previa de la foto"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: uploading ? 0.45 : 1,
                transition: 'var(--transition-hover)',
              }}
            />
            {!uploading ? (
              <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); abrirSelector(); }}
                  style={estiloBotonSobreFoto}
                >
                  Reemplazar
                </button>
                <button
                  type="button"
                  onClick={quitar}
                  style={{ ...estiloBotonSobreFoto, color: 'var(--terracotta-600)' }}
                >
                  Quitar
                </button>
              </div>
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
