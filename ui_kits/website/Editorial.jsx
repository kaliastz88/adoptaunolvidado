// =============================================================================
// Editorial — el lenguaje visual del sitio.
//
// Antes cada pantalla era un div con padding y todo se veía igual de plano:
// texto sobre crema, tarjeta blanca, texto sobre crema, tarjeta blanca. Aquí
// viven las piezas que le dan ritmo, y cada pantalla las usa en vez de inventar
// su propio maquetado.
//
// Tenerlo en un solo archivo importa: si mañana se cambia la curva o un tono,
// cambia en las once pantallas a la vez. Repartido, cada pantalla se iría por
// su lado y volveríamos al punto de partida.
// =============================================================================

// Cada tono trae su color de fondo y el de texto que se lee encima. Van juntos
// a propósito: separarlos es cómo acaba habiendo texto azul sobre fondo azul.
const TONOS = {
  crema:   { fondo: 'var(--surface-page)',    texto: 'var(--text-primary)',   suave: 'var(--text-secondary)', acento: 'var(--action-primary)' },
  blanco:  { fondo: 'var(--surface-card)',    texto: 'var(--text-primary)',   suave: 'var(--text-secondary)', acento: 'var(--action-primary)' },
  arena:   { fondo: 'var(--surface-alt)',     texto: 'var(--text-primary)',   suave: 'var(--text-secondary)', acento: 'var(--action-primary)' },
  azul:    { fondo: 'var(--blue-600)',        texto: 'var(--text-on-brand)',  suave: 'rgba(255,255,255,0.82)', acento: 'var(--amber-400)' },
  noche:   { fondo: 'var(--blue-900)',        texto: 'var(--text-on-dark)',   suave: 'rgba(255,255,255,0.78)', acento: 'var(--amber-400)' },
  ambar:   { fondo: 'var(--amber-50)',        texto: 'var(--text-primary)',   suave: 'var(--text-secondary)', acento: 'var(--action-sponsor)' },
  terracota:{ fondo: 'var(--terracotta-50)',  texto: 'var(--text-primary)',   suave: 'var(--text-secondary)', acento: 'var(--action-cta)' },
};

// La curva se dibuja en el color de SU sección y se sube por encima del borde,
// así muerde la sección de arriba sea cual sea. La alternativa, que cada
// sección dibuje la curva de la siguiente, obliga a que cada una sepa qué viene
// después: un acoplamiento que se rompe en cuanto se reordenan.
function Curva({ color, alto = 64, invertida = false }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      style={{
        position: 'absolute', left: 0, right: 0, width: '100%', height: alto,
        [invertida ? 'bottom' : 'top']: -alto + 1,
        transform: invertida ? 'scaleY(-1)' : 'none',
        display: 'block', pointerEvents: 'none',
      }}
    >
      <path d="M0,64 C300,4 560,0 720,0 C880,0 1140,4 1440,64 Z" fill={color} />
    </svg>
  );
}

function Seccion({ tono = 'crema', curva = false, curvaAbajo = false, ancho = 1100, py = 88, style, children }) {
  const t = TONOS[tono] || TONOS.crema;
  return (
    <section style={{
      position: 'relative',
      background: t.fondo,
      color: t.texto,
      padding: `${py}px 48px`,
      // El margen compensa la curva para que no deje un hueco de color raro.
      marginTop: curva ? 64 : 0,
      ...style,
    }}>
      {curva ? <Curva color={t.fondo} /> : null}
      {curvaAbajo ? <Curva color={t.fondo} invertida /> : null}
      <div style={{ maxWidth: ancho, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
}

// Encabezado de sección: antecedente en versalitas, título grande y entrada.
// Estaba repetido con variaciones mínimas en las once pantallas.
function Encabezado({ eyebrow, titulo, entrada, tono = 'crema', centrado = false, style }) {
  const t = TONOS[tono] || TONOS.crema;
  return (
    <div style={{ maxWidth: centrado ? 760 : 720, margin: centrado ? '0 auto' : 0, textAlign: centrado ? 'center' : 'left', ...style }}>
      {eyebrow ? (
        <span style={{
          font: 'var(--font-eyebrow)', color: t.acento, textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wider)', display: 'block',
        }}>{eyebrow}</span>
      ) : null}
      {titulo ? (
        <h2 style={{ font: 'var(--font-h1)', color: t.texto, margin: '12px 0 0', lineHeight: 1.06, letterSpacing: '-0.02em' }}>
          {titulo}
        </h2>
      ) : null}
      {entrada ? (
        <p style={{ font: 'var(--font-body-lg)', color: t.suave, margin: '18px 0 0' }}>{entrada}</p>
      ) : null}
    </div>
  );
}

// Foto en arco. Es el gesto que más aleja al sitio del rectángulo por defecto,
// y con fotos de perros funciona: el arco enmarca la cara.
function FotoArco({ src, pos = 'center', alto = 420, ancho = '100%', style, children }) {
  return (
    <div style={{
      position: 'relative', width: ancho, height: alto, flexShrink: 0,
      borderRadius: '999px 999px var(--radius-card) var(--radius-card)',
      overflow: 'hidden',
      background: src
        ? `${pos}/cover no-repeat url(${src})`
        : 'linear-gradient(160deg, var(--blue-200), var(--terracotta-100))',
      boxShadow: 'var(--shadow-lg)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// Cifra grande de impacto. El número manda y la etiqueta acompaña; al revés se
// pierde el golpe de vista, que es lo único que hace útil una cifra suelta.
function Cifra({ valor, etiqueta, tono = 'crema' }) {
  const t = TONOS[tono] || TONOS.crema;
  return (
    <div style={{ textAlign: 'center', minWidth: 150 }}>
      <div style={{
        font: 'var(--font-display)', fontSize: 'clamp(44px, 7vw, 76px)', fontWeight: 700,
        lineHeight: 1, color: t.acento, letterSpacing: '-0.03em',
      }}>{valor}</div>
      <div style={{ font: 'var(--font-body-sm)', color: t.suave, marginTop: 10, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>
        {etiqueta}
      </div>
    </div>
  );
}

// Franja de huellas. Va como imagen de fondo repetida y no como una lista de
// elementos: con flex y separación fija quedaban centradas y sobraba espacio en
// los lados de las pantallas anchas. Repetida, la línea siempre llega completa.
function FranjaHuellas({ tono = 'azul', alto = 54, tamano = 30 }) {
  const t = TONOS[tono] || TONOS.azul;
  const color = tono === 'azul' || tono === 'noche' ? '#FEBC1A' : '#021C4B';
  const patita = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${tamano}" height="${tamano}" viewBox="0 0 110 110">`
    + `<g fill="${color}" opacity="0.3">`
    + '<ellipse cx="28" cy="34" rx="11" ry="14" transform="rotate(-22 28 34)"/>'
    + '<ellipse cx="50" cy="22" rx="11" ry="15" transform="rotate(-6 50 22)"/>'
    + '<ellipse cx="73" cy="26" rx="11" ry="15" transform="rotate(12 73 26)"/>'
    + '<ellipse cx="91" cy="48" rx="10" ry="13" transform="rotate(32 91 48)"/>'
    + '<ellipse cx="57" cy="74" rx="27" ry="23"/>'
    + '</g></svg>'
  );
  return (
    <div aria-hidden="true" style={{
      background: `${t.fondo} url("data:image/svg+xml,${patita}") repeat-x center`,
      backgroundSize: `${tamano + 20}px ${tamano}px`,
      height: alto,
    }} />
  );
}

// Patita con una foto dentro.
//
// El intento anterior metía el texto en la almohadilla y la estiraba a lo ancho
// para que cupiera. El resultado no era una patita sino un óvalo con cuatro
// huevos flotando encima: un texto largo necesita una caja ancha, y una patita
// necesita proporción, y no se pueden tener las dos en la misma forma.
//
// Aquí la patita conserva su proporción real y lo que la llena es una foto, que
// se adapta a cualquier forma sin deformarse. El texto va al lado, donde se
// puede leer.
const PATITA = {
  vista: '0 0 104 112',
  // Cuatro dedos en arco y la almohadilla abajo, con las medidas de una patita
  // de verdad. Cambiarlas rompe la silueta, así que van juntas y no sueltas.
  formas: [
    { cx: 17, cy: 47, rx: 11,   ry: 14,   rot: -22 },
    { cx: 39, cy: 29, rx: 12,   ry: 15.5, rot: -8 },
    { cx: 64, cy: 29, rx: 12,   ry: 15.5, rot: 8 },
    { cx: 87, cy: 47, rx: 11,   ry: 14,   rot: 22 },
    { cx: 52, cy: 82, rx: 30,   ry: 26,   rot: 0 },
  ],
};

function siluetaPatita(id) {
  return PATITA.formas.map((f, i) => (
    <ellipse key={i} cx={f.cx} cy={f.cy} rx={f.rx} ry={f.ry}
             transform={f.rot ? `rotate(${f.rot} ${f.cx} ${f.cy})` : undefined} />
  ));
}

function PatitaFoto({ src, ancho = 340, color = 'var(--amber-500)', style }) {
  // El id tiene que ser único: dos patitas en la misma página con el mismo id
  // de recorte hacen que la segunda use el recorte de la primera.
  const id = React.useMemo(() => 'patita-' + Math.random().toString(36).slice(2, 9), []);
  const alto = ancho * 112 / 104;
  const pad = PATITA.formas[4];
  const dedos = PATITA.formas.slice(0, 4);

  return (
    <div style={{ position: 'relative', width: ancho, height: alto, flexShrink: 0, ...style }}>
      <svg viewBox={PATITA.vista} width={ancho} height={alto}
           role={src ? 'img' : undefined}
           aria-label={src ? 'Uno de nuestros rescatados' : undefined}
           style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          {/* Solo la almohadilla recorta la foto. Recortarla contra la patita
              entera la parte en cinco trozos sueltos y se pierde de qué es la
              imagen; en la almohadilla se ve una cara completa. */}
          <clipPath id={id}>
            <ellipse cx={pad.cx} cy={pad.cy} rx={pad.rx} ry={pad.ry} />
          </clipPath>
        </defs>

        {/* Patita amarilla detrás, corrida unos píxeles: da profundidad y
            mantiene el color de marca aunque la foto sea oscura. */}
        <g fill={color} opacity="0.55" transform="translate(5 6)">
          {siluetaPatita()}
        </g>

        <g fill={color}>
          {dedos.map((f, i) => (
            <ellipse key={i} cx={f.cx} cy={f.cy} rx={f.rx} ry={f.ry}
                     transform={f.rot ? `rotate(${f.rot} ${f.cx} ${f.cy})` : undefined} />
          ))}
        </g>

        {src ? (
          // La foto se encuadra sobre la almohadilla y no sobre el lienzo
          // entero: centrada en el lienzo, lo que asomaría por la almohadilla
          // sería la parte de abajo de la imagen, casi siempre el cuerpo.
          <image href={src}
                 x={pad.cx - pad.rx} y={pad.cy - pad.ry}
                 width={pad.rx * 2} height={pad.ry * 2}
                 preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id})`} />
        ) : (
          <ellipse cx={pad.cx} cy={pad.cy} rx={pad.rx} ry={pad.ry} fill="var(--blue-600)" />
        )}
      </svg>
    </div>
  );
}

// Tarjeta que se levanta al pasar el cursor. El movimiento es lo que separa una
// superficie viva de una lámina impresa.
function Tarjeta({ children, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transform: hover && onClick ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'var(--transition-hover)',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

window.UI = { TONOS, Seccion, Curva, Encabezado, FotoArco, Cifra, FranjaHuellas, PatitaFoto, Tarjeta };
