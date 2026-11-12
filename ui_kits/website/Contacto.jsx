// Reels por defecto, de las notas de la fundadora. Si en el panel se suben
// videos al álbum «Videos de Instagram», esos reemplazan a estos (y pueden
// llevar portada).
const REELS_POR_DEFECTO = [
  { id: 'dorito', titulo: 'Dorito', descripcion: 'Nuestro modelo estrella', enlace: 'https://www.instagram.com/reel/DdmH_WhKQKA/' },
  { id: 'valiente', titulo: 'Valiente', descripcion: 'Uno de nuestros rescates más fuertes', enlace: 'https://www.instagram.com/reel/DKqJ-SNMRna/' },
  { id: 'pulga', titulo: 'Pulga', descripcion: 'Su historia — hoy en adopción', enlace: 'https://www.instagram.com/reel/Dcud6TrtX8A/' },
];

// Tarjeta vertical tipo reel. Sin portada se pinta con los colores de marca y
// un botón de play grande, para que igual se lea como «video» a la primera.
function TarjetaReel({ r, i }) {
  const fondos = [
    'linear-gradient(160deg, var(--blue-600), var(--blue-800))',
    'linear-gradient(160deg, var(--amber-500), var(--terracotta-400))',
    'linear-gradient(160deg, var(--blue-500), var(--blue-700))',
  ];
  const [hover, setHover] = React.useState(false);
  return (
    <a href={r.enlace || window.REDES.instagram} target="_blank" rel="noopener noreferrer"
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       aria-label={`Ver en Instagram: ${r.titulo}`}
       style={{
         position: 'relative', display: 'block', aspectRatio: '9 / 14', borderRadius: 'var(--radius-card)',
         overflow: 'hidden', textDecoration: 'none', color: '#fff',
         background: r.photo ? `${r.photo_pos || 'center'}/cover no-repeat url(${r.photo})` : fondos[i % fondos.length],
         boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
         transform: hover ? 'translateY(-5px)' : 'none', transition: 'var(--transition-hover)',
       }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(2,20,50,0.78) 100%)' }} />
      <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6, font: 'var(--font-caption)', fontWeight: 700 }}>
        <i data-lucide="instagram" style={{ width: 16, height: 16 }} /> Reel
      </div>
      <div style={{
        position: 'absolute', top: '42%', left: '50%', transform: `translate(-50%, -50%) scale(${hover ? 1.08 : 1})`,
        width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition-hover)',
      }}>
        <i data-lucide="play" style={{ width: 26, height: 26, color: 'var(--blue-600)', marginLeft: 4 }} />
      </div>
      <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18 }}>
        <div style={{ font: 'var(--font-h4)', color: '#fff' }}>{r.titulo}</div>
        {r.descripcion ? <div style={{ font: 'var(--font-body-sm)', color: 'rgba(255,255,255,0.88)', marginTop: 4 }}>{r.descripcion}</div> : null}
      </div>
    </a>
  );
}

function Contacto() {
  const { Seccion, useFotos } = window.UI;
  const { Input, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const album = useFotos('redes');
  const reels = album && album.length ? album : REELS_POR_DEFECTO;

  const correo = T('contacto.correo', '');
  const [form, setForm] = React.useState({ nombre: '', correo: '', mensaje: '' });
  const set = (c) => (e) => setForm((f) => ({ ...f, [c]: e.target.value }));

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  // El formulario no tiene servidor propio: antes se veía pero el mensaje se
  // perdía. Ahora abre el correo de quien escribe con todo ya rellenado, que
  // es honesto y llega seguro. Si no hay correo publicado, el formulario no
  // se muestra y queda solo el botón de Instagram.
  function enviar() {
    const asunto = `Mensaje desde la página — ${form.nombre || 'sin nombre'}`;
    const cuerpo = `${form.mensaje}\n\n${form.nombre}\n${form.correo}`;
    window.location.href = `mailto:${correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  }

  const datos = [
    { icon: 'instagram', label: 'Instagram', value: window.REDES.usuario, href: window.REDES.instagram },
    { icon: 'mail', label: 'Correo', value: correo, href: correo ? 'mailto:' + correo : '' },
    { icon: 'phone', label: 'Teléfono o WhatsApp', value: T('contacto.telefono', '') },
    { icon: 'map-pin', label: 'Ciudad', value: T('contacto.ciudad', 'Ciudad de México') },
  ].filter((c) => c.value);

  return (
    <Seccion tono="crema" ancho={1000}>
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 40px' }}>
        <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Contacto</span>
        <h1 style={{ font: 'var(--font-h1)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 16px' }}>Escríbenos, te respondemos.</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: 0 }}>
          {T('contacto.intro', 'Síguenos en nuestras redes y sé parte de esta comunidad que trabaja para cambiar sus vidas.')}
        </p>
      </div>

      {/* REDES — lo más llamativo de la página, como pidió la fundadora. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, maxWidth: 860, margin: '0 auto 24px' }}>
        {reels.slice(0, 3).map((r, i) => <TarjetaReel key={r.id} r={r} i={i} />)}
      </div>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <Button variant="primary" icon="instagram" onClick={() => window.open(window.REDES.instagram, '_blank', 'noopener')}>
          Síguenos en {window.REDES.usuario}
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center' }}>
        {correo ? (
          <div style={{ flex: '1 1 340px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 16, background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 28 }}>
            <Input label="Nombre completo" placeholder="Escribe tu nombre" value={form.nombre} onChange={set('nombre')} />
            <Input label="Correo" placeholder="tucorreo@email.com" value={form.correo} onChange={set('correo')} />
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>Mensaje</span>
              <textarea value={form.mensaje} onChange={set('mensaje')} rows={4} placeholder="¿En qué podemos ayudarte?"
                style={{ font: 'var(--font-body-base)', padding: '12px 16px', borderRadius: 'var(--radius-input)', border: '1.5px solid var(--border-default)', resize: 'vertical', fontFamily: 'var(--font-body)' }} />
            </label>
            <Button variant="primary" icon="send" onClick={enviar} disabled={!form.mensaje.trim()}>Enviar mensaje</Button>
          </div>
        ) : null}
        <div style={{ flex: '1 1 260px', minWidth: 240, maxWidth: correo ? undefined : 420, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {datos.map((c) => {
            const contenido = (
              <React.Fragment>
                <i data-lucide={c.icon} style={{ width: 20, height: 20, color: 'var(--action-primary)', flexShrink: 0 }} />
                <div>
                  <div style={{ font: 'var(--font-caption)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{c.label}</div>
                  <div style={{ font: 'var(--font-body-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{c.value}</div>
                </div>
              </React.Fragment>
            );
            const estilo = { display: 'flex', gap: 12, alignItems: 'center', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', padding: 16, textDecoration: 'none' };
            return c.href
              ? <a key={c.label} href={c.href} target={/^mailto:/.test(c.href) ? undefined : '_blank'} rel="noopener noreferrer" style={estilo}>{contenido}</a>
              : <div key={c.label} style={estilo}>{contenido}</div>;
          })}
          {!correo ? (
            <Button variant="primary" icon="send" onClick={() => window.open(window.enlaceMensajeInstagram ? window.enlaceMensajeInstagram() : window.REDES.instagram, '_blank', 'noopener')}>
              Mándanos un mensaje
            </Button>
          ) : null}
        </div>
      </div>
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Contacto };
