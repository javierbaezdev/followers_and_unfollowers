import fs from 'fs';
import { CONFIG } from '../constans/index.js';

export const hasCooldownPassed = (hours = CONFIG.TIME_OUT_EXECUTE_SCRIPT) => {
  if (!fs.existsSync(CONFIG.LAST_RUN_FILE)) return true;

  const data = JSON.parse(fs.readFileSync(CONFIG.LAST_RUN_FILE, 'utf-8'));
  const lastRun = new Date(data.lastRun);
  const now = new Date();
  const diffHours = (now - lastRun) / (1000 * 60 * 60);

  if (diffHours < hours) {
    const nextRun = new Date(lastRun.getTime() + hours * 60 * 60 * 1000);
    const minutesLeft = Math.ceil((nextRun - now) / (1000 * 60));
    console.log(
      `⏳ Debes esperar al menos ${hours} horas entre ejecuciones.\n🕒 Podrás volver a ejecutar este script en ${minutesLeft} minutos.`
    );
    return false;
  }

  return true;
};

export const saveLastRunTime = () => {
  fs.writeFileSync(
    CONFIG.LAST_RUN_FILE,
    JSON.stringify({ lastRun: new Date().toISOString() }, null, 2)
  );
  console.log(
    `🕒 Script finalizado. Fecha de ejecución guardada en ${CONFIG.LAST_RUN_FILE}`
  );
};
