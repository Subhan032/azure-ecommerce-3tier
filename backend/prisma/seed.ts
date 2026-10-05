import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: 'Ergonomic Wireless Mechanical Keyboard',
    description: 'Custom-tuned mechanical switches with wireless multi-device connectivity, hot-swappable sockets, and 80-hour battery life.',
    price: 129.99,
    stock: 45,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Noise-Canceling Over-Ear Headphones',
    description: 'Industry-leading active noise cancellation with 40mm neodymium drivers, spatial audio support, and ultra-plush memory foam pads.',
    price: 249.95,
    stock: 30,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ultra-Wide 34-Inch Curved Monitor',
    description: 'WQHD 3440x1440 resolution curved IPS panel with 144Hz refresh rate, 99% sRGB color coverage, and USB-C 90W power delivery.',
    price: 499.00,
    stock: 15,
    category: 'Displays',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Anodized Aluminum Laptop Stand',
    description: 'Precision-machined aircraft-grade aluminum riser with silicone anti-slip padding, improving airflow and ergonomic posture.',
    price: 49.50,
    stock: 100,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Braided USB-C Fast-Charging Cable (2m)',
    description: 'Heavy-duty nylon braided cable supporting USB-PD 100W charging and 480Mbps data sync with reinforced aramid fiber strain relief.',
    price: 18.99,
    stock: 250,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  for (const product of sampleProducts) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          imageUrl: product.imageUrl,
        },
      });
      console.log(`  Updated product: ${product.name}`);
    } else {
      const created = await prisma.product.create({
        data: product,
      });
      console.log(`  Created product: ${created.name} (${created.id})`);
    }
  }

  const count = await prisma.product.count();
  console.log(`✅ Seeding complete. Total products in database: ${count}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

