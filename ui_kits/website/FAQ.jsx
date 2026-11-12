// Respuestas de varios párrafos: cada string es un párrafo y lo que va entre
// **dobles asteriscos** sale en negritas, igual que en las notas de la
// fundadora. Así el texto se puede pegar casi tal cual.
function Parrafos({ textos }) {
  return textos.map((t, i) => (
    <p key={i} style={{ margin: i ? '12px 0 0' : 0 }}>
      {t.split(/\*\*(.+?)\*\*/g).map((trozo, k) => (k % 2 ? <b key={k} style={{ color: 'var(--text-primary)' }}>{trozo}</b> : trozo))}
    </p>
  ));
}

function FAQ() {
  const { Seccion } = window.UI;
  const { Accordion } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const items = [
    { q: '¿Encontraste un animal perdido o abandonado?', a: <Parrafos textos={[
      'Aunque **Adopta un Olvidado no cuenta con un refugio físico**, no tienes que enfrentar solo el rescate.',
      'Podemos orientarte paso a paso para que ese perrito tenga una oportunidad real: **ponlo a salvo, verifica si tiene una familia —por ejemplo, revisando si cuenta con microchip—, ayúdanos a encontrar un hogar temporal y acompáñalo en su recuperación y preparación para una adopción responsable.**',
      'A veces, rescatar no empieza con una organización ni con un refugio. **Empieza con una persona que decide no pasar de largo.**',
    ]} /> },
    { q: '¿Cómo adopto?', a: <Parrafos textos={[
      'Completa nuestro formulario de adopción y cuéntanos un poco sobre ti y el hogar que quieres ofrecer. Después, realizamos una videollamada con la familia interesada para conocernos mejor y resolver cualquier duda.',
      'Nuestro equipo evalúa cada caso para asegurarnos de que exista una buena conexión entre la familia y el perrito. Una vez aprobada la adopción, **formalizamos el proceso y coordinamos la entrega oficial de tu nuevo integrante de familia.**',
      'La adopción contempla una **cuota de recuperación**, que nos ayuda a continuar cubriendo los gastos de rescate, alimentación y atención veterinaria de nuestros perros.',
      'Y esto no termina el día de la entrega. Entrarás a un **grupo de seguimiento**, donde estaremos acompañándote durante la adaptación y te pediremos compartir fotos y actualizaciones para saber cómo está nuestro olvidado en su nuevo hogar.',
      'Porque para nosotros, encontrar una familia no es el final de la historia. Es el comienzo de una nueva.',
    ]} /> },
    { q: '¿Cómo apadrinar?', a: 'Al apadrinar te conviertes en parte del camino del rescatado: aporte mensual automático a través de la sección Donar, o un aporte voluntario de valor libre contactando nuestra línea de apadrinamiento.' },
    { q: '¿Por qué se cobra una cuota de recuperación?', a: <Parrafos textos={[
      'Tu aportación ayuda a cubrir parte de los gastos que implica rescatar y preparar a cada perrito para una nueva vida: **consultas veterinarias, vacunas, desparasitación, esterilización, alimentación y cuidados durante su recuperación.**',
      'Esta cuota **no representa el valor de una vida**, porque una vida no tiene precio. Es una forma de recuperar parte de lo invertido para que podamos continuar rescatando, atendiendo y dándoles una segunda oportunidad a muchos más animales.',
      '**Cuando adoptas, también ayudas a que otro olvidado pueda ser rescatado.**',
    ]} /> },
  ];
  return (
    <Seccion tono="arena" ancho={760}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>Preguntas frecuentes</span>
      <h1 style={{ font: 'var(--font-h1)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 32px' }}>¿Tienes dudas? Aquí tienes respuestas.</h1>
      <Accordion items={items} />
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, FAQ };
