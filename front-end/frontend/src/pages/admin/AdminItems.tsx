import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

type Item = {
  id: number;
  title: string;
  avg_price: number;
  estimated_time_min: number;
  tags: string[];
};

export default function AdminItems() {
  const [items, setItems] = useState<Item[]>([]);

  const fetchItems = async () => {
    const res = await fetch("/api/v1/items");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("削除しますか？");
    if (!ok) return;

    await fetch(`/api/v1/items/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">管理画面</h2>
            <p className="text-sm text-gray-500">料理候補の追加・編集・削除</p>
          </div>

          <Link
            to="/admin/items/new"
            className="rounded-xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
          >
            + 新規追加
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3">料理名</th>
                <th className="px-4 py-3">価格</th>
                <th className="px-4 py-3">時間</th>
                <th className="px-4 py-3">タグ</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">{item.avg_price}円</td>
                  <td className="px-4 py-3">{item.estimated_time_min}分</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/items/${item.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:underline"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    データがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}