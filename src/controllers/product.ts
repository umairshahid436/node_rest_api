import { Request, Response, NextFunction } from 'express';
import { Product as ProductType } from '../types/product';
import { Product } from '../models/product';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resp = await Product.find();
    res
      .status(200)
      .json({ data: resp, count: resp.length, message: 'List of products' });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const resp = await Product.findById(id);
    res.status(200).json({ data: resp, message: 'Product' });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as ProductType;
    const { description, price, title, imageUrl } = body;
    const product = new Product({ title, price, description, imageUrl });
    const resp = await product.save();
    if (resp) {
      res.status(201).json({ data: 'Product added successfully' });
    }
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as ProductType;
    const { description, price, title, imageUrl, id } = body;
    await Product.updateOne({
      description,
      price,
      title,
      imageUrl,
      id,
    });
    res
      .status(200)
      .json({ data: req.body, message: 'Product updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const resp = await Product.deleteOne({ id });
    res
      .status(200)
      .json({ data: resp, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
