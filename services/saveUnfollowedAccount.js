// services/saveUnfollowedAccount.js
import UnfollowedAccount from '../models/UnfollowedAccount.js';

/**
 * Crea o actualiza un registro de "no me sigue".
 * @param {Object} data
 * @param {string} data.unfollowerUsername - La cuenta que no te sigue
 * @param {string} data.ownerUsername - Tu cuenta
 * @param {string} data.platform - Red social (ej. instagram)
 * @param {boolean} [data.ignored] - Si debe ignorarse este registro (lista blanca)
 * @param {string} [data.fullName]
 * @param {string} [data.bio]
 * @param {string} [data.profileImageUrl]
 */
const saveUnfollowedAccount = async ({
  unfollowerUsername,
  ownerUsername,
  platform,
  ignored = false,
  fullName,
  bio,
  profileImageUrl,
}) => {
  try {
    await UnfollowedAccount.findOneAndUpdate(
      { unfollowerUsername, ownerUsername, platform },
      { ignored, fullName, bio, profileImageUrl },
      { upsert: true, new: true }
    );

    console.log(
      `🚫 Guardado como 'no me sigue': ${unfollowerUsername} (${platform}) ${
        ignored ? '[IGNORADO]' : ''
      }`
    );
  } catch (error) {
    console.error('❌ Error al guardar UnfollowedAccount:', error.message);
  }
};

export default saveUnfollowedAccount;
