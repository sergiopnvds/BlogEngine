module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here
    migration.createTable(
      'Favourites', 
      {  id: { type: DataTypes.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                        unique: true },

      createdAt: { type: DataTypes.DATE,
                        allowNull: true },
      
      updatedAt: { type: DataTypes.DATE,
                        allowNull: true },
      
      userId: { type: DataTypes.INTEGER,
                        allowNull: false },
      
      postId: { type: DataTypes.INTEGER,
                        allowNull: false },
      best: { type: DataTypes.INTEGER,
                        allowNull: false }
      }, { sync: {force:true} })
    .complete(done);;

  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here
      migration.dropTable('Favourites')
        .complete(done);
  }
}