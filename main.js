import inquirer from 'inquirer';
import { spawn } from 'child_process';

function menu() {
  console.clear();
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'accion',
        message: '📸 ¿Qué acción querés ejecutar?',
        choices: [
          { name: '📥 Obtener seguidos (getFollowing)', value: 'get' },
          {
            name: '👀 Ver quién no te sigue (checkNoMeSiguen)',
            value: 'check',
          },
          {
            name: '👋 Dejar de seguir (dejarDeSeguir)',
            value: 'dejar',
          },
          { name: '❌ Salir', value: 'exit' },
        ],
      },
    ])
    .then((res) => {
      switch (res.accion) {
        case 'get':
          ejecutarScript('instagram.getFollowing.js');
          break;
        case 'check':
          ejecutarScript('instagram.checkNoMeSiguen.js');
          break;
        case 'dejar':
          ejecutarScript('instagram.dejarDeSeguir.js');
          break;
        case 'exit':
          console.log('\n👋 Cerrando aplicación.\n');

          process.exit(0);
      }
    });
}

function ejecutarScript(script) {
  console.log(`\n🚀 Ejecutando ${script}...\n`);

  const proceso = spawn('node', [script], {
    stdio: 'inherit', // Esto permite mostrar los logs en tiempo real
    shell: true,
  });

  proceso.on('close', (code) => {
    console.log(`\n✅ Script finalizado con código: ${code}\n`);
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'volver',
          message: '¿Volver al menú principal?',
          default: true,
        },
      ])
      .then((res) => {
        if (res.volver) {
          menu();
        } else {
          console.log('\n👋 Hasta luego.\n');

          process.exit(0);
        }
      });
  });
}

menu();
