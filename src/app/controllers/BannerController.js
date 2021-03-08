import Banner from '../models/Banner';
import File from '../models/File';

class BannerController {
  async index(req, res) {
    const banners = await Banner.findAll({
      include: [
        {
          model: File,
          as: 'banner_image',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(banners);
  }

  async store(req, res) {
    const { banner_id } = req.body;

    const banner = await Banner.create({
      banner_id,
    });

    return res.json(banner);
  }
}

export default new BannerController();
