# Conectar las solicitudes con Google Sheets

Cuando esté listo, cada solicitud de **adopción, padrinos y alianzas** que llegue
por la página se copia sola a un Google Sheet, y se actualiza cuando el equipo
cambia su estado en el panel.

Hay que hacerlo **una sola vez**. Toma unos 10 minutos.

## 1. Crear el Sheet (en la cuenta de la organización)

1. Entra a Google Drive con la cuenta de Adopta un Olvidado (no una personal).
2. Crea una hoja de cálculo nueva, por ejemplo «Solicitudes — página web».
3. Compártela **solo** con el equipo. Tiene datos personales de los adoptantes.

## 2. Pegar el script

1. En el Sheet: menú **Extensiones → Apps Script**.
2. Borra lo que aparece y pega todo el contenido de `Codigo.gs`.
3. En la línea `const SECRETO = 'CAMBIA-ESTA-CLAVE';` cambia el texto por una
   frase larga inventada, por ejemplo `perritos-felices-2026-xk7q`. Anótala.
4. Guarda (ícono de disco).

## 3. Publicarlo

1. Botón azul **Implementar → Nueva implementación**.
2. En el engrane «Seleccionar tipo», elige **Aplicación web**.
3. **Ejecutar como:** Yo. **Quién tiene acceso:** Cualquier persona.
   (Es seguro: sin la clave del paso 2.3 el script no escribe nada.)
4. **Implementar** → acepta los permisos que pide Google.
5. Copia la **URL de la aplicación web** (termina en `/exec`).

## 4. Avisarle a la base de datos

En Supabase → SQL Editor → New query, pega esto con tus dos valores y presiona Run:

```sql
select vault.create_secret('LA-URL-QUE-TERMINA-EN-/exec', 'sheets_webhook_url');
select vault.create_secret('LA-FRASE-DEL-PASO-2.3', 'sheets_secreto');
select public.enviar_todo_a_sheets();
```

La última línea copia al Sheet todas las solicitudes que ya existían. En un par
de minutos aparecen las pestañas «Adopciones», «Padrinos» y «Alianzas».

## Si algo no llega

En el SQL Editor:

```sql
select status_code, content, created from net._http_response order by created desc limit 10;
```

`302` o `200` es que llegó bien (Google responde con una redirección, es normal). Si dice «clave incorrecta», la frase del script y la de
Supabase no son iguales.
