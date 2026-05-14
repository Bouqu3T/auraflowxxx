````markdown
下面是一份可以直接保存为 .md 文件、并交给 Cursor 使用的成稿版。
# AuraFlow UI 设计文档
> 版本：V1.0  
> 用途：用于指导 Cursor / 前端工程师实现 AuraFlow 移动端 UI  
> 技术栈：Next.js App Router + Tailwind CSS + Shadcn UI + Zustand + Recharts + html2canvas

---

## 1. 文档目标

AuraFlow 是一款面向水晶小白、理性疗愈用户、高压白领、玄学深度研习者的个性化手串定制 App。  
本 UI 文档用于将正式版 PRD 转化为可直接工程实现的页面结构与组件规范。

本设计文档需要满足以下目标：

- 专业可信，不像娱乐测试 App
- 中性极简，适合办公室场景与高净值审美
- 可解释，推荐结果不能像黑盒
- 可分享，结果页天然适合导出海报
- 可工程化，适合 Cursor 直接生成 React 代码

---

## 2. 是否属于成熟的前端框架与组件体系

**结论：是，可以直接给 Cursor 使用。**

### 推荐实现栈

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State**: Zustand
- **Charts**: Recharts
- **Image Export**: html2canvas
- **Forms**: React Hook Form + Zod
- **Icons**: lucide-react

### 原因

这套组合具备完整工程闭环：

- Next.js 适合路由、接口、页面同仓开发
- Tailwind 适合快速实现统一设计规范
- Shadcn UI 便于生成可维护组件
- Zustand 适合轻量页面与流程状态管理
- Recharts 足够实现五行雷达图
- html2canvas 足够实现海报导出 MVP

---

## 3. 设计原则

### 3.1 视觉关键词

- 专业
- 克制
- 治愈
- 可解释
- 可截图分享
- 中性极简

### 3.2 设计原则

1. **新中式极简留白**
   - 整体以秩序、留白、纤细分割线与高阶感为核心
   - 不做娱乐化、盲盒化、过度梦幻的大渐变视觉

2. **一屏一个主要信息**
   - 首页首屏突出场景化入口
   - 报告页突出能量解析
   - 方案页突出三档推荐

3. **解释优先**
   - 所有算法结果页都必须有摘要理由
   - 核心推荐页面必须提供“查看推理路径”入口

4. **结果可晒**
   - 测试结果页与方案页需要天然适配截图与海报导出
   - 海报结构必须信息完整、视觉统一

---

## 4. 设计 Token

### 4.1 颜色 Token

```txt
bg-page: #FAF8F5
bg-subtle: #F9F9F9
card-bg: #FFFFFF

primary: #D4C4A8
primary-hover: #C9B897

border-light: #E6DED0
border-default: #DDD3C2

text-primary: #333333
text-secondary: #777777
text-muted: #999999

tag-bg: #F4EFE7
tag-text: #6C6254

wood: #91A87C
fire: #C97B63
earth: #C8A66A
metal: #B8BDC7
water: #7D9BB5
4.2 字体规范
Font:
- PingFang SC
- Inter
- sans-serif

Size:
- H1: 28px
- H2: 22px
- H3: 18px
- Body: 16px
- Caption: 14px
- Micro: 12px
4.3 间距与圆角
Page padding:
- px-4 py-4

Section gap:
- gap-4 / gap-6

Card radius:
- rounded-2xl

Button radius:
- rounded-full

Shadow:
- shadow-sm / shadow-md

---
1. 信息架构
页面路由建议
/auth/login
/scene
/profiles
/profiles/new
/questionnaire
/report
/plans
/poster
/checkout
/orders
/orders/[id]
核心主流程
登录
→ 场景化入口
→ 选择/创建档案
→ 个性化问卷
→ 能量解析报告
→ 三档方案页
→ 下单确认
→ 订单详情

---
6. 全局组件地图
6.1 基础组件
- AppShell
- TopBar
- BottomActionBar
- SectionHeader
- PrimaryButton
- SecondaryButton
- GhostButton
- Card
- Badge
- Tag
- Divider
- EmptyState
- ErrorState
- LoadingState
- Skeleton
- Dialog
- Drawer
- Accordion
- Tabs
- Progress
6.2 业务组件
- SceneCard
- ProfileCard
- ProfileForm
- QuestionCard
- MultiSelectTagGroup
- SingleChoiceCardGroup
- ElementRadarChart
- EnergyBarGroup
- LogicChainCard
- PlanCard
- CrystalChip
- ReasonSummaryBox
- PosterPreviewCard
- AddressForm
- OrderCard
- OrderStatusTag

---
7. 页面设计明细

---
页面 1：登录页
页面目标
完成手机号验证码登录，建立用户进入主流程的第一步。
页面草图
┌──────────────────────────────────────┐
│                                      │
│            AuraFlow                  │
│      个性化能量手串定制 App           │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 手机号                        │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌───────────────┐  ┌────────────┐  │
│  │ 验证码         │  │ 获取验证码  │  │
│  └───────────────┘  └────────────┘  │
│                                      │
│  [ ] 我已阅读并同意用户协议与隐私政策  │
│                                      │
│  ┌──────────────────────────────┐   │
│  │            登录               │   │
│  └──────────────────────────────┘   │
│                                      │
│      验证成功后自动进入首页           │
│                                      │
└──────────────────────────────────────┘
组件结构
PageLogin
├─ AppShell
│  ├─ BrandHero
│  ├─ PhoneInput
│  ├─ OtpInput
│  ├─ AgreementCheckbox
│  └─ PrimaryButton

---
页面 2：首页 / 场景化入口页
页面目标
帮助用户快速表达当前诉求，作为主流程第一意图入口。
页面草图
┌──────────────────────────────────────┐
│ AuraFlow                      [头像] │
├──────────────────────────────────────┤
│  你当下最想获得哪一种能量加持？        │
│  选择一个主题，系统会优先为你推荐。    │
│                                      │
│  [💼 事业运提升]                      │
│  [💰 招财能量]                        │
│  [❤️ 情感疗愈]                        │
│  [📘 学业专注]                        │
│  [🧘 平静身心]                        │
│                                      │
├──────────────────────────────────────┤
│ [查看档案]              [开始定制]    │
└──────────────────────────────────────┘
组件结构
PageSceneEntry
├─ TopBar
├─ IntroText
├─ SceneCardGrid
│  ├─ SceneCard x 5
└─ BottomActionBar
SceneCard 接口建议
type SceneCardProps = {
  icon: string
  title: string
  description: string
  value: "career" | "wealth" | "love" | "study" | "calm"
  selected?: boolean
  onClick?: () => void
}

---
页面 3：档案列表页
页面目标
展示已有档案，支持创建、编辑、切换默认档案。
页面草图
┌──────────────────────────────────────┐
│ ← 返回                     我的档案   │
├──────────────────────────────────────┤
│  已有档案                            │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 自己                         │   │
│  │ 1998-08-18 / 女 / 杭州西湖区  │   │
│  │ [默认档案]          [编辑]    │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 妈妈                         │   │
│  │ 1972-03-12 / 女 / 温州鹿城区  │   │
│  │                 [编辑]        │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ + 新建档案                    │   │
│  └──────────────────────────────┘   │
│                                      │
├──────────────────────────────────────┤
│ [返回场景]              [继续下一步]  │
└──────────────────────────────────────┘
组件结构
PageProfiles
├─ TopBar
├─ SectionHeader
├─ ProfileList
│  ├─ ProfileCard x n
├─ AddProfileCard
└─ BottomActionBar

---
页面 4：创建 / 编辑档案页
页面目标
完成用户档案信息填写与编辑。
页面草图
┌──────────────────────────────────────┐
│ ← 返回                   创建档案     │
├──────────────────────────────────────┤
│  档案名称                            │
│  [______________________________]    │
│                                      │
│  出生年月日                          │
│  [______________________________]    │
│                                      │
│  性别                                │
│  [ 男 ]   [ 女 ]                     │
│                                      │
│  出生地 / 现居地                     │
│  [______________________________]    │
│                                      │
│  [ ] 设为默认档案                     │
│                                      │
├──────────────────────────────────────┤
│ [取消]                    [保存档案]  │
└──────────────────────────────────────┘
组件结构
PageProfileForm
├─ TopBar
├─ ProfileForm
│  ├─ Input
│  ├─ DatePicker
│  ├─ SegmentedGender
│  ├─ LocationInput
│  └─ Checkbox
└─ BottomActionBar

---
页面 5：个性化问卷页
页面目标
收集场景、功效、色系、搭配、装饰偏好与珠子尺寸偏好。
页面草图
┌──────────────────────────────────────┐
│ ← 返回                  个性化问卷    │
├──────────────────────────────────────┤
│  Q1 你最希望在哪方面获得能量加持？     │
│  [事业] [财运] [情感] [安神] [学业]    │
│                                      │
│  Q2 是否有额外期望功效？               │
│  [招财] [桃花] [健康] [事业] [情绪]    │
│                                      │
│  Q3 喜欢的色系浓度？                   │
│  [偏浓] [偏透] [适中] [混搭]           │
│                                      │
│  Q4 更喜欢的搭配？                     │
│  ○ 简单素净                           │
│  ○ 常规设计                           │
│  ○ 大胆撞色                           │
│                                      │
│  Q5 珠子大小偏好？                     │
│  ○ 小珠  ○ 中珠  ○ 大珠               │
│                                      │
├──────────────────────────────────────┤
│ [上一步]                [生成报告]    │
└──────────────────────────────────────┘
组件结构
PageQuestionnaire
├─ TopBar
├─ ProgressHeader
├─ QuestionList
│  ├─ QuestionCard
│  │  ├─ MultiSelectTagGroup
│  │  └─ SingleChoiceCardGroup
└─ BottomActionBar

---
页面 6：能量解析报告页
页面目标
先解释结果，再展示方案，建立信任感与专业感。
页面草图
┌──────────────────────────────────────┐
│ ← 返回                  能量解析报告  │
├──────────────────────────────────────┤
│  Amelia 的专属能量档案               │
│  场景：事业运提升                     │
│                                      │
│  ┌──────────────────────────────┐   │
│  │        [ 五行雷达图 ]          │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 当前结论                      │   │
│  │ 你的能量场偏身弱，当前事业诉求   │   │
│  │ 权重最高，建议补木 / 水元素。   │   │
│  └──────────────────────────────┘   │
│                                      │
│  五行建议                            │
│  [木元素] [水元素]                   │
│                                      │
│  推荐矿石关键词                       │
│  [绿幽灵] [海蓝宝] [白水晶]           │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 查看推理路径                ▲ │   │
│  │ 已根据生辰、五行分布与当前诉求生成 │  │
│  ├──────────────────────────────┤   │
│  │ ● 生辰基础信息                │   │
│  │   系统读取出生日期、性别与地区 │   │
│  │                              │   │
│  │ ● 五行分布判断                │   │
│  │   当前木 / 水元素相对不足      │   │
│  │                              │   │
│  │ ● 场景加权                    │   │
│  │   当前以“事业运提升”为最高优先级 │  │
│  │                              │   │
│  │ ● 匹配矿石方向                │   │
│  │   建议优先补木，再辅以水元素   │   │
│  │                              │   │
│  │ ● 推荐矿石组合                │   │
│  │   绿幽灵 + 海蓝宝 + 白水晶    │   │
│  │                              │   │
│  │ [推荐结论：适合以补木 / 水为主]│   │
│  └──────────────────────────────┘   │
├──────────────────────────────────────┤
│ [保存报告海报]   [查看专属疗愈手串]   │
└──────────────────────────────────────┘
组件结构
PageEnergyReport
├─ TopBar
├─ ReportHeader
├─ ElementRadarChartCard
├─ SummaryConclusionCard
├─ TagSection
├─ LogicChainAccordion
└─ BottomActionBar
LogicChainAccordion 交互规则
- 默认折叠
- 展开后显示 5 个步骤
- 每个步骤包含：标题、摘要、说明
- 步骤之间用竖向连接线串联
- 底部显示推荐结论高亮卡片
LogicChainAccordion 接口建议
type LogicChainAccordionProps = {
  summaryText: string
  steps: Array<{
    title: string
    summary: string
    description?: string
  }>
  conclusion: string
  defaultOpen?: boolean
}

---
页面 7：三档方案页
页面目标
展示经济档、均衡档、尊享档 3 套方案，并补充推荐理由。
页面草图
┌──────────────────────────────────────┐
│ ← 返回                  专属疗愈手串  │
├──────────────────────────────────────┤
│  根据你的能量报告，为你生成 3 套方案   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 经济档                        │   │
│  │ [效果图]                      │   │
│  │ ¥199                          │   │
│  │ 绿玛瑙 + 白水晶               │   │
│  │ 推荐理由：优先补木，兼顾稳定感 │   │
│  │               [查看详情]       │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 均衡档                        │   │
│  │ [效果图]                      │   │
│  │ ¥399                          │   │
│  │ 绿幽灵 + 海蓝宝 + 白阿塞      │   │
│  │ 推荐理由：更适合事业 + 焦虑缓解 │  │
│  │               [查看详情]       │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 尊享档                        │   │
│  │ [效果图]                      │   │
│  │ ¥799                          │   │
│  │ 绿碧玺 + 海纹石 + 金钛晶       │   │
│  │ 推荐理由：强化行动力与能量场    │  │
│  │               [查看详情]       │   │
│  └──────────────────────────────┘   │
├──────────────────────────────────────┤
│ [生成专属海报]         [选择并下单]   │
└──────────────────────────────────────┘
组件结构
PagePlans
├─ TopBar
├─ IntroSummary
├─ PlanList
│  ├─ PlanCard x 3
│  │  ├─ PriceTierBadge
│  │  ├─ ImagePreview
│  │  ├─ CrystalChipGroup
│  │  └─ ReasonSummaryBox
└─ BottomActionBar

---
页面 8：海报预览页
页面目标
生成适合社交传播的结果长图。
页面草图
┌──────────────────────────────────────┐
│ ← 返回                     海报预览   │
├──────────────────────────────────────┤
│   ┌──────────────────────────────┐  │
│   │        AuraFlow              │  │
│   │   Amelia 的专属能量档案       │  │
│   │   场景：事业运提升            │  │
│   │                              │  │
│   │   身弱 / 建议补木水           │  │
│   │   推荐矿石：绿幽灵 海蓝宝     │  │
│   │                              │  │
│   │        [手串主视觉图]         │  │
│   │                              │  │
│   │   个性化建议 · 情绪陪伴       │  │
│   └──────────────────────────────┘  │
├──────────────────────────────────────┤
│ [隐藏昵称]   [重新生成]   [保存 PNG] │
└──────────────────────────────────────┘
组件结构
PagePosterPreview
├─ TopBar
├─ PosterPreviewCard
├─ PosterOptions
└─ BottomActionBar

---
页面 9：下单确认页
页面目标
确认所选方案、收货地址、支付方式并下单。
页面草图
┌──────────────────────────────────────┐
│ ← 返回                   确认订单     │
├──────────────────────────────────────┤
│  已选方案：均衡档                     │
│  [手串缩略图]                         │
│  绿幽灵 + 海蓝宝 + 白阿塞            │
│  ¥399                                │
│                                      │
│  收货地址                            │
│  [新增 / 选择地址]                    │
│                                      │
│  联系方式                            │
│  [手机号自动填充]                     │
│                                      │
│  备注信息                            │
│  [______________________________]    │
│                                      │
│  支付方式                            │
│  ○ 微信支付                          │
│  ○ 支付宝                            │
├──────────────────────────────────────┤
│ 合计：¥399               [立即支付]   │
└──────────────────────────────────────┘
组件结构
PageCheckout
├─ TopBar
├─ SelectedPlanSummary
├─ AddressCard
├─ ContactInfoCard
├─ PaymentMethodGroup
└─ BottomActionBar

---
页面 10：订单列表页
页面目标
展示全部订单和各状态订单。
页面草图
┌──────────────────────────────────────┐
│ 我的订单                             │
├──────────────────────────────────────┤
│ [全部] [待付款] [待制作] [已发货]... │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 均衡档                        │   │
│  │ 绿幽灵 + 海蓝宝 + 白阿塞      │   │
│  │ ¥399                [待制作]  │   │
│  │                [查看详情]      │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 经济档                        │   │
│  │ 绿玛瑙 + 白水晶               │   │
│  │ ¥199                [已完成]  │   │
│  │                [查看详情]      │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
组件结构
PageOrders
├─ TopBar
├─ Tabs
├─ OrderList
│  ├─ OrderCard x n

---
页面 11：订单详情页
页面目标
展示订单快照、状态、物流、客服与售后入口。
页面草图
┌──────────────────────────────────────┐
│ ← 返回                   订单详情     │
├──────────────────────────────────────┤
│  当前状态：待制作                     │
│                                      │
│  [手串效果图]                         │
│                                      │
│  均衡档 / ¥399                        │
│  绿幽灵 + 海蓝宝 + 白阿塞            │
│                                      │
│  收货信息                            │
│  Amelia / 138****1234               │
│  杭州市西湖区 XXXXX                  │
│                                      │
│  订单时间：2026-04-15 18:22          │
│  订单编号：AF202604150001            │
│                                      │
│  物流信息（后期接入）                 │
│  [暂未发货]                           │
│                                      │
├──────────────────────────────────────┤
│ [联系客服]              [申请售后]    │
└──────────────────────────────────────┘
组件结构
PageOrderDetail
├─ TopBar
├─ OrderStatusHeader
├─ ProductSnapshotCard
├─ AddressCard
├─ OrderMetaCard
├─ ShippingCard
└─ BottomActionBar

---
8. 页面状态规范
所有主要页面必须处理以下状态：
Loading
- Skeleton 卡片
- 按钮禁用
- 顶部进度提示
Error
- 错误说明
- 重试按钮
- 返回上一步按钮
Empty
- 空态插画 / 图标
- 当前无内容说明
- 主 CTA 按钮

---
9. Zustand Store 建议结构
type AppStore = {
  user: User | null
  currentScene: "career" | "wealth" | "love" | "study" | "calm" | null
  selectedProfileId: number | null
  questionnaireAnswers: Record<string, unknown>
  currentReport: EnergyReport | null
  selectedPlanId: string | null
  shareAssetStatus: "idle" | "generating" | "done" | "error"
}

---
10. 组件文件命名建议
components/custom/
- app-shell.tsx
- top-bar.tsx
- bottom-action-bar.tsx
- scene-card.tsx
- profile-card.tsx
- profile-form.tsx
- question-card.tsx
- multi-select-tag-group.tsx
- single-choice-card-group.tsx
- element-radar-chart.tsx
- energy-bar-group.tsx
- logic-chain-card.tsx
- plan-card.tsx
- crystal-chip.tsx
- reason-summary-box.tsx
- poster-preview-card.tsx
- address-form.tsx
- order-card.tsx
- order-status-tag.tsx

---
11. Tailwind 视觉落地建议
布局:
- 页面最大宽度: max-w-md / max-w-lg
- 手机优先
- 内容区 padding: px-4 py-4
- 区块间距: gap-4 / gap-6
- 卡片圆角: rounded-2xl
- 按钮圆角: rounded-full

卡片:
- bg-white
- border border-[#E6DED0]
- shadow-sm

按钮:
- 主按钮: bg-[#D4C4A8] text-[#333]
- 次按钮: bg-white border border-[#DDD3C2] text-[#333]

标签:
- rounded-full
- px-3 py-1
- text-sm
- bg-[#F4EFE7]
- text-[#6C6254]

---
````

