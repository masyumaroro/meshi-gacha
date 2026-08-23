import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, RefreshCw, Shuffle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Food {
  name: string;
  category: string;
  description: string;
  sourceType: string;
  recipeUrl: string | null;
}

type Taste = 'あっさり' | 'こってり';
type MealType = '自炊' | '外食' | 'コンビニ';

const SOURCE_TYPE_MAP: Record<MealType, string> = {
  '自炊': 'COOKING',
  '外食': 'EAT_OUT',
  'コンビニ': 'CONVENIENCE',
};

export default function App() {
  const [selectedTaste, setSelectedTaste] = useState<Taste | null>(null);
  const [selectedType, setSelectedType] = useState<MealType | null>(null);
  const [currentMeal, setCurrentMeal] = useState<Food | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayText, setDisplayText] = useState('');

  const dummyFoods = ['ラーメン', 'カレー', 'パスタ', '牛丼', '寿司', '焼肉', 'うどん', 'ピザ', 'そば', 'ハンバーグ'];

  const spinGacha = async () => {
    setIsSpinning(true);
    setCurrentMeal(null);

    const params = new URLSearchParams();
    if (selectedTaste === 'あっさり') {
      params.append('heavinessMin', '1');
      params.append('heavinessMax', '2');
    } else if (selectedTaste === 'こってり') {
      params.append('heavinessMin', '4');
      params.append('heavinessMax', '5');
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

  const FilterButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
        active
          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
          : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">

      {/* ヘッダー */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-lg">🍱</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-none">飯ガチャ</h1>
            <p className="text-xs text-slate-400 mt-0.5">今日のご飯をランダムで決定</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-4">

        {/* フィルターカード */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">絞り込み</p>
          </div>

          <div className="px-5 py-4 space-y-5">
            {/* 味の好み */}
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2.5">味の好み</p>
              <div className="flex gap-2">
                <FilterButton
                  label="😌 あっさり"
                  active={selectedTaste === 'あっさり'}
                  onClick={() => setSelectedTaste(selectedTaste === 'あっさり' ? null : 'あっさり')}
                />
                <FilterButton
                  label="🔥 こってり"
                  active={selectedTaste === 'こってり'}
                  onClick={() => setSelectedTaste(selectedTaste === 'こってり' ? null : 'こってり')}
                />
              </div>
            </div>

            {/* 食事タイプ */}
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2.5">食事タイプ</p>
              <div className="flex gap-2">
                {(['自炊', '外食', 'コンビニ'] as MealType[]).map((type) => (
                  <FilterButton
                    key={type}
                    label={type}
                    active={selectedType === type}
                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ガチャボタン */}
        <motion.button
          onClick={spinGacha}
          disabled={isSpinning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-200 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSpinning
            ? <><RefreshCw size={18} className="animate-spin" />選んでいます…</>
            : <><Shuffle size={18} />ガチャを回す</>
          }
        </motion.button>

        {/* 結果カード */}
        <AnimatePresence mode="wait">
          {(isSpinning || currentMeal) && (
            <motion.div
              key={isSpinning ? 'spinning' : currentMeal?.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              {isSpinning ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl animate-bounce">🍳</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{displayText}</p>
                  <p className="text-sm text-slate-400 mt-2">厳選中…</p>
                </div>
              ) : currentMeal && (
                <>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Today's Pick</p>
                    <h2 className="text-3xl font-bold text-white">{currentMeal.name}</h2>
                  </div>

                  <div className="px-6 py-5">
                    <p className="text-slate-600 leading-relaxed mb-5">{currentMeal.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                          {currentMeal.category}
                        </span>
                        {selectedType && (
                          <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full font-medium">
                            {selectedType}
                          </span>
                        )}
                      </div>

                      {currentMeal.sourceType === 'COOKING' && currentMeal.recipeUrl && (
                        <a
                          href={currentMeal.recipeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          レシピ <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!currentMeal && !isSpinning && (
          <p className="text-center text-slate-400 text-sm pt-2">
            条件を選んでボタンを押してください
          </p>
        )}
      </div>
    </div>
  );
}
