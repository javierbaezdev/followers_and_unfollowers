// utils/getChileDate.js
import { DateTime } from 'luxon';

/**
 * Retorna un objeto `Date` en la zona horaria de Chile (America/Santiago)
 * @returns {Date} Fecha y hora actuales en Chile
 */
const getChileDate = () => {
  return DateTime.now().setZone('America/Santiago').toJSDate();
};

export default getChileDate;
