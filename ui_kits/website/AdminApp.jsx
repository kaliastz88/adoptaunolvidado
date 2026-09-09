const SPECIES_OPTS = ['Perro', 'Gato'];
// Cinco niveles, no tres. Es lo que usa de verdad el equipo en su
// presentación de adoptables, donde abundan los 'Mediano-Grande' y los
// 'Media-Alta'. Con solo tres opciones habría que redondear y se perdería
// información real de cada perro.
const SIZE_OPTS = ['Pequeño', 'Pequeño-Mediano', 'Mediano', 'Mediano-Grande', 'Grande'];
const STATUS_OPTS = ['Disponible', 'En proceso', 'Adoptado'];
const ENERGY_OPTS = ['Baja', 'Media-Baja', 'Media', 'Media-Alta', 'Alta'];

function emptyForm() {
  return {
    id: null, name: '', species: 'Perro', age: '', size: 'Mediano',
    status: 'Disponible', energy: 'Media', compat: '', bio: '',
    salud: '', estatus_medico: '', photo: '', photo_path: '',
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
  //
  // Las solicitudes de adopción, en cambio, las ve cualquiera con acceso
  // aprobado: revisar quién quiere adoptar es el trabajo de todo el equipo.
  const esOwner = acceso.role === 'owner';
  const [seccion, setSeccion] = React.useState('Animales');
  const [nuevasSolicitudes, setNuevasSolicitudes] = React.useState(0);

  const PESTANAS = esOwner
    ? ['Animales', 'Solicitudes', 'Padrinos', 'Alianzas', 'Textos', 'Usuarios']
    : ['Animales', 'Solicitudes', 'Padrinos', 'Alianzas', 'Textos'];

  const [animals, setAnimals] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [errorCarga, setErrorCarga] = React.useState('');

  const [query, setQuery] = React.useState('');
  const [speciesFilter, setSpeciesFilter] = React.useState('Todas');
  const [statusFilter, setStatusFilter] = React.useState('Todos');

  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm());
  const [errorForm, setErrorForm] = React.useState('');
  const [guardando, setGuardando] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [borrando, setBorrando] = React.useState(false);
  const [cambiandoEstado, setCambiandoEstado] = React.useState('');
  const [cuentaAbierta, setCuentaAbierta] = React.useState(false);

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

  // El aviso de solicitudes sin revisar se cuenta al entrar, no al abrir la
  // pestaña, porque su razón de ser es que se note sin tener que ir a buscarlo.
  React.useEffect(() => {
    let vivo = true;
    window.db.listSolicitudes()
      .then((s) => { if (vivo) setNuevasSolicitudes(s.filter((x) => x.estado === 'nueva').length); })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

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

  // Cambio de estado desde la propia lista, sin abrir la ficha. Es lo que más
  // se hace y antes costaba cinco clics.
  async function cambiarEstado(a, status) {
    setCambiandoEstado(a.id);
    setErrorCarga('');
    try {
      await window.db.cambiarEstadoAnimal(a.id, status);
      setAnimals((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: status } : x)));
    } catch (e) {
      setErrorCarga(e.message);
    } finally {
      setCambiandoEstado('');
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
    const matchesStatus = statusFilter === 'Todos' || a.status === statusFilter;
    return matchesQuery && matchesSpecies && matchesStatus;
  });

  // El conteo por estado se saca de la lista completa, no de la filtrada: sirve
  // para saber cómo está el refugio, y cambiaría de sentido si dependiera del
  // filtro que se tenga puesto en ese momento.
  const conteo = { Disponible: 0, 'En proceso': 0, Adoptado: 0 };
  animals.forEach((a) => { if (conteo[a.status] !== undefined) conteo[a.status] += 1; });
  const hayFiltro = query || speciesFilter !== 'Todas' || statusFilter !== 'Todos';

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
          <button
            onClick={() => setCuentaAbierta(true)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--action-primary)', fontFamily: 'var(--font-body)' }}
          >
            Mi cuenta
          </button>
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
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Tabs options={PESTANAS} value={seccion} onChange={setSeccion} />
          {nuevasSolicitudes > 0 && seccion !== 'Solicitudes' ? (
            <Badge tone="warning" icon="mail">
              {nuevasSolicitudes === 1 ? '1 solicitud sin revisar' : `${nuevasSolicitudes} solicitudes sin revisar`}
            </Badge>
          ) : null}
        </div>

        {seccion === 'Usuarios' && esOwner ? <SeccionUsuarios yo={acceso} />
        : seccion === 'Textos' ? <SeccionTextos />
        : seccion === 'Padrinos' ? <SeccionPadrinos />
        : seccion === 'Alianzas' ? <SeccionAlianzas />
        : seccion === 'Solicitudes' ? <SeccionSolicitudes onContarNuevas={setNuevasSolicitudes} /> : (
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
          <Input label="Buscar" placeholder="Nombre del perrito..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select label="Especie" value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)} options={['Todas', ...SPECIES_OPTS]} />
          <Select label="Estado" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={['Todos', ...STATUS_OPTS]} />
          {hayFiltro ? (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button variant="ghost" icon="rotate-ccw"
                      onClick={() => { setQuery(''); setSpeciesFilter('Todas'); setStatusFilter('Todos'); }}>
                Limpiar
              </Button>
            </div>
          ) : null}
        </div>

        {!cargando ? (
          <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '0 0 14px' }}>
            {animals.length} en total · <b>{conteo.Disponible}</b> disponibles ·{' '}
            <b>{conteo['En proceso']}</b> en proceso · <b>{conteo.Adoptado}</b> adoptados
            {hayFiltro ? <span style={{ color: 'var(--text-muted)' }}> · viendo {filtered.length}</span> : null}
          </p>
        ) : null}

        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: COLUMNAS, gap: 12, padding: '14px 24px', background: 'var(--surface-alt)', font: 'var(--font-caption)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <span>Nombre</span><span>Especie</span><span>Edad</span><span>Tamaño</span><span>Energía</span><span>Estado</span><span>Acciones</span>
          </div>

          {cargando ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando animales...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              {animals.length === 0 ? 'Todavía no hay animales registrados. Empieza con «Agregar animal».' : 'Ningún perrito coincide con esos filtros.'}
            </div>
          ) : filtered.map((a) => (
            <div key={a.id} style={{ display: 'grid', gridTemplateColumns: COLUMNAS, gap: 12, padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-pill)', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundImage: a.photo ? `url(${a.photo})` : 'none', backgroundSize: 'cover', backgroundPosition: a.photo_pos || 'center' }}>
                  {!a.photo ? <i data-lucide={a.species === 'Gato' ? 'cat' : 'dog'} style={{ width: 18, height: 18, color: 'var(--blue-500)' }} /> : null}
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</span>
              </div>
              <span style={{ color: 'var(--text-secondary)', font: 'var(--font-body-sm)' }}>{a.species}</span>
              <span style={{ color: 'var(--text-secondary)', font: 'var(--font-body-sm)' }}>{a.age}</span>
              <span style={{ color: 'var(--text-secondary)', font: 'var(--font-body-sm)' }}>{a.size}</span>
              <span style={{ color: 'var(--text-secondary)', font: 'var(--font-body-sm)' }}>{a.energy}</span>
              <span>
                <select
                  value={a.status}
                  disabled={cambiandoEstado === a.id}
                  onChange={(e) => cambiarEstado(a, e.target.value)}
                  aria-label={`Estado de ${a.name}`}
                  style={{
                    font: 'var(--font-body-sm)', fontWeight: 600, fontFamily: 'var(--font-body)',
                    padding: '5px 8px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                    border: '1.5px solid var(--border-default)',
                    background: a.status === 'Adoptado' ? 'var(--status-success-bg)' : '#fff',
                    color: a.status === 'Adoptado' ? 'var(--sage-600)' : 'var(--text-primary)',
                    opacity: cambiandoEstado === a.id ? 0.5 : 1,
                  }}
                >
                  {STATUS_OPTS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </span>
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
      <MiCuentaModal
        open={cuentaAbierta}
        correo={acceso.email}
        onClose={() => setCuentaAbierta(false)}
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
// Solicitudes de adopción
//
// Las preguntas se declaran aquí igual que en el formulario público, para poder
// mostrarlas con su texto completo. Si se agrega una pregunta allá, hay que
// agregarla también en esta lista o no se verá en el panel.
// =============================================================================

const PREGUNTAS = [
  ['Tus datos', [
    ['edad', 'Edad'], ['ciudad', 'Ciudad y estado'],
  ]],
  ['Vivienda', [
    ['vivienda', '¿Dónde vive?'], ['propiedad', '¿Propia o rentada?'],
    ['permiso_renta', '¿Le permiten mascotas?'], ['patio', '¿Patio o jardín?'],
    ['protegido', '¿Ventanas y bardas protegidas?'],
  ]],
  ['Quiénes viven ahí', [
    ['personas', '¿Cuántas personas?'], ['ninos', '¿Niños y edades?'],
    ['acuerdo', '¿Todos de acuerdo?'], ['alergias', '¿Alergias?'],
  ]],
  ['Otras mascotas', [
    ['otras_mascotas', '¿Qué mascotas tiene?'], ['esterilizadas', '¿Esterilizadas y vacunadas?'],
    ['mascotas_antes', '¿Mascotas antes y qué pasó?'],
  ]],
  ['Compromiso', [
    ['responsable', '¿Quién se hará cargo?'], ['horas_solo', '¿Horas solo al día?'],
    ['donde_duerme', '¿Dónde dormiría?'], ['si_te_mudas', '¿Si se muda o viaja?'],
    ['gastos', '¿Puede cubrir gastos?'], ['esteriliza', '¿Se compromete a esterilizar?'],
    ['seguimiento', '¿Acepta seguimiento?'], ['motivo', '¿Por qué quiere adoptarlo?'],
  ]],
];

const ESTADOS_SOLICITUD = ['nueva', 'en revisión', 'aprobada', 'rechazada'];

function SeccionSolicitudes({ onContarNuevas }) {
  const { Button, Select, Badge } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [solicitudes, setSolicitudes] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState('');
  const [abierta, setAbierta] = React.useState(null);
  const [filtro, setFiltro] = React.useState('Todas');
  const [ocupada, setOcupada] = React.useState('');

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const recargar = React.useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const filas = await window.db.listSolicitudes();
      setSolicitudes(filas);
      onContarNuevas(filas.filter((s) => s.estado === 'nueva').length);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [onContarNuevas]);

  React.useEffect(() => { recargar(); }, [recargar]);

  async function cambiarEstado(s, estado) {
    setOcupada(s.id);
    setError('');
    try {
      await window.db.cambiarEstadoSolicitud(s.id, estado);
      await recargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setOcupada('');
    }
  }

  const tono = (e) => (e === 'aprobada' ? 'success' : e === 'nueva' ? 'warning' : e === 'rechazada' ? 'neutral' : 'info');
  const visibles = filtro === 'Todas' ? solicitudes : solicitudes.filter((s) => s.estado === filtro);

  if (cargando) {
    return <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)' }}>Cargando solicitudes...</p>;
  }

  return (
    <div>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Adopta un Olvidado · Admin</span>
      <h1 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '8px 0 6px' }}>Quién quiere adoptar</h1>
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 24 }}>
        Cada solicitud llega desde la ficha de un perro en el sitio. Los datos son personales,
        así que solo los ve el equipo con acceso aprobado.
      </p>

      {error ? (
        <div style={{ background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-500)', color: 'var(--terracotta-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 20, font: 'var(--font-body-sm)' }}>
          {error}
        </div>
      ) : null}

      <div style={{ marginBottom: 24, maxWidth: 260 }}>
        <Select label="Filtrar por estado" value={filtro} onChange={(e) => setFiltro(e.target.value)}
                options={['Todas', ...ESTADOS_SOLICITUD]} />
      </div>

      {visibles.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {solicitudes.length === 0
            ? 'Todavía no hay solicitudes. Aparecerán aquí en cuanto alguien llene el formulario desde el sitio.'
            : 'Ninguna solicitud con ese estado.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {visibles.map((s) => {
            const expandida = abierta === s.id;
            return (
              <article key={s.id} style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <div
                  onClick={() => setAbierta(expandida ? null : s.id)}
                  style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ font: 'var(--font-h4)', color: 'var(--text-primary)' }}>{s.nombre}</span>
                      <Badge tone={tono(s.estado)}>{s.estado}</Badge>
                    </div>
                    <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Quiere adoptar a <b>{s.animal_nombre || 'un animal'}</b> · {new Date(s.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)', marginTop: 2 }}>
                      {s.correo} · {s.telefono}
                    </div>
                  </div>
                  <span style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--action-primary)' }}>
                    {expandida ? 'Cerrar' : 'Ver respuestas'}
                  </span>
                </div>

                {expandida ? (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px', background: 'var(--surface-alt)' }}>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                      <a href={`mailto:${s.correo}`} style={{ textDecoration: 'none' }}>
                        <Button size="sm" variant="secondary" icon="mail">Escribirle</Button>
                      </a>
                      <a href={`tel:${s.telefono.replace(/\s/g, '')}`} style={{ textDecoration: 'none' }}>
                        <Button size="sm" variant="secondary" icon="phone">Llamarle</Button>
                      </a>
                      {ESTADOS_SOLICITUD.filter((e) => e !== s.estado && e !== 'nueva').map((e) => (
                        <Button key={e} size="sm" variant={e === 'aprobada' ? 'primary' : 'ghost'}
                                disabled={ocupada === s.id} onClick={() => cambiarEstado(s, e)}>
                          Marcar como {e}
                        </Button>
                      ))}
                    </div>

                    {PREGUNTAS.map(([grupo, campos]) => (
                      <div key={grupo} style={{ marginBottom: 20 }}>
                        <h3 style={{ font: 'var(--font-caption)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 10px' }}>{grupo}</h3>
                        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'minmax(180px, 260px) 1fr', gap: '8px 20px' }}>
                          {campos.map(([campo, pregunta]) => (
                            <React.Fragment key={campo}>
                              <dt style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)' }}>{pregunta}</dt>
                              <dd style={{ margin: 0, font: 'var(--font-body-sm)', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                                {s[campo] ? s[campo] : <span style={{ color: 'var(--text-muted)' }}>sin contestar</span>}
                              </dd>
                            </React.Fragment>
                          ))}
                        </dl>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Textos del sitio
//
// Solo se editan valores; la lista de textos editables la define el código, no
// esta pantalla. Por eso las políticas de la base permiten actualizar pero no
// insertar ni borrar: nadie puede inventar una clave desde aquí y esperar que
// el sitio la use.
// =============================================================================

function SeccionTextos() {
  const { Button, Input } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [textos, setTextos] = React.useState([]);
  const [borrador, setBorrador] = React.useState({});
  const [cargando, setCargando] = React.useState(true);
  const [guardando, setGuardando] = React.useState(false);
  const [error, setError] = React.useState('');
  const [guardado, setGuardado] = React.useState(false);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const recargar = React.useCallback(async () => {
    setCargando(true); setError('');
    try {
      const filas = await window.db.listTextos();
      setTextos(filas);
      const b = {};
      filas.forEach((f) => { b[f.clave] = f.valor; });
      setBorrador(b);
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);

  React.useEffect(() => { recargar(); }, [recargar]);

  // Solo se mandan los que cambiaron. Guardar los veinticinco en cada clic
  // sería lento y dejaría la fecha de modificación mintiendo sobre textos que
  // nadie tocó.
  const cambiados = textos.filter((t) => borrador[t.clave] !== t.valor);

  async function guardar() {
    setGuardando(true); setError(''); setGuardado(false);
    try {
      for (const t of cambiados) await window.db.guardarTexto(t.clave, borrador[t.clave]);
      await recargar();
      setGuardado(true);
    } catch (e) { setError(e.message); }
    finally { setGuardando(false); }
  }

  if (cargando) return <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)' }}>Cargando textos...</p>;

  const secciones = [];
  textos.forEach((t) => { if (!secciones.includes(t.seccion)) secciones.push(t.seccion); });

  return (
    <div>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Adopta un Olvidado · Admin</span>
      <h1 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '8px 0 6px' }}>Textos del sitio</h1>
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 640 }}>
        Cambia lo que dice el sitio sin tocar el código. Los cambios se ven en cuanto guardas.
        Si dejas un campo vacío, ese dato deja de aparecer en la página.
      </p>

      {error ? (
        <div style={{ background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-500)', color: 'var(--terracotta-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 20, font: 'var(--font-body-sm)' }}>{error}</div>
      ) : null}
      {guardado && cambiados.length === 0 ? (
        <div style={{ background: 'var(--status-success-bg)', color: 'var(--sage-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 20, font: 'var(--font-body-sm)', fontWeight: 600 }}>
          Guardado. Recarga el sitio para verlo.
        </div>
      ) : null}

      {secciones.map((sec) => (
        <section key={sec} style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 28, marginBottom: 20 }}>
          <h2 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '0 0 20px' }}>{sec}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {textos.filter((t) => t.seccion === sec).map((t) => {
              const cambio = borrador[t.clave] !== t.valor;
              const poner = (v) => setBorrador((b) => ({ ...b, [t.clave]: v }));
              return (
                <div key={t.clave}>
                  {t.multilinea ? (
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {t.etiqueta}{cambio ? ' ·' : ''}
                      </span>
                      <textarea value={borrador[t.clave]} onChange={(e) => poner(e.target.value)} rows={3}
                        style={{ font: 'var(--font-body-base)', padding: '12px 16px', borderRadius: 'var(--radius-input)',
                                 border: `1.5px solid ${cambio ? 'var(--action-primary)' : 'var(--border-default)'}`,
                                 resize: 'vertical', fontFamily: 'var(--font-body)' }} />
                    </label>
                  ) : (
                    <Input label={t.etiqueta + (cambio ? ' ·' : '')} value={borrador[t.clave]}
                           onChange={(e) => poner(e.target.value)} />
                  )}
                  {t.ayuda ? (
                    <span style={{ display: 'block', marginTop: 4, fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>{t.ayuda}</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* La barra se queda pegada abajo: la lista es larga y tener que subir
          hasta arriba para guardar es la forma más fácil de perder cambios. */}
      <div style={{ position: 'sticky', bottom: 0, background: 'var(--surface-page)', padding: '16px 0', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)' }}>
        <Button variant="primary" icon="check" onClick={guardar} disabled={guardando || cambiados.length === 0}>
          {guardando ? 'Guardando...' : cambiados.length === 0 ? 'Sin cambios' : `Guardar ${cambiados.length} cambio${cambiados.length === 1 ? '' : 's'}`}
        </Button>
        {cambiados.length > 0 ? (
          <Button variant="ghost" onClick={recargar} disabled={guardando}>Descartar</Button>
        ) : null}
      </div>
    </div>
  );
}

// =============================================================================
// Padrinos
// =============================================================================

const ESTADOS_PADRINO = ['nueva', 'en contacto', 'activo', 'cancelado'];

function SeccionPadrinos() {
  const { Button, Select, Badge } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [filas, setFilas] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState('');
  const [filtro, setFiltro] = React.useState('Todas');
  const [ocupada, setOcupada] = React.useState('');

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const recargar = React.useCallback(async () => {
    setCargando(true); setError('');
    try { setFilas(await window.db.listApadrinamientos()); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);

  React.useEffect(() => { recargar(); }, [recargar]);

  async function cambiar(a, estado) {
    setOcupada(a.id); setError('');
    try { await window.db.cambiarEstadoApadrinamiento(a.id, estado); await recargar(); }
    catch (e) { setError(e.message); }
    finally { setOcupada(''); }
  }

  const tono = (e) => (e === 'activo' ? 'success' : e === 'nueva' ? 'warning' : e === 'cancelado' ? 'neutral' : 'info');
  const visibles = filtro === 'Todas' ? filas : filas.filter((a) => a.estado === filtro);
  const activos = filas.filter((a) => a.estado === 'activo').length;

  if (cargando) return <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)' }}>Cargando padrinos...</p>;

  return (
    <div>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor)', textTransform: 'uppercase' }}>Adopta un Olvidado · Admin</span>
      <h1 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '8px 0 6px' }}>Quién apadrina a quién</h1>
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 24 }}>
        Cada apadrinamiento va ligado a un perro concreto, así se sabe a quién mandarle
        noticias de su ahijado.{activos > 0 ? ` Hay ${activos} apadrinamiento${activos === 1 ? '' : 's'} activo${activos === 1 ? '' : 's'}.` : ''}
      </p>

      {error ? (
        <div style={{ background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-500)', color: 'var(--terracotta-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 20, font: 'var(--font-body-sm)' }}>{error}</div>
      ) : null}

      <div style={{ marginBottom: 24, maxWidth: 260 }}>
        <Select label="Filtrar por estado" value={filtro} onChange={(e) => setFiltro(e.target.value)} options={['Todas', ...ESTADOS_PADRINO]} />
      </div>

      {visibles.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {filas.length === 0
            ? 'Todavía no hay apadrinamientos. Aparecerán aquí cuando alguien presione Apadrinar en la ficha de un perrito.'
            : 'Ninguno con ese estado.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {visibles.map((a) => (
            <article key={a.id} style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--font-h4)', color: 'var(--text-primary)' }}>{a.nombre}</span>
                    <Badge tone={tono(a.estado)}>{a.estado}</Badge>
                  </div>
                  <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Apadrina a <b>{a.animal_nombre || 'un rescatado'}</b> · {a.monto || 'monto por definir'}
                  </div>
                  <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)', marginTop: 2 }}>
                    {a.correo}{a.telefono ? ` · ${a.telefono}` : ''}{a.ciudad ? ` · ${a.ciudad}` : ''}
                  </div>
                  {a.mensaje ? (
                    <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-primary)', margin: '10px 0 0', whiteSpace: 'pre-wrap' }}>{a.mensaje}</p>
                  ) : null}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <a href={`mailto:${a.correo}`} style={{ textDecoration: 'none' }}>
                    <Button size="sm" variant="secondary" icon="mail">Escribirle</Button>
                  </a>
                  {ESTADOS_PADRINO.filter((e) => e !== a.estado && e !== 'nueva').map((e) => (
                    <Button key={e} size="sm" variant={e === 'activo' ? 'primary' : 'ghost'}
                            disabled={ocupada === a.id} onClick={() => cambiar(a, e)}>
                      {e === 'activo' ? 'Marcar activo' : e === 'cancelado' ? 'Cancelar' : 'En contacto'}
                    </Button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Alianzas con marcas
// =============================================================================

const ESTADOS_ALIANZA = ['nueva', 'en conversación', 'aliada', 'descartada'];

function SeccionAlianzas() {
  const { Button, Select, Badge } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [filas, setFilas] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState('');
  const [abierta, setAbierta] = React.useState(null);
  const [filtro, setFiltro] = React.useState('Todas');
  const [ocupada, setOcupada] = React.useState('');

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const recargar = React.useCallback(async () => {
    setCargando(true); setError('');
    try { setFilas(await window.db.listAlianzas()); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, []);

  React.useEffect(() => { recargar(); }, [recargar]);

  async function cambiar(a, estado) {
    setOcupada(a.id); setError('');
    try { await window.db.cambiarEstadoAlianza(a.id, estado); await recargar(); }
    catch (e) { setError(e.message); }
    finally { setOcupada(''); }
  }

  const tono = (e) => (e === 'aliada' ? 'success' : e === 'nueva' ? 'warning' : e === 'descartada' ? 'neutral' : 'info');
  const visibles = filtro === 'Todas' ? filas : filas.filter((a) => a.estado === filtro);

  if (cargando) return <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)' }}>Cargando alianzas...</p>;

  return (
    <div>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor)', textTransform: 'uppercase' }}>Adopta un Olvidado · Admin</span>
      <h1 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '8px 0 6px' }}>Marcas que quieren aliarse</h1>
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 24 }}>
        Cada propuesta llega desde el botón "Quiero aliarme como marca" del sitio.
      </p>

      {error ? (
        <div style={{ background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-500)', color: 'var(--terracotta-600)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 20, font: 'var(--font-body-sm)' }}>{error}</div>
      ) : null}

      <div style={{ marginBottom: 24, maxWidth: 260 }}>
        <Select label="Filtrar por estado" value={filtro} onChange={(e) => setFiltro(e.target.value)} options={['Todas', ...ESTADOS_ALIANZA]} />
      </div>

      {visibles.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {filas.length === 0
            ? 'Todavía no hay propuestas de alianza. Aparecerán aquí en cuanto una marca llene el formulario.'
            : 'Ninguna propuesta con ese estado.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {visibles.map((a) => {
            const abierto = abierta === a.id;
            return (
              <article key={a.id} style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
                <div onClick={() => setAbierta(abierto ? null : a.id)}
                     style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ font: 'var(--font-h4)', color: 'var(--text-primary)' }}>{a.marca}</span>
                      <Badge tone={tono(a.estado)}>{a.estado}</Badge>
                    </div>
                    <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
                      {a.contacto}{a.puesto ? `, ${a.puesto}` : ''} · {new Date(a.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)', marginTop: 2 }}>
                      {a.correo}{a.telefono ? ` · ${a.telefono}` : ''}
                    </div>
                  </div>
                  <span style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--action-primary)' }}>
                    {abierto ? 'Cerrar' : 'Ver propuesta'}
                  </span>
                </div>

                {abierto ? (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 24, background: 'var(--surface-alt)' }}>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                      <a href={`mailto:${a.correo}`} style={{ textDecoration: 'none' }}>
                        <Button size="sm" variant="secondary" icon="mail">Escribirle</Button>
                      </a>
                      {a.sitio ? (
                        <a href={/^https?:/.test(a.sitio) ? a.sitio : `https://${a.sitio.replace(/^@/, 'instagram.com/')}`}
                           target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Button size="sm" variant="secondary" icon="external-link">Ver su sitio</Button>
                        </a>
                      ) : null}
                      {ESTADOS_ALIANZA.filter((e) => e !== a.estado && e !== 'nueva').map((e) => (
                        <Button key={e} size="sm" variant={e === 'aliada' ? 'primary' : 'ghost'}
                                disabled={ocupada === a.id} onClick={() => cambiar(a, e)}>
                          Marcar como {e}
                        </Button>
                      ))}
                    </div>
                    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'minmax(160px, 220px) 1fr', gap: '8px 20px' }}>
                      {[['Giro', a.giro], ['Sitio o redes', a.sitio], ['Ciudad', a.ciudad],
                        ['Cómo quiere participar', a.formas], ['Su mensaje', a.mensaje]].map(([k, v]) => (
                        <React.Fragment key={k}>
                          <dt style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)' }}>{k}</dt>
                          <dd style={{ margin: 0, font: 'var(--font-body-sm)', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                            {v || <span style={{ color: 'var(--text-muted)' }}>sin contestar</span>}
                          </dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
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
          onChange={(foto) => setForm((f) => ({ ...f, ...foto }))}
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
        <Input label="Protocolo de salud" placeholder="Ej. Completo con vacunación y esterilización" value={form.salud} onChange={(e) => set('salud', e.target.value)} />
        <Input label="Estatus médico" placeholder="Ej. Saludable" value={form.estatus_medico} onChange={(e) => set('estatus_medico', e.target.value)} />

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

// Cambiar la propia contraseña, sin pasar por Supabase.
//
// Existe porque el resto del equipo nunca va a tener acceso al panel de
// Supabase, así que sin esto nadie más que la dueña podría cambiar la suya.
// Supabase toma la cuenta del token de sesión, no de un parámetro, así que
// desde aquí solo se puede cambiar la contraseña propia.
function MiCuentaModal({ open, correo, onClose }) {
  const { Modal, Input, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [nueva, setNueva] = React.useState('');
  const [repetir, setRepetir] = React.useState('');
  const [error, setError] = React.useState('');
  const [listo, setListo] = React.useState(false);
  const [guardando, setGuardando] = React.useState(false);

  function cerrar() {
    setNueva(''); setRepetir(''); setError(''); setListo(false);
    onClose();
  }

  async function guardar() {
    if (nueva.length < 8) { setError('La contraseña necesita al menos 8 caracteres.'); return; }
    if (nueva !== repetir) { setError('Las dos contraseñas no coinciden.'); return; }
    setGuardando(true);
    setError('');
    try {
      await window.db.cambiarMiContrasena(nueva);
      setListo(true);
      setNueva(''); setRepetir('');
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal open={open} onClose={cerrar} title="Mi cuenta">
      <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '0 0 18px' }}>
        Sesión iniciada como <b>{correo}</b>
      </p>

      {listo ? (
        <React.Fragment>
          <p style={{ font: 'var(--font-body-base)', color: 'var(--text-primary)', margin: '0 0 20px' }}>
            Tu contraseña quedó cambiada. Úsala la próxima vez que entres.
          </p>
          <Button variant="primary" icon="check" onClick={cerrar} style={{ width: '100%' }}>Listo</Button>
        </React.Fragment>
      ) : (
        <div
          onKeyDown={(e) => { if (e.key === 'Enter') guardar(); }}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <Input label="Nueva contraseña" type="password" placeholder="Al menos 8 caracteres"
                 value={nueva} onChange={(e) => setNueva(e.target.value)} />
          <Input label="Repite la nueva contraseña" type="password" placeholder="••••••••"
                 value={repetir} onChange={(e) => setRepetir(e.target.value)} />

          {error ? (
            <span style={{ font: 'var(--font-body-sm)', color: 'var(--terracotta-600)' }}>{error}</span>
          ) : null}

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <Button variant="primary" icon="key-round" onClick={guardar} disabled={guardando} style={{ flex: 1 }}>
              {guardando ? 'Guardando...' : 'Cambiar contraseña'}
            </Button>
            <Button variant="ghost" onClick={cerrar} disabled={guardando}>Cancelar</Button>
          </div>
        </div>
      )}
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
