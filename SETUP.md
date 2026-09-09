# Adopta un Olvidado — puesta en marcha

Guía para conectar el sitio a Supabase, probarlo en tu computadora y publicarlo
en GitHub. No necesitas instalar Node, npm ni ningún compilador: el sitio es
HTML estático que carga React desde un CDN.

---

## Estado actual

**Supabase ya está configurado.** Los pasos 1 a 4 de abajo ya se ejecutaron
sobre el proyecto `bsolvxlnzxzfazfejaey`. La tabla, el bucket, las políticas de
seguridad, el usuario del panel y el archivo de configuración están listos y
verificados. Quedan documentados por si algún día hay que rehacer el proyecto
desde cero o montar uno de pruebas aparte.

**El sitio ya está publicado** en GitHub Pages desde el repositorio
<https://github.com/kaliastz88/adoptaunolvidado>:

- Sitio público: <https://kaliastz88.github.io/adoptaunolvidado/>
- Panel: <https://kaliastz88.github.io/adoptaunolvidado/ui_kits/website/admin.html>

Para publicar cambios de aquí en adelante basta con `git add`, `git commit` y
`git push`. GitHub Pages vuelve a desplegar solo, en un par de minutos.

---

## 1. Crear el proyecto en Supabase

1. Entra a <https://supabase.com> y haz clic en **Start your project**. Puedes
   registrarte con GitHub o con correo. El plan gratuito alcanza de sobra.
2. Crea una organización cuando lo pida. Plan **Free**.
3. **New project**:
   - **Name**: `adopta-un-olvidado`
   - **Database Password**: genera una y guárdala en tu gestor de contraseñas.
     No la necesitarás para este sitio, pero no se puede recuperar después.
   - **Region**: la más cercana a México, por ejemplo *East US (North Virginia)*.
4. Espera un par de minutos a que el proyecto termine de crearse.

## 2. Crear la tabla y el almacenamiento

1. Menú lateral → **SQL Editor** → **New query**.
2. Abre el archivo [`supabase/schema.sql`](supabase/schema.sql) de este
   repositorio, copia **todo** su contenido y pégalo en el editor.
3. Presiona **Run**.

Eso crea la tabla `animals`, el bucket de fotos `mascotas`, las políticas de
seguridad y seis animales de ejemplo. Se puede volver a correr sin peligro: no
duplica ni borra nada.

> Si al correrlo aparece el error `must be owner of table objects`, significa
> que tu proyecto no permite crear políticas de almacenamiento desde SQL. En ese
> caso borra la sección 3 del archivo, vuelve a correr el resto, y crea las
> cuatro políticas a mano en **Storage** → `mascotas` → **Policies**: una de
> `SELECT` para el rol `public`, y una de `INSERT`, una de `UPDATE` y una de
> `DELETE` para el rol `authenticated`.

## 2b. Registro de personas para el panel

Abre otra consulta en el **SQL Editor**, pega
[`supabase/usuarios-del-panel.sql`](supabase/usuarios-del-panel.sql) y presiona
**Run**. Se corre después de `schema.sql`, porque reemplaza sus políticas de
escritura.

Luego, en **Authentication** → **Providers** → **Email**:

- **Activa** *Enable sign ups*
- **Desactiva** *Confirm email*

### Cómo funciona el acceso

Cualquiera puede crear una cuenta desde el panel, pero registrarse no da permiso
a nada. La cuenta queda en espera hasta que la dueña la apruebe desde la
pestaña **Usuarios**.

Quien crea la cuenta nunca elige su propio estado. Un disparador en la base la
crea siempre en espera y con el rol más bajo. Si esa decisión estuviera en el
navegador, cualquiera se registraría ya aprobado.

Hay dos niveles. La **dueña** aprueba, rechaza y quita accesos. Las demás
personas solo gestionan animales y fotos. La base impide que la dueña se cambie
el acceso a sí misma, para que no pueda dejarse fuera por error y bloquear el
panel para todos.

Para quitarle el acceso a alguien se marca como rechazado, no se borra su
registro. Si se borrara, esa persona volvería a aparecer como una solicitud
nueva y podría ser aprobada por descuido.

### Aviso por correo cuando alguien pide acceso

Lo configura [`supabase/aviso-por-correo.sql`](supabase/aviso-por-correo.sql).
Antes de correrlo hay que reemplazar `CLAVE_DE_RESEND_AQUI` por una clave real
de <https://resend.com>. El archivo del repositorio conserva el marcador a
propósito: la clave vive en el vault de secretos de Supabase, nunca en el
código.

Supabase no puede mandar correos arbitrarios. Su servidor gratuito solo envía
mensajes de autenticación y solo a miembros del proyecto, así que el aviso nunca
llegaría. Por eso la base llama a Resend por HTTP con `pg_net`, que encola la
petición y la manda en segundo plano sin hacer esperar a quien se registra.

El aviso se manda a quien tenga el rol de dueña, leído de la tabla en vez de un
correo escrito a mano. Si mañana cambia quién administra el panel, el aviso la
sigue sin tocar este archivo.

El envío está envuelto en un bloque que captura cualquier error. El disparador
corre dentro de la misma transacción que crea la cuenta, así que sin esa
protección una falla de correo impediría que alguien se registrara. Un aviso que
no sale nunca debe romper el registro.

Para revisar si un aviso salió:

```sql
select status_code, error_msg, created
from net._http_response
order by created desc limit 5;
```

La cuenta de Resend tiene que estar registrada con el mismo correo que recibe
los avisos. Sin un dominio propio verificado, el remitente de prueba
`onboarding@resend.dev` solo entrega a la dirección dueña de la cuenta. Para
avisarle a varias personas hay que verificar un dominio en Resend y cambiar el
remitente por una dirección de ese dominio.

## 2c. Solicitudes de adopción

Corre [`supabase/solicitudes-de-adopcion.sql`](supabase/solicitudes-de-adopcion.sql)
en el **SQL Editor**, después de los archivos anteriores.

En el sitio, el botón **Adoptar** de la ficha de cada perro abre un cuestionario
de veinticinco preguntas. Al enviarlo, la solicitud aparece en la pestaña
**Solicitudes** del panel y le llega un aviso por correo al equipo.

Esta tabla funciona al revés que las demás. Cualquiera puede **escribir** en ella
sin tener cuenta, porque el formulario es público, pero **nadie de fuera puede
leerla**, porque cada fila trae nombre, teléfono y correo de una persona real.

Eso tiene una consecuencia al programar contra ella: un `insert` que pida de
vuelta la fila insertada falla, porque el público no tiene permiso de lectura. Hay
que insertar sin `.select()`.

### Cambiar las preguntas

Las preguntas están declaradas como datos, no repartidas por el código. Para
agregar, quitar o reordenar una hay que tocar tres lugares:

1. La columna en `supabase/solicitudes-de-adopcion.sql`
2. La lista `SECCIONES` en `ui_kits/website/SolicitudAdopcion.jsx`
3. La lista `PREGUNTAS` en `ui_kits/website/AdminApp.jsx`, o el panel no la muestra

El nombre del campo tiene que ser idéntico en los tres.

### Sobre solicitudes falsas

El formulario es público a propósito, así que cualquiera puede enviar solicitudes
inventadas. Hay límites de tamaño para que nadie vuelque texto enorme, pero no
limitan la cantidad. Si algún día llega basura en volumen, la solución es agregar
una verificación tipo captcha, y eso necesita una Edge Function.

### Por qué no hay confirmación por correo

El permiso lo da la aprobación de la dueña, no el correo, así que confirmar la
dirección no agrega seguridad. Y el servidor de correo gratuito de Supabase solo
entrega mensajes a miembros del proyecto, de modo que a las voluntarias nunca les
llegaría nada y se quedarían trabadas antes de poder pedir acceso.

## 3. Crear tu usuario del panel

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Escribe tu correo y la contraseña con la que quieras entrar al panel.
3. Activa **Auto Confirm User**, para no tener que verificar el correo.
4. Después ve a **Authentication** → **Providers** → **Email** y **desactiva
   Enable sign ups**.

Ese último paso es importante: sin él, cualquiera podría registrarse solo y
darse acceso al panel de administración.

## 4. Conectar el sitio

1. **Project Settings** (el engranaje) → **API**.
2. Copia el **Project URL** y la clave **anon public**.
3. Pégalos en [`ui_kits/website/supabase-config.js`](ui_kits/website/supabase-config.js),
   reemplazando los dos valores que dicen `PENDIENTE`.

### Sobre publicar la clave

La clave **anon** está hecha para viajar en el código del navegador. Es normal y
seguro que quede visible en GitHub. Lo que protege los datos son las políticas
de seguridad del paso 2: con esa clave se puede leer el catálogo, pero no
crear, editar ni borrar sin haber iniciado sesión.

La clave **service_role** es distinta: salta todas las políticas y da control
total. Nunca la pongas en ningún archivo de este repositorio.

## 5. Probar en tu computadora

Desde la carpeta raíz del proyecto:

```sh
python3 -m http.server 5173
```

Luego abre en el navegador:

- Sitio público: <http://localhost:5173/ui_kits/website/index.html>
- Panel de administración: <http://localhost:5173/ui_kits/website/admin.html>

Tiene que servirse por HTTP. Si abres los archivos con doble clic
(`file://...`), el navegador bloquea la carga de las pantallas `.jsx` y solo
verás una página en blanco.

Para detener el servidor, presiona `Ctrl+C` en la terminal.

## 6. Publicar en GitHub

```sh
git init
git add .
git commit -m "Sitio conectado a Supabase con carga de fotos"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Antes del `git remote add`, crea el repositorio vacío en
<https://github.com/new>. Marcalo como **Public** y no agregues README ni
`.gitignore` desde ahí, porque este repositorio ya los trae.

Para dejar el sitio en línea: en el repositorio, **Settings** → **Pages** →
Source **Deploy from a branch**, rama `main`, carpeta `/ (root)`, **Save**. En
un par de minutos queda disponible en:

- Sitio: `https://TU-USUARIO.github.io/TU-REPO/`
- Panel: `https://TU-USUARIO.github.io/TU-REPO/ui_kits/website/admin.html`

El archivo `.nojekyll` de la raíz no es opcional. GitHub Pages procesa los
sitios con Jekyll, que descarta todo archivo cuyo nombre empiece con guion bajo.
Sin él, `_ds_bundle.js` nunca llegaría al navegador y el sitio publicado saldría
en blanco. Si algún día alguien lo borra, eso es lo que hay que revisar primero.

No hace falta configurar nada más en Supabase: acepta peticiones desde
cualquier origen y el inicio de sesión con correo y contraseña no usa URLs de
redirección.

---

## Cómo funcionan las fotos

La zona de arrastrar y soltar del formulario sube la imagen a Supabase Storage
**en cuanto la sueltas**, no al guardar. Por eso ves la vista previa real antes
de confirmar.

Cada animal guarda dos datos de su foto:

| columna      | para qué sirve                                    |
| ------------ | ------------------------------------------------- |
| `photo`      | la URL pública, que es lo que muestra el sitio     |
| `photo_path` | la ruta del archivo, para poder borrarlo al reemplazarlo |

Si reemplazas una foto y guardas, la anterior se borra del almacenamiento. Si
reemplazas y cancelas, se borra la nueva y se conserva la que ya estaba. Al
eliminar un animal se borra también su foto. Así el bucket no acumula archivos
que nadie usa.

Límites: solo imágenes, hasta 5 MB. También puedes hacer clic en la zona para
elegir un archivo, o pegar una imagen con `Ctrl+V`.

---

## Estructura de los archivos que tocan datos

| archivo | qué hace |
| ------- | -------- |
| `supabase/schema.sql` | tabla, bucket, políticas de seguridad y datos de ejemplo |
| `supabase/usuarios-del-panel.sql` | registro con aprobación, roles y las políticas que exigen estar aprobado |
| `supabase/aviso-por-correo.sql` | envío de correos desde la base con pg_net y Resend |
| `supabase/solicitudes-de-adopcion.sql` | tabla de solicitudes, sus políticas y el aviso al equipo |
| `ui_kits/website/SolicitudAdopcion.jsx` | el cuestionario público de adopción |
| `ui_kits/website/supabase-config.js` | la URL y la clave anon de tu proyecto |
| `ui_kits/website/dataClient.js` | única capa que habla con Supabase, expone `window.db` |
| `ui_kits/website/PhotoDropzone.jsx` | la zona de arrastrar y soltar |
| `ui_kits/website/AdminApp.jsx` | login y panel de administración |
| `ui_kits/website/Catalogo.jsx` | catálogo público, lee de Supabase |
| `ui_kits/website/DogProfile.jsx` | ficha individual, lee de Supabase |

Ninguna pantalla llama a Supabase directamente: todas pasan por `window.db`.

---

## Nota de rendimiento

El sitio carga React en su versión de desarrollo y compila el JSX en el
navegador con Babel en cada visita. Funciona, pero la primera carga es lenta y
la consola muestra advertencias. Es aceptable para arrancar. Si más adelante el
sitio recibe tráfico real, el siguiente paso sería usar las versiones de
producción de React y precompilar el JSX.
