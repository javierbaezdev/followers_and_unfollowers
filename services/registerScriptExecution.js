// services/registerScriptExecution.js
import ScriptExecutionLog from '../models/ScriptExecutionLog.js';
import getChileDate from '../utils/getChileDate.js';

/**
 * Registra o actualiza la ejecución de un script para una cuenta y plataforma.
 * @param {string} scriptName - Nombre del script (ej. 'checkNoMeSiguen')
 * @param {string} ownerUsername - Tu usuario en la red social (ej. 'javier123')
 * @param {string} platform - Red social (ej. 'instagram', 'tiktok', etc.)
 */
const registerScriptExecution = async (scriptName, ownerUsername, platform) => {
  try {
    await ScriptExecutionLog.findOneAndUpdate(
      {
        scriptName,
        ownerUsername,
        platform,
      },
      {
        executedAt: getChileDate(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log(
      `📝 Registro de ejecución actualizado para '${scriptName}' en ${platform} [${ownerUsername}]`
    );
  } catch (error) {
    console.error('❌ Error al registrar ejecución:', error.message);
  }
};

export default registerScriptExecution;
