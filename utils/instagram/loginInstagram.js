export const loginInstagram = async (page, username, password) => {
  console.log('🔐 Iniciando sesión con usuario y contraseña...');

  await page.goto('https://www.instagram.com/', {
    waitUntil: 'networkidle2',
  });
  await page.waitForSelector('input[name="username"]', { timeout: 10000 });

  await page.type('input[name="username"]', username, { delay: 100 });
  await page.type('input[name="password"]', password, { delay: 100 });

  const loginBtn = await page.$('button[type="submit"]');
  await loginBtn.click();

  // Esperar navegación completa
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Intentar cerrar los popups de "guardar información de inicio de sesión" y "notificaciones"
  try {
    await page.waitForSelector('div[role="dialog"] button', { timeout: 5000 });
    const botones = await page.$$('div[role="dialog"] button');
    for (const btn of botones) {
      const text = await (await btn.getProperty('innerText')).jsonValue();
      if (text.includes('Ahora no') || text.includes('Not Now')) {
        await btn.click();
        await page.waitForTimeout(1000);
      }
    }
    // eslint-disable-next-line no-unused-vars
  } catch (_) {
    // No hay popup, todo bien
  }

  console.log('✅ Sesión iniciada correctamente.\n');
};
