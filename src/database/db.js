var knex = require('knex')({
    client: 'mysql',
    connection: {
      user : 'deco',
      password : 'sempre190',
      database : 'projetoDelivery'
    }
});


module.exports = knex