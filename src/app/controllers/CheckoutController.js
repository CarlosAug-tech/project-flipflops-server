import pagarme from 'pagarme';
import CheckoutProduct from '../models/CheckoutProduct';
import CreditCard from '../models/CreditCard';
import Checkout from '../models/Checkout';
import Transaction from '../models/Transaction';

class CheckoutController {
  async show(req, res) {
    const { checkoutId } = req.params;

    const checkout = await Checkout.findOne({
      where: { id: checkoutId },
      attributes: ['id', 'fee', 'amount'],
    });

    return res.json(checkout);
  }

  async index(req, res) {
    const checkouts = await Checkout.findAll({
      where: {
        user_id: req.userId,
      },
    });

    return res.json(checkouts);
  }

  async store(req, res) {
    const {
      address,
      customer,
      card_hash,
      items,
      installments,
      amount: amountClient,
      save_card,
      card_id,
    } = req.body;

    try {
      let card;
      if (card_id) {
        card = await CreditCard.findOne({
          where: { card_id },
        });
      }

      const client = await pagarme.client.connect({
        api_key: process.env.PAGARME_API_KEY,
      });

      const fee = 1000;

      const amount = amountClient * 100 + fee;

      const pagarmeTransaction = await client.transactions.create({
        amount: parseInt(amount, 10),
        ...(card_hash && { card_hash }),
        customer: {
          name: customer.name,
          email: customer.email,
          country: 'br',
          external_id: '1',
          type: 'individual',
          documents: [
            {
              type: 'cpf',
              number: customer.cpf,
            },
            {
              type: 'rg',
              number: customer.rg,
            },
          ],
          phone_numbers: [customer.phone],
        },
        billing: {
          name: customer.name,
          address: {
            country: 'br',
            zipcode: String(address.zipcode),
            street: address.street,
            street_number: String(address.street_number),
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
          },
        },
        shipping: {
          name: customer.name,
          fee,
          delivery_date: '2021-02-25',
          expedited: false,
          address: {
            country: 'br',
            zipcode: String(address.zipcode),
            street: address.street,
            street_number: String(address.street_number),
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
          },
        },
        items: items.map((item) => ({
          id: String(item.id),
          title: item.name,
          unit_price: parseInt(item.price * 100, 10),
          quantity: item.amountCart,
          tangible: true,
        })),
      });

      if (save_card && !card) {
        const { card } = pagarmeTransaction;

        await CreditCard.create({
          card_id: card.id,
          number: `${card.first_digits}*********${card.last_digits}`,
          holder_name: card.holder_name,
          brand: card.brand,
          expiration_date: card.expiration_date,
        });
      }

      const checkout = await Checkout.create({
        amount: parseInt(amount * 100, 10),
        fee,
        user_id: req.userId,
      });

      await items.forEach((item) => {
        CheckoutProduct.create({
          product_id: item.id,
          checkout_id: checkout.id,
          amount: item.amountCart,
          total: item.amountCart * item.price,
        });
      });

      const transactions = await Transaction.create({
        transaction_id: pagarmeTransaction.id,
        status: pagarmeTransaction.status,
        authorization_code: pagarmeTransaction.authorization_code,
        brand: pagarmeTransaction.card.brand,
        authorized_amount: pagarmeTransaction.authorized_amount,
        tid: pagarmeTransaction.tid,
        installments,
        checkout_id: checkout.id,
        user_id: req.userId,
      });

      return res.json(transactions);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new CheckoutController();
