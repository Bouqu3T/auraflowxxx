````markdown
下面是一份可以直接保存为 .md 文件、并交给 Cursor 使用的成稿版技术文档。
# AuraFlow 技术文档（全本地版）
> 版本：V1.0  
> 用途：用于指导 Cursor / 前后端工程师实现 AuraFlow 的本地化技术方案  
> 目标：全部前后端与服务本地运行，不依赖任何云端服务，不让 Cursor 手搓底层基础设施代码

---

## 1. 文档目标

本技术文档用于将 AuraFlow 的正式版 PRD 和 UI 设计文档转化为可直接工程落地的本地化技术方案。

目标如下：

- 所有前后端服务都在本地运行
- 不依赖任何云端 BaaS 或云数据库
- 不使用云存储、云认证、云对象存储
- 优先采用成熟、开源、社区验证充分的框架与组件
- 不让 Cursor 手搓认证系统、ORM、组件库、图表引擎、表单校验器、文件上传框架
- 保留现有已确认正确的“水晶知识库匹配”和“匹配规则代码”业务逻辑，不修改算法
- 先支持本地开发、本地演示、本地联调，再考虑未来部署

---

## 2. 技术路线总览

### 2.1 最终推荐栈

```txt id="37j2aj"
Frontend:
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- React Hook Form
- Zod
- Recharts
- html2canvas
- lucide-react

Backend:
- Next.js Route Handlers
- Better Auth
- Drizzle ORM
- PostgreSQL

Storage:
- 本地文件系统

Infra:
- Docker Compose
- PostgreSQL 容器
- Next.js 本地服务
2.2 架构结论
本项目采用 “单体应用 + 本地数据库 + 本地文件系统” 的方式实现：
- 前端和 API 在同一个 Next.js 项目中
- 认证由 Better Auth 提供
- 数据库存储在本地 PostgreSQL
- 文件存储在本地目录
- 支付采用本地 mock adapter
- 图表、海报导出、UI 组件都采用成熟开源库

---
1. 对原 PRD 技术框架的判断
3.1 可以保留的部分
1）Next.js App Router
保留。
原因：
- 是成熟框架
- 支持页面路由、嵌套布局、加载态、错误态、Server/Client Component
- 很适合 AuraFlow 这种多步骤业务流程型产品
2）Tailwind CSS
保留。
原因：
- 成熟开源
- 易于将 UI 设计文档中的 Token 和视觉规范直接映射到代码
- 适合 Cursor 输出结构化样式代码
3）shadcn/ui
保留。
原因：
- 是开源的 Open Code 组件方案
- 组件源码直接进入项目
- 不属于黑盒组件库，便于 Cursor 修改、扩展和维护
- 适合按钮、输入框、Dialog、Tabs、Accordion、Drawer 等基础能力复用
4）Zustand
保留。
原因：
- 成熟开源
- 足够轻量
- 适合管理登录态、场景选择、问卷结果、报告状态、海报状态等

---
3.2 不保留原方案中的部分
1）Supabase Auth
不保留。
原因：
- 与“全部本地运行”目标冲突
- 属于 BaaS 体系
- 会让 Cursor 围绕平台接口写适配代码，而不是专注业务层
2）Supabase PostgreSQL（按原方案）
不保留。
原因：
- 你的要求是数据库本地化，不依赖云端
- 所以直接使用本地 PostgreSQL 即可
3）Supabase Storage
不保留。
原因：
- 报告海报、用户上传、生成图片在 MVP 阶段不需要云对象存储
- 使用本地文件系统更简单、透明、可控
4）真实支付 SDK
本地阶段不接。
原因：
- 微信支付 / 支付宝无法在纯本地开发闭环中做真实支付联调
- 当前阶段只保留 mock adapter 更合适

---
4. 最终技术选型
4.1 前端技术栈
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- React Hook Form
- Zod
- Recharts
- html2canvas
- lucide-react
说明
- Next.js：统一页面、接口、服务端逻辑
- TypeScript：保证接口与组件类型安全
- Tailwind CSS：快速稳定还原 UI 设计规范
- shadcn/ui：避免手搓基础组件
- Zustand：管理全局业务状态
- React Hook Form + Zod：避免手搓表单状态与校验器
- Recharts：避免手搓雷达图与能量条图表
- html2canvas：避免手搓截图引擎
- lucide-react：图标统一来源

---
4.2 后端技术栈
- Next.js Route Handlers
- Better Auth
- Drizzle ORM
- PostgreSQL
说明
- Route Handlers：作为本地 API 层，不额外拆 Node 微服务
- Better Auth：提供认证能力，避免手写会话、验证码、认证状态管理
- Drizzle ORM：提供数据库 schema、迁移、查询能力，避免手写 ORM
- PostgreSQL：本地数据库，稳定成熟

---
4.3 文件与静态资源存储
本地目录：
- ./data/uploads
- ./data/posters
- ./data/generated
说明
- uploads：用户上传图片或附件
- posters：报告海报导出结果
- generated：推荐效果图、缓存图、占位生成图等
原则
- 不接云对象存储
- 不引入 MinIO
- 不接 S3 协议服务
- MVP 阶段只做本地目录读写

---
4.4 本地基础设施
- Docker Compose
- PostgreSQL 容器
- Next.js 本地服务
当前不需要的服务
- Redis
- MinIO
- MQ
- ElasticSearch
- 独立 Worker
原因
AuraFlow 当前阶段是标准表单 + 推荐 + 报告 + 下单型产品，复杂度还不足以要求额外中间件。

---
5. 总体技术架构
Browser / Mobile H5
        │
        ▼
Next.js App Router
  ├─ 页面渲染
  ├─ Route Handlers API
  ├─ Better Auth
  ├─ Drizzle ORM
  ├─ 文件读写服务
  ├─ 报告生成逻辑
  ├─ 推荐方案逻辑
  └─ 订单业务逻辑
        │
        ├──────── PostgreSQL (本地)
        │
        └──────── Local File Storage (本地目录)
架构特点
- 单仓开发
- 前后端同构
- 数据本地闭环
- 文件本地闭环
- 开发和演示环境一致
- 对 Cursor 非常友好

---
6. 模块级技术设计
6.1 登录 / 认证模块
功能目标
支持手机号验证码登录，所有用户与 session 数据保存在本地数据库。
技术方案
- Better Auth
- PostgreSQL
- 本地 Session 存储
- OTP 在开发环境通过本地 mock provider 输出到控制台或本地日志
约束
- 不接第三方短信云服务
- 不手写认证系统
- 不手写 session 中间件
- 不手写 cookie 状态流转

---
6.2 用户档案模块
功能目标
支持用户档案创建、编辑、删除、切换默认档案。
技术方案
- 前端：React Hook Form + Zod
- 后端：Route Handlers
- 数据层：Drizzle ORM + PostgreSQL
表单字段
- name
- birth_date
- gender
- location
- is_default
约束
- 不手写字段校验器
- 不手写表单状态机
- 不写散落在组件里的临时校验逻辑

---
6.3 场景化入口模块
功能目标
用户先选择当前最关心的生活主题，例如事业、财运、情感、安神、学业。
技术方案
- 页面状态：Zustand
- 组件：SceneCard
- 数据：当前场景写入 store，再写入报告生成请求
数据结构建议
type SceneType = "career" | "wealth" | "love" | "study" | "calm"

---
6.4 个性化问卷模块
功能目标
用户补充功效诉求、色系偏好、搭配风格、珠子尺寸等信息。
技术方案
- React Hook Form
- Zod schema
- Zustand 作为流程缓存
- 提交后调用 /api/report/generate
约束
- 场景化入口与问卷中的“第一问”要保持映射关系
- 不允许在多个页面重复维护同一份答案数据

---
6.5 能量解析报告模块
功能目标
在商品推荐前先展示解释性报告，提升信任感。
技术方案
- 图表：Recharts
- 折叠卡：shadcn/ui Accordion
- 报告接口：Route Handler
- 报告数据：PostgreSQL 表 energy_reports
- 海报导出：html2canvas
页面必须包含
- 五行雷达图
- 身强 / 身弱结论
- 场景标签
- 推荐矿石关键词
- 查看推理路径折叠卡
- 保存报告海报按钮
- 查看专属疗愈手串按钮
约束
- 不手写 SVG 雷达图
- 不自己从零实现 Accordion 动画
- 推理路径必须组件化实现

---
6.6 推理路径模块
功能目标
把“为什么推荐这些矿石”用结构化逻辑展示出来，避免黑盒体验。
技术方案
- 组件：LogicChainAccordion
- 基础组件：shadcn/ui Accordion
- 数据来源：报告接口返回的 logic_chain
展开结构
- 步骤 1：生辰基础信息
- 步骤 2：五行分布判断
- 步骤 3：场景加权
- 步骤 4：匹配矿石方向
- 步骤 5：推荐矿石组合
- 推荐结论高亮卡片
约束
- 默认折叠
- 点击后平滑展开
- 每一步必须是结构化字段，不允许只塞大段字符串

---
6.7 三档方案模块
功能目标
基于当前报告结果和现有匹配算法，生成经济档、均衡档、尊享档三套方案。
技术方案
- 使用现有“水晶知识库匹配”和“匹配规则代码”
- 三档方案生成逻辑封装为服务函数
- 结果通过 /api/recommend 返回
- 页面通过 PlanCard 渲染
说明
该模块不得修改现有算法逻辑。
Cursor 只允许完成：
- 算法调用封装
- 三档方案结构化输出
- 页面渲染
- 下单快照保存

---
6.8 海报导出模块
功能目标
生成适合截图和社交传播的报告长图。
技术方案
- 前端组件：PosterPreviewCard
- 导出方式：html2canvas
- 文件保存：可前端直接下载，或后端同时保存到 ./data/posters
导出内容
- 用户昵称 / 可隐藏
- 场景标签
- 身强 / 身弱与结论
- 推荐矿石关键词
- 手串效果图
- 品牌标识
约束
- 不手写截图引擎
- 不手写 Canvas 排版器
- 优先基于 DOM 生成导出图

---
6.9 下单与支付模块
功能目标
用户选择方案后完成本地下单，并模拟支付完成。
技术方案
- PostgreSQL 保存订单
- Route Handlers 提供订单 API
- mock payment adapter 模拟支付
订单状态机
pending -> paid -> making -> shipped -> completed
约束
- 不接真实支付 SDK
- 不做真实签名逻辑
- 不依赖外部支付回调服务

---
7. 数据库设计
7.1 数据库选型
使用本地 PostgreSQL。
原因
- 成熟稳定
- 开源
- 适合关系型业务系统
- 对订单、档案、报告、推荐结果这类结构化数据很友好

---
7.2 ORM 选型
使用 Drizzle ORM。
原因
- TypeScript 友好
- 查询与 schema 一体化
- 迁移能力成熟
- 很适合 Next.js + PostgreSQL 项目
- 比手写 SQL 映射层更适合 Cursor 协作
约束
- 不自己封装 ORM
- 不靠手写 SQL 字符串拼接维护完整数据层

---
7.3 核心表
users
- id
- phone
- nickname
- avatar
- created_at
user_profiles
- id
- user_id
- name
- birth_date
- gender
- location
- is_default
crystals
- id
- name
- color
- elements
- benefits
- price_tier
- available_sizes
- image_url
energy_reports
- id
- user_id
- profile_id
- scene
- report_data
- summary_text
- poster_url
- created_at
recommendations
- id
- user_id
- profile_id
- report_id
- plan_data
- created_at
orders
- id
- user_id
- profile_id
- plan
- total_price
- status
- address
- payment_time
- created_at

---
7.4 迁移管理
使用 drizzle-kit 管理 schema 和 migrations。
约束
- 不让 Cursor 纯手写 migration SQL
- 所有 schema 变更通过 Drizzle 配置统一维护

---
8. 目录结构建议
auraflow/
├─ app/
│  ├─ (auth)/
│  │  └─ login/
│  ├─ (main)/
│  │  ├─ scene/
│  │  ├─ profiles/
│  │  ├─ questionnaire/
│  │  ├─ report/
│  │  ├─ plans/
│  │  ├─ poster/
│  │  ├─ checkout/
│  │  └─ orders/
│  └─ api/
│     ├─ auth/
│     ├─ profiles/
│     ├─ report/
│     ├─ recommend/
│     ├─ orders/
│     └─ files/
├─ components/
│  ├─ ui/
│  └─ custom/
├─ lib/
│  ├─ auth/
│  ├─ db/
│  ├─ report/
│  ├─ recommend/
│  ├─ storage/
│  └─ validations/
├─ drizzle/
│  ├─ schema/
│  └─ migrations/
├─ store/
├─ data/
│  ├─ uploads/
│  ├─ posters/
│  └─ generated/
├─ public/
├─ scripts/
├─ docker-compose.yml
├─ Dockerfile
└─ package.json

---
9. 本地服务与运行方式
9.1 必需服务
- web: Next.js
- db: PostgreSQL
9.2 当前不必接入的服务
- Redis
- MinIO
- MQ
- Elasticsearch
- 独立异步任务服务
原因
MVP 复杂度不足以支撑额外中间件的必要性，保持最小可运行系统更适合 Cursor 与本地开发。

---
9.3 Docker Compose 示例
services:
  db:
    image: postgres:17
    container_name: auraflow-db
    environment:
      POSTGRES_DB: auraflow
      POSTGRES_USER: auraflow
      POSTGRES_PASSWORD: auraflow_local
    ports:
      - "5432:5432"
    volumes:
      - ./docker/postgres-data:/var/lib/postgresql/data

  web:
    build: .
    container_name: auraflow-web
    depends_on:
      - db
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://auraflow:auraflow_local@db:5432/auraflow
      AUTH_SECRET: local_dev_secret_change_me
      FILE_STORAGE_ROOT: /app/data
    volumes:
      - ./:/app
      - ./data:/app/data

---
10. 本地文件存储策略
10.1 目录规划
./data/uploads
./data/posters
./data/generated
10.2 文件处理原则
- 所有上传文件统一由后端 Route Handler 管理
- 文件名使用 UUID 或时间戳，避免冲突
- 禁止直接把任意路径暴露给前端
- 前端访问生成图通过受控接口或映射静态资源完成

---
11. 开发规范
11.1 必须使用成熟轮子，禁止手搓的部分
禁止手搓
- 认证系统
- session / cookie 管理
- ORM
- migration 系统
- UI 基础组件
- 图表引擎
- 表单校验引擎
- 截图导图引擎
- 支付 SDK
必须使用库
- 认证：Better Auth
- ORM：Drizzle ORM
- UI：shadcn/ui
- 状态：Zustand
- 表单：React Hook Form + Zod
- 图表：Recharts
- 导图：html2canvas

---
11.2 页面状态规范
所有页面必须支持：
- loading
- error
- empty
不得出现：
- 白屏
- 无反馈提交
- 网络错误后无兜底
- 数据为空时仍硬渲染组件

---
11.3 API 设计规范
全部 API 使用 Next.js Route Handlers。
建议接口：
POST   /api/auth/login
POST   /api/auth/verify
GET    /api/profiles
POST   /api/profiles
PUT    /api/profiles/:id
DELETE /api/profiles/:id

POST   /api/report/generate
GET    /api/report/:id

POST   /api/recommend
GET    /api/recommend/:id

POST   /api/poster/export

POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders/:id/pay-mock

---
12. Zustand Store 建议结构
type AppStore = {
  user: User | null
  currentScene: "career" | "wealth" | "love" | "study" | "calm" | null
  selectedProfileId: number | null
  questionnaireAnswers: Record<string, unknown>
  currentReport: EnergyReport | null
  selectedPlanId: string | null
  shareAssetStatus: "idle" | "generating" | "done" | "error"
}
````

