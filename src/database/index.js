import Sequelize from 'sequelize';

import File from '../app/models/File';
import Product from '../app/models/Product';
import User from '../app/models/User';
import Checkout from '../app/models/Checkout';
import Category from '../app/models/Category';

import databaseConfig from '../config/database';
import CheckoutProduct from '../app/models/CheckoutProduct';
import Transaction from '../app/models/Transaction';
import Banner from '../app/models/Banner';

const models = [
  User,
  File,
  Banner,
  Product,
  Category,
  Checkout,
  CheckoutProduct,
  Transaction,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
