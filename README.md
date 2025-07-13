# 📸 Followers & Unfollowers Tracker

Este proyecto te permite **gestionar y auditar tus cuentas de redes sociales** (por ahora Instagram) mediante automatización con Puppeteer y persistencia con MongoDB.

Ideal para ver:

- A quién seguís
- Quién no te sigue de vuelta
- Dejar de seguir automáticamente
- Evitar ejecutar scripts repetidamente (en menos de 2 horas)
- Soporta múltiples cuentas y plataformas (¡pronto más!)

---

## 🚀 Tecnologías

- [Node.js](https://nodejs.org/)
- [Puppeteer](https://pptr.dev/)
- [MongoDB](https://www.mongodb.com/) + Mongoose
- [Luxon](https://moment.github.io/luxon/) (manejo de fechas Chile)
- Inquirer (CLI interactivo)
- ES Modules + estructura moderna de archivos

---

## 📂 Estructura del proyecto

```
followers_and_unfollowers/
├── db/                        # Conexión MongoDB
├── models/                    # Modelos de datos (Mongoose)
├── services/                  # Funciones para interactuar con la base de datos
├── scripts/                   # Scripts Puppeteer
├── utils/                     # Utilidades (fechas, login, etc)
├── menu.js                    # Menú principal CLI
├── .env                       # Variables sensibles
└── README.md
```

---

## ⚙️ Variables de entorno (`.env`)

Crea un archivo `.env` en la raíz con lo siguiente:

```env
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/el-nombre-que-te-de-la-gana
INTAGRAM_USERNAME=tucuenta
INTAGRAM_PASSWORD=tuclave
```

---

## 🧩 Scripts disponibles

### 1. `getFollowing.js`

Guarda todos los usuarios que seguís en MongoDB.

```bash
node getFollowing.js
```

---

### 2. `checkNoMeSiguen.js`

Evalúa tus seguidos y registra quién no te sigue de vuelta.

```bash
node checkNoMeSiguen.js --accountNumber 30
```

> O simplemente desde el menú interactivo.

---

### 3. `dejarDeSeguir.js`

Deja de seguir a las personas que fueron marcadas como "no te siguen".

```bash
node dejarDeSeguir.js
```

---

## 🧠 Prevención de ejecuciones repetidas

Para evitar bloqueos o errores por usar Instagram muy seguido, cada script almacena su hora de ejecución en la base de datos.

Por defecto, **no podrás volver a ejecutarlo en menos de 2 horas.**

> Configurable con `TIME_OUT_EXECUTE_SCRIPT` en `.env`.

---

## 📋 Uso desde el menú CLI

```bash
node menu.js
```

Desde ahí podés:

- Obtener seguidos
- Ver quién no te sigue
- Dejar de seguir
- O salir del sistema 😎

---

## 🌎 Soporte multi-cuenta y plataforma

Todos los registros están vinculados a:

- Tu usuario
- La plataforma (`instagram`, `tiktok`, etc) (la bd, pero luego creare nuevos scripts para tiktok... quizas xd)
- El script ejecutado

Listo para extender a otras redes sociales fácilmente.

---

## 🔐 Seguridad

- No guardamos claves en la DB.
- Asegurate de que tu `.env` **no esté en Git** (`.gitignore` ya lo maneja).
- Recomendado: usá una cuenta alterna de pruebas si vas a experimentar con unfollow.

---

## 🙌 Autor

Proyecto de fin de semana por [@javierbaeztattoos](https://instagram.com/javierbaeztattoos) 🧠💻
Hecho con café, Puppeteer y paciencia 😅

---

## Por qué este proyecto?

- Por que esta app siempre la veo de paga, y no quiero pagar xD, aparte no me da confienza que tengas mis datos. aca lo clonas y lo usas y era, no es una maravilla pero funciona xd.

[![Vaundy – 踊り子](https://img.shields.io/badge/Spotify-Odoriko-green?style=for-the-badge&logo=spotify)](https://open.spotify.com/track/1YXot2MLAG9sttepCtBRM7)
