import Sequelize, { Model } from 'sequelize';
import { uuid } from 'uuidv4';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      { sequelize }
    );

    this.addHook('beforeSave', async (file) => {
      file.id = await uuid();
    });

    return this;
  }
}

export default File;
