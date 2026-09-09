// =============================================================================
// Huellas — marca de agua de fondo y el rastro que sigue al cursor.
//
// Dos cosas distintas que comparten el mismo dibujo:
//
// 1. Huellas fijas de distintos tamaños repartidas por el fondo, muy tenues.
// 2. Un rastro que sigue al cursor durante los primeros segundos de la visita,
//    como si un perrito hubiera pasado corriendo, y luego se apaga.
//
// TRES REGLAS QUE NO SE NEGOCIAN, porque un adorno nunca debe estorbar:
//
// - pointer-events: none en todo. Una decoración jamás puede robarse un clic.
// - Se apaga con prefers-reduced-motion. Hay personas a las que el movimiento
//   en pantalla les provoca mareo o les impide leer.
// - Solo con cursor de verdad. En un celular no hay ratón que seguir, y montar
//   la lógica igual sería gastar batería para nada.
// =============================================================================

// Cuatro dedos y una almohadilla. En elipses en vez de un trazado complicado:
// a este tamaño y con esta opacidad, más detalle no se distingue.
function Huella({ size = 40, color = 'currentColor', opacity = 1, rotate = 0, style }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 110 110" aria-hidden="true" focusable="false"
      style={{ transform: `rotate(${rotate}deg)`, opacity, ...style }}
    >
      <g fill={color}>
        <ellipse cx="28" cy="34" rx="11" ry="14" transform="rotate(-22 28 34)" />
        <ellipse cx="50" cy="22" rx="11" ry="15" transform="rotate(-6 50 22)" />
        <ellipse cx="73" cy="26" rx="11" ry="15" transform="rotate(12 73 26)" />
        <ellipse cx="91" cy="48" rx="10" ry="13" transform="rotate(32 91 48)" />
        <ellipse cx="57" cy="74" rx="27" ry="23" />
      </g>
    </svg>
  );
}

// Posiciones fijas, no al azar. Al azar cambiarían en cada visita y en cada
// vuelta a pintar, y una marca de agua que se mueve sola se nota como error.
const FONDO = [
  { top: '6%',  left: '3%',  size: 130, rot: -18, op: 0.05 },
  { top: '18%', left: '88%', size: 76,  rot: 24,  op: 0.045 },
  { top: '31%', left: '12%', size: 54,  rot: 40,  op: 0.05 },
  { top: '44%', left: '74%', size: 110, rot: -32, op: 0.04 },
  { top: '52%', left: '38%', size: 44,  rot: 12,  op: 0.04 },
  { top: '63%', left: '6%',  size: 92,  rot: 8,   op: 0.05 },
  { top: '71%', left: '91%', size: 60,  rot: -24, op: 0.045 },
  { top: '84%', left: '24%', size: 118, rot: 30,  op: 0.04 },
  { top: '92%', left: '66%', size: 68,  rot: -12, op: 0.05 },
];

const SEGUIR_MS = 6000;   // cuánto dura el rastro al entrar
const SEPARACION = 90;    // píxeles entre una huella y la siguiente
const VIDA_MS = 1400;     // cuánto tarda cada huella en desvanecerse

function Huellas() {
  const [rastro, setRastro] = React.useState([]);
  const contador = React.useRef(0);
  const ultima = React.useRef({ x: 0, y: 0 });
  const izquierda = React.useRef(false);

  React.useEffect(() => {
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conRaton = window.matchMedia('(pointer: fine)').matches;
    if (quieto || !conRaton) return;

    let activo = true;

    function alMover(e) {
      if (!activo) return;
      const dx = e.clientX - ultima.current.x;
      const dy = e.clientY - ultima.current.y;
      // Se suelta una huella cada cierta distancia recorrida, no en cada
      // píxel: si no, serían cientos por segundo y el rastro se vería como una
      // mancha continua en vez de pasos.
      if (Math.hypot(dx, dy) < SEPARACION) return;

      const angulo = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      izquierda.current = !izquierda.current;
      const id = ++contador.current;
      // Se alternan izquierda y derecha, separadas del centro, para que parezca
      // que algo caminó y no que cayeron sellos en fila.
      const desvio = izquierda.current ? -13 : 13;
      const rad = (angulo * Math.PI) / 180;

      setRastro((prev) => prev.concat({
        id,
        x: e.clientX + Math.cos(rad) * desvio,
        y: e.clientY + Math.sin(rad) * desvio,
        rot: angulo,
      }));
      ultima.current = { x: e.clientX, y: e.clientY };

      setTimeout(() => setRastro((prev) => prev.filter((h) => h.id !== id)), VIDA_MS);
    }

    window.addEventListener('mousemove', alMover, { passive: true });
    const apagar = setTimeout(() => { activo = false; }, SEGUIR_MS);

    return () => {
      activo = false;
      clearTimeout(apagar);
      window.removeEventListener('mousemove', alMover);
    };
  }, []);

  return (
    <React.Fragment>
      {/* Marca de agua. position fixed y detrás de todo, para que no empuje
          nada ni crezca con el largo de la página. */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {FONDO.map((h, i) => (
          <div key={i} style={{ position: 'absolute', top: h.top, left: h.left }}>
            <Huella size={h.size} rotate={h.rot} opacity={h.op} color="var(--blue-600)" />
          </div>
        ))}
      </div>

      {/* El rastro va encima de todo, pero sigue sin poder recibir clics. */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 30, pointerEvents: 'none',
      }}>
        {rastro.map((h) => (
          <div
            key={h.id}
            style={{
              position: 'absolute', left: h.x, top: h.y,
              transform: 'translate(-50%, -50%)',
              animation: `adopta-huella ${VIDA_MS}ms ease-out forwards`,
            }}
          >
            <Huella size={26} rotate={h.rot} color="var(--action-sponsor)" />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

if (!document.getElementById('adopta-huellas-keyframes')) {
  const s = document.createElement('style');
  s.id = 'adopta-huellas-keyframes';
  s.textContent = `@keyframes adopta-huella {
    0%   { opacity: 0;    transform: translate(-50%, -50%) scale(0.6); }
    18%  { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0;    transform: translate(-50%, -50%) scale(1); }
  }`;
  document.head.appendChild(s);
}

window.Huellas = Huellas;
