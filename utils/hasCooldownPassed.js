import { DateTime } from 'luxon';
import getChileDate from './getChileDate.js';

import {
  getScriptExecutionLog,
  registerScriptExecution,
} from '../services/index.js'; // <-- import services

import { CONFIG } from '../constans/index.js';

/**
 * Verifica si han pasado suficientes horas desde la última ejecución del script.
 * @param {string} scriptName - Nombre del script
 * @param {string} ownerUsername - Tu usuario
 * @param {string} platform - Plataforma (ej: instagram)
 * @param {number} hours - Cuántas horas deben pasar (default: desde CONFIG)
 * @returns {Promise<boolean>} true si se puede ejecutar, false si hay que esperar
 */
export const hasCooldownPassed = async (
  scriptName,
  ownerUsername,
  platform,
  hours = CONFIG.TIME_OUT_EXECUTE_SCRIPT
) => {
  const record = await getScriptExecutionLog(
    scriptName,
    ownerUsername,
    platform
  );

  if (!record?.executedAt) return true;

  const lastExecution = DateTime.fromJSDate(record.executedAt).setZone(
    'America/Santiago'
  );
  const ahora = DateTime.fromJSDate(getChileDate()).setZone('America/Santiago');

  const diff = ahora.diff(lastExecution, 'hours').hours;

  if (diff < hours) {
    const siguiente = lastExecution.plus({ hours });
    const minutosRestantes = Math.ceil(
      siguiente.diff(ahora, 'minutes').minutes
    );

    console.log(`⏳ Debes esperar al menos ${hours}h entre ejecuciones.`);
    console.log(
      `🕒 Próxima ejecución posible en ${minutosRestantes} minutos (a las ${siguiente.toFormat('HH:mm:ss')})`
    );
    return false;
  }

  return true;
};

/**
 * Guarda en base de datos la fecha de última ejecución del script.
 * @param {string} scriptName
 * @param {string} ownerUsername
 * @param {string} platform
 */
export const saveLastRunTime = async (scriptName, ownerUsername, platform) => {
  await registerScriptExecution(scriptName, ownerUsername, platform);
  console.log(
    `🕒 Script finalizado. Fecha de ejecución registrada en base de datos.`
  );
};
