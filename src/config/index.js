const config = {
  externalResources: {
    hahow: {host: process.env.EXTRES_HAHOW_HOST || 'https://hahow-recruit.herokuapp.com'}
  },
  web: {
    port: process.env.WEB_PORT || 3000,
  }
};

module.exports = {config};
