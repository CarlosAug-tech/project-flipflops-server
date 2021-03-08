import Sequelize, { Model } from 'sequelize';
import { uuid } from 'uuidv4';
import CheckoutProduct from './CheckoutProduct';

class Checkout extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.INTEGER,
        fee: Sequelize.INTEGER,
        user_id: Sequelize.UUID,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async (checkout) => {
      checkout.id = await uuid();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsToMany(models.Product, {
      through: CheckoutProduct,
      foreignKey: 'checkout_id',
    });
  }
}

export default Checkout;
