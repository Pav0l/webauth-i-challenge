
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments('user_id');

    table
      .string('username', 128)
      .notNullable()
      .unique();
    
    table
      .string('password')
      .notNullable()
      .unique();


    table
      .string('email', 128)
      .notNullable()
      .unique();
    
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
