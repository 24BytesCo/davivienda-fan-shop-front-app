/**
 * Este archivo incluye polyfills requeridos por Angular y se carga antes de la app.
 * Puedes añadir tus propios polyfills aquí si lo necesitas.
 *
 * Este archivo se divide en 2 secciones:
 *   1. Polyfills de navegador. Se aplican antes de cargar ZoneJS y se ordenan por navegador.
 *   2. Importaciones de la aplicación. Archivos importados después de ZoneJS que deben cargarse
 *      antes del archivo principal.
 *
 * La configuración actual apunta a navegadores “evergreen”; últimas versiones que se actualizan solas
 * (Safari >= 10, Chrome >= 55 —incluye Opera—, Edge >= 13 en escritorio, y iOS 10/Chrome en móvil).
 *
 * Más info: https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * POLYFILLS DE NAVEGADOR
 */

/**
 * IE11 requiere lo siguiente para soporte de NgClass en elementos SVG
 */
// import 'classlist.js';  // Ejecuta `npm install --save classlist.js`.

/**
 * Web Animations `@angular/platform-browser/animations`
 * Requerido solo si usas AnimationBuilder con IE/Edge o Safari.
 * El soporte estándar de animaciones en Angular NO requiere polyfills (desde Angular 6.0).
 */
// import 'web-animations-js';  // Ejecuta `npm install --save web-animations-js`.

/**
 * Por defecto, zone.js parchea macroTareas y DomEvents.
 * Puedes desactivar partes del parcheo con estas banderas (deben definirse antes de cargar zone.js).
 * Debido a que webpack coloca los imports al inicio del bundle, crea un archivo separado en este
 * directorio (p. ej. zone-flags.ts), define allí las banderas y luego importa:
 * import './zone-flags';
 *
 * Banderas permitidas en zone-flags.ts:
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // desactiva parcheo de rAF
 * (window as any).__Zone_disable_on_property = true; // desactiva parcheo de propiedades como onclick
 * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // desactiva eventos listados
 *
 * En IE/Edge DevTools, addEventListener también se envuelve por zone.js; con la siguiente bandera evita el parcheo:
 * (window as any).__Zone_enable_cross_context_check = true;
 */

/***************************************************************************************************
 * Zone JS es requerido por Angular.
 */
import 'zone.js';  // Incluido con Angular CLI.


/***************************************************************************************************
 * IMPORTES DE LA APLICACIÓN
 */
