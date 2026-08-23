import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r p-4">
      <h1 className="text-xl font-bold mb-6">🍽 Admin</h1>

      <nav className="flex flex-col gap-3">
        <Link to="/admin/items" className="hover:text-rose-500">
          Items
        </Link>
        <Link to="/admin/items/new" className="hover:text-rose-500">
          Add Item
        </Link>
      </nav>
    </aside>
  );
}