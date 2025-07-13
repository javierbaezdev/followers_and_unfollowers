import mongoose from 'mongoose';
import { CONFIG } from '../constans/index.js'; // asegúrate de que sea una ruta válida con .js

const connectDB = async (isCheck = false) => {
  try {
    const conn = await mongoose.connect(CONFIG.MONGO_URI, {});
    const uri = new URL(CONFIG.MONGO_URI);
    const dbUser = uri.username || 'No definido';

    console.log('🟢 MongoDB conectado:');
    console.log('  🧩 Host:', conn.connection.host);
    console.log('  📦 Base de datos:', conn.connection.name);
    console.log('  🔌 Puerto:', conn.connection.port);
    console.log(`  👤 Usuario: ${dbUser}`);
    console.log('  🔄 Estado:', conn.connection.readyState);
    if (isCheck) {
      process.exit(0);
    }
  } catch (error) {
    console.error('🔴 Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
