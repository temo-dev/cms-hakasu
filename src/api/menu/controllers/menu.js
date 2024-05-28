'use strict';

const middlewares = require('../../../../config/middlewares');
const { routes } = require('../routes/menu');

/**
 * menu controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::menu.menu', ({ strapi }) => ({
  async findAllMenuFood(ctx) {
    try {
      let data = []
      //get locale
      const dataLocale = await strapi.db.connection.raw(`
      select inl.code as locale   from i18n_locale inl
      `)
      if (dataLocale) {
        data = dataLocale.rows
        for (let i = 0; i < data.length; i++) {
          const dataMenus = await strapi.db.connection.raw(`
          select m.id, m.name_menu,m.dph, m.locale,f.url as background  from menus m
          left join files_related_morphs frm on frm.related_id = m.id
          left join files f on f.id = frm.file_id
          where locale = '${data[i].locale}' and frm.related_type = 'api::menu.menu'
          `)
          //add menu
          if (dataMenus) {
            data[i] = { ...data[i], "menu": dataMenus.rows }
            //add food
            const array = data[i].menu
            for (let j = 0; j < array.length; j++) {
              const dataFoods = await strapi.db.connection.raw(`
              select f1.id, f1.name_food, f1.price, f1.is_discount, f1.value_discount, f2.url as image, f1.locale  from foods f1
              left join files_related_morphs frm on frm.related_id = f1.id
              left join files f2 on f2.id = frm.file_id
              left  join menus_foods_links mfl on mfl.food_id = f1.id
              left join menus m on m.id = mfl.menu_id
              where frm.related_type = 'api::food.food' and m.id = ${array[j].id}
              `)
              if (dataFoods) {
                data[i].menu[j] = { ...data[i].menu[j], "foods": dataFoods.rows }
              }
            }
          }
        }
      }
      ctx.body = data
    } catch (error) {
      console.error(error);
      ctx.body = error
    }
  }
}));


