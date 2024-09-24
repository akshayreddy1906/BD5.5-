let { DataTypes, sequelize } = require('../lib/');
let user = sequelize.define('user', {
  username:{
    type:DataTypes.STRING,
    unique : true,
    allowNull: false,
  },password:{
    type:DataTypes.STRING,
    allowNull: false,
  },email:{
    type:DataTypes.STRING,
    unique : true,
    allowNull: false,
    validate:{
      isEmail:true,
    }
  }
});

module.exports = {user};
