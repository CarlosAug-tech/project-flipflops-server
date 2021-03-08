import Sequelize, { Model } from 'sequelize';
import { uuid } from 'uuidv4';

class CheckoutProduct extends Model {
  static init(sequelize) {
    super.init(
      {
        checkout_id: Sequelize.UUID,
        product_id: Sequelize.UUID,
        amount: Sequelize.INTEGER,
        total: Sequelize.DECIMAL,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async (checkprod) => {
      checkprod.id = await uuid();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
    this.belongsTo(models.Checkout, {
      foreignKey: 'checkout_id',
      as: 'checkout',
    });
  }
}

export default CheckoutProduct;
