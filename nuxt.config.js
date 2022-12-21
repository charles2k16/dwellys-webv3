export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Dwellys',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Discover the world’s hub for properties you would love',
      },
      { name: 'format-detection', content: 'telephone=023023345' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyCt8902N2wOQ4kGxifiMhmZ4eHw-8J2v1Q&region=GH&libraries=places&v=weekly`,
        hid: 'map',
        defer: true,
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/css/global.css',
    '~/assets/css/element.css',
    '~/assets/css/display.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/elementUI/element-ui',
    '@/plugins/api.js',
    '@/plugins/persistedState.client.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '~/components', // will get any components nested in let's say /components/test too
      pathPrefix: false,
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/dotenv',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    // "@nuxtjs/auth",
    'nuxt-material-design-icons-iconfont',
    '@nuxtjs/moment',

    // "nuxt-material-design-icons",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // http://localhost:8000/api/v1
    // baseURL: 'https://newapi.dwellys.com/api',
    baseURL:  `${process.env.API_URL}`,
    ' http://localhost:8000/api/v3',
   
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // "http://127.0.0.1:8000/api/v3"
    //  process.env.NODE_ENV !== "production"
    // ? : "https://newapi.dwellys.com/api/v3"
  },
  //
  // server: {
  //   port: 8000,
  // },

  router: {
    middleware: ['auth'],
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: false,
          global: true,
          required: true,
          type: 'Bearer',
        },
        user: {
          property: false,
          autoFetch: false,
        },
        endpoints: {
          login: { url: '/login', method: 'post' },
          user: false,
          logout: { url: '/logout', method: 'get' },
        },
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        // scope: ["profile", "email"],
        codeChallengeMethod: '',
        responseType: 'code',
        endpoints: {
          token: 'http://localhost:8000/api/v3/loginwithsocialmedia', // somm backend url to resolve your auth with google and give you the token back
          userInfo: false, // the endpoint to get the user info after you recived the token
          redirect_uri: 'http://localhost:3000/login',
          logout: { url: '/logout', method: 'get' },
        },
      },
      facebook: {
        endpoints: {
          // redirect_uri: "http://localhost:3000/login",
          token: '/loginwithsocialmedia',
          // logout: {
          //   url: "http://localhost:8000/api/v3/logout",
          //   method: "post",
          // },
          userInfo:
            'https://graph.facebook.com/v6.0/me?fields=id,name,email,picture{url},first_name,last_name,birthday',
        },
        clientId: '3270395229903696',
        scope: ['public_profile', 'email'],
      },
    },
  },
};
