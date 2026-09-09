// =============================================================================
// CarruselPerritos — el bloque destacado de la portada.
//
// Antes era un recuadro con un ícono y el texto "pendiente material real". Ahora
// muestra a los perritos de verdad, uno tras otro, con un banner que dice si
// siguen esperando o si ya encontraron familia.
//
// Van todos, no solo los disponibles: los adoptados son la mejor prueba de que
// esto funciona, y verlos entre los que esperan es lo que convence a alguien de
// entrar al catálogo.
// =============================================================================

const CARRUSEL_MS = 4500;

function CarruselPerritos({ onSeeDog }) {
  const [perros, setPerros] = React.useState([]);
  const [i, setI] = React.useState(0);
  const [pausado, setPausado] = React.useState(false);

  React.useEffect(() => {
    let vivo = true;
    window.db.listAnimals()
      .then((todos) => {
        if (!vivo) return;
        // Se barajan para que la portada no muestre siempre a los mismos. Los
        // que llevan más tiempo esperando merecen aparecer igual que los nuevos.
        const mezclados = todos.slice();
        for (let k = mezclados.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [mezclados[k], mezclados[j]] = [mezclados[j], mezclados[k]];
        }
        setPerros(mezclados);
      })
      .catch(() => {});
    return () => { vivo = false; };
  }, []);

  // Hay gente a la que el movimiento automático le provoca mareo o le impide
  // leer. El navegador lo avisa y aquí se respeta: el carrusel no avanza solo,
  // pero las flechas siguen funcionando.
  const prefiereQuieto = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  React.useEffect(() => {
    if (pausado || prefiereQuieto || perros.length < 2) return;
    const t = setTimeout(() => setI((n) => (n + 1) % perros.length), CARRUSEL_MS);
    return () => clearTimeout(t);
  }, [i, pausado, prefiereQuieto, perros.length]);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const mover = (d) => setI((n) => (n + d + perros.length) % perros.length);

  const marco = {
    flex: '1 1 320px', minWidth: 280, maxWidth: 380, height: 420,
    borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)',
    position: 'relative', overflow: 'hidden',
  };

  if (perros.length === 0) {
    return (
      <div style={{ ...marco, background: 'linear-gradient(160deg, var(--blue-200), var(--terracotta-100))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--blue-700)' }}>
          <i data-lucide="dog" style={{ width: 48, height: 48 }} />
        </div>
      </div>
    );
  }

  const p = perros[i];
  const adoptado = p.status === 'Adoptado';
  const enProceso = p.status === 'En proceso';

  const banner = adoptado
    ? { texto: 'Ya tiene familia', fondo: 'var(--status-success)' }
    : enProceso
      ? { texto: 'En proceso de adopción', fondo: 'var(--action-sponsor)' }
      : { texto: 'Busca hogar', fondo: 'var(--action-cta)' };

  return (
    <div
      style={marco}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      aria-roledescription="carrusel"
      aria-label="Perritos de Adopta un Olvidado"
    >
      {/* Las fotos van todas montadas y se cruzan con opacidad. Cambiar el src
          de una sola etiqueta hace que la imagen parpadee en blanco mientras
          carga la siguiente. */}
      {perros.map((d, k) => (
        <div
          key={d.id}
          aria-hidden={k !== i}
          style={{
            position: 'absolute', inset: 0,
            background: d.photo
              ? `${d.photo_pos || 'center'}/cover no-repeat url(${d.photo})`
              : 'linear-gradient(160deg, var(--blue-200), var(--terracotta-100))',
            opacity: k === i ? 1 : 0,
            transition: 'opacity 600ms ease',
            // Solo se cargan la actual y sus vecinas: montar 69 fotos de golpe
            // haría que la portada tardara una eternidad en el celular.
            display: Math.abs(k - i) <= 1 || (i === 0 && k === perros.length - 1) || (i === perros.length - 1 && k === 0) ? 'block' : 'none',
          }}
        />
      ))}

      {/* Degradado para que el texto se lea sobre cualquier foto. */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 38%, transparent 62%)' }} />

      <span style={{
        position: 'absolute', top: 16, left: 16,
        background: banner.fondo, color: '#fff',
        font: 'var(--font-body-sm)', fontWeight: 700,
        padding: '7px 14px', borderRadius: 'var(--radius-pill)',
      }}>
        {banner.texto}
      </span>

      <button
        onClick={() => onSeeDog(p)}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          border: 'none', background: 'none', cursor: 'pointer',
          padding: '20px 20px 56px', textAlign: 'left', width: '100%',
          fontFamily: 'var(--font-body)', color: '#fff',
        }}
      >
        <div style={{ font: 'var(--font-h3)', color: '#fff' }}>{p.name}</div>
        <div style={{ font: 'var(--font-body-sm)', opacity: 0.9 }}>
          {[p.age, p.size].filter(Boolean).join(' · ')}
        </div>
        <span style={{ font: 'var(--font-body-sm)', fontWeight: 700, textDecoration: 'underline' }}>
          {adoptado ? 'Ver su historia' : `Conoce a ${p.name}`}
        </span>
      </button>

      <div style={{ position: 'absolute', right: 14, bottom: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ font: 'var(--font-caption)', color: '#fff', opacity: 0.85, marginRight: 4 }}>
          {i + 1} / {perros.length}
        </span>
        <button onClick={() => mover(-1)} aria-label="Perrito anterior" style={estiloFlecha}>
          <i data-lucide="chevron-left" style={{ width: 18, height: 18 }} />
        </button>
        <button onClick={() => mover(1)} aria-label="Siguiente perrito" style={estiloFlecha}>
          <i data-lucide="chevron-right" style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  );
}

const estiloFlecha = {
  width: 32, height: 32, borderRadius: '50%', border: 'none',
  background: 'rgba(255,255,255,0.92)', color: 'var(--blue-600)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

window.CarruselPerritos = CarruselPerritos;
