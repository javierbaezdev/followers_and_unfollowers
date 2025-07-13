import puppeteer from 'puppeteer';
import { loginInstagram } from './utils/instagram/loginInstagram.js';
import { CONFIG } from './constans/index.js';
import { saveFollowedAccountsBulk } from './services/index.js';
import { saveLastRunTime } from './utils/index.js';
import connectDB from './db/index.js';

const USERNAME = CONFIG.INTAGRAM_USERNAME; // <-- tu usuario de Instagram
const YOUR_PASSWORD = CONFIG.INTAGRAM_PASSWORD; // <-- tu contraseña de Instagram
const INSTAGRAM_URL = 'https://www.instagram.com';
const PROFILE_URL = `${INSTAGRAM_URL}/${USERNAME}/`;

const SHOW_BROWSER = false;

(async () => {
  await connectDB(false);
  const browser = await puppeteer.launch({
    headless: !SHOW_BROWSER, // mostrar navegador
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  await page.setUserAgent(CONFIG.PUPPETEER.USER_AGENT);

  await loginInstagram(page, USERNAME, YOUR_PASSWORD);

  // ir al perfil
  await page.goto(PROFILE_URL, { waitUntil: 'networkidle2' });

  // esperar el botón de "seguidos"
  await page.waitForSelector(`a[href="/${USERNAME}/following/"]`);
  await page.click(`a[href="/${USERNAME}/following/"]`);

  // esperar modal
  await page.waitForSelector('div[role="dialog"]');

  // scroll automático para cargar todos los elementos
  const scrollFollowingModal = async () => {
    let scrollContainer = null;
    for (let i = 0; i < 10; i++) {
      scrollContainer = await page.$(
        'div[class*="x6nl9eh x1a5l9x9 x7vuprf x1mg3h75 x1lliihq x1iyjqo2 xs83m0k xz65tgg x1rife3k x1n2onr6"]'
      );
      if (scrollContainer) break;
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (!scrollContainer) {
      console.error('❌ No se encontró el contenedor con scroll.');
      return [];
    }

    console.log('✅ Contenedor con scroll encontrado. Haciendo scroll...');

    let previousCount = 0;
    let sameCount = 0;
    const maxSameCount = 5;

    const handlesSet = new Set();

    while (sameCount < maxSameCount) {
      // Scroll y extracción en el mismo paso
      const { count, handles } = await page.evaluate(() => {
        // eslint-disable-next-line no-undef
        const container = document.querySelector(
          'div[class*="x6nl9eh x1a5l9x9 x7vuprf x1mg3h75 x1lliihq x1iyjqo2 xs83m0k xz65tgg x1rife3k x1n2onr6"]'
        );

        container.scrollTo(0, container.scrollHeight);

        const spans = container.querySelectorAll(
          'span[class*="_ap3a _aaco _aacw _aacx _aad7 _aade"]'
        );

        const result = [];
        spans.forEach((span) => {
          const handle = span.innerText.trim();
          if (handle) result.push(handle);
        });

        return { count: spans.length, handles: result };
      });

      handles.forEach((h) => handlesSet.add(h));
      console.log(
        `👥 Handles visibles: ${count} | Totales recolectados: ${handlesSet.size}`
      );

      if (count === previousCount) {
        sameCount++;
      } else {
        sameCount = 0;
        previousCount = count;
      }

      await new Promise((r) => setTimeout(r, 2000));
    }

    console.log(
      `✅ Scroll finalizado. Total de usuarios recolectados: ${handlesSet.size}`
    );

    return Array.from(handlesSet);
  };

  // obtener nombres de usuario
  const followingHandles = await scrollFollowingModal();

  if (!followingHandles.length) {
    console.log('⚠️ No se encontraron seguidores.');
    await browser.close();
    return;
  }

  const formatedFollowingHandles = followingHandles.map((h) => ({
    followedUsername: h,
    ownerUsername: USERNAME,
    platform: 'instagram',
  }));

  await saveFollowedAccountsBulk(formatedFollowingHandles);

  await saveLastRunTime('instagram.getFollowing', USERNAME, 'instagram');

  console.log(
    `Total: ${followingHandles.length} agregados a la base de datos.`
  );

  await browser.close();
  process.exit(0);
})();
