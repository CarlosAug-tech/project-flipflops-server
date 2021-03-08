import Category from '../models/Category';

class CategoryController {
  async store(req, res) {
    const category = await Category.create(req.body);

    return res.json(category);
  }
}

export default new CategoryController();
