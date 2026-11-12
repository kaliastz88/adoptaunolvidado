// =============================================================================
// Tienda — merch de Adopta un Olvidado.
//
// Por ahora solo se muestra, con «Próximamente». La idea es conectarla a
// Shopify más adelante: cada producto del álbum «Tienda (merch)» del panel ya
// tiene un campo de enlace. En cuanto ese enlace exista (por ejemplo, el link
// del producto en Shopify o un botón de compra), la tarjeta cambia sola de
// «Próximamente» a «Comprar». No hay que tocar código para eso.
// =============================================================================

// Lo que la fundadora mencionó. Se muestran hasta que suban fotos reales.
const MERCH_POR_DEFECTO = [
  { id: 'tote', titulo: 'Tote bags', descripcion: 'Para llevar a todos lados un recordatorio de que adoptar cambia vidas.', icono: 'shopping-bag' },
  { id: 'paliacate', titulo: 'Paliacates', descripcion: 'Para tu perrito, para ti, o para los dos.', icono: 'shirt' },
  { id: 'placas', titulo: 'Placas para perritos', descripcion: 'Muy pronto: placas de identificación con el sello de Adopta.', icono: 'tag' },
];

function Tienda() {
  const { Seccion, useFotos, Tarjeta } = window.UI;
  const { Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const album = useFotos('merch');
  const productos = album && album.length ? album : MERCH_POR_DEFECTO;

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  return (
    <Seccion tono="ambar" ancho={1000}>
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 44px' }}>
        <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-sponsor-text)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Tienda</span>
        <h1 style={{ font: 'var(--font-h2)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 16px' }}>Lleva la causa contigo.</h1>
        <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)', margin: '0 0 18px' }}>
          Cada compra de nuestra merch nos ayuda a cubrir los gastos veterinarios de nuestros rescatados.
        </p>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 'var(--radius-pill)',
          background: 'var(--blue-600)', color: '#fff', font: 'var(--font-body-sm)', fontWeight: 700,
        }}>
          <i data-lucide="sparkles" style={{ width: 16, height: 16, color: 'var(--amber-500)' }} />
          Tienda en línea próximamente
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
        {productos.map((p) => (
          <Tarjeta key={p.id}>
            <div style={{
              aspectRatio: '1 / 1', position: 'relative',
              background: p.photo ? `${p.photo_pos || 'center'}/cover no-repeat url(${p.photo})` : 'linear-gradient(150deg, var(--blue-50), var(--amber-50))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} role={p.photo ? 'img' : undefined} aria-label={p.photo ? p.titulo : undefined}>
              {!p.photo ? <i data-lucide={p.icono || 'shopping-bag'} style={{ width: 56, height: 56, color: 'var(--blue-400)' }} /> : null}
            </div>
            <div style={{ padding: 20 }}>
              <h3 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '0 0 6px' }}>{p.titulo}</h3>
              {p.descripcion ? <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)', margin: '0 0 16px' }}>{p.descripcion}</p> : null}
              {p.enlace ? (
                <Button variant="sponsor" icon="shopping-bag" size="sm" onClick={() => window.open(p.enlace, '_blank', 'noopener')}>Comprar</Button>
              ) : (
                <span style={{ font: 'var(--font-caption)', fontWeight: 700, color: 'var(--action-sponsor-text)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Próximamente</span>
              )}
            </div>
          </Tarjeta>
        ))}
      </div>

      <p style={{ font: 'var(--font-body-base)', color: 'var(--text-secondary)', textAlign: 'center', margin: '40px 0 0' }}>
        ¿Quieres apartar algo antes? Escríbenos por Instagram a{' '}
        <a href={window.REDES.instagram} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>{window.REDES.usuario}</a>.
      </p>
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Tienda };
