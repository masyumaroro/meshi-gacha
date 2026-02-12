import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, ExternalLink } from 'lucide-react';

// --- 【ここを書き換えました！】 ---
// あなたのバックエンドのURLを指定
const API_BASE_URL = "https://meshi-gacha.onrender.com";
// ------------------------------

interface Food {
  name: string;
  category: string;
  description: string;
  sourceType: string;
  recipeUrl: string | null;
}

type Taste = 'あっさり' | 'こってり';
type MealType = '自炊' | '外食' | 'コンビニ';

export default function App() {
  const [selectedTaste, setSelectedTaste] = useState<Taste | null>(null);
  const [selectedType, setSelectedType] = useState<MealType | null>(null);
  const [currentMeal, setCurrentMeal] = useState<Food | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const dummyFoods = ["ラーメン", "カレー", "パスタ", "牛丼", "寿司", "焼肉", "うどん", "ピザ", "そば", "ハンバーグ"];

  const spinGacha = async () => {
    setIsSpinning(true);
    setCurrentMeal(null);

    const params = new URLSearchParams();
    if (selectedTaste === 'あっさり') params.append('heaviness', '1');
    if (selectedTaste === 'こってり') params.append('heaviness', '5');
    
    if (selectedType === '自炊') params.append('sourceType', 'COOKING');
    if (selectedType === 'コンビニ') params.append('sourceType', 'CONVENIENCE');
    if (selectedType === '外食') params.append('sourceType', 'EAT_OUT');

    try {
      // 【重要】localhostではなく、API_BASE_URL（Render）にリクエストを送る
      const response = await fetch(`${API_BASE_URL}/api/foods/gacha?${params.toString()}`);
      if (!response.ok) throw new Error();
      const finalResult = await response.json();

      let count = 0;
      const interval = setInterval(() => {
        setDisplayText(dummyFoods[Math.floor(Math.random() * dummyFoods.length)]);
        count++;

        if (count > 15) {
          clearInterval(interval);
          setCurrentMeal(finalResult);
          setIsSpinning(false);
        }
      }, 80);

    } catch (error) {
      alert('通信に失敗したか、条件に合う料理が見つかりませんでした！');
      setIsSpinning(false);
    }
  };

  const FilterChip = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
        isActive 
          ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg' 
          : 'bg-white/60 text-gray-600 border border-gray-100 hover:bg-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 p-6 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-6xl font-black text-orange-600 mb-4 drop-shadow-md">🍱 飯ガチャ</h1>
          <p className="text-gray-500 font-medium text-lg">今日のご飯、迷ったらJavaに聞け！</p>
        </motion.div>

        {/* Settings Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border border-white">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-500">🌟 味の好み</h2>
              <div className="flex gap-3">
                <FilterChip label="あっさり" isActive={selectedTaste === 'あっさり'} onClick={() => setSelectedTaste('あっさり')} />
                <FilterChip label="こってり" isActive={selectedTaste === 'こってり'} onClick={() => setSelectedTaste('こってり')} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-500">📍 食事タイプ</h2>
              <div className="flex gap-3">
                <FilterChip label="自炊" isActive={selectedType === '自炊'} onClick={() => setSelectedType('自炊')} />
                <FilterChip label="外食" isActive={selectedType === '外食'} onClick={() => setSelectedType('外食')} />
                <FilterChip label="コンビニ" isActive={selectedType === 'コンビニ'} onClick={() => setSelectedType('コンビニ')} />
              </div>
            </div>

            <motion.button
              onClick={spinGacha}
              disabled={isSpinning}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-black text-2xl rounded-2xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSpinning ? <RefreshCw className="animate-spin" size={32} /> : <Sparkles size={32} />}
              {isSpinning ? '厳選中...' : 'ガチャを回す！'}
            </motion.button>
          </div>
        </motion.div>

        {/* Result Display */}
        <AnimatePresence mode="wait">
          {(isSpinning || currentMeal) && (
            <motion.div
              key={isSpinning ? "spinning" : currentMeal?.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] shadow-2xl p-10 text-center border-4 border-orange-200"
            >
              {isSpinning ? (
                <div className="py-10">
                  <p className="text-8xl mb-6 animate-bounce">🍳</p>
                  <h3 className="text-5xl font-black text-orange-400 italic tracking-tighter">{displayText}</h3>
                </div>
              ) : currentMeal && (
                <>
                  <div className="text-9xl mb-6">🍱</div>
                  <h3 className="text-5xl font-black text-gray-800 mb-4">{currentMeal.name}</h3>
                  <p className="text-gray-500 text-xl font-medium mb-8 leading-relaxed max-w-sm mx-auto">
                    {currentMeal.description}
                  </p>

                  {currentMeal.sourceType === 'COOKING' && currentMeal.recipeUrl && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8">
                      <a
                        href={currentMeal.recipeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transform transition hover:-translate-y-1"
                      >
                        🍳 作り方を見る <ExternalLink size={20} />
                      </a>
                    </motion.div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <span className="px-5 py-2 bg-orange-100 text-orange-600 rounded-full font-bold">#{currentMeal.category}</span>
                    <span className="px-5 py-2 bg-blue-100 text-blue-600 rounded-full font-bold">#{selectedType}</span>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!currentMeal && !isSpinning && (
          <p className="text-center text-gray-400 font-bold mt-10">条件をセットして、運命のボタンをポチッ！</p>
        )}
      </div>
    </div>
  );
}