import Transaction from '../models/Transaction';

class TransactionController {
  async index(req, res) {
    const transactions = await Transaction.findAll({
      where: { user_id: req.userId },
      attributes: [
        'id',
        'tid',
        'brand',
        'status',
        'checkout_id',
        'installments',
        'createdAt',
      ],
    });

    return res.json(transactions);
  }
}

export default new TransactionController();
