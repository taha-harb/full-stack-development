import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PageHeader from '@/app/admin/_components/PageHeader';
import db from '@/app/db/db';
import { formatCurrency, formatNumber } from '@/lib/formmatters';
import { CheckCircle2, MoreVertical, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function AdminProductsPage() {
  return (
    <>
      <PageHeader propName="product" propButton>
        Products.
      </PageHeader>
      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { Order: true } },
    },
    orderBy: { name: 'asc' },
  });
  if (products.length === 0) return <p>No Products Found</p>;
  return (
    <Table className=" mx-auto w-[90%] ">
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className=" sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {' '}
              {product.isAvailableForPurchase ? (
                <>
                  <span className=" sr-only">Available</span>
                  <CheckCircle2 className="text-green-500" />{' '}
                </>
              ) : (
                <>
                  <span className=" sr-only">Unavailable</span>
                  <XCircle className="text-red-500" />{' '}
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              {formatCurrency((product.priceInCents / 100) | 0)}
            </TableCell>
            <TableCell>{formatNumber(product._count.Order)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className=" sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a download href={`admin/products/${product.id}/download`}>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`admin/products/${product.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
