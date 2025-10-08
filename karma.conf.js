// Archivo de configuración de Karma
// Documentación: https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // Puedes agregar opciones de configuración para Jasmine aquí
        // Opciones: https://jasmine.github.io/api/edge/Configuration.html
        // Ejemplo: desactivar aleatoriedad con `random: false` o fijar semilla `seed: 4321`
      },
      clearContext: false // deja visible la salida de Jasmine en el navegador
    },
    jasmineHtmlReporter: {
      suppressAll: true // elimina trazas duplicadas
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/davivienda-fan-shop-front-app'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
