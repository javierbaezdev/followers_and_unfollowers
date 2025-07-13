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
          { name: '👋 Dejar de seguir (dejarDeSeguir)', value: 'dejar' },
          {
            name: '⚙️ Comprobar si la conexión a MongoDB está funcionando',
            value: 'checkDb',
          },
          { name: '❌ Salir', value: 'exit' },
        ],
      },

      {
        type: 'input',
        name: 'accountNumber',
        message: '🔢 ¿Cuántas cuentas querés evaluar?',
        when: (res) => res.accion === 'check',
        validate: (val) => {
          if (val.trim() === '') return true; // permite ENTER vacío (será undefined)
          const parsed = parseInt(val);
          return !isNaN(parsed) && parsed > 0
            ? true
            : 'Debe ser un número mayor a cero';
        },
      },
      {
        type: 'confirm',
        name: 'skipcooldown',
        message: '¿Quieres saltarte el cooldown?',
        when: (res) => res.accion === 'dejar',
        default: false,
      },
    ])
    .then((res) => {
      switch (res.accion) {
        case 'get':
          ejecutarScript('instagram.getFollowing.js');
          break;
        case 'check':
          ejecutarScript('instagram.checkNotFollowingMe.js', [
            '--accountNumber',
            res.accountNumber,
          ]);
          break;
        case 'dejar':
          ejecutarScript('instagram.unfollow.js', [
            '--skipcooldown',
            res.skipcooldown,
          ]);
          break;
        case 'checkDb':
          ejecutarScript('checkDb.js', ['checkDb']);
          break;
        case 'exit':
          console.log('\n👋 Cerrando aplicación.\n');
          process.exit(0);
      }
    });
}

function ejecutarScript(script, args = []) {
  console.log(`\n🚀 Ejecutando ${script}...\n`);

  const proceso = spawn('node', [script, ...args], {
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
