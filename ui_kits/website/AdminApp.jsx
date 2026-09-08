const SPECIES_OPTS = ['Perro', 'Gato'];
const SIZE_OPTS = ['Pequeño', 'Mediano', 'Grande'];
const STATUS_OPTS = ['Disponible', 'En proceso', 'Adoptado'];
const ENERGY_OPTS = ['Baja', 'Media', 'Alta'];

function emptyForm() {
  return {
    id: null, name: '', species: 'Perro', age: '', size: 'Mediano',
    status: 'Disponible', energy: 'Media', compat: '', bio: '',
    photo: '', photo_path: '',
  };
}

// =============================================================================
// Raíz: decide qué pantalla toca según la sesión y el estado de la solicitud.
//
// Tener sesión no basta para entrar. Cualquiera puede registrarse, pero hasta
// que un owner apruebe la solicitud la persona solo ve la sala de espera. Esto
// es un espejo de lo que ya impone la base de datos: aunque alguien saltara
// esta pantalla, las políticas de seguridad le seguirían negando todo.
// =============================================================================

function AdminApp() {
  // undefined = todavía preguntando a Supabase, null = sin sesión, objeto = dentro.
  // La distinción importa: sin ella el formulario de login parpadea en cada
  // recarga antes de que Supabase confirme la sesión guardada.
  const [session, setSession] = React.useState(undefined);
  const [acceso, setAcceso] = React.useState(undefined);

  React.useEffect(() => {
    let vivo = true;
    window.db.getSession()
      .then((s) => { if (vivo) setSession(s || null); })
      .catch(() => { if (vivo) setSession(null); });
    const cancelar = window.db.onAuthChange((s) => { if (vivo) setSession(s || null); });
    return () => { vivo = false; cancelar(); };
  }, []);

  const revisarAcceso = React.useCallback(() => {
    if (!session) { setAcceso(undefined); return; }
    // Si la consulta falla, se asume sin acceso. Ante la duda, no se entra.
    window.db.miAcceso()
      .then((a) => setAcceso(a || null))
      .catch(() => setAcceso(null));
  }, [session]);

  React.useEffect(() => { revisarAcceso(); }, [revisarAcceso]);

  if (session === undefined) return <PantallaCarga />;
  if (session === null) return <LoginScreen />;
  if (acceso === undefined) return <PantallaCarga />;

  // Sin fila o pendiente son el mismo caso para quien espera: todavía no.
  if (!acceso || acceso.status === 'pendiente') {
    return <PantallaEnEspera correo={session.user.email} onReintentar={revisarAcceso} />;
  }
  if (acceso.status !== 'aprobado') {
    return <PantallaSinAcceso correo={session.user.email} />;
  }
  return <AdminPanel acceso={acceso} />;
}

function PantallaCarga() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-page)', font: 'var(--font-body-base)', color: 'var(--text-muted)',
      fontFamily: 'var(--font-body)',
    }}>
      Cargando...
    </div>
  );
}

// =============================================================================
// Pantallas de acceso
// =============================================================================

// Tarjeta centrada que comparten login, registro, sala de espera y rechazo.
function TarjetaAuth({ titulo, children }) {
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--surface-page)', padding: 24, fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        width: '100%', maxWidth: 420, background: '#fff', borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)', padding: 36,
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="../../assets/logo/adopta-un-olvidado-logo.png" alt="" style={{ height: 36, width: 36 }} />
          <span style={{ font: '700 18px var(--font-display)', color: 'var(--blue-600)' }}>{titulo}</span>
        </div>
        {children}
        <a href="index.html" style={{
          font: 'var(--font-body-sm)', color: 'var(--text-muted)', textAlign: 'center', textDecoration: 'none',
        }}>
          ← Volver al sitio
        </a>
      </div>
    </div>
  );
}

function LoginScreen() {
  const { Button, Input, Tabs } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [modo, setModo] = React.useState('Entrar');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [error, setError] = React.useState('');
  const [enviando, setEnviando] = React.useState(false);
  const [registrado, setRegistrado] = React.useState(false);

  const registrando = modo === 'Crear cuenta';

  function cambiarModo(m) {
    setModo(m);
    setError('');
    setPassword('');
    setPassword2('');
  }

  async function entrar() {
    if (!email.trim() || !password) { setError('Escribe tu correo y tu contraseña.'); return; }
    setEnviando(true);
    setError('');
    try {
      // No hace falta cambiar de pantalla aquí: onAuthChange en AdminApp
      // detecta la nueva sesión y vuelve a renderizar.
      await window.db.signIn(email.trim(), password);
    } catch (e) {
      setError(e.message);
      setEnviando(false);
    }
  }

  async function registrarse() {
    if (!email.trim()) { setError('Escribe tu correo.'); return; }
    if (password.length < 8) { setError('La contraseña necesita al menos 8 caracteres.'); return; }
    if (password !== password2) { setError('Las dos contraseñas no coinciden.'); return; }
    setEnviando(true);
    setError('');
    try {
      await window.db.signUp(email.trim(), password);
      // Supabase puede dejar la sesión abierta de una vez. Si eso pasa,
      // AdminApp detecta la sesión y muestra la sala de espera por su cuenta.
      // Este mensaje cubre el caso contrario.
      setRegistrado(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (registrado) {
    return (
      <TarjetaAuth titulo="Solicitud enviada">
        <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: 0 }}>
          Tu cuenta quedó creada y está esperando aprobación. Avísale a la persona
          que administra el panel para que te dé acceso.
        </p>
        <Button variant="ghost" onClick={() => { setRegistrado(false); cambiarModo('Entrar'); }}>
          Volver al inicio de sesión
        </Button>
      </TarjetaAuth>
    );
  }

  return (
    <TarjetaAuth titulo="Panel de administración">
      <Tabs options={['Entrar', 'Crear cuenta']} value={modo} onChange={cambiarModo} />

      <div
        onKeyDown={(e) => { if (e.key === 'Enter') (registrando ? registrarse() : entrar()); }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: 0 }}>
          {registrando
            ? 'Crea tu cuenta y pide acceso. Una persona del equipo tendrá que aprobarla antes de que puedas gestionar animales.'
            : 'Inicia sesión para gestionar los animales en adopción.'}
        </p>

        <Input label="Correo" type="email" placeholder="tu@correo.com"
               value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Contraseña" type="password" placeholder="••••••••"
               value={password} onChange={(e) => setPassword(e.target.value)} />
        {registrando ? (
          <Input label="Repite la contraseña" type="password" placeholder="••••••••"
                 value={password2} onChange={(e) => setPassword2(e.target.value)} />
        ) : null}

        {error ? (
          <span style={{ font: 'var(--font-body-sm)', color: 'var(--terracotta-600)' }}>{error}</span>
        ) : null}

        {registrando ? (
          <Button variant="primary" icon="user-plus" onClick={registrarse} disabled={enviando}>
            {enviando ? 'Creando cuenta...' : 'Pedir acceso'}
          </Button>
        ) : (
          <Button variant="primary" icon="log-in" onClick={entrar} disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </Button>
        )}
      </div>
    </TarjetaAuth>
  );
}

// Se muestra a quien ya tiene cuenta pero todavía no fue aprobado.
function PantallaEnEspera({ correo, onReintentar }) {
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return (
    <TarjetaAuth titulo="Esperando aprobación">
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: 0 }}>
        Tu cuenta <b>{correo}</b> ya está creada, pero todavía nadie le ha dado
        acceso al panel. Avísale a la persona que lo administra.
      </p>
      <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)', margin: 0 }}>
        Cuando te aprueben, vuelve a esta página y presiona el botón de abajo.
      </p>
      <Button variant="primary" icon="refresh-cw" onClick={onReintentar}>Ya me aprobaron, revisar</Button>
      <Button variant="ghost" onClick={() => window.db.signOut()}>Cerrar sesión</Button>
    </TarjetaAuth>
  );
}

// Se muestra a quien fue rechazado o a quien le revocaron el acceso.
function PantallaSinAcceso({ correo }) {
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return (
    <TarjetaAuth titulo="Sin acceso">
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: 0 }}>
        La cuenta <b>{correo}</b> no tiene acceso al panel. Si crees que es un
        error, escríbele a la persona que lo administra.
      </p>
      <Button variant="ghost" onClick={() => window.db.signOut()}>Cerrar sesión</Button>
    </TarjetaAuth>
  );
}

// =============================================================================
// Panel
// =============================================================================

function AdminPanel({ acceso }) {
  const { Button, Input, Select, Badge, Tabs } = window.AdoptaUnOlvidadoDesignSystem_167478;

  // La pestaña de usuarios solo existe para quien puede decidir accesos. No es
  // la protección real, que está en las políticas de la base: es evitar mostrar
  // una sección que de todos modos no funcionaría.
  const esOwner = acceso.role === 'owner';
  const [seccion, setSeccion] = React.useState('Animales');

  const [animals, setAnimals] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [errorCarga, setErrorCarga] = React.useState('');

  const [query, setQuery] = React.useState('');
  const [speciesFilter, setSpeciesFilter] = React.useState('Todas');

  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm());
  const [errorForm, setErrorForm] = React.useState('');
  const [guardando, setGuardando] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [borrando, setBorrando] = React.useState(false);

  // Contabilidad de fotos huérfanas. Cada foto se sube al soltarla, antes de
  // saber si vas a guardar o cancelar, así que hay que recordar cuáles quedaron
  // de sobra en cada caso y borrarlas del almacenamiento.
  //   subidas   → todo lo que se subió mientras el modal estuvo abierto
  //   fotoPrevia → la que ya tenía el animal al abrir el modal
  // En refs y no en estado porque solo se leen dentro de los manejadores.
  const subidas = React.useRef([]);
  const fotoPrevia = React.useRef('');

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const recargar = React.useCallback(async () => {
    setCargando(true);
    setErrorCarga('');
    try {
      setAnimals(await window.db.listAnimals());
    } catch (e) {
      setErrorCarga(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  React.useEffect(() => { recargar(); }, [recargar]);

  function openNew() {
    setForm(emptyForm());
    subidas.current = [];
    fotoPrevia.current = '';
    setErrorForm('');
    setModalOpen(true);
  }

  function openEdit(a) {
    // Copia, no la misma referencia del arreglo: el formulario se edita campo
    // por campo y no debe tocar la fila que ya está en pantalla.
    setForm({ ...a });
    subidas.current = [];
    fotoPrevia.current = a.photo_path || '';
    setErrorForm('');
    setModalOpen(true);
  }

  // Cancelar: ninguna de las fotos subidas en esta sesión quedó referenciada.
  function closeModal() {
    subidas.current.forEach((p) => window.db.deletePhoto(p));
    subidas.current = [];
    setModalOpen(false);
    setErrorForm('');
  }

  async function saveForm() {
    if (!form.name.trim()) { setErrorForm('El nombre es obligatorio.'); return; }
    setGuardando(true);
    setErrorForm('');
    try {
      await window.db.saveAnimal(form);

      // Ya está guardado: sobran las fotos subidas que no quedaron elegidas,
      // y la anterior si la reemplazaste o la quitaste.
      const conservada = form.photo_path;
      subidas.current
        .filter((p) => p !== conservada)
        .forEach((p) => window.db.deletePhoto(p));
      if (fotoPrevia.current && fotoPrevia.current !== conservada) {
        window.db.deletePhoto(fotoPrevia.current);
      }
      subidas.current = [];

      setModalOpen(false);
      await recargar();
    } catch (e) {
      setErrorForm(e.message);
    } finally {
      setGuardando(false);
    }
  }

  function confirmDelete(a) { setDeleteTarget(a); }

  async function doDelete() {
    setBorrando(true);
    try {
      await window.db.deleteAnimal(deleteTarget);
      setDeleteTarget(null);
      await recargar();
    } catch (e) {
      setErrorCarga(e.message);
      setDeleteTarget(null);
    } finally {
      setBorrando(false);
    }
  }

  const filtered = animals.filter((a) => {
    const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase());
    const matchesSpecies = speciesFilter === 'Todas' || a.species === speciesFilter;
    return matchesQuery && matchesSpecies;
  });

  const statusTone = (s) => (s === 'Disponible' ? 'success' : s === 'En proceso' ? 'warning' : 'neutral');
  const COLUMNAS = '1.4fr 0.8fr 0.8fr 0.8fr 0.9fr 1fr 0.8fr';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-page)', fontFamily: 'var(--font-body)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid var(--border-subtle)', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="../../assets/logo/adopta-un-olvidado-logo.png" alt="Adopta un Olvidado" style={{ height: 32, width: 32 }} />
          <span style={{ font: '700 18px var(--font-display)', color: 'var(--blue-600)' }}>Panel de administración</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)' }}>
            {acceso.email}{esOwner ? ' · dueña' : ''}
          </span>
          <a href="index.html" style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>← Volver al sitio</a>
          <button
            onClick={() => window.db.signOut()}
            style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px' }}>
        {esOwner ? (
          <div style={{ marginBottom: 28 }}>
            <Tabs options={['Animales', 'Usuarios']} value={seccion} onChange={setSeccion} />
          </div>
        ) : null}

        {esOwner && seccion === 'Usuarios' ? <SeccionUsuarios yo={acceso} /> : (
        <React.Fragment>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap', marginBottom: 28 }}>
          <div>
            <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Adopta un Olvidado · Admin</span>
            <h1 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '8px 0 0' }}>Perros y gatos registrados</h1>
          </div>
          <Button variant="cta" icon="plus" onClick={openNew}>Agregar animal</Button>
        </div>

        {errorCarga ? (
          <div style={{ background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-500)', color: 'var(--terracotta-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 20, font: 'var(--font-body-sm)' }}>
            {errorCarga}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
          <Input placeholder="Buscar por nombre..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)} options={['Todas', ...SPECIES_OPTS]} />
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: COLUMNAS, gap: 12, padding: '14px 24px', background: 'var(--surface-alt)', font: 'var(--font-caption)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <span>Nombre</span><span>Especie</span><span>Edad</span><span>Tamaño</span><span>Energía</span><span>Estado</span><span>Acciones</span>
          </div>

          {cargando ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando animales...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              {animals.length === 0 ? 'Todavía no hay animales registrados. Empieza con «Agregar animal».' : 'No hay resultados para esa búsqueda.'}
            </div>
          ) : filtered.map((a) => (
            <div key={a.id} style={{ display: 'grid', gridTemplateColumns: COLUMNAS, gap: 12, padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-pill)', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundImage: a.photo ? `url(${a.photo})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  {!a.photo ? <i data-lucide={a.species === 'Gato' ? 'cat' : 'dog'} style={{ width: 18, height: 18, color: 'var(--blue-500)' }} /> : null}
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</span>
              </div>
              <span style={{ color: 'var(--text-secondary)', font: 'var(--font-body-sm)' }}>{a.species}</span>
              <span style={{ color: 'var(--text-secondary)', font: 'var(--font-body-sm)' }}>{a.age}</span>
              <span style={{ color: 'var(--text-secondary)', font: 'var(--font-body-sm)' }}>{a.size}</span>
              <span style={{ color: 'var(--text-secondary)', font: 'var(--font-body-sm)' }}>{a.energy}</span>
              <span><Badge tone={statusTone(a.status)}>{a.status}</Badge></span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(a)} aria-label={`Editar a ${a.name}`} style={{ border: 'none', background: 'var(--surface-sunken)', width: 32, height: 32, borderRadius: 'var(--radius-pill)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--action-primary)' }}>
                  <i data-lucide="pencil" style={{ width: 15, height: 15 }} />
                </button>
                <button onClick={() => confirmDelete(a)} aria-label={`Eliminar a ${a.name}`} style={{ border: 'none', background: 'var(--surface-sunken)', width: 32, height: 32, borderRadius: 'var(--radius-pill)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--terracotta-600)' }}>
                  <i data-lucide="trash-2" style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
        </React.Fragment>
        )}
      </main>

      <AnimalFormModal
        open={modalOpen}
        form={form}
        setForm={setForm}
        onClose={closeModal}
        onSave={saveForm}
        guardando={guardando}
        error={errorForm}
        onUploadedPath={(p) => { subidas.current.push(p); }}
      />
      <ConfirmDeleteModal
        target={deleteTarget}
        borrando={borrando}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}

// =============================================================================
// Usuarios del panel — solo la dueña llega aquí
// =============================================================================

function SeccionUsuarios({ yo }) {
  const { Button, Badge } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [usuarios, setUsuarios] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState('');
  const [ocupado, setOcupado] = React.useState('');

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const recargar = React.useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setUsuarios(await window.db.listPanelUsers());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  React.useEffect(() => { recargar(); }, [recargar]);

  async function decidir(u, status) {
    setOcupado(u.user_id);
    setError('');
    try {
      await window.db.decidirAcceso(u.user_id, status);
      await recargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setOcupado('');
    }
  }

  const pendientes = usuarios.filter((u) => u.status === 'pendiente');
  const conAcceso = usuarios.filter((u) => u.status === 'aprobado');
  const sinAcceso = usuarios.filter((u) => u.status === 'rechazado');

  function Fila({ u, acciones }) {
    const esYo = u.user_id === yo.user_id;
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-pill)', background: 'var(--blue-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            color: 'var(--blue-500)', fontWeight: 700,
          }}>
            {(u.email || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {u.email}{esYo ? ' · tú' : ''}
            </div>
            <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)' }}>
              Se registró el {new Date(u.created_at).toLocaleDateString('es-MX')}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {u.role === 'owner' ? <Badge tone="info">Dueña</Badge> : null}
          {/* Nadie puede cambiarse el acceso a sí mismo. La base lo impide
              también, para que no dependa de que esta pantalla lo respete. */}
          {esYo ? (
            <span style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)' }}>Tu propia cuenta</span>
          ) : ocupado === u.user_id ? (
            <span style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)' }}>Guardando...</span>
          ) : acciones}
        </div>
      </div>
    );
  }

  function Bloque({ titulo, descripcion, filas, vacio }) {
    return (
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '0 0 4px' }}>{titulo}</h2>
        <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '0 0 14px' }}>{descripcion}</p>
        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
          {filas.length === 0
            ? <div style={{ padding: '28px 24px', textAlign: 'center', color: 'var(--text-muted)', font: 'var(--font-body-sm)' }}>{vacio}</div>
            : filas}
        </div>
      </section>
    );
  }

  if (cargando) {
    return <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)' }}>Cargando usuarios...</p>;
  }

  return (
    <div>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Adopta un Olvidado · Admin</span>
      <h1 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '8px 0 28px' }}>Quién puede usar el panel</h1>

      {error ? (
        <div style={{ background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-500)', color: 'var(--terracotta-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 20, font: 'var(--font-body-sm)' }}>
          {error}
        </div>
      ) : null}

      <Bloque
        titulo={`Solicitudes por revisar${pendientes.length ? ` (${pendientes.length})` : ''}`}
        descripcion="Personas que se registraron y todavía no pueden hacer nada. Aprueba solo a quien reconozcas."
        vacio="No hay solicitudes pendientes."
        filas={pendientes.map((u) => (
          <Fila key={u.user_id} u={u} acciones={
            <React.Fragment>
              <Button size="sm" variant="primary" icon="check" onClick={() => decidir(u, 'aprobado')}>Aprobar</Button>
              <Button size="sm" variant="ghost" onClick={() => decidir(u, 'rechazado')}>Rechazar</Button>
            </React.Fragment>
          } />
        ))}
      />

      <Bloque
        titulo="Con acceso"
        descripcion="Pueden agregar, editar y eliminar animales y sus fotos."
        vacio="Nadie tiene acceso todavía."
        filas={conAcceso.map((u) => (
          <Fila key={u.user_id} u={u} acciones={
            <Button size="sm" variant="ghost" icon="user-minus" onClick={() => decidir(u, 'rechazado')}>Quitar acceso</Button>
          } />
        ))}
      />

      <Bloque
        titulo="Sin acceso"
        descripcion="Cuentas rechazadas o a las que se les quitó el acceso. Pueden entrar, pero no ven ni cambian nada."
        vacio="No hay cuentas rechazadas."
        filas={sinAcceso.map((u) => (
          <Fila key={u.user_id} u={u} acciones={
            <Button size="sm" variant="ghost" icon="rotate-ccw" onClick={() => decidir(u, 'aprobado')}>Devolver acceso</Button>
          } />
        ))}
      />
    </div>
  );
}

// =============================================================================
// Formulario
// =============================================================================

function AnimalFormModal({ open, form, setForm, onClose, onSave, guardando, error, onUploadedPath }) {
  const { Modal, Input, Select, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const PhotoDropzone = window.PhotoDropzone;

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  return (
    <Modal open={open} onClose={onClose} title={form.id ? `Editar a ${form.name}` : 'Agregar animal'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
        <Input label="Nombre" placeholder="Ej. Sienna" value={form.name} onChange={(e) => set('name', e.target.value)} />

        <PhotoDropzone
          value={form}
          onChange={(foto) => setForm((f) => ({ ...f, photo: foto.photo, photo_path: foto.photo_path }))}
          onUploadedPath={onUploadedPath}
        />

        <div style={{ display: 'flex', gap: 12 }}>
          <Select label="Especie" value={form.species} onChange={(e) => set('species', e.target.value)} options={SPECIES_OPTS} />
          <Select label="Tamaño" value={form.size} onChange={(e) => set('size', e.target.value)} options={SIZE_OPTS} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Input label="Edad" placeholder="Ej. 2 años" value={form.age} onChange={(e) => set('age', e.target.value)} />
          <Select label="Energía" value={form.energy} onChange={(e) => set('energy', e.target.value)} options={ENERGY_OPTS} />
        </div>
        <Select label="Estado de adopción" value={form.status} onChange={(e) => set('status', e.target.value)} options={STATUS_OPTS} />
        <Input label="Compatibilidad" placeholder="Ej. Niños, otros perros" value={form.compat} onChange={(e) => set('compat', e.target.value)} />

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Biografía</span>
          <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={3} placeholder="Cuenta su historia..." style={{ font: 'var(--font-body-base)', padding: '12px 16px', borderRadius: 'var(--radius-input)', border: '1.5px solid var(--border-default)', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
        </label>
      </div>

      {error ? (
        <div style={{ marginTop: 14, font: 'var(--font-body-sm)', color: 'var(--terracotta-600)' }}>{error}</div>
      ) : null}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <Button variant="primary" icon="check" onClick={onSave} disabled={guardando} style={{ flex: 1 }}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={guardando}>Cancelar</Button>
      </div>
    </Modal>
  );
}

function ConfirmDeleteModal({ target, borrando, onCancel, onConfirm }) {
  const { Modal, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return (
    <Modal open={!!target} onClose={onCancel} title="¿Eliminar registro?">
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 20 }}>
        Se eliminará a <b>{target ? target.name : ''}</b> de la lista, junto con su foto. Esta acción no se puede deshacer.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="cta" icon="trash-2" onClick={onConfirm} disabled={borrando} style={{ flex: 1 }}>
          {borrando ? 'Eliminando...' : 'Eliminar'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={borrando}>Cancelar</Button>
      </div>
    </Modal>
  );
}

window.AdminApp = AdminApp;
