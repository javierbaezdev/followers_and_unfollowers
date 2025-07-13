// services/getUnfollowedAccounts.js
import UnfollowedAccount from '../models/UnfollowedAccount.js';

/**
 * Obtiene los registros de cuentas que no te siguen y no están ignoradas.
 * @param {Object} options
 * @param {string} options.ownerUsername - Tu nombre de usuario
 * @param {string} options.platform - Red social (ej: instagram)
 * @param {number} options.limit - Máximo número de registros a traer
 * @returns {Array<Object>} Lista de cuentas que no te siguen
 */
const getUnfollowedAccounts = async ({ ownerUsername, platform, limit }) => {
  try {
    const results = await UnfollowedAccount.find({
      ownerUsername,
      platform,
      ignored: false, // ✅ Filtrar solo las no ignoradas
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    console.log(
      `📥 Obtenidos ${results.length} registros de UnfollowedAccount (no ignorados)`
    );
    return results;
  } catch (error) {
    console.error('❌ Error al obtener UnfollowedAccounts:', error.message);
    return [];
  }
};

export default getUnfollowedAccounts;
