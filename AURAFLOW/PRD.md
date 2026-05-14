````markdown
# AuraFlow 正式完整版产品需求文档（PRD）

> 版本：V2.2（完整版 / Markdown）
>  
> 用途：用于 AI Coding、产品设计、前后端协作、测试验收
>  
> 技术策略：全本地运行，不使用云端服务
>  
> 说明：保留原正式版主体结构，并补充场景化入口、解析报告页、推理路径、分享机制、增值服务预留与本地化工程约束。

---

# 第一部分：全局设定

## 1. 技术栈与架构

### 1.1 前端框架
- Next.js（App Router）
- Tailwind CSS
- shadcn/ui

说明：
- 全部采用成熟开源方案
- shadcn/ui 采用 Open Code 模式，组件源码直接进入项目，避免黑盒依赖
- 页面、组件、路由、状态和 API 均按标准工程结构组织

### 1.2 后端 / 数据库
- 本地 PostgreSQL
- Drizzle ORM
- Next.js Route Handlers

说明：
- 使用本地 PostgreSQL 替代云数据库，实现完全本地运行
- 使用 Drizzle ORM 管理 schema 与 migration，避免手写 SQL 层
- 使用 Next.js Route Handlers 作为轻量后端 API，无需额外部署独立 Node 服务

### 1.3 认证体系
- Better Auth（本地认证框架）

说明：
- 用户数据完全存储在本地 PostgreSQL
- 支持手机号验证码登录
- 开发阶段使用本地 mock OTP，不接短信云服务
- 禁止手写认证系统与 session 管理逻辑

### 1.4 AI / 规则引擎 / 第三方能力
- 本地化八字 / 五行规则引擎
- 静态占位图 / Canvas 合成
- html2canvas（报告海报导出）
- 微信支付 / 支付宝 SDK（后期接入，当前阶段仅实现 mock 支付流程）

### 1.5 状态管理
- Zustand

说明：
- 用于管理全局用户状态、场景状态、报告状态、分享状态、流程状态等

### 1.6 文件存储
采用本地文件系统，不使用任何云存储。

目录约定：
- `./data/uploads`
- `./data/posters`
- `./data/generated`

### 1.7 项目结构要求
项目结构严格按照 Next.js App Router 规范拆分：

- `app/`：页面路由
- `components/ui/`：基础 UI 组件（shadcn/ui）
- `components/custom/`：业务组件
- `lib/`：核心逻辑与 API 工具
- `store/`：状态管理
- `drizzle/`：数据库 schema 与迁移
- `data/`：本地文件数据

---

## 2. 工程约束（必须遵守）

### 2.1 禁止手搓的能力
禁止 Cursor 手搓以下内容：
- 登录系统
- ORM
- UI 基础组件库
- 图表引擎
- 表单校验系统
- 截图 / 导图能力
- Session 管理

### 2.2 必须使用的成熟库
- UI：shadcn/ui
- 图表：Recharts 或 Chart.js
- 表单：React Hook Form + Zod
- 导图：html2canvas
- 认证：Better Auth
- ORM：Drizzle ORM

### 2.3 本地化约束
- 不允许使用 Supabase Cloud、Firebase、Clerk、Auth0 等云服务
- 不允许使用云对象存储
- 所有前后端与服务必须在本地可运行
- 支付只实现本地 mock 流程

---

## 3. 产品概述

### 3.1 产品名称
AuraFlow

### 3.2 一句话描述
为水晶小白与理性疗愈人群提供“可解释、可分享、可下单”的个性化手串定制 App。

### 3.3 目标用户
- 水晶爱好者
- 想购买手串的用户
- 对生辰八字 / 运势有需求但不精通的用户
- 高压职场白领
- 玄学深度研习者
- Z 世代玄学原住民
- 高线城市新锐中产

### 3.4 核心价值
通过用户档案（生辰 + 个性化偏好）+ 水晶知识库 + 场景化意图输入，自动匹配并生成高中低三档价位的手串方案；先给出“能量解析报告”，再给出可下单方案，提升信任与转化。

### 3.5 体验关键词
- 专业
- 治愈
- 可解释
- 简单
- 个性化
- 可分享

---

## 4. 全局设计规范

### 4.1 色彩系统
- 页面背景：`#FAF8F5` / `#F9F9F9`
- 主色：`#D4C4A8`
- 边框色：`#E6DED0`
- 正文字色：`#333333`
- 辅助文字：`#777777`

### 4.2 视觉原则
- 中性极简
- 高级留白
- 专业可信
- 不娱乐化
- 不低龄化
- 不做盲盒风或炫彩渐变

### 4.3 页面级实现要求
- 结果页中的五行雷达图、能量条必须使用 Recharts 或 Chart.js
- 海报保存功能必须通过 html2canvas 实现
- 推荐页必须支持“推理路径折叠卡片”
- 所有主要页面必须处理以下三类状态：
  - loading
  - error
  - empty

---

# 第二部分：功能需求详情

## 1. 用户登录 / 注册

### 1.1 登录方式
- 手机号 + 验证码

### 1.2 功能描述
- 首次登录自动创建用户 ID
- 保存用户基本信息（昵称、头像可选）
- 支持登录态续存

---

## 2. 用户档案管理

### 2.1 档案字段
- 档案名称（如“自己”“妈妈”）
- 出生年月日（必填）
- 性别（男 / 女）
- 出生地（用于时辰校正，必填，精确到区县）

### 2.2 支持能力
- 创建档案
- 编辑档案
- 删除档案
- 切换默认档案

### 2.3 数据表
- `user_profiles`

---

## 3. 定制匹配流程

## 3.1 场景化入口（新增）

### 功能描述
用户进入定制流程前，先通过主题卡片表达当前最关心的问题，以降低理解成本并增强点击动机。

### 场景选项
- 事业运提升
- 招财能量
- 学业专注
- 情感疗愈
- 平静身心

### 交互方式
- 用户点击任一主题卡片后进入档案选择与问卷填写流程

### 算法要求
- 场景化入口的结果需映射为 `desired_effects` 的最高优先级输入
- 优先级高于一般偏好项

---

## 3.2 输入

### 功能描述
- 选择一个已有档案
- 进入定制流程

---

## 3.3 八字喜用神计算（规则占位）

### 输入
- 出生年月日
- 性别
- 出生地 / 现居地

### 输出
- 喜用五行（如“火、土”）
- 身强 / 身弱

### 接口定义

```http
POST /api/bazi/calculate
Request: { birth_date, gender, location }
Response: { favorable_elements: [], body_strength: "strong"|"weak" }

---
3.4 水晶知识库匹配（保留结构，不填算法）
说明
本部分保留原正式版结构，但根据你的要求，不在此文档中填写具体“水晶匹配算法”内容。
包含内容
- 水晶知识库结构
- 匹配规则
- 核心匹配逻辑
- 三档方案生成调用逻辑
开发要求
- 该部分直接沿用你已确认正确的原始代码
- Cursor 不得擅自改动算法逻辑
- 本文档只增强其前后流程与展示层，不改动核心推荐逻辑

---
3.5 个性化问题收集（增强版）
功能描述
用户在匹配前回答 4–6 个问题，用于进一步精准推荐。
问题设置
Q1 场景破冰问题
您当下最希望在哪方面获得能量加持？
- 突破职场瓶颈（事业）
- 稳固财富磁场（财运）
- 疗愈情感内耗（人际 / 桃花）
- 平静身心焦虑（健康 / 安神）
- 学业专注
说明：
- 该题需与首页场景化入口保持一致
- 若首页已选场景，则该题默认选中并允许修改
Q2 额外期望功效（多选）
- 招财
- 桃花
- 健康
- 事业
- 情绪
- 无
Q3 喜欢的色系浓度（多选）
- 偏浓
- 偏透
- 适中
- 混搭
Q4 更喜欢的搭配（单选）
- 简单素净（1–2 款水晶）
- 常规设计（3–4 款水晶）
- 大胆撞色（多宝风格）
Q5 是否喜欢装饰点缀（单选）
- 喜欢精致特别的
- 适度点缀即可
- 不要任何非天然装饰
Q6 珠子大小偏好（单选）
- 小珠（6–8mm）
- 中珠（8–10mm）
- 大珠（10–12mm）

---
3.6 能量场解析报告页（新增关键页）
功能描述
用户填完问卷后，不直接展示商品，而是先展示一份基于其档案与问卷结果生成的“专属能量解析报告”。
核心价值
- 解释推荐依据
- 增强专业感
- 避免算法黑盒
- 提高高价值用户信任度
页面展示内容
- 五行雷达图 / 能量条
- 身强 / 身弱结论
- 当前核心诉求标签
- 1–2 句简明推导结论
- 推荐元素标签
- 推荐矿石关键词
推理路径
必须支持“查看推理路径”折叠卡片。
默认状态
- 折叠
- 展示标题 + 一行摘要 + 箭头
展开后展示内容
1. 生辰基础信息
2. 五行分布判断
3. 场景加权
4. 匹配矿石方向
5. 推荐矿石组合
6. 推荐结论摘要卡片
展开样式要求
- 使用 Accordion 实现
- 展开后为“步骤流 + 说明文案”结构
- 步骤之间用竖向连接线串联
- 底部为高亮结论块
报告页底部 CTA
- 保存报告海报
- 查看我的专属疗愈手串
接口定义
POST /api/report/generate
Request: { profile_id, scene, answers }
Response: {
  report_id,
  body_strength,
  favorable_elements: [],
  missing_elements: [],
  radar_chart_data: [],
  summary_text,
  logic_chain: [
    "八字偏弱",
    "当前事业诉求权重最高",
    "建议补木 / 水元素",
    "推荐绿幽灵 + 海蓝宝"
  ]
}

---
3.7 三档价位方案生成
功能描述
根据匹配出的水晶列表，生成三档方案：
- 经济档
- 均衡档
- 尊享档
三档定义
- 经济档：主要使用低价位水晶，珠子较小，简单串式
- 均衡档：中价位水晶 + 少量高价位点缀，中等大小，搭配美观
- 尊享档：高价位水晶 + 特殊配饰，珠子大，设计感强
每个方案输出内容
- 手串组成列表（水晶 ID + 数量 + 位置）
- 总价
- 效果图
- 功效描述
- 推荐理由摘要（新增）
推荐理由摘要示例
- 因当前偏重事业诉求，优先匹配金钛晶与黄水晶
- 因当前偏重情绪安定，优先推荐白水晶与海蓝宝
页面操作
- 查看详情
- 生成专属能量海报
- 选择并下单
接口定义
POST /api/recommend
Request: { profile_id, scene, answers: { 功效: [], 色系: [], 珠子尺寸, 预算倾向 } }
Response: {
  plans: [
    { price_tier, crystals: [], total_price, image_url, description, reason_summary }
  ]
}

---
3.8 分享与传播（新增）
功能描述
结果页与方案页必须支持“保存我的专属能量海报”功能。
海报内容建议
- 用户昵称 / 档案名
- 场景标签
- 五行结论
- 推荐矿石关键词
- 主视觉效果图
- 品牌标识
导出要求
- 默认导出 PNG
- 适配社交平台长图比例
- 后续可升级支持视频或 GIF
文案边界
禁止出现以下表述：
- 保证转运
- 保证生效
- 治病
- 必定发财
统一使用以下方向表达：
- 个性化建议
- 情绪支持
- 传统文化灵感
- 能量陪伴

---
3.9 增值服务模块（预留）
定位
面向高客单价用户与高线城市新锐中产，预留更深度的“能量管理方案”。
MVP 阶段
- 仅预留入口与信息架构
- 不要求开发完整闭环
后续可扩展方向
- 数字能量档案
- 每日心情记录
- 佩戴时长记录
- 主观反馈追踪
- 季度运势追踪报告
- 专属命理师咨询

---
1. 下单与支付
功能流程
- 用户从三个方案中选择一个
- 点击“立即购买”进入订单页
- 确认收货地址、联系方式
- 当前阶段使用本地 mock 支付流程
- 支付成功后生成订单，订单状态为“待制作”

---
5. 订单管理
订单列表
支持以下状态筛选：
- 全部
- 待付款
- 待制作
- 已发货
- 已完成
订单详情
展示内容：
- 定制方案内容
- 效果图
- 物流信息（后期）
- 客服入口
- 售后入口

---
第三部分：核心主流程
登录
→ 场景化入口
→ 选择/创建档案
→ 个性化问卷
→ 能量解析报告
→ 三档推荐方案
→ 分享 or 下单
→ 订单详情

---
第四部分：数据与状态管理
1. 全局状态（Store）
- user
- isLoading
- currentScene
- currentReport
- questionnaireAnswers
- selectedPlanId
- shareAssetStatus
2. 本地存储
- user_token
- app_settings
- 最近一次场景选择
- 分享引导状态
3. API 设计原则
建议统一采用 REST 风格，当前阶段至少覆盖：
- 登录
- 档案管理
- 报告生成
- 推荐生成
- 海报导出
- 订单创建
- mock 支付

---
第五部分：核心数据结构
1. 用户表 users
暂时无法在飞书文档外展示此内容
2. 用户档案表 user_profiles
暂时无法在飞书文档外展示此内容
3. 水晶库表 crystals
暂时无法在飞书文档外展示此内容
4. 解析报告表 energy_reports
暂时无法在飞书文档外展示此内容
5. 定制方案表 recommendations
暂时无法在飞书文档外展示此内容
6. 订单表 orders
暂时无法在飞书文档外展示此内容

---
第六部分：非功能性需求（边界与约束）
1. 性能要求
- 推荐接口与报告接口理想返回时间控制在 2 秒内
- 图片使用懒加载
- 列表滑动帧率保持 60fps
2. 适配要求
- 优先适配移动端主流尺寸
- 如为 H5，需保证 iOS 与 Android 字体、阴影、长图导出表现稳定
3. 权限管理
- 如需相册权限，必须在调用系统相册前请求权限
- 需处理拒绝权限时的引导弹窗
4. 错误处理
- 所有网络请求必须包含 catch 处理
- 推荐失败、报告生成失败、海报导出失败均需有可回退交互
5. 数据安全
- 用户手机号、出生信息、地址等敏感数据需加密存储
- 报告数据不得明文暴露在前端日志中
6. 可解释性要求
- 任何推荐结果都必须有摘要理由
- 核心推荐页面必须提供“查看推理路径”入口
7. 合规要求
文案不得承诺：
- 治病
- 转运
- 保证生效
- 保证结果
统一以：
- 个性化建议
- 情绪支持
- 传统文化灵感
- 能量陪伴
进行表达
8. 分享要求
- 导出的海报信息需完整、无遮挡
- 涉及用户昵称与档案名时，应允许用户在导出前自主隐藏

---
第七部分：开发优先级建议
P0（必须上线）
- 登录
- 档案管理
- 场景化入口
- 八字计算
- 问卷收集
- 解析报告页
- 三档方案页
- 下单与订单管理
P1（增强转化）
- 海报导出
- 推荐理由摘要
- 推理路径折叠卡
- 客服入口
P2（品牌与复购）
- 能量档案
- 佩戴反馈
- 季度追踪报告
- 专属命理师咨询

---
第八部分：给 Cursor 的执行要求
开发原则
1. 先搭建项目脚手架和目录结构
2. 再实现登录模块
3. 然后依次实现：
  - 场景化入口
  - 档案管理
  - 个性化问卷
  - 解析报告页
  - 三档推荐
  - 下单与订单
必须遵守
- 所有组件必须处理 loading / error / empty 状态
- 严格按照本 PRD 色彩与结构规范实现
- 结果页必须先展示“能量解析报告”，再展示商品方案
- 推理路径必须可查看
- 报告页或方案页必须支持“保存专属海报”
- 不得改动原“水晶匹配算法”业务逻辑
- 不得接入任何云服务
- 所有认证、数据库、文件存储均在本地完成

---
第九部分：附录说明
附录 A：水晶知识库匹配与匹配规则代码
- 本文档不展开具体内容
- 实际开发时请直接沿用你已确认正确的原始算法代码
- Cursor 不得擅自改动算法逻辑
- 知识库结构（全）：
[
  {
    "crystal_id": "C-JIN-001",
    "name": "白水晶",
    "color": "白色/透明",
    "elements": ["金"],
    "功效": ["净化磁场", "提升专注", "挡煞防小人", "缓解焦虑"],
    "价格等级": "low",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/bai-shui-jing.png"
  },
  {
    "crystal_id": "C-JIN-002",
    "name": "白阿塞",
    "color": "白色透明带金光",
    "elements": ["金"],
    "功效": ["吸收负能量", "开运提势", "净化磁场", "提升灵性"],
    "价格等级": "medium",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/bai-a-sai.png"
  },
  {
    "crystal_id": "C-JIN-003",
    "name": "金钛晶",
    "color": "金色/透明带金发丝",
    "elements": ["金"],
    "功效": ["招正偏财", "事业", "决断力", "行动力"],
    "价格等级": "high",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/jin-tai-jing.png"
  },
  {
    "crystal_id": "M-JIN-001",
    "name": "银曜石",
    "color": "黑底带银色猫眼",
    "elements": ["金"],
    "功效": ["吸收负能量", "护身", "辟邪", "缓解失眠", "安神"],
    "价格等级": "low",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/yin-yao-shi.png"
  },
  {
    "crystal_id": "M-JIN-002",
    "name": "青金石",
    "color": "藏蓝色带金星",
    "elements": ["金"],
    "功效": ["表达力", "化解人际矛盾", "提升洞察力", "安神"],
    "价格等级": "medium",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/qing-jin-shi.png"
  },
  {
    "crystal_id": "M-JIN-003",
    "name": "999足银嵌金砂石",
    "color": "银色带金砂",
    "elements": ["金"],
    "功效": ["招财", "护身", "调节人体磁场", "辟邪"],
    "价格等级": "high",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/zu-yin-jin-sha.png"
  },
  {
    "crystal_id": "C-MU-001",
    "name": "绿玛瑙",
    "color": "淡绿色",
    "elements": ["木"],
    "功效": ["招正财", "事业", "促进新陈代谢", "提升活力"],
    "价格等级": "low",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/lv-ma-nao.png"
  },
  {
    "crystal_id": "C-MU-002",
    "name": "绿幽灵",
    "color": "绿色异象",
    "elements": ["木"],
    "功效": ["招正财", "事业", "促进人际和谐", "净化心轮"],
    "价格等级": "medium",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/lv-you-ling.png"
  },
  {
    "crystal_id": "C-MU-003",
    "name": "绿碧玺",
    "color": "浓绿色冰体",
    "elements": ["木"],
    "功效": ["招财", "事业", "化解职场小人", "调和五行"],
    "价格等级": "high",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/lv-bi-xi.png"
  },
  {
    "crystal_id": "M-MU-001",
    "name": "东陵玉",
    "color": "淡绿带金沙",
    "elements": ["木"],
    "功效": ["行动力", "旺人际", "招贵人", "缓解拖延症"],
    "价格等级": "low",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/dong-ling-yu.png"
  },
  {
    "crystal_id": "M-MU-002",
    "name": "葡萄石",
    "color": "嫩绿色带猫眼",
    "elements": ["木"],
    "功效": ["缓解焦虑", "舒缓情绪", "安神", "提升气质"],
    "价格等级": "medium",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/pu-tao-shi.png"
  },
  {
    "crystal_id": "M-MU-003",
    "name": "翡翠",
    "color": "糯种飘绿",
    "elements": ["木"],
    "功效": ["护身", "招财", "事业", "养人保平安"],
    "价格等级": "high",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/fei-cui.png"
  },
  {
    "crystal_id": "C-SHUI-001",
    "name": "蓝玉髓",
    "color": "淡蓝色",
    "elements": ["水"],
    "功效": ["表达力", "护身", "招贵人缘", "辟邪防小人"],
    "价格等级": "low",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/lan-yu-sui.png"
  },
  {
    "crystal_id": "C-SHUI-002",
    "name": "海蓝宝",
    "color": "冰种浅蓝",
    "elements": ["水"],
    "功效": ["表达力", "缓解焦虑", "护佑出行平安", "逻辑思维"],
    "价格等级": "medium",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/hai-lan-bao.png"
  },
  {
    "crystal_id": "C-SHUI-003",
    "name": "水胆水晶",
    "color": "透明带流动水胆",
    "elements": ["水"],
    "功效": ["招财", "激活智慧", "护身", "净化脉轮"],
    "价格等级": "high",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/shui-dan-shui-jing.png"
  },
  {
    "crystal_id": "M-SHUI-001",
    "name": "黑曜石",
    "color": "纯黑冰种",
    "elements": ["水"],
    "功效": ["吸收负能量", "护身", "辟邪", "缓解失眠", "安神"],
    "价格等级": "low",
    "珠子尺寸": [12, 14],
    "图片url": "/mock-images/hei-yao-shi.png"
  },
  {
    "crystal_id": "M-SHUI-002",
    "name": "蓝虎眼石",
    "color": "宝蓝色带猫眼",
    "elements": ["水"],
    "功效": ["招财", "行动力", "化病排毒", "净化系统"],
    "价格等级": "medium",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/lan-hu-yan.png"
  },
  {
    "crystal_id": "M-SHUI-003",
    "name": "海纹石",
    "color": "蓝白海洋纹理",
    "elements": ["水"],
    "功效": ["净化脉轮", "化解人际矛盾", "缓解焦虑", "招贵人缘"],
    "价格等级": "high",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/hai-wen-shi.png"
  },
  {
    "crystal_id": "C-HUO-001",
    "name": "粉晶",
    "color": "粉色",
    "elements": ["火"],
    "功效": ["招桃花", "改善人际关系", "缓解焦虑", "净化心轮"],
    "价格等级": "low",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/fen-jing.png"
  },
  {
    "crystal_id": "C-HUO-002",
    "name": "紫水晶",
    "color": "浓紫色",
    "elements": ["火"],
    "功效": ["助学业", "开发智慧", "缓解焦虑", "安神"],
    "价格等级": "medium",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/zi-shui-jing.png"
  },
  {
    "crystal_id": "C-HUO-003",
    "name": "粉火水晶",
    "color": "樱花粉带火彩",
    "elements": ["火"],
    "功效": ["招正缘", "提升个人魅力", "治愈情感创伤", "创造力"],
    "价格等级": "high",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/fen-huo-shui-jing.png"
  },
  {
    "crystal_id": "M-HUO-001",
    "name": "红玛瑙",
    "color": "正红色",
    "elements": ["火"],
    "功效": ["事业", "护身", "提升身体活力", "本命年辟邪"],
    "价格等级": "low",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/hong-ma-nao.png"
  },
  {
    "crystal_id": "M-HUO-002",
    "name": "石榴石",
    "color": "酒红冰种",
    "elements": ["火"],
    "功效": ["美容养颜", "护身", "改善内分泌", "促进血液循环"],
    "价格等级": "medium",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/shi-liu-shi.png"
  },
  {
    "crystal_id": "M-HUO-003",
    "name": "南红玛瑙",
    "color": "樱桃红满肉",
    "elements": ["火"],
    "功效": ["招财", "事业", "安神", "护身", "保平安"],
    "价格等级": "high",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/nan-hong.png"
  },
  {
    "crystal_id": "C-TU-001",
    "name": "黄阿塞",
    "color": "透明带金光",
    "elements": ["土"],
    "功效": ["招财守财", "稳定财运", "提升自信", "行动力"],
    "价格等级": "low",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/huang-a-sai.png"
  },
  {
    "crystal_id": "C-TU-002",
    "name": "黄水晶",
    "color": "柠檬黄",
    "elements": ["土"],
    "功效": ["招财", "事业", "决断力", "行动力"],
    "价格等级": "medium",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/huang-shui-jing.png"
  },
  {
    "crystal_id": "C-TU-003",
    "name": "黄塔晶",
    "color": "黄透明带塔状色带",
    "elements": ["土"],
    "功效": ["招财", "决断力", "缓解焦虑", "提升理性思维"],
    "价格等级": "high",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/huang-ta-jing.png"
  },
  {
    "crystal_id": "M-TU-001",
    "name": "黄虎眼石",
    "color": "黄色带猫眼",
    "elements": ["土"],
    "功效": ["行动力", "决断力", "招财", "护身"],
    "价格等级": "low",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/huang-hu-yan.png"
  },
  {
    "crystal_id": "M-TU-002",
    "name": "黄发晶",
    "color": "黄透明带顺直发丝",
    "elements": ["土"],
    "功效": ["招财", "事业", "护身", "净化身体"],
    "价格等级": "medium",
    "珠子尺寸": [8, 10],
    "图片url": "/mock-images/huang-fa-jing.png"
  },
  {
    "crystal_id": "M-TU-003",
    "name": "蜜蜡",
    "color": "鸡油黄满蜜",
    "elements": ["土"],
    "功效": ["安神", "护身", "招财", "滋养身体", "保平安"],
    "价格等级": "high",
    "珠子尺寸": [10, 12],
    "图片url": "/mock-images/mi-la.png"
  }
]
- 匹配规则（已补充）：
// 1. 水晶知识库数据模型 (严格对应 JSON)
export interface Crystal {
  crystal_id: string;
  name: string;
  color: string;
  elements: string[];
  功效: string[];
  价格等级: 'low' | 'medium' | 'high';
  珠子尺寸: number[];
  图片url: string;
  matchScore?: number; // 动态计算的匹配分
}

// 2. 用户偏好输入模型 (对应前端问卷)
export interface UserProfile {
  favorable_elements: string[];     // 喜用五行，如 ['火', '木']
  body_strength: 'strong' | 'weak'; // 身强/身弱
  preferences: {
    desired_effects: string[];      // 期望功效关键词，如 ['招财', '桃花']
    budget: 'low' | 'medium' | 'high'; // 预算倾向
    bead_size: number;              // 偏好珠子大小，如 8, 10, 12
  };
}

// 3. 核心匹配算法
export function matchCrystals(user: UserProfile, allCrystals: Crystal[]): Crystal[] {
  // --- 步骤一：硬性过滤 (Hard Filter) ---
  // 只保留至少命中一个“喜用五行”的水晶。若用户未算出五行，则跳过过滤。
  let candidateCrystals = allCrystals;
  if (user.favorable_elements.length > 0) {
    candidateCrystals = allCrystals.filter(crystal => 
      crystal.elements.some(el => user.favorable_elements.includes(el))
    );
  }

  // --- 步骤二：多维度权重打分 (Scoring System) ---
  let scoredCrystals = candidateCrystals.map(crystal => {
    let score = 0;

    // 【规则 A：功效匹配加分】(权重最高：每个命中+10分)
    // 兼容模糊匹配，例如 JSON中是"招正偏财"，用户选了"招财"，也能命中
    if (user.preferences.desired_effects.length > 0) {
      const matchedEffects = crystal.功效.filter(effect => 
        user.preferences.desired_effects.some(pref => effect.includes(pref))
      );
      score += matchedEffects.length * 10; 
    }

    // 【规则 B：身强/身弱玄学微调】(匹配中+5分)
    const weakKeywords = ['护身', '净化', '安神', '吸收负能量', '缓解焦虑'];
    const strongKeywords = ['招财', '事业', '决断力', '表达力', '行动力'];

    if (user.body_strength === 'weak') {
       // 身弱宜补：加重守护、安神类水晶的权重
      const hasWeakMatch = crystal.功效.some(effect => weakKeywords.some(kw => effect.includes(kw)));
      if (hasWeakMatch) score += 5;
    } else if (user.body_strength === 'strong') {
       // 身强宜泄：加重主动出击、招财类水晶的权重
      const hasStrongMatch = crystal.功效.some(effect => strongKeywords.some(kw => effect.includes(kw)));
      if (hasStrongMatch) score += 5;
    }

    // 【规则 C：珠子尺寸匹配】(命中+8分)
    if (user.preferences.bead_size && crystal.珠子尺寸.includes(user.preferences.bead_size)) {
      score += 8;
    }

    // 【规则 D：预算倾向匹配】(命中+5分)
    if (user.preferences.budget && crystal.价格等级 === user.preferences.budget) {
      score += 5;
    }

    return { ...crystal, matchScore: score };
  });

  // --- 步骤三：排序输出 ---
  // 将打分最高的水晶排在最前面
  scoredCrystals.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  
  return scoredCrystals;
}

// TODO: 接着调用生成方案的函数，根据排序好的水晶列表，分别按 'low', 'medium', 'high' 提取主珠，组装成 3 档 Plan。
    if (user.body_strength === 'weak') {
      const hasWeakMatch = crystal.功效.some(effect => weakKeywords.some(kw => effect.includes(kw)));
      if (hasWeakMatch) score += 5; // 身弱补能量，匹配中加分
    } else if (user.body_strength === 'strong') {
      const hasStrongMatch = crystal.功效.some(effect => strongKeywords.some(kw => effect.includes(kw)));
      if (hasStrongMatch) score += 5; // 身强主动泄放，匹配中加分
    }

    return { ...crystal, matchScore: score };
  });

  // 3. 排序并按价位分组输出 (组合成经济、均衡、尊享三档)
  scoredCrystals.sort((a, b) => b.matchScore - a.matchScore);
  
  // TODO: 后续逻辑为根据预算等级和珠子大小，从 scoredCrystals 中提取数据生成三个方案（Plan）。
  return generateThreeTierPlans(scoredCrystals);
}
  
````

