
import  Navbar  from '@/components/Navbar';
import  Sidebar from '@/components/Sidebar';

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}