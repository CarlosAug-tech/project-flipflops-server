import Sequelize, { Model } from 'sequelize';
import { uuid } from 'uuidv4';

class Transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        transaction_id: Sequelize.STRING,
        status: Sequelize.STRING,
        authorization_code: Sequelize.STRING,
        brand: Sequelize.STRING,
        authorized_amount: Sequelize.INTEGER,
        tid: Sequelize.STRING,
        installments: Sequelize.INTEGER,
        checkout_id: Sequelize.UUID,
        user_id: Sequelize.UUID,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async (transaction) => {
      transaction.id = await uuid();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Checkout, {
      foreignKey: 'checkout_id',
      as: 'checkout_transaction',
    });
  }
}

export default Transaction;
