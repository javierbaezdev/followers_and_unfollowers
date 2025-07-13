import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  INTAGRAM_USERNAME: process.env.INTAGRAM_USERNAME,
  INTAGRAM_PASSWORD: process.env.INTAGRAM_PASSWORD,
  PUPPETEER: {
    USER_AGENT:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  },
  TIME_OUT_EXECUTE_SCRIPT: 2, // <-- 2 horas
  EVALUATE_ACCOUNT_NUMBER: 50, // <-- cuantos usuarios evaluar
  UNFOLLOW_ACCOUNT_MAX_NUMBER: 50, // <-- cuantos usuarios dejar de seguir
  MONGO_URI: process.env.MONGO_URI, // <-- uri de la base de datos
};
