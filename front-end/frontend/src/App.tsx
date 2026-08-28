import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';

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

const C = {
  bg: '#0A1628',
  card: '#ffffff',
  cardDark: '#132040',
  orange: '#FF5C1A',
  orangeHover: '#e5511a',
  text: '#ffffff',
  muted: '#8899B4',
  border: '#1E3050',
  tagBg: '#f2f2f7',
  tagText: '#6e6e73',
} as const;

const dummyFoods = ['ラーメン', 'カレー', 'パスタ', '牛丼', '寿司', '焼肉', 'うどん', 'ピザ', 'そば', 'ハンバーグ'];

export default function App() {
  const [selectedTaste, setSelectedTaste] = useState<Taste | null>(null);
  const [selectedType, setSelectedType] = useState<MealType | null>(null);
  const [currentMeal, setCurrentMeal] = useState<Food | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayText, setDisplayText] = useState('');

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

    // アニメーションを即座に開始
    const intervalId = setInterval(() => {
      setDisplayText(dummyFoods[Math.floor(Math.random() * dummyFoods.length)]);
    }, 80);

    try {
      const [response] = await Promise.all([
        fetch(`${API_BASE_URL}/api/foods/gacha?${params.toString()}`),
        new Promise(resolve => setTimeout(resolve, 1200)), // 最低1.2秒はアニメーション
      ]);
      if (response.status === 404) throw new Error('not_found');
      if (!response.ok) throw new Error('server_error');
      const result = await response.json();

      clearInterval(intervalId);
      setCurrentMeal(result);
      setIsSpinning(false);
    } catch (error) {
      clearInterval(intervalId);
      const msg = error instanceof Error && error.message === 'server_error'
        ? 'サーバーエラーが発生しました。'
        : '条件に合う料理が見つかりませんでした。';
      alert(msg);
      setIsSpinning(false);
    }
  };

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      style={{
        padding: '6px 16px',
        borderRadius: 9999,
        fontSize: '0.875rem',
        fontWeight: 500,
        border: `1.5px solid ${active ? C.orange : C.border}`,
        backgroundColor: active ? C.orange : 'transparent',
        color: active ? '#ffffff' : C.muted,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        letterSpacing: '-0.01em',
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* グレインテクスチャ */}
      <style>{`
        .grain-bg::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
      `}</style>

      <div
        className="grain-bg"
        style={{
          minHeight: '100vh',
          backgroundColor: C.bg,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '48px 20px 48px', position: 'relative', zIndex: 1 }}>

          {/* ヘッダー */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ marginBottom: 36 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: C.orange,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                🍱
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: C.orange, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Meshi Gacha
              </span>
            </div>
            <h1 style={{
              fontSize: '2.75rem', fontWeight: 800, color: C.text,
              letterSpacing: '-0.035em', lineHeight: 1.1, margin: 0,
            }}>
              今日のごはん、<br />もう迷わない。
            </h1>
            <p style={{ color: C.muted, fontSize: '0.9375rem', marginTop: 12, lineHeight: 1.6 }}>
              条件を選んで、運命に従おう。
            </p>
          </motion.div>

          {/* フィルターカード */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
            style={{
              backgroundColor: C.cardDark,
              borderRadius: 20,
              border: `1px solid ${C.border}`,
              marginBottom: 12,
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '18px 20px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                味の好み
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Chip label="あっさり" active={selectedTaste === 'あっさり'} onClick={() => setSelectedTaste(selectedTaste === 'あっさり' ? null : 'あっさり')} />
                <Chip label="こってり" active={selectedTaste === 'こってり'} onClick={() => setSelectedTaste(selectedTaste === 'こってり' ? null : 'こってり')} />
              </div>
            </div>

            <div style={{ height: 1, backgroundColor: C.border }} />

            <div style={{ padding: '18px 20px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                食事タイプ
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['自炊', '外食', 'コンビニ'] as MealType[]).map((type) => (
                  <Chip key={type} label={type} active={selectedType === type} onClick={() => setSelectedType(selectedType === type ? null : type)} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ガチャボタン */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.14 }}
            style={{ marginBottom: 28 }}
          >
            <motion.button
              onClick={spinGacha}
              disabled={isSpinning}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', height: 56,
                backgroundColor: isSpinning ? C.orangeHover : C.orange,
                color: '#ffffff',
                border: 'none',
                borderRadius: 16,
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: isSpinning ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(255, 92, 26, 0.35)',
                transition: 'background-color 0.15s ease',
              }}
            >
              {isSpinning ? (
                '選んでいます…'
              ) : (
                <>今日のご飯を決める <ArrowRight size={18} /></>
              )}
            </motion.button>
          </motion.div>

          {/* 結果エリア */}
          <AnimatePresence mode="wait">
            {isSpinning && (
              <motion.div
                key="spinning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '32px 0' }}
              >
                <p style={{
                  fontSize: '2.25rem', fontWeight: 800, color: C.text,
                  letterSpacing: '-0.03em',
                }}>
                  {displayText}
                </p>
                <p style={{ color: C.muted, fontSize: '0.875rem', marginTop: 8 }}>厳選中…</p>
              </motion.div>
            )}

            {currentMeal && !isSpinning && (
              <motion.div
                key={currentMeal.name}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  backgroundColor: C.card,
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 8px 40px rgba(10, 22, 40, 0.4)',
                }}
              >
                {/* カードヘッダー */}
                <div style={{
                  backgroundColor: C.orange,
                  padding: '20px 24px 18px',
                }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                    Today's Pick
                  </p>
                  <h2 style={{
                    fontSize: '2rem', fontWeight: 800, color: '#ffffff',
                    letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0,
                  }}>
                    {currentMeal.name}
                  </h2>
                </div>

                {/* カードボディ */}
                <div style={{ padding: '20px 24px 24px' }}>
                  <p style={{ color: '#4a5568', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: 20 }}>
                    {currentMeal.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px',
                        backgroundColor: '#f2f2f7', color: '#6e6e73', borderRadius: 9999,
                      }}>
                        {currentMeal.category}
                      </span>
                      {selectedType && (
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px',
                          backgroundColor: '#f2f2f7', color: '#6e6e73', borderRadius: 9999,
                        }}>
                          {selectedType}
                        </span>
                      )}
                    </div>

                    {currentMeal.sourceType === 'COOKING' && currentMeal.recipeUrl && (
                      <a
                        href={currentMeal.recipeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          fontSize: '0.875rem', fontWeight: 600,
                          color: C.orange, textDecoration: 'none',
                        }}
                      >
                        レシピ <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!currentMeal && !isSpinning && (
            <p style={{ textAlign: 'center', color: C.border, fontSize: '0.875rem', marginTop: 8 }}>
              条件を選んでボタンを押してください
            </p>
          )}
        </div>
      </div>
    </>
  );
}
