import CheckoutProduct from '../models/CheckoutProduct';
import Product from '../models/Product';
import File from '../models/File';

class CheckoutProductController {
  async index(req, res) {
    const { checkoutId } = req.params;

    const checkoutProducts = await CheckoutProduct.findAll({
      where: {
        checkout_id: checkoutId,
      },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price'],
          include: [
            {
              model: File,
              as: 'image',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(checkoutProducts);
  }
}

export default new CheckoutProductController();
