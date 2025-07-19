// showStatsByUser.js
import connectDB from './db/index.js';

import FollowedAccount from './models/FollowedAccount.js';
import UnfollowedAccount from './models/UnfollowedAccount.js';
import IgnoredAccount from './models/IgnoredAccount.js';
import ScriptExecutionLog from './models/ScriptExecutionLog.js';
import { DateTime } from 'luxon';
import { CONFIG } from './constans/index.js';

const USERNAME = CONFIG.INTAGRAM_USERNAME;

const run = async () => {
  try {
    await connectDB(false);

    const [followedCount, unfollowedCount, ignoredCount, logs] =
      await Promise.all([
        FollowedAccount.countDocuments({ ownerUsername: USERNAME }),
        UnfollowedAccount.countDocuments({ ownerUsername: USERNAME }),
        IgnoredAccount.countDocuments({ ownerUsername: USERNAME }),
        ScriptExecutionLog.find({ ownerUsername: USERNAME }).sort({
          executedAt: -1,
        }),
      ]);

    console.log(`📊 Resumen de registros para el usuario "${USERNAME}":\n`);
    console.log(`👥 Seguidos (FollowedAccount):      ${followedCount}`);
    console.log(`🚫 No te siguen (UnfollowedAccount): ${unfollowedCount}`);
    console.log(`🛡️  Ignorados (IgnoredAccount):       ${ignoredCount}`);

    console.log('\n📜 Historial de ejecución de scripts:');

    if (!logs.length) {
      console.log('⚠️  No se encontraron ejecuciones registradas.');
    } else {
      logs.forEach((log) => {
        const fechaChile = DateTime.fromJSDate(log.executedAt)
          .setZone('America/Santiago')
          .toFormat('yyyy-MM-dd HH:mm:ss');

        console.log(`  • ${log.scriptName} → ${fechaChile}`);
      });
    }
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error.message);
  } finally {
    process.exit(0);
  }
};

run();
