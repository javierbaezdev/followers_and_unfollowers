import puppeteer from 'puppeteer';

import { loginInstagram } from './utils/instagram/loginInstagram.js';
import { hasCooldownPassed, saveLastRunTime } from './utils/index.js';
import { CONFIG } from './constans/index.js';
import {
  deleteUnfollowedAccount,
  getUnfollowedAccounts,
} from './services/index.js';
import connectDB from './db/index.js';

const USERNAME = CONFIG.INTAGRAM_USERNAME;
const PASSWORD = CONFIG.INTAGRAM_PASSWORD;

const UNFOLLOW_ACCOUNT_MAX_NUMBER = CONFIG.UNFOLLOW_ACCOUNT_MAX_NUMBER;

const SHOW_BROWSER = false;

const args = process.argv.slice(2);
const shouldSkipCooldown =
  args.includes('--skipCooldown') &&
  args[args.indexOf('--skipCooldown') + 1] === 'true';

(async () => {
  await connectDB(false);

  if (shouldSkipCooldown) {
    if (
      !(await hasCooldownPassed('instagram.unfollow', USERNAME, 'instagram'))
    ) {
      process.exit(1);
    }
  }

  const users = await getUnfollowedAccounts({
    ownerUsername: USERNAME,
    platform: 'instagram',
    limit: UNFOLLOW_ACCOUNT_MAX_NUMBER,
  });

  if (!users.length) {
    console.log('⚠️ No se encontraron cuentas que no te siguen.');
    return;
  }

  const browser = await puppeteer.launch({
    headless: !SHOW_BROWSER,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  await page.setUserAgent(CONFIG.PUPPETEER.USER_AGENT);

  await loginInstagram(page, USERNAME, PASSWORD);

  const faltanPorEliminar = [];

  for (const [index, u] of users.entries()) {
    const { unfollowerUsername: user } = u;
    try {
      const profileUrl = `https://www.instagram.com/${user}/`;
      console.log(
        `(${index + 1}/${users.length}) 🔎 Visitando perfil: ${user}`
      );
      await page.goto(profileUrl, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 2000));

      // Buscar botón que diga "Siguiendo"
      const botones = await page.$$('header button');
      let siguiendoBtn = null;

      for (const btn of botones) {
        const text = await page.evaluate((el) => el.innerText, btn);
        if (text.includes('Siguiendo')) {
          siguiendoBtn = btn;
          break;
        }
      }

      if (!siguiendoBtn) {
        console.log(`⚠️ No estás siguiendo a ${user} o botón no detectado`);
        await deleteUnfollowedAccount(user, USERNAME, 'instagram');
        continue;
      }

      await siguiendoBtn.click();
      await new Promise((r) => setTimeout(r, 1000));

      // Confirmar "Dejar de seguir"
      await new Promise((r) => setTimeout(r, 1000)); // espera al modal

      const confirmBtn = await page.evaluateHandle(() => {
        const botones = Array.from(
          // eslint-disable-next-line no-undef
          document.querySelectorAll('div[role="button"]')
        );
        return (
          botones.find((btn) => btn.textContent.includes('Dejar de seguir')) ||
          null
        );
      });
      console.log(
        '======================================================================'
      );
      if (confirmBtn) {
        await confirmBtn.click();
        await deleteUnfollowedAccount(user, USERNAME, 'instagram');
        console.log(`❌ Dejaste de seguir a ${user}`);
      } else {
        console.log('⚠️ No se encontró botón para confirmar dejar de seguir.');
        faltanPorEliminar.push(user);
      }
      console.log(
        '======================================================================'
      );
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      console.log(`❌ Error al procesar ${user}: ${error.message}`);
      faltanPorEliminar.push(user);
    }
  }

  if (faltanPorEliminar.length) {
    console.log('⚠️ No se pudo dejar de seguir a:');
    console.log(faltanPorEliminar.join(', '));
  } else {
    console.log(
      '✅ Todos los usuarios han sido eliminados de la base de datos.'
    );
  }

  await saveLastRunTime('instagram.unfollow', USERNAME, 'instagram');

  await browser.close();
  process.exit(0);
})();
