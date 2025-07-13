import puppeteer from 'puppeteer';
import { loginInstagram } from './utils/instagram/loginInstagram.js';
import { CONFIG } from './constans/index.js';
import {
  deleteFollowedAccount,
  getFollowedAccounts,
  getIgnoredAccounts,
  saveUnfollowedAccount,
} from './services/index.js';
import connectDB from './db/index.js';
import { saveLastRunTime } from './utils/index.js';

const YOUR_USERNAME = CONFIG.INTAGRAM_USERNAME; // <-- tu usuario de Instagram
const YOUR_PASSWORD = CONFIG.INTAGRAM_PASSWORD; // <-- tu contraseña de Instagram

const TOME_OUT_POST_GO_TO_PROFILE_USER = 1500;
const TIME_OUT_POST_CLICK_FOLLOWING_BUTOON = 1500;
const TIME_OUT_POST_SEARCH_MY_NICKNAME_IN_BAR = 1500;
const TIME_OUT_POST_ADD_IN_ARRAY_NO_TE_SIGUEN = 500;

const SHOW_BROWSER = false;

// 👉 Captura el argumento desde consola
const args = process.argv.slice(2);
let EVALUATE_ACCOUNT_NUMBER = CONFIG.EVALUATE_ACCOUNT_NUMBER; // <-- cuantos usuarios evaluar

const index = args.indexOf('--accountNumber');
if (index !== -1 && args[index + 1]) {
  const parsed = parseInt(args[index + 1], 10);
  if (!isNaN(parsed)) {
    EVALUATE_ACCOUNT_NUMBER = parsed;
  }
}

(async () => {
  await connectDB(false);
  const accounts = await getFollowedAccounts({
    ownerUsername: YOUR_USERNAME,
    platform: 'instagram',
    limit: EVALUATE_ACCOUNT_NUMBER,
  });
  const ignoredList = await getIgnoredAccounts({
    ownerUsername: YOUR_USERNAME,
    platform: 'instagram',
  });

  if (!accounts.length) {
    console.log('⚠️ No se encontraron cuentas seguidas.');
    return;
  }

  const unfollowerUser = [];

  const browser = await puppeteer.launch({
    headless: !SHOW_BROWSER,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  await page.setUserAgent(CONFIG.PUPPETEER.USER_AGENT);

  await loginInstagram(page, YOUR_USERNAME, YOUR_PASSWORD);

  for (const [index, account] of accounts.entries()) {
    const { followedUsername: user } = account;
    try {
      const isIgnored = ignoredList.find(
        (ignored) => ignored.ignoredUsername === user
      );

      const profileUrl = `https://www.instagram.com/${user}/`;

      console.log(`🔎 (${index + 1}/${accounts.length}) Revisando ${user}...`);

      await page.goto(profileUrl, { waitUntil: 'networkidle2' });

      await new Promise((resolve) =>
        setTimeout(resolve, TOME_OUT_POST_GO_TO_PROFILE_USER)
      );

      const followingBtn = await page.$('a[href$="/following/"]');
      if (!followingBtn) {
        console.log(
          `⚠️ No se encontró botón de 'seguidos' en ${user}, registrando en base de datos`
        );

        await saveUnfollowedAccount({
          unfollowerUsername: user,
          ownerUsername: YOUR_USERNAME,
          platform: 'instagram',
          ignored: !!isIgnored,
        });

        unfollowerUser.push(user);
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
      console.log(
        '======================================================================'
      );
      if (!teSigue) {
        unfollowerUser.push(user);
        await saveUnfollowedAccount({
          unfollowerUsername: user,
          ownerUsername: YOUR_USERNAME,
          platform: 'instagram',
          ignored: !!isIgnored,
        });
        console.log(`❌ ${user} NO te sigue, registrando en base de datos`);
      } else {
        console.log(`✅ ${user} SÍ te sigue`);
      }

      await deleteFollowedAccount(user, YOUR_USERNAME, 'instagram');
      console.log(
        '======================================================================'
      );

      await page.keyboard.press('Escape');
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.log(`❌ Error con ${user}:`, error.message);
    }

    await new Promise((resolve) =>
      setTimeout(resolve, TIME_OUT_POST_ADD_IN_ARRAY_NO_TE_SIGUEN)
    );
  }

  await saveLastRunTime(
    'instagram.checkNotFollowingMe',
    YOUR_USERNAME,
    'instagram'
  );

  console.log(
    `\n📝 Total de cuentas que se registraron en base de datos: (${unfollowerUser.length}!)`
  );

  await browser.close();
  process.exit(0);
})();
