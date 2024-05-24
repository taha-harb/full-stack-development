import { Nav, NavLink } from '@/components/Nav';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className=" grid min-h-svh grid-cols-[10rem_1fr] gap-4">
        <Nav isCol>
          <NavLink href="/admin" isCol>
            Dashboard
          </NavLink>
          <NavLink href="/admin/products" isCol>
            Products
          </NavLink>
          <NavLink href="/admin/users" isCol>
            Customers
          </NavLink>
          <NavLink href="/admin/orders" isCol>
            Sales
          </NavLink>
        </Nav>
        <div className=" my-6"> {children}</div>
      </main>
    </>
  );
}
