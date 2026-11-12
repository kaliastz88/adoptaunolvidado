// =============================================================================
// Panel → pestaña "Fotos"
//
// Todas las fotos del sitio que no son la ficha de un perro: fundadoras,
// finales felices, voluntarios, logos de aliados, videos de redes y merch.
// Cada álbum alimenta una página concreta del sitio, y lo dice en su
// descripción para que quien sube sepa dónde va a aparecer.
//
// Cada álbum declara qué campos usa. Una fundadora necesita nombre; un logo de
// aliado necesita enlace; una foto de la galería solo necesita pie de foto.
// Mostrar los tres campos siempre confunde más de lo que ayuda.
// =============================================================================

const ALBUMES = [
  {
    clave: 'portada', nombre: 'Portada', icono: 'image',
    donde: 'Inicio',
    ayuda: 'Las fotos grandes de la página de inicio. La primera va en el banner principal; la segunda y la tercera en el mosaico de abajo. Usa fotos horizontales, luminosas y con la cara del perrito bien visible. Si el álbum está vacío, se usan fotos de los perritos en adopción.',
    titulo: 'Descripción breve (para lectores de pantalla)', descripcion: null, enlace: null,
  },
  {
    clave: 'fundadoras', nombre: 'Fundadoras', icono: 'users',
    donde: 'Nuestra historia',
    ayuda: 'Una foto por fundadora. Aparecen en la página Nuestra historia con su nombre debajo.',
    titulo: 'Nombre', descripcion: 'Una frase sobre ella (opcional)', enlace: null,
  },
  {
    clave: 'historia', nombre: 'Nuestra historia', icono: 'book-heart',
    donde: 'Nuestra historia',
    ayuda: 'Fotos de rescates, del equipo o del día a día. Se muestran como galería en Nuestra historia.',
    titulo: 'Pie de foto (opcional)', descripcion: null, enlace: null,
  },
  {
    clave: 'finales', nombre: 'Finales felices', icono: 'party-popper',
    donde: 'Finales felices',
    ayuda: 'Perritos adoptados con su nueva familia. Úsalo para los que NO están en la pestaña Animales (por ejemplo, adopciones de antes del panel). Si el perrito sí está ahí, sube la foto en su ficha → «Foto con su nueva familia» y aparece sola.',
    titulo: 'Nombre del perrito', descripcion: 'Una frase de su nueva vida (opcional)', enlace: null,
  },
  {
    clave: 'voluntarios', nombre: 'Voluntarios y hogar temporal', icono: 'hand-heart',
    donde: 'Voluntario',
    ayuda: 'Fotos de voluntarios, paseos en el santuario y hogares temporales. Aparecen en la página Voluntario.',
    titulo: 'Pie de foto (opcional)', descripcion: null, enlace: null,
  },
  {
    clave: 'aliados', nombre: 'Logos de aliados', icono: 'handshake',
    donde: 'Aliados',
    ayuda: 'Logos de otras marcas aliadas. Aparecen en la página Aliados bajo «También nos acompañan». (El aliado destacado, The Pup Club, ya tiene su logo puesto.)',
    titulo: 'Nombre de la marca', descripcion: 'Qué hace por los rescatados (opcional)', enlace: 'Su Instagram o sitio web (opcional)',
  },
  {
    clave: 'redes', nombre: 'Videos de Instagram', icono: 'clapperboard',
    donde: 'Contacto',
    ayuda: 'Portada + enlace de los reels que quieres destacar (2 o 3 se ven mejor). Al hacer clic se abre el video en Instagram.',
    titulo: 'Título, ej. «Dorito, nuestro modelo estrella»', descripcion: 'Frase corta (opcional)', enlace: 'Enlace del reel',
  },
  {
    clave: 'merch', nombre: 'Tienda (merch)', icono: 'shopping-bag',
    donde: 'Tienda',
    ayuda: 'Tote bags, paliacates, placas... Por ahora la tienda dice «Próximamente»; cuando se conecte Shopify, el enlace de cada producto será su botón de compra.',
    titulo: 'Nombre del producto', descripcion: 'Descripción o precio (opcional)', enlace: 'Enlace de compra (cuando exista)',
  },
];

function vacia(album) {
  return { id: null, album, titulo: '', descripcion: '', enlace: '', photo: '', photo_path: '', photo_pos: '50% 50%', orden: 0 };
}

function SeccionFotos() {
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [albumSel, setAlbumSel] = React.useState(ALBUMES[0].clave);
  const [fotos, setFotos] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState('');

  const [form, setForm] = React.useState(null);
  const [guardando, setGuardando] = React.useState(false);
  const [errorForm, setErrorForm] = React.useState('');
  const [borrarTarget, setBorrarTarget] = React.useState(null);
  const [moviendo, setMoviendo] = React.useState(false);

  // Misma contabilidad de huérfanas que el formulario de animales: la foto se
  // sube al soltarla, antes de saber si vas a guardar o cancelar.
  const subidas = React.useRef([]);
  const previa = React.useRef('');

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const recargar = React.useCallback(async () => {
    setCargando(true); setError('');
    try { setFotos(await window.db.listFotos()); }
    catch (e) {
      // El mensaje más probable si nadie corrió el SQL todavía.
      setError(/site_photos/.test(e.message)
        ? 'Falta crear la tabla de fotos. Corre supabase/fotos-del-sitio.sql en el SQL Editor de Supabase.'
        : e.message);
    }
    finally { setCargando(false); }
  }, []);

  React.useEffect(() => { recargar(); }, [recargar]);

  const album = ALBUMES.find((a) => a.clave === albumSel);
  const delAlbum = fotos.filter((f) => f.album === albumSel);
  const cuantas = (clave) => fotos.filter((f) => f.album === clave).length;

  function abrirNueva() {
    const f = vacia(albumSel);
    // Al final de la lista: lo nuevo no debería empujar lo que ya estaba
    // acomodado.
    f.orden = delAlbum.length ? Math.max(...delAlbum.map((x) => x.orden || 0)) + 10 : 0;
    subidas.current = []; previa.current = '';
    setErrorForm(''); setForm(f);
  }

  function abrirEditar(f) {
    subidas.current = []; previa.current = f.photo_path || '';
    setErrorForm(''); setForm({ ...f });
  }

  function cerrar() {
    subidas.current.forEach((p) => window.db.deletePhoto(p));
    subidas.current = [];
    setForm(null);
  }

  async function guardar() {
    if (!form.photo) { setErrorForm('Falta la foto.'); return; }
    setGuardando(true); setErrorForm('');
    try {
      await window.db.guardarFoto(form);
      const conservada = form.photo_path;
      subidas.current.filter((p) => p !== conservada).forEach((p) => window.db.deletePhoto(p));
      if (previa.current && previa.current !== conservada) window.db.deletePhoto(previa.current);
      subidas.current = [];
      setForm(null);
      await recargar();
    } catch (e) { setErrorForm(e.message); }
    finally { setGuardando(false); }
  }

  async function borrar() {
    try {
      await window.db.borrarFoto(borrarTarget);
      setBorrarTarget(null);
      await recargar();
    } catch (e) { setError(e.message); setBorrarTarget(null); }
  }

  // Subir o bajar una foto. Se renumera todo el álbum de 10 en 10 para que el
  // orden quede limpio aunque antes hubiera empates.
  async function mover(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= delAlbum.length) return;
    const lista = delAlbum.slice();
    [lista[i], lista[j]] = [lista[j], lista[i]];
    setMoviendo(true); setError('');
    try {
      for (let k = 0; k < lista.length; k++) {
        if (lista[k].orden !== k * 10) await window.db.guardarFoto({ id: lista[k].id, orden: k * 10 });
      }
      await recargar();
    } catch (e) { setError(e.message); }
    finally { setMoviendo(false); }
  }

  return (
    <div>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Adopta un Olvidado · Admin</span>
      <h1 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '8px 0 6px' }}>Fotos del sitio</h1>
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 680 }}>
        Elige un álbum y sube fotos. Cada álbum aparece en una página del sitio. Las fotos de cada
        perrito (y la de su nueva familia) se suben en su ficha, en la pestaña Animales.
      </p>

      {error ? (
        <div style={{ background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-500)', color: 'var(--terracotta-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 20, font: 'var(--font-body-sm)' }}>{error}</div>
      ) : null}

      {/* Álbumes como tarjetas: con el conteo a la vista se nota qué falta. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12, marginBottom: 28 }}>
        {ALBUMES.map((a) => {
          const activo = a.clave === albumSel;
          return (
            <button key={a.clave} onClick={() => setAlbumSel(a.clave)} style={{
              textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)',
              padding: '14px 16px', borderRadius: 'var(--radius-md)',
              border: activo ? '2px solid var(--action-primary)' : '1.5px solid var(--border-default)',
              background: activo ? 'var(--surface-brand-soft)' : '#fff',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <i data-lucide={a.icono} style={{ width: 20, height: 20, color: 'var(--action-primary)' }} />
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{a.nombre}</span>
              <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>
                {cuantas(a.clave)} foto{cuantas(a.clave) === 1 ? '' : 's'} · página {a.donde}
              </span>
            </button>
          );
        })}
      </div>

      <section style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ maxWidth: 620 }}>
            <h2 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '0 0 6px' }}>{album.nombre}</h2>
            <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: 0 }}>{album.ayuda}</p>
          </div>
          <Button variant="cta" icon="plus" onClick={abrirNueva}>Agregar foto</Button>
        </div>

        {cargando ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando fotos...</p>
        ) : delAlbum.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)', border: '1.5px dashed var(--border-default)', borderRadius: 'var(--radius-md)' }}>
            Este álbum está vacío. Mientras tanto, la página muestra su contenido por defecto.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {delAlbum.map((f, i) => (
              <div key={f.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface-alt)' }}>
                <div style={{ height: 150, background: `${f.photo_pos || 'center'}/cover no-repeat url(${f.photo})` }} />
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', minHeight: 20, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.titulo || <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Sin título</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    {[
                      { icon: 'arrow-left', label: 'Mover antes', fn: () => mover(i, -1), off: i === 0 || moviendo },
                      { icon: 'arrow-right', label: 'Mover después', fn: () => mover(i, 1), off: i === delAlbum.length - 1 || moviendo },
                      { icon: 'pencil', label: 'Editar', fn: () => abrirEditar(f) },
                      { icon: 'trash-2', label: 'Eliminar', fn: () => setBorrarTarget(f), peligro: true },
                    ].map((b) => (
                      <button key={b.label} onClick={b.fn} disabled={b.off} aria-label={b.label} title={b.label} style={{
                        border: 'none', background: '#fff', width: 32, height: 32, borderRadius: 'var(--radius-pill)',
                        cursor: b.off ? 'default' : 'pointer', opacity: b.off ? 0.35 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: b.peligro ? 'var(--terracotta-600)' : 'var(--action-primary)',
                      }}>
                        <i data-lucide={b.icon} style={{ width: 15, height: 15 }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <FotoFormModal
        form={form} setForm={setForm} album={album}
        onClose={cerrar} onSave={guardar} guardando={guardando} error={errorForm}
        onUploadedPath={(p) => { subidas.current.push(p); }}
      />

      <ConfirmarBorrarFoto foto={borrarTarget} onCancel={() => setBorrarTarget(null)} onConfirm={borrar} />
    </div>
  );
}

function FotoFormModal({ form, setForm, album, onClose, onSave, guardando, error, onUploadedPath }) {
  const { Modal, Input, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const PhotoDropzone = window.PhotoDropzone;
  if (!form) return null;
  const set = (c, v) => setForm((f) => ({ ...f, [c]: v }));

  return (
    <Modal open={!!form} onClose={onClose} title={(form.id ? 'Editar foto · ' : 'Agregar foto · ') + album.nombre}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
        <PhotoDropzone
          value={form}
          etiqueta={album.clave === 'aliados' ? 'Logo' : album.clave === 'redes' ? 'Portada del video' : 'Foto'}
          onChange={(foto) => setForm((f) => ({ ...f, ...foto }))}
          onUploadedPath={onUploadedPath}
        />
        {album.titulo ? <Input label={album.titulo} value={form.titulo} onChange={(e) => set('titulo', e.target.value)} /> : null}
        {album.descripcion ? (
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{album.descripcion}</span>
            <textarea value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} rows={2}
              style={{ font: 'var(--font-body-base)', padding: '12px 16px', borderRadius: 'var(--radius-input)', border: '1.5px solid var(--border-default)', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
          </label>
        ) : null}
        {album.enlace ? <Input label={album.enlace} placeholder="https://..." value={form.enlace} onChange={(e) => set('enlace', e.target.value)} /> : null}
      </div>
      {error ? <div style={{ marginTop: 14, font: 'var(--font-body-sm)', color: 'var(--terracotta-600)' }}>{error}</div> : null}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <Button variant="primary" icon="check" onClick={onSave} disabled={guardando} style={{ flex: 1 }}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={guardando}>Cancelar</Button>
      </div>
    </Modal>
  );
}

function ConfirmarBorrarFoto({ foto, onCancel, onConfirm }) {
  const { Modal, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [borrando, setBorrando] = React.useState(false);
  async function confirmar() { setBorrando(true); try { await onConfirm(); } finally { setBorrando(false); } }
  return (
    <Modal open={!!foto} onClose={onCancel} title="¿Eliminar esta foto?">
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
        Se quita del sitio y se borra el archivo. No se puede deshacer.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="cta" icon="trash-2" onClick={confirmar} disabled={borrando} style={{ flex: 1 }}>
          {borrando ? 'Eliminando...' : 'Eliminar'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={borrando}>Cancelar</Button>
      </div>
    </Modal>
  );
}

window.SeccionFotos = SeccionFotos;
