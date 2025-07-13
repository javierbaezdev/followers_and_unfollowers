// services/saveFollowedAccountsBulk.js
import FollowedAccount from '../models/FollowedAccount.js';

/**
 * Guarda o actualiza múltiples cuentas seguidas en bulk.
 * @param {Array<Object>} accounts - Lista de cuentas seguidas
 * Cada objeto debe contener:
 *   - followedUsername (string)
 *   - ownerUsername (string)
 *   - platform (string)
 *   - fullName (string, opcional)
 *   - bio (string, opcional)
 *   - profileImageUrl (string, opcional)
 */
const saveFollowedAccountsBulk = async (accounts = []) => {
  if (!accounts.length) {
    console.log('⚠️ No se recibieron cuentas para guardar.');
    return;
  }
  console.log('📝 Guardando cuentas seguidas...');

  const operations = accounts.map((acc) => ({
    updateOne: {
      filter: {
        followedUsername: acc.followedUsername,
        ownerUsername: acc.ownerUsername,
        platform: acc.platform,
      },
      update: {
        $set: {
          fullName: acc.fullName,
          bio: acc.bio,
          profileImageUrl: acc.profileImageUrl,
        },
      },
      upsert: true,
    },
  }));

  try {
    const result = await FollowedAccount.bulkWrite(operations);
    console.log(`✅ Bulk insert/update ejecutado:
    ↪️  Modificados: ${result.nModified}
    ➕ Insertados: ${result.nUpserted}`);
  } catch (error) {
    console.error('❌ Error en bulkWrite de FollowedAccount:', error.message);
  }
};

export default saveFollowedAccountsBulk;
