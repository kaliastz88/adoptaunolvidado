/* @ds-bundle: {"format":4,"namespace":"AdoptaUnOlvidadoDesignSystem_167478","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"DogCard","sourcePath":"components/data/DogCard.jsx"},{"name":"StatCounter","sourcePath":"components/data/StatCounter.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Accordion","sourcePath":"components/overlay/Accordion.jsx"},{"name":"Modal","sourcePath":"components/overlay/Modal.jsx"},{"name":"Tabs","sourcePath":"components/overlay/Tabs.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"42931f7fc804","components/core/Button.jsx":"066d6fd6a383","components/core/IconButton.jsx":"f62ee0900bbb","components/data/DogCard.jsx":"21f816fc2db0","components/data/StatCounter.jsx":"d61b20900747","components/forms/Checkbox.jsx":"f44a7ebd24b4","components/forms/Input.jsx":"e349d622f881","components/forms/Select.jsx":"5d39d43b6d72","components/overlay/Accordion.jsx":"365ca1d97847","components/overlay/Modal.jsx":"c36bd93d15aa","components/overlay/Tabs.jsx":"0de7afa46bfa","ui_kits/website/AdminApp.jsx":"f28715881a9d","ui_kits/website/Aliados.jsx":"38792bd4b37f","ui_kits/website/Apadrina.jsx":"6b364fa54a37","ui_kits/website/App.jsx":"ad0a6f555428","ui_kits/website/Catalogo.jsx":"4804d5b1cfe5","ui_kits/website/Contacto.jsx":"7d79155f1a73","ui_kits/website/DogProfile.jsx":"446d27013099","ui_kits/website/Donar.jsx":"1b7ed4c2b4d6","ui_kits/website/FAQ.jsx":"c9cd19adebb8","ui_kits/website/Historia.jsx":"c4658f05e86b","ui_kits/website/Historias.jsx":"c62990ea33b4","ui_kits/website/Home.jsx":"c295d0f465fa","ui_kits/website/Voluntario.jsx":"4b57f7c76e20"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AdoptaUnOlvidadoDesignSystem_167478 = window.AdoptaUnOlvidadoDesignSystem_167478 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
const TONES = {
  success: {
    bg: 'var(--status-success-bg)',
    fg: 'var(--sage-600)'
  },
  info: {
    bg: 'var(--status-info-bg)',
    fg: 'var(--blue-700)'
  },
  warning: {
    bg: 'var(--status-warning-bg)',
    fg: 'var(--amber-600)'
  },
  neutral: {
    bg: 'var(--surface-sunken)',
    fg: 'var(--text-secondary)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  icon = null
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 14px',
      borderRadius: 'var(--radius-tag)',
      background: t.bg,
      color: t.fg,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, icon ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: 13,
      height: 13
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANT_STYLES = {
  primary: {
    background: 'var(--action-primary)',
    color: 'var(--text-on-brand)',
    border: '1px solid transparent'
  },
  cta: {
    background: 'var(--action-cta)',
    color: 'var(--text-on-brand)',
    border: '1px solid transparent'
  },
  sponsor: {
    background: 'var(--action-sponsor)',
    color: 'var(--text-on-brand)',
    border: '1px solid transparent'
  },
  secondary: {
    background: 'transparent',
    color: 'var(--action-primary)',
    border: '1.5px solid var(--border-brand)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid transparent'
  }
};
const SIZE_STYLES = {
  sm: {
    padding: '8px 16px',
    fontSize: 'var(--text-sm)'
  },
  md: {
    padding: '12px 22px',
    fontSize: 'var(--text-base)'
  },
  lg: {
    padding: '16px 30px',
    fontSize: 'var(--text-md)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  wag = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const s = SIZE_STYLES[size] || SIZE_STYLES.md;
  let background = v.background;
  if (!disabled && hover) {
    if (variant === 'primary') background = 'var(--action-primary-hover)';
    if (variant === 'cta') background = 'var(--action-cta-hover)';
    if (variant === 'sponsor') background = 'var(--action-sponsor-hover)';
    if (variant === 'secondary') background = 'var(--surface-brand-soft)';
    if (variant === 'ghost') background = 'var(--surface-sunken)';
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      borderRadius: 'var(--radius-button)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transform: active ? 'scale(0.97)' : 'scale(1)',
      transition: 'var(--transition-hover), transform var(--duration-fast) var(--ease-standard)',
      ...v,
      ...s,
      background,
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: 18,
      height: 18,
      transition: 'var(--transition-wag)',
      transform: wag && hover ? 'rotate(-10deg)' : 'rotate(0deg)'
    }
  }) : null, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  size = 40,
  tone = 'default',
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const toneColor = tone === 'brand' ? 'var(--action-primary)' : 'var(--text-secondary)';
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      background: hover ? 'var(--surface-brand-soft)' : 'var(--surface-sunken)',
      color: toneColor,
      transition: 'var(--transition-hover)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: size * 0.45,
      height: size * 0.45
    }
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/DogCard.jsx
try { (() => {
function DogCard({
  name,
  age,
  size,
  photo,
  tone = 'available',
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
      background: 'var(--surface-card)',
      boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'var(--transition-hover)',
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: 'var(--font-body)',
      width: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 200,
      background: photo ? `center/cover no-repeat url(${photo})` : 'var(--blue-100)',
      display: photo ? 'block' : 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, !photo ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": "dog",
    style: {
      width: 40,
      height: 40,
      color: 'var(--blue-400)'
    }
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-card-pad)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-h4)',
      color: 'var(--text-primary)'
    }
  }, name), tone === 'adopted' ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 700,
      color: 'var(--sage-600)',
      background: 'var(--status-success-bg)',
      padding: '3px 10px',
      borderRadius: 'var(--radius-pill)'
    }
  }, "Adoptado") : null), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, age, " \xB7 ", size)));
}
Object.assign(__ds_scope, { DogCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DogCard.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCounter.jsx
try { (() => {
function StatCounter({
  value,
  label,
  tone = 'brand'
}) {
  const bg = tone === 'brand' ? 'var(--surface-brand-soft)' : 'var(--surface-alt)';
  const fg = tone === 'brand' ? 'var(--action-primary)' : 'var(--text-primary)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-card)',
      background: bg,
      padding: 'var(--space-8) var(--space-6)',
      textAlign: 'center',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-stat)',
      color: fg
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, label));
}
Object.assign(__ds_scope, { StatCounter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCounter.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 22,
      height: 22,
      borderRadius: 7,
      border: `1.5px solid ${checked ? 'var(--action-primary)' : 'var(--border-default)'}`,
      background: checked ? 'var(--action-primary)' : 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'var(--transition-hover)',
      flexShrink: 0
    }
  }, checked ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check",
    style: {
      width: 14,
      height: 14,
      color: '#fff'
    }
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-body-base)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)'
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      font: 'var(--font-body-base)',
      padding: '12px 16px',
      borderRadius: 'var(--radius-input)',
      border: `1.5px solid ${error ? 'var(--terracotta-500)' : focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
      outline: 'none',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      transition: 'var(--transition-hover)',
      background: 'var(--surface-card)',
      color: 'var(--text-primary)'
    }
  }), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      color: 'var(--terracotta-600)'
    }
  }, error) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Selecciona'
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)'
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      appearance: 'none',
      font: 'var(--font-body-base)',
      padding: '12px 40px 12px 16px',
      borderRadius: 'var(--radius-input)',
      border: `1.5px solid ${focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
      outline: 'none',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      background: 'var(--surface-card)',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-down",
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
      color: 'var(--text-secondary)',
      pointerEvents: 'none'
    }
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Accordion.jsx
try { (() => {
function Accordion({
  items = []
}) {
  const [openIdx, setOpenIdx] = React.useState(0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontFamily: 'var(--font-body)'
    }
  }, items.map((item, i) => {
    const isOpen = i === openIdx;
    return /*#__PURE__*/React.createElement("div", {
      key: item.q,
      style: {
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-card)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpenIdx(isOpen ? -1 : i),
      style: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 20px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        font: 'var(--font-h4)',
        color: 'var(--text-primary)',
        textAlign: 'left'
      }
    }, item.q, /*#__PURE__*/React.createElement("i", {
      "data-lucide": isOpen ? 'minus' : 'plus',
      style: {
        width: 18,
        height: 18,
        color: 'var(--action-primary)',
        flexShrink: 0
      }
    })), isOpen ? /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 20px 18px',
        font: 'var(--font-body-base)',
        color: 'var(--text-secondary)'
      }
    }, item.a) : null);
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Modal.jsx
try { (() => {
function Modal({
  open,
  onClose,
  title,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'oklch(20% 0.02 50 / 0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      backdropFilter: 'blur(3px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-modal)',
      boxShadow: 'var(--shadow-modal)',
      padding: 'var(--space-8)',
      width: 420,
      maxWidth: '90vw',
      fontFamily: 'var(--font-body)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Cerrar",
    style: {
      position: 'absolute',
      top: 16,
      right: 16,
      border: 'none',
      background: 'var(--surface-sunken)',
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 16,
      height: 16
    }
  })), title ? /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h3)',
      marginBottom: 16,
      color: 'var(--text-primary)'
    }
  }, title) : null, children));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Modal.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Tabs.jsx
try { (() => {
function Tabs({
  options = [],
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-pill)',
      padding: 4,
      gap: 4,
      fontFamily: 'var(--font-body)'
    }
  }, options.map(opt => {
    const active = opt === value;
    return /*#__PURE__*/React.createElement("button", {
      key: opt,
      onClick: () => onChange && onChange(opt),
      style: {
        border: 'none',
        cursor: 'pointer',
        padding: '10px 20px',
        borderRadius: 'var(--radius-pill)',
        fontWeight: 600,
        fontSize: 'var(--text-sm)',
        background: active ? 'var(--action-sponsor)' : 'transparent',
        color: active ? '#fff' : 'var(--text-secondary)',
        transition: 'var(--transition-hover)'
      }
    }, opt);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/AdminApp.jsx
try { (() => {
const SEED = [{
  id: 1,
  name: 'Kiwi',
  species: 'Perro',
  age: '3–5 meses',
  size: 'Pequeño',
  status: 'Disponible',
  energy: 'Alta',
  compat: 'Niños, otros perros',
  bio: 'Rescatado en la calle, muy juguetón y sociable.',
  photo: ''
}, {
  id: 2,
  name: 'Sienna',
  species: 'Perro',
  age: '1 año',
  size: 'Grande',
  status: 'Disponible',
  energy: 'Media',
  compat: 'Niños',
  bio: 'Tranquila y cariñosa, ideal para familias.',
  photo: ''
}, {
  id: 3,
  name: 'Barcelona',
  species: 'Gato',
  age: '5–8 años',
  size: 'Mediano',
  status: 'Adoptado',
  energy: 'Baja',
  compat: 'Adultos solos',
  bio: 'Le gusta la tranquilidad y las siestas largas.',
  photo: ''
}];
const SPECIES_OPTS = ['Perro', 'Gato'];
const SIZE_OPTS = ['Pequeño', 'Mediano', 'Grande'];
const STATUS_OPTS = ['Disponible', 'En proceso', 'Adoptado'];
const ENERGY_OPTS = ['Baja', 'Media', 'Alta'];
function emptyForm() {
  return {
    id: null,
    name: '',
    species: 'Perro',
    age: '',
    size: 'Mediano',
    status: 'Disponible',
    energy: 'Media',
    compat: '',
    bio: '',
    photo: ''
  };
}
function AdminApp() {
  const {
    Button,
    Input,
    Select,
    Badge
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [animals, setAnimals] = React.useState(() => {
    try {
      const saved = localStorage.getItem('adopta_admin_animals');
      return saved ? JSON.parse(saved) : SEED;
    } catch (e) {
      return SEED;
    }
  });
  const [query, setQuery] = React.useState('');
  const [speciesFilter, setSpeciesFilter] = React.useState('Todas');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  React.useEffect(() => {
    localStorage.setItem('adopta_admin_animals', JSON.stringify(animals));
  }, [animals]);
  function openNew() {
    setForm(emptyForm());
    setModalOpen(true);
  }
  function openEdit(a) {
    setForm(a);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }
  function saveForm() {
    if (!form.name.trim()) return;
    if (form.id) {
      setAnimals(prev => prev.map(a => a.id === form.id ? form : a));
    } else {
      setAnimals(prev => [...prev, {
        ...form,
        id: Date.now()
      }]);
    }
    setModalOpen(false);
  }
  function confirmDelete(a) {
    setDeleteTarget(a);
  }
  function doDelete() {
    setAnimals(prev => prev.filter(a => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  }
  const filtered = animals.filter(a => {
    const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase());
    const matchesSpecies = speciesFilter === 'Todas' || a.species === speciesFilter;
    return matchesQuery && matchesSpecies;
  });
  const statusTone = s => s === 'Disponible' ? 'success' : s === 'En proceso' ? 'warning' : 'neutral';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--surface-page)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 48px',
      borderBottom: '1px solid var(--border-subtle)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/adopta-un-olvidado-logo.png",
    alt: "Adopta un Olvidado",
    style: {
      height: 32,
      width: 32
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 18px var(--font-display)',
      color: 'var(--blue-600)'
    }
  }, "Panel de administraci\xF3n")), /*#__PURE__*/React.createElement("a", {
    href: "index.html",
    style: {
      font: 'var(--font-body-sm)',
      fontWeight: 600,
      color: 'var(--text-secondary)'
    }
  }, "\u2190 Volver al sitio")), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      padding: '40px 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 20,
      flexWrap: 'wrap',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-primary)',
      textTransform: 'uppercase'
    }
  }, "Adopta un Olvidado \xB7 Admin"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h2)',
      color: 'var(--text-primary)',
      margin: '8px 0 0'
    }
  }, "Perros y gatos registrados")), /*#__PURE__*/React.createElement(Button, {
    variant: "cta",
    icon: "plus",
    onClick: openNew
  }, "Agregar animal")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Buscar por nombre...",
    value: query,
    onChange: e => setQuery(e.target.value)
  }), /*#__PURE__*/React.createElement(Select, {
    value: speciesFilter,
    onChange: e => setSpeciesFilter(e.target.value),
    options: ['Todas', ...SPECIES_OPTS]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 0.8fr 0.8fr 0.8fr 0.9fr 1fr 0.8fr',
      gap: 12,
      padding: '14px 24px',
      background: 'var(--surface-alt)',
      font: 'var(--font-caption)',
      fontWeight: 700,
      color: 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Nombre"), /*#__PURE__*/React.createElement("span", null, "Especie"), /*#__PURE__*/React.createElement("span", null, "Edad"), /*#__PURE__*/React.createElement("span", null, "Tama\xF1o"), /*#__PURE__*/React.createElement("span", null, "Energ\xEDa"), /*#__PURE__*/React.createElement("span", null, "Estado"), /*#__PURE__*/React.createElement("span", null, "Acciones")), filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 24px',
      textAlign: 'center',
      color: 'var(--text-muted)'
    }
  }, "No hay resultados.") : filtered.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 0.8fr 0.8fr 0.8fr 0.9fr 1fr 0.8fr',
      gap: 12,
      padding: '16px 24px',
      borderTop: '1px solid var(--border-subtle)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--blue-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      backgroundImage: a.photo ? `url(${a.photo})` : 'none',
      backgroundSize: 'cover'
    }
  }, !a.photo ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": a.species === 'Gato' ? 'cat' : 'dog',
    style: {
      width: 18,
      height: 18,
      color: 'var(--blue-500)'
    }
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, a.name)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      font: 'var(--font-body-sm)'
    }
  }, a.species), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      font: 'var(--font-body-sm)'
    }
  }, a.age), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      font: 'var(--font-body-sm)'
    }
  }, a.size), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      font: 'var(--font-body-sm)'
    }
  }, a.energy), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Badge, {
    tone: statusTone(a.status)
  }, a.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => openEdit(a),
    "aria-label": "Editar",
    style: {
      border: 'none',
      background: 'var(--surface-sunken)',
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--action-primary)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "pencil",
    style: {
      width: 15,
      height: 15
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => confirmDelete(a),
    "aria-label": "Eliminar",
    style: {
      border: 'none',
      background: 'var(--surface-sunken)',
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--terracotta-600)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "trash-2",
    style: {
      width: 15,
      height: 15
    }
  }))))))), /*#__PURE__*/React.createElement(AnimalFormModal, {
    open: modalOpen,
    form: form,
    setForm: setForm,
    onClose: closeModal,
    onSave: saveForm
  }), /*#__PURE__*/React.createElement(ConfirmDeleteModal, {
    target: deleteTarget,
    onCancel: () => setDeleteTarget(null),
    onConfirm: doDelete
  }));
}
function AnimalFormModal({
  open,
  form,
  setForm,
  onClose,
  onSave
}) {
  const {
    Modal,
    Input,
    Select
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const {
    Button
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  function set(field, value) {
    setForm(f => ({
      ...f,
      [field]: value
    }));
  }
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: form.id ? `Editar a ${form.name}` : 'Agregar animal'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      maxHeight: '65vh',
      overflowY: 'auto',
      paddingRight: 4
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nombre",
    placeholder: "Ej. Sienna",
    value: form.name,
    onChange: e => set('name', e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Especie",
    value: form.species,
    onChange: e => set('species', e.target.value),
    options: SPECIES_OPTS
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Tama\xF1o",
    value: form.size,
    onChange: e => set('size', e.target.value),
    options: SIZE_OPTS
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Edad",
    placeholder: "Ej. 2 a\xF1os",
    value: form.age,
    onChange: e => set('age', e.target.value)
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Energ\xEDa",
    value: form.energy,
    onChange: e => set('energy', e.target.value),
    options: ENERGY_OPTS
  })), /*#__PURE__*/React.createElement(Select, {
    label: "Estado de adopci\xF3n",
    value: form.status,
    onChange: e => set('status', e.target.value),
    options: STATUS_OPTS
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Compatibilidad",
    placeholder: "Ej. Ni\xF1os, otros perros",
    value: form.compat,
    onChange: e => set('compat', e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Foto (URL)",
    placeholder: "https://...",
    value: form.photo,
    onChange: e => set('photo', e.target.value)
  }), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, "Biograf\xEDa"), /*#__PURE__*/React.createElement("textarea", {
    value: form.bio,
    onChange: e => set('bio', e.target.value),
    rows: 3,
    placeholder: "Cuenta su historia...",
    style: {
      font: 'var(--font-body-base)',
      padding: '12px 16px',
      borderRadius: 'var(--radius-input)',
      border: '1.5px solid var(--border-default)',
      resize: 'vertical',
      fontFamily: 'var(--font-body)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "check",
    onClick: onSave,
    style: {
      flex: 1
    }
  }, "Guardar"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Cancelar")));
}
function ConfirmDeleteModal({
  target,
  onCancel,
  onConfirm
}) {
  const {
    Modal,
    Button
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return /*#__PURE__*/React.createElement(Modal, {
    open: !!target,
    onClose: onCancel,
    title: "\xBFEliminar registro?"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-base)',
      color: 'var(--text-secondary)',
      marginBottom: 20
    }
  }, "Se eliminar\xE1 a ", /*#__PURE__*/React.createElement("b", null, target ? target.name : ''), " de la lista. Esta acci\xF3n no se puede deshacer."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "cta",
    icon: "trash-2",
    onClick: onConfirm,
    style: {
      flex: 1
    }
  }, "Eliminar"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onCancel
  }, "Cancelar")));
}
window.AdminApp = AdminApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/AdminApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Aliados.jsx
try { (() => {
function Aliados() {
  const {
    Button
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const WAYS = [{
    icon: 'home',
    title: 'Hogar temporal',
    body: 'Abre tus puertas como espacio de rehabilitación para nuestros rescatados.'
  }, {
    icon: 'stethoscope',
    title: 'Servicios veterinarios',
    body: 'Apoya con consultas, cirugías o tratamientos a precio aliado.'
  }, {
    icon: 'megaphone',
    title: 'Difusión de marca',
    body: 'Comparte nuestras historias con tu comunidad y amplifica cada rescate.'
  }, {
    icon: 'package',
    title: 'Donación en especie',
    body: 'Alimento, medicamentos, camas, transportadoras y material de cuidado.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-sponsor)',
      textTransform: 'uppercase'
    }
  }, "Aliados"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h1)',
      color: 'var(--text-primary)',
      margin: '12px 0 16px'
    }
  }, "Las grandes historias comienzan con una alianza."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)',
      marginBottom: 40,
      maxWidth: 700
    }
  }, "En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Cada rescate es posible gracias a personas y marcas que deciden sumarse."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-brand-soft)',
      borderRadius: 'var(--radius-card)',
      padding: 32,
      marginBottom: 44,
      display: 'flex',
      gap: 28,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      height: 120,
      borderRadius: 'var(--radius-md)',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--blue-400)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "building-2",
    style: {
      width: 36,
      height: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 320px',
      minWidth: 280
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: 'var(--action-primary)',
      fontWeight: 700,
      textTransform: 'uppercase'
    }
  }, "Aliado destacado"), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--font-h3)',
      color: 'var(--text-primary)',
      margin: '8px 0 10px'
    }
  }, "Hotel PupuClub"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-base)',
      color: 'var(--text-secondary)',
      margin: '0 0 16px'
    }
  }, "Abri\xF3 sus puertas como hogar temporal y espacio de rehabilitaci\xF3n para nuestros rescatados, acompa\xF1ando de cerca la recuperaci\xF3n de Snow."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "play"
  }, "Conoce la historia de Snow"))), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--font-h3)',
      color: 'var(--text-primary)',
      marginBottom: 20
    }
  }, "Formas de aliarte"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 18,
      marginBottom: 44
    }
  }, WAYS.map(w => /*#__PURE__*/React.createElement("div", {
    key: w.title,
    style: {
      background: 'var(--surface-alt)',
      borderRadius: 'var(--radius-card)',
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": w.icon,
    style: {
      width: 24,
      height: 24,
      color: 'var(--action-sponsor)'
    }
  }), /*#__PURE__*/React.createElement("h4", {
    style: {
      font: 'var(--font-h4)',
      color: 'var(--text-primary)',
      margin: '12px 0 6px'
    }
  }, w.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, w.body)))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "sponsor",
    icon: "hand-heart"
  }, "Quiero aliarme como marca")));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  Aliados
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Aliados.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Apadrina.jsx
try { (() => {
function Apadrina() {
  const {
    Button
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto',
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-sponsor)',
      textTransform: 'uppercase'
    }
  }, "Apadrina"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h1)',
      color: 'var(--text-primary)',
      margin: '12px 0 20px'
    }
  }, "Acompa\xF1a una historia hasta su final feliz."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)',
      marginBottom: 40,
      maxWidth: 680
    }
  }, "Cuando apadrinas a uno de nuestros rescatados, te conviertes en parte de su camino: desde su recuperaci\xF3n y rehabilitaci\xF3n hasta el momento en que encuentra una familia que lo ame para siempre."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-alt)',
      borderRadius: 'var(--radius-card)',
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "calendar-check",
    style: {
      width: 26,
      height: 26,
      color: 'var(--action-sponsor)'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--font-h4)',
      color: 'var(--text-primary)',
      margin: '14px 0 8px'
    }
  }, "Aporte mensual autom\xE1tico"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-base)',
      color: 'var(--text-secondary)'
    }
  }, "Realiza tu aporte mensual desde la secci\xF3n Donar, seleccionando la opci\xF3n de aporte mensual. Nos permite cubrir a tiempo la manutenci\xF3n, tratamientos y cuidados de nuestros rescatados. Recibir\xE1s informaci\xF3n y actualizaciones sobre tu ahijado."), /*#__PURE__*/React.createElement(Button, {
    variant: "sponsor",
    icon: "hand-heart",
    style: {
      marginTop: 16
    }
  }, "Elegir aporte mensual")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-alt)',
      borderRadius: 'var(--radius-card)',
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "gift",
    style: {
      width: 26,
      height: 26,
      color: 'var(--action-sponsor)'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--font-h4)',
      color: 'var(--text-primary)',
      margin: '14px 0 8px'
    }
  }, "Aporte voluntario"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-base)',
      color: 'var(--text-secondary)'
    }
  }, "Realiza un aporte de valor libre, una vez al mes o las veces que desees apoyarnos. Comun\xEDcate con nuestra l\xEDnea de apadrinamiento y te compartiremos la evoluci\xF3n de tu ahijado hasta encontrar su hogar definitivo."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "message-circle",
    style: {
      marginTop: 16
    }
  }, "Contactar l\xEDnea de apadrinamiento"))), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-h3)',
      color: 'var(--action-sponsor)',
      textAlign: 'center',
      margin: '48px 0 0'
    }
  }, "Ser padrino es acompa\xF1ar una historia, ser parte de una transformaci\xF3n."));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  Apadrina
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Apadrina.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
function Logo({
  inverse
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/adopta-un-olvidado-logo.png",
    alt: "Adopta un Olvidado",
    style: {
      height: 34,
      width: 34
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 20px var(--font-display)',
      color: inverse ? '#fff' : 'var(--blue-600)'
    }
  }, "Adopta ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 400
    }
  }, "un Olvidado")));
}
const NAV = ['Adopta', 'Apadrina', 'Historias', 'Aliados', 'Voluntario', 'Nuestra historia', 'Preguntas frecuentes', 'Contacto'];
const ROUTES = {
  'Adopta': 'catalogo',
  'Apadrina': 'apadrina',
  'Historias': 'historias',
  'Aliados': 'aliados',
  'Voluntario': 'voluntario',
  'Nuestra historia': 'historia',
  'Preguntas frecuentes': 'faq',
  'Contacto': 'contacto'
};
function App() {
  const [route, setRoute] = React.useState('home');
  const [profileDog, setProfileDog] = React.useState(null);
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const {
    Home
  } = window.WebsiteScreens;
  const {
    Catalogo
  } = window.WebsiteScreens;
  const {
    DogProfile
  } = window.WebsiteScreens;
  const {
    Historia
  } = window.WebsiteScreens;
  const {
    FAQ
  } = window.WebsiteScreens;
  const {
    Apadrina
  } = window.WebsiteScreens;
  const {
    Voluntario
  } = window.WebsiteScreens;
  const {
    Donar
  } = window.WebsiteScreens;
  const {
    Historias
  } = window.WebsiteScreens;
  const {
    Aliados
  } = window.WebsiteScreens;
  const {
    Contacto
  } = window.WebsiteScreens;
  const {
    Button
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  function goProfile(dog) {
    setProfileDog(dog);
    setRoute('perfil');
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--surface-page)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 48px',
      position: 'sticky',
      top: 0,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
      zIndex: 20,
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      cursor: 'pointer'
    },
    onClick: () => setRoute('home')
  }, /*#__PURE__*/React.createElement(Logo, null)), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement("a", {
    key: n,
    onClick: () => setRoute(ROUTES[n] || 'home'),
    style: {
      font: 'var(--font-body-sm)',
      fontWeight: 600,
      color: 'var(--text-primary)',
      cursor: 'pointer'
    }
  }, n)), /*#__PURE__*/React.createElement(Button, {
    variant: "cta",
    icon: "heart",
    wag: true,
    size: "sm",
    onClick: () => setRoute('donar')
  }, "Donar"), /*#__PURE__*/React.createElement("a", {
    href: "admin.html",
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-muted)',
      marginLeft: 4
    },
    title: "Panel de administraci\xF3n"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "settings",
    style: {
      width: 16,
      height: 16
    }
  })))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1
    }
  }, route === 'home' && /*#__PURE__*/React.createElement(Home, {
    onSeeDog: goProfile,
    onNavigate: setRoute
  }), route === 'catalogo' && /*#__PURE__*/React.createElement(Catalogo, {
    onSeeDog: goProfile
  }), route === 'perfil' && /*#__PURE__*/React.createElement(DogProfile, {
    dog: profileDog,
    onBack: () => setRoute('catalogo')
  }), route === 'historia' && /*#__PURE__*/React.createElement(Historia, null), route === 'faq' && /*#__PURE__*/React.createElement(FAQ, null), route === 'apadrina' && /*#__PURE__*/React.createElement(Apadrina, null), route === 'voluntario' && /*#__PURE__*/React.createElement(Voluntario, null), route === 'donar' && /*#__PURE__*/React.createElement(Donar, null), route === 'historias' && /*#__PURE__*/React.createElement(Historias, null), route === 'aliados' && /*#__PURE__*/React.createElement(Aliados, null), route === 'contacto' && /*#__PURE__*/React.createElement(Contacto, null)), /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--blue-900)',
      color: 'var(--text-on-dark)',
      padding: '48px',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    inverse: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      flexWrap: 'wrap'
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    onClick: () => setRoute(ROUTES[n] || 'home'),
    style: {
      font: 'var(--font-body-sm)',
      opacity: 0.85,
      cursor: 'pointer'
    }
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "camera",
    style: {
      width: 20,
      height: 20
    }
  })))));
}
window.App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Catalogo.jsx
try { (() => {
function Catalogo({
  onSeeDog
}) {
  const {
    Select,
    Button,
    DogCard,
    Badge
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [especie, setEspecie] = React.useState('Todas las especies');
  const [tamano, setTamano] = React.useState('Todos los tamaños');
  const DOGS = [{
    name: 'Kiwi',
    age: '3–5 meses',
    size: 'Pequeño'
  }, {
    name: 'Melón',
    age: '1–5 años',
    size: 'Mediano'
  }, {
    name: 'Sienna',
    age: '1 año',
    size: 'Grande'
  }, {
    name: 'Barcelona',
    age: '5–8 años',
    size: 'Mediano',
    tone: 'adopted'
  }, {
    name: 'Carmina',
    age: '4 años',
    size: 'Pequeño'
  }, {
    name: 'Snow',
    age: 'Senior',
    size: 'Grande',
    tone: 'adopted'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-primary)',
      textTransform: 'uppercase'
    }
  }, "Adopta"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h1)',
      color: 'var(--text-primary)',
      margin: '10px 0 8px'
    }
  }, "Cada uno espera su segunda oportunidad"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)',
      marginBottom: 32,
      maxWidth: 640
    }
  }, "Filtra por especie, tama\xF1o y edad para encontrar a tu nuevo compa\xF1ero de vida."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      background: '#fff',
      padding: 20,
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Especie",
    value: especie,
    onChange: e => setEspecie(e.target.value),
    options: ['Todas las especies', 'Perro', 'Gato']
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Tama\xF1o y edad",
    value: tamano,
    onChange: e => setTamano(e.target.value),
    options: ['Todos los tamaños', '3 meses – 5 meses', '1 año – 5 años', '5 años – 8 años', 'Senior']
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "filter"
  }, "Filtrar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 24
    }
  }, DOGS.map(d => /*#__PURE__*/React.createElement(DogCard, {
    key: d.name,
    name: d.name,
    age: d.age,
    size: d.size,
    tone: d.tone,
    onClick: () => onSeeDog(d)
  }))));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  Catalogo
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Catalogo.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contacto.jsx
try { (() => {
function Contacto() {
  const {
    Input,
    Button
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 940,
      margin: '0 auto',
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-primary)',
      textTransform: 'uppercase'
    }
  }, "Contacto"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h1)',
      color: 'var(--text-primary)',
      margin: '12px 0 16px'
    }
  }, "Escr\xEDbenos, te respondemos."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--status-warning-bg)',
      border: '1px solid var(--amber-200)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 18px',
      marginBottom: 32,
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "alert-triangle",
    style: {
      width: 18,
      height: 18,
      color: 'var(--amber-600)',
      flexShrink: 0,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-primary)',
      margin: 0
    }
  }, "Placeholder \u2014 faltan los datos reales de contacto (correo, tel\xE9fono, Instagram, ciudad). Reempl\xE1zalos antes de publicar.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 340px',
      minWidth: 300,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nombre completo",
    placeholder: "Escribe tu nombre"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Correo",
    placeholder: "tucorreo@email.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Mensaje",
    placeholder: "\xBFEn qu\xE9 podemos ayudarte?"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "send"
  }, "Enviar mensaje")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 260px',
      minWidth: 240,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, [{
    icon: 'mail',
    label: 'Correo',
    value: '[pendiente]'
  }, {
    icon: 'phone',
    label: 'Línea de apadrinamiento',
    value: '[pendiente]'
  }, {
    icon: 'camera',
    label: 'Instagram',
    value: '[pendiente]'
  }, {
    icon: 'map-pin',
    label: 'Ciudad',
    value: '[pendiente]'
  }].map(c => /*#__PURE__*/React.createElement("div", {
    key: c.label,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      background: 'var(--surface-alt)',
      borderRadius: 'var(--radius-md)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": c.icon,
    style: {
      width: 20,
      height: 20,
      color: 'var(--action-primary)',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-caption)',
      color: 'var(--text-muted)',
      textTransform: 'uppercase'
    }
  }, c.label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-body-sm)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, c.value)))))));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  Contacto
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contacto.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/DogProfile.jsx
try { (() => {
function DogProfile({
  dog,
  onBack
}) {
  const {
    Button,
    Badge
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const d = dog || {
    name: 'Sienna',
    age: '2 años',
    size: 'Grande'
  };
  const FACTS = [{
    icon: 'dog',
    label: 'Especie',
    value: 'Canino'
  }, {
    icon: 'venus',
    label: 'Sexo',
    value: 'Hembra'
  }, {
    icon: 'calendar',
    label: 'Edad',
    value: d.age
  }, {
    icon: 'ruler',
    label: 'Tamaño',
    value: d.size
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px',
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--text-secondary)',
      font: 'var(--font-body-sm)',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-left",
    style: {
      width: 16,
      height: 16
    }
  }), " Volver al cat\xE1logo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      height: 420,
      borderRadius: 'var(--radius-card)',
      background: 'linear-gradient(150deg, var(--blue-100), var(--terracotta-50))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--blue-500)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "dog",
    style: {
      width: 56,
      height: 56
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 280
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h1)',
      color: 'var(--text-primary)',
      margin: '0 0 16px'
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10,
      marginBottom: 24
    }
  }, FACTS.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.label,
    style: {
      background: 'var(--surface-alt)',
      borderRadius: 'var(--radius-sm)',
      padding: '14px 10px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": f.icon,
    style: {
      width: 20,
      height: 20,
      color: 'var(--action-primary)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-2xs)',
      fontSize: 11,
      color: 'var(--text-muted)',
      marginTop: 6,
      textTransform: 'uppercase'
    }
  }, f.label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-body-sm)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, f.value)))), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--font-h4)',
      color: 'var(--text-primary)'
    }
  }, "Sobre ", d.name), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-base)',
      color: 'var(--text-secondary)'
    }
  }, "[Historia real pendiente] ", d.name, " fue rescatado de la calle y hoy, tras su proceso de rehabilitaci\xF3n, est\xE1 listo para conocer el amor de una familia."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      margin: '16px 0 24px'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    icon: "check"
  }, "Vacunado y esterilizado"), /*#__PURE__*/React.createElement(Badge, {
    tone: "info"
  }, "Energ\xEDa media"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, "Compatible con ni\xF1os")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "heart"
  }, "Adoptar a ", d.name), /*#__PURE__*/React.createElement(Button, {
    variant: "sponsor",
    icon: "hand-heart"
  }, "Apadrinar")))));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  DogProfile
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/DogProfile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Donar.jsx
try { (() => {
function Donar() {
  const {
    Tabs,
    Button
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [mode, setMode] = React.useState('Mensual');
  const [amount, setAmount] = React.useState('$150 MIL');
  const IMPACT = [{
    icon: 'stethoscope',
    title: 'Atención veterinaria',
    body: 'Consultas, curaciones, vacunas y desparasitación para cada rescatado.'
  }, {
    icon: 'bone',
    title: 'Alimentación diaria',
    body: 'Comida adecuada durante todo su proceso de recuperación.'
  }, {
    icon: 'house-heart',
    title: 'Hogar temporal',
    body: 'Un espacio seguro donde rehabilitarse mientras encuentra familia.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-cta)',
      textTransform: 'uppercase'
    }
  }, "Donar"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h1)',
      color: 'var(--text-primary)',
      margin: '12px 0 16px'
    }
  }, "Tu donaci\xF3n es el primer paso de su nueva vida."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)',
      marginBottom: 40,
      maxWidth: 660
    }
  }, "Cada aporte se convierte en atenci\xF3n m\xE9dica, alimento y un lugar seguro donde sanar. As\xED es como tu ayuda se transforma en una historia feliz."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 340px',
      minWidth: 300,
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    options: ['Dona una vez', 'Mensual'],
    value: mode,
    onChange: setMode
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      margin: '20px 0'
    }
  }, ['$50 MIL', '$100 MIL', '$150 MIL', '$200 MIL'].map(a => /*#__PURE__*/React.createElement("button", {
    key: a,
    onClick: () => setAmount(a),
    style: {
      padding: '16px',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      border: amount === a ? '2px solid var(--action-sponsor)' : '1.5px solid var(--border-default)',
      background: amount === a ? 'var(--amber-50)' : '#fff'
    }
  }, a, " COP"))), /*#__PURE__*/React.createElement(Button, {
    variant: "cta",
    icon: "heart",
    wag: true,
    style: {
      width: '100%'
    }
  }, "Dona ", amount, " ", mode === 'Mensual' ? 'al mes' : 'hoy')), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 320px',
      minWidth: 280,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, IMPACT.map(i => /*#__PURE__*/React.createElement("div", {
    key: i.title,
    style: {
      display: 'flex',
      gap: 14,
      background: 'var(--surface-alt)',
      borderRadius: 'var(--radius-card)',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": i.icon,
    style: {
      width: 24,
      height: 24,
      color: 'var(--action-cta)',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      font: 'var(--font-h4)',
      color: 'var(--text-primary)',
      margin: '0 0 4px'
    }
  }, i.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, i.body)))))));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  Donar
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Donar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/FAQ.jsx
try { (() => {
function FAQ() {
  const {
    Accordion
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const items = [{
    q: '¿Encontraste un animal perdido, enfermo o abandonado?',
    a: 'Aunque Adopta un Olvidado no cuenta con refugio físico, podemos orientarte durante el proceso de rescate, recuperación y búsqueda de un hogar responsable: ponlo a salvo, verifica si tiene familia (microchip), ofrécele un hogar temporal y prepáralo para adopción.'
  }, {
    q: '¿Cómo adoptar?',
    a: 'Completa nuestro formulario de adopción, realizamos una videollamada con la familia interesada, evaluamos cada caso con nuestro equipo, formalizamos la adopción y coordinamos la entrega oficial de tu nuevo integrante de familia.'
  }, {
    q: '¿Cómo apadrinar?',
    a: 'Al apadrinar te conviertes en parte del camino del rescatado: aporte mensual automático a través de la sección Donar, o un aporte voluntario de valor libre contactando nuestra línea de apadrinamiento.'
  }, {
    q: '¿Por qué se cobra una cuota de recuperación?',
    a: 'Ayuda a cubrir parte de los gastos de rescate y preparación para la adopción — consultas veterinarias, vacunas, desparasitación, esterilización y alimentación. No representa el valor de una vida; hace posible seguir ayudando a más animales.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto',
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-primary)',
      textTransform: 'uppercase'
    }
  }, "Preguntas frecuentes"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h1)',
      color: 'var(--text-primary)',
      margin: '12px 0 32px'
    }
  }, "\xBFTienes dudas? Aqu\xED tienes respuestas."), /*#__PURE__*/React.createElement(Accordion, {
    items: items
  }));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  FAQ
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/FAQ.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Historia.jsx
try { (() => {
function Historia() {
  const steps = [{
    icon: 'heart-pulse',
    title: 'Rescate y recuperación',
    body: 'Atendemos sus necesidades físicas y emocionales, brindando atención médica, curaciones, vacunas, desparasitación y esterilización.'
  }, {
    icon: 'sparkles',
    title: 'Rehabilitación',
    body: 'Trabajamos en su cuerpo, mente y alma. A través del entrenamiento, la socialización y la convivencia en hogares temporales, los ayudamos a recuperar la confianza.'
  }, {
    icon: 'graduation-cap',
    title: 'Preparación para una nueva vida',
    body: 'Durante su proceso aprenden rutinas, comandos básicos y herramientas que facilitarán su adaptación a su futuro hogar.'
  }, {
    icon: 'home',
    title: 'Adopción responsable',
    body: 'Buscamos la familia ideal para cada uno, porque no buscamos simplemente un hogar; buscamos el hogar correcto para cada historia.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto',
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-primary)',
      textTransform: 'uppercase'
    }
  }, "Nuestra historia"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h1)',
      color: 'var(--text-primary)',
      margin: '12px 0 24px'
    }
  }, "Naci\xF3 del amor, la empat\xEDa y el compromiso de cuatro amigas."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)'
    }
  }, "Cada una de nosotras, por separado, ya dedicaba tiempo y esfuerzo al rescate de perros en situaci\xF3n de calle. Con el tiempo, algunos casos nos unieron, comenzamos a trabajar juntas y descubrimos que nuestras habilidades se complementaban."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)'
    }
  }, "As\xED naci\xF3 Adopta un Olvidado. En M\xE9xico, miles de perros viven en las calles y muchos terminan siendo invisibles para la sociedad. Nosotros creemos que ning\xFAn perro deber\xEDa ser olvidado y que todos merecen la oportunidad de conocer el amor de una familia."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 18,
      margin: '40px 0'
    }
  }, steps.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.title,
    style: {
      background: 'var(--surface-alt)',
      borderRadius: 'var(--radius-card)',
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": s.icon,
    style: {
      width: 26,
      height: 26,
      color: 'var(--action-primary)'
    }
  }), /*#__PURE__*/React.createElement("h4", {
    style: {
      font: 'var(--font-h4)',
      color: 'var(--text-primary)',
      margin: '12px 0 6px'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, s.body)))), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-h3)',
      color: 'var(--action-primary)',
      textAlign: 'center',
      margin: '48px 0 0'
    }
  }, "Rescatar es solo el comienzo; transformar una vida es nuestra verdadera misi\xF3n."));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  Historia
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Historia.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Historias.jsx
try { (() => {
function Historias() {
  const {
    Badge,
    Button
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const STORIES = [{
    name: 'Valiente',
    before: 'Rescatado de la calle, desnutrido y con miedo al contacto humano.',
    after: 'Hoy vive en un hogar con jardín y duerme en la cama de su familia.',
    months: '8 meses de rehabilitación'
  }, {
    name: 'Snow',
    before: 'Llegó a Hotel PupuClub como hogar temporal tras un rescate complicado.',
    after: 'Recuperó su confianza y encontró la familia correcta.',
    months: '5 meses de rehabilitación'
  }, {
    name: 'Dorito',
    before: 'Desconfiaba de todos; no dejaba que nadie se le acercara.',
    after: 'Su primer abrazo fue el día que conoció a su familia adoptiva.',
    months: '6 meses de rehabilitación'
  }, {
    name: 'Nona',
    before: 'Encontrada herida en la carretera, necesitó cirugía y cuidados largos.',
    after: 'Adoptada meses después por una familia que la esperaba.',
    months: '10 meses de rehabilitación'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--status-success)',
      textTransform: 'uppercase'
    }
  }, "Historias de \xE9xito"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h1)',
      color: 'var(--text-primary)',
      margin: '12px 0 16px'
    }
  }, "Cada adopci\xF3n cambia dos vidas."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)',
      marginBottom: 40,
      maxWidth: 660
    }
  }, "Estas son algunas de las transformaciones que hemos acompa\xF1ado. Rescatar es solo el comienzo."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 22
    }
  }, STORIES.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 180,
      background: 'linear-gradient(120deg, var(--sage-100), var(--blue-100))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--sage-600)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "images",
    style: {
      width: 34,
      height: 34
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: 'var(--font-h4)',
      color: 'var(--text-primary)',
      margin: 0
    }
  }, s.name), /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    icon: "check"
  }, "Adoptado")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-muted)',
      margin: '0 0 10px'
    }
  }, "Antes \u2014 ", s.before), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-base)',
      color: 'var(--text-primary)',
      margin: '0 0 12px'
    }
  }, "Ahora \u2014 ", s.after), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-caption)',
      color: 'var(--status-success)',
      fontWeight: 600
    }
  }, s.months))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-h3)',
      color: 'var(--status-success)',
      marginBottom: 20
    }
  }, "\xBFQuieres ser parte de la pr\xF3xima historia?"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "paw-print"
  }, "Conoce a nuestros perritos")));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  Historias
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Historias.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
function Home({
  onSeeDog,
  onNavigate
}) {
  const {
    Button,
    DogCard,
    StatCounter
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const {
    Tabs,
    Modal
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState('Mensual');
  const [amount, setAmount] = React.useState('$150 MIL');
  const STORIES = [{
    name: 'Valiente',
    note: 'Rescatado de la calle. Hoy vive en un hogar con jardín.'
  }, {
    name: 'Dorito',
    note: 'De la desconfianza al primer abrazo — ahora tiene familia.'
  }, {
    name: 'Nona',
    note: 'Encontrada herida. Recuperada y adoptada meses después.'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 40,
      padding: '64px 48px',
      background: 'linear-gradient(180deg, var(--blue-50), var(--surface-page))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 460px',
      minWidth: 320
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-primary)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wider)'
    }
  }, "Rescate \xB7 rehabilitaci\xF3n \xB7 adopci\xF3n responsable"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-hero)',
      color: 'var(--text-primary)',
      margin: '14px 0 20px'
    }
  }, "Un gesto tuyo puede ser el comienzo de su historia feliz."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)',
      marginBottom: 28
    }
  }, "Rescatamos, rehabilitamos y encontramos el hogar correcto para cada perrito olvidado."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "cta",
    icon: "heart",
    wag: true,
    onClick: () => setOpen(true)
  }, "Dona hoy"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "paw-print",
    onClick: () => onNavigate('catalogo')
  }, "Conoce a nuestros perritos"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 320px',
      minWidth: 280,
      maxWidth: 380,
      height: 420,
      borderRadius: 'var(--radius-xl)',
      background: 'linear-gradient(160deg, var(--blue-200), var(--terracotta-100))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: 'var(--blue-700)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "image",
    style: {
      width: 56,
      height: 56
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-sm)',
      marginTop: 10
    }
  }, "Foto editorial del perrito", /*#__PURE__*/React.createElement("br", null), "(pendiente material real)")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 48px 64px',
      display: 'flex',
      gap: 20,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(StatCounter, {
    value: "+60",
    label: "perritos con hogar"
  }), /*#__PURE__*/React.createElement(StatCounter, {
    value: "4",
    label: "fundadoras",
    tone: "neutral"
  }), /*#__PURE__*/React.createElement(StatCounter, {
    value: "100%",
    label: "adopci\xF3n responsable",
    tone: "neutral"
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '64px 48px',
      background: 'var(--surface-alt)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-primary)',
      textTransform: 'uppercase'
    }
  }, "Historias que transforman vidas"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--font-h2)',
      color: 'var(--text-primary)',
      margin: '10px 0 32px'
    }
  }, "De la calle a un hogar para siempre"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, STORIES.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      flex: '1 1 300px',
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 160,
      background: 'linear-gradient(120deg, var(--sage-100), var(--blue-100))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--sage-600)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "images",
    style: {
      width: 32,
      height: 32
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h4)',
      color: 'var(--text-primary)'
    }
  }, s.name), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, s.note))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '72px 48px',
      maxWidth: 1000,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-sponsor)',
      textTransform: 'uppercase'
    }
  }, "Aliados"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--font-h2)',
      color: 'var(--text-primary)',
      margin: '10px 0 18px'
    }
  }, "Las grandes historias comienzan con una alianza."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)',
      maxWidth: 720
    }
  }, "En Adopta un Olvidado creemos que cambiar la vida de un perrito no es una tarea que podamos hacer solos. Hoy reconocemos a ", /*#__PURE__*/React.createElement("b", null, "Hotel PupuClub"), ", que abri\xF3 sus puertas como hogar temporal y espacio de rehabilitaci\xF3n para nuestros rescatados."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "play"
  }, "Conoce la historia de Snow"), /*#__PURE__*/React.createElement(Button, {
    variant: "sponsor",
    icon: "hand-heart"
  }, "Quiero aliarme como marca"))), /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: () => setOpen(false),
    title: "\xA1Dona hoy!"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-base)',
      color: 'var(--text-secondary)',
      marginBottom: 16
    }
  }, "\"Un gesto tuyo puede ser el comienzo de su historia feliz.\""), /*#__PURE__*/React.createElement(Tabs, {
    options: ['Dona una vez', 'Mensual'],
    value: mode,
    onChange: setMode
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      margin: '18px 0'
    }
  }, ['$50 MIL', '$100 MIL', '$150 MIL', '$200 MIL'].map(a => /*#__PURE__*/React.createElement("button", {
    key: a,
    onClick: () => setAmount(a),
    style: {
      padding: '14px',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      border: amount === a ? '2px solid var(--action-sponsor)' : '1.5px solid var(--border-default)',
      background: amount === a ? 'var(--amber-50)' : '#fff'
    }
  }, a, " COP"))), /*#__PURE__*/React.createElement(Button, {
    variant: "sponsor",
    style: {
      width: '100%'
    }
  }, "Dona hoy")));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  Home
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Voluntario.jsx
try { (() => {
function Voluntario() {
  const {
    Input,
    Button
  } = window.AdoptaUnOlvidadoDesignSystem_167478;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      padding: '56px 48px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-eyebrow)',
      color: 'var(--action-primary)',
      textTransform: 'uppercase'
    }
  }, "Voluntario"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h1)',
      color: 'var(--text-primary)',
      margin: '12px 0 16px'
    }
  }, "\xBFQuieres ser voluntario?"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--status-warning-bg)',
      border: '1px solid var(--amber-200)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 18px',
      marginBottom: 28,
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "alert-triangle",
    style: {
      width: 18,
      height: 18,
      color: 'var(--amber-600)',
      flexShrink: 0,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-primary)',
      margin: 0
    }
  }, "Placeholder \u2014 el brief solo confirm\xF3 el t\xEDtulo de esta secci\xF3n; a\xFAn no hay copy final sobre c\xF3mo funciona el voluntariado. Este formulario es un layout de ejemplo, no texto listo para publicar.")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)',
      marginBottom: 28
    }
  }, "Cu\xE9ntanos un poco de ti y te contactaremos con las formas en que puedes ayudar \u2014 paseos, transporte, hogares temporales, eventos y m\xE1s."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nombre completo",
    placeholder: "Escribe tu nombre"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Correo",
    placeholder: "tucorreo@email.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\xBFC\xF3mo te gustar\xEDa ayudar?",
    placeholder: "Paseos, transporte, hogar temporal..."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "hand-heart"
  }, "Enviar")));
}
window.WebsiteScreens = {
  ...window.WebsiteScreens,
  Voluntario
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Voluntario.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.DogCard = __ds_scope.DogCard;

__ds_ns.StatCounter = __ds_scope.StatCounter;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
