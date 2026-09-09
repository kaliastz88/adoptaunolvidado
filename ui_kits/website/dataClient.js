// =============================================================================
// Capa de acceso a datos — todo lo que habla con Supabase vive aquí.
//
// Es JavaScript plano, sin JSX, para que el navegador lo cargue directo sin
// pasar por Babel. Se carga después de supabase-config.js y expone window.db.
//
// Ninguna pantalla llama a Supabase directamente: todas pasan por window.db.
// Así hay un solo lugar donde cambiar el manejo de errores o la forma de los
// datos si algún día se migra a otro backend.
// =============================================================================

(function () {
  var BUCKET = 'mascotas';
  var TABLA = 'animals';
  var MAX_BYTES = 5 * 1024 * 1024; // 5 MB

  // Si algo falta, window.db igual queda definido pero con métodos que fallan
  // con un mensaje útil. Sin esto las pantallas reventarían con "undefined is
  // not an object", que no le dice nada a nadie.
  function instalarStub(mensaje) {
    console.error('[db] ' + mensaje);
    var falla = function () { return Promise.reject(new Error(mensaje)); };
    window.db = {
      MAX_BYTES: 5 * 1024 * 1024,
      listAnimals: falla, saveAnimal: falla, deleteAnimal: falla,
      uploadPhoto: falla, deletePhoto: falla,
      signIn: falla, signUp: falla, signOut: falla, getSession: falla,
      miAcceso: falla, listPanelUsers: falla, decidirAcceso: falla,
      cambiarMiContrasena: falla,
      crearSolicitudAdopcion: falla, listSolicitudes: falla,
      cambiarEstadoSolicitud: falla, borrarSolicitud: falla,
      crearSolicitudAlianza: falla, listAlianzas: falla,
      cambiarEstadoAlianza: falla, borrarAlianza: falla,
      onAuthChange: function () { return function () {}; },
    };
  }

  if (!window.supabase || !window.supabase.createClient) {
    instalarStub('No se cargó la librería de Supabase. Revisa tu conexión y el <script> del CDN en el HTML.');
    return;
  }
  if (!window.SUPABASE_URL || window.SUPABASE_URL.indexOf('PENDIENTE') === 0) {
    instalarStub('Falta configurar ui_kits/website/supabase-config.js con la URL y la clave anon de tu proyecto.');
    return;
  }

  var sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  // Supabase devuelve { data, error } en vez de lanzar excepciones. Convertimos
  // el error en un throw para poder usar try/catch normal en las pantallas.
  function desempacar(res) {
    if (res.error) throw new Error(traducirError(res.error));
    return res.data;
  }

  // Los mensajes de Supabase vienen en inglés y algunos son crípticos. Los que
  // el usuario del panel puede provocar se traducen a algo accionable.
  function traducirError(error) {
    var msg = (error && error.message) || 'Error desconocido';
    if (/Invalid login credentials/i.test(msg)) return 'Correo o contraseña incorrectos.';
    if (/Email not confirmed/i.test(msg)) return 'Ese usuario no está confirmado. Actívalo en Supabase → Authentication → Users.';
    if (/row-level security|violates row-level/i.test(msg)) return 'No tienes permiso para esta acción. Vuelve a iniciar sesión.';
    // Lo que devuelve .single() cuando la consulta no encontró ninguna fila.
    // En la práctica significa que el registro ya no existe o que las políticas
    // de seguridad lo escondieron porque la sesión dejó de ser válida.
    if (/Cannot coerce the result to a single JSON object|PGRST116/i.test(msg)) {
      return 'No se pudo guardar: el registro ya no existe o tu sesión dejó de ser válida. Vuelve a iniciar sesión.';
    }
    if (/JWT expired|token is expired/i.test(msg)) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
    if (/Auth session missing/i.test(msg)) return 'No hay ninguna sesión abierta. Vuelve a iniciar sesión.';
    if (/Password should be at least (\d+)/i.test(msg)) {
      return 'La contraseña es demasiado corta. Usa al menos 8 caracteres.';
    }
    if (/New password should be different/i.test(msg)) {
      return 'Esa es la misma contraseña que ya tenías. Escribe una distinta.';
    }
    if (/Failed to fetch|NetworkError/i.test(msg)) return 'No se pudo conectar con Supabase. Revisa tu conexión y la URL del proyecto.';
    if (/exceeded the maximum allowed size/i.test(msg)) return 'La imagen pesa más de lo que permite el almacenamiento.';
    return msg;
  }

  // Las columnas que existen en la tabla. El formulario del panel arrastra
  // campos extra (id nulo al crear, etc.) que Postgres rechazaría.
  var CAMPOS = ['name', 'species', 'age', 'size', 'status', 'energy', 'compat', 'bio',
              'salud', 'estatus_medico', 'photo', 'photo_path', 'photo_pos'];

  function soloCamposDeTabla(form) {
    var fila = {};
    CAMPOS.forEach(function (c) {
      fila[c] = form[c] == null ? '' : form[c];
    });
    return fila;
  }

  function extensionDe(file) {
    var m = /\.([a-z0-9]+)$/i.exec(file.name || '');
    if (m) return m[1].toLowerCase();
    // Un archivo pegado desde el portapapeles no trae nombre; usamos el tipo MIME.
    var t = (file.type || '').split('/')[1];
    return (t || 'jpg').toLowerCase();
  }

  window.db = {
    MAX_BYTES: MAX_BYTES,
    cliente: sb,

    // --- Animales --------------------------------------------------------

    listAnimals: function () {
      return sb
        .from(TABLA)
        .select('*')
        .order('created_at', { ascending: false })
        .then(desempacar);
    },

    // Inserta si el formulario no trae id, actualiza si lo trae. Devuelve la
    // fila guardada tal como quedó en la base.
    saveAnimal: function (form) {
      var fila = soloCamposDeTabla(form);
      var q = form.id
        ? sb.from(TABLA).update(fila).eq('id', form.id).select().single()
        : sb.from(TABLA).insert(fila).select().single();
      return q.then(desempacar);
    },

    // Borra la fila y después su foto. En ese orden a propósito: si el borrado
    // de la fila falla por permisos, la foto sigue ahí y no perdemos nada.
    //
    // El .select() no es decorativo. Cuando las políticas de seguridad impiden
    // borrar, Postgres no lanza ningún error: simplemente no encuentra filas que
    // borrar y responde éxito. Sin pedir de vuelta lo borrado no habría forma de
    // distinguir "se borró" de "no tenías permiso", y el panel mostraría un
    // borrado exitoso que en realidad nunca ocurrió.
    deleteAnimal: function (animal) {
      return sb
        .from(TABLA)
        .delete()
        .eq('id', animal.id)
        .select()
        .then(desempacar)
        .then(function (borradas) {
          if (!borradas || borradas.length === 0) {
            throw new Error('No se pudo eliminar: el registro ya no existe o tu sesión dejó de ser válida. Vuelve a iniciar sesión.');
          }
          if (animal.photo_path) return window.db.deletePhoto(animal.photo_path);
        });
    },

    // --- Fotos -----------------------------------------------------------

    // Sube un archivo y devuelve { photo, photo_path }.
    // El nombre se genera al azar para que dos fotos llamadas "IMG_1234.jpg"
    // nunca se pisen entre sí.
    uploadPhoto: function (file) {
      var nombre = (window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : String(Date.now()) + '-' + Math.random().toString(36).slice(2)) + '.' + extensionDe(file);

      return sb.storage
        .from(BUCKET)
        .upload(nombre, file, { cacheControl: '3600', upsert: false })
        .then(desempacar)
        .then(function () {
          var url = sb.storage.from(BUCKET).getPublicUrl(nombre);
          return { photo: url.data.publicUrl, photo_path: nombre };
        });
    },

    // Borrar una foto nunca debe tumbar la operación principal: si falla, la
    // fila ya se guardó bien y lo único que queda es un archivo de sobra.
    deletePhoto: function (path) {
      if (!path) return Promise.resolve();
      return sb.storage
        .from(BUCKET)
        .remove([path])
        .then(function (res) {
          if (res.error) console.warn('[db] No se pudo borrar la foto anterior:', res.error.message);
        });
    },

    // --- Sesión ----------------------------------------------------------

    signIn: function (email, password) {
      return sb.auth.signInWithPassword({ email: email, password: password }).then(desempacar);
    },

    // Registrarse no da acceso a nada. Un disparador en la base crea la
    // solicitud en estado 'pendiente' y ahí se queda hasta que un owner la
    // apruebe. El navegador no elige el estado: si pudiera, cualquiera se
    // registraría ya aprobado.
    signUp: function (email, password) {
      return sb.auth.signUp({ email: email, password: password }).then(desempacar);
    },

    signOut: function () {
      return sb.auth.signOut();
    },

    // Cambia la contraseña de quien tiene la sesión abierta, y solo la suya:
    // Supabase la toma del token de sesión, no de un parámetro, así que no hay
    // forma de usar esto para cambiarle la contraseña a otra persona.
    cambiarMiContrasena: function (nueva) {
      return sb.auth.updateUser({ password: nueva }).then(desempacar);
    },

    getSession: function () {
      return sb.auth.getSession().then(function (res) {
        return res.data ? res.data.session : null;
      });
    },

    // --- Solicitudes de adopción -------------------------------------------

    // La manda cualquier visitante, sin cuenta.
    //
    // Sin .select() a propósito. El público tiene permiso de escribir pero no de
    // leer esta tabla, porque cada fila trae datos personales de alguien. Pedir
    // de vuelta la fila insertada haría fallar el envío por falta de permiso de
    // lectura, justo cuando en realidad se guardó bien.
    crearSolicitudAdopcion: function (datos) {
      return sb
        .from('adoption_requests')
        .insert(datos)
        .then(function (res) {
          if (res.error) throw new Error(traducirError(res.error));
          return true;
        });
    },

    listSolicitudes: function () {
      return sb
        .from('adoption_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .then(desempacar);
    },

    cambiarEstadoSolicitud: function (id, estado, notas) {
      var cambios = { estado: estado };
      if (typeof notas === 'string') cambios.notas = notas;
      return sb
        .from('adoption_requests')
        .update(cambios)
        .eq('id', id)
        .select()
        .then(desempacar)
        .then(function (filas) {
          if (!filas || filas.length === 0) {
            throw new Error('No se pudo actualizar la solicitud. Vuelve a iniciar sesión.');
          }
          return filas[0];
        });
    },

    borrarSolicitud: function (id) {
      return sb
        .from('adoption_requests')
        .delete()
        .eq('id', id)
        .select()
        .then(desempacar)
        .then(function (filas) {
          if (!filas || filas.length === 0) {
            throw new Error('No se pudo eliminar la solicitud. Vuelve a iniciar sesión.');
          }
        });
    },

    // --- Solicitudes de alianza --------------------------------------------

    // Sin .select(), por lo mismo que en las adopciones: el público escribe
    // pero no lee, y pedir de vuelta la fila haría fallar un envío correcto.
    crearSolicitudAlianza: function (datos) {
      return sb
        .from('ally_requests')
        .insert(datos)
        .then(function (res) {
          if (res.error) throw new Error(traducirError(res.error));
          return true;
        });
    },

    listAlianzas: function () {
      return sb
        .from('ally_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .then(desempacar);
    },

    cambiarEstadoAlianza: function (id, estado) {
      return sb
        .from('ally_requests')
        .update({ estado: estado })
        .eq('id', id)
        .select()
        .then(desempacar)
        .then(function (filas) {
          if (!filas || filas.length === 0) {
            throw new Error('No se pudo actualizar. Vuelve a iniciar sesión.');
          }
          return filas[0];
        });
    },

    borrarAlianza: function (id) {
      return sb
        .from('ally_requests')
        .delete()
        .eq('id', id)
        .select()
        .then(desempacar)
        .then(function (filas) {
          if (!filas || filas.length === 0) {
            throw new Error('No se pudo eliminar. Vuelve a iniciar sesión.');
          }
        });
    },

    // --- Personas del panel -----------------------------------------------

    // La solicitud de quien tiene la sesión abierta. Devuelve null si por lo que
    // sea no existe la fila, y la interfaz lo trata igual que 'pendiente': el
    // caso seguro es no dar acceso.
    //
    // El filtro por user_id es obligatorio, no una optimización. A un owner las
    // políticas le dejan ver la tabla entera, así que sin filtrar la consulta
    // devolvería todas las filas y .maybeSingle() fallaría justo para quien
    // administra el panel.
    miAcceso: function () {
      return sb.auth.getUser().then(function (r) {
        var usuario = r.data && r.data.user;
        if (!usuario) return null;
        return sb
          .from('panel_users')
          .select('user_id, email, role, status')
          .eq('user_id', usuario.id)
          .maybeSingle()
          .then(desempacar);
      });
    },

    // Solo un owner recibe la lista completa. A los demás las políticas de
    // seguridad les devuelven únicamente su propia fila.
    listPanelUsers: function () {
      return sb
        .from('panel_users')
        .select('user_id, email, role, status, created_at, decided_at')
        .order('created_at', { ascending: true })
        .then(desempacar);
    },

    // Aprobar, rechazar o revocar el acceso de alguien.
    //
    // El .select() cumple la misma función que en deleteAnimal: cuando las
    // políticas bloquean la operación, Postgres no falla, solo afecta cero
    // filas. Sin pedir de vuelta lo modificado, el panel diría "aprobado" sin
    // haber aprobado nada.
    decidirAcceso: function (userId, status) {
      return sb
        .from('panel_users')
        .update({ status: status, decided_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .then(desempacar)
        .then(function (filas) {
          if (!filas || filas.length === 0) {
            throw new Error('No se pudo cambiar el acceso. Solo la dueña del panel puede hacerlo.');
          }
          return filas[0];
        });
    },

    // Devuelve una función para cancelar la suscripción.
    onAuthChange: function (cb) {
      var res = sb.auth.onAuthStateChange(function (_evento, sesion) { cb(sesion); });
      return function () { res.data.subscription.unsubscribe(); };
    },
  };
})();
