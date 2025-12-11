## 问题诊断
- 服务端路由在 `app/api/ai/recommend/route.ts:93-152` 调用 `chatSpark(...)` 并按返回结果标注 `source: "spark" | "fallback" | "fallback_error"`。
- 模型客户端在 `lib/spark.ts`：
  - `SPARK_API_PASSWORD` 在 `lib/spark.ts:10` 被硬编码了一个默认值，导致始终走 HTTP X1 路径（`lib/spark.ts:166-181`）。若该默认令牌无效，会抛错并进入降级，表现为“没有正确调用大模型”。
  - 当模型输出不是严格 JSON 时，路由会降级到本地候选（`route.ts:127-143`）。即使模型已被调用，结果也会显示非模型来源。

## 改进方案
1. 移除默认令牌，改为仅在存在 `SPARK_API_PASSWORD` 环境变量时走 HTTP X1，否则选择 WS v3.5。
   - 修改 `lib/spark.ts:10` 去掉硬编码默认值；令 `SPARK_API_PASSWORD` 仅取 `process.env.SPARK_API_PASSWORD || ""`。
   - 保持选择逻辑（`lib/spark.ts:166-181`）：有 `SPARK_API_PASSWORD` → 走 `chatSparkX1Http`；否则走 `chatSparkWs`。
2. 强化输出解析与提示词，降低非 JSON 的概率。
   - 在 `route.ts:102-111` 的 system 指令中加入更严格约束：
     - “只返回合法 JSON，不要任何说明、代码块或中文标点；不使用注释；字段名与示例完全一致。”
   - 增加一个 `safeParseJson(text)`：
     - 清理代码块围栏与多余前后缀（现有 `route.ts:120-125` 保留）。
     - 使用正则提取首个 JSON 对象或数组内容再解析；如失败，继续走当前的本地降级逻辑。
3. 可选：将响应中的 `source` 与 `error` 在前端展示，帮助定位是否走了降级（`components/FoodAIDialog.tsx:60-65` 可读取并显示）。
4. 环境配置清晰化：
   - HTTP X1：配置 `SPARK_API_PASSWORD` 为有效 Bearer；若未配置则不会走 HTTP。
   - WS v3.5：配置 `IFLYTEK_APP_ID`、`IFLYTEK_API_KEY`、`IFLYTEK_API_SECRET` 三项，确保出站网络可访问 `spark-api.xf-yun.com`。
   - 运行时需是 Node（`route.ts:4` 已声明）。

## 具体修改点
- `lib/spark.ts:10`：删除硬编码默认值，改为仅读取环境变量。
- `lib/spark.ts:166-181`：保留选择逻辑，无需改动，但将因第1步而生效。
- `app/api/ai/recommend/route.ts:102-111`：加强 system 提示词的约束语句。
- `app/api/ai/recommend/route.ts:120-131`：封装成 `safeParseJson`，提升解析健壮性（不引入外部库）。
- （可选）`components/FoodAIDialog.tsx:60-65`：读取 `source`、`error` 并在 UI 中以轻量提示显示。

## 验证方法
- 本地 `.env` 分两组分别验证：
  - 组A（HTTP）：仅设置 `SPARK_API_PASSWORD`；调用 `POST /api/ai/recommend`，期望返回 `source: "spark"` 且推荐列表与候选一致。
  - 组B（WS）：清空 `SPARK_API_PASSWORD`，设置 `IFLYTEK_APP_ID/KEY/SECRET`；同样验证 `source: "spark"`。
- 验证非 JSON 情况：临时放宽/修改提示词或模拟非 JSON 输出，确认 `safeParseJson` 能正确抽取并解析；否则回退到本地候选。
- 观察日志：`[AI Recommend] Error`（`route.ts:147`）应只在网络/鉴权异常时出现。

## 风险与回滚
- 删除默认令牌后，如果没有配置任何密钥，WS 将因缺少环境变量抛错并走降级；这是当前就有的兜底路径，风险可控。
- 如有需要，可临时恢复默认令牌（不推荐），或仅启用本地候选模式。

## 后续扩展（非必须）
- 添加提供方切换（OpenAI/智谱/通义），通过统一接口选择不同模型。
- 将 `CATALOG` 抽离为共享数据模块，避免与页面内容偏差导致匹配失败。