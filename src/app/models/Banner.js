import Sequelize, { Model } from 'sequelize';
import { uuid } from 'uuidv4';

class Banner extends Model {
  static init(sequelize) {
    super.init(
      {
        banner_id: Sequelize.UUID,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async (banner) => {
      banner.id = await uuid();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'banner_id',
      as: 'banner_image',
    });
  }
}

export default Banner;
