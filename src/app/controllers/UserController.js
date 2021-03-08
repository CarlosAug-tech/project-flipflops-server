import * as Yup from 'yup';
import File from '../models/File';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cpf: Yup.string().required(),
      rg: Yup.string().required(),
      birthday: Yup.string().required(),
      phone: Yup.string().required(),
      zipcode: Yup.number().integer().required(),
      street: Yup.string().required(),
      street_number: Yup.number().integer().required(),
      neighborhood: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(
        6,
        'The password min caracters is 6 or more of 6'
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
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
      email,
    } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
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
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      cpf: Yup.string(),
      rg: Yup.string(),
      birthday: Yup.string(),
      phone: Yup.string(),
      zipcode: Yup.number().integer(),
      street: Yup.string(),
      street_number: Yup.number().integer(),
      neighborhood: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string(),
      password: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword
          ? field.min(6, 'The password min caracters is 6 or more of 6')
          : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation is fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (user.email !== email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    await user.update(req.body);

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
    } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
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
    });
  }
}

export default new UserController();
