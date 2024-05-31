import { Nav, NavLink } from '@/components/Nav';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className=" grid min-h-svh grid-cols-[10rem_1fr] gap-4">
        <Nav iscol>
          <NavLink href="/admin" iscol>
            Dashboard
          </NavLink>
          <NavLink href="/admin/products" iscol>
            Products
          </NavLink>
          <NavLink href="/admin/users" iscol>
            Customers
          </NavLink>
          <NavLink href="/admin/orders" iscol>
            Sales
          </NavLink>
        </Nav>
        <div className=" my-6"> {children}</div>
      </main>
    </>
  );
}
