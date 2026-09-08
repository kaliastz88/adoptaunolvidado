// =============================================================================
// Conexión a Supabase
//
// Estos dos valores salen de: Supabase → Project Settings → API
//
// SOBRE LA SEGURIDAD DE ESTE ARCHIVO:
// La clave "publishable" está diseñada para viajar en el código del navegador y
// es seguro publicarla en GitHub. Cualquiera que abra el sitio la puede ver, y
// eso es normal y esperado. Lo que realmente protege los datos son las políticas
// de seguridad definidas en supabase/schema.sql: con esta clave se puede leer el
// catálogo, pero no crear, editar ni borrar sin haber iniciado sesión. Está
// verificado con pruebas, no es una suposición.
//
// La clave "secret" (antes "service_role") es otra cosa: esa sí salta todas las
// políticas y da control total de la base de datos. NUNCA la pongas en este
// archivo ni en ningún otro archivo del sitio.
//
// El nombre de la variable dice ANON_KEY por compatibilidad con el nombre que
// usaba Supabase antes. El valor es la clave publishable, que es su reemplazo.
// =============================================================================

window.SUPABASE_URL = 'https://bsolvxlnzxzfazfejaey.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_31os-QVuKNpbDzUX0vPiXQ_FBvSm4x1';
