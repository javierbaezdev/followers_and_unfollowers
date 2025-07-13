// services/deleteFollowedAccountsBulk.js
import FollowedAccount from '../models/FollowedAccount.js';

/**
 * Elimina múltiples registros de cuentas seguidas.
 * @param {Object} options - Opciones para filtrar qué eliminar
 * @param {string} options.ownerUsername - Tu usuario (obligatorio)
 * @param {string} options.platform - Plataforma (ej: instagram, tiktok)
 * @param {Array<string>} [options.usernames] - Lista opcional de usernames específicos a borrar
 */
const deleteFollowedAccountsBulk = async ({
  ownerUsername,
  platform,
  usernames = [],
}) => {
  try {
    const filter = { ownerUsername, platform };

    if (usernames.length > 0) {
      filter.followedUsername = { $in: usernames };
    }

    const result = await FollowedAccount.deleteMany(filter);

    console.log(`🗑️  Registros eliminados: ${result.deletedCount}`);
  } catch (error) {
    console.error(
      '❌ Error al hacer bulk delete en FollowedAccount:',
      error.message
    );
  }
};

export default deleteFollowedAccountsBulk;
