function Historia() {
  const { Seccion, Encabezado, Tarjeta } = window.UI;
  const steps = [
    { icon: 'heart-pulse', title: 'Rescate y recuperación', body: 'Atendemos sus necesidades físicas y emocionales, brindando atención médica, curaciones, vacunas, desparasitación y esterilización.' },
    { icon: 'sparkles', title: 'Rehabilitación', body: 'Trabajamos en su cuerpo, mente y alma. A través del entrenamiento, la socialización y la convivencia en hogares temporales, los ayudamos a recuperar la confianza.' },
    { icon: 'graduation-cap', title: 'Preparación para una nueva vida', body: 'Durante su proceso aprenden rutinas, comandos básicos y herramientas que facilitarán su adaptación a su futuro hogar.' },
    { icon: 'home', title: 'Adopción responsable', body: 'Buscamos la familia ideal para cada uno, porque no buscamos simplemente un hogar; buscamos el hogar correcto para cada historia.' },
  ];
  return (
    <Seccion tono="crema" ancho={900}>
      <span style={{ font: 'var(--font-eyebrow)', color: 'var(--action-primary)', textTransform: 'uppercase' }}>Nuestra historia</span>
      <h1 style={{ font: 'var(--font-h1)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '12px 0 24px' }}>Nació del amor, la empatía y el compromiso de cuatro amigas.</h1>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)' }}>
        Cada una de nosotras, por separado, ya dedicaba tiempo y esfuerzo al rescate de perros en situación de calle. Con el tiempo, algunos casos nos unieron, comenzamos a trabajar juntas y descubrimos que nuestras habilidades se complementaban.
      </p>
      <p style={{ font: 'var(--font-body-lg)', color: 'var(--text-secondary)' }}>
        Así nació Adopta un Olvidado. En México, miles de perros viven en las calles y muchos terminan siendo invisibles para la sociedad. Nosotros creemos que ningún perro debería ser olvidado y que todos merecen la oportunidad de conocer el amor de una familia.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, margin: '40px 0' }}>
        {steps.map((s) => (
          <div key={s.title} style={{ background: 'var(--surface-alt)', borderRadius: 'var(--radius-card)', padding: 22 }}>
            <i data-lucide={s.icon} style={{ width: 26, height: 26, color: 'var(--action-primary)' }} />
            <h4 style={{ font: 'var(--font-h4)', color: 'var(--text-primary)', margin: '12px 0 6px' }}>{s.title}</h4>
            <p style={{ font: 'var(--font-body-sm)', color: 'var(--text-secondary)' }}>{s.body}</p>
          </div>
        ))}
      </div>

      <p style={{ font: 'var(--font-h3)', color: 'var(--action-primary)', textAlign: 'center', margin: '48px 0 0' }}>
        Rescatar es solo el comienzo; transformar una vida es nuestra verdadera misión.
      </p>
    </Seccion>
  );
}

window.WebsiteScreens = { ...window.WebsiteScreens, Historia };
