import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  INTAGRAM_USERNAME: process.env.INTAGRAM_USERNAME,
  INTAGRAM_PASSWORD: process.env.INTAGRAM_PASSWORD,
  FOLLOWED_OUT_PUT_FILE_NAME: process.env.JSON_OUT_PUT_FILE_NAME,
  DONT_FOLLOW_ME_OUT_PUT_FILE_NAME: process.env.NO_ME_SIGUEN_OUT_PUT_FILE_NAME,
  PUPPETEER: {
    USER_AGENT:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  },
  TIME_OUT_EXECUTE_SCRIPT: 2, // <-- 2 horas
  LAST_RUN_FILE: 'last_unfollow_time', // <-- json donde se guarda la última fecha de ejecución
  EVALUATE_ACCOUNT_NUMBER: 50, // <-- cuantos usuarios evaluar
  UNFOLLOW_ACCOUNT_MAX_NUMBER: 50, // <-- cuantos usuarios dejar de seguir
};
