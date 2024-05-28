'use strict';

/**
 * menu router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::menu.menu');

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/get-all-menu',
      handler: 'menu.findAllMenuFood',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
}
