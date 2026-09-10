const TODAS_ESPECIES = 'Todas las especies';
const TODOS_TAMANOS = 'Todos los tamaños';

function Catalogo({ onSeeDog }) {
  const { Seccion, Encabezado, Tarjeta } = window.UI;
  const { Select, Button, DogCard } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [especie, setEspecie] = React.useState(TODAS_ESPECIES);
  const [tamano, setTamano] = React.useState(TODOS_TAMANOS);

  const [animales, setAnimales] = React.useState([]);
  const [cargando, setCargando] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let vivo = true;
    window.db.listAnimals()
      .then((filas) => { if (vivo) setAnimales(filas); })
      .catch((e) => { if (vivo) setError(e.message); })
      .finally(() => { if (vivo) setCargando(false); });
    return () => { vivo = false; };
  }, []);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  // Los filtros se aplican al cambiar el select. El botón ya no dispara la
  // búsqueda, solo limpia, porque la lista se actualiza sola.
  const filtrados = animales.filter((a) => {
    const okEspecie = especie === TODAS_ESPECIES || a.species === especie;
    const okTamano = tamano === TODOS_TAMANOS || a.size === tamano;
    return okEspecie && okTamano;
  });

  const hayFiltro = especie !== TODAS_ESPECIES || tamano !== TODOS_TAMANOS;

  function limpiar() {
    setEspecie(TODAS_ESPECIES);
    setTamano(TODOS_TAMANOS);
  }

  return (
    <Seccion tono="crema" ancho={1100}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Adopta</span>
      <h1 style={{ font: 'var(--font-h1)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '10px 0 8px' }}>{T('catalogo.titulo', 'Cada uno espera su segunda oportunidad')}</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 640 }}>{T('catalogo.subtitulo', 'Filtra por especie y tamaño para encontrar a tu nuevo compañero de vida.')}</p>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', background: '#fff', padding: 20, borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', marginBottom: 36 }}>
        <Select label="Especie" value={especie} onChange={(e) => setEspecie(e.target.value)} options={[TODAS_ESPECIES, 'Perro', 'Gato']} />
        <Select label="Tamaño" value={tamano} onChange={(e) => setTamano(e.target.value)} options={[TODOS_TAMANOS, 'Pequeño', 'Pequeño-Mediano', 'Mediano', 'Mediano-Grande', 'Grande']} />
        <Button variant="ghost" icon="rotate-ccw" onClick={limpiar} disabled={!hayFiltro}>Limpiar filtros</Button>
      </div>

      {error ? (
        <p style={{ font: 'var(--font-body-base)', color: 'var(--terracotta-600)' }}>
          No pudimos cargar el catálogo. {error}
        </p>
      ) : cargando ? (
        <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)' }}>Cargando animales...</p>
      ) : filtrados.length === 0 ? (
        <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)' }}>
          {animales.length === 0
            ? 'Todavía no hay animales publicados. Vuelve pronto.'
            : 'Ningún animal coincide con esos filtros.'}
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {filtrados.map((d) => (
            <DogCard
              key={d.id}
              name={d.name}
              age={d.age}
              size={d.size}
              photo={d.photo}
              photoPos={d.photo_pos}
              tone={d.status === 'Adoptado' ? 'adopted' : 'available'}
              onClick={() => onSeeDog(d)}
            />
          ))}
        </div>
      )}
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Catalogo };
