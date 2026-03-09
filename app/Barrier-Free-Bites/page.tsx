'use client'

import { useState } from 'react'
import FoodAIDialog from '@/components/FoodAIDialog'
import { useTranslation } from 'react-i18next'

// 安全翻译组件，避免水合错误
function SafeTranslation({
  tKey,
  fallback,
}: {
  tKey: string
  fallback: string
}) {
  const { t, ready } = useTranslation('translation')
  return <>{ready ? t(tKey) : fallback}</>
}

export default function BarrierFreeBitesPage() {
  const [filter, setFilter] = useState<
    'all' | 'hearing' | 'visual' | 'wheelchair' | 'cognitive'
  >('all')

  // 餐厅坐标信息
  const restaurantCoords = {
    // 更新：培哥烟囱面包（合肥庐阳区），与翻译文案一致
    peige: {
      lat: 31.863,
      lng: 117.281,
      address: '安徽省合肥市庐阳区含山路29号105-3室',
    },
    muma: { lat: 39.9365, lng: 116.4477, address: '北京市朝阳区工体北路' },
    starbucks: { lat: 23.1291, lng: 113.2644, address: '广州市天河区' },
    // 更新：星巴克东方文德手语门店（广州越秀 文德北路68号 东方文德广场一层），用于页面中的 'starbucks_wende' key
    starbucks_wende: {
      lat: 23.129,
      lng: 113.264,
      address: '广州市越秀区文德北路68号东方文德广场一层',
    },
  }

  const [navigationLoading, setNavigationLoading] = useState<string | null>(
    null,
  )
  const openAmapNavigation = (
    place: keyof typeof restaurantCoords | string,
    name?: string,
  ) => {
    const isKnownKey = typeof place === 'string' && place in restaurantCoords
    const restaurant = isKnownKey
      ? restaurantCoords[place as keyof typeof restaurantCoords]
      : typeof place !== 'string'
        ? restaurantCoords[place]
        : undefined

    // 记录加载状态使用字符串，便于任意地址对比
    setNavigationLoading(String(place))

    if (!restaurant) {
      // 未预设坐标：使用网页版标记链接进行导航/定位
      const address = typeof place === 'string' ? place : name || ''
      const markerUrl = `https://uri.amap.com/marker?address=${encodeURIComponent(address)}&name=${encodeURIComponent(name || address)}`
      window.open(markerUrl, '_blank', 'noopener,noreferrer')
      setNavigationLoading(null)
      return
    }

    // 构建高德地图 APP 协议链接
    const appUrl = `amapuri://route/plan/?dlat=${restaurant.lat}&dlon=${restaurant.lng}&dname=${encodeURIComponent(name || restaurant.address)}&dev=0&t=0`

    // 构建网页版链接作为回退
    const webUrl = `https://uri.amap.com/navigation?to=${restaurant.lng},${restaurant.lat},${encodeURIComponent(name || restaurant.address)}&mode=car&policy=1&src=mypage`

    // 尝试打开 APP，如果失败则打开网页版
    const tryOpenApp = () => {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = appUrl
      document.body.appendChild(iframe)

      // 设置超时，如果 APP 没有响应则打开网页版
      const timeout = setTimeout(() => {
        document.body.removeChild(iframe)
        window.open(webUrl, '_blank', 'noopener,noreferrer')
        setNavigationLoading(null)
      }, 2000)

      // 监听页面可见性变化，如果用户切换到其他应用说明 APP 打开成功
      const handleVisibilityChange = () => {
        if (document.hidden) {
          clearTimeout(timeout)
          document.body.removeChild(iframe)
          document.removeEventListener(
            'visibilitychange',
            handleVisibilityChange,
          )
          setNavigationLoading(null)
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)

      // 清理函数
      setTimeout(() => {
        try {
          if (iframe.parentNode) {
            document.body.removeChild(iframe)
          }
          document.removeEventListener(
            'visibilitychange',
            handleVisibilityChange,
          )
        } catch {
          // 忽略清理错误
        }
      }, 3000)
    }

    // 检测是否为移动设备
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )

    if (isMobile) {
      tryOpenApp()
    } else {
      // 桌面端直接打开网页版
      window.open(webUrl, '_blank', 'noopener,noreferrer')
      setNavigationLoading(null)
    }
  }
  const isVisible = (
    type:
      | ('hearing' | 'visual' | 'wheelchair' | 'cognitive')
      | Array<'hearing' | 'visual' | 'wheelchair' | 'cognitive'>,
  ) => {
    if (filter === 'all') return true
    const types = Array.isArray(type) ? type : [type]
    return types.includes(filter)
  }

  const renderFeatures = (key: string, fallbackItems: string[]) => {
    return fallbackItems.map((fallback, idx) => (
      <li key={idx}>
        <SafeTranslation tKey={`${key}.${idx}`} fallback={fallback} />
      </li>
    ))
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
          .about-section { position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.96)); border: 1px solid var(--color-card-border); border-radius: var(--radius-lg); padding: var(--space-24); margin-top: var(--space-32); box-shadow: 0 12px 28px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04); }
          .about-section::before { content: ""; position: absolute; inset: -40px -40px; background: radial-gradient(1200px 1200px at 10% 10%, rgba(236,72,153,0.18), transparent 60%), radial-gradient(1000px 1000px at 90% 20%, rgba(168,85,247,0.15), transparent 55%), radial-gradient(800px 800px at 50% 100%, rgba(6,182,212,0.14), transparent 60%); pointer-events: none; filter: blur(40px); }
          .about-header { position: relative; display: flex; align-items: center; gap: var(--space-12); margin-bottom: var(--space-12); }
          .about-icon { flex: 0 0 auto; width: 36px; height: 36px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: var(--color-white); background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%); box-shadow: 0 6px 14px rgba(168,85,247,0.3), 0 2px 6px rgba(236,72,153,0.25); font-size: var(--font-size-lg); }
          .about-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--color-text); letter-spacing: 0.2px; }
          .about-content { position: relative; font-size: var(--font-size-base); color: var(--color-text-secondary); line-height: 1.85; }
          .about-content p { margin-bottom: var(--space-12); }
          @media (max-width: 768px) { .about-section { padding: var(--space-20); } .about-icon { width: 32px; height: 32px; } .about-title { font-size: var(--font-size-xl); } }
          .icon { font-size: var(--font-size-lg); }
          @media (max-width: 768px) {
            .restaurants-grid { grid-template-columns: 1fr; }
            .filter-section { flex-direction: column; }
            .filter-btn { width: 100%; }
          }
          `}</style>

          <header className="header">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              🌟{' '}
              <SafeTranslation
                tKey="bites.title"
                fallback="无障碍友好美食指南"
              />
            </h1>
            <p className="subtitle">
              <SafeTranslation
                tKey="bites.subtitle"
                fallback="发现包容性餐饮体验"
              />
            </p>
          </header>

          <div className="filter-section">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <SafeTranslation tKey="bites.filters.all" fallback="全部" />
            </button>
            <button
              className={`filter-btn ${filter === 'hearing' ? 'active' : ''}`}
              onClick={() => setFilter('hearing')}
            >
              <SafeTranslation
                tKey="bites.filters.hearing"
                fallback="听障友好"
              />
            </button>
            <button
              className={`filter-btn ${filter === 'visual' ? 'active' : ''}`}
              onClick={() => setFilter('visual')}
            >
              <SafeTranslation
                tKey="bites.filters.visual"
                fallback="视障友好"
              />
            </button>
            <button
              className={`filter-btn ${filter === 'wheelchair' ? 'active' : ''}`}
              onClick={() => setFilter('wheelchair')}
            >
              <SafeTranslation
                tKey="bites.filters.wheelchair"
                fallback="轮椅友好"
              />
            </button>
            <button
              className={`filter-btn ${filter === 'cognitive' ? 'active' : ''}`}
              onClick={() => setFilter('cognitive')}
            >
              <SafeTranslation
                tKey="bites.filters.cognitive"
                fallback="认知友好"
              />
            </button>
          </div>

          <div className="restaurants-grid">
            {/* 培哥烟囱面包 */}
            <div
              className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`}
              data-accessibility="hearing"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.peige.name"
                    fallback="培哥烟囱面包"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👂</span>
                    <SafeTranslation
                      tKey="bites.tags.hearing"
                      fallback="听障友好"
                    />
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.peige.description"
                    fallback="专为听障人士设计的温馨面包店"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.peige.features', [
                      '手语服务',
                      '视觉菜单',
                      '无障碍设施',
                    ])}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.food"
                        fallback="美食类型"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.peige.food"
                        fallback="面包、咖啡"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.value"
                        fallback="人均消费"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.peige.value"
                        fallback="¥30-50"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.peige.address"
                        fallback="安徽省合肥市庐阳区含山路29号105-3室"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        openAmapNavigation('peige', '培哥烟囱面包')
                      }
                      disabled={navigationLoading === 'peige'}
                    >
                      {navigationLoading === 'peige' ? (
                        <>
                          <svg
                            className="animate-spin h-3 w-3"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <SafeTranslation
                            tKey="bites.labels.navigating"
                            fallback="导航中..."
                          />
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <SafeTranslation
                            tKey="bites.labels.navigate"
                            fallback="导航"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 木马童话黑暗餐厅 */}
            <div
              className={`restaurant-card ${isVisible('visual') ? '' : 'hidden'}`}
              data-accessibility="visual"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.muma_dark.name"
                    fallback="木马黑暗餐厅"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👁️</span>
                    <SafeTranslation
                      tKey="bites.tags.visual"
                      fallback="视障友好"
                    />
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.muma_dark.description"
                    fallback="在黑暗中用心感受美食的独特体验"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.muma_dark.features', [
                      '黑暗用餐体验',
                      '专业引导服务',
                      '感官训练',
                    ])}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.food"
                        fallback="主要菜品"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.muma_dark.food"
                        fallback="西式料理、创意菜品"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.experience"
                        fallback="体验特色"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.muma_dark.experience"
                        fallback="黑暗中的感官盛宴"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.value"
                        fallback="人均消费"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.muma_dark.value"
                        fallback="¥150-200"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.muma_dark.address"
                        fallback="北京市朝阳区工体北路"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => openAmapNavigation('muma', '木马黑暗餐厅')}
                      disabled={navigationLoading === 'muma'}
                    >
                      {navigationLoading === 'muma' ? (
                        <>
                          <svg
                            className="animate-spin h-3 w-3"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <SafeTranslation
                            tKey="bites.labels.navigating"
                            fallback="导航中..."
                          />
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <SafeTranslation
                            tKey="bites.labels.navigate"
                            fallback="导航"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 星巴克东方文德手语门店（广州） */}
            <div
              className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`}
              data-accessibility="hearing"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.starbucks_wende.name"
                    fallback="星巴克文德店"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👂</span>
                    <SafeTranslation
                      tKey="bites.tags.hearing"
                      fallback="听障友好"
                    />
                  </span>
                  <span className="tag">
                    <span className="icon">☕</span>
                    咖啡
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.starbucks_wende.description"
                    fallback="提供手语服务的温馨咖啡店"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures(
                      'bites.restaurants.starbucks_wende.features',
                      ['手语服务', '写字板沟通', '视觉菜单'],
                    )}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.food"
                        fallback="主要菜品"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.starbucks_wende.food"
                        fallback="咖啡、轻食、甜品"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.value"
                        fallback="人均消费"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.starbucks_wende.value"
                        fallback="¥40-60"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.starbucks_wende.address"
                        fallback="广州市越秀区文德北路68号东方文德广场一层"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        openAmapNavigation('starbucks_wende', '星巴克文德店')
                      }
                      disabled={navigationLoading === 'starbucks_wende'}
                    >
                      {navigationLoading === 'starbucks_wende' ? (
                        <>
                          <svg
                            className="animate-spin h-3 w-3"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <SafeTranslation
                            tKey="bites.labels.navigating"
                            fallback="导航中..."
                          />
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <SafeTranslation
                            tKey="bites.labels.navigate"
                            fallback="导航"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 全聚德前门店（北京） */}
            <div
              className={`restaurant-card ${isVisible('visual') ? '' : 'hidden'}`}
              data-accessibility="visual"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.quanjude_qianmen.name"
                    fallback="全聚德前门店"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👁️</span>
                    <SafeTranslation
                      tKey="bites.tags.visual"
                      fallback="视障友好"
                    />
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.quanjude_qianmen.description"
                    fallback="百年老字号，提供视障友好服务"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures(
                      'bites.restaurants.quanjude_qianmen.features',
                      ['语音菜单', '服务员引导', '触觉辅助'],
                    )}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.food"
                        fallback="主要菜品"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.quanjude_qianmen.food"
                        fallback="北京烤鸭、传统京菜"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.value"
                        fallback="人均消费"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.quanjude_qianmen.value"
                        fallback="¥200-300"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.quanjude_qianmen.address"
                        fallback="北京市东城区前门大街"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        openAmapNavigation(
                          '北京市东城区前门大街',
                          '全聚德前门店',
                        )
                      }
                    >
                      <svg
                        className="h-3 w-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <SafeTranslation
                        tKey="bites.labels.navigate"
                        fallback="导航"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 并排展示 那伽树 与 无声饭店 */}
          <div className="card-row">
            {/* 那伽树无障碍咖啡披萨集合店（北京大栅栏） */}
            <div
              className={`restaurant-card ${isVisible(['visual', 'wheelchair']) ? '' : 'hidden'}`}
              data-accessibility="visual wheelchair"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.naga_tree.name"
                    fallback="那伽树无障碍咖啡披萨集合店"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👁️</span>
                    <SafeTranslation
                      tKey="bites.tags.visual"
                      fallback="视障友好"
                    />
                  </span>
                  <span className="tag">
                    <span className="icon">♿</span>
                    <SafeTranslation
                      tKey="bites.tags.wheelchair"
                      fallback="轮椅友好"
                    />
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.naga_tree.description"
                    fallback="专为残障人士设计的无障碍餐厅"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.naga_tree.features', [
                      '无障碍通道',
                      '盲文菜单',
                      '轮椅友好',
                    ])}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.highlights"
                        fallback="特色亮点"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.naga_tree.highlights"
                        fallback="咖啡、披萨、无障碍设施"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.naga_tree.address"
                        fallback="北京市西城区大栅栏"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        openAmapNavigation(
                          '北京市西城区大栅栏',
                          '那伽树无障碍咖啡披萨集合店',
                        )
                      }
                    >
                      <svg
                        className="h-3 w-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <SafeTranslation
                        tKey="bites.labels.navigate"
                        fallback="导航"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 无声饭店（云南玉溪） */}
            <div
              className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`}
              data-accessibility="hearing"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.silent_yuxi.name"
                    fallback="无声饭店"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👂</span>
                    <SafeTranslation
                      tKey="bites.tags.hearing"
                      fallback="听障友好"
                    />
                  </span>
                  {/* 移除认知友好标签 */}
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.silent_yuxi.description"
                    fallback="专为听障和认知障碍人士服务的餐厅"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.silent_yuxi.features', [
                      '手语服务',
                      '图片菜单',
                      '耐心服务',
                    ])}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.food"
                        fallback="主要菜品"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.silent_yuxi.food"
                        fallback="云南菜、米线、过桥米线"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.value"
                        fallback="人均消费"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.silent_yuxi.value"
                        fallback="¥25-40"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.silent_yuxi.address"
                        fallback="云南省玉溪市红塔区"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        openAmapNavigation('云南省玉溪市红塔区', '无声饭店')
                      }
                    >
                      <svg
                        className="h-3 w-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <SafeTranslation
                        tKey="bites.labels.navigate"
                        fallback="导航"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 并排展示 圆亮798 与 彩虹天使 */}
          <div className="card-row">
            {/* 圆亮798（北京） */}
            <div
              className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`}
              data-accessibility="hearing"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.yuanliang_798.name"
                    fallback="圆亮798"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👂</span>
                    <SafeTranslation
                      tKey="bites.tags.hearing"
                      fallback="听障友好"
                    />
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.yuanliang_798.description"
                    fallback="798艺术区内的听障友好餐厅"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures(
                      'bites.restaurants.yuanliang_798.features',
                      ['手语服务', '艺术氛围', '创意菜品'],
                    )}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.food"
                        fallback="主要菜品"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.yuanliang_798.food"
                        fallback="创意菜、咖啡、轻食"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.value"
                        fallback="人均消费"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.yuanliang_798.value"
                        fallback="¥80-120"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.yuanliang_798.address"
                        fallback="北京市朝阳区798艺术区"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        openAmapNavigation('北京市朝阳区798艺术区', '圆亮798')
                      }
                    >
                      <svg
                        className="h-3 w-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <SafeTranslation
                        tKey="bites.labels.navigate"
                        fallback="导航"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 彩虹天使咖啡屋（北京昌平辛庄村） */}
            <div
              className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`}
              data-accessibility="hearing"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.rainbow_angel.name"
                    fallback="彩虹天使"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👂</span>
                    <SafeTranslation
                      tKey="bites.tags.hearing"
                      fallback="听障友好"
                    />
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.rainbow_angel.description"
                    fallback="温馨的听障友好餐厅"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures(
                      'bites.restaurants.rainbow_angel.features',
                      ['手语服务', '温馨环境', '贴心服务'],
                    )}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.food"
                        fallback="主要菜品"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.rainbow_angel.food"
                        fallback="家常菜、汤品、小食"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.value"
                        fallback="人均消费"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.rainbow_angel.value"
                        fallback="¥35-55"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.rainbow_angel.address"
                        fallback="北京市海淀区中关村"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        openAmapNavigation('北京市海淀区中关村', '彩虹天使')
                      }
                    >
                      <svg
                        className="h-3 w-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <SafeTranslation
                        tKey="bites.labels.navigate"
                        fallback="导航"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 米娜餐厅（北京通州） */}
            <div
              className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`}
              data-accessibility="hearing"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.mina_tongzhou.name"
                    fallback="米娜通州店"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👂</span>
                    <SafeTranslation
                      tKey="bites.tags.hearing"
                      fallback="听障友好"
                    />
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.mina_tongzhou.description"
                    fallback="通州区的听障友好餐厅"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures(
                      'bites.restaurants.mina_tongzhou.features',
                      ['手语服务', '写字板沟通', '耐心服务'],
                    )}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.food"
                        fallback="主要菜品"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.mina_tongzhou.food"
                        fallback="川菜、火锅、小炒"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.value"
                        fallback="人均消费"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.mina_tongzhou.value"
                        fallback="¥45-70"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.mina_tongzhou.address"
                        fallback="北京市通州区万达广场"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        openAmapNavigation('北京市通州区万达广场', '米娜通州店')
                      }
                    >
                      <svg
                        className="h-3 w-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <SafeTranslation
                        tKey="bites.labels.navigate"
                        fallback="导航"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 无声火锅（北京） */}
            <div
              className={`restaurant-card ${isVisible('hearing') ? '' : 'hidden'}`}
              data-accessibility="hearing"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.silent_hotpot.name"
                    fallback="无声火锅"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">👂</span>
                    <SafeTranslation
                      tKey="bites.tags.hearing"
                      fallback="听障友好"
                    />
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.silent_hotpot.description"
                    fallback="专为听障人士设计的火锅店"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures(
                      'bites.restaurants.silent_hotpot.features',
                      ['手语服务', '图片菜单', '无声点餐'],
                    )}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.food"
                        fallback="主要菜品"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.silent_hotpot.food"
                        fallback="火锅、涮菜、调料"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.value"
                        fallback="人均消费"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.silent_hotpot.value"
                        fallback="¥60-90"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.silent_hotpot.address"
                        fallback="北京市丰台区方庄"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        openAmapNavigation('北京市丰台区方庄', '无声火锅')
                      }
                    >
                      <svg
                        className="h-3 w-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <SafeTranslation
                        tKey="bites.labels.navigate"
                        fallback="导航"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 并排展示 春厨 与 星巴克DC店 */}
          <div className="card-row">
            {/* 春厨（北京） */}
            <div
              className={`restaurant-card ${isVisible('cognitive') ? '' : 'hidden'}`}
              data-accessibility="cognitive"
            >
              <div className="card-header">
                <h2 className="restaurant-name">
                  <SafeTranslation
                    tKey="bites.restaurants.chunchu.name"
                    fallback="春厨"
                  />
                </h2>
                <div className="accessibility-tags">
                  <span className="tag">
                    <span className="icon">🧠</span>
                    <SafeTranslation
                      tKey="bites.tags.cognitive"
                      fallback="认知友好"
                    />
                  </span>
                </div>
              </div>
              <div className="card-body">
                <p className="description">
                  <SafeTranslation
                    tKey="bites.restaurants.chunchu.description"
                    fallback="专为认知障碍人士设计的餐厅"
                  />
                </p>
                <div className="features">
                  <h3 className="features-title">
                    <SafeTranslation
                      tKey="bites.labels.features"
                      fallback="特色服务"
                    />
                  </h3>
                  <ul className="features-list">
                    {renderFeatures('bites.restaurants.chunchu.features', [
                      '简化菜单',
                      '耐心服务',
                      '清晰标识',
                    ])}
                  </ul>
                </div>
                <div className="info-section">
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.food"
                        fallback="主要菜品"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.chunchu.food"
                        fallback="家常菜、汤品、面食"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.value"
                        fallback="人均消费"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.chunchu.value"
                        fallback="¥30-50"
                      />
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <SafeTranslation
                        tKey="bites.labels.address"
                        fallback="地址"
                      />
                    </span>
                    <span>
                      <SafeTranslation
                        tKey="bites.restaurants.chunchu.address"
                        fallback="北京市西城区德胜门"
                      />
                    </span>
                    <button
                      aria-label="导航"
                      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        openAmapNavigation('北京市西城区德胜门', '春厨')
                      }
                    >
                      <svg
                        className="h-3 w-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <SafeTranslation
                        tKey="bites.labels.navigate"
                        fallback="导航"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* 星巴克DC店（北京） */}
              <div
                className={`restaurant-card ${isVisible('wheelchair') ? '' : 'hidden'}`}
                data-accessibility="wheelchair"
              >
                <div className="card-header">
                  <h2 className="restaurant-name">
                    <SafeTranslation
                      tKey="bites.restaurants.starbucks_dc.name"
                      fallback="星巴克DC店"
                    />
                  </h2>
                  <div className="accessibility-tags">
                    <span className="tag">
                      <span className="icon">♿</span>
                      <SafeTranslation
                        tKey="bites.tags.wheelchair"
                        fallback="轮椅友好"
                      />
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <p className="description">
                    <SafeTranslation
                      tKey="bites.restaurants.starbucks_dc.description"
                      fallback="提供轮椅无障碍通道的咖啡店"
                    />
                  </p>
                  <div className="features">
                    <h3 className="features-title">
                      <SafeTranslation
                        tKey="bites.labels.features"
                        fallback="特色服务"
                      />
                    </h3>
                    <ul className="features-list">
                      {renderFeatures(
                        'bites.restaurants.starbucks_dc.features',
                        ['无障碍通道', '轮椅友好桌椅', '便民设施'],
                      )}
                    </ul>
                  </div>
                  <div className="info-section">
                    <div className="info-item">
                      <span className="info-label">
                        <SafeTranslation
                          tKey="bites.labels.food"
                          fallback="主要菜品"
                        />
                      </span>
                      <span>
                        <SafeTranslation
                          tKey="bites.restaurants.starbucks_dc.food"
                          fallback="咖啡、轻食、甜品"
                        />
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        <SafeTranslation
                          tKey="bites.labels.value"
                          fallback="人均消费"
                        />
                      </span>
                      <span>
                        <SafeTranslation
                          tKey="bites.restaurants.starbucks_dc.value"
                          fallback="¥40-60"
                        />
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        <SafeTranslation
                          tKey="bites.labels.address"
                          fallback="地址"
                        />
                      </span>
                      <span>
                        <SafeTranslation
                          tKey="bites.restaurants.starbucks_dc.address"
                          fallback="北京市朝阳区国贸"
                        />
                      </span>
                      <button
                        aria-label="导航"
                        className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                          openAmapNavigation('starbucks_dc', '星巴克DC店')
                        }
                        disabled={navigationLoading === 'starbucks_dc'}
                      >
                        {navigationLoading === 'starbucks_dc' ? (
                          <>
                            <svg
                              className="animate-spin h-3 w-3"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <SafeTranslation
                              tKey="bites.labels.navigating"
                              fallback="导航中..."
                            />
                          </>
                        ) : (
                          <>
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <SafeTranslation
                              tKey="bites.labels.navigate"
                              fallback="导航"
                            />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 关于部分 */}
          <div className="about-section">
            <div className="about-header">
              <span className="about-icon" aria-hidden="true">
                🍽️
              </span>
              <h2 className="about-title">
                <SafeTranslation
                  tKey="bites.about.title"
                  fallback="关于无障碍美食"
                />
              </h2>
            </div>
            <div className="about-content">
              <p>
                <SafeTranslation
                  tKey="bites.about.p1"
                  fallback="无障碍美食致力于为残障人士提供平等的用餐体验。我们精选了北京及周边地区的无障碍友好餐厅，涵盖听障、视障、轮椅使用者和认知障碍人士的需求。"
                />
              </p>
              <p>
                <SafeTranslation
                  tKey="bites.about.p2"
                  fallback="每家餐厅都经过实地考察，确保提供真正的无障碍服务。我们希望通过这个平台，让更多人了解和支持无障碍餐饮，共同创造一个更包容的社会。"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* AI 美食推荐对话框触发器 */}
      <FoodAIDialog />
    </div>
  )
}
