// carga.js
import connectDB from './db/index.js';
import saveFollowedAccountsBulk from './services/saveFollowedAccountsBulk.js';
import fs from 'fs';

const main = async () => {
  console.log('🚀 Iniciando ejecución del script');

  await connectDB();
  console.log('✅ Conectado a MongoDB');

  let seguidos;

  try {
    console.log('📁 Leyendo archivo JSON...');
    const contenido = fs.readFileSync('seguidos_itsnuxll.json', 'utf-8');
    seguidos = JSON.parse(contenido);
    console.log(`🧾 Leídos ${seguidos.length} usernames desde el JSON`);
  } catch (error) {
    console.error('❌ Error al leer o parsear el archivo JSON:', error.message);
    return;
  }

  const data = seguidos.map((username) => ({
    followedUsername: username,
    ownerUsername: 'itsnuxll',
    platform: 'instagram',
  }));

  if (!data.length) {
    console.log('⚠️ Archivo leído pero sin usernames válidos.');
    return;
  }

  console.log('📦 Llamando a saveFollowedAccountsBulk...');
  await saveFollowedAccountsBulk(data);
};

main().catch((err) => {
  console.error('❌ Error inesperado en ejecución:', err.message);
});
