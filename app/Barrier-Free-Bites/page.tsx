"use client"

import { useState } from "react"
import FoodAIDialog from "@/components/FoodAIDialog"
import { useTranslation } from 'react-i18next'

export default function BarrierFreeBitesPage() {
  const [filter, setFilter] = useState<"all" | "hearing" | "visual" | "wheelchair" | "cognitive">("all")
  const [copiedPeiGe, setCopiedPeiGe] = useState(false)
  const { t, i18n } = useTranslation('translation')
  const handleCopyAddress = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPeiGe(true)
      setTimeout(() => setCopiedPeiGe(false), 1500)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        setCopiedPeiGe(true)
        setTimeout(() => setCopiedPeiGe(false), 1500)
      } finally {
        document.body.removeChild(ta)
      }
    }
  }

  const openAmapNavigation = (address: string, name?: string) => {
    const keyword = encodeURIComponent(`${name ? name + ' ' : ''}${address}`.trim())
    const url = `https://uri.amap.com/search?keyword=${keyword}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  const isVisible = (type: ("hearing" | "visual" | "wheelchair" | "cognitive") | Array<"hearing" | "visual" | "wheelchair" | "cognitive">) => {
    if (filter === "all") return true;
    const types = Array.isArray(type) ? type : [type];
    return types.includes(filter);
  }

  const renderFeatures = (key: string) => {
    const items = t(key, { returnObjects: true }) as unknown as string[];
    return Array.isArray(items) ? items.map((i, idx) => <li key={idx}>{i}</li>) : null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <style>{`
          :root {
            --color-white: rgba(255, 255, 255, 1);
            --color-cream-50: rgba(252, 252, 249, 1);
            --color-cream-100: rgba(255, 255, 253, 1);
            --color-gray-300: rgba(167, 169, 169, 1);
            --color-slate-500: rgba(98, 108, 113, 1);
            --color-brown-600: rgba(94, 82, 64, 1);
            --color-charcoal-700: rgba(31, 33, 33, 1);
            --color-charcoal-800: rgba(38, 40, 40, 1);
            --color-slate-900: rgba(19, 52, 59, 1);
            --color-teal-300: rgba(50, 184, 198, 1);
            --color-teal-500: rgba(33, 128, 141, 1);
            --color-teal-600: rgba(29, 116, 128, 1);
            --color-teal-700: rgba(8, 145, 178, 1);
            --color-gray-200: rgba(245, 245, 245, 1);
            --color-orange-500: rgba(168, 75, 47, 1);
            --color-brown-600-rgb: 94, 82, 64;
            --color-teal-500-rgb: 33, 128, 141;
            --color-slate-900-rgb: 19, 52, 59;
            --color-gray-400-rgb: 119, 124, 124;
            --color-teal-300-rgb: 50, 184, 198;
            --color-background: var(--color-cream-50);
            --color-surface: var(--color-cream-100);
            --color-text: var(--color-slate-900);
            --color-text-secondary: var(--color-slate-500);
            --color-primary: rgba(147, 51, 234, 1);
            --color-primary-hover: rgba(126, 34, 206, 1);
            --color-accent: rgba(219, 39, 119, 1);
            --color-secondary: rgba(8, 145, 178, 1);
            --color-card-border: rgba(255, 255, 255, 0.2);
            --color-border: rgba(255, 255, 255, 0.2);
            --font-family-base: "FKGroteskNeue", "Microsoft YaHei", "PingFang SC", sans-serif;
            --font-size-sm: 12px;
            --font-size-base: 14px;
            --font-size-lg: 16px;
            --font-size-xl: 18px;
            --font-size-2xl: 20px;
            --font-size-3xl: 24px;
            --font-size-4xl: 30px;
            --font-weight-medium: 500;
            --font-weight-semibold: 550;
            --font-weight-bold: 600;
            --space-8: 8px;
            --space-12: 12px;
            --space-16: 16px;
            --space-20: 20px;
            --space-24: 24px;
            --space-32: 32px;
            --radius-base: 8px;
            --radius-lg: 12px;
            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --color-background: var(--color-charcoal-700);
              --color-surface: var(--color-charcoal-800);
              --color-text: var(--color-gray-200);
              --color-text-secondary: rgba(var(--color-gray-300), 0.7);
              --color-primary: rgba(192, 132, 252, 1);
              --color-card-border: rgba(255, 255, 255, 0.15);
              --color-border: rgba(255, 255, 255, 0.3);
            }
          }
          .header { text-align: center; margin-bottom: var(--space-32); padding: var(--space-24) 0; }
          .subtitle { font-size: var(--font-size-lg); color: var(--color-text-secondary); font-weight: var(--font-weight-medium); }
          .filter-section { display: flex; gap: var(--space-12); margin-bottom: var(--space-32); flex-wrap: wrap; justify-content: center; }
          .filter-btn { padding: var(--space-8) var(--space-20); border: 2px solid var(--color-border); background: var(--color-surface); color: var(--color-text); border-radius: var(--radius-base); cursor: pointer; font-size: var(--font-size-base); font-weight: var(--font-weight-medium); transition: all 0.3s ease; }
          .filter-btn:hover { border-color: var(--color-primary); background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); color: var(--color-white); }
          .filter-btn.active { border-color: var(--color-primary); background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); color: var(--color-white); }
          .restaurants-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-24); margin-bottom: var(--space-32); }
          .restaurant-card { background: var(--color-surface); border: 1px solid var(--color-card-border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); transition: all 0.3s ease; display: flex; flex-direction: column; }
          .restaurant-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }
          .restaurant-card.hidden { display: none; }
          /* 紧凑卡片样式，用于那伽树与无声饭店 */
          .restaurant-card.card-compact .card-header { padding: calc(var(--space-20) * 0.75); }
.restaurant-card.card-compact .card-body { padding: calc(var(--space-20) * 0.75); }
.restaurant-card.card-compact .restaurant-name { font-size: calc(var(--font-size-xl) * 0.9); }
.restaurant-card.card-compact .description { font-size: calc(var(--font-size-base) * 0.95); line-height: 1.6; }
.restaurant-card.card-compact .features-title { font-size: calc(var(--font-size-base) * 0.95); }
.restaurant-card.card-compact .features-list li { font-size: calc(var(--font-size-sm) * 0.95); padding: 2px 0; }
.restaurant-card.card-compact .info-item { font-size: calc(var(--font-size-sm) * 0.95); }

/* 两卡并排容器 */
.card-row { display: grid; grid-template-columns: 1fr; gap: var(--space-20); align-items: stretch; }
@media (max-width: 640px) { .card-row { grid-template-columns: 1fr; } }
          .card-header { background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%); padding: var(--space-20); color: var(--color-white); }
          .restaurant-name { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-8); }
          .accessibility-tags { display: flex; gap: var(--space-8); flex-wrap: wrap; }
          .tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px var(--space-12); background: rgba(255, 255, 255, 0.2); border-radius: 20px; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
          .card-body { padding: var(--space-20); flex-grow: 1; display: flex; flex-direction: column; }
          .description { font-size: var(--font-size-base); color: var(--color-text-secondary); margin-bottom: var(--space-16); line-height: 1.7; }
          .features { margin-bottom: var(--space-16); }
          .features-title { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8); color: var(--color-text); }
          .features-list { list-style: none; padding: 0; }
          .features-list li { font-size: var(--font-size-sm); color: var(--color-text-secondary); padding: 4px 0; padding-left: var(--space-16); position: relative; }
          .features-list li::before { content: "✓"; position: absolute; left: 0; color: var(--color-primary); font-weight: var(--font-weight-bold); }
          .info-section { margin-top: auto; padding-top: var(--space-16); border-top: 1px solid var(--color-card-border); }
          .info-item { display: flex; align-items: flex-start; gap: var(--space-8); margin-bottom: var(--space-8); font-size: var(--font-size-sm); color: var(--color-text-secondary); }
          .info-label { font-weight: var(--font-weight-semibold); color: var(--color-text); min-width: 60px; }
          .about-section { background: var(--color-surface); border: 1px solid var(--color-card-border); border-radius: var(--radius-lg); padding: var(--space-24); margin-top: var(--space-32); }
          .about-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-16); color: var(--color-text); }
          .about-content { font-size: var(--font-size-base); color: var(--color-text-secondary); line-height: 1.8; }
          .icon { font-size: var(--font-size-lg); }
          @media (max-width: 768px) {
            .restaurants-grid { grid-template-columns: 1fr; }
            .filter-section { flex-direction: column; }
            .filter-btn { width: 100%; }
          }
          `}</style>

          <header className="header">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              🌟 {t('bites.title')}
            </h1>
            <p className="subtitle">{t('bites.subtitle')}</p>
          </header>

          <div className="filter-section">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('bites.filters.all')}
            </button>
            <button
              className={`filter-btn ${filter === 'hearing' ? 'active' : ''}`}
              onClick={() => setFilter('hearing')}
            >
              {t('bites.filters.hearing')}
            </button>
            <button
              className={`filter-btn ${filter === 'visual' ? 'active' : ''}`}
              onClick={() => setFilter('visual')}
            >
              {t('bites.filters.visual')}
            </button>
            <button
              className={`filter-btn ${filter === 'wheelchair' ? 'active' : ''}`}
              onClick={() => setFilter('wheelchair')}
            >
              {t('bites.filters.wheelchair')}
            </button>
            <button
              className={`filter-btn ${filter === 'cognitive' ? 'active' : ''}`}
              onClick={() => setFilter('cognitive')}
            >
              {t('bites.filters.cognitive')}
            </button>
          </div>

          <div className="restaurants-grid">
            {/* 培哥烟囱面包 */}
            <div className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`} data-accessibility="hearing">
              <div className="card-header">
                <h2 className="restaurant-name">{t('bites.restaurants.peige.name')}</h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👂</span>
                    {t('bites.tags.hearing')}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.peige.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.peige.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.peige.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.peige.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.peige.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.peige.address'), t('bites.restaurants.peige.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 木马童话黑暗餐厅 */}
            <div className={`restaurant-card ${isVisible('visual') ? '' : 'hidden'}`} data-accessibility="visual">
              <div className="card-header">
                <h2 className="restaurant-name">{t('bites.restaurants.muma_dark.name')}</h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👁️</span>
                    {t('bites.tags.visual')}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.muma_dark.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.muma_dark.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.muma_dark.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.experience')}</span>
                    <span>{t('bites.restaurants.muma_dark.experience')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.muma_dark.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.muma_dark.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.muma_dark.address'), t('bites.restaurants.muma_dark.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 星巴克东方文德手语门店（广州） */}
            <div className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`} data-accessibility="hearing">
              <div className="card-header">
                <h2 className="restaurant-name">{t('bites.restaurants.starbucks_wende.name')}</h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👂</span>
                    {t('bites.tags.hearing')}
                  </span>
                  <span className="tag">
                    <span className="icon">☕</span>
                    咖啡
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.starbucks_wende.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.starbucks_wende.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.starbucks_wende.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.starbucks_wende.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.starbucks_wende.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.starbucks_wende.address'), t('bites.restaurants.starbucks_wende.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 全聚德前门店（北京） */}
            <div className={`restaurant-card ${isVisible('visual') ? '' : 'hidden'}`} data-accessibility="visual">
              <div className="card-header">
                <h2 className="restaurant-name">{t('bites.restaurants.quanjude_qianmen.name')}</h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👁️</span>
                    {t('bites.tags.visual')}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.quanjude_qianmen.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.quanjude_qianmen.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.quanjude_qianmen.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.quanjude_qianmen.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.quanjude_qianmen.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.quanjude_qianmen.address'), t('bites.restaurants.quanjude_qianmen.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 并排展示 那伽树 与 无声饭店 */}
          <div className="card-row">
            {/* 那伽树无障碍咖啡披萨集合店（北京大栅栏） */}
            <div className={`restaurant-card ${isVisible(['visual','wheelchair']) ? '' : 'hidden'}`} data-accessibility="visual wheelchair">
              <div className="card-header">
                <h2 className="restaurant-name">{t('bites.restaurants.naga_tree.name')}</h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👁️</span>
                    {t('bites.tags.visual')}
                  </span>
                  <span className="tag">
                    <span className="icon">♿</span>
                    {t('bites.tags.wheelchair')}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.naga_tree.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.naga_tree.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.highlights')}</span>
                    <span>{t('bites.restaurants.naga_tree.highlights')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.naga_tree.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.naga_tree.address'), t('bites.restaurants.naga_tree.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 无声饭店（云南玉溪） */}
            <div className={`restaurant-card ${isVisible(['hearing','cognitive']) ? '' : 'hidden'}`} data-accessibility="hearing cognitive">
              <div className="card-header">
                  <h2 className="restaurant-name">{t('bites.restaurants.silent_yuxi.name')}</h2>
                  <div className="accessibility-tags">
                    <span className="tag">
                      <span className="icon">👂</span>
                      {t('bites.tags.hearing')}
                    </span>
                    <span className="tag">
                      <span className="icon">🧠</span>
                      {t('bites.tags.cognitive')}
                    </span>
                  </div>
                </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.silent_yuxi.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.silent_yuxi.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.silent_yuxi.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.silent_yuxi.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.silent_yuxi.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.silent_yuxi.address'), t('bites.restaurants.silent_yuxi.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* 原谅小串（北京798艺术园区） */}
            <div className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`} data-accessibility="hearing">
              <div className="card-header">
                  <h2 className="restaurant-name">{t('bites.restaurants.yuanliang_798.name')}</h2>
                  <div className="accessibility-tags">
                    <span className="tag">
                      <span className="icon">👂</span>
                      {t('bites.tags.hearing')}
                    </span>
                  </div>
                </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.yuanliang_798.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.yuanliang_798.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.yuanliang_798.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.yuanliang_798.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.yuanliang_798.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.yuanliang_798.address'), t('bites.restaurants.yuanliang_798.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* 彩虹天使咖啡屋（北京昌平辛庄村） */}
            <div className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`} data-accessibility="hearing">
              <div className="card-header">
                  <h2 className="restaurant-name">{t('bites.restaurants.rainbow_angel.name')}</h2>
                  <div className="accessibility-tags">
                    <span className="tag">
                      <span className="icon">👂</span>
                      {t('bites.tags.hearing')}
                    </span>
                  </div>
                </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.rainbow_angel.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.rainbow_angel.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.rainbow_angel.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.rainbow_angel.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.rainbow_angel.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.rainbow_angel.address'), t('bites.restaurants.rainbow_angel.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* 米娜餐厅（北京通州） */}
            <div className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`} data-accessibility="hearing">
              <div className="card-header">
                  <h2 className="restaurant-name">{t('bites.restaurants.mina_tongzhou.name')}</h2>
                  <div className="accessibility-tags">
                    <span className="tag">
                      <span className="icon">👂</span>
                      {t('bites.tags.hearing')}
                    </span>
                  </div>
                </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.mina_tongzhou.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.mina_tongzhou.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.mina_tongzhou.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.mina_tongzhou.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.mina_tongzhou.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.mina_tongzhou.address'), t('bites.restaurants.mina_tongzhou.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* 无声火锅店（重庆两江新区） */}
            <div className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`} data-accessibility="hearing">
              <div className="card-header">
                  <h2 className="restaurant-name">{t('bites.restaurants.silent_hotpot.name')}</h2>
                  <div className="accessibility-tags">
                    <span className="tag">
                      <span className="icon">👂</span>
                      {t('bites.tags.hearing')}
                    </span>
                  </div>
                </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.silent_hotpot.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.silent_hotpot.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.silent_hotpot.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.silent_hotpot.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.silent_hotpot.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.silent_hotpot.address'), t('bites.restaurants.silent_hotpot.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* 春锄咖啡店（北京盲人学校附近） */}
            <div className={`restaurant-card ${isVisible('cognitive') ? '' : 'hidden'}`} data-accessibility="cognitive">
              <div className="card-header">
                  <h2 className="restaurant-name">{t('bites.restaurants.chunchu.name')}</h2>
                  <div className="accessibility-tags">
                    <span className="tag">
                      <span className="icon">🧠</span>
                      {t('bites.tags.cognitive')}
                    </span>
                  </div>
                </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.chunchu.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.chunchu.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.chunchu.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.chunchu.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.chunchu.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.chunchu.address'), t('bites.restaurants.chunchu.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* 星巴克无障碍店（美国华盛顿特区 联合市场） */}
            <div className={`restaurant-card ${isVisible('wheelchair') ? '' : 'hidden'}`} data-accessibility="wheelchair">
              <div className="card-header">
                  <h2 className="restaurant-name">{t('bites.restaurants.starbucks_dc.name')}</h2>
                  <div className="accessibility-tags">
                    <span className="tag">
                      <span className="icon">♿</span>
                      {t('bites.tags.wheelchair')}
                    </span>
                  </div>
                </div>
              <div className="card-body">
                <p className="description">{t('bites.restaurants.starbucks_dc.description')}</p>
                <div className="features">
                  <h3 className="features-title">{t('bites.labels.features')}</h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.starbucks_dc.features')}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.food')}</span>
                    <span>{t('bites.restaurants.starbucks_dc.food')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.value')}</span>
                    <span>{t('bites.restaurants.starbucks_dc.value')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('bites.labels.address')}</span>
                    <span>{t('bites.restaurants.starbucks_dc.address')}</span>
                    <button
                      aria-label={t('bites.labels.navigate')}
                      className="ml-2 px-2 py-[2px] rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle"
                      onClick={() => openAmapNavigation(t('bites.restaurants.starbucks_dc.address'), t('bites.restaurants.starbucks_dc.name'))}
                    >
                      {t('bites.labels.navigate')}
                    </button>
                    {copiedPeiGe && (
                      <span className="ml-2 text-green-600 text-sm align-middle">{t('bites.labels.copied')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2 className="about-title">{t('bites.about.title')}</h2>
            <p className="about-content">
              {t('bites.about.p1')}
            </p>
            <p className="about-content" style={{ marginTop: 'var(--space-16)' }}>
              {t('bites.about.p2')}
            </p>
          </div>
        </div>
      </div>
      {/* AI 美食推荐对话框触发器 */}
      <FoodAIDialog />
    </div>
  )
}