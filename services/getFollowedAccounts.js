// services/getFollowedAccounts.js
import FollowedAccount from '../models/FollowedAccount.js';

/**
 * Obtiene los registros de cuentas seguidas para un usuario.
 * @param {Object} options
 * @param {string} options.ownerUsername - Tu nombre de usuario
 * @param {string} options.platform - Red social (ej: instagram)
 * @param {number} options.limit - Máximo número de registros a traer
 * @returns {Array<Object>} Lista de cuentas seguidas
 */
const getFollowedAccounts = async ({ ownerUsername, platform, limit }) => {
  try {
    const results = await FollowedAccount.find({ ownerUsername, platform })
      .sort({ createdAt: -1 }) // más recientes primero
      .limit(limit);

    console.log(`📥 Obtenidos ${results.length} registros de FollowedAccount`);
    return results;
  } catch (error) {
    console.error('❌ Error al obtener FollowedAccounts:', error.message);
    return [];
  }
};

export default getFollowedAccounts;
