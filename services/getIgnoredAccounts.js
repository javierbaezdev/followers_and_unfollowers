// services/getIgnoredAccounts.js
import IgnoredAccount from '../models/IgnoredAccount.js';

/**
 * Obtiene todas las cuentas ignoradas (lista blanca) para un usuario y plataforma.
 * @param {Object} options
 * @param {string} options.ownerUsername - Tu nombre de usuario
 * @param {string} options.platform - Red social (ej: instagram, tiktok)
 * @returns {Array<Object>} Lista de cuentas ignoradas
 */
const getIgnoredAccounts = async ({ ownerUsername, platform }) => {
  try {
    const results = await IgnoredAccount.find({
      ownerUsername,
      platform,
    }).lean();

    console.log(
      `📥 Obtenidas ${results.length} cuentas ignoradas (${platform}) para ${ownerUsername}`
    );

    return results;
  } catch (error) {
    console.error('❌ Error al obtener cuentas ignoradas:', error.message);
    return [];
  }
};

export default getIgnoredAccounts;
