import { useState } from 'react'
import './index.css' // ← ここで Tailwind を書いたファイルを読み込む

// あなたのバックエンドのURLを指定します
const API_BASE_URL = "https://meshi-gacha.onrender.com";

interface Food {
  id: number;
  name: string;
  category: string;
  heaviness: number;
  description: string;
  recipeUrl: string;
}

function App() {
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(false);

  // ガチャを回す関数
  const spinGacha = async () => {
    setLoading(true);
    try {
      // ローカルホストではなく、RenderのURLに向かってデータをリクエストします
      const response = await fetch(`${API_BASE_URL}/api/foods/gacha`);
      
      if (!response.ok) {
        throw new Error("サーバーとの通信に失敗しました");
      }

      const data = await response.json();
      setFood(data);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("ガチャに失敗しました。Java側のCORS設定が '*' になっているか確認してください！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🍚 飯ガチャ 🍚</h1>
      
      <div className="card">
        <button onClick={spinGacha} disabled={loading}>
          {loading ? "抽選中..." : "ガチャを回す！"}
        </button>
      </div>

      {food && (
        <div className="result">
          <h2>今日の献立：{food.name}</h2>
          <p>【{food.category}】 重さレベル：{food.heaviness}</p>
          <p>{food.description}</p>
          {food.recipeUrl && (
            <a href={food.recipeUrl} target="_blank" rel="noopener noreferrer">
              レシピを見る
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default App