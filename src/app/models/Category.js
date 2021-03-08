import Sequelize, { Model } from 'sequelize';
import { uuid } from 'uuidv4';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async (category) => {
      category.id = await uuid();
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Product, { foreignKey: 'id', as: 'product' });
  }
}

export default Category;
