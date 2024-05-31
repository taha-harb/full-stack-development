import DashboardCards from '@/components/dashboard/dashboardCards';
import db from '../../db/db';
import { formatCurrency, formatNumber } from '@/lib/formmatters';
import { Suspense } from 'react';
import SkeletonCard from '@/components/dashboard/SkeletonCard';

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCent: true },
    _count: true,
  });
  return {
    amount: (data._sum.pricePaidInCent || 0) / 100,
    numberOfSales: data._count,
  };
}
async function getUserData() {
  const [userCount, ordersData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCent: true },
    }),
  ]);
  return {
    userCount,
    avgValuePerUser:
      userCount === 0
        ? 0
        : (ordersData._sum.pricePaidInCent || 0) / 100 / userCount,
  };
}
async function getProductsData() {
  const [activeCount, inActiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount,
    inActiveCount,
  };
}
async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductsData(),
  ]);
  const cards = [
    {
      title: 'Sales',
      subtitle: `${formatNumber(salesData.numberOfSales)} Orders.`,
      body: `${formatCurrency(salesData.amount)}`,
    },
    {
      title: 'Customers',
      subtitle: `${formatCurrency(userData.avgValuePerUser)} Average Value.`,
      body: `${formatNumber(userData.userCount)}`,
    },
    {
      title: 'Prodcuts',
      subtitle: `${formatNumber(productData.inActiveCount)} In active products.`,
      body: `${formatNumber(productData.activeCount)} active products`,
    },
  ];
  return (
    <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Suspense fallback={<SkeletonCard />}>
        <DashboardCards cards={cards} />
      </Suspense>
    </main>
  );
}
