import Sequelize, { Model } from 'sequelize';
import { uuid } from 'uuidv4';
import CheckoutProduct from './CheckoutProduct';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.TEXT,
        price: Sequelize.DECIMAL,
        amount: Sequelize.INTEGER,
        user_id: Sequelize.UUID,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async (product) => {
      product.id = await uuid();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.File, { foreignKey: 'image_id', as: 'image' });
    this.belongsToMany(models.Checkout, {
      through: CheckoutProduct,
      foreignKey: 'product_id',
    });
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  }
}

export default Product;
