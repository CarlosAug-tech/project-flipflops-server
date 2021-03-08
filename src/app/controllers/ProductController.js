import * as Yup from 'yup';
import Category from '../models/Category';
import File from '../models/File';
import Product from '../models/Product';

class ProductController {
  async show(req, res) {
    const { id } = req.params;

    const product = await Product.findOne({
      where: {
        id,
      },
      attributes: ['id', 'name', 'description', 'price', 'amount'],
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    return res.json(product);
  }

  async index(req, res) {
    const products = await Product.findAll({
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(products);
  }

  async showCategory(req, res) {
    const { category } = req.params;
    const { page = 1 } = req.query;

    const productsByCategory = await Product.findAndCountAll({
      limit: 12,
      offset: (page - 1) * 12,
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'name', 'description', 'price'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
          where: { name: category },
        },
        {
          model: File,
          as: 'image',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    res.set('x-total-count', productsByCategory.count);
    return res.json(productsByCategory);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      price: Yup.number().required(),
      amount: Yup.number().integer().min(1, 'The amount min is more of 1'),
      image_id: Yup.string().required(),
      category_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      name,
      description,
      price,
      amount,
      image_id,
      category_id,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      amount,
      image_id,
      category_id,
      user_id: req.userId,
    });

    return res.json(product);
  }
}

export default new ProductController();
