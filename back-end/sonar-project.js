const { scan } = require('sonarqube-scanner');
scan(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.projectKey': 'backend-express-drizzle',
      'sonar.projectName': 'Backend Express con Drizzle',
      'sonar.token': 'IL_TUO_SONAR_TOKEN_QUI',

      // Cartelle da analizzare
      'sonar.sources': 'src',

      // Esclusioni critiche per lo stack Drizzle/Node
      'sonar.exclusions': [
        'node_modules/**',
        'dist/**',
        'src/db/migrations/**', // Salta le migrazioni generate da drizzle-kit
        '**/*.spec.ts',          // Esclude i file di test dall'analisi del codice sorgente
        '**/*.test.ts'
      ].join(','),

      // Configurazione dei Test e della Coverage
      'sonar.tests': 'src',
      'sonar.test.inclusions': 'src/**/*.spec.ts,src/**/*.test.ts',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    }
  },
  () => process.exit()
);