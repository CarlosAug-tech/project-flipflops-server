import User from '../models/User';

export default async (req, res, next) => {
  const user = await User.findByPk(req.userId);

  if (user.email !== process.env.SUPER_USER) {
    return res.status(401).json({ error: "You don't have permission" });
  }

  return next();
};
