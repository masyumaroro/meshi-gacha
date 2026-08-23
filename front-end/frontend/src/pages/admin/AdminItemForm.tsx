import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

type Props = {
  mode: "create" | "edit";
};

type FormState = {
  title: string;
  avg_price: string;
  estimated_time_min: string;
  tags: string;
  image_url: string;
  type: "RECIPE" | "RESTAURANT" | "CONVENI";
};

export default function AdminItemForm({ mode }: Props) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormState>({
    title: "",
    avg_price: "",
    estimated_time_min: "",
    tags: "",
    image_url: "",
    type: "RECIPE",
  });

  useEffect(() => {
    if (mode !== "edit" || !id) return;

    const loadItem = async () => {
      const res = await fetch(`/api/v1/items/${id}`);
      const data = await res.json();

      setForm({
        title: data.title ?? "",
        avg_price: String(data.avg_price ?? ""),
        estimated_time_min: String(data.estimated_time_min ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.join(",") : "",
        image_url: data.image_url ?? "",
        type: data.type ?? "RECIPE",
      });
    };

    loadItem();
  }, [mode, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      avg_price: Number(form.avg_price),
      estimated_time_min: Number(form.estimated_time_min),
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (mode === "create") {
      await fetch("/api/v1/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`/api/v1/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    navigate("/admin/items");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-6 text-2xl font-bold">
            {mode === "create" ? "新規追加" : "編集"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="料理名"
              className="w-full rounded-xl border px-4 py-3"
            />

            <input
              name="avg_price"
              value={form.avg_price}
              onChange={handleChange}
              placeholder="価格"
              className="w-full rounded-xl border px-4 py-3"
            />

            <input
              name="estimated_time_min"
              value={form.estimated_time_min}
              onChange={handleChange}
              placeholder="時間（分）"
              className="w-full rounded-xl border px-4 py-3"
            />

            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="タグをカンマ区切りで入力"
              className="w-full rounded-xl border px-4 py-3"
            />

            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="画像URL"
              className="w-full rounded-xl border px-4 py-3"
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3"
            >
              <option value="RECIPE">RECIPE</option>
              <option value="RESTAURANT">RESTAURANT</option>
              <option value="CONVENI">CONVENI</option>
            </select>

            <button className="w-full rounded-xl bg-rose-600 py-3 font-medium text-white hover:bg-rose-700">
              保存
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}