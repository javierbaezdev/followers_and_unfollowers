// services/deleteFollowedAccount.js
import FollowedAccount from '../models/FollowedAccount.js';

/**
 * Elimina una cuenta seguida específica del usuario en una plataforma.
 * @param {string} followedUsername - Usuario que estás dejando de seguir
 * @param {string} ownerUsername - Tu usuario (quien lo seguía)
 * @param {string} platform - Red social (instagram, tiktok, etc.)
 */
const deleteFollowedAccount = async (
  followedUsername,
  ownerUsername,
  platform
) => {
  try {
    const result = await FollowedAccount.findOneAndDelete({
      followedUsername,
      ownerUsername,
      platform,
    });

    if (result) {
      console.log(
        `🗑️  Cuenta eliminada: ${followedUsername} (${platform}):BD:FollowedAccount`
      );
    } else {
      console.log(
        `⚠️  No se encontró la cuenta: ${followedUsername} (${platform}):BD:FollowedAccount`
      );
    }
  } catch (error) {
    console.error('❌ Error al eliminar FollowedAccount:', error.message);
  }
};

export default deleteFollowedAccount;
