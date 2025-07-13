// services/saveFollowedAccount.js
import FollowedAccount from '../models/FollowedAccount.js';

/**
 * Crea o actualiza una cuenta seguida por el usuario.
 * @param {Object} data - Datos de la cuenta seguida
 * @param {string} data.followedUsername - Username de la persona que estás siguiendo
 * @param {string} data.ownerUsername - Tu nombre de usuario en la red social
 * @param {string} data.platform - Red social (ej: 'instagram', 'tiktok')
 * @param {string} [data.fullName] - Nombre completo de la persona seguida (opcional)
 * @param {string} [data.bio] - Bio o descripción de perfil (opcional)
 * @param {string} [data.profileImageUrl] - URL de imagen de perfil (opcional)
 */
const saveFollowedAccount = async ({
  followedUsername,
  ownerUsername,
  platform,
  fullName,
  bio,
  profileImageUrl,
}) => {
  try {
    await FollowedAccount.findOneAndUpdate(
      { followedUsername, ownerUsername, platform },
      { fullName, bio, profileImageUrl },
      { upsert: true, new: true }
    );

    console.log(
      `✅ Cuenta seguida guardada: ${followedUsername} [${platform}]`
    );
  } catch (error) {
    console.error('❌ Error al guardar FollowedAccount:', error.message);
  }
};

export default saveFollowedAccount;
