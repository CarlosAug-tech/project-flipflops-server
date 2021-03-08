import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs';
import { uuid } from 'uuidv4';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        cpf: Sequelize.STRING,
        rg: Sequelize.STRING,
        birthday: Sequelize.STRING,
        phone: Sequelize.STRING,
        zipcode: Sequelize.INTEGER,
        street: Sequelize.STRING,
        street_number: Sequelize.INTEGER,
        neighborhood: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async (user) => {
      user.id = await uuid();
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    this.hasMany(models.Product, { foreignKey: 'user_id', as: 'user' });
  }
}

export default User;
