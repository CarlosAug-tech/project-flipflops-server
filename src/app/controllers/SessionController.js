import jwt from 'jsonwebtoken';
import User from '../models/User';

import authConfig from '../../config/auth';
import File from '../models/File';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    const {
      id,
      name,
      cpf,
      rg,
      birthday,
      phone,
      zipcode,
      street,
      street_number,
      neighborhood,
      city,
      state,
      avatar,
    } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        cpf,
        rg,
        birthday,
        phone,
        avatar,
        address: {
          zipcode,
          street,
          street_number,
          neighborhood,
          city,
          state,
        },
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
