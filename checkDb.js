import connectDB from './db/index.js';

// Captura argumentos (ej: ['checkDb'])
const args = process.argv.slice(2);

// Detecta si se pasó el flag 'checkDb'
const IS_CHECK = args.includes('checkDb');

(async () => {
  await connectDB(IS_CHECK);

  // Tu lógica aquí
})();
