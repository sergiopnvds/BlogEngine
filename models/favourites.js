
// Definicion de la clase Favourite:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Favourite',
      { id: {
            type: DataTypes.INTEGER,
        },
        createdAt: {
            type: DataTypes.DATE, //TIMESTAMP
        },
        updatedAt: {
            type: DataTypes.DATE, //TIMESTAMP
        },
        userId: {
            type: DataTypes.INTEGER
        },
        postId: {
            type: DataTypes.INTEGER
        },
        best: {
            type: DataTypes.INTEGER
        }
        
    });
}
