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
import { DeleteUserToggleAction } from './_components/UserActions';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Alert_Dialog from '@/components/AlertDialog';

function getUser() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      Order: { select: { pricePaidInCent: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default function UsersPage() {
  return (
    <>
      <PageHeader propName="Customer">Customers</PageHeader>
      <UsersTable />
    </>
  );
}
async function UsersTable() {
  const users = await getUser();
  if (users.length === 0) return <p>No Customers found!.</p>;
  return (
    <Table className=" mx-auto w-[90%] ">
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="w-0">
            <span className=" sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatNumber(user.Order.length)}</TableCell>
            <TableCell>
              {formatCurrency(
                user.Order.reduce((sum, o) => o.pricePaidInCent + sum, 0) / 100,
              )}
            </TableCell>
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
                  message={`This action cannot be undone.\nThis will permanently delete this Customer ${user.email}.`}
                >
                  <DeleteUserToggleAction id={user.id} />
                </Alert_Dialog>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
