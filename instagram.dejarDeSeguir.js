import puppeteer from 'puppeteer';
import fs from 'fs';
import { loginInstagram } from './utils/instagram/loginInstagram.js';
import {
  hasCooldownPassed,
  saveLastRunTime,
} from './utils/hasCooldownPassed.js';
import { CONFIG } from './constans/index.js';
import dotenv from 'dotenv';

dotenv.config();

const USERNAME = CONFIG.INTAGRAM_USERNAME;
const PASSWORD = CONFIG.INTAGRAM_PASSWORD;
const JSON_FILE_NAME = CONFIG.DONT_FOLLOW_ME_OUT_PUT_FILE_NAME;
const UNFOLLOW_ACCOUNT_MAX_NUMBER = CONFIG.UNFOLLOW_ACCOUNT_MAX_NUMBER;

const SHOW_BROWSER = false;

(async () => {
  if (!hasCooldownPassed()) process.exit(1);

  const users = JSON.parse(fs.readFileSync(JSON_FILE_NAME, 'utf-8'));
  const evaluados = users.slice(0, UNFOLLOW_ACCOUNT_MAX_NUMBER);
  const restantes = users.slice(UNFOLLOW_ACCOUNT_MAX_NUMBER);

  const browser = await puppeteer.launch({
    headless: !SHOW_BROWSER,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  await page.setUserAgent(CONFIG.PUPPETEER.USER_AGENT);

  await loginInstagram(page, USERNAME, PASSWORD);

  const faltanPorEliminar = [];

  for (const [index, user] of evaluados.entries()) {
    try {
      const profileUrl = `https://www.instagram.com/${user}/`;
      console.log(
        `(${index + 1}/${evaluados.length}/${users.length}) 🔎 Visitando perfil: ${user}`
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

      if (confirmBtn) {
        await confirmBtn.click();
        console.log(`❌ Dejaste de seguir a ${user}`);
      } else {
        console.log('⚠️ No se encontró botón para confirmar dejar de seguir.');
        faltanPorEliminar.push(user);
      }

      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      console.log(`❌ Error al procesar ${user}: ${error.message}`);
      faltanPorEliminar.push(user);
    }
  }

  // Guardar solo los que faltan (fallaron o no se pudo)
  fs.writeFileSync(
    JSON_FILE_NAME,
    JSON.stringify([...restantes, ...faltanPorEliminar], null, 2)
  );
  console.log(
    `\n📝 Archivo actualizado. Faltan por dejar de seguir: ${faltanPorEliminar.length}`
  );

  saveLastRunTime();

  await browser.close();
})();
