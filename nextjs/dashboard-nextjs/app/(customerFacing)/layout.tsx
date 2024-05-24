import { Nav, NavLink } from '@/components/Nav';

export const dynamic = 'force-dynamic';

export default function CustomerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className="grid w-full grid-rows-[4rem_1fr] gap-4">
        <Nav>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/orders">My Orders</NavLink>
        </Nav>
        <div className="mx-6"> {children}</div>
      </main>
    </>
  );
}
