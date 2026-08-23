import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, RefreshCw } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Food {
  name: string;
  category: string;
  description: string;
  sourceType: string;
  recipeUrl: string | null;
}

type MealType = '自炊' | '外食' | 'コンビニ';

const HEAVINESS_LABELS: Record<number, string> = {
  1: 'あっさり',
  2: 'やや軽め',
  3: '普通',
  4: 'やや重め',
  5: 'こってり',
};

const SOURCE_TYPE_MAP: Record<MealType, string> = {
  '自炊': 'COOKING',
  '外食': 'EAT_OUT',
  'コンビニ': 'CONVENIENCE',
};

export default function App() {
  const [heaviness, setHeaviness] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<MealType | null>(null);
  const [currentMeal, setCurrentMeal] = useState<Food | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayText, setDisplayText] = useState('');

  const dummyFoods = ['ラーメン', 'カレー', 'パスタ', '牛丼', '寿司', '焼肉', 'うどん', 'ピザ', 'そば', 'ハンバーグ'];

  const spinGacha = async () => {
    setIsSpinning(true);
    setCurrentMeal(null);

    const params = new URLSearchParams();
    if (heaviness !== null) {
      params.append('heavinessMin', String(heaviness));
      params.append('heavinessMax', String(heaviness));
    }
    if (selectedType) params.append('sourceType', SOURCE_TYPE_MAP[selectedType]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/foods/gacha?${params.toString()}`);
      if (response.status === 404) throw new Error('not_found');
      if (!response.ok) throw new Error('server_error');
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
      const msg = error instanceof Error && error.message === 'server_error'
        ? 'サーバーエラーが発生しました。'
        : '条件に合う料理が見つかりませんでした。';
      alert(msg);
      setIsSpinning(false);
    }
  };

  const TypeChip = ({ label }: { label: MealType }) => (
    <button
      onClick={() => setSelectedType(selectedType === label ? null : label)}
      className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
        selectedType === label
          ? 'bg-green-800 text-stone-50 border-green-800'
          : 'bg-transparent text-stone-500 border-stone-300 hover:border-green-800 hover:text-green-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <div className="max-w-lg mx-auto px-6 py-12">

        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-widest text-stone-400 uppercase mb-3">Today's Meal</p>
          <h1 className="text-5xl font-bold text-green-900 mb-2">飯ガチャ</h1>
          <div className="w-12 h-px bg-stone-300 mx-auto mt-4" />
        </motion.div>

        {/* フィルターカード */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-stone-200 rounded-2xl p-6 mb-6 space-y-6"
        >
          {/* 味の重さ */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-stone-600">味の重さ</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${heaviness !== null ? 'text-green-800 font-medium' : 'text-stone-400'}`}>
                  {heaviness !== null ? HEAVINESS_LABELS[heaviness] : 'こだわらない'}
                </span>
                {heaviness !== null && (
                  <button
                    onClick={() => setHeaviness(null)}
                    className="text-xs text-stone-400 hover:text-stone-600 underline"
                  >
                    解除
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={heaviness ?? 3}
                onChange={(e) => setHeaviness(Number(e.target.value))}
                className="w-full h-1 rounded appearance-none cursor-pointer accent-green-800 bg-stone-200"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-stone-400">あっさり</span>
                <span className="text-xs text-stone-400">こってり</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-stone-100" />

          {/* 食事タイプ */}
          <div>
            <span className="text-sm font-medium text-stone-600 block mb-3">食事タイプ</span>
            <div className="flex gap-2">
              <TypeChip label="自炊" />
              <TypeChip label="外食" />
              <TypeChip label="コンビニ" />
            </div>
          </div>
        </motion.div>

        {/* ガチャボタン */}
        <motion.button
          onClick={spinGacha}
          disabled={isSpinning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-green-800 hover:bg-green-700 text-stone-50 font-bold text-lg rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-8"
        >
          {isSpinning
            ? <><RefreshCw size={20} className="animate-spin" /> 選んでいます…</>
            : '今日のご飯を決める'
          }
        </motion.button>

        {/* 結果カード */}
        <AnimatePresence mode="wait">
          {(isSpinning || currentMeal) && (
            <motion.div
              key={isSpinning ? 'spinning' : currentMeal?.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-stone-200 rounded-2xl p-8 text-center"
            >
              {isSpinning ? (
                <div className="py-8">
                  <p className="text-4xl mb-4">🍳</p>
                  <p className="text-2xl font-bold text-stone-400 tracking-wide">{displayText}</p>
                </div>
              ) : currentMeal && (
                <>
                  <p className="text-xs tracking-widest text-stone-400 uppercase mb-4">Result</p>
                  <h2 className="text-4xl font-bold text-green-900 mb-4">{currentMeal.name}</h2>
                  <p className="text-stone-500 leading-relaxed mb-6 max-w-xs mx-auto">
                    {currentMeal.description}
                  </p>

                  {currentMeal.sourceType === 'COOKING' && currentMeal.recipeUrl && (
                    <a
                      href={currentMeal.recipeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-green-800 hover:text-green-600 underline underline-offset-4 mb-6"
                    >
                      レシピを見る <ExternalLink size={14} />
                    </a>
                  )}

                  <div className="flex gap-2 justify-center mt-2">
                    <span className="text-xs px-3 py-1 bg-stone-100 text-stone-500 rounded-full">
                      {currentMeal.category}
                    </span>
                    {selectedType && (
                      <span className="text-xs px-3 py-1 bg-stone-100 text-stone-500 rounded-full">
                        {selectedType}
                      </span>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!currentMeal && !isSpinning && (
          <p className="text-center text-stone-400 text-sm mt-4">
            条件を選んでボタンを押してください
          </p>
        )}
      </div>
    </div>
  );
}
