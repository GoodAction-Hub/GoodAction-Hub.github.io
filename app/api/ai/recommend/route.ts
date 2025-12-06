import { NextResponse } from "next/server"
import { chatSpark, SparkMessage } from "@/lib/spark"

export const runtime = "nodejs"

// 仅使用 page.tsx 中展示的候选餐厅作为数据来源
const CATALOG = [
  {
    name: "培哥烟囱面包",
    address: "安徽省合肥市庐阳区含山路29号105-3室",
    city: "合肥",
    tags: ["听障友好", "面包", "烘焙"],
    description: "提供专业手语服务，图文菜单与电子点餐，视觉化叫号与写字板沟通。",
    accessibility: { deafFriendly: true, blindFriendly: false },
  },
  {
    name: "木马童话黑暗餐厅",
    address: "北京西城区西单北大街109号西西友谊酒店8层",
    city: "北京",
    tags: ["视障友好", "法餐", "日式料理"],
    description: "完全黑暗用餐体验，视障员工专业引导，盲文菜单与语音介绍。",
    accessibility: { deafFriendly: false, blindFriendly: true },
  },
  {
    name: "星巴克东方文德手语门店（广州）",
    address: "广州市越秀区文德北路68号东方文德广场一层",
    city: "广州",
    tags: ["听障友好", "咖啡"],
    description: "手语沟通与无障碍动线设计，伙伴支持可视化提示与社区友好活动。",
    accessibility: { deafFriendly: true, blindFriendly: false },
  },
  {
    name: "全聚德前门店（北京）",
    address: "北京市东城区前门大街 全聚德前门店",
    city: "北京",
    tags: ["无障碍服务", "盲文菜单", "手语"],
    description: "盲文菜单与无障碍用餐区，导盲犬友好；员工接受基础手语培训，提供贴心平等的用餐体验。",
    accessibility: { deafFriendly: true, blindFriendly: true },
  },
  {
    name: "那伽树无障碍咖啡披萨集合店（北京大栅栏）",
    address: "北京前门大栅栏 那伽树咖啡厅",
    city: "北京",
    tags: ["视障友好", "轮椅友好", "咖啡", "披萨"],
    description: "全国首家无障碍咖啡披萨集合店，设置缓坡、低位呼叫按钮、风铃定位与宽双开门等设施，倡导残健共融。",
    accessibility: { deafFriendly: false, blindFriendly: true },
  },
  {
    name: "无声饭店（云南玉溪）",
    address: "云南省玉溪市 无声饭店",
    city: "玉溪",
    tags: ["听障友好", "家常菜"],
    description: "由听障员工共同经营，通过学习手语与贴心服务打破沟通障碍，提供温暖、平等的用餐体验。",
    accessibility: { deafFriendly: true, blindFriendly: false },
  },
]

function filterCatalog(location: string, accessibility: { deafFriendly?: boolean; blindFriendly?: boolean }) {
  const loc = (location || "").trim()
  const byCity = (item: any) => (!loc ? true : item.city.includes(loc) || loc.includes(item.city))
  const byAccess = (item: any) => {
    const needDeaf = !!accessibility?.deafFriendly
    const needBlind = !!accessibility?.blindFriendly
    if (needDeaf && !item.accessibility.deafFriendly) return false
    if (needBlind && !item.accessibility.blindFriendly) return false
    return true
  }
  return CATALOG.filter((x) => byCity(x) && byAccess(x))
}

// 严格将模型输出限定到本地候选集，并应用地点/无障碍过滤
function normalize(s: string) {
  return (s || "").replace(/[（）()]/g, "").replace(/\s+/g, "").trim()
}
function enforceCatalog(recs: any[], location: string, accessibility: { deafFriendly?: boolean; blindFriendly?: boolean }) {
  const candidates = filterCatalog(location, accessibility)
  const byNameOrAddr = (r: any, c: any) => {
    const rn = normalize(r?.name || "")
    const cn = normalize(c?.name || "")
    const ra = normalize(r?.address || "")
    const ca = normalize(c?.address || "")
    return (rn && rn === cn) || (ra && ra === ca) || (rn && cn.includes(rn)) || (ra && ca.includes(ra))
  }
  const matched: any[] = []
  for (const r of (recs || [])) {
    const m = candidates.find((c) => byNameOrAddr(r, c))
    if (m) matched.push(m)
  }
  const uniq = Array.from(new Map(matched.map((x) => [x.name, x])).values())
  return uniq
}

function safeParseJson(input: string): any {
  const cleaned = (input || "")
    .trim()
    .replace(/^```json/gi, "")
    .replace(/^```/gi, "")
    .replace(/```$/gi, "")
  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {}
    }
    return null
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const location: string = body?.location || ""
    const preferences: string = body?.preferences || ""
    const accessibility: { deafFriendly?: boolean; blindFriendly?: boolean } = body?.accessibility || {}

    const filtersText = `听障友好: ${accessibility?.deafFriendly ? "是" : "否"}; 视障友好: ${accessibility?.blindFriendly ? "是" : "否"}`

    const system: SparkMessage = {
      role: "system",
      content: [
        "你是无障碍友好美食推荐助手。",
        "你的数据来源仅限于下列候选餐厅（来自页面 Barrier-Free-Bites 的静态内容），不可调用任何联网搜索或外部知识：",
        JSON.stringify(CATALOG),
        "严格只从上述候选中进行筛选与排序，不要发明新的餐厅。",
        "只返回合法JSON字符串，不要任何说明、注释或代码块，不要使用中文标点。",
        "字段名与示例完全一致：{ recommendations: [{ name, address, city, tags, description }] }，按匹配度高到低排序，最多5条。",
      ].join("\n"),
    }

    const user: SparkMessage = {
      role: "user",
      content: `地点: ${location}\n偏好: ${preferences}\n无障碍偏好: ${filtersText}`,
    }

    const text = await chatSpark({ messages: [system, user], temperature: 0.3, maxTokens: 1200 })

    const parsed = safeParseJson(text) || { recommendations: filterCatalog(location, accessibility) }

    const recommendations = Array.isArray(parsed?.recommendations) ? parsed.recommendations : []

    // 将模型输出严格限定到候选集并应用过滤
    const strict = enforceCatalog(recommendations, location, accessibility)

    // 如果模型返回为空或不匹配候选，提供本地降级
    if (!strict || strict.length === 0) {
      const fallback = filterCatalog(location, accessibility)
      return NextResponse.json({ recommendations: fallback.slice(0, 5), source: "fallback" })
    }

    return NextResponse.json({ recommendations: strict.slice(0, 5), source: "spark" })
  } catch (err: any) {
    console.error("[AI Recommend] Error:", err)
    // 当星火调用失败时，基于候选列表做本地降级
    const fallback = filterCatalog("", {})
    return NextResponse.json({ recommendations: fallback.slice(0, 5), source: "fallback_error", error: err?.message || "AI推荐失败" })
  }
}
