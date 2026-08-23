import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

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

  const Chip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-[#0071e3] text-white'
          : 'bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#d8d8dd]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif' }}
    >
      <div className="max-w-md mx-auto w-full px-5 py-12 flex flex-col gap-6">

        {/* タイトル */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="pt-4"
        >
          <h1 style={{ color: '#1d1d1f', fontSize: '2.625rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            飯ガチャ
          </h1>
          <p style={{ color: '#6e6e73', fontSize: '1.0625rem', marginTop: '0.375rem' }}>
            今日のごはんを、運命にゆだねよう。
          </p>
        </motion.div>

        {/* フィルター */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff' }}
        >
          {/* 味の好み */}
          <div className="px-5 py-4">
            <p style={{ color: '#6e6e73', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>
              味の好み
            </p>
            <div className="flex gap-2">
              <Chip label="あっさり" active={selectedTaste === 'あっさり'} onClick={() => setSelectedTaste(selectedTaste === 'あっさり' ? null : 'あっさり')} />
              <Chip label="こってり" active={selectedTaste === 'こってり'} onClick={() => setSelectedTaste(selectedTaste === 'こってり' ? null : 'こってり')} />
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#f2f2f7', margin: '0 20px' }} />

          {/* 食事タイプ */}
          <div className="px-5 py-4">
            <p style={{ color: '#6e6e73', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>
              食事タイプ
            </p>
            <div className="flex gap-2">
              {(['自炊', '外食', 'コンビニ'] as MealType[]).map((type) => (
                <Chip
                  key={type}
                  label={type}
                  active={selectedType === type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ボタン */}
        <motion.button
          onClick={spinGacha}
          disabled={isSpinning}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1 }}
          className="w-full py-4 rounded-2xl font-semibold text-white text-base transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#0071e3', letterSpacing: '-0.01em' }}
        >
          {isSpinning ? '選んでいます…' : '今日のご飯を決める'}
        </motion.button>

        {/* 結果 */}
        <AnimatePresence mode="wait">
          {(isSpinning || currentMeal) && (
            <motion.div
              key={isSpinning ? 'spinning' : currentMeal?.name}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: '#ffffff' }}
            >
              {isSpinning ? (
                <div className="px-6 py-14 text-center">
                  <p
                    className="text-3xl font-bold"
                    style={{ color: '#1d1d1f', letterSpacing: '-0.02em', fontFamily: 'inherit' }}
                  >
                    {displayText}
                  </p>
                  <p style={{ color: '#6e6e73', fontSize: '0.9375rem', marginTop: '0.5rem' }}>選んでいます…</p>
                </div>
              ) : currentMeal && (
                <div className="px-6 py-6">
                  <p style={{ color: '#6e6e73', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Today's Pick
                  </p>
                  <h2
                    style={{ color: '#1d1d1f', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '0.75rem' }}
                  >
                    {currentMeal.name}
                  </h2>
                  <p style={{ color: '#6e6e73', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {currentMeal.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#f2f2f7', color: '#6e6e73' }}
                      >
                        {currentMeal.category}
                      </span>
                      {selectedType && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#f2f2f7', color: '#6e6e73' }}
                        >
                          {selectedType}
                        </span>
                      )}
                    </div>

                    {currentMeal.sourceType === 'COOKING' && currentMeal.recipeUrl && (
                      <a
                        href={currentMeal.recipeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
                        style={{ color: '#0071e3' }}
                      >
                        レシピを見る <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!currentMeal && !isSpinning && (
          <p className="text-center text-sm" style={{ color: '#aeaeb2' }}>
            条件を選んでボタンを押してください
          </p>
        )}
      </div>
    </div>
  );
}
