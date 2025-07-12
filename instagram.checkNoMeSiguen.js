import puppeteer from 'puppeteer';
import fs from 'fs';
import { loginInstagram } from './utils/instagram/loginInstagram.js';
import { CONFIG } from './constans/index.js';

const YOUR_USERNAME = CONFIG.INTAGRAM_USERNAME; // <-- tu usuario de Instagram
const YOUR_PASSWORD = CONFIG.INTAGRAM_PASSWORD; // <-- tu contraseña de Instagram
const JSON_FILE_NAME = CONFIG.FOLLOWED_OUT_PUT_FILE_NAME; // <-- nombre del archivo de seguidos
const OUT_PUT_FILE_NAME = CONFIG.DONT_FOLLOW_ME_OUT_PUT_FILE_NAME; // <-- nombre del archivo de no me siguen
const EVALUATE_ACCOUNT_NUMBER = CONFIG.EVALUATE_ACCOUNT_NUMBER; // <-- cuantos usuarios evaluar

const TOME_OUT_POST_GO_TO_PROFILE_USER = 1500;
const TIME_OUT_POST_CLICK_FOLLOWING_BUTOON = 1500;
const TIME_OUT_POST_SEARCH_MY_NICKNAME_IN_BAR = 1500;
const TIME_OUT_POST_ADD_IN_ARRAY_NO_TE_SIGUEN = 500;

const SHOW_BROWSER = false;

(async () => {
  const seguidos = JSON.parse(fs.readFileSync(JSON_FILE_NAME, 'utf-8'));
  const evaluados = seguidos.slice(0, EVALUATE_ACCOUNT_NUMBER);
  const restantes = seguidos.slice(EVALUATE_ACCOUNT_NUMBER);

  const noTeSiguen = [];

  const browser = await puppeteer.launch({
    headless: !SHOW_BROWSER,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  await page.setUserAgent(CONFIG.PUPPETEER.USER_AGENT);

  await loginInstagram(page, YOUR_USERNAME, YOUR_PASSWORD);

  for (const [index, user] of evaluados.entries()) {
    try {
      const profileUrl = `https://www.instagram.com/${user}/`;
      console.log(
        `🔎 (${index + 1}/${evaluados.length}/${seguidos.length}) Revisando ${user}...`
      );
      await page.goto(profileUrl, { waitUntil: 'networkidle2' });

      await new Promise((resolve) =>
        setTimeout(resolve, TOME_OUT_POST_GO_TO_PROFILE_USER)
      );

      const followingBtn = await page.$('a[href$="/following/"]');
      if (!followingBtn) {
        console.log(`⚠️ No se encontró botón de 'seguidos' en ${user}`);
        noTeSiguen.push(user);
        continue;
      }

      await followingBtn.click();

      // Esperar que aparezca el modal
      await page.waitForSelector('div[role="dialog"]', { timeout: 5000 });
      await new Promise((resolve) =>
        setTimeout(resolve, TIME_OUT_POST_CLICK_FOLLOWING_BUTOON)
      );

      // Buscar dentro del modal si estás en su lista de seguidos
      const input = await page.$('div[role="dialog"] input');
      if (!input) {
        console.log(
          `⚠️ No se encontró input de búsqueda en el modal de ${user}`
        );
        continue;
      }

      await input.click({ clickCount: 3 });
      await input.type(YOUR_USERNAME, { delay: 0 });
      await new Promise((resolve) =>
        setTimeout(resolve, TIME_OUT_POST_SEARCH_MY_NICKNAME_IN_BAR)
      );

      const result = await page.$$eval(
        'div[role="dialog"] a[href^="/"]',
        (links) => links.map((a) => a.getAttribute('href').replace(/\//g, ''))
      );

      const teSigue = result.includes(YOUR_USERNAME);

      if (!teSigue) {
        noTeSiguen.push(user);
        console.log(`❌ ${user} NO te sigue`);
      } else {
        console.log(`✅ ${user} SÍ te sigue`);
      }

      await page.keyboard.press('Escape');
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.log(`❌ Error con ${user}:`, error.message);
    }

    await new Promise((resolve) =>
      setTimeout(resolve, TIME_OUT_POST_ADD_IN_ARRAY_NO_TE_SIGUEN)
    );
  }

  fs.writeFileSync(OUT_PUT_FILE_NAME, JSON.stringify(noTeSiguen, null, 2));

  // Actualizar el JSON original quitando los evaluados
  fs.writeFileSync(JSON_FILE_NAME, JSON.stringify(restantes, null, 2));

  console.log(
    `\n📝 Guardado como no_me_siguen.json (${noTeSiguen.length} personas no te siguen)`
  );

  console.log(
    `📝 Actualizado archivo ${JSON_FILE_NAME} con ${restantes.length} cuentas restantes.`
  );

  await browser.close();
})();
