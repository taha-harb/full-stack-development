import SkeletonCard from './SkeletonCard';

export default function SkeletonDashboard() {
  return (
    <main className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </main>
  );
}
