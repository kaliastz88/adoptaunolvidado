function FAQ() {
  const { Seccion, Encabezado, Tarjeta } = window.UI;
  const { Accordion } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const items = [
    { q: '¿Encontraste un animal perdido, enfermo o abandonado?', a: 'Aunque Adopta un Olvidado no cuenta con refugio físico, podemos orientarte durante el proceso de rescate, recuperación y búsqueda de un hogar responsable: ponlo a salvo, verifica si tiene familia (microchip), ofrécele un hogar temporal y prepáralo para adopción.' },
    { q: '¿Cómo adoptar?', a: 'Completa nuestro formulario de adopción, realizamos una videollamada con la familia interesada, evaluamos cada caso con nuestro equipo, formalizamos la adopción y coordinamos la entrega oficial de tu nuevo integrante de familia.' },
    { q: '¿Cómo apadrinar?', a: 'Al apadrinar te conviertes en parte del camino del rescatado: aporte mensual automático a través de la sección Donar, o un aporte voluntario de valor libre contactando nuestra línea de apadrinamiento.' },
    { q: '¿Por qué se cobra una cuota de recuperación?', a: 'Ayuda a cubrir parte de los gastos de rescate y preparación para la adopción — consultas veterinarias, vacunas, desparasitación, esterilización y alimentación. No representa el valor de una vida; hace posible seguir ayudando a más animales.' },
  ];
  return (
    <Seccion tono="arena" ancho={760}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Preguntas frecuentes</span>
      <h1 style={{ font: 'var(--font-h1)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 32px' }}>¿Tienes dudas? Aquí tienes respuestas.</h1>
      <Accordion items={items} />
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, FAQ };
