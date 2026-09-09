// =============================================================================
// BloqueDonacion — el selector de monto y frecuencia.
//
// Existe porque esta misma interfaz aparece en dos lugares: el modal de la
// portada y la página de Donar. Antes estaba escrita dos veces con los montos
// copiados a mano, y así es como una acaba en pesos colombianos y la otra no.
//
// Los montos y los enlaces salen de pagos-config.js. Este componente no sabe
// cuánto cuesta nada.
// =============================================================================

function BloqueDonacion({ variante = 'sponsor' }) {
  const { Tabs, Button } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const cfg = window.DONACIONES;

  const [modo, setModo] = React.useState('Dona una vez');
  const [monto, setMonto] = React.useState(cfg.preseleccionado);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const enlace = (cfg.enlaces[modo] || {})[monto] || '';
  const mensualSinEnlaces = modo === 'Mensual'
    && Object.keys(cfg.enlaces['Mensual']).every((m) => !cfg.enlaces['Mensual'][m]);

  const formatear = (n) => '$' + n.toLocaleString('es-MX') + ' ' + cfg.moneda;
  const textoBoton = modo === 'Mensual'
    ? `Dona ${formatear(monto)} al mes`
    : `Dona ${formatear(monto)}`;

  return (
    <div>
      <Tabs options={['Dona una vez', 'Mensual']} value={modo} onChange={setModo} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '20px 0' }}>
        {cfg.montos.map((m) => (
          <button
            key={m}
            onClick={() => setMonto(m)}
            aria-pressed={monto === m}
            style={{
              padding: '16px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-base)',
              color: 'var(--text-primary)',
              border: monto === m ? '2px solid var(--action-sponsor)' : '1.5px solid var(--border-default)',
              background: monto === m ? 'var(--amber-50)' : '#fff',
              transition: 'var(--transition-hover)',
            }}
          >
            {formatear(m)}
          </button>
        ))}
      </div>

      {/* Un enlace de verdad, no window.open: los navegadores bloquean las
          ventanas abiertas por código y la persona se quedaría sin entender
          por qué no pasó nada al donar. */}
      {enlace ? (
        <a href={enlace} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
          <Button variant={variante} icon="heart" wag style={{ width: '100%' }}>{textoBoton}</Button>
        </a>
      ) : (
        <Button variant={variante} icon="heart" disabled style={{ width: '100%' }}>{textoBoton}</Button>
      )}

      {!enlace ? (
        <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)', margin: '12px 0 0', textAlign: 'center' }}>
          {mensualSinEnlaces
            ? cfg.avisoMensualPendiente
            : 'Estamos terminando de configurar los donativos en línea. Escríbenos y te decimos cómo apoyar mientras tanto.'}
        </p>
      ) : (
        <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-muted)', margin: '12px 0 0', textAlign: 'center' }}>
          Te llevamos a Mercado Pago para completar tu donativo de forma segura.
        </p>
      )}
    </div>
  );
}

window.BloqueDonacion = BloqueDonacion;
