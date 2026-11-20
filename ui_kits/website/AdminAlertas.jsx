// =============================================================================
// Panel → «Alertas»: registro interno de adoptantes con malas experiencias.
//
// Pedido de la fundadora (nov 2026): tener en un solo lugar a las personas con
// las que una adopción no salió bien, para no volver a entregarles un animal.
//
// SOLO USO INTERNO. Nada de esto se muestra en el sitio público ni se comparte
// con otros grupos: compartir datos personales con terceros sin consentimiento
// tiene implicaciones legales en México, y eso debe revisarlo un abogado antes.
//
// Cómo ayuda en el día a día: cuando llega una solicitud de adopción cuyo correo
// o teléfono coincide con alguien de esta lista, la solicitud se marca en rojo
// en la pestaña Solicitudes, con el motivo a la vista.
// =============================================================================

// Comparar sin que importen mayúsculas, espacios, guiones o la lada: los
// teléfonos se comparan por sus últimos 10 dígitos.
function normCorreo(c) { return String(c || '').trim().toLowerCase(); }
function normTel(t) { const d = String(t || '').replace(/\D/g, ''); return d.length >= 8 ? d.slice(-10) : ''; }

// Devuelve la alerta que coincide con una solicitud, o null.
function buscarAlerta(alertas, s) {
  if (!alertas || !s) return null;
  const c = normCorreo(s.correo);
  const t = normTel(s.telefono);
  return alertas.find((a) => (c && normCorreo(a.correo) === c) || (t && normTel(a.telefono) === t)) || null;
}

// Carga la lista una vez. Si la tabla todavía no existe (falta correr el SQL),
// devuelve [] y el resto del panel funciona igual.
function useAlertas() {
  const [alertas, setAlertas] = React.useState([]);
  const [faltaTabla, setFaltaTabla] = React.useState(false);
  const recargar = React.useCallback(() => {
    return window.db.listAlertas()
      .then((a) => { setAlertas(a || []); setFaltaTabla(false); })
      .catch((e) => { setAlertas([]); setFaltaTabla(/adopter_alerts/.test(e.message)); });
  }, []);
  React.useEffect(() => { recargar(); }, [recargar]);
  return { alertas, faltaTabla, recargar };
}

function alertaVacia(desde) {
  return {
    id: null,
    nombre: (desde && desde.nombre) || '',
    correo: (desde && desde.correo) || '',
    telefono: (desde && desde.telefono) || '',
    motivo: '',
    solicitud_id: (desde && desde.solicitud_id) || '',
  };
}

// Formulario para agregar o editar. Lo usan esta pestaña y el botón
// «Agregar a alertas» de cada solicitud.
function AlertaFormModal({ form, setForm, onClose, onGuardado }) {
  const { Modal, Input, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [guardando, setGuardando] = React.useState(false);
  const [error, setError] = React.useState('');
  if (!form) return null;
  const set = (c, v) => setForm((f) => ({ ...f, [c]: v }));

  async function guardar() {
    if (!form.nombre.trim()) return setError('Escribe el nombre.');
    if (!form.correo.trim() && !form.telefono.trim()) return setError('Escribe al menos un correo o un teléfono, para poder reconocerla si vuelve a escribir.');
    if (!form.motivo.trim()) return setError('Describe qué pasó.');
    setGuardando(true); setError('');
    try { await window.db.guardarAlerta(form); onGuardado(); }
    catch (e) { setError(e.message); }
    finally { setGuardando(false); }
  }

  return (
    <Modal open onClose={onClose} title={form.id ? 'Editar alerta' : 'Agregar a alertas'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '62vh', overflowY: 'auto', paddingRight: 4 }}>
        <Input label="Nombre" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
        <Input label="Correo" value={form.correo} onChange={(e) => set('correo', e.target.value)} />
        <Input label="Teléfono" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>¿Qué pasó?</span>
          <textarea value={form.motivo} onChange={(e) => set('motivo', e.target.value)} rows={4} maxLength={2000}
            placeholder="Describe los hechos con fecha, sin calificativos. Ej. «Marzo 2026: devolvió a Luna a las 2 semanas; no respondió al seguimiento.»"
            style={{ font: 'var(--font-body-base)', padding: '12px 16px', borderRadius: 'var(--radius-input)', border: '1.5px solid var(--border-default)', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
        </label>
        <p style={{ font: 'var(--font-caption)', color: 'var(--text-secondary)', margin: 0 }}>
          Anota solo hechos verificables. Esta información es personal y solo la ve el equipo.
        </p>
      </div>
      {error ? <div style={{ marginTop: 14, font: 'var(--font-body-sm)', color: 'var(--status-error)' }}>{error}</div> : null}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <Button variant="primary" icon="check" onClick={guardar} disabled={guardando} style={{ flex: 1 }}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={guardando}>Cancelar</Button>
      </div>
    </Modal>
  );
}

function SeccionAlertas() {
  const { Button, Input } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const { alertas, faltaTabla, recargar } = useAlertas();
  const [form, setForm] = React.useState(null);
  const [busca, setBusca] = React.useState('');
  const [borrar, setBorrar] = React.useState(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const q = busca.trim().toLowerCase();
  const visibles = !q ? alertas : alertas.filter((a) =>
    [a.nombre, a.correo, a.telefono, a.motivo].some((v) => String(v || '').toLowerCase().includes(q))
    || (normTel(q) && normTel(a.telefono) === normTel(q)));

  async function confirmarBorrar() {
    try { await window.db.borrarAlerta(borrar.id); setBorrar(null); recargar(); }
    catch (e) { setError(e.message); setBorrar(null); }
  }

  return (
    <div>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Adopta un Olvidado · Admin</span>
      <h1 style={{ font: 'var(--font-h2)', color: 'var(--text-primary)', margin: '8px 0 6px' }}>Alertas de adoptantes</h1>
      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', marginBottom: 8, maxWidth: 700 }}>
        Personas con las que una adopción no salió bien. Si alguna vuelve a mandar una solicitud
        con el mismo correo o teléfono, la verás marcada en rojo en <b>Solicitudes</b>.
      </p>
      <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 700 }}>
        Solo para uso interno del equipo: no se publica ni se comparte con otros grupos.
      </p>

      {faltaTabla ? (
        <div style={{ background: 'var(--status-warning-bg)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 20, font: 'var(--font-body-sm)', color: 'var(--text-primary)' }}>
          Falta crear la tabla de alertas. Corre <b>supabase/evolutivos-noviembre.sql</b> en el SQL Editor de Supabase.
        </div>
      ) : null}
      {error ? <div style={{ background: 'var(--status-error-bg)', color: 'var(--status-error)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 20, font: 'var(--font-body-sm)' }}>{error}</div> : null}

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ flex: '1 1 280px' }}>
          <Input label="Buscar por nombre, correo o teléfono" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <Button variant="cta" icon="plus" onClick={() => setForm(alertaVacia())} disabled={faltaTabla}>Agregar alerta</Button>
      </div>

      {visibles.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {alertas.length === 0 ? 'No hay nadie en la lista. Ojalá siga así.' : 'Nadie coincide con esa búsqueda.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visibles.map((a) => (
            <article key={a.id} style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '18px 22px', borderLeft: '4px solid var(--status-error)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ font: 'var(--font-h4)', color: 'var(--text-primary)' }}>{a.nombre}</div>
                  <div style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {[a.correo, a.telefono].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="ghost" icon="pencil" onClick={() => setForm({ ...a, solicitud_id: a.solicitud_id || '' })}>Editar</Button>
                  <Button size="sm" variant="ghost" icon="trash-2" onClick={() => setBorrar(a)}>Quitar</Button>
                </div>
              </div>
              <p style={{ font: 'var(--font-body-base)', color: 'var(--text-primary)', margin: '12px 0 6px', whiteSpace: 'pre-wrap' }}>{a.motivo}</p>
              <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
                Registrada el {new Date(a.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                {a.registrado_por ? ` por ${a.registrado_por}` : ''}
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertaFormModal form={form} setForm={setForm} onClose={() => setForm(null)} onGuardado={() => { setForm(null); recargar(); }} />

      {borrar ? (() => {
        const { Modal, Button: B } = window.AdoptaUnOlvidadoDesignSystem_167478;
        return (
          <Modal open onClose={() => setBorrar(null)} title="¿Quitar de la lista?">
            <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
              {borrar.nombre} dejará de marcarse en las solicitudes. No se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <B variant="primary" onClick={confirmarBorrar} style={{ flex: 1 }}>Quitar</B>
              <B variant="ghost" onClick={() => setBorrar(null)}>Cancelar</B>
            </div>
          </Modal>
        );
      })() : null}
    </div>
  );
}

window.SeccionAlertas = SeccionAlertas;
window.AlertaFormModal = AlertaFormModal;
window.useAlertas = useAlertas;
window.buscarAlerta = buscarAlerta;
window.alertaVacia = alertaVacia;
