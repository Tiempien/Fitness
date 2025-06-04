// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['nuxt-auth-utils', '@nuxt/ui', '@nuxtjs/color-mode','@compodium/nuxt'],
  components: {
    global: true,
    dirs: ['~/components']
  },
  build: {
    transpile: ['@craftzing/akeneo-api']
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },
  devServer: {
    https: {
      key: './server.key',
      cert: './server.crt'
    }
  },
  app: {
    head: {
      script: [
        {
          src: `https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`,
          async: true,
          defer: true
        }
      ]
    }
  },
  runtimeConfig: {
    database: process.env.DB_NAME || "mydatabase",
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql", // Change to "postgres", "sqlite", etc.
    logging: process.env.DB_LOGGING === "true",
  },
  auth: {

  }
})