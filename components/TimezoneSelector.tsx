'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEventStore } from '@/lib/store'
import { useTranslation } from 'react-i18next'

export function TimezoneSelector() {
  const { displayTimezone, setDisplayTimezone, detectUserTimezone } =
    useEventStore()
  const { t } = useTranslation('common')

  // 时区选择器相关状态
  const [timezones, setTimezones] = useState<string[]>(() => {
    try {
      const tzs = Intl.supportedValuesOf('timeZone')
      if (tzs && tzs.length > 0) return tzs
    } catch {}
    return []
  })
  const [searchTimeZone, setSearchTimeZone] = useState('')
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false)

  // 初始加载时区列表（浏览器API不可用时从远程获取）
  useEffect(() => {
    if (timezones.length > 0) return
    // 如果浏览器API不可用，从timeapi.io获取
    fetch('https://www.timeapi.io/api/timezone/availabletimezones')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTimezones(data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch timezones:', err)
        // 设置一些常见的时区作为备选
        setTimezones(['Asia/Shanghai'])
      })
  }, [timezones.length])

  // 点击外部关闭下拉菜单
  useEffect(() => {
    if (showTimezoneDropdown) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (!target.closest('.timezone-selector-container')) {
          setShowTimezoneDropdown(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTimezoneDropdown])

  // 根据搜索过滤时区
  const filteredTimezones = searchTimeZone
    ? timezones.filter((tz) =>
        tz.toLowerCase().includes(searchTimeZone.toLowerCase()),
      )
    : timezones

  return (
    <div className="relative timezone-selector-container">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-sm"
            onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
          >
            <Globe className="w-4 h-4" />
            <span>{displayTimezone}</span>
          </Button>

          {showTimezoneDropdown && (
            <div className="absolute z-50 mt-1 bg-white border rounded-md shadow-lg w-80 max-h-80 overflow-y-auto">
              <div className="p-2">
                <Input
                  type="text"
                  placeholder={t('filter.searchTimezone')}
                  value={searchTimeZone}
                  onChange={(e) => setSearchTimeZone(e.target.value)}
                  className="mb-2"
                />
                <div className="grid gap-1">
                  {filteredTimezones.map((tz) => (
                    <div
                      key={tz}
                      className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 ${
                        displayTimezone === tz
                          ? 'bg-primary/10 font-medium'
                          : ''
                      }`}
                      onClick={() => {
                        setDisplayTimezone(tz)
                        setShowTimezoneDropdown(false)
                      }}
                    >
                      {tz}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            detectUserTimezone()
            setShowTimezoneDropdown(false)
          }}
          className="whitespace-nowrap"
        >
          {t('filter.autoDetect')}
        </Button>
      </div>
    </div>
  )
}
