// services/deleteUnfollowedAccount.js
import UnfollowedAccount from '../models/UnfollowedAccount.js';

/**
 * Elimina un registro de "no me sigue".
 * @param {string} unfollowerUsername - La cuenta a eliminar
 * @param {string} ownerUsername - Tu cuenta
 * @param {string} platform - Red social
 */
const deleteUnfollowedAccount = async (
  unfollowerUsername,
  ownerUsername,
  platform
) => {
  try {
    const result = await UnfollowedAccount.findOneAndDelete({
      unfollowerUsername,
      ownerUsername,
      platform,
    });

    if (result) {
      console.log(
        `🗑️ Eliminado: ${unfollowerUsername} (${platform}):BD:UnfollowedAccount`
      );
    } else {
      console.log(
        `⚠️ No se encontró el registro de: ${unfollowerUsername} (${platform}):BD:UnfollowedAccount`
      );
    }
  } catch (error) {
    console.error('❌ Error al eliminar UnfollowedAccount:', error.message);
  }
};

export default deleteUnfollowedAccount;
