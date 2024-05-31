import db from '@/app/db/db';
import PageHeader from '../_components/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/formmatters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Alert_Dialog from '@/components/AlertDialog';
import { DeleteOrderToggleAction } from './_components/orderActions';

function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      pricePaidInCent: true,
      product: true,
      user: true,
    },
    orderBy: { updateAt: 'desc' },
  });
}

export default function UsersPage() {
  return (
    <>
      <PageHeader propName="Customer">Orders</PageHeader>
      <UsersTable />
    </>
  );
}
async function UsersTable() {
  const orders = await getOrders();
  if (orders.length === 0) return <p>No Orders found!.</p>;
  return (
    <Table className=" mx-auto w-[90%] ">
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>
          <TableHead className="w-0">
            <span className=" sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.product.name}</TableCell>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>{formatCurrency(order.pricePaidInCent / 100)}</TableCell>
            <TableCell className="text-center">
              <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className=" sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <AlertDialogTrigger>Delete </AlertDialogTrigger>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Alert_Dialog
                  title="Are you sure ?"
                  message={`This action cannot be undone.\nThis will permanently delete this Order ${order.id}.`}
                >
                  <DeleteOrderToggleAction id={order.id} />
                </Alert_Dialog>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
