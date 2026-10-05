import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

const router = Router();

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be an integer greater than 0'),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerEmail: z.string().email('Valid customer email is required'),
  shippingAddress: z.string().min(5, 'Shipping address must be at least 5 characters'),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
});

router.post('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const { customerName, customerEmail, shippingAddress, items } = validatedData;

    // Execute atomic transaction for inventory verification, stock decrement, and order creation
    const createdOrder = await prisma.$transaction(async (tx) => {
      // 1. Fetch current product data from DB
      const productIds = items.map((item) => item.productId);
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));

      // 2. Validate all products exist
      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) {
          const err = new Error(`Product not found with id: ${item.productId}`) as Error & { statusCode?: number };
          err.statusCode = 404;
          throw err;
        }

        if (product.stock < item.quantity) {
          const err = new Error(
            `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`
          ) as Error & { statusCode?: number };
          err.statusCode = 400;
          throw err;
        }
      }

      // 3. Calculate total amount using canonical database prices & decrement stock
      let calculatedTotal = new Prisma.Decimal(0);
      const orderItemsData: Array<{
        productId: string;
        quantity: number;
        unitPrice: Prisma.Decimal;
      }> = [];

      for (const item of items) {
        const product = productMap.get(item.productId)!;
        const itemTotal = product.price.mul(item.quantity);
        calculatedTotal = calculatedTotal.add(itemTotal);

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }

      // 4. Create Order and nested OrderItems
      const order = await tx.order.create({
        data: {
          customerName,
          customerEmail,
          shippingAddress,
          totalAmount: calculatedTotal,
          status: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                },
              },
            },
          },
        },
      });

      return order;
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

