import { Router } from 'express';
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product';

const router = Router();

router.get('/getAll', getProducts);
router.post('/add', addProduct);
router.put('/update', updateProduct);
router.get('/get/:id', getProductById);
router.delete('/delete/:id', deleteProduct);

export { router as productRoutes };
