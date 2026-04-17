(function () {
  const localApi = 'http://localhost:3000';
  const liveApi = 'https://laundry-system-x7t5.onrender.com';

  const forceLocal = window.location.search.includes('useLocalApi=1');

  window.APP_CONFIG = {
    API_URL: forceLocal ? localApi : liveApi
  };
})();
