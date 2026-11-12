function Historias({ onSeeDog, onNavigate }) {
  const { Seccion, Encabezado, Tarjeta, useFotos } = window.UI;
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;

  // Dos fuentes para la misma cuadrilla:
  //   1. Los perros marcados "Adoptado" en el panel. Al cambiarle el estado a
  //      uno se mueve solo del catálogo a esta página.
  //   2. El álbum "Finales felices" de la pestaña Fotos, para los que se
  //      adoptaron antes de que existiera el panel y no tienen ficha.
  const [adoptados, setAdoptados] = React.useState(null);
  const album = useFotos('finales');

  React.useEffect(() => {
    let vivo = true;
    window.db.listAnimals()
      .then((todos) => { if (vivo) setAdoptados(todos.filter((a) => a.status === 'Adoptado')); })
      .catch(() => { if (vivo) setAdoptados([]); });
    return () => { vivo = false; };
  }, []);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  // La foto con su familia es la protagonista. Si todavía no la hay, se usa la
  // del rescate para que el perrito no se quede fuera.
  const deFichas = (adoptados || []).map((a) => ({
    id: 'a-' + a.id,
    nombre: a.name,
    nota: a.historia_final,
    foto: a.foto_familia || a.photo,
    pos: a.foto_familia ? a.foto_familia_pos : a.photo_pos,
    abrir: () => onSeeDog(a),
  }));
  const delAlbum = (album || []).map((f) => ({
    id: 'f-' + f.id, nombre: f.titulo, nota: f.descripcion, foto: f.photo, pos: f.photo_pos,
  }));
  const todos = [...deFichas, ...delAlbum];
  const cargando = adoptados === null || album === null;

  return (
    <Seccion tono="crema" ancho={1100}>
      <Encabezado
        centrado
        eyebrow="Finales felices"
        titulo={T('historias.titulo', 'Cada adopción cambia dos vidas.')}
        entrada={T('historias.intro', 'Historias que comenzaron con abandono y encontraron un hogar, una familia y una nueva oportunidad. Porque rescatar es solo el comienzo. Gracias a los que confían en nosotras.')}
      />

      <div style={{ marginTop: 48 }}>
        {cargando ? (
          <p style={{ font: 'var(--font-body-base)', color: 'var(--text-muted)', textAlign: 'center' }}>Cargando finales felices...</p>
        ) : todos.length === 0 ? (
          <Tarjeta style={{ padding: '48px 32px', textAlign: 'center' }}>
            <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: '0 0 20px' }}>
              Muy pronto verás aquí a cada perrito con su nueva familia.
            </p>
            <Button variant="primary" icon="paw-print" onClick={() => onNavigate('catalogo')}>
              Conoce a los que siguen esperando
            </Button>
          </Tarjeta>
        ) : (
          // La cuadrilla que pidió la fundadora: foto con la familia y el nombre
          // abajo. Fotos verticales porque la mayoría vienen del celular y un
          // rectángulo apaisado corta a la familia.
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
            {todos.map((p) => (
              <Tarjeta key={p.id} onClick={p.abrir}>
                <div style={{
                  aspectRatio: '4 / 5',
                  background: p.foto
                    ? `${p.pos || 'center'}/cover no-repeat url(${p.foto})`
                    : 'linear-gradient(120deg, var(--blue-100), var(--amber-50))',
                }} role="img" aria-label={p.nombre ? `${p.nombre} con su nueva familia` : 'Perrito adoptado con su familia'} />
                <div style={{ padding: '14px 16px 16px', textAlign: 'center' }}>
                  <div style={{ font: 'var(--font-h4)', color: 'var(--text-primary)' }}>{p.nombre}</div>
                  {p.nota ? (
                    <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '6px 0 0' }}>{p.nota}</p>
                  ) : null}
                </div>
              </Tarjeta>
            ))}
          </div>
        )}
      </div>

      {todos.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <p style={{ font: 'var(--font-h3)', color: 'var(--action-primary)', marginBottom: 20 }}>
            ¿Quieres ser parte del próximo final feliz?
          </p>
          <Button variant="primary" icon="paw-print" wag onClick={() => onNavigate('catalogo')}>Conoce a nuestros perritos</Button>
        </div>
      ) : null}
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Historias };
