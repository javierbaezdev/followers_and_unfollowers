// services/getScriptExecutionLog.js
import ScriptExecutionLog from '../models/ScriptExecutionLog.js';

/**
 * Trae el último registro de ejecución para un script.
 * @param {string} scriptName - Nombre del script (ej. 'formatedFollowingHandles')
 * @param {string} ownerUsername - Usuario que ejecuta
 * @param {string} platform - Red social
 * @returns {Object|null} El documento con `executedAt`, o null si no existe
 */
const getScriptExecutionLog = async (scriptName, ownerUsername, platform) => {
  try {
    const result = await ScriptExecutionLog.findOne({
      scriptName,
      ownerUsername,
      platform,
    });

    if (result) {
      console.log(`📌 Última ejecución encontrada: ${result.executedAt}`);
    } else {
      console.log(`ℹ️ No hay registro previo para ${scriptName}`);
    }

    return result;
  } catch (error) {
    console.error('❌ Error al obtener ScriptExecutionLog:', error.message);
    return null;
  }
};

export default getScriptExecutionLog;
