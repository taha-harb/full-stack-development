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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import {
  ActiveToggleDropDownItem,
  DeleteToggleAction,
  DeleteToggleDropDownItem,
} from './_components/ProductActions';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Alert_Dialog from '@/components/AlertDialog';

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
                  <XCircle className=" stroke-destructive" />
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              {formatCurrency((product.priceInCents / 100) | 0)}
            </TableCell>
            <TableCell>{formatNumber(product._count.Order)}</TableCell>
            <TableCell>
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className=" sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <a download href={`./products/${product.id}/download`}>
                        Download
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`./products/${product.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <ActiveToggleDropDownItem
                      id={product.id}
                      isAvailableForPurchase={product.isAvailableForPurchase}
                    />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <AlertDialogTrigger>Delete </AlertDialogTrigger>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Alert_Dialog
                  title="Are you sure ?"
                  message={`This action cannot be undone.\nThis will permanently delete this Product ${product.name}.`}
                >
                  <DeleteToggleAction
                    id={product.id}
                    disabled={product._count.Order > 0}
                  />
                </Alert_Dialog>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
