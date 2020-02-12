let glob = require('glob-all')
let mix = require('laravel-mix');
const tailwindcss = require('tailwindcss')
require('laravel-mix-purgecss')

mix.sass('src/sass/app.scss', 'dist/tailwind.css')
    .options({
      processCssUrls: false,
      postCss: [tailwindcss('./tailwind.config.js')],
    });

// mix.sass('src/sass/app.scss', 'src/css')
// mix.postCss('src/css/app.css', 'dist/tailwind.css', [
//       require('tailwindcss'),
//     ])
//     .purgeCss({
//       enabled: false, // Remove this line to enable PurgeCSS.
//       paths: () => glob.sync([
//         path.join(__dirname, '**/*.twig'),
//         '/var/www/sites/*/{modules,themes}/custom/**/*.twig',
//         '/var/www/{modules,themes}/custom/**/*.twig',
//       ]),
//       whitelistPatterns: [],
//       whitelistPatternsChildren: []
//     })
