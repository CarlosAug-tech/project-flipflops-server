import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

import FileController from './app/controllers/FileController';
import ProductController from './app/controllers/ProductController';
import BannerController from './app/controllers/BannerController';
import CategoryController from './app/controllers/CategoryController';
import CheckoutController from './app/controllers/CheckoutController';
import TransactionController from './app/controllers/TransactionController';
import CheckoutProductController from './app/controllers/CheckoutProductController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/banners', BannerController.index);
routes.get('/products/:id', ProductController.show);
routes.get('/products/category/:category', ProductController.showCategory);

routes.use(authMiddleware);

routes.get('/checkouts/:checkoutId', CheckoutController.show);
routes.post('/checkouts', CheckoutController.store);

routes.put('/users', UserController.update);

routes.get('/transactions', TransactionController.index);

routes.get('/checkoutProducts/:checkoutId', CheckoutProductController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.use(adminMiddleware);

routes.post('/products', ProductController.store);

routes.post('/banners', BannerController.store);

routes.post('/categorys', CategoryController.store);

export default routes;
