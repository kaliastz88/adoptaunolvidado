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
