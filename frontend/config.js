(function () {
  const localApi = 'http://localhost:3000';
  const liveApi = 'https://your-render-service.onrender.com';

  const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  window.APP_CONFIG = {
    API_URL: isLocalHost ? localApi : liveApi
  };
})();
