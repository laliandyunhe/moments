/**
 * Roche 朋友圈插件 v2.16.0
 * 完全拟真微信朋友圈的沉浸式模拟
 * v2.16.0: 总提示词发一条/召唤评论/NPC 评论分类新增「朋友圈上下文（feed，含总结替换）」只读预览；
 * 修复聊天分类「行为记录」预览：未开启 memSync 时不再错误显示 user 认知行文本（与真实聊天注入条件一致）。
 * v2.15.0: 总提示词每个功能分类新增「预览实际发送的完整提示词」按钮：按真实构建逻辑合成该功能请求 AI 的完整提示词（改后立即反映）；
 * 聊天分类与 chatContextProvider 逐项一致（含朋友圈上下文/总结替换）。
 * v2.14.0: 召唤评论（单条/批量）与 NPC 评论的 AI 提示词加入「该 char 可见的朋友圈上下文」（有总结只发总结），与聊天注入一致；
 * 总提示词「聊天时 char 的提示词」新增朋友圈上下文（feed）只读预览。
 * v2.13.0: 修复夜间模式下发朋友圈输入框/评论输入框背景与文字颜色未跟随；消息通知默认上限 10 条（通知面板可自定义保留条数，超限自动清理更旧的）；
 * 修复可见性过滤 bug：user 评论「已开启主动私聊的 char 自己发布的朋友圈」时，该 char 被误过滤导致从不私聊，现改为自己可见、正常判断。
 * v2.12.0: 主动私聊新增「可见性过滤」开关（AI 提示词面板）：开启后，user 评论某 char 朋友圈时，只有与该 char 互为好友/已加好友的 char 才判断是否私聊，否则绝不触发；
 * 修复总提示词中引用项（如召唤评论的 char 朋友圈人设）背景纯白/文字样式与其他预览不一致（统一为预览样式+暗色适配）。
 * v2.11.0: 总提示词排版优化（分类标题与备注分开换行、不再挤压）；每个功能分类加入「实际注入内容」只读预览（世界书/挂载记忆/人设/关系网/可@的人/NPC 名单等）；
 * 文本框限制高度+滚动查看。
 * v2.10.0: 生成朋友圈人设/总结/关系网/NPC 时统一弹出「生成中」加载层，成功/失败均有弹窗提示；
 * 「朋友圈人设生成提示词」从「发一条」移到「生成类：朋友圈人设 / NPC / 关系网」分类（仅生成时使用，不会被注入发圈/评论/聊天）；NPC 评论生成时可见 char 人设。
 * v2.9.0: 「char 朋友圈人设」新增 AI 自动生成（默认提示词可编辑/预览，生成时 AI 可见该 char 人设 + 挂载的会话聊天记录/记忆）；
 * 修复 pendingDms 写入失败后持续累积：失败即移除该条、上限 20 条、过期 7 天自动清理。
 * v2.8.0: 主动私聊去掉确认框：AI 判断为私聊后直接写入聊天，并弹 Roche 本体提示「XX 私信了您」提醒 user。
 * v2.7.0: 主动私聊改为 Roche 本体确认弹窗（含 char 私聊内容），确认后直接写入聊天，移除 dm_user 工具与聊天提醒；
 * 修复记忆面板折叠后无法滚动（modal-bd min-height:0），记忆面板默认全折叠；侧边栏设置项按逻辑重排（外观→聊天→提示词→内容→系统）。
 * v2.6.0: 聊天 IndexedDB 注入改为按 Roche 实际结构精确写入（Roche_db / messages，记录含 senderId/senderName/isMe/timestamp/conversationId，_offline 会话加 isStreaming）。
 * v2.5.0: 私聊判断改为一次请求（主动私聊判断提示词 + 所有开启 char 的人设一起发送给 AI）；聊天 IndexedDB 注入跳过缓存库、支持按会话名存储/新会话注入、
 * 并可在「AI 提示词」面板手动指定库名/存储名；记忆挂载面板改为分区折叠（基础设置/会话记忆/世界书/人设/主动私聊/总结/记忆同步）。
 * v2.4.0: 主动私聊改为 AI 判断+生成：user 发朋友圈/评论后由 AI 依据判断提示词决定是否私聊并直接输出私聊内容，弹「私聊提醒」展示；
 * 「去聊天」改为把私聊内容写入聊天 IndexedDB（自动探测聊天库结构，失败有明确提示）；总提示词面板加入分类折叠（默认收起，支持全部展开/收起）。
 * v2.3.0: 新增「发圈后主动私聊 user」：per-char 开关（可仅 @ 触发），user 发圈写入待私聊标记、聊天注入提醒（提示词可编辑/预览，AI 依据具体情况判断），
 * 新增主聊天 dm_user 工具让 char 主动发起私聊；user 发圈后插件内弹「XX 想私聊你」通知，可一键跳转到对应 char 聊天。
 * v2.2.0: 「char 朋友圈人设」改为每个 char 单独设置（原全局值自动迁移到各 char），该 char 做朋友圈相关操作与聊天注入时自动注入；
 * 「总提示词」面板改为按功能分类（发一条 / 召唤评论 / NPC 评论 / 聊天注入 / 总结与记忆同步 / 生成 NPC 与关系网），
 * per-char 提示词支持按当前 char 切换查看/编辑，内置提示词只读预览，被引用的提示词自动同步。
 * v2.1.0: NPC 评论改为一次批量请求（保留概率过滤与失败兜底）；新增「char 朋友圈人设」全局提示词
 * （插件生成与聊天注入均可见，user 可自定义）；完善发圈规则格式与点赞/评论原则提示，去除工具调用残留与重复说明；
 * 所有 user 可编辑提示词框预填默认模板（含未替换变量）；侧边栏新增「总提示词」查看/编辑入口（影响范围备注、预览、联动更新提示）。
 * v2.0.5: 不再强制配图/自动补图——发圈提示词改为强调配图重要性并要求格式正确；
 * 多图生图自动排队（间隔由全局设置「生图排队间隔」控制，默认 3000ms，0=不等待）；
 * 点击已生成成功的图片可全屏放大查看（适配移动端，more 菜单不受影响）。
 * v2.0.4: 修复生图失败文字图的「more」菜单只能看到无法点击的问题（onRootClick 中 toggle-text
 * 快捷分支先执行并 return，吞掉了 more 按钮点击，现优先分发 open-image-menu）；
 * NPC 长按编辑改为 NPC 右侧「编辑」按钮（弹窗层级 z-index 提高，盖在 NPC 面板之上）；
 * 生图优化：同条朋友圈多图并行生成（并发 2）、提示词长度保护（截断 500 字）。
 * v2.0.3: 修复生图失败变成文字图/生成朋友圈无图的问题——发圈提示词强制配图、AI 漏输出
 * <images> 时自动按正文补配图、生图失败自动重试一次、兼容更多生图返回格式；生图失败降级的
 * 文字图也带「more」菜单（重新生成 / 查看编辑提示词），重新生成时同样显示加载占位；
 * 已绑定 NPC 长按可编辑名字/人设。
 * v2.0.2: 「发送图片模式」改为插件全局设置（侧边栏「AI 提示词」面板），所有 char 的聊天注入/
 * 评论/召唤/NPC/总结读取图片统一按全局设定（旧版 per-char 识图设置自动迁移为全局）；
 * 侧边栏与 char 世界书若重复开启同一词条会弹窗提醒（char 记忆面板同步显示重复提示）；
 * 挂载的会话记忆中 char 单聊的开关默认开启（首次列出会话自动挂载启用）。
 * v2.0.1: 修复评论看不到朋友圈图片/生图提示词的 bug（AI 默认可见生图提示词，据此评论点赞）；
 * 识图模式不再发送图片链接，改为把图片本体直接附加给模型（data URI 直接内嵌 / messages 图片块）；
 * 恢复侧边栏世界书读取（全局+局部可选）与 char 记忆面板世界书读取（局部+全局可选）。
 * v2.0.0: 版本大更新——去除插件内所有 handle（账号名）的运用，一律使用角色姓名：
 * 包括 @提及（@名字）、NPC 生成（不再输出/要求 handle）、点赞/评论发布者显示、char 头像旁
 * 姓名显示、关系网/最终提示词预览/生成提示词等所有注入 AI 的提示词；旧数据中残留的 handle
 * 仅作内部兼容保留，不再出现在任何界面与提示词中，避免 AI 将 char 与 NPC 等角色姓名和
 * handle 混淆。
 * v1.5.19: 修复评论“通知有、评论区无”的最终根因——后台 loadAll 会替换 state.posts，
 * 异步流程持有的旧 post 对象脱管导致评论/点赞写丢（通知仍生成）；现在写入前统一重新解析
 * 为当前 state.posts 中的权威对象，评论一定随朋友圈落库；强化聊天注入中“发朋友圈要考虑
 * NPC 点赞/评论”的提醒；挂载的会话记忆、NPC 召唤参与、NPC 提示词注入默认开启。
 * v1.5.18: 修复聊天上下文/后台场景下 AI 调用失败（callAI 改用 getRoche，此前依赖 cachedRoche
 * 导致聊天中触发的 NPC 评论/点赞静默失败）；生成朋友圈的评论解析容错——AI 漏写 target 时
 * 默认附加到自己刚发的最后一条、支持 reply-to，避免“大概率没有评论”；评论解析兜底不再把
 * 发圈/生图格式误存为评论文本；新增端到端测试验证评论一定随朋友圈落库。
 * v1.5.17: 修复“通知里有评论、朋友圈评论区却没有该评论”的 bug——评论写入改为直接落到调用方
 * 持有的 post 对象上（不再依赖按 id 重查），并仅在评论真正写入成功后才生成通知，避免
 * 通知与评论区数据不一致；预览待总结内容同步恢复显示该评论。
 * v1.5.16: 主动发圈每次条数 per-char 可控（1-9，支持一次连续发布多条）；「预览该 char 的
 * 最终 AI 提示词」顺序与聊天实际注入顺序一致；聊天注入强调发朋友圈自动生成 NPC 评论/点赞，
 * 且聊天中用 post_moment 发圈也会自动触发 NPC 评论/点赞（Store 兼容聊天上下文）；插件内
 * 生成注入的「最近朋友圈」改用 buildFeedContext，与条数上限/评论点赞/可见范围/总结一致。
 * v1.5.15: 新绑定 char 的「主动发朋友圈」默认关闭；NPC 生成默认提示词优先采用 char 人设中
 * 已出现的人物，无既定人物再自主生成；插件内生成流程（发一条/召唤评论/自动评论/主动 @ 生成）
 * 会读取并注入当前选择的 user 人设；侧边栏世界书仅保留全局、char 记忆世界书仅保留局部；
 * 「被评论时自动评论数」真正生效（召唤评论按各 char 设置限制条数）；主动发圈每次仅生成一条。
 * v1.5.14: 修复「预览待总结内容/请求 AI 总结」范围误报——对 NaN/旧数据 0 做容错（按 1 处理），
 * 只有范围确实填错（结束小于开始）才弹窗提示；最新一条朋友圈卡片内部上方再增加 20px
 * （padding-top 62px），主头像与名字下移 10px（cover-bar bottom -29px）；NPC 提示词
 * （合并/生成）编辑框预填默认模板（变量未替换版本），便于直接修改。
 * v1.5.13: 移除封面下方白色/黑色空隙条带，封面背景向下延伸直接与朋友圈内容相接
 * （高度 318px）；主头像与名字在屏幕上下移 20px（cover-bar bottom -19px），最新一条
 * 朋友圈卡片内部上方增加 30px 间距（.moment.first），头像/姓名不被内容遮挡。
 * v1.5.12: 图片生成/重新生成占位改为「直接注入现有 DOM」的兜底方式，不依赖重渲染时机，
 * 保证灰色占位 + 转圈动画 + 「图片加载中……」必然显示；封面背景下延 20px（高度 260px）、
 * 主头像与名字上移 10px（cover-bar bottom -57px）再次复核，确认在交付文件中生效。
 * v1.5.11: 修复图片生成占位不显示的问题——单图加载时容器高度塌陷导致占位不可见，
 * 现为加载态固定正方形尺寸并显示明显灰色占位 + 转圈 + 「图片加载中……」文字（日间/夜间
 * 同步）；NPC 生成提示词的已绑定 NPC 列表移到「【附加数据】」之前；封面背景下延 20px
 * （高度 260px）与主头像/名字上移 10px（bottom -57px）已就位并复核。
 * v1.5.10: NPC 生成提示词自动附带该 char 已绑定的 NPC 列表（名字/handle/人设），提示 AI
 * 避免生成重复 NPC（预览同步显示）；封面背景图下边界下移 20px，主头像与左侧名字上移 10px，
 * 名字与主头像上边界对齐。
 * v1.5.9: 朋友圈卡片间距缩小为 2px；封面与内容之间的空隙填充为卡片底色（日间白/
 * 夜间深灰）；生图「⋯」菜单的重新生成点击即直接重新请求生图（不做提示词变化检查），
 * 仅「查看/编辑提示词」里的重新生成检查提示词变化；生图占位改为浅灰色半透明并确保
 * 重新生成时显示「图片加载中……」占位。
 * v1.5.8: 图片生成/重新生成时显示灰色占位并提示「图片加载中……」，完成后替换为生成图片；
 * 修复重新生成失败问题（失败自动恢复旧图，不留空白占位）；重新生成前自动检查提示词是否
 * 有变化，无变化弹窗提醒且不重复请求生图；朋友圈内容下边界下移 15px、上边界下移 10px，
 * 封面与内容之间空隙填充为内容底色（夜间模式同步）。
 * v1.5.7: NPC 生成提示词可预览/编辑（默认模板修复 handle 多 @，如 xiaoming 而非 @xiaoming，
 * 解析时自动去 @）；长按点赞区域可删除单个/多个点赞者；世界书拆分——侧边栏为全局世界书
 * （所有 char 插件内生成通用），char 记忆面板为 per-char 局部世界书，生成流程分别注入；
 * 封面底部上移到头像下 1/3 处，内容上边界同步上移且不遮挡头像/姓名；文档新增转发说明。
 * v1.5.6: 世界书读取改为空间级通用设定（侧边栏统一勾选，所有插件内生成流程读取，无需
 * 每个 char 单独设置）；支持读取/选择全局与局部世界书（分类树 + 双 scope 词条合并）。
 * v1.5.5: 插件内生成（发一条/召唤评论/自动评论/主动 @ 生成）可读取 Roche 世界书词条
 * （per-char 可勾选，选择时缓存文本并实时刷新）；聊天上下文不注入世界书（由 Roche 本体提供）；
 * 删除提示词中的 emoji 禁令，改为依据人设可适当使用 emoji。
 * v1.5.4: 召唤评论只读取/发送与发圈者互为好友（标签含「好友/已加好友」）的 char 人设，
 * 未加好友的 char 不参与且人设不被发送（节省 token）；修复召唤回复格式——强制
 * 「小明 回复 小红：…」格式（AI 必须带 reply-to、正文不重复 @），并支持同批次连续回复
 * 识别与 @前缀 自动补全回复标记。
 * v1.5.3: 重构 NPC 提示词——不再每个 NPC 单独提示词，改为每个 char 一份合并提示词
 * （介绍所有绑定 NPC 的名字/handle/人设，说明可对 TA 的朋友圈评论/点赞），单窗口预览/编辑，
 * 支持 {charName}/{npcList} 变量；发圈/召唤评论/评论生成提示词明确说明动作由朋友圈工具
 * （post_moment/comment_moment/like_moment）自动执行。
 * v1.5.2: NPC 提示词可预览/编辑（留空 = 默认提示词，支持 {npcName}/{charName}/{postText}/
 * {postAuthor}/{prevComments} 变量）；NPC 设置新增「NPC 提示词注入聊天上下文」开关，开启后
 * 该 char 聊天时的朋友圈提示词会包含其 NPC 提示词。
 * v1.5.1: NPC 可选参与「召唤评论」（per-char 开关，默认关闭，开启后该 char 朋友圈被召唤时
 * NPC 一起评论）；生图失败降级为文字图的图片同样带「⋯」菜单（重新生成/查看编辑提示词）；
 * 修复夜间模式：朋友圈/评论文字反转白色、卡片间浅色横条、侧边栏选中空间对比度。
 * v1.5.0: 可见性规则大改——char 与 char 之间默认不认识（互相不可见朋友圈/评论/点赞），
 * 只有关系标签含「好友/已加好友」才互相可见；user↔char 默认可见。评论回复展示自动去掉
 * 开头重复 @（「小明 回复 小红：@小红 …」→「小明 回复 小红：…」）。新增「发送后自动请求
 * AI 回复」开关（侧边栏），关闭后评论输入 @ 出现角色快捷选择并可召唤回复。顶栏调整拆分：
 * 侧边栏标题背景高度 + 「朋友圈」/「×」上下位置两个滑块（带实时预览）。
 * v1.4.7: 与 AI 角色聊天时，char 发圈/评论/点赞会弹出 Roche 提醒；关系网提示词补入
 * 聊天注入与最终提示词预览；发布/编辑朋友圈新增「所在位置」输入栏；界面尺寸调整的
 * 「侧边栏标题高度」增加实时预览，明确控制标题栏高度（朋友圈/× 垂直居中于标题栏）；
 * 新增功能介绍 MD 文档。
 * v1.4.6: 移除「下载图片到本地」功能；氛围提示词（发圈/评论/NPC 评论）修复并注入聊天
 * 上下文与最终提示词预览；界面尺寸调整新增「侧边栏标题高度」（朋友圈/× 所在标题栏），
 * 标题栏吸顶显示、不随侧边栏滑动隐藏。
 * v1.4.5: 朋友圈排版仿微信——头像下方留空一行，文本/图片/评论/点赞与角色姓名左对齐；
 * 修复 APK 下载图片后相册无图的问题（分享优先，失败不再误报成功，自动打开图片供长按保存）；
 * 「可用变量参考」补齐总结/同步/历史分类等全部朋友圈可用变量。
 * v1.4.4: 「自定义行为记录提示词」仅保留可用变量参考与 user 双名字认知行的自定义/注入，
 * 其余行为记录内容及其注入已全部移除；修复 APK 环境下图片下载（blob + 系统分享/保存 +
 * 下载兜底）；朋友圈编辑/删除改为每条右上角小铅笔与垃圾桶图标，移除长按误触入口。
 * v1.4.3: AI 生图 more 菜单新增「下载图片到本地」；「预览该 char 的最终 AI 提示词」只显示
 * 实际发送给 AI 的提示词原文（去掉引导语与说明块）；「朋友圈行为记录」提示词支持 per-char
 * 自定义（开头行/user双名字认知行/导语/5分类/结尾模板，留空=内置默认，兼容旧版数据迁移）。
 * v1.4.2: 朋友圈内容从封面底部零空隙开始；总结朋友圈提示词/记忆同步提示词仅在点击对应
 * 功能时单独发送给 AI，聊天中不出现；聊天注入的朋友圈严格按 char 可见范围筛选（陌生/
 * 不认识者的动态及评论、点赞者不可见），已总结只发总结，未总结发原文（含评论、点赞者、
 * 时间）；「预览该 char 的最终 AI 提示词」改为只展示聊天实际注入内容并附说明。
 * v1.4.1: 修复封面图下方到朋友圈内容之间的空隙（封面头像/名字移入封面内，内容紧贴封面开始）；
 * 在 char「记忆」面板新增「预览该 char 的最终 AI 提示词」（即与该 char 聊天时插件实际
 * 发送给 AI 的完整提示词，按该 char 可见范围自动筛选）。
 * v1.4.0: UI 全面拟真微信朋友圈并适配移动端（黑色顶栏、封面渐变压暗、白色卡片间隔、
 * 安全区适配、移动端弹窗宽度）；封面支持 URL 或本地相册上传；删除「AI 提示词」面板的
 * 全部提示词预览功能；侧边栏移除 char「同步」快捷按钮（记忆面板内保留检查并同步）；
 * 修复「预览待同步内容」正文被截断的问题。
 * v1.3.0: 总结与记忆同步均按 char 可见范围自动筛选（不含陌生/不认识者的朋友圈），并支持
 * 预览待总结/待同步内容；默认总结提示词包含点赞者；图片改为右下角「more」菜单（重新生成 /
 * 查看编辑提示词），移除铅笔图标与长按预览；发送给 AI 的图片可选识图/文字图模式。
 * v1.2.0: 移除「记忆注入格式」功能；关系网新增 AI 自动生成（提示词可自定义、结果可审核编辑）
 * 与提示词预览，标注「陌生/不认识」的角色在召唤评论中互不评论（朋友圈默认互相不可见）；
 * 记忆同步改为先自动检查（是否有新行为、是否已写入事实记忆）再弹窗提醒用户，不自动执行，
 * 同步提示词可自定义；朋友圈总结功能合并进每个 char 的记忆挂载面板（per-char 配置与总结）；
 * AI 生图增加重新生成按钮，长按可预览发送给生图模型的提示词。
 * v1.1.0: 接入 Roche 生图配置（roche.ai.generateImage）；改为静默执行，不再把朋友圈内容直接注入聊天
 * 消息流，改为在用户向 AI 发送请求时自动注入朋友圈上下文（提醒 AI 可主动发圈/评论/点赞，含可编辑
 * 提示词）；新增朋友圈范围总结（第 N 条到第 M 条，含评论），总结结果可预览/编辑/取消/重新生成/保存，
 * 被总结范围隐藏原文只发送总结，其余朋友圈照常发送原文；新增主聊天工具 view_moments / post_moment /
 * comment_moment / like_moment，AI 角色发图时自动调用 Roche 生图配置生成图片；提示词可全量预览。
 * v0.8.8: 不再吞任何 click。长按后遮罩延迟 150ms 可点击，合成事件自然穿透。
 * v0.8.1: 关系网支持 user↔char 有向关系（user 可作为关系端点，下拉可选 user）；新增"记忆注入格式"自定义模板（变量 {now}/{userHandle}/{userName}/{charName}/{charHandle} 等，[label] 区分子类型，留空=内置默认，覆盖全部注入内容含 user 双名字认知行/开头/导语/5分类/结尾）
 * v0.8.0: 召唤评论实时注入短期记忆（无需关闭插件）；reply-to 白名单校验防幻觉前缀；unmount 多 char 注入持久化修复（syncstate 默认值+await 链）；氛围提示词标题显示 user 名；图形化蛛网关系网（user/char 身份设定+char 间有向关系+SVG 可视化+自动注入提示词）
 * v0.7.2: 轨迹记录补全被评论朋友圈内容（char 知道评论了哪条）；无新行为时不再注入空轨迹记录；拆分主动发圈(postEnabled)与参与评论(commentEnabled)双开关
 * v0.7.1: 顶栏"朋友圈"水平居中；侧边栏界面尺寸调整面板（顶栏高度+底部安全边距滑块实时预览，自动保存，全屏通用）；评论态滚动区底部让出输入栏高度防遮挡
 * v0.7: 召唤评论批量模型决策（人设+最近朋友圈+绑定记忆）；user双名字认知；buildActionSummary 5分类（新增②别人在我朋友圈互动+⑤别人@我）；心形点赞图标；封面图per-char/per-user；夜间模式；拆分enabled(发圈+评论)与memSync(记忆注入)
 * v0.6: 记忆/上下文加时间标签；氛围提示词（发圈/评论/NPC）；per-char NPC 系统（手动+AI生成）；buildActionSummary 4 分类修复人称矛盾
 * v0.5: char多评论+@提及；user@触发必定评论；"··"气泡定位修复+外部点击关闭；切换空间/主体抑制跳顶
 * v0.4: 修复滚动/弹窗关闭/发圈崩溃；侧边栏改双击顶栏触发；char发圈合并主动评论；触发评论隐晦化
 * v0.3: 拟真大改 + 修复发布失败/头像遮挡/文字图/局部loading/会话过滤/退出
 */
(function () {
  'use strict';

  // ========== 常量 ==========
  var PLUGIN_ID = 'roche-moments';
  var APP_ID = 'roche-moments-home';
  var ROOT_CLASS = 'roche-plugin-moments';
  var KEYS = {
    SPACES: 'moments:spaces', POSTS: 'moments:posts', NOTIFS: 'moments:notifs',
    SUBAPI: 'moments:subapi', SYNCSTATE: 'moments:syncstate',
    ACTIVE: 'moments:activeSpace', IMGCACHE: 'moments:imgcache', DARK: 'moments:dark', UIPREFS: 'moments:uiprefs',
    CHATCONF: 'moments:chatconf', SUMMARIES: 'moments:summaries'
  };
  // 默认聊天自动注入提示词（提醒 AI 角色可以主动发朋友圈/评论/点赞，可在插件内编辑）
  var DEFAULT_CHAT_REMINDER = '你是朋友圈的活跃用户：可以在合适的时机主动发布朋友圈、评论好友动态或给动态点赞（使用插件提供的主聊天工具完成，工具会自动同步到朋友圈，聊天里不用复述）。发布要像真实朋友圈：正文简短自然、避免重复刷屏；点赞是低成本互动，表示认可、有趣或关心；评论要有内容（回应、接梗或 @某人），不是每条动态都必须评论或点赞。朋友圈相关动作要符合你的人设和当前聊天语境。';
  // 默认总结提示词模板（可编辑；{from}/{to}/{count} 会被替换为实际范围）
  var DEFAULT_SUMMARY_PROMPT = '请用中文总结以下第 {from} 条到第 {to} 条朋友圈（共 {count} 条，含评论与点赞），字数控制在 200-400 字。概括核心事件、人物互动、情绪走向和值得记住的细节，保留关键人名、点赞者与时间顺序，输出一段连贯的总结，不要输出任何多余内容。';
  // 默认记忆同步提示词（可编辑；{charName} 会被替换为角色名）
  var DEFAULT_SYNC_PROMPT = '请把以下角色行为总结成一段简洁的事实记录，用于写入角色的长期记忆。用第三人称描述 {charName} 的行为；一段话，100 字以内。';
  // 默认关系网自动生成提示词（可编辑）
  var DEFAULT_RELATION_GEN_PROMPT = '请根据以上人物资料，设计他们之间真实可信、符合人设的关系网。\n严格按以下格式输出，不要多余内容：\n<relation from="发起人名字" to="对方名字" label="关系标签"></relation>\n（可重复多行）\n要求：\n1. 关系标签简短（2-6 字），如：已加好友、师父、恋人、死对头、青梅竹马、前任、上级下属、大学同学、同事、闺蜜等；\n2. 尽量覆盖 user 与每个 char 之间、以及 char 与 char 之间的关系；\n3. 重要：char 与 char 之间默认互相不可见朋友圈，只有标签包含「已加好友/好友」才互相可见；请为互有好感的 char 输出 label="已加好友"（也可写成「已加好友·恋人」等组合）；\n4. 若两人确实不认识、无交集，输出 label="陌生"；\n5. from/to 名字必须与上方列出的人名完全一致。';
  // 聊天注入中强调：发朋友圈时自动生成该角色绑定 NPC 的评论/点赞
  var DEFAULT_NPC_ACTION_NOTE = '【朋友圈生成规则】你发布朋友圈时，必须把这条朋友圈的“生态”考虑进去：该角色绑定的 NPC 好友会为它评论和点赞（NPC 的评论/点赞是朋友圈内容的一部分，能让关系更鲜活）。插件会自动生成并执行这些 NPC 评论/点赞，无需你在聊天里手动描述，但你在构思发圈内容时应默认存在 NPC 互动。';
  // 默认 NPC 生成提示词（只使用角色姓名，不使用账号名，避免 AI 混淆）
  var DEFAULT_NPC_GEN_PROMPT = '你是 NPC 生成器。根据以下 char 的人设，生成 4 个可能出现在该 char 朋友圈下的 NPC 好友。\n要求：\n1. **优先生成人设中已经出现/提到的人物**（如师父、闺蜜、家人、同事、青梅竹马等），名字尽量沿用或自然化，确保这些既定人物优先出现；\n2. 如果人设中没有既定的 NPC 人物，再自主生成符合该 char 人设与背景的 NPC；\n3. 每个 NPC 风格各异，名字自然，**只使用角色姓名，不要使用账号名**；\n4. bio 一句话人设；\n5. 若附加数据中包含「已绑定的 NPC」列表，请避免生成与之重复的 NPC（名字不要重复）。\n严格按格式输出，不要多余内容：\n<npc><name>名字</name><bio>一句话人设</bio></npc>\n（重复 4 次）';
  // 默认合并 NPC 提示词模板（变量未替换版本，{charName}/{npcList} 会在使用时替换）
  var DEFAULT_NPC_ROSTER_PROMPT = '你是「{charName}」朋友圈中的 NPC 好友。以下 NPC 都与「{charName}」认识，可以对 TA 发布的朋友圈进行评论/点赞：\n{npcList}';
  var DEFAULT_FEED_MAX = 12;
  var MIN_POST_INTERVAL = 30 * 60 * 1000;
  var JITTER = 0.2;
  var BG_CHECK_INTERVAL = 60 * 1000;
  var SYNC_PREFIX = '[RocheMomentsSync';
  var MAX_AUTO_COMMENT = 8;
  var DEFAULT_AUTO_COMMENT = 2;
  var NPC_COMMENT_PROBABILITY = 0.6;
  // 生成类提示词统一的「执行说明」：避免 AI 输出工具调用残留 / 复述 / 多余内容
  var GENERATED_ACTION_NOTE = '说明：你只需输出上方指定的标记（<post>/<comment>/<like>），插件会自动完成发布、评论、点赞并写入朋友圈；不要输出任何工具调用、XML 声明、解释或多余内容。';
  // char 朋友圈人设（全局，user 可自定义；默认留空=不注入）
  var DEFAULT_MOMENT_PERSONA = '';
  // 发圈规则（插件内生成时注入，强调发圈格式与点赞/评论原则）
  var DEFAULT_POST_RULES = '【发圈规则】\n1. 每一条朋友圈用独立的 <post> 块输出，正文只写一次，不要重复、不要汇总多条；\n2. 正文要像真实朋友圈：简短、自然、符合你的性格与当下心情；可配图但不要为了配图而配图；\n3. 评论/点赞原则：点赞是低成本互动，表示认可、有趣或关心，不一定非要评论；评论要有内容（回应、接梗、@某人），不要为了凑数而刷屏；不是每条动态都必须评论或点赞；\n4. 只输出规定的标记，不要输出任何解释、旁白、工具调用或 XML 声明。';
  var DEFAULT_COMMENT_PRINCIPLE = '【评论/点赞原则】\n点赞是低成本互动，表达认可、有趣或关心；评论要有内容，可以回应、接梗或 @某人，不要为了凑数而刷屏；不是每条动态都必须评论或点赞，符合人设与语境更重要。';
  // 默认「自动生成 char 朋友圈人设」提示词（per-char 可自定义；变量 {charName}/{userName}）
  var DEFAULT_MOMENT_GEN_PROMPT = '请根据以上「char 人设」与「挂载的会话聊天记录/记忆」，为 {charName} 生成一段「朋友圈人设」（2-4 句话，直接输出结果，不要多余内容）。\n朋友圈人设 = 该 char 在朋友圈这个场景里的长期行为性格：发圈频率与内容偏好、评论/点赞风格、与 user 及好友的互动方式等。\n要求：结合人设与记忆提炼出独特形象，不要照抄原文，语气自然。';
  // 批量私聊判断的共享规则（一次请求里对所有开启的 char 生效）
  var DEFAULT_DM_RULES = '请依据具体情况判断每个 char 是否需要主动私聊 user（私聊是只有 char 和 user 两人看到的对话，区别于朋友圈评论）：\n1. 若这条动态/评论值得该 char 私聊回应（值得关心、有趣、符合人设与关系、或有私下想说的话）→ 私聊；\n2. 若只是普通分享、没有值得说的内容、或此时私聊不符合该 char 与 user 的关系与氛围 → 不私聊；\n3. 私聊内容要自然、简短、符合该 char 人设，像真实微信私聊。';
  // 默认「发圈后主动私聊 user」判断提示词（per-char 可自定义；变量 {charName}/{userName}/{postText}/{commentText}/{activity}/{ts}）
  var DEFAULT_DM_PROMPT = '你是「{charName}」。{activity}\n请依据具体情况判断是否需要主动私聊 user（私聊是只有你和 user 两人看到的对话，区别于朋友圈评论）：\n1. 若这条动态/评论值得私聊回应（值得关心、有趣、和你的人设/关系相关，或有私下想说的话），就私聊；\n2. 若只是普通分享、没有值得说的内容，或此时私聊不符合你们的关系与氛围，就不要打扰；\n3. 私聊内容要自然、简短、符合你的人设，像真实微信私聊。\n严格按以下格式输出，不要多余内容：\n<dm>\n<should>1</should>   （1=私聊，0=不私聊）\n<text>私聊内容</text>   （should=1 时必须写；should=0 时省略 text）\n</dm>';

  // ========== 风车 SVG ==========
  function petal(deg, color) {
    return '<g transform="rotate(' + deg + ')"><ellipse cx="0" cy="-22" rx="7" ry="22" fill="' + color + '"/></g>';
  }
  var WINDMILL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g transform="translate(50,50)">' +
    petal(0, 'rgb(255,92,92)') + petal(45, 'rgb(255,169,77)') + petal(90, 'rgb(255,212,59)') +
    petal(135, 'rgb(105,219,124)') + petal(180, 'rgb(77,171,247)') + petal(225, 'rgb(116,143,252)') +
    petal(270, 'rgb(177,151,252)') + petal(315, 'rgb(255,107,157)') +
    '<circle r="6" fill="white"/></g></svg>';
  var WINDMILL_DATA_URI = 'data:image/svg+xml,' + WINDMILL_SVG.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, "'").replace(/#/g, '%23');

  // ========== 内嵌图标（线性，微信风格，currentColor）==========
  var ICON = {
    camera: '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M9 3l1.5 2h3L15 3h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4zm3 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>',
    more: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M5 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15.5 4L8 12l7.5 8V4z"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg>',
    like: '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
    comment: '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M4 4h16v12H8l-4 4V4z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M12 2a6 6 0 0 1 6 6v4l2 3H4l2-3V8a6 6 0 0 1 6-6zm-2 18h4a2 2 0 1 1-4 0z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"/></svg>',
    image: '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M3 4h18v16H3V4zm2 12l4-4 3 3 4-5 3 4V6H5v10zm3-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>',
    location: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M17.65 6.35A8 8 0 1 0 19.73 14h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
    del: '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>'
  };

  // ========== 工具函数 ==========
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function uuid() { return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function trim(s) { return (s || '').replace(/^\s+|\s+$/g, ''); }
  // 把可能已“脱管”的 post 对象重新解析为当前 state.posts 中的权威对象
  // （后台 loadAll 会替换 state.posts，异步流程持有的旧对象需重新定位，否则写入会丢失）
  function resolvePostRef(postObj) {
    if (!postObj) return null;
    for (var i = 0; i < state.posts.length; i++) {
      if (state.posts[i] === postObj) return postObj;
    }
    if (postObj.id) {
      for (var j = 0; j < state.posts.length; j++) {
        if (state.posts[j].id === postObj.id) return state.posts[j];
      }
    }
    return null;
  }
  // 回复评论的展示文本：若评论正文开头是「@回复对象名」则去掉，避免「小明 回复 小红：@小红 …」重复；
  // 若 @ 对象不是本条回复对象（或 @ 出现在别处）则原样保留。
  function displayCommentText(c) {
    var text = (c && c.text) || '';
    if (c && c.replyToName) {
      var t = trim(text);
      var esc = String(c.replyToName).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var m = t.match(new RegExp('^@' + esc + '[\\s\\uff0c，。.,:：]*'));
      if (m) text = t.slice(m[0].length);
    }
    return text;
  }
  function formatTime(ts) {
    var now = Date.now();
    var diff = now - ts;
    var d = new Date(ts);
    var today = new Date();
    if (diff < 60 * 1000) return '刚刚';
    if (diff < 60 * 60 * 1000) return Math.floor(diff / 60000) + '分钟前';
    if (d.toDateString() === today.toDateString()) return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    var yest = new Date(today); yest.setDate(yest.getDate() - 1);
    if (d.toDateString() === yest.toDateString()) return '昨天 ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    if (d.getFullYear() === today.getFullYear()) return (d.getMonth() + 1) + '月' + d.getDate() + '日';
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  }
  // 紧凑时间戳：MM-DD HH:MM（用于记忆轨迹与 AI 上下文时间标签）
  function formatStamp(ts) {
    var d = new Date(ts);
    return String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  function randomInterval(baseMin) {
    var base = baseMin * 60 * 1000;
    return Math.round(base + base * JITTER * (Math.random() * 2 - 1));
  }
  function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms || 0); });
  }
  function randPick(arr, n) {
    var copy = arr.slice(); var out = [];
    while (n-- > 0 && copy.length) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    return out;
  }

  // ========== 全局状态 ==========
  var cachedRoche = null;
  var root = null;
  var state = {
    spaces: [], posts: [], notifs: [], subapi: [], syncstate: {},
    activeSpaceId: null, currentSubject: 'user',
    sidebarOpen: false, postModalOpen: false, notifPanelOpen: false,
    subjectSheetOpen: false, memMountCharId: null, subApiPanelOpen: false,
    charListOpen: false, commentTarget: null, editPostId: null, editModalOpen: false, lpSheetOpen: false, lpTarget: null, darkMode: false, uiPrefsOpen: false,
    uiPrefs: { topbarH: 36, bottomPad: 80, sbH: 50, sbOff: 0 },
    moodPromptsOpen: false, npcModalCharId: null, npcPromptOpen: false, npcPromptCharId: null, npcPromptIdx: null, npcGenPromptOpen: false, npcGenPromptCharId: null, npcSuggestions: [], npcLoading: false,
    npcEditOpen: false, npcEditCharId: null, npcEditIdx: null,
    worldMountOpen: false, worldCats: [], worldLoading: false, worldMode: 'global', worldCharId: null,
    relationNetOpen: false,
    relGenLoading: false, relGenDraft: null, relPreviewOpen: false,
    promptPanelOpen: false, allPromptsOpen: false, _allPromptsCharId: null, _allPromptsCollapsed: {}, momentGenLoading: false, momentGenDraft: null, genLoading: null, _promptRuntime: null,
    coverModalOpen: false,
    syncFormatOpen: false, syncFormatCharId: null,
    summaryLoading: false, summaryDraft: null,
    sumFrom: 1, sumTo: 3, sumIncludeComments: true,
    imagePromptView: null, imageMenu: null, contentPreview: null, imageViewer: null,
    chatconf: { promptOnly: '', summaryPrompt: '', includeComments: true, maxFeed: DEFAULT_FEED_MAX, autoReply: true, imageMode: 'text', genInterval: 3000 },
    summaries: [],
    tip: null,            // 局部 loading 提示 {text}
    bootLoading: true,    // 首次加载全屏
    allChars: [], allPersonas: [], activePersona: null
  };
  var pendingImages = [];
  var _lpTimer = null;
  var _lpStartX = 0;
  var _lpStartY = 0;
  var _lpTouchActive = false;
  // 长按达到阈值后暂存的操作，延迟到 touchend 后执行 render
  // 关键：在 touch 序列进行中替换 root.innerHTML 会移除 touch target，
  // 导致安卓 WebView 不再合成 click 事件，后续所有点击失效（但滑动不受影响）
  var _pendingLpAction = null;

  // ========== Store ==========
  var Store = {
    _get: function (k, d) {
      var r = getRoche();
      if (!r || !r.storage || typeof r.storage.get !== 'function') return Promise.resolve(d);
      return r.storage.get(k).then(function (v) { return v == null ? d : v; });
    },
    _set: function (k, v) {
      var r = getRoche();
      if (!r || !r.storage || typeof r.storage.set !== 'function') return Promise.resolve();
      return r.storage.set(k, v);
    },
    loadAll: function () {
      return Promise.all([
        Store._get(KEYS.SPACES, []), Store._get(KEYS.POSTS, []), Store._get(KEYS.NOTIFS, []),
        Store._get(KEYS.SUBAPI, []), Store._get(KEYS.SYNCSTATE, {}), Store._get(KEYS.ACTIVE, null),
        Store._get(KEYS.DARK, false), Store._get(KEYS.UIPREFS, null),
        Store._get(KEYS.CHATCONF, null), Store._get(KEYS.SUMMARIES, [])
      ]).then(function (r) {
        state.spaces = r[0] || []; state.posts = r[1] || []; state.notifs = r[2] || [];
        state.subapi = r[3] || []; state.syncstate = (r[4] && typeof r[4] === 'object' && !Array.isArray(r[4])) ? r[4] : {}; state.activeSpaceId = r[5];
        state.darkMode = !!r[6];
        if (r[7] && typeof r[7] === 'object') {
          if (r[7].topbarH != null) state.uiPrefs.topbarH = parseInt(r[7].topbarH, 10) || 0;
          if (r[7].bottomPad != null) state.uiPrefs.bottomPad = r[7].bottomPad;
          if (r[7].sbH != null) state.uiPrefs.sbH = parseInt(r[7].sbH, 10) || 50;
          if (r[7].sbOff != null) state.uiPrefs.sbOff = parseInt(r[7].sbOff, 10) || 0;
        }
        state.chatconf = normalizeChatConf(r[8]);
        if (state.notifs.length > getNotifMax()) state.notifs.length = getNotifMax();
        // v2.0.2 迁移：旧版「发送图片模式」是 per-char 设置，现改为插件全局；
        // 若任一 char 曾设为识图，则全局默认迁移为识图（仅迁移一次）
        if (!r[8] || typeof r[8].imageMode === 'undefined') {
          var legacyVision = false;
          (state.spaces || []).forEach(function (sp) {
            (sp.chars || []).forEach(function (sc) { if (sc && sc.imageMode === 'vision') legacyVision = true; });
          });
          if (legacyVision) {
            state.chatconf.imageMode = 'vision';
            Store.saveChatConf();
          }
        }
        state.summaries = Array.isArray(r[9]) ? r[9] : [];
        if (!state.activeSpaceId && state.spaces.length) state.activeSpaceId = state.spaces[0].id;
        normalizeSpaces();
      });
    },
    saveDark: function () { return Store._set(KEYS.DARK, state.darkMode); },
    saveUiPrefs: function () { return Store._set(KEYS.UIPREFS, state.uiPrefs); },
    saveChatConf: function () { return Store._set(KEYS.CHATCONF, state.chatconf); },
    saveSummaries: function () { return Store._set(KEYS.SUMMARIES, state.summaries); },
    saveSpaces: function () { return Store._set(KEYS.SPACES, state.spaces); },
    savePosts: function () { return Store._set(KEYS.POSTS, state.posts); },
    saveNotifs: function () { return Store._set(KEYS.NOTIFS, state.notifs); },
    saveSubApi: function () { return Store._set(KEYS.SUBAPI, state.subapi); },
    saveSyncState: function () { return Store._set(KEYS.SYNCSTATE, state.syncstate); },
    saveActive: function () { return Store._set(KEYS.ACTIVE, state.activeSpaceId); },
    getActiveSpace: function () {
      for (var i = 0; i < state.spaces.length; i++) if (state.spaces[i].id === state.activeSpaceId) return state.spaces[i];
      return null;
    },
    addPost: function (p) { state.posts.push(p); state.posts.sort(function (a, b) { return b.createdAt - a.createdAt; }); return Store.savePosts(); },
    deletePost: function (id) { state.posts = state.posts.filter(function (p) { return p.id !== id; }); return Store.savePosts(); },
    updatePost: function (id, updates) {
      for (var i = 0; i < state.posts.length; i++) {
        if (state.posts[i].id === id) {
          for (var k in updates) { if (updates.hasOwnProperty(k)) state.posts[i][k] = updates[k]; }
          break;
        }
      }
      return Store.savePosts();
    },
    // 直接写入调用方持有的 post 对象（保证评论一定落在该条朋友圈上）；
    // 返回 Promise<boolean> 表示是否真正写入（写入成功才应生成通知）
    addComment: function (pid, c, postObj) {
      var target = resolvePostRef(postObj);
      if (!target && pid) {
        for (var i = 0; i < state.posts.length; i++) {
          if (state.posts[i].id === pid) { target = state.posts[i]; break; }
        }
      }
      var added = false;
      if (target) {
        if (!target.comments) target.comments = [];
        target.comments.push(c);
        added = true;
      }
      return Store.savePosts().then(function () { return added; });
    },
    deleteComment: function (postId, commentId) {
      for (var i = 0; i < state.posts.length; i++) {
        if (state.posts[i].id === postId) {
          if (state.posts[i].comments) {
            state.posts[i].comments = state.posts[i].comments.filter(function (c) { return c.id !== commentId; });
          }
          break;
        }
      }
      return Store.savePosts();
    },
    toggleLike: function (pid, who) {
      for (var i = 0; i < state.posts.length; i++) if (state.posts[i].id === pid) {
        var p = state.posts[i]; if (!p.likes) p.likes = [];
        var idx = -1;
        for (var j = 0; j < p.likes.length; j++) if (p.likes[j].id === who.id) { idx = j; break; }
        if (idx >= 0) p.likes.splice(idx, 1); else p.likes.push({ id: who.id, name: who.name, ts: Date.now() });
        break;
      }
      return Store.savePosts();
    },
    addNotif: function (n) { state.notifs.unshift(n); var maxN = getNotifMax(); if (state.notifs.length > maxN) state.notifs.length = maxN; return Store.saveNotifs(); },
    markAllNotifRead: function () { state.notifs.forEach(function (n) { n.read = true; }); return Store.saveNotifs(); },
    clearNotifs: function () { state.notifs = []; return Store.saveNotifs(); },
    getSyncTs: function (sid, cid) { return state.syncstate[sid + '_' + cid] || 0; },
    setSyncTs: function (sid, cid, ts) { state.syncstate[sid + '_' + cid] = ts; return Store.saveSyncState(); }
  };

  // ========== AI 路由（健壮化）==========
  function getActiveSubApi() {
    for (var i = 0; i < state.subapi.length; i++) if (state.subapi[i].enabled) return state.subapi[i];
    return null;
  }
  // 识图模式：把图片值转换为 data URI（已经是 data: 直接返回；http(s) 链接抓取后转 base64；
  // 转换失败返回 null，调用方回退到生图提示词文本，绝不把图片链接发给模型）
  function fetchImageAsDataUri(value) {
    if (!value) return Promise.resolve(null);
    if (/^data:image\//i.test(value)) return Promise.resolve(value);
    if (!/^https?:\/\//i.test(value)) return Promise.resolve(null);
    return fetch(value).then(function (res) {
      if (!res || !res.ok) return null;
      return res.blob();
    }).then(function (blob) {
      if (!blob) return null;
      return new Promise(function (resolve) {
        var fr = new FileReader();
        fr.onload = function () { resolve(fr.result); };
        fr.onerror = function () { resolve(null); };
        fr.readAsDataURL(blob);
      });
    }).catch(function () { return null; });
  }
  // 把图片本体附加到 messages 最后一个 user 消息（OpenAI 多模态 content 数组），
  // 实现「识图直接发送生成的图片给模型」，而不是发送图片链接
  function attachImagesToMessages(messages, images) {
    var msgs = (messages || []).slice();
    var userIdx = -1;
    for (var i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i] && msgs[i].role === 'user') { userIdx = i; break; }
    }
    if (userIdx < 0) return Promise.resolve(msgs);
    var chain = Promise.resolve([]);
    (images || []).forEach(function (im) {
      chain = chain.then(function (acc) {
        var v = (im && (im.value || im)) || '';
        return fetchImageAsDataUri(v).then(function (dataUri) {
          if (dataUri) acc.push({ type: 'image_url', image_url: { url: dataUri } });
          return acc;
        });
      });
    });
    return chain.then(function (imgBlocks) {
      if (!imgBlocks.length) return msgs;
      var m = msgs[userIdx];
      var textContent = (typeof m.content === 'string') ? m.content : ((m.content && m.content.text) || '');
      var blocks = [{ type: 'text', text: textContent }].concat(imgBlocks);
      msgs[userIdx] = { role: m.role, name: m.name, content: blocks };
      return msgs;
    });
  }
  function callAI(opts) {
    var images = (opts && opts.images) || [];
    var messages = (opts && opts.messages) || [];
    var temp = (opts && opts.temperature);
    var withImages = (images && images.length) ? attachImagesToMessages(messages, images) : Promise.resolve(messages);
    return withImages.then(function (msgs) {
      var preset = getActiveSubApi();
      if (preset) return callSubApi(preset, { messages: msgs, temperature: temp });
      var roche = getRoche();
      if (!roche || !roche.ai || typeof roche.ai.chat !== 'function') return Promise.reject(new Error('无可用 AI（未配置副 API 且 roche.ai.chat 不可用）'));
      var p;
      try { p = Promise.resolve(roche.ai.chat({ messages: msgs, temperature: temp })); }
      catch (e) { return Promise.reject(e); }
      return p.then(function (r) {
        if (r == null) return '';
        if (typeof r === 'string') return r;
        return r.text || r.content || r.message || r.output || '';
      });
    });
  }
  function callSubApi(preset, opts) {
    var url = trim(preset.url).replace(/\/+$/, '');
    return fetch(url + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + preset.apiKey },
      body: JSON.stringify({ model: preset.model, messages: opts.messages, temperature: opts.temperature == null ? 0.85 : opts.temperature, stream: false })
    }).then(function (res) {
      if (!res.ok) throw new Error('副 API 状态 ' + res.status);
      return res.json();
    }).then(function (data) {
      try { return data.choices[0].message.content || ''; } catch (e) { return ''; }
    });
  }
  function fetchModels(url, apiKey) {
    var u = trim(url).replace(/\/+$/, '');
    return fetch(u + '/models', { headers: { 'Authorization': 'Bearer ' + apiKey } })
      .then(function (res) { if (!res.ok) throw new Error('状态 ' + res.status); return res.json(); })
      .then(function (data) {
        var list = [];
        if (Array.isArray(data.data)) data.data.forEach(function (m) { if (m.id) list.push(m.id); });
        return list;
      });
  }

  // ========== 聊天配置 / 生图 ==========
  // 拿到当前可用的 Roche API：优先 mount 时传入的 scoped roche，其次 window.Roche
  function getRoche() {
    if (cachedRoche) return cachedRoche;
    if (typeof window !== 'undefined' && window.Roche) return window.Roche;
    return null;
  }
  // 通过 Roche 宿主弹窗/提示提醒 user（聊天中 char 发圈/评论/点赞时使用）
  function notifyUser(msg) {
    var roche = getRoche();
    if (!roche || !roche.ui) return;
    try {
      if (typeof roche.ui.toast === 'function') { roche.ui.toast(msg); return; }
      if (typeof roche.ui.confirm === 'function') { roche.ui.confirm({ title: '朋友圈提醒', message: msg }); return; }
    } catch (e) { /* 忽略宿主弹窗失败 */ }
  }
  function normalizeChatConf(c) {
    var base = { promptOnly: '', summaryPrompt: '', includeComments: true, maxFeed: DEFAULT_FEED_MAX, autoReply: true, imageMode: 'text', genInterval: 3000, dmDb: '', dmStore: '', dmVisibilityCheck: false, notifMax: 10 };
    if (!c || typeof c !== 'object') return base;
    var giRaw = parseInt(c.genInterval, 10);
    return {
      promptOnly: typeof c.promptOnly === 'string' ? c.promptOnly : '',
      summaryPrompt: typeof c.summaryPrompt === 'string' ? c.summaryPrompt : '',
      includeComments: c.includeComments !== false,
      autoReply: c.autoReply !== false,
      maxFeed: (parseInt(c.maxFeed, 10) || DEFAULT_FEED_MAX) > 0 ? (parseInt(c.maxFeed, 10) || DEFAULT_FEED_MAX) : DEFAULT_FEED_MAX,
      imageMode: c.imageMode === 'vision' ? 'vision' : 'text',
      genInterval: (!isNaN(giRaw)) ? Math.max(0, Math.min(60000, giRaw)) : 3000,
      dmDb: typeof c.dmDb === 'string' ? c.dmDb : '',
      dmStore: typeof c.dmStore === 'string' ? c.dmStore : '',
      dmVisibilityCheck: !!c.dmVisibilityCheck,
      notifMax: (parseInt(c.notifMax, 10) >= 1 && parseInt(c.notifMax, 10) <= 200) ? parseInt(c.notifMax, 10) : 10
    };
  }
  function getChatConf() { return normalizeChatConf(state.chatconf); }
  function getNotifMax() { var c = getChatConf(); var v = parseInt(c.notifMax, 10); return (!isNaN(v) && v >= 1 && v <= 200) ? v : 10; }
  function setGlobalImageMode(mode) {
    state.chatconf = getChatConf();
    state.chatconf.imageMode = mode === 'vision' ? 'vision' : 'text';
    return Store.saveChatConf();
  }
  // 调用 Roche 当前生图配置生成图片；返回图片 URL/DataURI 字符串
  function callGenerateImage(prompt) {
    var roche = getRoche();
    if (!roche || !roche.ai || typeof roche.ai.generateImage !== 'function') {
      return Promise.reject(new Error('Roche 生图不可用：请先在 Roche 设置中启用并配置生图'));
    }
    function generateOnce() {
    var p = String(prompt || '').slice(0, 500);
    return Promise.resolve(roche.ai.generateImage({ prompt: p })).then(function (r) {
        if (r == null) throw new Error('生图无返回');
        if (typeof r === 'string') return r;
        if (r.url || r.imageUrl) return r.url || r.imageUrl;
        if (r.data) return r.data;
        if (r.image) return r.image;
        if (r.output) return r.output;
        if (r.result) return r.result;
        if (r.b64 || r.base64) return 'data:image/png;base64,' + (r.b64 || r.base64);
        try { return JSON.stringify(r); } catch (e) { throw new Error('生图返回无法解析'); }
      });
    }
    return generateOnce().catch(function (err) {
      // 瞬时失败自动重试一次，减少“生图失败降级为文字图”的概率
      return new Promise(function (resolve) { setTimeout(resolve, 600); }).then(generateOnce).catch(function (e2) { throw (e2 || err); });
    });
  }
  // 把 post.images 里 type==='ai' 的图排队用 Roche 生图配置生成；
  // 多图自动排队，请求间隔由全局设置 genInterval 控制（默认 3000ms，0=不等待）；失败降级为文字图
  function resolvePostImages(post) {
    if (!post || !post.images || !post.images.length) return Promise.resolve(post);
    var aiIdx = [];
    post.images.forEach(function (im, i) { if (im.type === 'ai') aiIdx.push(i); });
    if (!aiIdx.length) return Promise.resolve(post);
    var genInterval = getChatConf().genInterval;
    var chain = Promise.resolve();
    aiIdx.forEach(function (i, k) {
      chain = chain.then(function () {
        if (k > 0 && genInterval > 0) return delay(genInterval).then(function () { return generateOneImage(post, i); });
        return generateOneImage(post, i);
      });
    });
    return chain.then(function () { return Store.savePosts(); }).then(function () { return post; });
  }
  function generateOneImage(post, i) {
      var im = post.images[i];
      im.loading = true; im.value = '';
      if (root) render();
      setImgLoadingUI(post.id, i, true);
      return callGenerateImage(im.prompt || im.value).then(function (url) {
        im.type = 'ai'; im.value = url; im.usedPrompt = im.prompt; im.loading = false; im.textContent = im.prompt || '';
      }).catch(function () {
        im.type = 'text'; im.loading = false; im.textContent = im.prompt || im.value; im.value = im.textContent;
      });
  }

  // ========== 人设/角色 ==========
  function refreshPersonas() {
    return cachedRoche.persona.getUserPersonas().then(function (list) {
      state.allPersonas = list || [];
      return cachedRoche.persona.getActiveUserPersona();
    }).then(function (ap) { state.activePersona = ap; return state.allPersonas; });
  }
  function refreshChars() { return cachedRoche.character.list().then(function (list) { state.allChars = list || []; return state.allChars; }); }
  function findChar(id) { for (var i = 0; i < state.allChars.length; i++) if (state.allChars[i].id === id) return state.allChars[i]; return null; }

  // ========== 空间/绑定 ==========
  function getSpaceChar(space, cid) {
    if (!space || !space.chars) return null;
    for (var i = 0; i < space.chars.length; i++) if (space.chars[i].charId === cid) return space.chars[i];
    return null;
  }
  function ensureSpaceForPersona(per) {
    for (var i = 0; i < state.spaces.length; i++) if (state.spaces[i].userPersonaId === per.id) return state.spaces[i];
    var sp = {
      id: 'sp_' + per.id + '_' + Date.now().toString(36),
      userPersonaId: per.id, userPersonaName: per.name || per.id,
      userPersonaHandle: per.handle || per.name || '', userPersonaAvatar: per.avatar || '',
      userPersonaBio: per.bio || '', cover: '', chars: [], createdAt: Date.now(),
      customPrompts: { charPost: '', charComment: '', npcComment: '', syncFormat: {}, charMomentPersona: '' },
      userIdentity: '', relations: []
    };
    state.spaces.push(sp); Store.saveSpaces(); return sp;
  }
  function bindCharToSpace(space, cid) {
    if (getSpaceChar(space, cid)) return;
    var c = findChar(cid); if (!c) return;
    space.chars.push({
      charId: c.id, charName: c.name || c.id, charHandle: c.handle || c.name || '',
      charAvatar: c.avatar || '', charPersona: c.persona || c.bio || '', charBio: c.bio || '',
      enabled: true, postEnabled: false, commentEnabled: true, memoryMounts: [], nextPostAt: 0, postIntervalMin: 30, npcSummon: true, npcPromptInject: true,
      autoCommentCount: DEFAULT_AUTO_COMMENT, lastSyncAt: 0, npcs: [], cover: '', memSync: true, customIdentity: '', momentPersona: '', momentGenPrompt: '', dmAfterPost: false, dmOnlyMentioned: false, dmPrompt: '', pendingDms: []
    });
    Store.saveSpaces();
  }
  function unbindCharFromSpace(space, cid) {
    space.chars = space.chars.filter(function (c) { return c.charId !== cid; });
    // 清理指向被解绑 char 的关系
    if (space.relations && space.relations.length) {
      space.relations = space.relations.filter(function (r) { return r.fromCid !== cid && r.toCid !== cid; });
    }
    Store.saveSpaces();
  }
  // 氛围提示词读取（防御旧数据）
  function getSpacePrompts(space) {
    if (!space || !space.customPrompts) return { charPost: '', charComment: '', npcComment: '', charMomentPersona: '' };
    var cp = space.customPrompts || {};
    return { charPost: cp.charPost || '', charComment: cp.charComment || '', npcComment: cp.npcComment || '', charMomentPersona: cp.charMomentPersona || '' };
  }
  // 氛围提示词行（user 设定，注入聊天上下文，AI 发圈/评论时遵循）
  function buildMoodPromptLine(space) {
    if (!space) return '';
    var sp = getSpacePrompts(space);
    var items = [];
    if (sp.charPost) items.push('· 发圈：' + sp.charPost);
    if (sp.charComment) items.push('· 评论：' + sp.charComment);
    if (sp.npcComment) items.push('· NPC 评论：' + sp.npcComment);
    if (!items.length) return '';
    return '【朋友圈氛围提示（user 设定，请遵循）】' + items.join('\n');
  }
  // char 朋友圈人设（per-char）：每个 char 可单独设置；该 char 做朋友圈相关操作（发圈/评论/召唤/NPC 评论）与聊天注入时自动注入；默认留空不注入
  function buildMomentPersonaLine(space, sc) {
    if (!sc) return '';
    var v = sc.momentPersona || '';
    if (!v) return '';
    return '【' + sc.charName + ' 朋友圈人设（user 设定，请遵循）】' + v;
  }
  // AI 自动生成 char 朋友圈人设：AI 可见该 char 的人设 + 挂载的会话聊天记录/记忆
  function generateMomentPersona(space, sc) {
    var c = findChar(sc.charId) || {};
    var persona = c.persona || c.bio || sc.charPersona || '';
    return Promise.all([loadMountedMemory(sc), loadUserPersonaText(space)]).then(function (r) {
      var mem = r[0]; var userPersona = r[1];
      var sys = '你是朋友圈人设生成助手。\n';
      sys += '当前 char：' + sc.charName + '\n';
      if (persona) sys += '\n【char 人设】\n' + persona + '\n';
      if (mem) sys += '\n【挂载的会话聊天记录/记忆】\n' + mem + '\n';
      if (userPersona) sys += '\n【当前 user 的人设】\n' + userPersona + '\n';
      var tpl = (sc.momentGenPrompt && trim(sc.momentGenPrompt)) ? sc.momentGenPrompt : DEFAULT_MOMENT_GEN_PROMPT;
      var userContent = tpl.replace(/\{charName\}/g, sc.charName || '').replace(/\{userName\}/g, space.userPersonaName || '');
      return callAI({ messages: [{ role: 'system', content: sys }, { role: 'user', content: userContent }], temperature: 0.9 }).then(function (raw) {
        return { charId: sc.charId, charName: sc.charName, text: trim(raw || ''), raw: raw || '' };
      });
    });
  }
  // AI 批量判断多个 char 是否需要主动私聊 user，并生成私聊内容（一次请求：判断提示词 + 各 char 人设一起发送）
  function judgeUserDmsBatch(space, candidates, activity) {
    var activityDesc = activity && activity.type === 'comment'
      ? 'user 在「' + (activity.postAuthorName || '') + '」的朋友圈「' + (activity.postText || '') + '」下评论：' + (activity.commentText || '')
      : 'user 刚发了一条朋友圈：「' + ((activity && activity.postText) || '') + '」';
    var sys = '你正在判断多个 char 是否需要主动私聊 user。\n\n';
    sys += '【背景】' + activityDesc + '\n\n';
    sys += '本次需要判断的 char（各自人设如下）：\n';
    candidates.forEach(function (sc) {
      var c = findChar(sc.charId) || {};
      var persona = (c.persona || c.bio || sc.charPersona || '').slice(0, 400);
      sys += '【' + sc.charName + '】\n';
      if (persona) sys += '人设：' + persona + '\n';
      var mpG = sc.momentPersona || '';
      if (mpG) sys += '朋友圈人设：' + mpG + '\n';
      if (sc.customIdentity) sys += '关系网身份：' + sc.customIdentity + '\n';
      if (sc.dmPrompt && trim(sc.dmPrompt)) sys += '该 char 的自定义判断要求：' + trim(sc.dmPrompt) + '\n';
      sys += '\n';
    });
    sys += '判断要求（每个 char 独立判断）：\n' + DEFAULT_DM_RULES + '\n';
    sys += '\n输出格式（严格遵守，不要多余内容）：\n';
    sys += '<dm author="角色名字">\n';
    sys += '<should>1</should> 或 <should>0</should>   （1=私聊，0=不私聊）\n';
    sys += '<text>私聊内容</text>   （should=1 时必须写；should=0 时省略）\n';
    sys += '</dm>\n';
    sys += '（每个 char 一个 <dm> 块；author 必须是上方列出的角色名字之一）';
    return callAI({ messages: [{ role: 'system', content: sys }, { role: 'user', content: '请判断并输出 <dm> 结果。' }], temperature: 0.8 }).then(function (raw) {
      return parseBatchDmResponse(raw || '');
    });
  }
  // 解析批量私聊判断输出：<dm author="名字"><should>1|0</should><text>…</text></dm>
  function parseBatchDmResponse(raw) {
    var text = trim(raw || '');
    var out = [];
    var re = /<dm\b([^>]*)>([\s\S]*?)<\/dm>/gi; var m;
    while ((m = re.exec(text))) {
      var attrs = m[1] || '';
      var author = trim((attrs.match(/author="([^"]*)"/) || [])[1] || '');
      var inner = m[2] || '';
      var sm = inner.match(/<should>\s*([01])\s*<\/should>/i);
      var tm = inner.match(/<text>([\s\S]*?)<\/text>/i);
      out.push({ name: author, should: sm ? (sm[1] === '1' ? 1 : 0) : 0, text: tm ? trim(tm[1]) : '' });
    }
    return out;
  }
  // user 发圈/评论后：对满足条件的 char 做一次批量 AI 判断，写入待私聊标记并返回接受私聊的 char 列表
  function triggerUserDmJudgments(space, activity) {
    if (!space || !activity) return Promise.resolve([]);
    var text = ((activity.type === 'comment' ? (activity.commentText || '') + ' ' : '') + (activity.postText || ''));
    var candidates = (space.chars || []).filter(function (sc) {
      if (!sc.dmAfterPost) return false;
      if (sc.dmOnlyMentioned && (!text || text.indexOf('@' + sc.charName) < 0)) return false;
      // 可见性过滤（评论触发 + user 开启时）：候选 char 必须能看见被评论的那条朋友圈（与作者互为好友/已加好友），否则绝不触发；
      // 例外：被评论的朋友圈就是该 char 自己发的（自己当然可见），不过滤
      if (activity.type === 'comment' && activity.postAuthorId && getChatConf().dmVisibilityCheck) {
        if (activity.postAuthorId !== sc.charId && !isFriendPair(space, sc.charId, activity.postAuthorId)) return false;
      }
      return true;
    });
    if (!candidates.length) return Promise.resolve([]);
    return judgeUserDmsBatch(space, candidates, activity).then(function (list) {
      var nameMap = {};
      candidates.forEach(function (sc) { nameMap[sc.charName] = sc; });
      var accepted = [];
      (list || []).forEach(function (r) {
        var sc = nameMap[r.name];
        if (!sc || !r.should || !r.text) return;
        if (!sc.pendingDms || !Array.isArray(sc.pendingDms)) sc.pendingDms = [];
        if (sc.pendingDms.length >= 20) sc.pendingDms.shift();
        sc.pendingDms.push({ postId: activity.postId || uuid(), postText: activity.postText || '', commentText: activity.commentText || '', text: r.text, ts: Date.now(), source: activity.type || 'post' });
        accepted.push(sc);
      });
      if (accepted.length) Store.saveSpaces();
      return accepted;
    }).catch(function (e) { console.warn('[Moments] 私聊批量判断失败', e); return []; });
  }
  // Roche 本体提示（toast；无 toast API 时用插件 toast 兜底）
  function rocheNotify(message) {
    var roche = getRoche();
    if (roche && roche.ui && typeof roche.ui.toast === 'function') {
      try { Promise.resolve(roche.ui.toast(message)).catch(function () { toast(message); }); return; } catch (e) {}
    }
    toast(message);
  }
  // 私聊直接写入：不弹确认框，直接写入聊天 IndexedDB，并弹 Roche 本体提示「XX 私信了您」
  function writeDmsDirect(space, accepted) {
    if (!accepted || !accepted.length) return Promise.resolve();
    var chain = Promise.resolve();
    accepted.forEach(function (sc) {
      chain = chain.then(function () {
        var last = sc.pendingDms && sc.pendingDms.length ? sc.pendingDms[sc.pendingDms.length - 1] : null;
        if (!last || !last.text) return Promise.resolve();
        var convId = resolveCharConversationId(space, sc);
        if (!convId) { toast(sc.charName + '：缺少会话，无法写入'); return; }
        return injectChatMessage(convId, last.text, { id: sc.charId, name: sc.charName }).then(function () {
          sc.pendingDms = [];
          return Store.saveSpaces();
        }).then(function () {
          // 弹 Roche 本体提示，提醒 user 有人私信了
          rocheNotify(sc.charName + ' 私信了您');
        }).catch(function (e) {
          toast(sc.charName + '：写入聊天失败：' + ((e && e.message) || '未知错误'));
          // 写入失败时移除这条失败的待私聊记录，避免持续累积（无重试入口，已 toast 提示）
          if (sc.pendingDms && sc.pendingDms.length) sc.pendingDms.pop();
          return Store.saveSpaces();
        });
      });
    });
    return chain;
  }
  // 找到该 char 的单聊会话 id：优先已启用挂载记忆的直接会话，其次 char 的 conversationId，再次对话缓存
  function resolveCharConversationId(space, sc) {
    if (!sc) return '';
    if (sc.memoryMounts && sc.memoryMounts.length) {
      for (var i = 0; i < sc.memoryMounts.length; i++) if (sc.memoryMounts[i].enabled && !sc.memoryMounts[i].isGroup) return sc.memoryMounts[i].conversationId;
      for (var k = 0; k < sc.memoryMounts.length; k++) if (!sc.memoryMounts[k].isGroup) return sc.memoryMounts[k].conversationId;
      return sc.memoryMounts[0].conversationId;
    }
    var c = findChar(sc.charId) || {};
    if (c.conversationId) return c.conversationId;
    if (sc._convCache && sc._convCache.length) {
      for (var j = 0; j < sc._convCache.length; j++) if (!sc._convCache[j].isGroup) return sc._convCache[j].id;
    }
    return sc.charId || '';
  }
  // 聊天 IndexedDB 私聊消息注入（按 Roche 实际结构：Roche_db / messages，记录含 senderId/senderName/isMe 等）
  function openRocheDb(conf) {
    var idb = (typeof window !== 'undefined' && (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB)) || (typeof indexedDB !== 'undefined' ? indexedDB : null);
    var dbName = (conf && conf.dmDb && trim(conf.dmDb)) || 'Roche_db';
    return new Promise(function (resolve, reject) {
      if (!idb) return reject(new Error('当前环境没有 IndexedDB'));
      var req = idb.open(dbName);
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error('打开 ' + dbName + ' 失败')); };
    });
  }
  function addRocheMsgRecord(db, store, msg) {
    return new Promise(function (resolve, reject) {
      var req = db.transaction(store, 'readwrite').objectStore(store).add(msg);
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error('写入 ' + store + ' 失败')); };
    });
  }
  // 按 Roche 实际结构注入私聊消息：Roche_db / messages（与官方同步方式一致）
  function injectChatMessage(conversationId, text, sender) {
    var conf = getChatConf() || {};
    var store = (conf.dmStore && trim(conf.dmStore)) || 'messages';
    var now = Date.now();
    var msg = {
      id: now + Math.floor(Math.random() * 1000),
      isMe: false,
      text: text,
      senderId: (sender && sender.id) || '',
      timestamp: now,
      senderName: (sender && sender.name) || '',
      conversationId: conversationId
    };
    if (String(conversationId).slice(-8) === '_offline') msg.isStreaming = false;
    return openRocheDb(conf).then(function (db) {
      return addRocheMsgRecord(db, store, msg).then(function (r) {
        db.close();
        return { db: db.name, store: store, mode: 'message', id: r };
      }, function (e) {
        db.close();
        throw e;
      });
    });
  }
  // NPC 提示词注入行：开启 sc.npcPromptInject 时，把该 char 的 NPC 提示词拼进聊天上下文
  function buildNpcPromptInjectLine(space, sc) {
    if (!space || !sc || !sc.npcPromptInject) return '';
    var roster = buildNpcRosterPrompt(space, sc);
    if (!roster) return '';
    return '【' + sc.charName + ' 的 NPC 提示词（user 设定，请遵循）】\n' + roster;
  }
  // 读取该 char 的自定义行为记录格式模板（留空 = 用内置默认）
  function getSyncFormatForChar(sc) {
    var empty = { header:'', userLine:'', intro:'', cat1:'', cat2:'', cat3:'', cat4:'', cat5:'', footer:'' };
    if (!sc || !sc.syncFormat || typeof sc.syncFormat !== 'object') return empty;
    var sf = sc.syncFormat || {};
    return {
      header: sf.header || '', userLine: sf.userLine || '', intro: sf.intro || '',
      cat1: sf.cat1 || '', cat2: sf.cat2 || '', cat3: sf.cat3 || '',
      cat4: sf.cat4 || '', cat5: sf.cat5 || '', footer: sf.footer || ''
    };
  }
  // 判断两个节点之间是否存在「陌生/不认识」关系（任一方向成立即视为互相不可见）
  function relBetween(space, a, b) {
    if (!space || !space.relations) return null;
    for (var i = 0; i < space.relations.length; i++) {
      var r = space.relations[i];
      if ((r.fromCid === a && r.toCid === b) || (r.fromCid === b && r.toCid === a)) return r;
    }
    return null;
  }
  // 可见性规则（v1.5.0 起）：
  // - char 与 char 之间默认不认识：朋友圈/评论/点赞互相不可见，只有关系标签含「好友/已加好友」才可见；
  // - user 与 char 之间默认可见，标注「陌生/不认识/不熟」才不可见。
  function isFriendPair(space, a, b) {
    var isUser = a === USER_NODE_ID || b === USER_NODE_ID;
    var r = relBetween(space, a, b);
    if (!r) return isUser;
    var label = r.label || '';
    if (label.indexOf('好友') >= 0) return true;
    if (isUser) return !(label.indexOf('陌生') >= 0 || label.indexOf('不认识') >= 0 || label.indexOf('不熟') >= 0);
    return false;
  }
  function isStrangerPair(space, a, b) {
    return !isFriendPair(space, a, b);
  }
  // 以某 char 的视角过滤朋友圈：陌生人的动态默认不可见（自己的动态始终可见）
  function filterVisiblePostsForChar(space, posts, charId) {
    if (!space || !charId) return (posts || []).slice();
    return (posts || []).filter(function (p) {
      if (p.authorType === 'char' && p.authorId === charId) return true;
      var authorNode = p.authorType === 'user' ? USER_NODE_ID : (p.authorId || '');
      return !isStrangerPair(space, charId, authorNode);
    });
  }
  // 解析 AI 生成关系网的输出（<relation from to label>）
  function parseRelationGenOutput(raw) {
    var items = [];
    var re = /<relation\b([^>]*?)(?:\/>|>([\s\S]*?)<\/relation>)/gi;
    var m;
    while ((m = re.exec(raw || ''))) {
      var attrs = m[1] || '';
      var fromName = trim((attrs.match(/from="([^"]*)"/) || [])[1] || '');
      var toName = trim((attrs.match(/to="([^"]*)"/) || [])[1] || '');
      var label = trim((attrs.match(/label="([^"]*)"/) || [])[1] || '') || trim(m[2] || '');
      if (fromName && toName && label) items.push({ fromName: fromName, toName: toName, label: label });
    }
    var seen = {}; var out = [];
    items.forEach(function (it) {
      var k = it.fromName + '||' + it.toName;
      if (seen[k]) {
        for (var i = 0; i < out.length; i++) {
          if (out[i].fromName === it.fromName && out[i].toName === it.toName) { out[i] = it; }
        }
      } else { seen[k] = true; out.push(it); }
    });
    return out;
  }
  // 模板变量替换：{varName} → vars[varName] || ''
  function applyTemplate(tpl, vars) {
    if (!tpl) return '';
    return tpl.replace(/\{(\w+)\}/g, function (m, k) {
      return (vars[k] != null) ? String(vars[k]) : '';
    });
  }
  // 解析 [标签] 行首标记的分类模板，返回 { like:'...', comment:'...', reply:'...', ... }
  function parseLabeledTemplate(tpl) {
    var out = {};
    (tpl || '').split('\n').forEach(function (line) {
      var m = line.match(/^\[(\w+)\]\s*(.*)$/);
      if (m) out[m[1]] = m[2];
    });
    return out;
  }
  // char 的 NPC 列表读取（防御旧数据）
  function getCharNpcs(sc) {
    if (!sc || !sc.npcs) return [];
    return sc.npcs || [];
  }
  // user 认知行：只使用 user 名字（不使用账号名，避免 AI 混淆）
  function userDualNameLine(space) {
    if (!space) return '';
    var n = space.userPersonaName || '';
    return '朋友圈空间主人是「' + n + '」。你在朋友圈 @ user 时使用 @' + n + '，在聊天里也称呼 ' + n + '。';
  }
  // 按 charId 查 charName
  function charNameById(space, cid) {
    if (!space || !space.chars) return '';
    for (var i = 0; i < space.chars.length; i++) {
      if (space.chars[i].charId === cid) return space.chars[i].charName;
    }
    return '';
  }
  // user 节点保留字 id（关系网中 user↔char 关系用此 id 标识 user 端）
  var USER_NODE_ID = '__user__';
  // 节点显示名：user 节点返回 user 名字，char 节点返回 charName（不使用 handle）
  function nodeDisplayName(space, cid) {
    if (cid === USER_NODE_ID) return space.userPersonaName || 'user';
    return charNameById(space, cid);
  }
  // 关系网提示词行：user 身份 + 各 char 身份 + 有向关系（可含 user↔char）
  function relationNetLine(space) {
    if (!space) return '';
    var parts = [];
    if (space.userIdentity) parts.push('user 身份：' + space.userIdentity);
    if (space.chars && space.chars.length) {
      var idParts = [];
      space.chars.forEach(function (sc) {
        if (sc.customIdentity) idParts.push(sc.charName + '：' + sc.customIdentity);
      });
      if (idParts.length) parts.push('char 身份：' + idParts.join('、'));
    }
    if (space.relations && space.relations.length) {
      var relParts = [];
      space.relations.forEach(function (r) {
        var fromName = nodeDisplayName(space, r.fromCid);
        var toName = nodeDisplayName(space, r.toCid);
        if (fromName && toName) relParts.push(fromName + '→' + toName + '（' + r.label + '）');
      });
      if (relParts.length) parts.push('关系：' + relParts.join('、'));
    }
    if (!parts.length) return '';
    return '【关系网（user 设定，请遵循）】' + parts.join('；') + '。';
  }
  // 旧数据兼容：补 customPrompts / npcs 字段
  function normalizeSpaces() {
    var dirty = false;
    (state.spaces || []).forEach(function (space) {
      if (!space.customPrompts || typeof space.customPrompts !== 'object') {
        space.customPrompts = { charPost: '', charComment: '', npcComment: '' };
        dirty = true;
      } else {
        var cp = space.customPrompts;
        if (cp.charPost == null) { cp.charPost = ''; dirty = true; }
        if (cp.charComment == null) { cp.charComment = ''; dirty = true; }
        if (cp.npcComment == null) { cp.npcComment = ''; dirty = true; }
        if (cp.relationGenPrompt == null) { cp.relationGenPrompt = ''; dirty = true; }
        if (cp.charMomentPersona == null) { cp.charMomentPersona = ''; dirty = true; }
      }
      // 关系网字段迁移
      if (space.userIdentity == null) { space.userIdentity = ''; dirty = true; }
      if (!space.relations || !Array.isArray(space.relations)) { space.relations = []; dirty = true; }
      // 收集当前 space 存在的 charId，清理指向已删除 char 的孤立关系
      var existIds = {};
      existIds[USER_NODE_ID] = true; // user 节点始终存在，user↔char 关系不应被误删
      (space.chars || []).forEach(function (sc) { existIds[sc.charId] = true; });
      var rawRels = space.relations || [];
      var cleanRels = rawRels.filter(function (r) {
        return r && r.id && r.fromCid && r.toCid && existIds[r.fromCid] && existIds[r.toCid];
      });
      if (cleanRels.length !== rawRels.length) { space.relations = cleanRels; dirty = true; }
      (space.chars || []).forEach(function (sc) {
        if (!sc.npcs || !Array.isArray(sc.npcs)) { sc.npcs = []; dirty = true; }
        if (sc.memSync == null) { sc.memSync = true; dirty = true; }
        if (sc.cover == null) { sc.cover = ''; dirty = true; }
        if (sc.customIdentity == null) { sc.customIdentity = ''; dirty = true; }
        // 拆分 enabled 为 postEnabled + commentEnabled；旧数据按原 enabled 值迁移
        if (sc.postEnabled == null) { sc.postEnabled = sc.enabled != null ? !!sc.enabled : false; dirty = true; }
        if (sc.commentEnabled == null) { sc.commentEnabled = sc.enabled != null ? sc.enabled : true; dirty = true; }
        // v1.2.0：per-char 总结/同步配置
        if (sc.summaryPrompt == null) { sc.summaryPrompt = ''; dirty = true; }
        if (sc.syncPrompt == null) { sc.syncPrompt = ''; dirty = true; }
        // 行为记录格式模板（per-char，留空 = 内置默认）
        if (sc.syncFormat == null || typeof sc.syncFormat !== 'object') { sc.syncFormat = {}; dirty = true; }
        ['header','userLine','intro','cat1','cat2','cat3','cat4','cat5','footer'].forEach(function (k) {
          if (sc.syncFormat[k] == null) { sc.syncFormat[k] = ''; dirty = true; }
        });
        // 迁移旧版 space 级 syncFormat（仅一次，且该 char 尚无自定义时）
        if (!sc._syncMigrated) {
          var legacySf = (space.customPrompts && space.customPrompts.syncFormat) || null;
          var sfKeys = ['header','userLine','intro','cat1','cat2','cat3','cat4','cat5','footer'];
          var hasLegacy = false;
          if (legacySf) sfKeys.forEach(function (k) { if (legacySf[k] != null && legacySf[k] !== '') hasLegacy = true; });
          if (hasLegacy) {
            sfKeys.forEach(function (k) {
              if ((!sc.syncFormat[k] || sc.syncFormat[k] === '') && legacySf[k] != null) sc.syncFormat[k] = legacySf[k];
            });
            dirty = true;
          }
          sc._syncMigrated = true; dirty = true;
        }
        if (sc.maxFeed == null) { sc.maxFeed = DEFAULT_FEED_MAX; dirty = true; }
        if (sc.includeComments == null) { sc.includeComments = true; dirty = true; }
        if (sc.imageMode == null) { sc.imageMode = 'text'; dirty = true; }
        if (!sc.summaries || !Array.isArray(sc.summaries)) { sc.summaries = []; dirty = true; }
        if (sc.sumFrom == null) { sc.sumFrom = 1; dirty = true; }
        if (sc.sumTo == null) { sc.sumTo = 3; dirty = true; }
        // NPC 是否参与「召唤评论」（该 char 发布的朋友圈被召唤时 NPC 一起评论）——默认开启
        if (sc.npcSummon == null) { sc.npcSummon = true; dirty = true; }
        // NPC 提示词是否注入该 char 聊天时的朋友圈提示词——默认开启
        if (sc.npcPromptInject == null) { sc.npcPromptInject = true; dirty = true; }
        // 挂载的会话记忆默认启用
        (sc.memoryMounts || []).forEach(function (m) {
          if (m.enabled == null) { m.enabled = true; dirty = true; }
        });
        // per-char 合并 NPC 提示词模板（留空 = 内置默认）
        if (sc.npcPrompt == null) { sc.npcPrompt = ''; dirty = true; }
        // NPC 生成提示词模板（留空 = 内置默认，只使用角色姓名）
        if (sc.npcGenPrompt == null) { sc.npcGenPrompt = ''; dirty = true; }
        // char 朋友圈人设（per-char，默认留空不注入；旧版全局值迁移为该 char 默认值，仅一次）
        if (sc.momentPersona == null) { sc.momentPersona = (space.customPrompts && space.customPrompts.charMomentPersona) || ''; dirty = true; }
        // 发圈后主动私聊 user（per-char 开关与提示词、待私聊标记）
        if (sc.dmAfterPost == null) { sc.dmAfterPost = false; dirty = true; }
        if (sc.dmOnlyMentioned == null) { sc.dmOnlyMentioned = false; dirty = true; }
        if (sc.dmPrompt == null) { sc.dmPrompt = ''; dirty = true; }
        if (!sc.pendingDms || !Array.isArray(sc.pendingDms)) { sc.pendingDms = []; dirty = true; }
        // 朋友圈人设生成提示词（per-char，留空=内置默认）
        if (sc.momentGenPrompt == null) { sc.momentGenPrompt = ''; dirty = true; }
        // 待私聊标记清理：丢弃过期(>7天)记录，并最多保留最近 20 条，防止写入失败后无限累积
        if (sc.pendingDms && Array.isArray(sc.pendingDms)) {
          var pdCut = Date.now() - 7 * 24 * 3600 * 1000;
          var pdBefore = sc.pendingDms.length;
          sc.pendingDms = sc.pendingDms.filter(function (pd) { return pd && pd.ts && pd.ts >= pdCut; });
          if (sc.pendingDms.length > 20) sc.pendingDms = sc.pendingDms.slice(-20);
          if (sc.pendingDms.length !== pdBefore) dirty = true;
        }
        // 局部世界书挂载（per-char，插件内生成时读取，聊天不注入）
        if (!sc.localWorldMounts || !Array.isArray(sc.localWorldMounts)) { sc.localWorldMounts = []; dirty = true; }
        // 每次主动发圈条数（1-9，默认 1）
        if (sc.postCount == null) { sc.postCount = 1; dirty = true; }
      });
      // 世界书挂载（空间级通用：插件内生成时读取，聊天不注入）
      if (!space.worldMounts || !Array.isArray(space.worldMounts)) { space.worldMounts = []; dirty = true; }
    });
    if (dirty) Store.saveSpaces();
  }

  // ========== 记忆加载（过滤防循环）==========
  function loadMountedMemory(sc) {
    if (!sc || !sc.memoryMounts || !sc.memoryMounts.length) return Promise.resolve('');
    var parts = [];
    var chain = Promise.resolve();
    sc.memoryMounts.forEach(function (m) {
      if (!m.enabled) return;
      chain = chain.then(function () {
        return cachedRoche.memory.getShortTerm({ conversationId: m.conversationId, limit: m.shortLimit || 50 }).then(function (msgs) {
          (msgs || []).forEach(function (msg) {
            if (msg && msg.text && String(msg.text).indexOf(SYNC_PREFIX) === 0) return;
            var who = msg.senderName || msg.senderHandle || (msg.isMe ? 'user' : '对方');
            if (msg.text) parts.push(who + '：' + msg.text);
          });
          if (m.factLimit || m.coreEnabled) return cachedRoche.memory.getLongTerm({ conversationId: m.conversationId, limit: m.factLimit || 50 });
          return null;
        }).then(function (lt) {
          if (!lt) return;
          if (m.coreEnabled && lt.core && lt.core.summary) parts.push('【核心记忆】' + lt.core.summary);
          if (m.factLimit && lt.facts) (lt.facts || []).forEach(function (f) {
            var t = f.summaryText || f.action || f.text || ''; if (t) parts.push('【事实】' + t);
          });
        }).catch(function () {});
      });
    });
    return chain.then(function () { return parts.join('\n'); });
  }

  // ========== 世界书读取（插件内生成时注入，聊天不注入）==========
  function extractEntryText(e) {
    if (!e) return '';
    return e.content || e.text || e.contentText || e.description || e.summary || '';
  }
  // 归一化世界书分类树：兼容数组 / {categories} / {data} 以及每类带 entries 的结构
  function normalizeWorldCategoryTree(tree) {
    var arr = Array.isArray(tree) ? tree : (tree && (tree.categories || tree.data || tree.list)) || [];
    if (!Array.isArray(arr)) arr = [];
    return arr.map(function (cat) {
      return {
        id: cat.id || cat.categoryId || cat.key || '',
        name: cat.name || cat.title || cat.label || (cat.id || ''),
        scope: cat.scope || 'global',
        entries: Array.isArray(cat.entries) ? cat.entries : []
      };
    }).filter(function (c) { return c.id; });
  }
  function loadWorldCategories() {
    var roche = getRoche();
    if (!roche || !roche.worldbook) return Promise.resolve([]);
    if (typeof roche.worldbook.getCategoryTree === 'function') {
      return Promise.resolve(roche.worldbook.getCategoryTree()).then(function (tree) {
        return normalizeWorldCategoryTree(tree);
      }).catch(function () {
        if (typeof roche.worldbook.list === 'function') {
          return Promise.resolve(roche.worldbook.list()).then(function (cats) {
            return normalizeWorldCategoryTree(cats);
          }).catch(function () { return []; });
        }
        return [];
      });
    }
    if (typeof roche.worldbook.list === 'function') {
      return Promise.resolve(roche.worldbook.list()).then(function (cats) {
        return normalizeWorldCategoryTree(cats);
      }).catch(function () { return []; });
    }
    return [];
  }
  // 读取指定 scope 的世界书词条（按 id 去重）
  function loadWorldEntries(categoryId, scopes) {
    var roche = getRoche();
    if (!roche || !roche.worldbook || typeof roche.worldbook.getEntries !== 'function') return Promise.resolve([]);
    if (!scopes || !scopes.length) scopes = ['global', 'local'];
    var acc = [];
    var seen = {};
    var chain = Promise.resolve();
    scopes.forEach(function (scope) {
      chain = chain.then(function () {
        return Promise.resolve(roche.worldbook.getEntries({ categoryId: categoryId, scope: scope })).then(function (es) {
          (Array.isArray(es) ? es : []).forEach(function (e) {
            var eid = e.id || e.title || e.name;
            if (!eid || seen[eid]) return;
            seen[eid] = true;
            e._scope = scope;
            acc.push(e);
          });
        }).catch(function () {});
      });
    });
    return chain.then(function () { return acc; });
  }
  // 实时读取单个挂载词条（全局+局部都尝试）；读不到时回退缓存文本
  function fetchWorldEntryLive(m) {
    var roche = getRoche();
    if (!roche || !roche.worldbook || typeof roche.worldbook.getEntries !== 'function') {
      return Promise.resolve(m.text || m.entryName || '');
    }
    var scopes = (m.scope === 'local') ? ['local'] : ['global'];
    var chain = Promise.resolve(null);
    scopes.forEach(function (scope) {
      chain = chain.then(function (found) {
        if (found) return found;
        return Promise.resolve(roche.worldbook.getEntries({ categoryId: m.categoryId, scope: scope })).then(function (entries) {
          var hit = null;
          (Array.isArray(entries) ? entries : []).forEach(function (e) {
            if (e.id === m.entryId || e.title === m.entryName || e.name === m.entryName) hit = e;
          });
          return hit;
        }).catch(function () { return null; });
      });
    });
    return chain.then(function (found) {
      return found ? extractEntryText(found) : (m.text || m.entryName || '');
    });
  }
  // 读取挂载词条的最新文本列表
  function fetchWorldTexts(mounts) {
    if (!mounts || !mounts.length) return Promise.resolve([]);
    var acc = [];
    var chain = Promise.resolve();
    mounts.forEach(function (m) {
      chain = chain.then(function () {
        return fetchWorldEntryLive(m).then(function (txt) { acc.push(txt); });
      });
    });
    return chain.then(function () { return acc.filter(Boolean); });
  }
  // 返回挂载世界书词条的合并文本（不含标题头，由调用方加标签）
  function loadWorldbookText(mounts) {
    if (!mounts || !mounts.length) return Promise.resolve('');
    return fetchWorldTexts(mounts).then(function (parts) {
      return parts.join('\n\n');
    });
  }
  // 读取当前选择的 user 人设文本（优先实时拉取完整 persona，回退空间缓存 bio）
  function loadUserPersonaText(space) {
    if (!space) return Promise.resolve('');
    var cached = space.userPersonaBio || '';
    var roche = getRoche();
    if (!roche || !roche.persona || typeof roche.persona.getUserPersonas !== 'function') return Promise.resolve(cached);
    return Promise.resolve(roche.persona.getUserPersonas()).then(function (list) {
      var found = null;
      (Array.isArray(list) ? list : []).forEach(function (p) { if (p.id === space.userPersonaId) found = p; });
      var persona = found && (found.persona || found.bio || '');
      return persona || cached;
    }).catch(function () { return cached; });
  }

  // ========== 当前主体 ==========
  function getCurrentSubject() {
    var space = Store.getActiveSpace(); if (!space) return null;
    if (state.currentSubject === 'user' || !state.currentSubject) {
      return { type: 'user', id: space.userPersonaId, name: space.userPersonaName || '', realName: space.userPersonaName, avatar: space.userPersonaAvatar, bio: space.userPersonaBio };
    }
    var sc = getSpaceChar(space, state.currentSubject); if (!sc) return null;
    return { type: 'char', id: sc.charId, name: sc.charName, realName: sc.charName, avatar: sc.charAvatar, bio: sc.charBio, spaceChar: sc };
  }

  // ========== CharPost ==========
  function parsePostContent(raw) {
    var text = raw || ''; var images = [];
    var imgBlock = text.match(/<images?>([\s\S]*?)<\/images?>/i);
    if (imgBlock) {
      var inner = imgBlock[1]; var re = /<img>([\s\S]*?)<\/img>/gi; var m;
      while ((m = re.exec(inner))) { var v = trim(m[1]); if (v) images.push({ type: 'text', value: v, textContent: v }); }
      if (!images.length) {
        inner.split(/\n/).map(function (s) { return trim(s); }).filter(Boolean).forEach(function (l) { images.push({ type: 'text', value: l, textContent: l }); });
      }
      text = text.replace(imgBlock[0], '');
    }
    var tBlock = text.match(/<text>([\s\S]*?)<\/text>/i);
    if (tBlock) text = tBlock[1];
    text = trim(text).replace(/<like>[\s\S]*?<\/like>/gi, '');
    return { text: text, images: images };
  }
  function generateCharPost(space, sc) {
    var c = findChar(sc.charId) || {};
    var persona = c.persona || c.bio || sc.charPersona || '';
    var myName = sc.charName;
    return Promise.all([loadMountedMemory(sc), loadWorldbookText(space.worldMounts || []), loadWorldbookText(sc.localWorldMounts || []), loadUserPersonaText(space)]).then(function (r) {
      var mem = r[0]; var worldG = r[1]; var worldL = r[2]; var userPersona = r[3];
      // 最近朋友圈与聊天注入配置保持一致：条数上限、包含评论/点赞、可见范围筛选、被总结范围只显示总结
      var scCfg = {
        promptOnly: '',
        summaryPrompt: sc.summaryPrompt || '',
        maxFeed: parseInt(sc.maxFeed, 10) || DEFAULT_FEED_MAX,
        includeComments: sc.includeComments !== false,
        imageMode: getChatConf().imageMode
      };
      var ctx = buildFeedContext(space, state.posts, sc.summaries || [], scCfg, sc.charId);
      var sys = '你是「' + sc.charName + '」，此刻正在刷微信朋友圈。\n';
      if (persona) sys += '\n你的人设：\n' + persona + '\n';
      if (sc.customIdentity) sys += '你在关系网中的身份：' + sc.customIdentity + '\n';
      if (mem) sys += '\n你最近的记忆与对话上下文（来自 Roche 聊天）：\n' + mem + '\n';
      if (worldG) sys += '\n【世界书（user 挂载 · 插件内生成）】\n' + worldG + '\n';
      if (worldL) sys += '\n【世界书（' + sc.charName + ' 挂载 · 插件内生成）】\n' + worldL + '\n';
      sys += '\n' + userDualNameLine(space) + '\n';
      if (userPersona) sys += '\n【当前 user 的人设】\n' + userPersona + '\n';
      var relLine = relationNetLine(space);
      if (relLine) sys += relLine + '\n';
      var prompts = getSpacePrompts(space);
      if (prompts.charPost) sys += '\n【发圈氛围提示（user 设定，请遵循）】' + prompts.charPost + '\n';
      var personaLineP = buildMomentPersonaLine(space, sc);
      if (personaLineP) sys += '\n' + personaLineP + '\n';
      if (ctx) sys += '\n' + ctx + '\n';
      // 可被 @ 的人名列表（user + 所有启用的 char）
      var mentionables = [];
      mentionables.push(space.userPersonaName || '');
      (space.chars || []).forEach(function (ch) { if (ch.postEnabled || ch.commentEnabled) mentionables.push(ch.charName); });
      sys += '\n可以 @ 的人：' + mentionables.join('、') + '（在评论里用 @名字 的形式提及）\n';
      var postCount = parseInt(sc.postCount, 10); if (isNaN(postCount) || postCount < 1) postCount = 1; if (postCount > 9) postCount = 9;
      sys += '\n' + DEFAULT_POST_RULES + '\n';
      sys += '\n现在请你做两件事：\n';
      sys += '1. 发 ' + postCount + ' 条属于你自己的朋友圈（' + (postCount > 1 ? '可以一次连续输出多条' : '只发一条') + '）\n';
      sys += '2. 根据你的兴趣和性格，从上面动态里挑 0-3 条去评论；也可以评论你自己刚发的最后一条\n';
      sys += '\n严格按以下格式输出，不要多余内容：\n';
      sys += '<post><text>你的朋友圈正文</text><images><img>图片1描述</img><img>图片2描述</img></images></post>\n';
      sys += '（共输出 ' + postCount + ' 个 <post> 块；配图能显著提升朋友圈的生动度与互动，请尽量为每条朋友圈配 1-3 张图；若配图，每行一个 <img> 生图提示词，插件会自动调用 Roche 生图配置生成图片）\n';
      sys += '<comment target="对方名字">你的评论</comment>   （可重复多行，target 填要评论的那条动态的作者名；评论自己刚发的就填 "' + myName + '"；评论正文里可以用 @名字 提及某人）\n';
      sys += '\n要求：第一人称「我」，符合人设口吻，简短自然，可以依据人设适当使用 emoji（不必刻意回避，也不要过度使用），避免强行加话题标签。@某人 用 @名字 形式写在评论正文里。';
      sys += '\n配图要求（重要）：尽量配 1-3 张；若配图，<images>/<img> 标签格式必须正确（每个 <img> 单独一行一个生图提示词），提示词要具体（主体、场景、风格、氛围），可直接用于生图模型；纯文字心情可以不配图。';
      sys += '\n' + GENERATED_ACTION_NOTE;
      return callAI({ messages: [{ role: 'system', content: sys }, { role: 'user', content: '发朋友圈，并评论你感兴趣的动态。' }], temperature: 0.9 });
    }).then(function (raw) {
      var postCount = parseInt(sc.postCount, 10); if (isNaN(postCount) || postCount < 1) postCount = 1; if (postCount > 9) postCount = 9;
      // 解析多条 <post> 块（块内支持 <text>/<images>）
      var blocks = [];
      var rePost = /<post>([\s\S]*?)<\/post>/gi;
      var mP;
      while ((mP = rePost.exec(raw || ''))) blocks.push(mP[1]);
      if (!blocks.length) blocks = [raw || ''];
      // 兼容旧格式：块外 <post-images> 用于第一条
      var legacyImages = [];
      var pimLegacy = raw.match(/<post-images?>([\s\S]*?)<\/post-images?>/i);
      if (pimLegacy) {
        var reImgL = /<img>([\s\S]*?)<\/img>/gi; var mIL;
        while ((mIL = reImgL.exec(pimLegacy[1]))) { var vL = trim(mIL[1]); if (vL) legacyImages.push({ type: 'ai', prompt: vL, textContent: vL }); }
      }
      var created = [];
      var saveChain = Promise.resolve();
      for (var bi = 0; bi < blocks.length && created.length < postCount; bi++) {
        (function (blk) {
          var parsed = parsePostContent(blk);
          var images = [];
          var hasImgTag = /<images?>[\s\S]*?<\/images?>/i.test(blk);
          if (hasImgTag) {
            parsed.images.forEach(function (im) { images.push({ type: 'ai', prompt: im.value || im.textContent, textContent: im.value || im.textContent }); });
          } else if (!images.length && created.length === 0) {
            images = legacyImages.slice();
          }
          var text = parsed.text;
          if (!text) text = '今天，又是普通的一天。';
          var post = {
            id: uuid(), spaceId: space.id, authorType: 'char', authorId: sc.charId,
            authorName: sc.charName, authorHandle: sc.charName, authorAvatar: sc.charAvatar,
            text: text, images: images, location: '', createdAt: Date.now(), likes: [], comments: []
          };
          created.push(post);
          saveChain = saveChain.then(function () {
            return Store.addPost(post).then(function () {
              Store.addNotif({ id: uuid(), spaceId: space.id, type: 'post', fromId: sc.charId, fromName: sc.charName, fromAvatar: sc.charAvatar, postId: post.id, postSnippet: (text || '').slice(0, 30), text: '发布了新朋友圈', createdAt: Date.now(), read: false });
              return post;
            }).then(function (saved) { return resolvePostImages(saved).then(function () { return saved; }); });
          });
        })(blocks[bi]);
      }
      if (!created.length) {
        var fbPost = { id: uuid(), spaceId: space.id, authorType: 'char', authorId: sc.charId, authorName: sc.charName, authorHandle: sc.charName, authorAvatar: sc.charAvatar, text: '今天，又是普通的一天。', images: [], location: '', createdAt: Date.now(), likes: [], comments: [] };
        created.push(fbPost);
        saveChain = saveChain.then(function () { return Store.addPost(fbPost).then(function () { return fbPost; }); });
      }
      return saveChain.then(function () {
        // 解析 <comment target=""> 并逐条保存；target=自己名字 → 最后一条
        var myLast = resolvePostRef(created[created.length - 1]) || created[created.length - 1];
        var commentRe = /<comment\b([^>]*)>([\s\S]*?)<\/comment>/gi;
        var cm; var cmChain = Promise.resolve();
        while ((cm = commentRe.exec(raw))) {
          (function (attrsStr, cmText) {
            cmChain = cmChain.then(function () {
              var cText = trim(cmText);
              if (!cText) return;
              var tName = trim((attrsStr.match(/target="([^"]*)"/) || [])[1] || '');
              var replyTo = trim((attrsStr.match(/reply-to="([^"]*)"/) || [])[1] || '');
              var target = null;
              if (tName === myName || tName === sc.charName) target = myLast;
              else if (tName) {
                var candidates = state.posts.filter(function (p) { return p.spaceId === space.id; });
                for (var i = 0; i < candidates.length; i++) {
                  var aName = candidates[i].authorName;
                  if (aName === tName) { target = candidates[i]; break; }
                }
              } else if (replyTo) {
                // 回复某人的评论：找到包含该评论者的朋友圈
                var rc = state.posts.filter(function (p) { return p.spaceId === space.id; });
                for (var ri = 0; ri < rc.length; ri++) {
                  var hasAuthor = false;
                  (rc[ri].comments || []).forEach(function (cmx) { if (cmx.authorName === replyTo || cmx.authorHandle === replyTo) hasAuthor = true; });
                  if (hasAuthor) { target = rc[ri]; break; }
                }
              }
              // 未指定 target 的评论默认评论自己刚发的最后一条，避免 AI 漏写属性导致评论丢失
              if (!target) target = myLast;
              var comment = { id: uuid(), postId: target.id, authorType: 'char', authorId: sc.charId, authorName: sc.charName, authorHandle: sc.charName, text: cText, replyTo: null, replyToName: replyTo || null, createdAt: Date.now() };
              return Store.addComment(target.id, comment, target).then(function (added) {
                if (added && target.id !== myLast.id) {
                  Store.addNotif({ id: uuid(), spaceId: space.id, type: 'comment', fromId: sc.charId, fromName: sc.charName, fromAvatar: sc.charAvatar, postId: target.id, postSnippet: (target.text || '').slice(0, 30), text: '评论：' + cText, createdAt: Date.now(), read: false });
                }
              });
            });
          })(cm[1], cm[2]);
        }
        return cmChain.then(function () {
          var npcChain = Promise.resolve();
          created.forEach(function (p) { npcChain = npcChain.then(function () { return triggerNpcComments(space, p, sc); }); });
          return npcChain.then(function () { return created; });
        });
      });
    });
  }

  // ========== 评论 ==========
  // 解析 AI 评论输出：支持多条 <comment reply-to="...">text</comment> + <like>
  function parseCommentResponse(raw) {
    var text = trim(raw || '');
    var liked = /<like>\s*1\s*<\/like>/i.test(text);
    var comments = [];
    var re = /<comment(?:\s+reply-to="([^"]*)")?>([\s\S]*?)<\/comment>/gi;
    var m;
    while ((m = re.exec(text))) {
      var replyTo = trim(m[1] || '');
      var cText = trim(m[2] || '');
      if (cText) comments.push({ text: cText, replyToName: replyTo || null });
    }
    // 兼容旧格式：无 <comment> 标签时把整段当一条
    if (!comments.length) {
      var bare = trim(text.replace(/<like>[\s\S]*?<\/like>/gi, ''));
      // 防护：若输出其实是发圈/生图格式（含 <post>/<images>/<text>），不要误当评论文本
      if (bare && !/<post[\s\S]*?<\/post>/i.test(bare) && !/<images?>[\s\S]*?<\/images?>/i.test(bare) && !/<text>[\s\S]*?<\/text>/i.test(bare)) {
        comments.push({ text: bare, replyToName: null });
      }
    }
    return { comments: comments, liked: liked };
  }
  // 解析批量评论输出（author + reply-to 属性）：<comment author="名字" reply-to="...">text</comment>、<like author="名字">1</like>
  function parseBatchCommentResponse(raw) {
    var text = trim(raw || '');
    var comments = [];
    var cmRe = /<comment\b([^>]*)>([\s\S]*?)<\/comment>/gi; var m;
    while ((m = cmRe.exec(text))) {
      var attrs = m[1] || '';
      var authorNm = trim((attrs.match(/author="([^"]*)"/) || [])[1] || '');
      var replyTo = trim((attrs.match(/reply-to="([^"]*)"/) || [])[1] || '');
      var cText = trim(m[2] || '');
      if (cText) comments.push({ name: authorNm, replyToName: replyTo || null, text: cText });
    }
    var likes = [];
    var lkRe = /<like\b([^>]*)>\s*1\s*<\/like>/gi;
    while ((m = lkRe.exec(text))) {
      var lh = trim(((m[1] || '').match(/author="([^"]*)"/) || [])[1] || '');
      if (lh) likes.push(lh);
    }
    // 兼容旧格式：无 author 属性时全归第一个候选
    if (!comments.length) {
      var bare = trim(text.replace(/<like[\s\S]*?<\/like>/gi, ''));
      if (bare) comments.push({ name: '', replyToName: null, text: bare });
    }
    return { comments: comments, likes: likes };
  }
  // 检测文本里 @了哪些 char（只按角色姓名匹配，不使用 handle）
  function detectMentionedChars(space, text) {
    var ids = [];
    if (!text) return ids;
    (space.chars || []).forEach(function (sc) {
      if (!sc.commentEnabled) return;
      var names = [sc.charName].filter(Boolean);
      for (var i = 0; i < names.length; i++) {
        if (text.indexOf('@' + names[i]) >= 0) { ids.push(sc.charId); break; }
      }
    });
    return ids;
  }
  // 扫描某条动态下所有 user 评论里 @了哪些 char（用于触发必定评论）
  function detectMentionedCharsFromPost(space, post) {
    var ids = [];
    if (!post || !post.comments) return ids;
    (post.comments || []).forEach(function (c) {
      if (c.authorType === 'user' && c.text) {
        detectMentionedChars(space, c.text).forEach(function (cid) {
          if (ids.indexOf(cid) < 0) ids.push(cid);
        });
      }
    });
    return ids;
  }
  function generateSingleComment(space, post, sc, mode, replyTarget, prevComments) {
    var authorNode = post.authorType === 'user' ? USER_NODE_ID : (post.authorId || '');
    // 关系网标注「陌生/不认识」：双方朋友圈默认互相不可见，不评论
    if (authorNode && sc.charId !== authorNode && isStrangerPair(space, sc.charId, authorNode)) {
      return Promise.resolve({ comments: [], liked: false, sc: sc });
    }
    var c = findChar(sc.charId) || {};
    var persona = c.persona || c.bio || sc.charPersona || '';
    // 可被 @ 的人名列表（user + 所有启用的 char）
    var mentionables = [];
    mentionables.push(space.userPersonaName || '');
    (space.chars || []).forEach(function (ch) { if (ch.postEnabled || ch.commentEnabled) mentionables.push(ch.charName); });
    return Promise.all([loadMountedMemory(sc), loadWorldbookText(space.worldMounts || []), loadWorldbookText(sc.localWorldMounts || []), loadUserPersonaText(space)]).then(function (r) {
      var mem = r[0]; var worldG = r[1]; var worldL = r[2]; var userPersona = r[3];
      var sys = '你是「' + sc.charName + '」，正在看「' + (post.authorName || '') + '」的微信朋友圈。\n';
      if (persona) sys += '\n你的人设：\n' + persona + '\n';
      if (sc.customIdentity) sys += '你在关系网中的身份：' + sc.customIdentity + '\n';
      var prompts = getSpacePrompts(space);
      if (prompts.charComment) sys += '\n【评论氛围提示（user 设定，请遵循）】' + prompts.charComment + '\n';
      var personaLineC = buildMomentPersonaLine(space, sc);
      if (personaLineC) sys += '\n' + personaLineC + '\n';
      if (mem) sys += '\n你最近的记忆上下文：\n' + mem + '\n';
      if (worldG) sys += '\n【世界书（user 挂载 · 插件内生成）】\n' + worldG + '\n';
      if (worldL) sys += '\n【世界书（' + sc.charName + ' 挂载 · 插件内生成）】\n' + worldL + '\n';
      var relLine = relationNetLine(space);
      if (relLine) sys += relLine + '\n';
      if (userPersona) sys += '\n【当前 user 的人设】\n' + userPersona + '\n';
      // 该 char 可见的朋友圈上下文（有总结只发总结），与聊天注入一致
      var scCfgS = { promptOnly: '', summaryPrompt: sc.summaryPrompt || '', maxFeed: parseInt(sc.maxFeed, 10) || DEFAULT_FEED_MAX, includeComments: sc.includeComments !== false, imageMode: getChatConf().imageMode };
      var feedS = buildFeedContext(space, state.posts, sc.summaries || [], scCfgS, sc.charId);
      if (feedS) sys += '\n【你可见的朋友圈上下文】\n' + feedS + '\n';
      sys += '\n这条朋友圈内容：\n' + (post.text || '(仅图片)') + '\n';
      // AI 默认可见生图提示词/图片描述，据此评论点赞（bug 修复：不再默认"没发图片"）
      var imgDesc1 = describePostImages(post, 'text');
      if (imgDesc1) sys += '（图片：' + imgDesc1 + '）\n';
      sys += post.authorType === 'user' ? '发朋友圈的是 user（' + (space.userPersonaName || '') + '）。\n' : '发朋友圈的是 ' + (post.authorName || '') + '（和你一样是 char）。\n';
      if (prevComments && prevComments.length) {
        sys += '\n已有评论（你可以看到，可回复其中某人，也可 @某人）：\n';
        prevComments.forEach(function (pc) { sys += '- ' + (pc.authorName || '') + '：' + pc.text + (pc.replyToName ? ' （回复 ' + pc.replyToName + '）' : '') + '\n'; });
      }
      sys += '\n可以 @ 的人：' + mentionables.join('、') + '（在评论里用 @名字 的形式提及）\n';
      if (mode === 'reply' && replyTarget) {
        sys += '\n本次主要是回复「' + replyTarget.name + '」的评论。你也可以额外评论朋友圈本身。\n';
      }
      sys += '\n请以你的身份评论。可以写 1-3 条：评论朋友圈本身、回复已有评论里的某人、@某人都可以。\n';
      sys += '\n' + DEFAULT_COMMENT_PRINCIPLE + '\n';
      sys += '\n输出格式（严格遵守，不要多余内容）：\n';
      sys += '<comment reply-to="被回复人名字">评论正文</comment>   （reply-to 可选，回复某人评论时填那人名字；不回复就省略整个 reply-to 属性。可输出多条）\n';
      sys += '<like>1</like> 或 <like>0</like>   （放末尾，1 表示顺便给这条朋友圈点赞，0 表示不点）\n';
      sys += '\n要求：第一人称「我」，符合人设口吻，每条 1-2 句，简短自然，可以依据人设适当使用 emoji（不必刻意回避，也不要过度使用），避免强行加话题标签。@某人 用 @名字 形式写在评论正文里。';
      sys += '\n注：reply-to 只能填上方「已有评论」里出现过的评论者名字；若只是评论朋友圈本身则必须省略 reply-to。user 未评论时绝对不能填 user 的名字。';
      sys += '\n重要：回复某人评论时必须带 reply-to="被回复人名字"，展示为「小明 回复 小红：…」；回复正文里不要再写 @被回复人 的名字。';
      sys += '\n' + GENERATED_ACTION_NOTE;
      var callOpts1 = { messages: [{ role: 'system', content: sys }, { role: 'user', content: '写评论。' }], temperature: 0.9 };
      // 识图模式：把图片本体直接附加给模型（不发送图片链接）
      if (getChatConf().imageMode === 'vision' && post.images && post.images.length) callOpts1.images = post.images;
      return callAI(callOpts1);
    }).then(function (raw) {
      var p = parseCommentResponse(raw);
      var out = [];
      // 构建 reply-to 白名单：只能回复已有评论中出现过的评论者
      var replyWhitelist = {};
      (prevComments || []).forEach(function (pc) {
        if (pc.authorHandle) replyWhitelist[pc.authorHandle] = true;
        if (pc.authorName) replyWhitelist[pc.authorName] = true;
      });
      (p.comments || []).forEach(function (pc) {
        // 校验模型输出的 replyToName：不在白名单则清空（防止幻觉编造评论者）
        var modelRt = pc.replyToName || null;
        if (modelRt && !replyWhitelist[modelRt]) modelRt = null;
        out.push({
          id: uuid(), postId: post.id, authorType: 'char', authorId: sc.charId,
          authorName: sc.charName, authorHandle: sc.charName,
          text: pc.text,
          replyTo: (mode === 'reply' && replyTarget && replyTarget.commentId) || null,
          replyToName: (mode === 'reply' && replyTarget && replyTarget.name) || modelRt || null,
          createdAt: Date.now()
        });
      });
      if (!out.length) out.push({ id: uuid(), postId: post.id, authorType: 'char', authorId: sc.charId, authorName: sc.charName, authorHandle: sc.charName, text: '…', replyTo: (replyTarget && replyTarget.commentId) || null, replyToName: (replyTarget && replyTarget.name) || null, createdAt: Date.now() });
      return { comments: out, liked: p.liked, sc: sc };
    });
  }
  // per-char 合并 NPC 提示词：介绍该 char 所有绑定 NPC（名字/人设），说明可对 TA 的朋友圈评论/点赞
  // 自定义模板可用变量 {charName} {npcList}；留空 = 内置默认
  function buildNpcRosterPrompt(space, sc) {
    if (!space || !sc) return '';
    var npcs = getCharNpcs(sc);
    if (!npcs.length) return '';
    var npcList = npcs.map(function (npc) {
      return '· ' + npc.name + '：' + (npc.bio || '人设未设定');
    }).join('\n');
    if (sc.npcPrompt && trim(sc.npcPrompt)) {
      return sc.npcPrompt.replace(/\{charName\}/g, sc.charName).replace(/\{npcList\}/g, npcList);
    }
    return DEFAULT_NPC_ROSTER_PROMPT.replace(/\{charName\}/g, sc.charName).replace(/\{npcList\}/g, npcList);
  }
  // NPC 评论生成（氛围组：NPC 是 char 的好友，只在 char 发圈时评论其动态，不挂 Roche 会话记忆）
  // 批量版：所有参与 NPC 打包进一次 AI 请求生成评论/点赞（保留概率过滤与失败兜底）
  function buildNpcCommentSys(space, post, sc, npcs, prevComments) {
    var sys = buildNpcRosterPrompt(space, sc);
    // NPC 可见 char 的人设（persona/bio），评论更贴合
    var cNpc = findChar(sc.charId) || {};
    var personaNpc = cNpc.persona || cNpc.bio || sc.charPersona || '';
    if (personaNpc) sys += '\n你的好友「' + sc.charName + '」的人设：\n' + personaNpc + '\n';
    var personaLineN = buildMomentPersonaLine(space, sc);
    if (personaLineN) sys += '\n' + personaLineN + '\n';
    // 发圈 char 可见的朋友圈上下文（有总结只发总结），NPC 作为其好友可见
    var scCfgNpc = { promptOnly: '', summaryPrompt: sc.summaryPrompt || '', maxFeed: parseInt(sc.maxFeed, 10) || DEFAULT_FEED_MAX, includeComments: sc.includeComments !== false, imageMode: getChatConf().imageMode };
    var feedNpc = buildFeedContext(space, state.posts, sc.summaries || [], scCfgNpc, sc.charId);
    if (feedNpc) sys += '\n【' + sc.charName + ' 可见的朋友圈上下文】\n' + feedNpc + '\n';
    var prompts = getSpacePrompts(space);
    if (prompts.npcComment) sys += '\n【评论氛围提示（user 设定，请遵循）】' + prompts.npcComment + '\n';
    sys += '\n这条朋友圈内容：\n' + (post.text || '(仅图片)') + '\n';
    var imgDescNpc = describePostImages(post, 'text');
    if (imgDescNpc) sys += '（图片：' + imgDescNpc + '）\n';
    sys += '发朋友圈的是你的好友「' + sc.charName + '」。\n';
    if (prevComments && prevComments.length) {
      sys += '\n已有评论（你可以看到）：\n';
      prevComments.forEach(function (pc) { sys += '- ' + (pc.authorName || '') + '：' + pc.text + (pc.replyToName ? ' （回复 ' + pc.replyToName + '）' : '') + '\n'; });
    }
    sys += '\n本次参与评论的 NPC：\n';
    npcs.forEach(function (npc) { sys += '- ' + npc.name + '：' + (npc.bio || '人设未设定') + '\n'; });
    sys += '\n' + DEFAULT_COMMENT_PRINCIPLE + '\n';
    sys += '\n请以每个 NPC 的身份各写 1 条评论（列出的每个 NPC 都要写），可以给这条朋友圈点赞。评论要符合各 NPC 的人设口吻，简短自然（1-2 句），避免刷屏。\n';
    sys += '\n输出格式（严格遵守，不要多余内容）：\n';
    sys += '<comment author="NPC名字">评论正文</comment>\n';
    sys += '<like author="NPC名字">1</like> 或 <like author="NPC名字">0</like>   （每个 NPC 放一行在末尾；1 表示该 NPC 顺便点赞，0 表示不点）\n';
    sys += '\n要求：第一人称「我」，符合人设口吻，1-2 句，可以依据人设适当使用 emoji（不必刻意回避，也不要过度使用），避免强行加话题标签。';
    sys += '\n' + GENERATED_ACTION_NOTE;
    return sys;
  }
  // 批量生成所有参与 NPC 的评论/点赞（一次 AI 请求）
  function generateNpcCommentsBatch(space, post, sc, npcs, prevComments) {
    var sys = buildNpcCommentSys(space, post, sc, npcs, prevComments);
    var callOptsNpc = { messages: [{ role: 'system', content: sys }, { role: 'user', content: '所有 NPC 写评论。' }], temperature: 0.9 };
    // 识图模式：把图片本体直接附加给模型（不发送图片链接）
    if (getChatConf().imageMode === 'vision' && post.images && post.images.length) callOptsNpc.images = post.images;
    return callAI(callOptsNpc).then(function (raw) {
      var parsed = parseBatchCommentResponse(raw || '');
      var nameMap = {};
      npcs.forEach(function (npc) { nameMap[npc.name] = npc; });
      var out = [];
      parsed.comments.forEach(function (pc) {
        var npc = nameMap[pc.name];
        if (!npc) return;
        out.push({
          id: uuid(), postId: post.id, authorType: 'npc', authorId: 'npc_' + npc.id,
          authorName: npc.name, authorHandle: npc.name,
          text: pc.text, replyTo: null, replyToName: pc.replyToName || null, createdAt: Date.now()
        });
      });
      // 兜底：每个参与的 NPC 都应有 1 条评论（保持原单 NPC 逻辑的兜底语义）
      npcs.forEach(function (npc) {
        var has = false;
        for (var i = 0; i < out.length; i++) if (out[i].authorId === 'npc_' + npc.id) { has = true; break; }
        if (!has) out.push({ id: uuid(), postId: post.id, authorType: 'npc', authorId: 'npc_' + npc.id, authorName: npc.name, authorHandle: npc.name, text: '…', replyTo: null, replyToName: null, createdAt: Date.now() });
      });
      var likedIds = {};
      parsed.likes.forEach(function (nm) { var npc = nameMap[nm]; if (npc) likedIds[npc.id] = true; });
      return { comments: out, likedIds: likedIds, npcs: npcs };
    });
  }
  // 触发 NPC 评论：只在 char 发圈后调用；先按概率过滤，再对所有参与 NPC 发一次批量请求生成评论/点赞
  function triggerNpcComments(space, post, sc) {
    var npcs = getCharNpcs(sc);
    if (!npcs.length) return Promise.resolve();
    var pRef = resolvePostRef(post);
    if (!pRef) return Promise.resolve();
    post = pRef;
    var prevComments = (post.comments || []).slice();
    // 概率过滤（保留原逻辑）：仅参与概率内的 NPC 进入本次批量请求
    var participants = npcs.filter(function (npc) { return Math.random() < NPC_COMMENT_PROBABILITY; });
    if (!participants.length) return Promise.resolve();
    return generateNpcCommentsBatch(space, post, sc, participants, prevComments).then(function (r) {
      var saveChain = Promise.resolve();
      (r.comments || []).forEach(function (comment) {
        prevComments.push(comment);
        saveChain = saveChain.then(function () {
          return Store.addComment(post.id, comment, post).then(function (added) {
            if (added) {
              var npc = null;
              for (var i = 0; i < r.npcs.length; i++) if (r.npcs[i].id === comment.authorId.replace('npc_', '')) { npc = r.npcs[i]; break; }
              return Store.addNotif({ id: uuid(), spaceId: space.id, type: 'comment', fromId: comment.authorId, fromName: comment.authorName, fromAvatar: (npc && npc.avatar) || '', postId: post.id, postSnippet: (post.text || '').slice(0, 30), text: '评论：' + comment.text, createdAt: Date.now(), read: false });
            }
          });
        });
      });
      // 点赞
      Object.keys(r.likedIds || {}).forEach(function (npcId) {
        var has = false;
        for (var i = 0; i < post.likes.length; i++) if (post.likes[i].id === 'npc_' + npcId) { has = true; break; }
        if (!has) {
          var npcL = null;
          for (var i = 0; i < r.npcs.length; i++) if (r.npcs[i].id === npcId) { npcL = r.npcs[i]; break; }
          post.likes.push({ id: 'npc_' + npcId, name: (npcL && npcL.name) || npcId, ts: Date.now() });
        }
      });
      return saveChain.then(function () { return Store.savePosts(); });
    }).catch(function (e) { console.warn('[Moments] NPC 批量评论失败', e); });
  }

  // 容错：单个 char 失败不中断；forceCharIds 为必定参与评论的 char（user @触发）
  function generateAutoComments(space, post, count, forceCharIds) {
    var pRef = resolvePostRef(post);
    if (pRef) post = pRef;
    // 批量模型决策：把多个 char 的人设/最近朋友圈/记忆打包给模型，由模型决定谁评论
    var authorNode = post.authorType === 'user' ? USER_NODE_ID : (post.authorId || '');
    var pool = (space.chars || []).filter(function (c) {
      if (!c.commentEnabled) return false;
      // 节省 token：只读取/发送与发圈者互为好友（标签含「好友/已加好友」）的 char 人设；
      // 未加好友的 char 看不到这条朋友圈，不参与召唤评论，其人设也不会被读取/发送。
      if (authorNode && c.charId !== authorNode && !isFriendPair(space, c.charId, authorNode)) return false;
      return true;
    });
    // NPC 可选参与：仅当发圈者是 char 且该 char 开启 npcSummon 时，其 NPC 会出现在召唤评论中
    var npcPool = [];
    if (post.authorType === 'char' && post.authorId) {
      var authorSc = getSpaceChar(space, post.authorId);
      if (authorSc && authorSc.npcSummon) {
        (getCharNpcs(authorSc) || []).forEach(function (npc) {
          npcPool.push({ _npc: npc, _npcOwner: authorSc, charId: null, charName: npc.name, charHandle: npc.name, charPersona: npc.bio || '', commentEnabled: true, charAvatar: npc.avatar || '' });
        });
      }
    }
    if (!pool.length && !npcPool.length) return Promise.resolve([]);
    // 被 @ 的 char 必须评论
    var mandatory = [];
    if (forceCharIds && forceCharIds.length) {
      forceCharIds.forEach(function (cid) {
        for (var i = 0; i < pool.length; i++) if (pool[i].charId === cid) { mandatory.push(pool[i]); break; }
      });
    }
    var rest = pool.filter(function (c) {
      for (var i = 0; i < mandatory.length; i++) if (mandatory[i].charId === c.charId) return false;
      return true;
    });
    var candidates;
    if (pool.length <= 4) {
      candidates = mandatory.concat(rest);
    } else {
      var n = 3 + Math.floor(Math.random() * 2); // 3 或 4
      var need = Math.max(0, n - mandatory.length);
      candidates = mandatory.concat(randPick(rest, Math.min(need, rest.length)));
    }
    // 追加 NPC 候选（若有）
    candidates = candidates.concat(npcPool);
    // 去重
    var seen = {};
    candidates = candidates.filter(function (c) {
      var key = c._npc ? ('npc_' + c._npc.id) : c.charId;
      if (seen[key]) return false; seen[key] = true; return true;
    });
    if (!candidates.length) return Promise.resolve([]);

    // 预计算每个候选 char 最近 1 条朋友圈
    var recentByChar = {};
    candidates.forEach(function (sc) {
      for (var i = 0; i < state.posts.length; i++) {
        var p = state.posts[i];
        if (p.authorType === 'char' && p.authorId === sc.charId) { recentByChar[sc.charId] = p; break; }
      }
    });
    // 并行加载记忆
    return Promise.all([
      Promise.all(candidates.map(function (sc) { return Promise.all([loadMountedMemory(sc), loadWorldbookText(sc.localWorldMounts || [])]); })),
      loadWorldbookText(space.worldMounts || []),
      loadUserPersonaText(space)
    ]).then(function (r) {
      var pairs = r[0]; var worldG = r[1]; var userPersona = r[2];
      var prompts = getSpacePrompts(space);
      var sys = '你正在模拟多个 char 同时看一条微信朋友圈，并决定哪些 char 想评论。\n\n';
      sys += '本次可能参与评论的 char：\n';
      candidates.forEach(function (sc, idx) {
        var c = findChar(sc.charId) || {};
        var persona = (c.persona || c.bio || sc.charPersona || '').slice(0, 400);
        sys += '【' + sc.charName + '】\n';
        if (sc._npc) sys += '身份：' + (sc._npcOwner ? (sc._npcOwner.charName) : 'NPC') + ' 的好友 NPC\n';
        if (persona) sys += '人设：' + persona + '\n';
        var mpB = sc._npc ? (sc._npcOwner ? sc._npcOwner.momentPersona : '') : sc.momentPersona;
        if (mpB) sys += '朋友圈人设：' + mpB + '\n';
        var commentLimit = (sc.autoCommentCount == null ? DEFAULT_AUTO_COMMENT : sc.autoCommentCount);
        sys += '评论上限：' + commentLimit + ' 条\n';
        if (sc.customIdentity) sys += '关系网身份：' + sc.customIdentity + '\n';
        var rp = sc.charId ? recentByChar[sc.charId] : null;
        if (rp) sys += '最近朋友圈：[' + formatStamp(rp.createdAt) + '] ' + ((rp.text || '(仅图片)').slice(0, 60)) + '\n';
        var mem = ((pairs[idx] && pairs[idx][0]) || '').slice(0, 800);
        if (mem) sys += '记忆：' + mem + '\n';
        var worldL = ((pairs[idx] && pairs[idx][1]) || '').slice(0, 1000);
        if (worldL) sys += '局部世界书（' + sc.charName + '）：' + worldL + '\n';
        // 该 char 可见的朋友圈上下文（有总结只发总结），与聊天注入一致；NPC 候选无独立朋友圈，跳过
        if (!sc._npc && sc.charId) {
          var feedB = buildFeedContext(space, state.posts, sc.summaries || [], { promptOnly: '', summaryPrompt: sc.summaryPrompt || '', maxFeed: parseInt(sc.maxFeed, 10) || DEFAULT_FEED_MAX, includeComments: sc.includeComments !== false, imageMode: getChatConf().imageMode }, sc.charId);
          if (feedB) sys += 'TA 可见的朋友圈上下文：\n' + feedB + '\n';
        }
        sys += '\n';
      });
      if (worldG) sys += '【世界书（user 挂载 · 插件内生成）】\n' + worldG + '\n\n';
      if (npcPool.length && npcPool[0]._npcOwner) {
        var rosterNpc = buildNpcRosterPrompt(space, npcPool[0]._npcOwner);
        if (rosterNpc) sys += '\n以下是 NPC 好友背景（可评论/点赞「' + npcPool[0]._npcOwner.charName + '」的朋友圈）：\n' + rosterNpc + '\n\n';
      }
      sys += '---\n' + userDualNameLine(space) + '\n\n';
      if (userPersona) sys += '【当前 user 的人设】\n' + userPersona + '\n\n';
      var autoRelLine = relationNetLine(space);
      if (autoRelLine) sys += autoRelLine + '\n\n';
      var mentionables = [];
      mentionables.push(space.userPersonaName || '');
      (space.chars || []).forEach(function (ch) { if (ch.postEnabled || ch.commentEnabled) mentionables.push(ch.charName); });
      sys += '可以 @ 的人：' + mentionables.join('、') + '（在评论里用 @名字 形式提及）\n';
      if (prompts.charComment) sys += '【评论氛围提示（user 设定，请遵循）】' + prompts.charComment + '\n';
      if (mandatory.length) sys += '被明确 @ 的 char（必须评论至少一条）：' + mandatory.map(function (sc) { return '@' + sc.charName; }).join('、') + '\n';
      sys += '\n请基于每个 char 的人设、最近朋友圈和记忆，决定哪些 char 想评论这条朋友圈。不想评论的可以不输出。至少保证 1 个 char 评论。char 之间可以互相回复。\n';
      sys += '\n' + DEFAULT_COMMENT_PRINCIPLE + '\n';
      sys += '\n这条朋友圈内容：[' + formatStamp(post.createdAt) + '] ' + (post.text || '(仅图片)') + '\n';
      // AI 默认可见生图提示词/图片描述，据此评论点赞（不再默认"没发图片"）
      var imgDescBatch = describePostImages(post, 'text');
      if (imgDescBatch) sys += '（图片：' + imgDescBatch + '）\n';
      sys += post.authorType === 'user' ? '发朋友圈的是 user（' + (space.userPersonaName || '') + '）。\n' : '发朋友圈的是 ' + (post.authorName || '') + '。\n';
      var prevComments = (post.comments || []).slice();
      if (prevComments.length) {
        sys += '\n已有评论（char 们可以看到，可回复其中某人）：\n';
        prevComments.forEach(function (pc) { sys += '- ' + (pc.authorName || '') + '（' + formatStamp(pc.createdAt) + '）：' + pc.text + (pc.replyToName ? ' （回复 ' + pc.replyToName + '）' : '') + '\n'; });
      }
      sys += '\n输出格式（严格遵守，不要多余内容）：\n';
      sys += '<comment author="角色名字" reply-to="被回复人名字(可省略)">评论正文</comment>\n';
      sys += '可输出多条，每条由不同 char 发出（author 必须是上面列出的角色名字之一）。\n';
      sys += '<like author="角色名字">1</like>   （放末尾，表示该 char 给这条朋友圈点赞；不点就不输出）\n';
      sys += '\n要求：每个 char 第一人称「我」，符合各自人设口吻，每条 1-2 句简短自然，可以依据人设适当使用 emoji（不必刻意回避，也不要过度使用），避免强行加话题标签。@某人 用 @名字 形式写在评论正文里。';
      sys += '\n注：reply-to 只能填上方「已有评论」里出现过的评论者名字；若只是评论朋友圈本身则必须省略 reply-to。user 未评论时绝对不能填 user 的名字。';
      sys += '\n重要：当你在回复某人已有的评论时，必须写 reply-to="被回复人名字"，展示格式为「小明 回复 小红：…」。错误示例：<comment author="小明">没在干什么。</comment>（缺 reply-to，无法标记为回复）；正确示例：<comment author="小明" reply-to="小红">没在干什么。</comment>。回复正文里不要再写 @被回复人 的名字。';
      sys += '\n' + GENERATED_ACTION_NOTE;
      var callOptsBatch = { messages: [{ role: 'system', content: sys }, { role: 'user', content: '让 char 们评论这条朋友圈。' }], temperature: 0.9 };
      // 识图模式（插件全局设置）：把图片本体直接附加给模型（不发送图片链接）
      var postAuthorMode = getChatConf().imageMode;
      if (postAuthorMode === 'vision' && post.images && post.images.length) callOptsBatch.images = post.images;
      return callAI(callOptsBatch);
    }).then(function (raw) {
      var text = trim(raw || '');
      // 解析批量输出（author + reply-to 属性，顺序不限）
      var parsedComments = [];
      var cmRe = /<comment\b([^>]*)>([\s\S]*?)<\/comment>/gi; var m;
      while ((m = cmRe.exec(text))) {
        var attrs = m[1] || '';
        var authorNm = trim((attrs.match(/author="([^"]*)"/) || [])[1] || '');
        var replyTo = trim((attrs.match(/reply-to="([^"]*)"/) || [])[1] || '');
        var cText = trim(m[2] || '');
        if (cText) parsedComments.push({ name: authorNm, replyToName: replyTo || null, text: cText });
      }
      var parsedLikes = [];
      var lkRe = /<like\b([^>]*)>\s*1\s*<\/like>/gi;
      while ((m = lkRe.exec(text))) { var lh = trim(((m[1] || '').match(/author="([^"]*)"/) || [])[1] || ''); if (lh) parsedLikes.push(lh); }
      // 兼容旧格式：无 author 属性时全归第一个候选 char
      if (!parsedComments.length) {
        var bare = trim(text.replace(/<like[\s\S]*?<\/like>/gi, ''));
        if (bare) parsedComments.push({ name: '', replyToName: null, text: bare });
      }
      // 角色名字匹配回候选
      var nameMap = {};
      candidates.forEach(function (sc) { nameMap[sc.charName] = sc; });
      var results = [];
      // 构建 reply-to 白名单：已有评论 + 本次输出中已产生的评论（支持同批次连续对话回复）
      var replyWhitelist = {};
      function addWhitelist(who) {
        if (!who) return;
        if (who.authorHandle) replyWhitelist[who.authorHandle] = true;
        if (who.authorName) replyWhitelist[who.authorName] = true;
      }
      (post.comments || []).forEach(addWhitelist);
      parsedComments.forEach(function (pc) {
        var sc = nameMap[pc.name] || candidates[0];
        var rt = pc.replyToName || null;
        // 未写 reply-to 但正文以「@某已有评论者」开头时，自动补全为回复并去掉开头 @
        if (!rt) {
          var mAt = trim(pc.text).match(/^@([^\s@，。,.\uff0c\u3002:：]+)/);
          if (mAt && replyWhitelist[mAt[1]]) {
            rt = mAt[1];
            pc.text = trim(pc.text.slice(mAt[0].length));
          }
        }
        // 校验 replyToName：不在白名单则清空（防止模型幻觉编造不存在的评论者）
        if (rt && !replyWhitelist[rt]) rt = null;
        results.push({
          id: uuid(), postId: post.id,
          authorType: sc._npc ? 'npc' : 'char',
          authorId: sc._npc ? ('npc_' + sc._npc.id) : sc.charId,
          authorName: sc.charName, authorHandle: sc.charName,
          text: pc.text, replyTo: null, replyToName: rt, createdAt: Date.now()
        });
        // 本评论也算作可回复对象，支持同批次内的连续回复
        addWhitelist({ authorHandle: sc.charName, authorName: sc.charName });
      });
      // 兜底：被 @ 的 char 必须评论
      mandatory.forEach(function (sc) {
        var has = false;
        for (var i = 0; i < results.length; i++) if (results[i].authorId === sc.charId) { has = true; break; }
        if (!has) results.push({ id: uuid(), postId: post.id, authorType: 'char', authorId: sc.charId, authorName: sc.charName, authorHandle: sc.charName, text: '…', replyTo: null, replyToName: null, createdAt: Date.now() });
      });
      // 兜底：至少 1 条
      if (!results.length && candidates.length) {
        var sc0 = candidates[0];
        results.push({ id: uuid(), postId: post.id, authorType: sc0._npc ? 'npc' : 'char', authorId: sc0._npc ? ('npc_' + sc0._npc.id) : sc0.charId, authorName: sc0.charName, authorHandle: sc0.charName, text: '…', replyTo: null, replyToName: null, createdAt: Date.now() });
      }
      // 处理 likes
      parsedLikes.forEach(function (nm) {
        var sc = nameMap[nm]; if (!sc) return;
        var lkId = sc._npc ? ('npc_' + sc._npc.id) : sc.charId;
        var has = false;
        for (var i = 0; i < post.likes.length; i++) if (post.likes[i].id === lkId) { has = true; break; }
        if (!has) post.likes.push({ id: lkId, name: sc.charName, ts: Date.now() });
      });
      // 保存
      var saveChain = Promise.resolve();
      results.forEach(function (comment) {
        saveChain = saveChain.then(function () {
          var sc = candidates.filter(function (c) { return c.charId === comment.authorId; })[0] || {};
          return Store.addComment(post.id, comment, post).then(function (added) {
            if (added) return Store.addNotif({ id: uuid(), spaceId: space.id, type: 'comment', fromId: comment.authorId, fromName: comment.authorName || comment.authorHandle, fromAvatar: sc.charAvatar || '', postId: post.id, postSnippet: (post.text || '').slice(0, 30), text: comment.replyToName ? '回复了 ' + comment.replyToName + '：' + comment.text : '评论：' + comment.text, createdAt: Date.now(), read: false });
          });
        });
      });
      return saveChain.then(function () { return Store.savePosts(); }).then(function () { return results; });
    }).catch(function (e) { console.warn('[Moments] 批量评论失败', e); return []; });
  }

  // ========== 同步：静默执行（不再直接写聊天 IndexedDB）==========
  // 旧版会把 char 的朋友圈行为以第一人称"我"注入单聊消息流，制造聊天记录。
  // 现改为静默模式：朋友圈生成/互动只保存在插件内部，不写入聊天消息流；
  // 用户每次向 AI 发送请求时，由 register.chat.contextProvider 把 user 双名字认知行与
  // 朋友圈内容自动拼进 system prompt，AI 感知但聊天界面不出现伪造消息，省 token 且不污染聊天。
  // 仅当该 char 开启 memSync 时，user 认知行才进上下文。
  function buildActionSummary(space, sc, sinceTs, posts) {
    // v1.4.4：行为记录仅保留 user 双名字认知行（可自定义）；其余行为记录内容不再注入聊天
    if (!space || !sc) return null;
    var sf = getSyncFormatForChar(sc);
    var gVars = { now: formatStamp(Date.now()), userHandle: space.userPersonaName || '', userName: space.userPersonaName || '', charName: sc.charName, charHandle: sc.charName || '' };
    var line = applyTemplate(sf.userLine, gVars) || userDualNameLine(space);
    return line || null;
    /* 旧版 5 分类行为记录已按需求移除，以下代码仅供回溯参考：
    posts = posts || state.posts;
    var userHandle = space.userPersonaHandle || space.userPersonaName;
    var myNames = [sc.charHandle, sc.charName].filter(Boolean);
    // 判断一段文本是否 @ 了本 char（按 handle/name 匹配）
    function mentionsMe(text) {
      if (!text) return false;
      for (var i = 0; i < myNames.length; i++) if (text.indexOf('@' + myNames[i]) >= 0) return true;
      return false;
    }
    // 5 分类：①我发的朋友圈(含自评/自赞) ②别人在我朋友圈下的互动 ③我对user朋友圈的互动 ④我对其他char朋友圈的互动 ⑤别人@我的评论
    var myPosts = [], othersOnMyPosts = [], userInteractions = [], otherCharInteractions = [], mentionMe = [];
    posts.forEach(function (p) {
      if (p.spaceId !== space.id) return;
      // 只记录该 char 可见的朋友圈内容（陌生/不认识者的动态默认互相不可见，自动排除）
      var vAuthorNode = p.authorType === 'user' ? USER_NODE_ID : (p.authorId || '');
      if (!(p.authorType === 'char' && p.authorId === sc.charId) && isStrangerPair(space, sc.charId, vAuthorNode)) return;
      if (p.createdAt <= sinceTs) return;
      var isMyPost = p.authorType === 'char' && p.authorId === sc.charId;
      var onName = p.authorType === 'user' ? userHandle : (p.authorHandle || p.authorName);
      var postLine = '[' + formatStamp(p.createdAt) + '] ' + (p.text || '(仅图片)');
      var postText = (p.text || '(仅图片)').slice(0, 50);
      // ① 我发的朋友圈（含自评/自赞，按时间排序）
      if (isMyPost) {
        var entry = { postLine: postLine, postTs: p.createdAt, postText: postText, selfActions: [] };
        if (p.comments) p.comments.forEach(function (c) {
          if (c.authorType !== 'char' || c.authorId !== sc.charId) return;
          if (c.createdAt <= sinceTs) return;
          entry.selfActions.push({ ts: c.createdAt, kind: 'comment', replyToName: c.replyToName, text: c.text });
        });
        if (p.likes) for (var i = 0; i < p.likes.length; i++) {
          if (p.likes[i].id === sc.charId) {
            var lkTs = p.likes[i].ts || p.createdAt;
            if (lkTs > sinceTs) entry.selfActions.push({ ts: lkTs, kind: 'like' });
          }
        }
        entry.selfActions.sort(function (a, b) { return a.ts - b.ts; });
        myPosts.push(entry);
      }
      // 评论遍历（②③④⑤）
      if (p.comments) p.comments.forEach(function (c) {
        if (c.createdAt <= sinceTs) return;
        var isMine = c.authorType === 'char' && c.authorId === sc.charId;
        var fromName = c.authorHandle || c.authorName;
        // ⑤ 别人 @ 我的评论
        if (!isMine && mentionsMe(c.text)) {
          mentionMe.push({ ts: c.createdAt, fromName: fromName, onName: onName, postText: postText, text: c.text, replyToName: c.replyToName });
        }
        // ② 别人在我朋友圈下的评论
        if (isMyPost && !isMine) {
          othersOnMyPosts.push({ ts: c.createdAt, kind: 'comment', fromName: fromName, postText: postText, text: c.text, replyToName: c.replyToName });
        }
        // ③④ 我对别人朋友圈的评论
        if (!isMyPost && isMine) {
          var item = { ts: c.createdAt, kind: 'comment', replyToName: c.replyToName, text: c.text, onName: onName, postText: postText };
          if (p.authorType === 'user') userInteractions.push(item);
          else otherCharInteractions.push(item);
        }
      });
      // 点赞遍历（②③④；自赞已在①处理）
      if (p.likes) for (var j = 0; j < p.likes.length; j++) {
        var lk = p.likes[j];
        var lkTs2 = lk.ts || p.createdAt;
        if (lkTs2 <= sinceTs) continue;
        // ② 别人给我点赞
        if (isMyPost && lk.id !== sc.charId) {
          othersOnMyPosts.push({ ts: lkTs2, kind: 'like', fromName: lk.name, postText: postText });
        }
        // ③④ 我给别人的点赞
        if (!isMyPost && lk.id === sc.charId) {
          var lItem = { ts: lkTs2, kind: 'like', onName: onName, postText: postText };
          if (p.authorType === 'user') userInteractions.push(lItem);
          else otherCharInteractions.push(lItem);
        }
      }
    });
    // 行为记录格式：该 char 自定义模板（留空字段 = 内置默认）
    var sf = getSyncFormatForChar(sc);
    var gVars = { now: formatStamp(Date.now()), userHandle: userHandle, userName: space.userPersonaName || '', charName: sc.charName, charHandle: sc.charHandle || '' };
    var L = [];
    // 开头行
    L.push(applyTemplate(sf.header, gVars) || (SYNC_PREFIX + ' · 我的朋友圈行为记录 · ' + gVars.now + ']'));
    // user 双名字认知行
    if (sf.userLine) L.push(applyTemplate(sf.userLine, gVars));
    else L.push(userDualNameLine(space));
    // 导语
    L.push(''); L.push(applyTemplate(sf.intro, gVars) || '我刚在朋友圈做了这些事 / 看到了这些与我有关的动态（按时间标签排列）：'); L.push('');
    // ① 我发的朋友圈（含自评/自赞）
    if (myPosts.length) {
      L.push('【我发的朋友圈】');
      var tpls1 = sf.cat1 ? parseLabeledTemplate(sf.cat1) : null;
      myPosts.forEach(function (entry) {
        if (tpls1 && tpls1.post) {
          L.push(applyTemplate(tpls1.post, { ts: formatStamp(entry.postTs), postText: entry.postText, postLine: entry.postLine }));
        } else {
          L.push('- ' + entry.postLine);
        }
        entry.selfActions.forEach(function (a) {
          var kind = a.kind === 'like' ? 'like' : (a.replyToName ? 'reply' : 'comment');
          if (tpls1 && tpls1[kind]) {
            L.push('  ' + applyTemplate(tpls1[kind], { actionTs: formatStamp(a.ts), replyToName: a.replyToName || '', text: a.text || '' }));
          } else {
            if (a.kind === 'like') L.push('  · [' + formatStamp(a.ts) + '] 我给自己的朋友圈点了赞');
            else if (a.replyToName) L.push('  · [' + formatStamp(a.ts) + '] 我回复了自己朋友圈下 ' + a.replyToName + ' 的评论：' + a.text);
            else L.push('  · [' + formatStamp(a.ts) + '] 我评论道：' + a.text);
          }
        });
      });
      L.push('');
    }
    // ② 别人在我朋友圈下的互动
    if (othersOnMyPosts.length) {
      L.push('【别人在我朋友圈下的互动】');
      othersOnMyPosts.sort(function (a, b) { return a.ts - b.ts; });
      var tpls2 = sf.cat2 ? parseLabeledTemplate(sf.cat2) : null;
      othersOnMyPosts.forEach(function (c) {
        var kind = c.kind === 'like' ? 'like' : (c.replyToName ? 'reply' : 'comment');
        if (tpls2 && tpls2[kind]) {
          L.push(applyTemplate(tpls2[kind], { ts: formatStamp(c.ts), fromName: c.fromName, postText: c.postText, replyToName: c.replyToName || '', text: c.text || '' }));
        } else {
          if (c.kind === 'like') L.push('- [' + formatStamp(c.ts) + '] ' + c.fromName + ' 给我「' + c.postText + '」的朋友圈点了赞');
          else if (c.replyToName) L.push('- [' + formatStamp(c.ts) + '] ' + c.fromName + ' 回复了我「' + c.postText + '」朋友圈下 ' + c.replyToName + ' 的评论：' + c.text);
          else L.push('- [' + formatStamp(c.ts) + '] ' + c.fromName + ' 评论了我的朋友圈「' + c.postText + '」：' + c.text);
        }
      });
      L.push('');
    }
    // ③ 我对 user 朋友圈的互动
    if (userInteractions.length) {
      L.push('【我对 user（' + userHandle + '）朋友圈的互动】');
      userInteractions.sort(function (a, b) { return a.ts - b.ts; });
      var tpls3 = sf.cat3 ? parseLabeledTemplate(sf.cat3) : null;
      userInteractions.forEach(function (c) {
        var kind = c.kind === 'like' ? 'like' : (c.replyToName ? 'reply' : 'comment');
        if (tpls3 && tpls3[kind]) {
          L.push(applyTemplate(tpls3[kind], { ts: formatStamp(c.ts), onName: c.onName, postText: c.postText, replyToName: c.replyToName || '', text: c.text || '', userHandle: userHandle }));
        } else {
          if (c.kind === 'like') L.push('- [' + formatStamp(c.ts) + '] 我给 user「' + c.postText + '」的朋友圈点了赞');
          else if (c.replyToName) L.push('- [' + formatStamp(c.ts) + '] 我回复了 ' + c.replyToName + ' 在 user「' + c.postText + '」朋友圈下的评论：' + c.text);
          else L.push('- [' + formatStamp(c.ts) + '] 我评论了 user 的朋友圈「' + c.postText + '」：' + c.text);
        }
      });
      L.push('');
    }
    // ④ 我对其他 char 朋友圈的互动
    if (otherCharInteractions.length) {
      L.push('【我对其他 char 朋友圈的互动】');
      otherCharInteractions.sort(function (a, b) { return a.ts - b.ts; });
      var tpls4 = sf.cat4 ? parseLabeledTemplate(sf.cat4) : null;
      otherCharInteractions.forEach(function (c) {
        var kind = c.kind === 'like' ? 'like' : (c.replyToName ? 'reply' : 'comment');
        if (tpls4 && tpls4[kind]) {
          L.push(applyTemplate(tpls4[kind], { ts: formatStamp(c.ts), onName: c.onName, postText: c.postText, replyToName: c.replyToName || '', text: c.text || '' }));
        } else {
          if (c.kind === 'like') L.push('- [' + formatStamp(c.ts) + '] 我给 ' + c.onName + '「' + c.postText + '」的朋友圈点了赞');
          else if (c.replyToName) L.push('- [' + formatStamp(c.ts) + '] 我回复了 ' + c.replyToName + ' 在 ' + c.onName + '「' + c.postText + '」朋友圈下的评论：' + c.text);
          else L.push('- [' + formatStamp(c.ts) + '] 我评论了 ' + c.onName + ' 的朋友圈「' + c.postText + '」：' + c.text);
        }
      });
      L.push('');
    }
    // ⑤ 别人 @ 我的评论
    if (mentionMe.length) {
      L.push('【别人 @ 我的评论】');
      mentionMe.sort(function (a, b) { return a.ts - b.ts; });
      var tpls5 = sf.cat5 ? parseLabeledTemplate(sf.cat5) : null;
      mentionMe.forEach(function (c) {
        var kind = c.replyToName ? 'mentionReply' : 'mention';
        if (tpls5 && tpls5[kind]) {
          L.push(applyTemplate(tpls5[kind], { ts: formatStamp(c.ts), fromName: c.fromName, onName: c.onName, postText: c.postText, replyToName: c.replyToName || '', text: c.text || '' }));
        } else {
          if (c.replyToName) L.push('- [' + formatStamp(c.ts) + '] ' + c.fromName + ' 在 ' + c.onName + '「' + c.postText + '」朋友圈下回复 ' + c.replyToName + ' 时 @ 了我：' + c.text);
          else L.push('- [' + formatStamp(c.ts) + '] ' + c.fromName + ' 在 ' + c.onName + '「' + c.postText + '」朋友圈下 @ 了我：' + c.text);
        }
      });
      L.push('');
    }
    // 5 分类全空：没有任何新行为，返回 null 让调用方跳过注入（不写空记录到聊天）
    if (!myPosts.length && !othersOnMyPosts.length && !userInteractions.length && !otherCharInteractions.length && !mentionMe.length) {
      return null;
    }
    L.push(applyTemplate(sf.footer, gVars) || '这是我的私人记忆记录，不必向 user 复述，但可以在对话中自然延续相关话题。');
    return L.join('\n');
    */
  }
  // 兼容旧调用：静默模式下不再写聊天，直接返回未注入
  function injectCharActionToChat(space, sc) {
    return Promise.resolve({ ok: false, reason: '静默模式：朋友圈行为不再写入聊天，改为自动注入聊天上下文' });
  }
  // 兼容旧调用：实时批量注入改为 no-op（上下文注入由 chat.contextProvider 统一处理）
  function injectCharsRealtime(space, charIds) {
    return Promise.resolve();
  }
  // 构建该 char 近期朋友圈行为记录（第一人称"我"，供聊天上下文注入）
  // posts/syncstate 可选：聊天上下文里传入从 storage 加载的数据，App 内用全局 state
  // v1.4.4：行为记录仅剩 user 双名字认知行（可自定义），不再包含发圈/评论/点赞等行为内容
  function buildCharActionRecord(space, sc, posts, syncstate) {
    if (!space || !sc) return null;
    return buildActionSummary(space, sc, 0, posts || state.posts);
  }
  // 方式2：手动写事实记忆
  // 收集该 char 在 sinceTs 之后的新朋友圈行为（发圈/评论/点赞）
  // full=true 时不截断正文（用于「预览待同步内容」）
  function collectCharActions(space, sc, sinceTs, posts, full) {
    var actions = [];
    (posts || state.posts).forEach(function (p) {
      if (p.spaceId !== space.id) return;
      // 只同步该 char 可见的朋友圈内容（陌生/不认识者的动态默认互相不可见，自动排除）
      var authorNode = p.authorType === 'user' ? USER_NODE_ID : (p.authorId || '');
      if (!(p.authorType === 'char' && p.authorId === sc.charId) && isStrangerPair(space, sc.charId, authorNode)) return;
      if (p.authorType === 'char' && p.authorId === sc.charId && p.createdAt > sinceTs) {
        var pText = p.text || '';
        if (!full && pText.length > 40) pText = pText.slice(0, 40) + '…';
        actions.push('发了朋友圈：' + pText);
      }
      if (p.comments) p.comments.forEach(function (c) { if (c.authorType === 'char' && c.authorId === sc.charId && c.createdAt > sinceTs) actions.push('评论了' + (p.authorName || '') + '的朋友圈'); });
      if (p.likes) p.likes.forEach(function (l) { if (l.id === sc.charId && p.createdAt > sinceTs) actions.push('点赞了' + (p.authorName || '') + '的朋友圈'); });
    });
    return actions;
  }
  // 检查该 char 会话中已写入的事实记忆里，与朋友圈相关的条数
  function countAlreadySyncedFacts(sc, convId) {
    if (!cachedRoche || !cachedRoche.memory || typeof cachedRoche.memory.getLongTerm !== 'function') return Promise.resolve(0);
    return Promise.resolve(cachedRoche.memory.getLongTerm({ conversationId: convId, limit: 200 })).then(function (lt) {
      var facts = (lt && lt.facts) || [];
      var n = 0;
      facts.forEach(function (f) {
        var t = (f.summaryText || f.action || f.text || '') + ' ' + String(f.source || '');
        if (t.indexOf('朋友圈') >= 0 || t.indexOf(sc.charName) >= 0 || t.indexOf('roche-moments') >= 0) n++;
      });
      return n;
    }).catch(function () { return 0; });
  }
  // v1.2.0：记忆同步不再直接执行——先自动检查是否有新行为、是否已写入事实记忆，
  // 根据结果弹出 Roche 提醒用户，用户确认后才真正同步；同步提示词可自定义。
  function syncCharToFactMemory(space, sc) {
    var sinceTs = Store.getSyncTs(space.id, sc.charId);
    var dmMount = null;
    (sc.memoryMounts || []).forEach(function (m) { if (m.enabled && !m.isGroup) dmMount = m; });
    if (!dmMount) return Promise.resolve({ ok: false, reason: '该 char 未挂载单聊会话' });
    var actions = collectCharActions(space, sc, sinceTs);
    if (!actions.length) {
      return Promise.resolve({ ok: false, reason: '该 char 近期没有新的朋友圈行为（发圈/评论/点赞），无需同步' });
    }
    return countAlreadySyncedFacts(sc, dmMount.conversationId).then(function (already) {
      var n = actions.length;
      var msg;
      if (!already) msg = '「' + sc.charName + '」近期有 ' + n + ' 条新的朋友圈行为，尚未写入事实记忆。\n\n本次未执行同步，是否立即同步？';
      else if (already >= n) msg = '「' + sc.charName + '」近期有 ' + n + ' 条朋友圈行为，已全部写入事实记忆。\n\n本次未执行同步，是否仍要重新同步一遍？';
      else msg = '「' + sc.charName + '」近期有 ' + n + ' 条朋友圈行为，其中 ' + already + ' 条已写入事实记忆（部分）。\n\n本次未执行同步，是否仍要立即同步？';
      return confirmBox({ title: '记忆同步检查', message: msg });
    }).then(function (go) {
      if (!go) return { ok: false, reason: '已取消，未执行同步' };
      var tpl = (sc.syncPrompt || '').trim() || DEFAULT_SYNC_PROMPT;
      var sysPrompt = tpl.replace(/\{charName\}/g, sc.charName);
      return callAI({
        messages: [{ role: 'system', content: sysPrompt }, { role: 'user', content: '行为列表：\n' + actions.join('\n') }],
        temperature: 0.5
      }).then(function (summaryText) {
        return cachedRoche.memory.write({ conversationId: dmMount.conversationId, summaryText: summaryText, who: [sc.charName], action: '朋友圈行为记录', when: '最近', where: '朋友圈', source: 'plugin:roche-moments' }).then(function () {
          var now = Date.now(); sc.lastSyncAt = now; Store.setSyncTs(space.id, sc.charId, now); Store.saveSpaces(); return { ok: true, summary: summaryText };
        });
      }).catch(function (e) { return { ok: false, reason: (e && e.message) || 'AI 或写入失败' }; });
    });
  }

  // ========== 后台定时器 ==========
  function startBgTimer() {
    if (window.__rocheMomentsBgStarted) return;
    window.__rocheMomentsBgStarted = true;
    setInterval(function () { checkBgTasks(); }, BG_CHECK_INTERVAL);
    setTimeout(function () { checkBgTasks(); }, 3000);
  }
  function checkBgTasks() {
    if (!cachedRoche) return;
    Store.loadAll().then(function () {
      var now = Date.now(); var tasks = [];
      state.spaces.forEach(function (space) {
        (space.chars || []).forEach(function (sc) {
          if (!sc.postEnabled) return;
          if (!sc.nextPostAt) { sc.nextPostAt = now + randomInterval(sc.postIntervalMin || 30); tasks.push(function () { return Store.saveSpaces(); }); }
          else if (now >= sc.nextPostAt) {
            sc.nextPostAt = now + randomInterval(sc.postIntervalMin || 30);
            tasks.push(function () {
              return Store.saveSpaces().then(function () {
                // char 发圈自带主动评论，不再触发其他 char 评论
                return generateCharPost(space, sc).then(function () { if (root) render(); }).catch(function (e) { console.warn('[Moments] 后台生成失败', e); });
              });
            });
          }
        });
      });
      var chain = Promise.resolve();
      tasks.forEach(function (t) { chain = chain.then(t); });
      return chain;
    }).catch(function () {});
  }

  // ========== 局部提示 / toast ==========
  function setTip(msg) { state.tip = msg || null; if (root) render(); }
  // 统一的「生成中」标志：生成人设/总结/关系网/NPC 时弹出加载层
  function setGenLoading(label) {
    state.genLoading = label || null;
    if (root) render();
  }
  function renderGenLoadingModal() {
    if (!state.genLoading) return '';
    return '<div class="moments-modal-mask" style="z-index:100;"><div class="moments-modal gen-loading"><div class="moments-modal-bd" style="text-align:center;padding:28px 20px;"><div class="moments-spin">' + WINDMILL_SVG + '</div><div style="margin-top:12px;font-size:14px;color:#666;">' + escapeHtml(state.genLoading) + '</div></div></div></div>';
  }
  function toast(msg) { if (cachedRoche && cachedRoche.ui && cachedRoche.ui.toast) cachedRoche.ui.toast(msg); }
  function confirmBox(opt) { if (cachedRoche && cachedRoche.ui && cachedRoche.ui.confirm) return cachedRoche.ui.confirm(opt); return Promise.resolve(window.confirm(opt.message || '确认？')); }

  // ========== 渲染 ==========
  // 保存/恢复所有滚动容器的 scrollTop，避免重渲染跳顶
  var SCROLL_SEL = ['.moments-scroll', '.moments-sidebar', '.moments-modal-bd', '.moments-sheet'];
  function captureScrolls() {
    var map = {};
    if (!root) return map;
    SCROLL_SEL.forEach(function (sel) {
      var els = root.querySelectorAll(sel);
      for (var i = 0; i < els.length; i++) map[sel + '#' + i] = els[i].scrollTop;
    });
    return map;
  }
  function restoreScrolls(map) {
    if (!root || !map) return;
    SCROLL_SEL.forEach(function (sel) {
      var els = root.querySelectorAll(sel);
      for (var i = 0; i < els.length; i++) {
        var k = sel + '#' + i;
        if (map[k] != null) { try { els[i].scrollTop = map[k]; } catch (e) {} }
      }
    });
  }
  function render() {
    if (!root) return;
    if (state.bootLoading) {
      root.innerHTML = '<div class="' + ROOT_CLASS + '"><div class="moments-boot"><div class="moments-spin">' + WINDMILL_SVG + '</div><div class="moments-boot-text">加载中...</div></div></div>';
      return;
    }
    // 保存所有滚动容器位置，避免重渲染跳顶
    var savedScrolls = state._suppressScrollRestore ? {} : captureScrolls();
    var space = Store.getActiveSpace();
    var rootCls = ROOT_CLASS + (state.darkMode ? ' dark' : '') + (state.commentTarget ? ' commenting' : '');
    var html = '<div class="' + rootCls + '" style="--topbar-pad:' + Math.max(0, state.uiPrefs.topbarH || 0) + 'px;--bottom-pad:' + (state.uiPrefs.bottomPad || 80) + 'px;--sb-h:' + (state.uiPrefs.sbH || 50) + 'px;--sb-off:' + (state.uiPrefs.sbOff || 0) + 'px;">';
    // 滚动区：顶栏 sticky + 封面 + feed
    html += '<div class="moments-scroll">';
    html += renderTopbar(space);
    html += renderCover(space);
    html += renderFeed(space);
    html += '</div>';
    // 浮层（与滚动区同级，覆盖整个 root）
    if (state.sidebarOpen) html += renderSidebar(space);
    if (state.postModalOpen) html += renderPostModal(space);
    if (state.editModalOpen) html += renderEditPostModal(space);
    if (state.notifPanelOpen) html += renderNotifPanel(space);
    if (state.subjectSheetOpen) html += renderSubjectSheet(space);
    if (state.lpSheetOpen) html += renderLpSheet();
    if (state.memMountCharId) html += renderMemMountModal(space, state.memMountCharId);
    if (state.subApiPanelOpen) html += renderSubApiPanel();
    if (state.charListOpen) html += renderCharListModal(space);
    if (state.moodPromptsOpen) html += renderMoodPromptsModal(space);
    if (state.npcModalCharId) html += renderNpcModal(space, state.npcModalCharId);
    if (state.npcPromptOpen) html += renderNpcPromptModal(space, state.npcPromptCharId, state.npcPromptIdx);
    if (state.npcGenPromptOpen) html += renderNpcGenPromptModal(space, state.npcGenPromptCharId);
    if (state.npcEditOpen) html += renderNpcEditModal(space);
    if (state.relationNetOpen) html += renderRelationNetModal(space);
    if (state.relPreviewOpen) html += renderRelationNetPreviewModal(space);
    if (state.relGenDraft) html += renderRelGenReviewModal(space);
    if (state.promptPanelOpen) html += renderPromptPanelModal(space);
    if (state.allPromptsOpen) html += renderAllPromptsModal(space);
    if (state.coverModalOpen) html += renderCoverModal(space);
    if (state.syncFormatOpen) html += renderSyncFormatModal(space, state.syncFormatCharId);
    if (state.worldMountOpen) html += renderWorldMountModal(space, state.worldCharId, state.worldMode);
    if (state.summaryDraft) html += renderSummaryResultModal();
    if (state.imageMenu) html += renderImageMenuModal();
    if (state.imageViewer) html += renderImageViewer();
    if (state.contentPreview) html += renderContentPreviewModal();
    if (state.momentGenDraft) html += renderMomentGenDraftModal(space);
    if (state.genLoading) html += renderGenLoadingModal();
    if (state.imagePromptView) html += renderImagePromptModal();
    if (state.uiPrefsOpen) html += renderUiPrefsModal();
    if (state.commentTarget) html += renderCommentInput();
    html += '</div>';
    root.innerHTML = html;
    // 恢复滚动位置
    if (!state._suppressScrollRestore) restoreScrolls(savedScrolls);
    state._suppressScrollRestore = false;
    if (state.postModalOpen) setupPostModalTools();
    if (state.editModalOpen) { setupPostModalTools(); refreshPostImages(); }
    if (state.coverModalOpen) setupCoverModal();
    // 评论输入框出现时，把目标帖子滚到可见区域（避免被输入栏遮挡）
    if (state.commentTarget) {
      var tgt = $('.moment[data-id="' + state.commentTarget.postId + '"] .moment-acts', root);
      if (tgt) tgt.scrollIntoView({ block: 'nearest' });
      setupCommentInput();
    }
  }

  // 顶栏：黑底白字微信风格
  function renderTopbar(space) {
    var unread = 0; state.notifs.forEach(function (n) { if (!n.read) unread++; });
    return '<div class="moments-topbar">' +
      '<div class="moments-tb-left" data-action="back">' + ICON.back + '</div>' +
      '<div class="moments-tb-title" data-dbl="open-sidebar" title="双击打开侧边栏">朋友圈</div>' +
      '<div class="moments-tb-right">' +
        '<span class="moments-tb-icon" data-action="open-post-modal">' + ICON.camera + '</span>' +
        '<span class="moments-tb-icon moments-tb-bell' + (unread ? ' has-dot' : '') + '" data-action="open-notif">' + ICON.bell + (unread ? '<i class="moments-dot"></i>' : '') + '</span>' +
      '</div></div>';
  }

  // 封面：wrapper 布局，avatar 伸出不被裁
  function renderCover(space) {
    if (!space) return '<div class="moments-empty">还没有朋友圈空间，请打开左侧栏选择或创建。</div>';
    var subj = getCurrentSubject();
    // per-char/per-user 封面：char 用 spaceChar.cover，user 用 space.cover
    var cover = '';
    if (subj && subj.type === 'char' && subj.spaceChar) cover = subj.spaceChar.cover || '';
    else cover = space.cover || '';
    var coverBg = cover ? 'background-image:url(' + escapeHtml(cover) + ');' : '';
    return '<div class="moments-cover-wrap">' +
      '<div class="moments-cover" style="' + coverBg + '" data-action="set-cover">' +
        (cover ? '' : '<div class="moments-cover-ph">' + ICON.camera + '<span>点击设置封面（URL / 本地相册）</span></div>') +
        '<div class="moments-cover-mask"></div>' +
      '</div>' +
      '<div class="moments-cover-bar">' +
        '<div class="moments-cover-name" data-action="open-subject">' + escapeHtml(subj && subj.name || '') + '</div>' +
        '<div class="moments-cover-avatar" data-action="open-subject">' +
          '<div class="moments-avatar">' + (subj && subj.avatar ? '<img src="' + escapeHtml(subj.avatar) + '">' : '<div class="moments-avatar-fb">' + escapeHtml((subj && subj.name || '?').slice(0, 1)) + '</div>') + '</div>' +
        '</div>' +
      '</div></div>';
  }

  // 封面设置弹窗：支持图片 URL 或本地相册上传
  function renderCoverModal(space) {
    if (!space) return '';
    var subj = getCurrentSubject();
    var curCov = '';
    if (subj && subj.type === 'char' && subj.spaceChar) curCov = subj.spaceChar.cover || '';
    else curCov = space.cover || '';
    var html = '<div class="moments-modal-mask" data-action="close-cover"><div class="moments-modal" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">设置封面 — ' + escapeHtml(subj ? subj.name : '') + '</div><div class="moments-modal-x" data-action="close-cover">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">支持图片 URL 或从本地相册上传。</div>';
    if (curCov) html += '<div class="moments-cover-preview" style="background-image:url(' + escapeHtml(curCov) + ');"></div>';
    else html += '<div class="moments-cover-preview empty">' + ICON.image + '<span>当前无封面</span></div>';
    html += '<div class="moments-sec-title">图片 URL</div>';
    html += '<input class="moments-input" id="cover-url" placeholder="https://... 或 data:image/..." value="' + escapeHtml(curCov) + '">';
    html += '<div class="moments-btn-row"><button class="moments-btn" data-action="save-cover">保存 URL</button><label class="moments-btn ghost" style="flex:1;text-align:center;cursor:pointer;">从相册选择<input type="file" accept="image/*" id="cover-file" style="display:none"></label></div>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="clear-cover">清除封面</button><button class="moments-btn ghost" data-action="close-cover">取消</button></div>';
    return html + '</div></div></div>';
  }
  function setupCoverModal() {
    var fileInput = $('#cover-file', root);
    if (fileInput && !fileInput._bound) {
      fileInput._bound = true;
      fileInput.addEventListener('change', function () {
        var f = fileInput.files && fileInput.files[0]; if (!f) return;
        if (f.size > 4 * 1024 * 1024) { toast('图片超过 4MB，建议用 URL'); fileInput.value = ''; return; }
        var reader = new FileReader();
        reader.onload = function () {
          setCurrentCover(reader.result).then(function () {
            state.coverModalOpen = false;
            toast('封面已更新');
            render();
          });
        };
        reader.readAsDataURL(f);
        fileInput.value = '';
      });
    }
  }
  function setCurrentCover(url) {
    var space = Store.getActiveSpace();
    var subj = getCurrentSubject();
    var u = trim(url || '');
    if (subj && subj.type === 'char' && subj.spaceChar) subj.spaceChar.cover = u;
    else if (space) space.cover = u;
    return Store.saveSpaces();
  }

  function renderFeed(space) {
    if (!space) return '';
    var posts = state.posts.filter(function (p) { return p.spaceId === space.id; });
    var subj = getCurrentSubject();
    if (subj && subj.type === 'char') posts = posts.filter(function (p) { return p.authorId === subj.id; });
    var html = '<div class="moments-feed">';
    if (state.tip) {
      html += '<div class="moments-tip"><div class="moments-spin sm">' + WINDMILL_SVG + '</div><span>' + escapeHtml(state.tip) + '</span></div>';
    }
    if (!posts.length && !state.tip) {
      html += '<div class="moments-feed-empty">' + ICON.camera + '<div>还没有朋友圈动态</div><div class="moments-fe-hint">点击右上角相机发布</div></div>';
    }
    posts.forEach(function (p, pi) { html += renderMoment(p, space, pi === 0); });
    html += '</div>';
    return html;
  }

  function renderMoment(p, space, isFirst) {
    var name = p.authorName || '未知';
    var av = p.authorAvatar;
    var h = '<div class="moment' + (isFirst ? ' first' : '') + '" data-id="' + p.id + '">';
    h += '<div class="moment-hd">';
    h += '<div class="moment-avatar">' + (av ? '<img src="' + escapeHtml(av) + '">' : '<div class="moments-avatar-fb">' + escapeHtml(name.slice(0, 1)) + '</div>') + '</div>';
    h += '<div class="moment-meta"><div class="moment-author" data-action="view-author" data-id="' + p.id + '">' + escapeHtml(name) + '</div>';
    if (p.location) h += '<div class="moment-loc">' + ICON.location + escapeHtml(p.location) + '</div>';
    h += '</div>';
    h += '<div class="moment-ops"><span class="m-op" data-action="edit-post" data-id="' + p.id + '" title="编辑">' + ICON.edit + '</span><span class="m-op danger" data-action="delete-post" data-id="' + p.id + '" title="删除">' + ICON.del + '</span></div>';
    h += '</div>';
    if (p.text) h += '<div class="moment-text">' + escapeHtml(p.text).replace(/\n/g, '<br>') + '</div>';
    if (p.images && p.images.length) {
      h += '<div class="moment-imgs' + (p.images.length === 1 ? ' single' : '') + '">';
      p.images.forEach(function (img, idx) {
        var isFailText = img.type === 'text' && img.prompt;
        if (img.type === 'ai' || isFailText) {
          if (isFailText) {
            // 生图失败降级为文字图：保留「more」菜单（重新生成 / 查看编辑提示词），点击卡片可看生图提示词
            h += '<div class="m-img-text fallback" data-action="toggle-text" data-id="' + p.id + '" data-idx="' + idx + '">' +
              '<div class="mit-ph">' + ICON.image + '<span>图片生成失败，点击查看提示词</span></div>' +
              '<div class="mit-tx">' + escapeHtml(img.textContent || img.prompt || '').replace(/\n/g, '<br>') + '</div>' +
              '<span class="m-img-more" data-action="open-image-menu" data-id="' + p.id + '" data-idx="' + idx + '" title="更多操作">' + ICON.more + '</span></div>';
          } else {
            var isImgLoading = !img.value || img.loading;
            var imgBody = isImgLoading ? '<div class="m-img-loading"><i class="m-img-spin"></i><span>图片加载中……</span></div>' : '<img src="' + escapeHtml(img.value) + '">';
            h += '<div class="m-img ai' + (isImgLoading ? ' loading' : '') + '" data-action="view-photo" data-id="' + p.id + '" data-idx="' + idx + '">' + imgBody + '<span class="m-img-more" data-action="open-image-menu" data-id="' + p.id + '" data-idx="' + idx + '" title="更多操作">' + ICON.more + '</span></div>';
          }
        } else if (img.type === 'text') {
          // user 手动添加的文字图
          h += '<div class="m-img-text" data-action="toggle-text" data-id="' + p.id + '" data-idx="' + idx + '">' +
            '<div class="mit-ph">' + ICON.image + '<span>图片</span></div>' +
            '<div class="mit-tx">' + escapeHtml(img.textContent || img.value).replace(/\n/g, '<br>') + '</div></div>';
        } else {
          // 普通图片（URL / 本地相册）
          h += '<div class="m-img" data-action="view-photo" data-id="' + p.id + '" data-idx="' + idx + '"><img src="' + escapeHtml(img.value) + '"></div>';
        }
      });
      h += '</div>';
    }
    h += '<div class="moment-ft"><span class="moment-time">' + formatTime(p.createdAt) + '</span>';
    // 操作气泡容器放在 ft 内部，"··"按钮左侧，定位相对 .moment-ft
    h += '<div class="moment-act-pop" data-id="' + p.id + '"></div>';
    h += '<span class="moment-acts" data-action="open-acts" data-id="' + p.id + '">' + ICON.more + '</span></div>';
    h += renderInteractions(p, space);
    h += '</div>';
    return h;
  }

  function renderInteractions(p, space) {
    var hasLike = p.likes && p.likes.length;
    var hasComment = p.comments && p.comments.length;
    if (!hasLike && !hasComment) return '';
    var h = '<div class="moment-int">';
    if (hasLike) {
      h += '<div class="moment-likes" data-id="' + p.id + '">' + ICON.like + '<span>' + p.likes.map(function (l) { return l.name; }).map(escapeHtml).join('，') + '</span></div>';
    }
    if (hasComment) {
      h += '<div class="moment-comments">';
      (p.comments || []).forEach(function (c) {
        var cn = c.authorName || '未知';
        h += '<div class="mc" data-action="reply-comment" data-id="' + p.id + '" data-cid="' + c.id + '">';
        h += '<span class="mc-n">' + escapeHtml(cn) + '</span>';
        if (c.replyToName) h += '<span class="mc-r"> 回复 </span><span class="mc-n">' + escapeHtml(c.replyToName) + '</span>';
        // 渲染评论正文（高亮 @提及）
        var txt = escapeHtml(displayCommentText(c)).replace(/@([^\s@，。,.\uff0c\u3002:：]+)/g, '<span class="mc-at">@$1</span>');
        h += '<span class="mc-c">：' + txt.replace(/\n/g, '<br>') + '</span></div>';
      });
      h += '</div>';
    }
    h += '</div>';
    return h;
  }

  // 侧边栏
  function renderSidebar(space) {
    var html = '<div class="moments-mask open" data-action="close-sidebar"></div><div class="moments-sidebar open">';
    html += '<div class="moments-sb-hd"><div class="moments-sb-title">朋友圈</div><div class="moments-sb-close" data-action="close-sidebar">' + ICON.close + '</div></div>';
    html += '<div class="moments-sb-sec"><div class="moments-sb-label">user 人设空间</div>';
    state.allPersonas.forEach(function (per) {
      var sp = null;
      for (var i = 0; i < state.spaces.length; i++) if (state.spaces[i].userPersonaId === per.id) { sp = state.spaces[i]; break; }
      var active = sp && sp.id === state.activeSpaceId;
      html += '<div class="moments-sb-item' + (active ? ' active' : '') + '" data-action="switch-space" data-pid="' + escapeHtml(per.id) + '">';
      html += '<div class="moments-avatar sm">' + (per.avatar ? '<img src="' + escapeHtml(per.avatar) + '">' : '<div class="moments-avatar-fb">' + escapeHtml((per.name || '?').slice(0, 1)) + '</div>') + '</div>';
      html += '<div class="moments-sb-info"><div class="moments-sb-name">' + escapeHtml(per.name || '未知') + '</div><div class="moments-sb-sub">' + (sp ? sp.chars.length + ' 个 char' : '未创建') + '</div></div></div>';
    });
    html += '</div>';
    if (space) {
      html += '<div class="moments-sb-sec"><div class="moments-sb-label">绑定的 char</div>';
      if (!space.chars.length) html += '<div class="moments-sb-empty">还没有绑定 char</div>';
      space.chars.forEach(function (sc) {
        html += '<div class="moments-sb-item col" data-action="view-char" data-cid="' + escapeHtml(sc.charId) + '">';
        html += '<div class="moments-sb-row"><div class="moments-avatar sm">' + (sc.charAvatar ? '<img src="' + escapeHtml(sc.charAvatar) + '">' : '<div class="moments-avatar-fb">' + escapeHtml((sc.charName || '?').slice(0, 1)) + '</div>') + '</div>';
        html += '<div class="moments-sb-info"><div class="moments-sb-name">' + escapeHtml(sc.charName) + '</div><div class="moments-sb-sub">发圈' + (sc.postEnabled ? '开' : '关') + ' · 评论' + (sc.commentEnabled ? '开' : '关') + ' · ' + (sc.postIntervalMin || 30) + '分钟</div></div></div>';
        html += '<div class="moments-sb-btns">';
        html += '<span class="mm-btn" data-action="char-post-now" data-cid="' + escapeHtml(sc.charId) + '">发一条</span>';
        html += '<span class="mm-btn" data-action="open-mem-mount" data-cid="' + escapeHtml(sc.charId) + '">记忆</span>';
        html += '<span class="mm-btn" data-action="open-npc-modal" data-cid="' + escapeHtml(sc.charId) + '">NPC</span>';
        html += '<span class="mm-btn danger" data-action="unbind-char" data-cid="' + escapeHtml(sc.charId) + '">解绑</span>';
        html += '</div></div>';
      });
      html += '<div class="moments-sb-item" data-action="open-char-list"><div class="moments-avatar sm add-av">' + ICON.plus + '</div><div class="moments-sb-info"><div class="moments-sb-name">绑定 char</div></div></div>';
      html += '</div>';
    }
    html += '<div class="moments-sb-sec"><div class="moments-sb-label">设置</div>';
    html += '<div class="moments-sb-item" data-action="toggle-dark"><div class="moments-sb-info"><div class="moments-sb-name">夜间模式</div><div class="moments-sb-sub">' + (state.darkMode ? '已开启' : '已关闭') + '</div></div></div>';
    html += '<div class="moments-sb-item" data-action="open-uiprefs"><div class="moments-sb-info"><div class="moments-sb-name">界面尺寸调整</div><div class="moments-sb-sub">顶栏高度 · 底部安全边距</div></div></div>';
    var autoReplyOn = getChatConf().autoReply !== false;
    html += '<div class="moments-sb-item" data-action="toggle-auto-reply"><div class="moments-sb-info"><div class="moments-sb-name">发送后自动请求 AI 回复</div><div class="moments-sb-sub">' + (autoReplyOn ? '已开启：发圈/评论后立即生成' : '已关闭：可 @ 召唤角色回复') + '</div></div><div class="moments-sw' + (autoReplyOn ? ' on' : '') + '"><i></i></div></div>';
    html += '<div class="moments-sb-item" data-action="open-prompt-panel"><div class="moments-sb-info"><div class="moments-sb-name">AI 提示词</div><div class="moments-sb-sub">聊天自动注入提醒提示词</div></div></div>';
    html += '<div class="moments-sb-item" data-action="open-mood-prompts"><div class="moments-sb-info"><div class="moments-sb-name">氛围提示词</div><div class="moments-sb-sub">自定义发圈/评论氛围</div></div></div>';
    html += '<div class="moments-sb-item" data-action="open-all-prompts"><div class="moments-sb-info"><div class="moments-sb-name">总提示词</div><div class="moments-sb-sub">查看/编辑所有提示词与影响范围</div></div></div>';
    html += '<div class="moments-sb-item" data-action="open-relation-net"><div class="moments-sb-info"><div class="moments-sb-name">关系网</div><div class="moments-sb-sub">身份设定 · 关系（含 user↔char）</div></div></div>';
    html += '<div class="moments-sb-item" data-action="open-world-mount"><div class="moments-sb-info"><div class="moments-sb-name">世界书读取</div><div class="moments-sb-sub">插件内生成通用词条（全局/局部）</div></div></div>';
    html += '<div class="moments-sb-item" data-action="open-subapi"><div class="moments-sb-info"><div class="moments-sb-name">副 API 设置</div><div class="moments-sb-sub">' + (getActiveSubApi() ? getActiveSubApi().name : '默认 roche.ai.chat') + '</div></div></div>';
    html += '<div class="moments-sb-item" data-action="clear-img-cache"><div class="moments-sb-info"><div class="moments-sb-name">清除本地图片缓存</div></div></div>';
    html += '</div></div>';
    return html;
  }

  function renderCharListModal(space) {
    var html = '<div class="moments-modal-mask" data-action="close-char-list"><div class="moments-modal" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">选择要绑定的 char</div><div class="moments-modal-x" data-action="close-char-list">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    var bound = {}; space.chars.forEach(function (sc) { bound[sc.charId] = true; });
    if (!state.allChars.length) html += '<div class="moments-empty">没有可用的 char</div>';
    state.allChars.forEach(function (c) {
      if (bound[c.id]) return;
      html += '<div class="moments-sb-item" data-action="bind-char" data-cid="' + escapeHtml(c.id) + '"><div class="moments-avatar sm">' + (c.avatar ? '<img src="' + escapeHtml(c.avatar) + '">' : '<div class="moments-avatar-fb">' + escapeHtml((c.name || '?').slice(0, 1)) + '</div>') + '</div><div class="moments-sb-info"><div class="moments-sb-name">' + escapeHtml(c.name || '未知') + '</div><div class="moments-sb-sub">' + escapeHtml(c.bio || '') + '</div></div></div>';
    });
    return html + '</div></div></div>';
  }

  function renderMemMountModal(space, charId) {
    var sc = getSpaceChar(space, charId); if (!sc) return '';
    var html = '<div class="moments-modal-mask" data-action="close-mem-mount"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">' + escapeHtml(sc.charName) + ' 的记忆挂载与总结</div><div class="moments-modal-x" data-action="close-mem-mount">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<details class="moments-fold"><summary>基础设置</summary><div class="moments-fold-bd">';
    html += '<div class="moments-row"><div class="moments-row-label">主动发朋友圈<span class="moments-sec-hint">后台定时自动发圈</span></div><div class="moments-sw' + (sc.postEnabled ? ' on' : '') + '" data-action="toggle-post" data-cid="' + escapeHtml(charId) + '"><i></i></div></div>';
    html += '<div class="moments-row"><div class="moments-row-label">参与评论<span class="moments-sec-hint">自动评论与被 @ 召唤</span></div><div class="moments-sw' + (sc.commentEnabled ? ' on' : '') + '" data-action="toggle-comment" data-cid="' + escapeHtml(charId) + '"><i></i></div></div>';
    html += '<div class="moments-row"><div class="moments-row-label">聊天上下文注入 user 认知行<span class="moments-sec-hint">user 认知，静默</span></div><div class="moments-sw' + (sc.memSync ? ' on' : '') + '" data-action="toggle-mem-sync" data-cid="' + escapeHtml(charId) + '"><i></i></div></div>';
    html += '<div class="moments-row"><div class="moments-row-label">主动发圈间隔（分钟，最小30）</div><input class="moments-input" type="number" min="30" value="' + (sc.postIntervalMin || 30) + '" data-field="interval" data-cid="' + escapeHtml(charId) + '"></div>';
    html += '<div class="moments-row"><div class="moments-row-label">每次主动发圈条数（1-9）</div><input class="moments-input" type="number" min="1" max="9" value="' + (sc.postCount || 1) + '" data-field="char-postCount" data-cid="' + escapeHtml(charId) + '"></div>';
    html += '<div class="moments-row"><div class="moments-row-label">被评论时自动评论数（0-8）</div><input class="moments-input" type="number" min="0" max="8" value="' + (sc.autoCommentCount == null ? DEFAULT_AUTO_COMMENT : sc.autoCommentCount) + '" data-field="autocomment" data-cid="' + escapeHtml(charId) + '"></div>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="open-sync-format" data-cid="' + escapeHtml(charId) + '">自定义 user 认知行提示词</button><button class="moments-btn ghost" data-action="preview-char-prompts" data-cid="' + escapeHtml(charId) + '">预览该 char 的最终 AI 提示词</button></div>';
    html += '</div></details>';
    // 挂载的会话记忆
    html += '<details class="moments-fold"><summary>挂载的会话记忆<span class="moments-sec-hint">只显示包含该 char 的会话</span></summary><div class="moments-fold-bd">';
    var convs = sc._convCache || [];
    if (sc._convLoading) {
      html += '<div class="moments-empty">正在加载会话列表...</div>';
    } else if (!convs.length) {
      html += '<div class="moments-empty">该 char 没有可挂载的会话（需先在 Roche 与该 char 建立单聊或群聊）</div>';
    } else {
      convs.forEach(function (conv) {
        var mount = null; (sc.memoryMounts || []).forEach(function (m) { if (m.conversationId === conv.id) mount = m; });
        var isOn = mount && mount.enabled;
        html += '<div class="moments-conv' + (isOn ? ' on' : '') + '"><div class="moments-conv-hd"><div class="moments-conv-name">' + escapeHtml(conv.name || conv.id) + (conv.isGroup ? ' (群)' : ' (单聊)') + '</div><div class="moments-sw' + (isOn ? ' on' : '') + '" data-action="toggle-mount" data-cid="' + escapeHtml(charId) + '" data-conv="' + escapeHtml(conv.id) + '"><i></i></div></div>';
        if (isOn) {
          html += '<div class="moments-conv-opts"><label>短期 <input type="number" min="0" max="500" value="' + (mount.shortLimit || 50) + '" data-field="short" data-cid="' + escapeHtml(charId) + '" data-conv="' + escapeHtml(conv.id) + '"></label><label>事实 <input type="number" min="0" max="500" value="' + (mount.factLimit || 0) + '" data-field="fact" data-cid="' + escapeHtml(charId) + '" data-conv="' + escapeHtml(conv.id) + '"></label><label>核心 <input type="checkbox" ' + (mount.coreEnabled ? 'checked' : '') + ' data-field="core" data-cid="' + escapeHtml(charId) + '" data-conv="' + escapeHtml(conv.id) + '"></label></div>';
        }
        html += '</div>';
      });
    }
    html += '</div></details>';
    // 世界书读取（per-char，插件内生成时注入；可选全局+局部词条）
    html += '<details class="moments-fold"><summary>世界书读取（该 char）<span class="moments-sec-hint">该 char 插件内生成时注入，不进聊天</span></summary><div class="moments-fold-bd">';
    html += '<div class="moments-hint">为该 char 单独挂载 Roche 世界书词条（**全局与局部均可选**）；「发一条」「召唤评论」「自动评论」等插件内生成会读取（侧边栏的空间级词条所有 char 通用）。</div>';
    var lwm = sc.localWorldMounts || [];
    if (!lwm.length) html += '<div class="moments-empty">该 char 未选择世界书词条</div>';
    lwm.forEach(function (m, i) {
      html += '<div class="moments-sum-item"><div class="moments-sum-hd"><span>' + escapeHtml(m.entryName || m.entryId) + '</span><span class="mm-btn danger" data-action="remove-world-entry" data-mode="local" data-cid="' + escapeHtml(charId) + '" data-idx="' + i + '">移除</span></div><div class="moments-sum-body">' + escapeHtml((m.text || '').slice(0, 80)) + '</div></div>';
    });
    // 与空间级重复开启的词条数量提醒
    var dupCnt = 0;
    lwm.forEach(function (m) {
      (space.worldMounts || []).forEach(function (gm) { if (gm.entryId === m.entryId && gm.categoryId === m.categoryId) dupCnt++; });
    });
    if (dupCnt) html += '<div class="moments-hint" style="color:#e6a23c;">⚠ 有 ' + dupCnt + ' 条词条与空间级（侧边栏）世界书重复开启，会在生成时重复读取注入。</div>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="open-world-mount-local" data-cid="' + escapeHtml(charId) + '">选择世界书词条（全局/局部）</button></div>';
    html += '</div></details>';
    // char 朋友圈人设
    html += '<details class="moments-fold"><summary>char 朋友圈人设</summary><div class="moments-fold-bd">';
    html += '<div class="moments-hint">如：朋友圈里大家互相毒舌但关系很好 / ' + escapeHtml(sc.charName) + ' 在朋友圈更活跃、更爱分享日常。与「氛围提示词」互补：这里定义该 char 长期的朋友圈性格，氛围提示词是临场氛围。</div>';
    html += '<textarea class="moments-prompt-ta" data-field="char-momentPersona" data-cid="' + escapeHtml(charId) + '" rows="3">' + escapeHtml(sc.momentPersona || '') + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="gen-moment-persona" data-cid="' + escapeHtml(charId) + '">AI 生成朋友圈人设</button><button class="moments-btn ghost" data-action="preview-moment-gen-prompt" data-cid="' + escapeHtml(charId) + '">预览生成提示词</button></div>';
    html += '<div class="moments-sec-title">朋友圈人设生成提示词<span class="moments-sec-hint">可编辑/预览；变量 {charName} {userName}；清空=恢复默认</span></div>';
    html += '<textarea class="moments-prompt-ta" data-field="char-momentGenPrompt" data-cid="' + escapeHtml(charId) + '" rows="4">' + escapeHtml(sc.momentGenPrompt || DEFAULT_MOMENT_GEN_PROMPT) + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="reset-char-prompt" data-field="momentGenPrompt" data-cid="' + escapeHtml(charId) + '">恢复默认</button><button class="moments-btn ghost" data-action="preview-moment-gen-prompt" data-cid="' + escapeHtml(charId) + '">预览</button></div>';
    html += '</div></details>';
    // 发圈后主动私聊 user（per-char 开关 + 提示词）
    html += '<details class="moments-fold"><summary>发圈后主动私聊 user</summary><div class="moments-fold-bd">';
    html += '<div class="moments-row"><div class="moments-row-label">开启主动私聊判断<span class="moments-sec-hint">关闭则不判断不私聊</span></div><div class="moments-sw' + (sc.dmAfterPost ? ' on' : '') + '" data-action="toggle-dm-after-post" data-cid="' + escapeHtml(charId) + '"><i></i></div></div>';
    html += '<div class="moments-row"><div class="moments-row-label">仅当 user @ 该 char 时触发<span class="moments-sec-hint">开启后只有被 @ 才做判断</span></div><div class="moments-sw' + (sc.dmOnlyMentioned ? ' on' : '') + '" data-action="toggle-dm-only-mentioned" data-cid="' + escapeHtml(charId) + '"><i></i></div></div>';
    html += '<div class="moments-hint">AI 依据该提示词判断是否私聊，并直接输出 char 想说的话（所有开启的 char 会合并成一次请求判断）；判断为「私聊」时会直接写入聊天，并弹提示「XX 私信了您」。变量：{charName} {userName} {postText} {commentText} {activity} {ts}。</div>';
    html += '<div class="moments-sec-title">主动私聊判断提示词<span class="moments-sec-hint">可编辑/预览；清空=恢复默认</span></div>';
    html += '<textarea class="moments-prompt-ta" data-field="char-dmPrompt" data-cid="' + escapeHtml(charId) + '" rows="5">' + escapeHtml(sc.dmPrompt || DEFAULT_DM_PROMPT) + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="reset-char-prompt" data-field="dmPrompt" data-cid="' + escapeHtml(charId) + '">恢复默认</button><button class="moments-btn ghost" data-action="preview-dm-prompt" data-cid="' + escapeHtml(charId) + '">预览</button></div>';
    html += '</div></details>';
    // 朋友圈总结（per-char，省 token）
    html += '<details class="moments-fold"><summary>朋友圈总结<span class="moments-sec-hint">被总结范围注入时只发总结</span></summary><div class="moments-fold-bd">';
    html += '<div class="moments-hint">与「' + escapeHtml(sc.charName) + '」聊天时，注入给 AI 的朋友圈内容按以下配置执行。总结只针对该 char 可见的朋友圈（陌生/不认识者的动态自动排除），第 1 条 = 该 char 可见的最新一条；总结结果可审核编辑后保存，保存后该范围原文隐藏只发总结，其余朋友圈照常发原文。</div>';
    html += '<div class="moments-sec-title">总结提示词模板<span class="moments-sec-hint">变量 {from} {to} {count}；已预填默认模板，可编辑；清空=恢复默认</span></div>';
    html += '<textarea class="moments-prompt-ta" data-field="char-summaryPrompt" data-cid="' + escapeHtml(charId) + '" rows="3">' + escapeHtml(sc.summaryPrompt || DEFAULT_SUMMARY_PROMPT) + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="reset-char-prompt" data-field="summaryPrompt" data-cid="' + escapeHtml(charId) + '">恢复默认</button></div>';
    html += '<div class="moments-row"><div class="moments-row-label">注入朋友圈条数上限<span class="moments-sec-hint">省 token</span></div><input class="moments-input" type="number" min="1" max="50" value="' + (parseInt(sc.maxFeed, 10) || DEFAULT_FEED_MAX) + '" data-field="char-maxFeed" data-cid="' + escapeHtml(charId) + '"></div>';
    html += '<div class="moments-row"><div class="moments-row-label">包含评论</div><div class="moments-sw' + (sc.includeComments !== false ? ' on' : '') + '" data-action="toggle-char-sum-comments" data-cid="' + escapeHtml(charId) + '"><i></i></div></div>';
    html += '<div class="moments-hint">「发送图片模式」已改为**插件全局设置**（侧边栏「AI 提示词」面板），所有 char 读取图片统一按全局设定：文字图（生图提示词）/ 识图（发送图片本体给模型）。</div>';
    html += '<div class="moments-range-row"><div class="moments-row-label">总结范围：从第</div><input class="moments-input sm" type="number" min="1" value="' + (sc.sumFrom || 1) + '" data-field="char-sumFrom" data-cid="' + escapeHtml(charId) + '"><div class="moments-row-label">条 到 第</div><input class="moments-input sm" type="number" min="1" value="' + (sc.sumTo || 3) + '" data-field="char-sumTo" data-cid="' + escapeHtml(charId) + '"><div class="moments-row-label">条（第1条=最新）</div></div>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="preview-summary-content" data-cid="' + escapeHtml(charId) + '">预览待总结内容</button><button class="moments-btn" data-action="request-char-summary" data-cid="' + escapeHtml(charId) + '">请求 AI 总结</button></div>';
    var sums = sc.summaries || [];
    if (!sums.length) html += '<div class="moments-empty">该 char 还没有已保存的总结</div>';
    sums.forEach(function (s) {
      html += '<div class="moments-sum-item">';
      html += '<div class="moments-sum-hd"><span>第 ' + s.from + '-' + s.to + ' 条' + (s.includeComments === false ? '' : '（含评论）') + '</span><span class="moments-sum-time">' + formatTime(s.updatedAt || s.createdAt) + '</span></div>';
      html += '<div class="moments-sum-body">' + escapeHtml((s.summary || '').slice(0, 120)) + (s.summary && s.summary.length > 120 ? '…' : '') + '</div>';
      html += '<div class="moments-sum-btns"><span class="mm-btn" data-action="view-summary" data-cid="' + escapeHtml(charId) + '" data-sid="' + escapeHtml(s.id) + '">查看/编辑</span><span class="mm-btn danger" data-action="del-summary" data-cid="' + escapeHtml(charId) + '" data-sid="' + escapeHtml(s.id) + '">删除</span></div>';
      html += '</div>';
    });
    html += '</div></details>';
    // 记忆同步
    html += '<details class="moments-fold"><summary>记忆同步</summary><div class="moments-fold-bd">';
    html += '<div class="moments-hint">点击「检查并同步」不会直接写入：插件先自动检查该 char 近期是否有朋友圈行为（发圈/评论/点赞），以及这些行为是否已全部/部分写入事实记忆，然后弹窗提醒你，经你确认后才执行同步。同步内容自动按该 char 可见范围筛选（不含陌生/不认识者的动态）。</div>';
    html += '<div class="moments-sec-title">记忆同步提示词<span class="moments-sec-hint">变量 {charName}；已预填默认模板，可编辑；清空=恢复默认</span></div>';
    html += '<textarea class="moments-prompt-ta" data-field="char-syncPrompt" data-cid="' + escapeHtml(charId) + '" rows="3">' + escapeHtml(sc.syncPrompt || DEFAULT_SYNC_PROMPT) + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="reset-char-prompt" data-field="syncPrompt" data-cid="' + escapeHtml(charId) + '">恢复默认</button></div>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="preview-sync-content" data-cid="' + escapeHtml(charId) + '">预览待同步内容</button><button class="moments-btn" data-action="sync-fact-now" data-cid="' + escapeHtml(charId) + '">检查并同步到事实记忆</button></div>';
    html += '</div></details>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="close-mem-mount">完成</button></div>';
    return html + '</div></div></div>';
  }

  function renderSubApiPanel() {
    var html = '<div class="moments-modal-mask" data-action="close-subapi"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">副 API 设置</div><div class="moments-modal-x" data-action="close-subapi">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">兼容 OpenAI 格式。可保存多个预设，同时只能启用一个。不启用则默认走 roche.ai.chat。</div>';
    state.subapi.forEach(function (p) {
      html += '<div class="moments-sa' + (p.enabled ? ' active' : '') + '"><div class="moments-sa-info"><div class="moments-sa-name">' + escapeHtml(p.name) + '</div><div class="moments-sa-sub">' + escapeHtml(p.url) + ' · ' + escapeHtml(p.model) + '</div></div><div class="moments-sa-btns"><button class="mm-btn' + (p.enabled ? ' on' : '') + '" data-action="enable-subapi" data-id="' + escapeHtml(p.id) + '">' + (p.enabled ? '已启用' : '启用') + '</button><button class="mm-btn danger" data-action="del-subapi" data-id="' + escapeHtml(p.id) + '">删除</button></div></div>';
    });
    html += '<div class="moments-div"></div><div class="moments-sec-title">新建预设</div>';
    html += '<div class="moments-form"><label>名称<input class="moments-input" id="moments-sa-name" placeholder="如 OpenAI / DeepSeek"></label><label>Base URL<input class="moments-input" id="moments-sa-url" placeholder="https://api.openai.com/v1"></label><label>API Key<input class="moments-input" id="moments-sa-key" type="password" placeholder="sk-..."></label><div class="moments-form-row"><label>模型<select class="moments-input" id="moments-sa-model"><option value="">先点刷新获取</option></select></label><button class="moments-btn ghost" data-action="refresh-models">刷新模型</button></div><button class="moments-btn" data-action="save-subapi">保存预设</button></div>';
    return html + '</div></div></div>';
  }

  function renderMoodPromptsModal(space) {
    var cp = getSpacePrompts(space);
    var html = '<div class="moments-modal-mask" data-action="close-mood-prompts"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">朋友圈氛围提示词 — ' + escapeHtml(space.userPersonaName || '') + '</div><div class="moments-modal-x" data-action="close-mood-prompts">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">留空则不注入。只影响 AI 生成的氛围倾向，不改变输出格式。三栏分别对应：char 发朋友圈、char 评论、NPC 评论。每个 char 的「朋友圈人设」请在对应 char 的「记忆挂载与总结」面板或侧边栏「总提示词」中设置。全部提示词也可在侧边栏「总提示词」集中查看/编辑。</div>';
    html += '<div class="moments-mood-label">char 发朋友圈</div>';
    html += '<div class="moments-mood-hint">如：朋友圈少一点争吵，多一些日常分享 / 喜欢在朋友圈抬杠吐槽</div>';
    html += '<textarea class="moments-mood-ta" data-field="mood-charPost" placeholder="留空=不注入">' + escapeHtml(cp.charPost) + '</textarea>';
    html += '<div class="moments-mood-label">char 评论</div>';
    html += '<div class="moments-mood-hint">如：char 评论时温和一些，少抬杠 / 评论尖锐一点更有性格</div>';
    html += '<textarea class="moments-mood-ta" data-field="mood-charComment" placeholder="留空=不注入">' + escapeHtml(cp.charComment) + '</textarea>';
    html += '<div class="moments-mood-label">NPC 评论</div>';
    html += '<div class="moments-mood-hint">如：NPC 评论热闹一些，可以互相接梗 / NPC 安静围观为主</div>';
    html += '<textarea class="moments-mood-ta" data-field="mood-npcComment" placeholder="留空=不注入">' + escapeHtml(cp.npcComment) + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="close-mood-prompts">完成</button></div>';
    return html + '</div></div></div>';
  }

  // 关系网 SVG 蛛网预览：user 居中，char 圆周均匀分布，char 间有向关系带箭头
  function renderRelationNetSvg(space) {
    var chars = (space.chars || []).slice();
    var n = chars.length;
    var cx = 200, cy = 200, r = 140;
    // 计算每个 char 的坐标
    var pos = {};
    chars.forEach(function (sc, i) {
      var angle = (2 * Math.PI * i / Math.max(n, 1)) - Math.PI / 2;
      pos[sc.charId] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), name: sc.charName };
    });
    // user 节点居中，加入 pos 映射以便 user↔char 有向关系能绘制
    pos[USER_NODE_ID] = { x: cx, y: cy, name: space.userPersonaName || 'user' };
    var svg = '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:380px;height:auto;display:block;margin:0 auto;">';
    // defs：箭头 marker
    svg += '<defs><marker id="relArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="rgb(255,92,92)"/></marker></defs>';
    // user-char 绑定虚线
    chars.forEach(function (sc) {
      var p = pos[sc.charId];
      svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p.x.toFixed(1) + '" y2="' + p.y.toFixed(1) + '" stroke="rgb(200,200,200)" stroke-width="1" stroke-dasharray="3,3"/>';
    });
    // char-char 有向关系
    (space.relations || []).forEach(function (rel) {
      var from = pos[rel.fromCid], to = pos[rel.toCid];
      if (!from || !to) return;
      // 缩短线段避免箭头插入节点圆内
      var dx = to.x - from.x, dy = to.y - from.y;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var ux = dx / dist, uy = dy / dist;
      var x1 = from.x + ux * 26, y1 = from.y + uy * 26;
      var x2 = to.x - ux * 30, y2 = to.y - uy * 30;
      svg += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="rgb(255,92,92)" stroke-width="2" marker-end="url(#relArrow)"/>';
      // 标签居中
      var mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2 - 6;
      svg += '<text x="' + mx.toFixed(1) + '" y="' + my.toFixed(1) + '" text-anchor="middle" font-size="11" fill="rgb(255,92,92)">' + escapeHtml(rel.label || '') + '</text>';
    });
    // user 节点
    var userLabel = (space.userIdentity || 'user').slice(0, 4);
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="30" fill="rgb(77,171,247)" stroke="white" stroke-width="2"/>';
    svg += '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" font-size="13" fill="white" font-weight="bold">' + escapeHtml(userLabel) + '</text>';
    // char 节点
    chars.forEach(function (sc) {
      var p = pos[sc.charId];
      svg += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="24" fill="rgb(255,169,77)" stroke="white" stroke-width="2"/>';
      svg += '<text x="' + p.x.toFixed(1) + '" y="' + (p.y + 4).toFixed(1) + '" text-anchor="middle" font-size="11" fill="white" font-weight="bold">' + escapeHtml(p.name.slice(0, 2)) + '</text>';
    });
    svg += '</svg>';
    return svg;
  }

  function renderRelationNetModal(space) {
    var chars = (space.chars || []).slice();
    var html = '<div class="moments-modal-mask" data-action="close-relation-net"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">关系网 — ' + escapeHtml(space.userPersonaName || '') + '</div><div class="moments-modal-x" data-action="close-relation-net">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    // 蛛网预览
    html += '<div class="moments-sec-title">蛛网预览</div>';
    if (!chars.length) {
      html += '<div class="moments-empty">尚未绑定任何 char，无法显示关系网</div>';
    } else {
      html += '<div class="moments-relation-svg">' + renderRelationNetSvg(space) + '</div>';
    }
    html += '<div class="moments-div"></div>';
    // user 身份
    html += '<div class="moments-sec-title">user 身份<span class="moments-sec-hint">设定你自己的身份信息</span></div>';
    html += '<input class="moments-input" data-field="rel-user-identity" placeholder="如：公司老板 / 大学生 / 自由职业者" value="' + escapeHtml(space.userIdentity || '') + '">';
    html += '<div class="moments-div"></div>';
    // 各 char 身份
    html += '<div class="moments-sec-title">char 身份<span class="moments-sec-hint">为每个绑定的 char 设定身份</span></div>';
    if (!chars.length) {
      html += '<div class="moments-empty">尚未绑定 char</div>';
    } else {
      chars.forEach(function (sc) {
        html += '<div class="moments-row"><div class="moments-row-label">' + escapeHtml(sc.charName) + '</div>';
        html += '<input class="moments-input" data-field="rel-char-identity" data-cid="' + escapeHtml(sc.charId) + '" placeholder="如：user 的徒弟 / 公司同事" value="' + escapeHtml(sc.customIdentity || '') + '"></div>';
      });
    }
    html += '<div class="moments-div"></div>';
    // 关系（可含 user↔char）
    html += '<div class="moments-sec-title">关系<span class="moments-sec-hint">有向关系（A→B），可连接 user 与 char，如师父、恋人、死对头</span></div>';
    var rels = space.relations || [];
    if (rels.length) {
      rels.forEach(function (rel) {
        var fromName = nodeDisplayName(space, rel.fromCid);
        var toName = nodeDisplayName(space, rel.toCid);
        html += '<div class="moments-npc-item"><div class="moments-npc-item-info"><div class="moments-npc-item-name">' + escapeHtml(fromName) + ' → ' + escapeHtml(toName) + ' <span style="color:#999;font-weight:normal;">（' + escapeHtml(rel.label) + '）</span></div></div><button class="mm-btn danger" data-action="relation-del" data-rel-id="' + escapeHtml(rel.id) + '">删除</button></div>';
      });
    } else {
      html += '<div class="moments-empty">尚未添加关系</div>';
    }
    // 添加关系表单（至少 1 个 char 即可，支持 user↔char）
    if (chars.length >= 1) {
      html += '<div class="moments-div"></div><div class="moments-sec-title">添加关系</div>';
      html += '<div class="moments-form"><label>从<select class="moments-input" id="rel-from">';
      html += '<option value="' + USER_NODE_ID + '">user（' + escapeHtml(space.userPersonaName || '') + '）</option>';
      chars.forEach(function (sc) { html += '<option value="' + escapeHtml(sc.charId) + '">' + escapeHtml(sc.charName) + '</option>'; });
      html += '</select></label><label>到<select class="moments-input" id="rel-to">';
      html += '<option value="' + USER_NODE_ID + '">user（' + escapeHtml(space.userPersonaName || '') + '）</option>';
      chars.forEach(function (sc) { html += '<option value="' + escapeHtml(sc.charId) + '">' + escapeHtml(sc.charName) + '</option>'; });
      html += '</select></label><label>关系标签<input class="moments-input" id="rel-label" placeholder="如：师父/恋人/死对头"></label><button class="moments-btn" data-action="relation-add">添加</button></div>';
    } else {
      html += '<div class="moments-hint">至少绑定 1 个 char 才能添加关系</div>';
    }
    // AI 自动生成关系网
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-sec-title">AI 自动生成关系网<span class="moments-sec-hint">提示词可自定义；结果可审核编辑</span></div>';
    html += '<textarea class="moments-prompt-ta" data-field="rel-gen-prompt" rows="4">' + escapeHtml(((space.customPrompts && space.customPrompts.relationGenPrompt) || '').trim() || DEFAULT_RELATION_GEN_PROMPT) + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="reset-rel-gen-prompt">恢复默认</button></div>';
    html += '<div class="moments-hint">可见性规则：char 之间默认互相不可见朋友圈/评论/点赞，只有关系标签包含「好友/已加好友」才互相可见（如「已加好友·恋人」）；user↔char 默认可见，标注「陌生/不认识」则不可见。</div>';
    if (state.relGenLoading) {
      html += '<div class="moments-empty"><div class="moments-spin">' + WINDMILL_SVG + '</div><div>正在生成关系网...</div></div>';
    }
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="open-rel-preview">预览关系网提示词</button><button class="moments-btn" data-action="rel-gen">AI 生成关系网</button></div>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="close-relation-net">完成</button></div>';
    return html + '</div></div></div>';
  }

  // 关系网提示词预览
  function renderRelationNetPreviewModal(space) {
    var line = relationNetLine(space);
    var html = '<div class="moments-modal-mask" data-action="close-rel-preview"><div class="moments-modal" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">关系网注入 AI 的提示词</div><div class="moments-modal-x" data-action="close-rel-preview">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">该内容会拼进朋友圈生成、评论、召唤评论与聊天上下文中（如果设置了的话）。</div>';
    html += '<pre class="moments-preview">' + escapeHtml(line || '（关系网未设置任何身份或关系，不会注入提示词）') + '</pre>';
    html += '<div class="moments-hint">可见性规则：char 之间默认互相不可见朋友圈/评论/点赞，仅「好友/已加好友」互相可见；user↔char 默认可见，标注「陌生/不认识」则不可见。</div>';
    html += '<div class="moments-btn-row"><button class="moments-btn" data-action="close-rel-preview">完成</button></div>';
    return html + '</div></div></div>';
  }

  // 审核 AI 生成的关系网（可编辑标签、删除，保存后生效）
  function renderRelGenReviewModal(space) {
    var d = state.relGenDraft; if (!d) return '';
    var html = '<div class="moments-modal-mask" data-action="close-rel-gen-review"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">审核生成的关系网</div><div class="moments-modal-x" data-action="close-rel-gen-review">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">可编辑每条关系标签或删除不需要的关系；保存后立即生效。「陌生/不认识」会使双方朋友圈默认互相不可见。</div>';
    var items = d.items || [];
    if (!items.length) html += '<div class="moments-empty">没有可审核的关系</div>';
    items.forEach(function (it, idx) {
      html += '<div class="moments-sum-item"><div class="moments-sum-hd"><span>' + escapeHtml(it.fromName) + ' → ' + escapeHtml(it.toName) + '</span><span class="mm-btn danger" data-action="rel-gen-del" data-idx="' + idx + '">删除</span></div>';
      html += '<input class="moments-input" id="rel-ed-label-' + idx + '" value="' + escapeHtml(it.label) + '" placeholder="关系标签">';
      html += '</div>';
    });
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="close-rel-gen-review">取消</button><button class="moments-btn ghost" data-action="rel-gen-again">重新生成</button><button class="moments-btn" data-action="rel-gen-apply">保存全部</button></div>';
    return html + '</div></div></div>';
  }

  function renderNpcModal(space, charId) {
    var sc = getSpaceChar(space, charId); if (!sc) return '';
    var npcs = getCharNpcs(sc);
    var html = '<div class="moments-modal-mask" data-action="close-npc-modal"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">' + escapeHtml(sc.charName) + ' 的 NPC 好友</div><div class="moments-modal-x" data-action="close-npc-modal">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">NPC 是氛围组：该 char 发朋友圈时会评论其动态；开启下方开关后，该 char 的朋友圈被「召唤评论」时 NPC 也会一起出现。</div>';
    html += '<div class="moments-row"><div class="moments-row-label">召唤评论时 NPC 参与<span class="moments-sec-hint">默认开启</span></div><div class="moments-sw' + (sc.npcSummon ? ' on' : '') + '" data-action="toggle-npc-summon" data-cid="' + escapeHtml(charId) + '"><i></i></div></div>';
    html += '<div class="moments-row"><div class="moments-row-label">NPC 提示词注入聊天上下文<span class="moments-sec-hint">默认开启</span></div><div class="moments-sw' + (sc.npcPromptInject ? ' on' : '') + '" data-action="toggle-npc-prompt-inject" data-cid="' + escapeHtml(charId) + '"><i></i></div></div>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="open-npc-prompt" data-cid="' + escapeHtml(charId) + '">NPC 提示词（合并预览/编辑）</button></div>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="open-npc-gen-prompt" data-cid="' + escapeHtml(charId) + '">生成 NPC 提示词（预览/编辑）</button></div>';
    html += '<div class="moments-sec-title">已绑定 NPC<span class="moments-sec-hint">共 ' + npcs.length + ' 个</span></div>';
    if (!npcs.length) html += '<div class="moments-empty">还没有绑定 NPC</div>';
    npcs.forEach(function (npc, idx) {
      html += '<div class="moments-npc-item"><div class="moments-npc-item-info"><div class="moments-npc-item-name">' + escapeHtml(npc.name) + '</div><div class="moments-npc-item-sub">' + escapeHtml(npc.bio || '') + '</div></div><div class="moments-npc-item-btns"><button class="mm-btn" data-action="npc-edit" data-cid="' + escapeHtml(charId) + '" data-idx="' + idx + '">编辑</button><button class="mm-btn danger" data-action="npc-unbind" data-cid="' + escapeHtml(charId) + '" data-idx="' + idx + '">解绑</button></div></div>';
    });
    html += '<div class="moments-hint">提示：点击 NPC 右侧「编辑」可修改该 NPC 的名字与人设。</div>';
    html += '<div class="moments-div"></div><div class="moments-sec-title">手动添加</div>';
    html += '<div class="moments-form"><label>名字<input class="moments-input" id="moments-npc-name" placeholder="如 小张"></label><label>一句话人设<input class="moments-input" id="moments-npc-bio" placeholder="如 char 的大学室友，爱开玩笑"></label><button class="moments-btn" data-action="npc-add" data-cid="' + escapeHtml(charId) + '">添加</button></div>';
    html += '<div class="moments-div"></div><div class="moments-sec-title">AI 生成建议<span class="moments-sec-hint">读取该 char 人设生成 4 个候选</span></div>';
    if (state.npcLoading) {
      html += '<div class="moments-empty">生成中...</div>';
    } else {
      html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="npc-generate" data-cid="' + escapeHtml(charId) + '">生成 4 个候选 NPC</button></div>';
      (state.npcSuggestions || []).forEach(function (s, idx) {
        html += '<div class="moments-npc-suggest"><div class="moments-npc-item-info"><div class="moments-npc-item-name">' + escapeHtml(s.name) + '</div><div class="moments-npc-item-sub">' + escapeHtml(s.bio || '') + '</div></div><button class="mm-btn" data-action="npc-bind" data-cid="' + escapeHtml(charId) + '" data-idx="' + idx + '">绑定</button></div>';
      });
    }
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="close-npc-modal">完成</button></div>';
    return html + '</div></div></div>';
  }
  // 长按已绑定 NPC → 编辑名字/人设
  function renderNpcEditModal(space) {
    if (!state.npcEditOpen) return '';
    var sc = space ? getSpaceChar(space, state.npcEditCharId) : null;
    var npc = (sc && sc.npcs) ? sc.npcs[state.npcEditIdx] : null;
    if (!npc) return '';
    // 窗口层级：编辑弹窗必须盖在 NPC 面板（moments-modal-mask z-index:60）之上
    var html = '<div class="moments-modal-mask" data-action="close-npc-edit" style="z-index:70;"><div class="moments-modal" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">编辑 NPC</div><div class="moments-modal-x" data-action="close-npc-edit">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-form"><label>名字<input class="moments-input" id="moments-npc-edit-name" value="' + escapeHtml(npc.name || '') + '" placeholder="NPC 名字"></label><label>一句话人设<textarea class="moments-prompt-ta" id="moments-npc-edit-bio" rows="3" placeholder="如 char 的大学室友，爱开玩笑">' + escapeHtml(npc.bio || '') + '</textarea></label></div>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="close-npc-edit">取消</button><button class="moments-btn" data-action="save-npc-edit" data-cid="' + escapeHtml(state.npcEditCharId) + '" data-idx="' + state.npcEditIdx + '">保存</button></div>';
    return html + '</div></div></div>';
  }

  function renderPostModal(space) {
    var subj = getCurrentSubject(); if (!subj) return '';
    return '<div class="moments-modal-mask" data-action="close-post-modal"><div class="moments-modal" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">发表</div><div class="moments-modal-x" data-action="close-post-modal">' + ICON.close + '</div></div><div class="moments-modal-bd">' +
      '<div class="moments-post-as">以 <b>' + escapeHtml(subj.name) + '</b> 发布</div>' +
      '<textarea class="moments-post-text" id="moments-post-text" placeholder="这一刻的想法..."></textarea>' +
      '<input class="moments-input moments-post-loc" id="moments-post-loc" placeholder="所在位置（可选）">' +
      '<div class="moments-post-imgs" id="moments-post-imgs"></div>' +
      '<div class="moments-post-tools"><span class="mp-tool" data-tool="ai">' + ICON.image + '<span>AI 生图</span></span><span class="mp-tool" data-tool="text">' + ICON.image + '<span>文字图</span></span><span class="mp-tool" data-tool="url">' + ICON.image + '<span>图片URL</span></span><label class="mp-tool" data-tool="file">' + ICON.image + '<span>本地图片</span><input type="file" accept="image/*" id="moments-post-file" style="display:none"></label></div>' +
      '<div class="moments-btn-row"><button class="moments-btn" data-action="publish-post">发表</button></div></div></div></div>';
  }

  function renderEditPostModal(space) {
    var post = null;
    for (var i = 0; i < state.posts.length; i++) {
      if (state.posts[i].id === state.editPostId) { post = state.posts[i]; break; }
    }
    if (!post) return '';
    var name = post.authorName;
    return '<div class="moments-modal-mask" data-action="close-edit-modal"><div class="moments-modal" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">编辑</div><div class="moments-modal-x" data-action="close-edit-modal">' + ICON.close + '</div></div><div class="moments-modal-bd">' +
      '<div class="moments-post-as">以 <b>' + escapeHtml(name) + '</b> 编辑</div>' +
      '<textarea class="moments-post-text" id="moments-post-text">' + escapeHtml(post.text || '') + '</textarea>' +
      '<input class="moments-input moments-post-loc" id="moments-post-loc" placeholder="所在位置（可选）" value="' + escapeHtml(post.location || '') + '">' +
      '<div class="moments-post-imgs" id="moments-post-imgs"></div>' +
      '<div class="moments-post-tools"><span class="mp-tool" data-tool="ai">' + ICON.image + '<span>AI 生图</span></span><span class="mp-tool" data-tool="text">' + ICON.image + '<span>文字图</span></span><span class="mp-tool" data-tool="url">' + ICON.image + '<span>图片URL</span></span><label class="mp-tool" data-tool="file">' + ICON.image + '<span>本地图片</span><input type="file" accept="image/*" id="moments-post-file" style="display:none"></label></div>' +
      '<div class="moments-btn-row"><button class="moments-btn" data-action="save-edit-post">保存</button></div></div></div></div>';
  }

  function renderUiPrefsModal() {
    var tb = state.uiPrefs.topbarH || 44;
    var bp = state.uiPrefs.bottomPad || 80;
    var sbh = state.uiPrefs.sbH || 50;
    var sbo = state.uiPrefs.sbOff || 0;
    var html = '<div class="moments-modal-mask" data-action="close-uiprefs"><div class="moments-modal" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">界面尺寸调整</div><div class="moments-modal-x" data-action="close-uiprefs">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">拖动滑块实时预览，设置自动保存，所有屏幕尺寸通用。</div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-row"><div class="moments-row-label">顶栏安全区域 <span class="moments-range-val" id="uipref-tb-val">' + tb + 'px</span></div>';
    html += '<input class="moments-range" type="range" min="0" max="80" step="1" value="' + tb + '" data-field="uipref-topbar"></div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-row"><div class="moments-row-label">底部安全边距 <span class="moments-range-val" id="uipref-bp-val">' + bp + 'px</span></div>';
    html += '<div class="moments-hint">为评论输入栏预留空间，防止遮挡底部朋友圈内容；不同屏幕均生效。</div>';
    html += '<input class="moments-range" type="range" min="0" max="240" step="2" value="' + bp + '" data-field="uipref-bottompad"></div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-row"><div class="moments-row-label">侧边栏标题背景高度 <span class="moments-range-val" id="uipref-sb-val">' + sbh + 'px</span></div>';
    html += '<div class="moments-hint">控制侧边栏顶部「朋友圈」与「×」所在标题栏的背景高度，吸顶显示不随滑动隐藏。</div>';
    html += '<input class="moments-range" type="range" min="0" max="120" step="1" value="' + sbh + '" data-field="uipref-sb"></div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-row"><div class="moments-row-label">「朋友圈」/「×」上下位置 <span class="moments-range-val" id="uipref-sb-off-val">' + sbo + 'px</span></div>';
    html += '<div class="moments-hint">正数下移、负数上移，在标题栏内上下调整标题与关闭按钮的位置。</div>';
    html += '<input class="moments-range" type="range" min="-40" max="40" step="1" value="' + sbo + '" data-field="uipref-sb-off"></div>';
    html += '<div class="moments-hint">实时预览（调整滑块可看到高度与位置变化）：</div>';
    html += '<div class="moments-sb-hd demo" id="uipref-sb-demo" style="height:' + sbh + 'px;"><div class="moments-sb-title">朋友圈</div><div class="moments-sb-close">' + ICON.close + '</div></div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="reset-uiprefs">恢复默认</button><button class="moments-btn" data-action="close-uiprefs">完成</button></div>';
    return html + '</div></div></div>';
  }
  function renderCommentInput() {
    var t = state.commentTarget; if (!t) return '';
    var post = null; for (var i = 0; i < state.posts.length; i++) if (state.posts[i].id === t.postId) { post = state.posts[i]; break; }
    if (!post) return '';
    var ph = t.replyToName ? '回复 ' + t.replyToName : '评论';
    var subj = getCurrentSubject();
    var sug = '';
    if (getChatConf().autoReply === false) {
      sug = '<div class="moments-cm-sug" id="moments-cm-sug" style="display:none;"></div>';
    }
    return '<div class="moments-cm-bar">' + sug + '<div class="moments-cm-row"><input class="moments-cm-input" id="moments-cm-text" placeholder="' + escapeHtml(ph) + '" autocomplete="off"><button class="moments-cm-send" data-action="send-comment">' + ICON.comment + '</button></div></div>';
  }
  // @ 快捷选择：关闭「发送后自动请求 AI 回复」时，输入 @ 后在输入栏上方出现可选角色
  function setupCommentInput() {
    var inp = $('#moments-cm-text', root); if (!inp || inp._bound) return;
    inp._bound = true;
    inp.addEventListener('input', function () { renderCommentSuggestions(); });
    var sug = $('#moments-cm-sug', root);
    if (sug) {
      sug.addEventListener('click', function (e) {
        var chip = e.target;
        while (chip && chip !== sug && !(chip.getAttribute && chip.getAttribute('data-sug'))) chip = chip.parentNode;
        if (!chip || !chip.getAttribute) return;
        var name = chip.getAttribute('data-sug');
        if (!name) return;
        var val = inp.value;
        var idx = val.lastIndexOf('@');
        var before = idx >= 0 ? val.slice(0, idx) : val;
        var rest = idx >= 0 ? val.slice(idx + 1).replace(/^[^\s]*/, '') : '';
        inp.value = before + '@' + name + rest;
        inp.focus();
        sug.style.display = 'none'; sug.innerHTML = '';
      });
    }
  }
  function renderCommentSuggestions() {
    var inp = $('#moments-cm-text', root); var sug = $('#moments-cm-sug', root);
    if (!inp || !sug) return;
    var val = inp.value;
    var idx = val.lastIndexOf('@');
    if (idx < 0) { sug.style.display = 'none'; sug.innerHTML = ''; return; }
    var after = val.slice(idx + 1);
    if (/\s/.test(after)) { sug.style.display = 'none'; sug.innerHTML = ''; return; }
    var space = Store.getActiveSpace();
    var list = [];
    if (space) {
      if (space.userPersonaName) list.push({ name: space.userPersonaName, label: 'user（' + space.userPersonaName + '）' });
      (space.chars || []).forEach(function (sc) {
        if (sc.commentEnabled) list.push({ name: sc.charName, label: sc.charName });
      });
    }
    var q = after.toLowerCase();
    var matched = list.filter(function (it) { return !q || it.name.toLowerCase().indexOf(q) >= 0; });
    if (!matched.length) { sug.style.display = 'none'; sug.innerHTML = ''; return; }
    sug.innerHTML = matched.map(function (it) {
      return '<span class="moments-cm-sug-i" data-sug="' + escapeHtml(it.name) + '">@' + escapeHtml(it.name) + ' ' + escapeHtml(it.label) + '</span>';
    }).join('');
    sug.style.display = 'flex';
  }

  function renderSubjectSheet(space) {
    var html = '<div class="moments-modal-mask" data-action="close-subject"><div class="moments-sheet" data-stop="1"><div class="moments-sheet-title">切换查看主体</div>';
    html += '<div class="moments-sheet-item' + (state.currentSubject === 'user' ? ' active' : '') + '" data-action="set-subject" data-sub="user"><div class="moments-avatar sm">' + (space.userPersonaAvatar ? '<img src="' + escapeHtml(space.userPersonaAvatar) + '">' : '<div class="moments-avatar-fb">' + escapeHtml((space.userPersonaName || '?').slice(0, 1)) + '</div>') + '</div><div class="moments-sheet-info"><div class="moments-sheet-name">' + escapeHtml(space.userPersonaName) + '</div><div class="moments-sheet-sub">user 视角（看全部）</div></div></div>';
    (space.chars || []).forEach(function (sc) {
      if (!sc.postEnabled && !sc.commentEnabled) return;
      html += '<div class="moments-sheet-item' + (state.currentSubject === sc.charId ? ' active' : '') + '" data-action="set-subject" data-sub="' + escapeHtml(sc.charId) + '"><div class="moments-avatar sm">' + (sc.charAvatar ? '<img src="' + escapeHtml(sc.charAvatar) + '">' : '<div class="moments-avatar-fb">' + escapeHtml((sc.charName || '?').slice(0, 1)) + '</div>') + '</div><div class="moments-sheet-info"><div class="moments-sheet-name">' + escapeHtml(sc.charName) + '</div><div class="moments-sheet-sub">char 视角（只看 ta 的）</div></div></div>';
    });
    return html + '</div></div>';
  }

  function renderLpSheet() {
    var lp = state.lpTarget;
    if (!lp) return '';
    var html = '<div class="moments-modal-mask" data-action="close-lp-sheet"><div class="moments-sheet" data-stop="1">';
    if (lp.type === 'comment') {
      html += '<div class="moments-sheet-title">评论操作</div>';
      html += '<div class="moments-sheet-item danger" data-action="lp-delete-comment" data-id="' + escapeHtml(lp.postId) + '" data-cid="' + escapeHtml(lp.commentId) + '">' + ICON.del + '<span>删除评论</span></div>';
    } else if (lp.type === 'likes') {
      html += '<div class="moments-sheet-title">删除点赞者</div>';
      var likesPost = null;
      for (var lpi = 0; lpi < state.posts.length; lpi++) if (state.posts[lpi].id === lp.postId) { likesPost = state.posts[lpi]; break; }
      var likesArr = (likesPost && likesPost.likes) ? likesPost.likes : [];
      if (!likesArr.length) html += '<div class="moments-empty">暂无点赞</div>';
      likesArr.forEach(function (lk) {
        html += '<div class="moments-sheet-item danger" data-action="lp-del-like" data-id="' + escapeHtml(lp.postId) + '" data-lkid="' + escapeHtml(lk.id) + '">' + ICON.del + '<span>删除 ' + escapeHtml(lk.name) + '</span></div>';
      });
    }
    html += '</div></div>';
    return html;
  }

  // 生图提示词查看/编辑 + 重新生成
  function renderImagePromptModal() {
    var v = state.imagePromptView; if (!v) return '';
    var html = '<div class="moments-modal-mask" data-action="close-image-prompt"><div class="moments-modal" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">生图提示词</div><div class="moments-modal-x" data-action="close-image-prompt">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">可查看/编辑发送给 Roche 当前生图配置（roche.ai.generateImage）的提示词，编辑后点「重新生成」会用新提示词重新生成。</div>';
    html += '<textarea class="moments-prompt-ta" id="image-prompt-editor" rows="5">' + escapeHtml(v.prompt || '') + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="close-image-prompt">取消</button><button class="moments-btn" data-action="save-image-prompt" data-id="' + escapeHtml(v.postId) + '" data-idx="' + v.idx + '">重新生成</button></div>';
    return html + '</div></div></div>';
  }
  // AI 生图图片右下角 more 菜单（重新生成 / 查看编辑提示词）
  function renderImageMenuModal() {
    var v = state.imageMenu; if (!v) return '';
    var html = '<div class="moments-modal-mask" data-action="close-image-menu"><div class="moments-sheet" data-stop="1">';
    html += '<div class="moments-sheet-title">AI 生图操作</div>';
    html += '<div class="moments-sheet-item" data-action="regen-image" data-id="' + escapeHtml(v.postId) + '" data-idx="' + v.idx + '">' + ICON.refresh + '<span>重新生成</span></div>';
    html += '<div class="moments-sheet-item" data-action="edit-image-prompt" data-id="' + escapeHtml(v.postId) + '" data-idx="' + v.idx + '">' + ICON.edit + '<span>查看/编辑提示词</span></div>';
    html += '</div></div>';
    return html;
  }
  // 点击已生成成功的图片 → 全屏放大查看（适配移动端屏幕；点击任意处关闭）
  function renderImageViewer() {
    var v = state.imageViewer; if (!v || !v.url) return '';
    return '<div class="moments-viewer" data-action="close-image-viewer">' +
      '<img src="' + escapeHtml(v.url) + '" alt="图片预览">' +
      '<span class="moments-viewer-x" data-action="close-image-viewer">' + ICON.close + '</span>' +
      '</div>';
  }
  // 待总结 / 待同步内容预览
  function renderContentPreviewModal() {
    var v = state.contentPreview; if (!v) return '';
    var html = '<div class="moments-modal-mask" data-action="close-content-preview"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">' + escapeHtml(v.title || '内容预览') + '</div><div class="moments-modal-x" data-action="close-content-preview">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += v.hint ? '<div class="moments-hint">' + escapeHtml(v.hint) + '</div>' : '<div class="moments-hint">以下为将要发送给 AI 的内容原文（已按该 char 可见范围自动筛选，不含陌生/不认识者的动态）。</div>';
    html += '<pre class="moments-preview">' + escapeHtml(v.text || '') + '</pre>';
    html += '<div class="moments-btn-row"><button class="moments-btn" data-action="close-content-preview">关闭</button></div>';
    return html + '</div></div></div>';
  }

  // per-char 合并 NPC 提示词编辑/预览（留空 = 使用默认模板）
  function renderNpcPromptModal(space, charId) {
    var sc = space ? getSpaceChar(space, charId) : null;
    if (!sc) return '';
    var html = '<div class="moments-modal-mask" data-action="close-npc-prompt"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">NPC 提示词 — ' + escapeHtml(sc.charName) + '（全部 NPC）</div><div class="moments-modal-x" data-action="close-npc-prompt">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">合并提示词会介绍该 char 所有绑定 NPC（名字/人设），并说明可对 TA 发布的朋友圈进行评论/点赞（只使用角色姓名，不使用账号名）。编辑框已预填默认模板（变量未替换版本，含 {charName}/{npcList}），可直接修改；点击「恢复默认」可还原为默认模板。</div>';
    html += '<textarea class="moments-prompt-ta" id="npc-prompt-editor" data-field="npc-roster-prompt" data-cid="' + escapeHtml(charId) + '" rows="10">' + escapeHtml(sc.npcPrompt || DEFAULT_NPC_ROSTER_PROMPT) + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="reset-npc-prompt" data-cid="' + escapeHtml(charId) + '">恢复默认</button><button class="moments-btn ghost" data-action="preview-npc-prompt" data-cid="' + escapeHtml(charId) + '">预览</button><button class="moments-btn" data-action="close-npc-prompt">完成</button></div>';
    return html + '</div></div></div>';
  }

  // NPC 生成提示词编辑/预览（留空 = 使用默认模板，只使用角色姓名）
  function renderNpcGenPromptModal(space, charId) {
    var sc = space ? getSpaceChar(space, charId) : null;
    if (!sc) return '';
    var html = '<div class="moments-modal-mask" data-action="close-npc-gen-prompt"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">生成 NPC 提示词 — ' + escapeHtml(sc.charName) + '</div><div class="moments-modal-x" data-action="close-npc-gen-prompt">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">自定义「AI 生成建议」时发送给 AI 的提示词。编辑框已预填默认模板，可直接修改；默认模板只使用角色姓名、不使用账号名。点击「恢复默认」可还原。</div>';
    html += '<textarea class="moments-prompt-ta" id="npc-gen-prompt-editor" data-field="npc-gen-prompt" data-cid="' + escapeHtml(charId) + '" rows="10">' + escapeHtml(sc.npcGenPrompt || DEFAULT_NPC_GEN_PROMPT) + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="reset-npc-gen-prompt" data-cid="' + escapeHtml(charId) + '">恢复默认</button><button class="moments-btn ghost" data-action="preview-npc-gen-prompt" data-cid="' + escapeHtml(charId) + '">预览</button><button class="moments-btn" data-action="close-npc-gen-prompt">完成</button></div>';
    return html + '</div></div></div>';
  }

  // 世界书词条选择：mode='global' 表示挂到空间级（侧边栏，所有 char 通用），
  // mode='local' 表示挂到该 char（记忆面板）；两种入口都展示全局+局部词条
  function renderWorldMountModal(space, charId, mode) {
    if (!space) return '';
    var isLocal = mode === 'local';
    var sc = isLocal ? getSpaceChar(space, charId) : null;
    var mounts = isLocal ? ((sc && sc.localWorldMounts) || []) : (space.worldMounts || []);
    var ownerLabel = isLocal ? (sc ? sc.charName : '') : (space.userPersonaName || '');
    var scopeLabel = isLocal ? '该 char' : '空间级（所有 char 通用）';
    var html = '<div class="moments-modal-mask" data-action="close-world-mount"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">选择世界书词条（全局/局部）— ' + escapeHtml(ownerLabel) + '</div><div class="moments-modal-x" data-action="close-world-mount">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">勾选后，「发一条」「召唤评论」「自动评论」等插件内生成都会读取这些词条（全局与局部均可选）；聊天中不会重复注入。' + (isLocal ? '（挂载到该 char，仅该 char 的生成流程读取）' : '（挂载到空间级，所有 char 的生成流程通用）') + '</div>';
    html += '<div class="moments-sec-title">已选 ' + mounts.length + ' 条</div>';
    if (!mounts.length) html += '<div class="moments-hint">（未选择）</div>';
    mounts.forEach(function (m, i) {
      html += '<div class="moments-sum-item"><div class="moments-sum-hd"><span>' + escapeHtml(m.entryName || m.entryId) + '</span><span class="mm-btn danger" data-action="remove-world-entry" data-mode="' + mode + '" data-cid="' + escapeHtml(charId || '') + '" data-idx="' + i + '">移除</span></div><div class="moments-sum-body">' + escapeHtml((m.text || '').slice(0, 80)) + '</div></div>';
    });
    if (state.worldLoading) {
      html += '<div class="moments-empty">正在加载世界书...</div>';
    } else if (!(state.worldCats || []).length) {
      html += '<div class="moments-empty">没有可用的世界书（或 Roche 当前未提供 worldbook 数据）</div>';
    } else {
      (state.worldCats || []).forEach(function (cat) {
        var catLabel = cat.name || cat.id;
        if (cat.scope === 'local') catLabel += '（局部）';
        else if (cat.scope === 'global') catLabel += '（全局）';
        html += '<div class="moments-sec-title">' + escapeHtml(catLabel) + '</div>';
        var entries = cat.entries || [];
        if (!entries.length) { html += '<div class="moments-hint">（该分类暂无词条）</div>'; return; }
        entries.forEach(function (e) {
          var eid = e.id;
          var checked = false;
          mounts.forEach(function (m) { if (m.entryId === eid && m.categoryId === cat.id) checked = true; });
          var ename = e.title || e.name || eid;
          html += '<div class="moments-row"><div class="moments-row-label">' + escapeHtml(ename) + '</div><div class="moments-sw' + (checked ? ' on' : '') + '" data-action="toggle-world-entry" data-mode="' + mode + '" data-cid="' + escapeHtml(charId || '') + '" data-cat="' + escapeHtml(cat.id) + '" data-entry="' + escapeHtml(eid) + '"><i></i></div></div>';
        });
      });
    }
    html += '<div class="moments-btn-row"><button class="moments-btn" data-action="close-world-mount">完成</button></div>';
    return html + '</div></div></div>';
  }

  function renderNotifPanel(space) {
    var html = '<div class="moments-modal-mask" data-action="close-notif"><div class="moments-modal" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">消息通知</div><div class="moments-modal-x" data-action="close-notif">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    var list = state.notifs.filter(function (n) { return !space || n.spaceId === space.id; });
    var cfgN = getChatConf();
    html += '<div class="moments-row"><div class="moments-row-label">保留通知条数（超过自动清理更旧的）</div><input class="moments-input" type="number" min="1" max="200" value="' + (cfgN.notifMax || 10) + '" data-field="notif-max"></div>';
    if (!list.length) html += '<div class="moments-empty">暂无通知</div>';
    list.forEach(function (n) {
      html += '<div class="moments-notif' + (n.read ? '' : ' unread') + '" data-action="open-notif-item" data-id="' + escapeHtml(n.id) + '"><div class="moments-avatar sm">' + (n.fromAvatar ? '<img src="' + escapeHtml(n.fromAvatar) + '">' : '<div class="moments-avatar-fb">' + escapeHtml((n.fromName || '?').slice(0, 1)) + '</div>') + '</div><div class="moments-notif-info"><div class="moments-notif-text"><b>' + escapeHtml(n.fromName) + '</b> ' + escapeHtml(n.text) + '</div><div class="moments-notif-time">' + formatTime(n.createdAt) + '</div></div></div>';
    });
    if (list.length) html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="clear-notifs">清空通知</button></div>';
    return html + '</div></div></div>';
  }

  // ========== 长按检测 ==========
  var LP_DELAY = 500;
  var LP_MOVE_THRESHOLD = 10;

  function findLpAnchor(el) {
    while (el && el !== root) {
      if (el.getAttribute) {
        // 排除：···按钮、图片、帖子头像、作者名、操作气泡
        if (el.getAttribute('data-action') === 'open-acts') return null;
        if (el.getAttribute('data-action') === 'view-photo') return null;
        if (el.getAttribute('data-action') === 'toggle-text') return null;
        if (el.classList && el.classList.contains('moment-avatar')) return null;
        if (el.getAttribute('data-action') === 'view-author') return null;
        if (el.classList && el.classList.contains('moment-act-pop')) return null;
        // 封面头像长按 → 已移除（导致第二次侧边栏点击失效）
        // 改为双击标题打开侧边栏
        // 评论锚点（优先，嵌套在帖子内）
        if (el.classList && el.classList.contains('mc')) {
          var cid = el.getAttribute('data-cid');
          var pid = el.getAttribute('data-id');
          if (cid && pid) return { type: 'comment', postId: pid, commentId: cid, anchor: el };
        }
        // 点赞区锚点：长按可删除单个/多个点赞者
        if (el.classList && el.classList.contains('moment-likes')) {
          var lpid = el.getAttribute('data-id');
          if (lpid) return { type: 'likes', postId: lpid, anchor: el };
        }
      }
      el = el.parentNode;
    }
    return null;
  }

  function onLpStart(e) {
    if (e.type === 'touchstart') _lpTouchActive = true;
    if (e.type === 'mousedown' && _lpTouchActive) return;
    if (state.lpSheetOpen || state.sidebarOpen) return;
    if (_lpTimer) { clearTimeout(_lpTimer); _lpTimer = null; }
    var touch = e.touches ? e.touches[0] : e;
    _lpStartX = touch.clientX;
    _lpStartY = touch.clientY;
    var lpInfo = findLpAnchor(e.target);
    if (!lpInfo) return;
    _lpTimer = setTimeout(function () {
      _lpTimer = null;
      if (lpInfo.anchor) {
        lpInfo.anchor.classList.add('lp-active');
        setTimeout(function () { if (lpInfo.anchor) lpInfo.anchor.classList.remove('lp-active'); }, 200);
      }
      var lpTarget = { type: lpInfo.type, postId: lpInfo.postId, commentId: lpInfo.commentId || null, idx: lpInfo.idx != null ? lpInfo.idx : null, charId: lpInfo.charId || null, npcIdx: lpInfo.npcIdx != null ? lpInfo.npcIdx : null };
      _pendingLpAction = function () { state.lpTarget = lpTarget; state.lpSheetOpen = true; render(); };
    }, LP_DELAY);
  }

  function onLpEnd(e) {
    if (e && (e.type === 'touchend' || e.type === 'touchcancel')) _lpTouchActive = false;
    if (_lpTimer) { clearTimeout(_lpTimer); _lpTimer = null; }
    if (_pendingLpAction) {
      var action = _pendingLpAction;
      _pendingLpAction = null;
      action();
    }
  }

  function onLpMove(e) {
    if (!_lpTimer) return;
    var touch = e.touches ? e.touches[0] : e;
    var dx = touch.clientX - _lpStartX;
    var dy = touch.clientY - _lpStartY;
    if (dx * dx + dy * dy > LP_MOVE_THRESHOLD * LP_MOVE_THRESHOLD) {
      clearTimeout(_lpTimer); _lpTimer = null;
    }
  }

  function onLpCancel(e) {
    if (_lpTimer) { clearTimeout(_lpTimer); _lpTimer = null; }
    if (_pendingLpAction) {
      var action = _pendingLpAction;
      _pendingLpAction = null;
      action();
    }
  }

  // ========== 事件 ==========
  // 关键修复：所有事件绑在 document 捕获阶段，不依赖 root
  // 原因：第二次打开侧边栏后 root 上的监听器可能因 WebView bug 失效
  // 只有当事件 target 在 root 内时才处理
  function inRoot(el) {
    return !!(root && el && (el === root || (root.contains && root.contains(el))));
  }
  function wrapInRoot(handler) {
    return function (e) {
      if (!inRoot(e.target)) return;
      handler.call(root, e);
    };
  }
  var _docHandlers = {};
  function bindEvents() {
    if (!root || _docHandlers.bound) return;
    _docHandlers.click = wrapInRoot(onRootClick);
    _docHandlers.dblclick = wrapInRoot(onRootDblClick);
    _docHandlers.change = wrapInRoot(onRootChange);
    _docHandlers.input = wrapInRoot(onRootChange);
    _docHandlers.touchstart = wrapInRoot(onLpStart);
    _docHandlers.touchend = wrapInRoot(onLpEnd);
    _docHandlers.touchcancel = wrapInRoot(onLpEnd);
    _docHandlers.touchmove = wrapInRoot(onLpMove);
    _docHandlers.mousedown = wrapInRoot(onLpStart);
    _docHandlers.mouseup = wrapInRoot(onLpEnd);
    document.addEventListener('click', _docHandlers.click, { capture: true });
    document.addEventListener('dblclick', _docHandlers.dblclick, { capture: true });
    document.addEventListener('change', _docHandlers.change, { capture: true });
    document.addEventListener('input', _docHandlers.input, { capture: true });
    document.addEventListener('touchstart', _docHandlers.touchstart, { capture: true, passive: false });
    document.addEventListener('touchend', _docHandlers.touchend, { capture: true });
    document.addEventListener('touchcancel', _docHandlers.touchcancel, { capture: true });
    document.addEventListener('touchmove', _docHandlers.touchmove, { capture: true, passive: true });
    document.addEventListener('mousedown', _docHandlers.mousedown, { capture: true });
    document.addEventListener('mouseup', _docHandlers.mouseup, { capture: true });
    _docHandlers.bound = true;
  }
  function closestEl(el, attr, val) {
    while (el && el !== root) {
      var a = el.getAttribute ? el.getAttribute(attr) : null;
      if (a != null && (val == null || a === val)) return el;
      el = el.parentNode;
    }
    return null;
  }
  function did(el, attr) { var n = closestEl(el, attr); return n ? n.getAttribute(attr) : null; }
  // 双击：仅顶栏标题触发侧边栏
  function onRootDblClick(e) {
    var t = e.target;
    var dblEl = closestEl(t, 'data-dbl');
    if (!dblEl) return;
    var dbl = dblEl.getAttribute('data-dbl');
    if (dbl === 'open-sidebar') { state.sidebarOpen = true; render(); }
  }
  function onRootClick(e) {
    var t = e.target;
    // 优先识别“更多”按钮：more 位于可点击（toggle-text）的文字图卡片内部，
    // 必须先分发 open-image-menu，否则会被下面的文字图 toggle 分支吞掉导致无法点击
    var isMoreBtn = closestEl(t, 'data-action', 'open-image-menu');
    if (!isMoreBtn) {
      // 文字图点击：直接 toggle class，不 render
      var textToggle = closestEl(t, 'data-action', 'toggle-text');
      if (textToggle) { textToggle.classList.toggle('revealed'); return; }
    }
    // 点击气泡外部时关闭已打开的操作气泡（点"··"按钮或气泡内部不关）
    var isActsBtn = closestEl(t, 'data-action', 'open-acts');
    if (!isActsBtn) {
      var pops = root.querySelectorAll('.moment-act-pop.open');
      if (pops.length) {
        var inPop = false;
        for (var i = 0; i < pops.length; i++) { if (pops[i].contains(t)) { inPop = true; break; } }
        if (!inPop) {
          for (var j = 0; j < pops.length; j++) { pops[j].classList.remove('open'); pops[j].innerHTML = ''; }
        }
      }
    }
    // 遍历至 root：若中途遇到 data-stop="1" 则阻止冒泡到 mask 的关闭动作
    // 但若先遇到 data-action，则正常触发（modal 内部按钮自身带 data-action）
    var el = t;
    while (el && el !== root) {
      if (el.getAttribute && el.getAttribute('data-stop') === '1') return;
      var a = el.getAttribute && el.getAttribute('data-action');
      if (a != null) { handleAction(a, t, e); return; }
      el = el.parentNode;
    }
  }
  function onRootChange(e) {
    var t = e.target; var field = t.getAttribute && t.getAttribute('data-field'); if (!field) return;
    // 界面尺寸滑块实时预览（input 事件持续触发；change 事件释放时再持久化）
    if (field === 'uipref-topbar' || field === 'uipref-bottompad' || field === 'uipref-sb' || field === 'uipref-sb-off') {
      var val = parseInt(t.value, 10); if (isNaN(val)) return;
      var rootEl = root.querySelector('.' + ROOT_CLASS);
      if (field === 'uipref-topbar') {
        state.uiPrefs.topbarH = val;
        if (rootEl) rootEl.style.setProperty('--topbar-pad', val + 'px');
        var tbValEl = $('#uipref-tb-val', root); if (tbValEl) tbValEl.textContent = val + 'px';
      } else if (field === 'uipref-bottompad') {
        state.uiPrefs.bottomPad = val;
        if (rootEl) rootEl.style.setProperty('--bottom-pad', val + 'px');
        var bpValEl = $('#uipref-bp-val', root); if (bpValEl) bpValEl.textContent = val + 'px';
      } else if (field === 'uipref-sb') {
        state.uiPrefs.sbH = val;
        if (rootEl) rootEl.style.setProperty('--sb-h', val + 'px');
        var demoEl = $('#uipref-sb-demo', root); if (demoEl) demoEl.style.height = val + 'px';
        var sbValEl = $('#uipref-sb-val', root); if (sbValEl) sbValEl.textContent = val + 'px';
      } else {
        state.uiPrefs.sbOff = val;
        if (rootEl) rootEl.style.setProperty('--sb-off', val + 'px');
        var sbOffValEl = $('#uipref-sb-off-val', root); if (sbOffValEl) sbOffValEl.textContent = val + 'px';
      }
      if (e.type === 'change') Store.saveUiPrefs();
      return;
    }
    // 氛围提示词（space 级，无 cid，textarea 失焦时保存）
    if (field === 'mood-charPost' || field === 'mood-charComment' || field === 'mood-npcComment') {
      var sp0 = Store.getActiveSpace(); if (sp0) { sp0.customPrompts[field.replace('mood-', '')] = t.value; Store.saveSpaces(); }
      return;
    }
    // 关系网：user 身份（space 级，无 cid）
    if (field === 'rel-user-identity') {
      var spR = Store.getActiveSpace(); if (spR) { spR.userIdentity = t.value; Store.saveSpaces(); }
      return;
    }
    // 关系网：char 身份（char 级，有 cid）
    if (field === 'rel-char-identity') {
      var cidR = t.getAttribute('data-cid'); var spR2 = Store.getActiveSpace(); if (!spR2 || !cidR) return;
      var scR = getSpaceChar(spR2, cidR); if (scR) { scR.customIdentity = t.value; Store.saveSpaces(); }
      return;
    }
    // 关系网：AI 生成关系网提示词（space 级）
    if (field === 'rel-gen-prompt') {
      var spG = Store.getActiveSpace(); if (!spG) return;
      if (!spG.customPrompts) spG.customPrompts = {};
      spG.customPrompts.relationGenPrompt = t.value; Store.saveSpaces();
      return;
    }
    // AI 聊天自动注入提醒提示词（全局）
    if (field === 'chat-promptOnly') {
      state.chatconf = getChatConf();
      state.chatconf.promptOnly = t.value;
      Store.saveChatConf();
      return;
    }
    // 发送图片模式（插件全局）
    if (field === 'chat-imageMode') { setGlobalImageMode(t.value); return; }
    // 私聊写入聊天：IndexedDB 库名/存储名（插件全局，留空=自动探测）
    if (field === 'chat-dmDb' || field === 'chat-dmStore') {
      state.chatconf = getChatConf();
      state.chatconf[field.replace('chat-', '')] = t.value;
      Store.saveChatConf();
      return;
    }
    // 消息通知保留条数（插件全局，默认10；超限自动清理更旧的）
    if (field === 'notif-max') {
      state.chatconf = getChatConf();
      var nmVal = parseInt(t.value, 10);
      state.chatconf.notifMax = (!isNaN(nmVal) && nmVal >= 1 && nmVal <= 200) ? nmVal : 10;
      Store.saveChatConf();
      var nmMax = getNotifMax();
      if (state.notifs.length > nmMax) state.notifs.length = nmMax;
      Store.saveNotifs();
      if (root) render();
      return;
    }
    // 多图生图排队间隔（毫秒，全局）
    if (field === 'chat-genInterval') {
      state.chatconf = getChatConf();
      var giVal = parseInt(t.value, 10);
      state.chatconf.genInterval = (!isNaN(giVal)) ? Math.max(0, Math.min(60000, giVal)) : 3000;
      Store.saveChatConf();
      return;
    }
    // 总提示词面板：切换当前 char（必须先于 allprompt-char- 前缀判断）
    if (field === 'allprompt-char-select') {
      state._allPromptsCharId = t.value || null;
      var spaceSel = Store.getActiveSpace();
      var scSel = null;
      if (spaceSel && state._allPromptsCharId) scSel = getSpaceChar(spaceSel, state._allPromptsCharId);
      loadPromptRuntime(spaceSel, scSel);
      if (root) render();
      return;
    }
    // 总提示词面板：per-char 提示词（有 cid）
    if (field && field.indexOf('allprompt-char-') === 0) {
      var cidA = t.getAttribute('data-cid'); var spaceA = Store.getActiveSpace(); if (!spaceA || !cidA) return;
      var scA = getSpaceChar(spaceA, cidA); if (!scA) return;
      var fldA = field.slice('allprompt-char-'.length);
      if (fldA === 'userLine') {
        if (!scA.syncFormat || typeof scA.syncFormat !== 'object') scA.syncFormat = {};
        scA.syncFormat.userLine = t.value;
      } else {
        scA[fldA] = t.value;
      }
      Store.saveSpaces();
      var labelsA = { summaryPrompt: '总结提示词', syncPrompt: '记忆同步提示词', npcPrompt: 'NPC 提示词', npcGenPrompt: '生成 NPC 提示词', userLine: 'user 认知行' };
      state._promptUpdated = { label: (labelsA[fldA] || fldA) + '（' + scA.charName + '）' };
      if (root) render();
      return;
    }
    // 总提示词面板：全局/空间级提示词
    if (field && field.indexOf('allprompt-') === 0) {
      var keyA = field.slice('allprompt-'.length);
      var spaceB = Store.getActiveSpace();
      var itemsA = getAllPromptItems(spaceB);
      for (var iA = 0; iA < itemsA.length; iA++) {
        if (itemsA[iA].key === keyA) {
          itemsA[iA].set(t.value);
          state._promptUpdated = { label: itemsA[iA].label };
          if (root) render();
          return;
        }
      }
      return;
    }
    var cid = t.getAttribute('data-cid'); var conv = t.getAttribute('data-conv');
    var space = Store.getActiveSpace(); if (!space || !cid) return;
    var sc = getSpaceChar(space, cid); if (!sc) return;
    if (field === 'char-summaryPrompt' || field === 'char-syncPrompt' || field === 'char-momentPersona' || field === 'char-dmPrompt' || field === 'char-momentGenPrompt') {
      sc[field.replace('char-', '')] = t.value; Store.saveSpaces(); return;
    }
    if (field === 'char-maxFeed') {
      var mv2 = parseInt(t.value, 10);
      if (!isNaN(mv2) && mv2 >= 1 && mv2 <= 50) { sc.maxFeed = mv2; Store.saveSpaces(); }
      return;
    }
    if (field === 'char-sumFrom' || field === 'char-sumTo') {
      var sv2 = parseInt(t.value, 10);
      if (!isNaN(sv2) && sv2 >= 1) { if (field === 'char-sumFrom') sc.sumFrom = sv2; else sc.sumTo = sv2; Store.saveSpaces(); }
      return;
    }
    if (field === 'char-postCount') {
      var pcv = parseInt(t.value, 10);
      if (!isNaN(pcv) && pcv >= 1 && pcv <= 9) { sc.postCount = pcv; Store.saveSpaces(); }
      return;
    }
    if (field && field.indexOf('charSync-') === 0) {
      if (!sc.syncFormat || typeof sc.syncFormat !== 'object') sc.syncFormat = {};
      sc.syncFormat[field.replace('charSync-', '')] = t.value;
      Store.saveSpaces();
      return;
    }
    if (field === 'npc-roster-prompt') {
      sc.npcPrompt = t.value; Store.saveSpaces();
      return;
    }
    if (field === 'npc-gen-prompt') {
      sc.npcGenPrompt = t.value; Store.saveSpaces();
      return;
    }
    if (field === 'interval') { var v = parseInt(t.value, 10); if (!isNaN(v) && v >= 30) sc.postIntervalMin = v; Store.saveSpaces(); }
    else if (field === 'autocomment') { var v2 = parseInt(t.value, 10); if (!isNaN(v2) && v2 >= 0 && v2 <= 8) sc.autoCommentCount = v2; Store.saveSpaces(); }
    else if (field === 'core' && conv) { var m = findMount(sc, conv); if (m) { m.coreEnabled = t.checked; Store.saveSpaces(); } }
    else if (field === 'short' && conv) { var m2 = findMount(sc, conv); if (m2) { m2.shortLimit = parseInt(t.value, 10) || 0; Store.saveSpaces(); } }
    else if (field === 'fact' && conv) { var m3 = findMount(sc, conv); if (m3) { m3.factLimit = parseInt(t.value, 10) || 0; Store.saveSpaces(); } }
  }
  function findMount(sc, convId) { for (var i = 0; i < (sc.memoryMounts || []).length; i++) if (sc.memoryMounts[i].conversationId === convId) return sc.memoryMounts[i]; return null; }

  // 打开世界书选择弹窗：mode='global' 表示挂到空间级（侧边栏，所有 char 通用），
  // mode='local' 表示挂到该 char（记忆面板）；两种入口都可选择全局+局部词条
  function runOpenWorldMount(space, mode, charId) {
    if (!space) return;
    if (mode === 'local' && !getSpaceChar(space, charId)) return;
    state.sidebarOpen = false;
    state.worldMountOpen = true; state.worldLoading = true; state.worldCats = []; state.worldMode = mode; state.worldCharId = charId || null;
    render();
    var scopes = ['global', 'local'];
    loadWorldCategories().then(function (cats) {
      var chain = Promise.resolve([]);
      (cats || []).forEach(function (cat) {
        chain = chain.then(function (acc) {
          var entries = (cat.entries && cat.entries.length) ? cat.entries : null;
          var p = entries ? Promise.resolve(entries) : loadWorldEntries(cat.id, scopes);
          return p.then(function (es) {
            acc.push({ id: cat.id, name: cat.name || cat.title || cat.id, scope: cat.scope || 'global', entries: es });
            return acc;
          });
        });
      });
      return chain;
    }).then(function (cats) {
      state.worldCats = cats; state.worldLoading = false; render();
    }).catch(function () {
      state.worldCats = []; state.worldLoading = false; render();
    });
  }
  // 检查空间级与 char 级世界书是否重复开启同一词条；返回提醒文案（无重复返回空串）
  function findWorldDupInfo(space, mode, cid, catId, entryId) {
    if (!space) return '';
    if (mode === 'global') {
      // 侧边栏（空间级）新增：检查各 char 的局部挂载
      var chars = [];
      (space.chars || []).forEach(function (sc) {
        (sc.localWorldMounts || []).forEach(function (m) {
          if (m.entryId === entryId && m.categoryId === catId) chars.push(sc.charName || '未知');
        });
      });
      if (chars.length) return '该词条已在 char「' + chars.join('、') + '」的世界书中开启';
      return '';
    }
    // char 记忆面板（per-char）新增：检查空间级挂载
    var dup = false;
    (space.worldMounts || []).forEach(function (m) {
      if (m.entryId === entryId && m.categoryId === catId) dup = true;
    });
    return dup ? '该词条已在空间级（侧边栏）世界书中开启' : '';
  }

  function handleAction(act, t, e) {
    var space = Store.getActiveSpace();
    switch (act) {
      case 'back': if (cachedRoche && cachedRoche.ui) cachedRoche.ui.closeApp(); break;
      case 'open-sidebar': state.sidebarOpen = true; render(); break;
      case 'close-sidebar': state.sidebarOpen = false; render(); break;
      case 'toggle-dark': { state.darkMode = !state.darkMode; Store.saveDark().then(render); break; }
      case 'toggle-auto-reply': {
        state.chatconf = getChatConf();
        state.chatconf.autoReply = state.chatconf.autoReply === false;
        Store.saveChatConf().then(function () {
          toast(state.chatconf.autoReply ? '已开启：发送后自动请求 AI 回复' : '已关闭：可在评论区用 @ 召唤角色回复');
          render();
        });
        break;
      }
      case 'open-uiprefs': state.uiPrefsOpen = true; state.sidebarOpen = false; render(); break;
      case 'close-uiprefs': state.uiPrefsOpen = false; render(); break;
      case 'reset-uiprefs': { state.uiPrefs = { topbarH: 36, bottomPad: 80, sbH: 50, sbOff: 0 }; Store.saveUiPrefs().then(render); break; }
      case 'open-notif': state.notifPanelOpen = true; Store.markAllNotifRead(); render(); break;
      case 'close-notif': state.notifPanelOpen = false; render(); break;
      case 'clear-notifs': Store.clearNotifs().then(render); break;
      case 'open-subject': state.subjectSheetOpen = true; render(); break;
      case 'close-subject': state.subjectSheetOpen = false; render(); break;
      case 'set-subject': state.currentSubject = did(t, 'data-sub'); state.subjectSheetOpen = false; state._suppressScrollRestore = true; render(); break;
      case 'open-post-modal': pendingImages = []; state.postModalOpen = true; render(); break;
      case 'close-post-modal': state.postModalOpen = false; pendingImages = []; render(); break;
      case 'close-edit-modal': state.editModalOpen = false; state.editPostId = null; pendingImages = []; render(); break;
      case 'close-lp-sheet': state.lpSheetOpen = false; state.lpTarget = null; render(); break;
      case 'open-subapi': state.subApiPanelOpen = true; render(); break;
      case 'close-subapi': state.subApiPanelOpen = false; render(); break;
      case 'open-char-list': state.charListOpen = true; render(); break;
      case 'close-char-list': state.charListOpen = false; render(); break;
      case 'close-mem-mount': state.memMountCharId = null; render(); break;

      case 'open-mood-prompts': state.moodPromptsOpen = true; render(); break;
      case 'close-mood-prompts': state.moodPromptsOpen = false; render(); break;
      case 'open-relation-net': state.relationNetOpen = true; render(); break;
      case 'close-relation-net': state.relationNetOpen = false; render(); break;
      case 'open-prompt-panel': state.promptPanelOpen = true; state.sidebarOpen = false; render(); break;
      case 'close-prompt-panel': state.promptPanelOpen = false; render(); break;
      case 'open-all-prompts': {
        state.allPromptsOpen = true; state._promptUpdated = null; state.sidebarOpen = false; render();
        var scAll = null; var chAll = state._allPromptsCharId;
        if (space && space.chars && space.chars.length) {
          if (!chAll) { chAll = space.chars[0].charId; state._allPromptsCharId = chAll; }
          for (var iA = 0; iA < space.chars.length; iA++) if (space.chars[iA].charId === chAll) scAll = space.chars[iA];
        }
        loadPromptRuntime(space, scAll);
        break;
      }
      case 'close-all-prompts': state.allPromptsOpen = false; render(); break;
      case 'toggle-allprompt-group': {
        var gKey = did(t, 'data-group');
        if (!gKey) break;
        if (!state._allPromptsCollapsed) state._allPromptsCollapsed = {};
        state._allPromptsCollapsed[gKey] = state._allPromptsCollapsed[gKey] !== false ? false : true;
        render();
        break;
      }
      case 'expand-all-prompts': {
        if (!state._allPromptsCollapsed) state._allPromptsCollapsed = {};
        var grpE = buildPromptFeatureGroups(space, null, (space && space.customPrompts) || {}, getChatConf());
        grpE.forEach(function (g) { state._allPromptsCollapsed[g.key] = false; });
        render();
        break;
      }
      case 'collapse-all-prompts': {
        if (!state._allPromptsCollapsed) state._allPromptsCollapsed = {};
        var grpC = buildPromptFeatureGroups(space, null, (space && space.customPrompts) || {}, getChatConf());
        grpC.forEach(function (g) { state._allPromptsCollapsed[g.key] = true; });
        render();
        break;
      }
      case 'toggle-dm-after-post': {
        var cidDm = did(t, 'data-cid');
        if (space && cidDm) { var scDm = getSpaceChar(space, cidDm); if (scDm) { scDm.dmAfterPost = !scDm.dmAfterPost; Store.saveSpaces().then(render); } }
        break;
      }
      case 'toggle-dm-only-mentioned': {
        var cidDmo = did(t, 'data-cid');
        if (space && cidDmo) { var scDmo = getSpaceChar(space, cidDmo); if (scDmo) { scDmo.dmOnlyMentioned = !scDmo.dmOnlyMentioned; Store.saveSpaces().then(render); } }
        break;
      }
      case 'toggle-dm-visi': {
        state.chatconf = getChatConf();
        state.chatconf.dmVisibilityCheck = !state.chatconf.dmVisibilityCheck;
        Store.saveChatConf().then(render);
        break;
      }
      case 'preview-dm-prompt': {
        var cidDmp = did(t, 'data-cid');
        if (!space || !cidDmp) break;
        var scDmp = getSpaceChar(space, cidDmp); if (!scDmp) break;
        var sampleDm = scDmp.pendingDms && scDmp.pendingDms.length ? scDmp.pendingDms[scDmp.pendingDms.length - 1] : null;
        var tplDm = (scDmp.dmPrompt && trim(scDmp.dmPrompt)) ? scDmp.dmPrompt : DEFAULT_DM_PROMPT;
        var bodyDm = tplDm
          .replace(/\{charName\}/g, scDmp.charName)
          .replace(/\{userName\}/g, space.userPersonaName || '')
          .replace(/\{postText\}/g, sampleDm ? sampleDm.postText : '示例：今天天气真好，出门拍了张照。')
          .replace(/\{commentText\}/g, sampleDm && sampleDm.commentText ? sampleDm.commentText : '示例评论：这张图也太好看了吧')
          .replace(/\{activity\}/g, sampleDm ? (sampleDm.source === 'comment' ? 'user 在朋友圈下评论了一条内容。' : 'user 刚发了一条朋友圈。') : 'user 刚发了一条朋友圈。')
          .replace(/\{ts\}/g, sampleDm ? formatTime(sampleDm.ts) : formatTime(Date.now()));
        state.contentPreview = { title: '主动私聊提示词预览 — ' + scDmp.charName, hint: '以下是该提示词注入聊天时的实际内容（变量已替换；没有待私聊朋友圈时用示例文案展示）。', text: bodyDm };
        render();
        break;
      }
      case 'reset-chat-reminder': state.chatconf = getChatConf(); state.chatconf.promptOnly = ''; Store.saveChatConf().then(render); toast('已恢复默认提醒提示词'); break;
      case 'reset-rel-gen-prompt': {
        var spRg = Store.getActiveSpace(); if (spRg) { if (!spRg.customPrompts) spRg.customPrompts = {}; spRg.customPrompts.relationGenPrompt = ''; Store.saveSpaces().then(render); }
        toast('已恢复默认模板'); break;
      }
      case 'reset-char-prompt': {
        var fldR = did(t, 'data-field'); var cidRc = did(t, 'data-cid');
        if (!space || !cidRc || !fldR) break;
        var scRc = getSpaceChar(space, cidRc); if (!scRc) break;
        scRc[fldR] = ''; Store.saveSpaces().then(render); toast('已恢复默认模板');
        break;
      }
      case 'reset-all-prompt': {
        var keyRa = did(t, 'data-key'); var cidRa = did(t, 'data-cid');
        if (!space) break;
        if (cidRa) {
          var scRa = getSpaceChar(space, cidRa); if (!scRa) break;
          var fldRa = keyRa && keyRa.indexOf('perchar-') === 0 ? keyRa.slice('perchar-'.length) : keyRa;
          if (fldRa === 'userLine') { if (!scRa.syncFormat || typeof scRa.syncFormat !== 'object') scRa.syncFormat = {}; scRa.syncFormat.userLine = ''; }
          else if (fldRa) scRa[fldRa] = '';
          Store.saveSpaces().then(render); toast('已恢复默认模板');
          break;
        }
        var fldSp = keyRa && keyRa.indexOf('field-') === 0 ? keyRa.slice('field-'.length) : keyRa;
        var itemsRa = getAllPromptItems(space);
        for (var iRa = 0; iRa < itemsRa.length; iRa++) if (itemsRa[iRa].key === fldSp) { itemsRa[iRa].set(''); break; }
        toast('已恢复默认模板'); if (root) render();
        break;
      }
      case 'preview-all-prompt': {
        var keyPv = did(t, 'data-key'); var cidPv = did(t, 'data-cid');
        var spacePv = space;
        if (keyPv && keyPv.indexOf('builtin-') === 0) {
          state.contentPreview = { title: '内置提示词预览', hint: '该提示词为插件内置固定内容，不可编辑。', text: getBuiltinPromptValue(keyPv) };
          render(); break;
        }
        if (cidPv) {
          var scPv = spacePv ? getSpaceChar(spacePv, cidPv) : null; if (!scPv) break;
          var fldPv = keyPv && keyPv.indexOf('perchar-') === 0 ? keyPv.slice('perchar-'.length) : keyPv;
          var txtPv = '';
          if (fldPv === 'summaryPrompt') txtPv = '（模板变量 {from}/{to}/{count} 会在使用时替换为实际范围）\n\n' + (scPv.summaryPrompt || DEFAULT_SUMMARY_PROMPT);
          else if (fldPv === 'syncPrompt') txtPv = '（模板变量 {charName} 会在使用时替换）\n\n' + (scPv.syncPrompt || DEFAULT_SYNC_PROMPT);
          else if (fldPv === 'npcPrompt') txtPv = buildNpcRosterPrompt(spacePv, scPv) || '（未绑定 NPC，无内容）';
          else if (fldPv === 'npcGenPrompt') txtPv = scPv.npcGenPrompt || DEFAULT_NPC_GEN_PROMPT;
          else if (fldPv === 'userLine') txtPv = (scPv.syncFormat && scPv.syncFormat.userLine) || userDualNameLine(spacePv);
          else if (fldPv === 'momentPersona') txtPv = scPv.momentPersona || '（未设置，不注入）';
          else if (fldPv === 'momentGenPrompt') txtPv = (scPv.momentGenPrompt || DEFAULT_MOMENT_GEN_PROMPT).replace(/\{charName\}/g, scPv.charName).replace(/\{userName\}/g, spacePv ? (spacePv.userPersonaName || '') : '');
          else if (fldPv === 'dmPrompt') {
            var dmPv = scPv.pendingDms && scPv.pendingDms.length ? scPv.pendingDms[scPv.pendingDms.length - 1] : null;
            var dmTpl = (scPv.dmPrompt && trim(scPv.dmPrompt)) ? scPv.dmPrompt : DEFAULT_DM_PROMPT;
            txtPv = dmTpl
              .replace(/\{charName\}/g, scPv.charName)
              .replace(/\{userName\}/g, spacePv ? (spacePv.userPersonaName || '') : '')
              .replace(/\{postText\}/g, dmPv ? dmPv.postText : '示例：今天天气真好，出门拍了张照。')
              .replace(/\{commentText\}/g, dmPv && dmPv.commentText ? dmPv.commentText : '示例评论：这张图也太好看了吧')
              .replace(/\{activity\}/g, dmPv ? (dmPv.source === 'comment' ? 'user 在朋友圈下评论了一条内容。' : 'user 刚发了一条朋友圈。') : 'user 刚发了一条朋友圈。')
              .replace(/\{ts\}/g, dmPv ? formatTime(dmPv.ts) : formatTime(Date.now()));
          }
          state.contentPreview = { title: '提示词预览 — ' + scPv.charName + ' · ' + fldPv, hint: '以下是该提示词的实际内容/效果（变量已按当前数据替换）。', text: txtPv };
          render(); break;
        }
        var fldSp2 = keyPv && keyPv.indexOf('field-') === 0 ? keyPv.slice('field-'.length) : keyPv;
        var itemsPv = getAllPromptItems(spacePv);
        for (var iPv = 0; iPv < itemsPv.length; iPv++) {
          if (itemsPv[iPv].key === fldSp2) {
            state.contentPreview = { title: '提示词预览 — ' + itemsPv[iPv].label, hint: '以下是该提示词注入时的实际内容（变量已按当前数据替换）。', text: itemsPv[iPv].preview() };
            break;
          }
        }
        render();
        break;
      }
      case 'gen-moment-persona': {
        var cidMp = did(t, 'data-cid');
        if (!space || !cidMp) break;
        var scMp = getSpaceChar(space, cidMp); if (!scMp) break;
        setGenLoading('正在生成朋友圈人设...');
        generateMomentPersona(space, scMp).then(function (draft) {
          setGenLoading(null);
          state.momentGenDraft = draft;
          toast('朋友圈人设生成成功，请预览后应用');
          render();
        }).catch(function (e) {
          setGenLoading(null);
          toast('朋友圈人设生成失败：' + ((e && e.message) || '未知错误'));
        });
        break;
      }
      case 'close-moment-gen-draft': state.momentGenDraft = null; render(); break;
      case 'regen-moment-persona': {
        var rgCid = state.momentGenDraft ? state.momentGenDraft.charId : null;
        state.momentGenDraft = null; render();
        if (!space || !rgCid) break;
        var scRg = getSpaceChar(space, rgCid); if (!scRg) break;
        setGenLoading('正在重新生成朋友圈人设...');
        generateMomentPersona(space, scRg).then(function (draft) {
          setGenLoading(null);
          state.momentGenDraft = draft;
          toast('朋友圈人设生成成功，请预览后应用');
          render();
        }).catch(function (e) {
          setGenLoading(null);
          toast('朋友圈人设生成失败：' + ((e && e.message) || '未知错误'));
        });
        break;
      }
      case 'apply-moment-persona': {
        var amCid = state.momentGenDraft ? state.momentGenDraft.charId : null;
        var ed = $('#moment-gen-editor', root); var txtM = ed ? trim(ed.value) : '';
        if (!amCid || !txtM) { toast('内容为空'); break; }
        if (!space) break;
        var scAm = getSpaceChar(space, amCid); if (!scAm) break;
        scAm.momentPersona = txtM;
        state.momentGenDraft = null;
        Store.saveSpaces().then(function () { toast('已应用为 ' + scAm.charName + ' 的朋友圈人设'); render(); });
        break;
      }
      case 'preview-moment-gen-prompt': {
        var cidMGP = did(t, 'data-cid');
        if (!space || !cidMGP) break;
        var scMGP = getSpaceChar(space, cidMGP); if (!scMGP) break;
        var cMGP = findChar(scMGP.charId) || {};
        var personaMGP = cMGP.persona || cMGP.bio || scMGP.charPersona || '';
        var tplMGP = (scMGP.momentGenPrompt && trim(scMGP.momentGenPrompt)) ? scMGP.momentGenPrompt : DEFAULT_MOMENT_GEN_PROMPT;
        var bodyMGP = '当前 char：' + scMGP.charName + '\n' + (personaMGP ? '\n【char 人设】\n' + personaMGP + '\n' : '') + '\n【挂载的会话聊天记录/记忆】\n（生成时会自动读取该 char 已挂载会话的短期/长期记忆）\n\n---\n' + tplMGP.replace(/\{charName\}/g, scMGP.charName).replace(/\{userName\}/g, space.userPersonaName || '');
        state.contentPreview = { title: '朋友圈人设生成提示词预览 — ' + scMGP.charName, hint: '以下是 AI 生成朋友圈人设时实际发送的内容结构（变量已替换；挂载记忆为占位说明，生成时会注入真实内容）。', text: bodyMGP };
        render();
        break;
      }
      case 'preview-feature-prompt': {
        var keyF = did(t, 'data-key');
        if (!space || !keyF) break;
        var scF = null; var chF = state._allPromptsCharId;
        if (space.chars && space.chars.length) {
          if (!chF) { chF = space.chars[0].charId; state._allPromptsCharId = chF; }
          for (var iF = 0; iF < space.chars.length; iF++) if (space.chars[iF].charId === chF) scF = space.chars[iF];
        }
        if (!scF) { toast('请先绑定并选择 char'); break; }
        setGenLoading('正在合成实际提示词预览...');
        previewFeaturePrompt(space, scF, keyF).then(function (txt) {
          setGenLoading(null);
          var labelsF = { post: '发一条', summon: '召唤评论', npc: 'NPC 评论', chat: '聊天时 char 的提示词', summary: '总结 / 记忆同步', gen: '生成类' };
          state.contentPreview = { title: '实际发送的完整提示词 — ' + (labelsF[keyF] || keyF) + ' · ' + scF.charName, hint: '以下是该功能请求 AI 时实际拼成的提示词原文（变量已按当前数据替换；「聊天时 char 的提示词」与 chatContextProvider 逐项一致）。', text: txt };
          render();
        }).catch(function (e) { setGenLoading(null); toast('预览失败：' + ((e && e.message) || '未知错误')); });
        break;
      }
      // 行为记录提示词格式（per-char）
      case 'open-sync-format': {
        var cidSf = did(t, 'data-cid');
        if (!space || !getSpaceChar(space, cidSf)) break;
        state.syncFormatCharId = cidSf;
        state.syncFormatOpen = true;
        render();
        break;
      }
      case 'close-sync-format': state.syncFormatOpen = false; state.syncFormatCharId = null; render(); break;
      case 'reset-char-sync': {
        var cidRs = did(t, 'data-cid'); if (!space || !cidRs) break;
        var scRs = getSpaceChar(space, cidRs); if (!scRs) break;
        scRs.syncFormat = { header:'', userLine:'', intro:'', cat1:'', cat2:'', cat3:'', cat4:'', cat5:'', footer:'' };
        Store.saveSpaces().then(function () { toast('已恢复默认格式'); render(); });
        break;
      }
      // 关系网：预览提示词 / AI 生成 / 审核
      case 'open-rel-preview': state.relPreviewOpen = true; render(); break;
      case 'close-rel-preview': state.relPreviewOpen = false; render(); break;
      case 'rel-gen': { runRelationGen(space); break; }
      case 'rel-gen-again': { state.relGenDraft = null; runRelationGen(space); break; }
      case 'rel-gen-del': {
        var rgIdx = parseInt(did(t, 'data-idx'), 10);
        if (state.relGenDraft && !isNaN(rgIdx)) { state.relGenDraft.items.splice(rgIdx, 1); render(); }
        break;
      }
      case 'close-rel-gen-review': state.relGenDraft = null; render(); break;
      case 'rel-gen-apply': {
        if (!space || !state.relGenDraft) break;
        var items = state.relGenDraft.items || [];
        var nameToId = {};
        if (space.userPersonaName) nameToId[space.userPersonaName] = USER_NODE_ID;
        (space.chars || []).forEach(function (scx) {
          if (scx.charName) nameToId[scx.charName] = scx.charId;
        });
        var added = 0;
        items.forEach(function (it, idx) {
          var labelEl = $('#rel-ed-label-' + idx, root);
          var label = labelEl ? trim(labelEl.value) : trim(it.label || '');
          if (!label) return;
          var fromId = nameToId[trim(it.fromName)] || nameToId[it.fromName];
          var toId = nameToId[trim(it.toName)] || nameToId[it.toName];
          if (!fromId || !toId || fromId === toId) return;
          if (!space.relations) space.relations = [];
          var found = false;
          space.relations.forEach(function (r) { if (r.fromCid === fromId && r.toCid === toId) { r.label = label; found = true; } });
          if (!found) space.relations.push({ id: 'rel_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6), fromCid: fromId, toCid: toId, label: label });
          added++;
        });
        if (!added) { toast('没有可保存的有效关系（名字需匹配已绑定角色）'); break; }
        state.relGenDraft = null;
        Store.saveSpaces().then(function () { toast('已保存 ' + added + ' 条关系'); render(); });
        break;
      }
      // 记忆挂载面板：per-char 总结
      case 'toggle-char-sum-comments': {
        var cidT = did(t, 'data-cid'); if (!space || !cidT) break;
        var scT = getSpaceChar(space, cidT);
        if (scT) { scT.includeComments = scT.includeComments === false; Store.saveSpaces().then(render); }
        break;
      }
      case 'request-char-summary': {
        var cidR = did(t, 'data-cid'); if (!space || !cidR) break;
        var scR = getSpaceChar(space, cidR); if (!scR) break;
        var fromR = parseInt(scR.sumFrom, 10); if (isNaN(fromR) || fromR < 1) fromR = 1;
        var toR = parseInt(scR.sumTo, 10); if (isNaN(toR) || toR < 1) toR = fromR;
        if (toR < fromR) { toast('请填写有效范围（从第 N 条到第 M 条，且 M>=N）'); break; }
        var listR = state.posts.filter(function (p) { return p.spaceId === space.id; }).sort(function (a, b) { return b.createdAt - a.createdAt; });
        if (!listR.length) { toast('还没有朋友圈'); break; }
        if (toR > listR.length) { toast('当前只有 ' + listR.length + ' 条朋友圈，范围已收窄'); toR = listR.length; }
        var contentR = buildSummaryRequestContent(space, state.posts, fromR, toR, scR.includeComments !== false, cidR, 'text');
        if (!contentR.ok) { toast(contentR.error); break; }
        var promptR = buildSummaryPrompt({ summaryPrompt: scR.summaryPrompt || '' }, fromR, toR, contentR.text);
        var sumImages = [];
        if (getChatConf().imageMode === 'vision') {
          (contentR.posts || []).forEach(function (p) { (p.images || []).forEach(function (im) { sumImages.push(im); }); });
        }
        var draftR = {
          id: null, charId: cidR, from: fromR, to: toR, includeComments: scR.includeComments !== false,
          postIds: contentR.posts.map(function (p) { return p.id; }),
          prompt: promptR, images: sumImages, summary: '', loading: true, error: ''
        };
        state.summaryDraft = draftR;
        render();
        runSummaryAI(draftR);
        break;
      }
      case 'close-summary-result':
      case 'cancel-summary': state.summaryDraft = null; render(); break;
      case 'regen-summary': { var dR = state.summaryDraft; if (dR) { dR.summary = ''; dR.error = ''; runSummaryAI(dR); } break; }
      case 'save-summary': {
        var dS = state.summaryDraft; if (!dS || !space || !dS.charId) break;
        var scS = getSpaceChar(space, dS.charId); if (!scS) break;
        var ed = $('#moments-summary-editor', root);
        var textS = ed ? trim(ed.value) : '';
        if (!textS) { toast('总结内容不能为空'); break; }
        if (!scS.summaries) scS.summaries = [];
        var existing = null;
        scS.summaries.forEach(function (s) { if (s.id === dS.id) existing = s; });
        if (existing) {
          existing.summary = textS; existing.updatedAt = Date.now();
        } else {
          scS.summaries.push({
            id: uuid(), spaceId: space.id, charId: dS.charId, from: dS.from, to: dS.to, includeComments: dS.includeComments,
            postIds: dS.postIds || [], prompt: dS.prompt, summary: textS, createdAt: Date.now(), updatedAt: Date.now()
          });
        }
        scS.summaries.sort(function (a, b) { return (a.from || 0) - (b.from || 0); });
        Store.saveSpaces().then(function () {
          state.summaryDraft = null;
          toast('已保存：该范围原文已隐藏，注入时只发送总结，其余朋友圈照常发送原文');
          render();
        });
        break;
      }
      case 'view-summary': {
        var cidV = did(t, 'data-cid'); var sidV = did(t, 'data-sid');
        var scV = space ? getSpaceChar(space, cidV) : null;
        var found = null;
        if (scV) (scV.summaries || []).forEach(function (s) { if (s.id === sidV) found = s; });
        if (!found) break;
        state.summaryDraft = {
          id: found.id, charId: cidV, from: found.from, to: found.to, includeComments: found.includeComments !== false,
          postIds: found.postIds || [], prompt: found.prompt || '', summary: found.summary || '', loading: false, error: ''
        };
        render();
        break;
      }
      case 'del-summary': {
        var cidD = did(t, 'data-cid'); var sidD = did(t, 'data-sid');
        var scD = space ? getSpaceChar(space, cidD) : null;
        confirmBox({ message: '删除这条总结？删除后该范围朋友圈恢复发送原文。' }).then(function (ok) {
          if (ok && scD) {
            scD.summaries = (scD.summaries || []).filter(function (s) { return s.id !== sidD; });
            Store.saveSpaces().then(function () { toast('已删除'); render(); });
          }
        });
        break;
      }
      // 生图：图片右下角 more 菜单（重新生成 / 查看编辑提示词）
      case 'open-image-menu': {
        var mid = did(t, 'data-id'); var midx = parseInt(did(t, 'data-idx'), 10);
        if (mid && !isNaN(midx)) state.imageMenu = { postId: mid, idx: midx };
        render();
        break;
      }
      case 'close-image-menu': state.imageMenu = null; render(); break;
      case 'regen-image': {
        var rid = did(t, 'data-id'); var ridx = parseInt(did(t, 'data-idx'), 10);
        state.imagePromptView = null; state.imageMenu = null;
        regenPostImage(rid, ridx, { checkChange: false });
        break;
      }
      case 'edit-image-prompt': {
        var eid = did(t, 'data-id'); var eidx = parseInt(did(t, 'data-idx'), 10);
        var ePost = null;
        for (var ez = 0; ez < state.posts.length; ez++) if (state.posts[ez].id === eid) { ePost = state.posts[ez]; break; }
        var eImg = ePost && ePost.images ? ePost.images[eidx] : null;
        if (eImg && (eImg.type === 'ai' || (eImg.type === 'text' && eImg.prompt))) {
          state.imagePromptView = { prompt: eImg.prompt || eImg.value, postId: eid, idx: eidx };
        }
        state.imageMenu = null;
        render();
        break;
      }
      case 'save-image-prompt': {
        var sidI = did(t, 'data-id'); var sidxI = parseInt(did(t, 'data-idx'), 10);
        var sPost = null;
        for (var sz = 0; sz < state.posts.length; sz++) if (state.posts[sz].id === sidI) { sPost = state.posts[sz]; break; }
        var sImg = sPost && sPost.images ? sPost.images[sidxI] : null;
        if (!sImg || !sImg.prompt || (sImg.type !== 'ai' && sImg.type !== 'text')) break;
        var edI = $('#image-prompt-editor', root);
        var newPrompt = edI ? trim(edI.value) : '';
        if (!newPrompt) { toast('提示词不能为空'); break; }
        sImg.prompt = newPrompt;
        state.imagePromptView = null;
        Store.savePosts().then(function () { regenPostImage(sidI, sidxI, { checkChange: true }); });
        break;
      }
      case 'close-image-prompt': state.imagePromptView = null; render(); break;
      // 待总结 / 待同步内容预览
      case 'preview-summary-content': {
        var pscId = did(t, 'data-cid'); if (!space || !pscId) break;
        var psc = getSpaceChar(space, pscId); if (!psc) break;
        var pf = parseInt(psc.sumFrom, 10); if (isNaN(pf) || pf < 1) pf = 1;
        var pt = parseInt(psc.sumTo, 10); if (isNaN(pt) || pt < 1) pt = pf;
        if (pt < pf) { toast('请填写有效范围（从第 N 条到第 M 条，且 M>=N）'); break; }
        var pc = buildSummaryRequestContent(space, state.posts, pf, pt, psc.includeComments !== false, pscId, 'text');
        state.contentPreview = { title: '待总结内容预览 — ' + psc.charName, text: pc.ok ? pc.text : (pc.error || '无内容') };
        render();
        break;
      }
      case 'preview-sync-content': {
        var prcId = did(t, 'data-cid'); if (!space || !prcId) break;
        var prc = getSpaceChar(space, prcId); if (!prc) break;
        var prcActions = collectCharActions(space, prc, Store.getSyncTs(space.id, prcId), null, true);
        state.contentPreview = {
          title: '待同步内容预览 — ' + prc.charName,
          text: prcActions.length ? ('以下为该 char 近期（按可见范围筛选）的新朋友圈行为：\n' + prcActions.join('\n')) : '该 char 近期没有新的朋友圈行为（发圈/评论/点赞），无需同步'
        };
        render();
        break;
      }
      // 预览该 char 的最终 AI 提示词（与它聊天时插件实际发送的内容）
      case 'preview-char-prompts': {
        var cidP = did(t, 'data-cid'); if (!space || !cidP) break;
        var scP = getSpaceChar(space, cidP); if (!scP) break;
        state.contentPreview = {
          title: '发送给 AI 的最终提示词 — ' + scP.charName,
          hint: '以下是实际发送给 AI 的提示词原文（已按该 char 可见范围自动筛选；总结/同步提示词仅按需发送，不在此预览中）。',
          text: buildPromptPreviewText(space, scP)
        };
        render();
        break;
      }
      case 'close-content-preview': state.contentPreview = null; render(); break;
      // 世界书挂载
      case 'open-world-mount': runOpenWorldMount(space, 'global', null); break;
      case 'open-world-mount-local': {
        var cidWl = did(t, 'data-cid');
        runOpenWorldMount(space, 'local', cidWl);
        break;
      }
      case 'close-world-mount': state.worldMountOpen = false; render(); break;
      case 'toggle-world-entry': {
        var modeW = did(t, 'data-mode') || 'global';
        var cidW = did(t, 'data-cid');
        var catIdW = did(t, 'data-cat'); var entryIdW = did(t, 'data-entry');
        if (!space || !catIdW || !entryIdW) break;
        var scW = (modeW === 'local') ? getSpaceChar(space, cidW) : null;
        if (modeW === 'local') {
          if (!scW) break;
          if (!scW.localWorldMounts) scW.localWorldMounts = [];
        } else {
          if (!space.worldMounts) space.worldMounts = [];
        }
        var mountsW = (modeW === 'local') ? scW.localWorldMounts : space.worldMounts;
        var idxW = -1;
        mountsW.forEach(function (m, i) { if (m.entryId === entryIdW && m.categoryId === catIdW) idxW = i; });
        if (idxW >= 0) {
          mountsW.splice(idxW, 1);
          Store.saveSpaces().then(render);
          break;
        } else {
          var textW = '';
          var nameW = entryIdW;
          var catNameW = '';
          var scopeW = modeW;
          (state.worldCats || []).forEach(function (cat) {
            if (cat.id === catIdW) { catNameW = cat.name || ''; scopeW = cat.scope || modeW; }
            (cat.entries || []).forEach(function (e) {
              if (e.id === entryIdW) { textW = extractEntryText(e); nameW = e.title || e.name || entryIdW; if (e._scope) scopeW = e._scope; }
            });
          });
          var doAddW = function () {
            mountsW.push({ categoryId: catIdW, categoryName: catNameW, entryId: entryIdW, entryName: nameW, scope: scopeW, text: textW });
            Store.saveSpaces().then(render);
          };
          // 重复开启提醒：同一词条在空间级与 char 级同时开启会重复注入
          var dupMsgW = findWorldDupInfo(space, modeW, cidW, catIdW, entryIdW);
          if (dupMsgW) {
            confirmBox({ title: '世界书重复提醒', message: '「' + nameW + '」' + dupMsgW + '，两个位置都会读取该词条，可能造成重复注入。是否仍要挂载？' }).then(function (ok) { if (ok) doAddW(); });
          } else {
            doAddW();
          }
        }
        break;
      }
      case 'remove-world-entry': {
        var modeR = did(t, 'data-mode') || 'global';
        var cidR = did(t, 'data-cid');
        var idxRw = parseInt(did(t, 'data-idx'), 10);
        if (!space || isNaN(idxRw)) break;
        var scRw = (modeR === 'local') ? getSpaceChar(space, cidR) : null;
        var mountsR = (modeR === 'local') ? ((scRw && scRw.localWorldMounts) || []) : (space.worldMounts || []);
        if (idxRw < 0 || idxRw >= mountsR.length) break;
        mountsR.splice(idxRw, 1);
        Store.saveSpaces().then(render);
        break;
      }
      case 'relation-add': {
        if (!space) break;
        var fromEl = $('#rel-from', root); var toEl = $('#rel-to', root); var labelEl = $('#rel-label', root);
        if (!fromEl || !toEl || !labelEl) break;
        var fromCid = trim(fromEl.value); var toCid = trim(toEl.value); var relLabel = trim(labelEl.value);
        if (!fromCid || !toCid) { toast('请选择节点'); break; }
        if (fromCid === toCid) { toast('不能指向自己'); break; }
        if (!relLabel) { toast('请填关系标签'); break; }
        if (!space.relations) space.relations = [];
        space.relations.push({ id: 'rel_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6), fromCid: fromCid, toCid: toCid, label: relLabel });
        Store.saveSpaces(); render();
        break;
      }
      case 'relation-del': {
        if (!space) break;
        var relId = did(t, 'data-rel-id'); if (!relId) break;
        if (!space.relations) break;
        space.relations = space.relations.filter(function (r) { return r.id !== relId; });
        Store.saveSpaces(); render();
        break;
      }
      case 'open-npc-modal': { var npcCid = did(t, 'data-cid'); state.npcModalCharId = npcCid; state.npcSuggestions = []; state.sidebarOpen = false; render(); break; }
      case 'close-npc-modal': state.npcModalCharId = null; render(); break;
      case 'toggle-npc-prompt-inject': {
        var cidNpi = did(t, 'data-cid'); if (!space || !cidNpi) break;
        var scNpi = getSpaceChar(space, cidNpi); if (!scNpi) break;
        scNpi.npcPromptInject = !scNpi.npcPromptInject;
        Store.saveSpaces().then(render);
        break;
      }
      case 'open-npc-prompt': {
        var cidNp = did(t, 'data-cid');
        if (!space || !cidNp || !getSpaceChar(space, cidNp)) break;
        state.npcPromptCharId = cidNp; state.npcPromptIdx = null; state.npcPromptOpen = true;
        render();
        break;
      }
      case 'close-npc-prompt': state.npcPromptOpen = false; state.npcPromptCharId = null; state.npcPromptIdx = null; render(); break;
      case 'reset-npc-prompt': {
        var cidNr = did(t, 'data-cid');
        if (!space || !cidNr) break;
        var scNr = getSpaceChar(space, cidNr); if (!scNr) break;
        scNr.npcPrompt = '';
        Store.saveSpaces().then(render); toast('已恢复默认模板');
        break;
      }
      case 'preview-npc-prompt': {
        var cidPv = did(t, 'data-cid');
        if (!space || !cidPv) break;
        var scPv = getSpaceChar(space, cidPv); if (!scPv) break;
        var roster = buildNpcRosterPrompt(space, scPv);
        state.contentPreview = {
          title: 'NPC 提示词预览 — ' + scPv.charName + '（全部 NPC）',
          hint: '以下为该 char 所有绑定 NPC 的合并提示词（留空=默认模板；变量 {charName}/{npcList} 已替换）。',
          text: roster || '（该 char 还没有绑定 NPC）'
        };
        render();
        break;
      }
      case 'open-npc-gen-prompt': {
        var cidNg = did(t, 'data-cid');
        if (!space || !cidNg || !getSpaceChar(space, cidNg)) break;
        state.npcGenPromptCharId = cidNg; state.npcGenPromptOpen = true;
        render();
        break;
      }
      case 'close-npc-gen-prompt': state.npcGenPromptOpen = false; state.npcGenPromptCharId = null; render(); break;
      case 'reset-npc-gen-prompt': {
        var cidNgR = did(t, 'data-cid');
        if (!space || !cidNgR) break;
        var scNgR = getSpaceChar(space, cidNgR); if (!scNgR) break;
        scNgR.npcGenPrompt = '';
        Store.saveSpaces().then(render); toast('已恢复默认模板');
        break;
      }
      case 'preview-npc-gen-prompt': {
        var cidNgP = did(t, 'data-cid');
        if (!space || !cidNgP) break;
        var scNgP = getSpaceChar(space, cidNgP); if (!scNgP) break;
        var cNgP = findChar(scNgP.charId) || {};
        var personaNgP = cNgP.persona || cNgP.bio || scNgP.charPersona || '';
        var promptNgP = (scNgP.npcGenPrompt || '').trim() || DEFAULT_NPC_GEN_PROMPT;
        var existNpcP = (scNgP.npcs || []).map(function (n) { return '· ' + n.name + '：' + (n.bio || ''); }).join('\n');
        var textNgP = promptNgP + '\n\n';
        if (existNpcP) textNgP += '已绑定的 NPC（生成时请勿重复）：\n' + existNpcP + '\n\n';
        textNgP += '【附加数据】\nchar 名字：' + scNgP.charName + '\nchar 人设：' + (personaNgP || '(无)');
        state.contentPreview = {
          title: '生成 NPC 提示词预览 — ' + scNgP.charName,
          hint: '以下为点击「生成 4 个候选 NPC」时实际发送给 AI 的提示词（留空=默认模板）。',
          text: textNgP
        };
        render();
        break;
      }
      case 'npc-add': {
        var cidA = did(t, 'data-cid'); if (!space) break; var scA = getSpaceChar(space, cidA); if (!scA) break;
        var nm = $('#moments-npc-name', root) ? trim($('#moments-npc-name', root).value) : '';
        var bo = $('#moments-npc-bio', root) ? trim($('#moments-npc-bio', root).value) : '';
        if (!nm) { toast('请填 NPC 名字'); break; }
        scA.npcs.push({ id: uuid(), name: nm, handle: nm, bio: bo, avatar: '' });
        Store.saveSpaces().then(render); toast('已添加');
        break;
      }
      case 'npc-generate': {
        var cidG = did(t, 'data-cid'); if (!space) break; var scG = getSpaceChar(space, cidG); if (!scG) break;
        var cG = findChar(scG.charId) || {};
        var personaG = cG.persona || cG.bio || scG.charPersona || '';
        var sysG = (scG.npcGenPrompt || '').trim() || DEFAULT_NPC_GEN_PROMPT;
        state.npcLoading = true; setGenLoading('正在生成 NPC...');
        var existNpcG = (scG.npcs || []).map(function (n) { return '· ' + n.name + '：' + (n.bio || ''); }).join('\n');
        var userG = '';
        if (existNpcG) userG = '已绑定的 NPC（生成时请勿重复）：\n' + existNpcG + '\n\n';
        userG += '【附加数据】\nchar 名字：' + scG.charName + '\nchar 人设：' + (personaG || '(无)');
        callAI({ messages: [{ role: 'system', content: sysG }, { role: 'user', content: userG }], temperature: 0.9 }).then(function (raw) {
          var list = []; var reN = /<npc>([\s\S]*?)<\/npc>/gi; var mN;
          while ((mN = reN.exec(raw || ''))) {
            var blk = mN[1];
            var nmN = (blk.match(/<name>([\s\S]*?)<\/name>/i) || [])[1] || '';
            var hdN = trim(((blk.match(/<handle>([\s\S]*?)<\/handle>/i) || [])[1] || '').replace(/^@/, ''));
            var boN = (blk.match(/<bio>([\s\S]*?)<\/bio>/i) || [])[1] || '';
            // v2.0.0：不再使用 handle/账号名，兼容旧输出中的 <handle> 但一律以名字为准
            if (trim(nmN)) list.push({ id: uuid(), name: trim(nmN), handle: trim(nmN), bio: trim(boN), avatar: '' });
          }
          state.npcSuggestions = list; state.npcLoading = false; setGenLoading(null); render();
          if (!list.length) toast('NPC 生成失败：未能解析出 NPC，请重试');
          else toast('NPC 生成成功，共 ' + list.length + ' 个候选');
        }).catch(function (err) { state.npcLoading = false; setGenLoading(null); render(); toast('NPC 生成失败：' + (err && err.message || '')); });
        break;
      }
      case 'npc-bind': {
        var cidB = did(t, 'data-cid'); var idxB = parseInt(did(t, 'data-idx'), 10); if (!space || isNaN(idxB)) break;
        var scB = getSpaceChar(space, cidB); if (!scB) break;
        var sug = (state.npcSuggestions || [])[idxB]; if (!sug) break;
        scB.npcs.push({ id: uuid(), name: sug.name, handle: sug.name, bio: sug.bio, avatar: '' });
        Store.saveSpaces().then(render); toast('已绑定');
        break;
      }
      case 'npc-unbind': {
        var cidU = did(t, 'data-cid'); var idxU = parseInt(did(t, 'data-idx'), 10); if (!space || isNaN(idxU)) break;
        var scU = getSpaceChar(space, cidU); if (!scU) break;
        scU.npcs.splice(idxU, 1); Store.saveSpaces().then(render);
        break;
      }
      case 'npc-edit': {
        var npcEditCid3 = did(t, 'data-cid'); var npcEditIdx3 = parseInt(did(t, 'data-idx'), 10);
        if (!space || !npcEditCid3 || isNaN(npcEditIdx3)) break;
        var npcEditSc = getSpaceChar(space, npcEditCid3);
        if (!npcEditSc || !npcEditSc.npcs || !npcEditSc.npcs[npcEditIdx3]) break;
        state.npcEditCharId = npcEditCid3; state.npcEditIdx = npcEditIdx3; state.npcEditOpen = true;
        render();
        break;
      }

      case 'switch-space': {
        var pid = did(t, 'data-pid'); var per = null;
        for (var i = 0; i < state.allPersonas.length; i++) if (state.allPersonas[i].id === pid) { per = state.allPersonas[i]; break; }
        if (per) { var sp = ensureSpaceForPersona(per); state.activeSpaceId = sp.id; state.currentSubject = 'user'; state.sidebarOpen = false; Store.saveActive().then(function () { state._suppressScrollRestore = true; render(); }); }
        break;
      }
      case 'view-char': { var cid = did(t, 'data-cid'); if (space && getSpaceChar(space, cid)) { state.currentSubject = cid; state.sidebarOpen = false; state._suppressScrollRestore = true; render(); } break; }
      case 'bind-char': { var cid2 = did(t, 'data-cid'); if (space) { bindCharToSpace(space, cid2); state.charListOpen = false; render(); } break; }
      case 'unbind-char': { var cid3 = did(t, 'data-cid'); confirmBox({ message: '确定解绑该 char？历史朋友圈保留。' }).then(function (ok) { if (ok && space) { unbindCharFromSpace(space, cid3); render(); } }); break; }
      case 'open-mem-mount': { var cid4 = did(t, 'data-cid'); state.memMountCharId = cid4; state.sidebarOpen = false; render(); loadConversationsForChar(cid4); break; }
      case 'toggle-post': { var cidP = did(t, 'data-cid'); if (space) { var scP = getSpaceChar(space, cidP); if (scP) { scP.postEnabled = !scP.postEnabled; Store.saveSpaces().then(render); } } break; }
      case 'toggle-comment': { var cidC = did(t, 'data-cid'); if (space) { var scC = getSpaceChar(space, cidC); if (scC) { scC.commentEnabled = !scC.commentEnabled; Store.saveSpaces().then(render); } } break; }
      case 'toggle-mem-sync': { var cidMs = did(t, 'data-cid'); if (space) { var scMs = getSpaceChar(space, cidMs); if (scMs) { scMs.memSync = !scMs.memSync; Store.saveSpaces().then(render); } } break; }
      case 'toggle-npc-summon': {
        var cidNs = did(t, 'data-cid'); if (!space || !cidNs) break;
        var scNs = getSpaceChar(space, cidNs); if (!scNs) break;
        scNs.npcSummon = !scNs.npcSummon;
        Store.saveSpaces().then(render);
        break;
      }
      case 'toggle-mount': {
        var cid6 = did(t, 'data-cid'); var convId = did(t, 'data-conv');
        if (space) { var sc6 = getSpaceChar(space, cid6); if (sc6) { var m6 = findMount(sc6, convId); if (m6) m6.enabled = !m6.enabled; else { var co = null; (sc6._convCache || []).forEach(function (c) { if (c.id === convId) co = c; }); sc6.memoryMounts.push({ conversationId: convId, convName: co ? co.name : '', isGroup: co ? !!co.isGroup : false, enabled: true, shortLimit: 50, factLimit: 0, coreEnabled: false }); } Store.saveSpaces().then(render); } }
        break;
      }
      case 'char-post-now': {
        var cid7 = did(t, 'data-cid'); if (!space) break; var sc7 = getSpaceChar(space, cid7); if (!sc7) break;
        setTip(sc7.charName + ' 正在发朋友圈并评论...');
        generateCharPost(space, sc7).then(function () { setTip(null); toast('已发布'); if (root) render(); }).catch(function (err) { setTip(null); toast('发布失败：' + (err && err.message || '')); });
        break;
      }
      case 'sync-fact-now': {
        var cid8 = did(t, 'data-cid'); if (!space) break; var sc8 = getSpaceChar(space, cid8); if (!sc8) break;
        setTip('正在检查朋友圈行为与事实记忆...');
        syncCharToFactMemory(space, sc8).then(function (r) {
          setTip(null);
          if (r.ok) toast('已同步到事实记忆');
          else toast(r.reason || '同步失败');
        });
        break;
      }
      case 'set-cover': state.coverModalOpen = true; render(); break;
      case 'close-cover': state.coverModalOpen = false; render(); break;
      case 'save-cover': {
        var coverUrlEl = $('#cover-url', root);
        var coverUrl = coverUrlEl ? trim(coverUrlEl.value) : '';
        if (!coverUrl) { toast('请输入图片 URL'); break; }
        setCurrentCover(coverUrl).then(function () {
          state.coverModalOpen = false;
          toast('封面已更新');
          render();
        });
        break;
      }
      case 'clear-cover': {
        setCurrentCover('').then(function () {
          state.coverModalOpen = false;
          toast('封面已清除');
          render();
        });
        break;
      }
      case 'like': { var pid1 = did(t, 'data-id'); var subj1 = getCurrentSubject(); if (subj1) Store.toggleLike(pid1, { id: subj1.id, name: subj1.name }).then(render); break; }
      case 'comment-post': { var pid2 = did(t, 'data-id'); state.commentTarget = { postId: pid2, replyTo: null, replyToName: null }; render(); var inp = $('#moments-cm-text', root); if (inp) inp.focus(); break; }
      case 'reply-comment': { var pid3 = did(t, 'data-id'); var cmId = did(t, 'data-cid'); var post3 = null; for (var j = 0; j < state.posts.length; j++) if (state.posts[j].id === pid3) { post3 = state.posts[j]; break; } var cm = null; if (post3 && post3.comments) for (var k = 0; k < post3.comments.length; k++) if (post3.comments[k].id === cmId) { cm = post3.comments[k]; break; } if (cm) { state.commentTarget = { postId: pid3, replyTo: cm.id, replyToName: cm.authorName }; render(); var inp2 = $('#moments-cm-text', root); if (inp2) inp2.focus(); } break; }
      case 'send-comment': {
        var inp3 = $('#moments-cm-text', root); if (!inp3) break; var text = trim(inp3.value); if (!text || !state.commentTarget) break;
        var subj2 = getCurrentSubject(); if (!subj2) break; var ct = state.commentTarget;
        var comment = { id: uuid(), postId: ct.postId, authorType: subj2.type, authorId: subj2.id, authorName: subj2.realName || subj2.name, authorHandle: subj2.name, text: text, replyTo: ct.replyTo, replyToName: ct.replyToName, createdAt: Date.now() };
        var postC = null;
        for (var pcx = 0; pcx < state.posts.length; pcx++) if (state.posts[pcx].id === ct.postId) { postC = state.posts[pcx]; break; }
        Store.addComment(ct.postId, comment, postC).then(function () {
          state.commentTarget = null; render();
          // 仅 user 主体评论才触发其他 char 回应（char 主体评论不触发）
          if (space && subj2.type === 'user') {
            var post9 = null; for (var r = 0; r < state.posts.length; r++) if (state.posts[r].id === ct.postId) { post9 = state.posts[r]; break; }
            if (post9) {
              // user @了谁，谁就必定被召唤
              var mentionedIds = detectMentionedCharsFromPost(space, post9);
              // 自动回复开启，或本条评论明确 @ 了角色（召唤）时才请求 AI
              if (getChatConf().autoReply !== false || (mentionedIds && mentionedIds.length)) {
                setTip('char 正在看这条动态...');
                generateAutoComments(space, post9, DEFAULT_AUTO_COMMENT, mentionedIds).then(function (results) { setTip(null); if (root) render(); return injectCharsRealtime(space, (results || []).map(function (r) { return r.authorId; })); }).catch(function () { setTip(null); });
              }
              // AI 判断该评论是否需要私聊 user（独立于评论区回复）
              triggerUserDmJudgments(space, { type: 'comment', postId: ct.postId, postText: post9.text || '', postAuthorName: post9.authorName || '', postAuthorId: post9.authorType === 'char' ? (post9.authorId || '') : (post9.authorType === 'user' ? USER_NODE_ID : ''), commentText: text }).then(function (accepted) {
                // 逐个弹出 Roche 本体确认框（含私聊内容），确认后直接写入聊天
                return writeDmsDirect(space, accepted);
              });
            }
          }
        });
        break;
      }
      case 'open-acts': {
        var pid5 = did(t, 'data-id');
        // 先关闭其他已打开的气泡
        var allPops = root.querySelectorAll('.moment-act-pop.open');
        for (var i = 0; i < allPops.length; i++) {
          if (allPops[i].getAttribute('data-id') !== pid5) {
            allPops[i].classList.remove('open');
            allPops[i].innerHTML = '';
          }
        }
        // 切换目标气泡（赞 / 评论 / 召唤）
        var pop = $('.moment-act-pop[data-id="' + pid5 + '"]', root);
        if (pop) {
          if (pop.classList.contains('open')) {
            pop.classList.remove('open');
            pop.innerHTML = '';
          } else {
            pop.classList.add('open');
            pop.innerHTML = '<div class="moment-act-pop-i" data-action="like" data-id="' + pid5 + '">' + ICON.like + '赞</div><div class="moment-act-pop-i" data-action="comment-post" data-id="' + pid5 + '">' + ICON.comment + '评论</div><div class="moment-act-pop-i subtle" data-action="summon-comments" data-id="' + pid5 + '">' + ICON.more + '召唤</div>';
          }
        }
        break;
      }
      case 'summon-comments': {
        var pidS = did(t, 'data-id'); if (!space) break;
        var postS = null; for (var s = 0; s < state.posts.length; s++) if (state.posts[s].id === pidS) { postS = state.posts[s]; break; }
        if (!postS) break;
        // user 在该动态下 @过的 char 必定被召唤
        var mentionedIdsS = detectMentionedCharsFromPost(space, postS);
        setTip('召唤 char 评论中...');
        generateAutoComments(space, postS, DEFAULT_AUTO_COMMENT, mentionedIdsS).then(function (results) { setTip(null); toast('评论已生成'); if (root) render(); return injectCharsRealtime(space, (results || []).map(function (r) { return r.authorId; })); }).catch(function () { setTip(null); });
        break;
      }
      case 'view-photo': {
        // 点击已生成成功的图片 → 全屏放大查看（本地/URL/AI 生图均可）
        var vpId = did(t, 'data-id'); var vpIdx = parseInt(did(t, 'data-idx'), 10);
        var vpPost = null;
        for (var vzi = 0; vzi < state.posts.length; vzi++) if (state.posts[vzi].id === vpId) { vpPost = state.posts[vzi]; break; }
        var vpImg = vpPost && vpPost.images ? vpPost.images[vpIdx] : null;
        if (vpImg && vpImg.value && vpImg.type !== 'text' && !vpImg.loading) {
          state.imageViewer = { url: vpImg.value, postId: vpId, idx: vpIdx };
          render();
        }
        break;
      }
      case 'close-image-viewer': state.imageViewer = null; render(); break;
      case 'edit-post': {
        var pidE = did(t, 'data-id'); var postE = null;
        for (var e = 0; e < state.posts.length; e++) { if (state.posts[e].id === pidE) { postE = state.posts[e]; break; } }
        if (!postE) break;
        state.editPostId = pidE; state.editModalOpen = true;
        pendingImages = (postE.images || []).slice();
        render(); break;
      }
      case 'delete-post': {
        var pidDel = did(t, 'data-id');
        confirmBox({ message: '删除这条朋友圈？' }).then(function (ok) {
          if (ok) Store.deletePost(pidDel).then(function () { toast('已删除'); render(); });
        }); break;
      }
      case 'delete-comment': {
        var pidCm = did(t, 'data-id'); var cidCm = did(t, 'data-cid');
        if (!pidCm || !cidCm) break;
        confirmBox({ message: '删除这条评论？' }).then(function (ok) {
          if (ok) Store.deleteComment(pidCm, cidCm).then(function () { toast('已删除'); render(); });
        }); break;
      }
      case 'lp-delete-comment': {
        var pidLpC = did(t, 'data-id'); var cidLpC = did(t, 'data-cid');
        state.lpSheetOpen = false; state.lpTarget = null;
        if (!pidLpC || !cidLpC) break;
        confirmBox({ message: '删除这条评论？' }).then(function (ok) {
          if (ok) Store.deleteComment(pidLpC, cidLpC).then(function () { toast('已删除'); render(); });
        }); break;
      }
      case 'lp-del-like': {
        var lpidD = did(t, 'data-id'); var lkIdD = did(t, 'data-lkid');
        var lkPost = null;
        for (var lz = 0; lz < state.posts.length; lz++) if (state.posts[lz].id === lpidD) { lkPost = state.posts[lz]; break; }
        if (!lkPost || !lkPost.likes) break;
        lkPost.likes = lkPost.likes.filter(function (l) { return l.id !== lkIdD; });
        Store.savePosts().then(function () { render(); });
        break;
      }
      case 'close-npc-edit': state.npcEditOpen = false; state.npcEditCharId = null; state.npcEditIdx = null; render(); break;
      case 'save-npc-edit': {
        var npcScId = did(t, 'data-cid'); var npcScIdx = parseInt(did(t, 'data-idx'), 10);
        if (!space || !npcScId || isNaN(npcScIdx)) break;
        var npcSc = getSpaceChar(space, npcScId);
        var npcObj = npcSc && npcSc.npcs ? npcSc.npcs[npcScIdx] : null;
        if (!npcObj) break;
        var npcNm = $('#moments-npc-edit-name', root) ? trim($('#moments-npc-edit-name', root).value) : '';
        var npcBo = $('#moments-npc-edit-bio', root) ? trim($('#moments-npc-edit-bio', root).value) : '';
        if (!npcNm) { toast('请填 NPC 名字'); break; }
        npcObj.name = npcNm; npcObj.bio = npcBo; npcObj.handle = npcNm;
        state.npcEditOpen = false; state.npcEditCharId = null; state.npcEditIdx = null;
        Store.saveSpaces().then(function () { toast('已保存'); render(); });
        break;
      }
      case 'clear-img-cache': { confirmBox({ message: '清除朋友圈本地图片缓存？已发布的本地图片会失效。' }).then(function (ok) { if (ok) return cachedRoche.storage.set(KEYS.IMGCACHE, []); }).then(function () { toast('已清除'); }); break; }
      case 'enable-subapi': { var sid = did(t, 'data-id'); state.subapi.forEach(function (p) { p.enabled = (p.id === sid); }); Store.saveSubApi().then(render); break; }
      case 'del-subapi': { var sid2 = did(t, 'data-id'); state.subapi = state.subapi.filter(function (p) { return p.id !== sid2; }); Store.saveSubApi().then(render); break; }
      case 'refresh-models': { var url = $('#moments-sa-url', root) ? $('#moments-sa-url', root).value : ''; var key = $('#moments-sa-key', root) ? $('#moments-sa-key', root).value : ''; if (!trim(url) || !trim(key)) { toast('请填 URL 和 Key'); break; } setTip('刷新模型列表中...'); fetchModels(url, key).then(function (list) { setTip(null); var sel = $('#moments-sa-model', root); if (sel) sel.innerHTML = list.length ? list.map(function (m) { return '<option value="' + escapeHtml(m) + '">' + escapeHtml(m) + '</option>'; }).join('') : '<option value="">无可用模型</option>'; toast('获取到 ' + list.length + ' 个模型'); }).catch(function (err) { setTip(null); toast('刷新失败：' + (err && err.message || '')); }); break; }
      case 'save-subapi': { var name = $('#moments-sa-name', root) ? $('#moments-sa-name', root).value : ''; var url2 = $('#moments-sa-url', root) ? $('#moments-sa-url', root).value : ''; var key2 = $('#moments-sa-key', root) ? $('#moments-sa-key', root).value : ''; var model = $('#moments-sa-model', root) ? $('#moments-sa-model', root).value : ''; if (!trim(name) || !trim(url2) || !trim(key2) || !trim(model)) { toast('请完整填写'); break; } state.subapi.push({ id: uuid(), name: trim(name), url: trim(url2), apiKey: trim(key2), model: trim(model), enabled: false }); Store.saveSubApi().then(function () { toast('已保存'); render(); }); break; }
      case 'publish-post': {
        if (!space) break; var subj4 = getCurrentSubject(); if (!subj4) break;
        var txtEl = $('#moments-post-text', root); var text = txtEl ? trim(txtEl.value) : ''; var imgs = pendingImages.slice();
        var locEl4 = $('#moments-post-loc', root); var loc4 = locEl4 ? trim(locEl4.value) : '';
        if (!text && !imgs.length) { toast('请输入内容'); break; }
        var post7 = { id: uuid(), spaceId: space.id, authorType: subj4.type, authorId: subj4.id, authorName: subj4.realName || subj4.name, authorHandle: subj4.name, authorAvatar: subj4.avatar, text: text, images: imgs, location: loc4, createdAt: Date.now(), likes: [], comments: [] };
        Store.addPost(post7).then(function () {
          state.postModalOpen = false; pendingImages = []; render();
          if (subj4.type === 'user') {
            // AI 判断哪些 char 需要主动私聊 user，并生成私聊内容
            triggerUserDmJudgments(space, { type: 'post', postId: post7.id, postText: post7.text || '' }).then(function (accepted) {
              // 逐个弹出 Roche 本体确认框（含私聊内容），确认后直接写入聊天
              return writeDmsDirect(space, accepted);
            });
            if (getChatConf().autoReply !== false) {
              setTip('char 正在评论...');
              generateAutoComments(space, post7, DEFAULT_AUTO_COMMENT).then(function (results) { setTip(null); return injectCharsRealtime(space, (results || []).map(function (r) { return r.authorId; })); }).catch(function () { setTip(null); });
            }
          }
        });
        break;
      }
      case 'save-edit-post': {
        var pidSave = state.editPostId; if (!pidSave) break;
        var txtSave = $('#moments-post-text', root); var textSave = txtSave ? trim(txtSave.value) : '';
        var locSaveEl = $('#moments-post-loc', root); var locSave = locSaveEl ? trim(locSaveEl.value) : '';
        var imgsSave = pendingImages.slice();
        if (!textSave && !imgsSave.length) { toast('请输入内容'); break; }
        Store.updatePost(pidSave, { text: textSave, images: imgsSave, location: locSave }).then(function () {
          state.editModalOpen = false; state.editPostId = null; pendingImages = [];
          toast('已保存'); render();
        }); break;
      }
      case 'open-notif-item': { var nid = did(t, 'data-id'); var nItem = null; for (var z = 0; z < state.notifs.length; z++) if (state.notifs[z].id === nid) { nItem = state.notifs[z]; break; } if (nItem) { nItem.read = true; Store.saveNotifs().then(function () { state.notifPanelOpen = false; render(); setTimeout(function () { var node = $('.moment[data-id="' + nItem.postId + '"]', root); if (node && node.scrollIntoView) node.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50); }); } break; }
    }
  }

  // 会话加载：只列包含该 char 的会话
  function loadConversationsForChar(charId) {
    var space = Store.getActiveSpace(); if (!space) return;
    var sc = getSpaceChar(space, charId); if (!sc) return;
    sc._convLoading = true; render();
    if (!cachedRoche.conversation || !cachedRoche.conversation.list) { sc._convLoading = false; sc._convCache = []; render(); return; }
    // 优先用 memberId 过滤，列出包含该 char 的会话
    var p;
    try { p = Promise.resolve(cachedRoche.conversation.list({ memberId: charId })); }
    catch (e) { p = Promise.resolve(cachedRoche.conversation.list()); }
    p.then(function (list) {
      list = list || [];
      // 兜底过滤：确保会话确实包含该 char（单聊 contactId 或群聊 members）
      var filtered = list.filter(function (c) {
        var id = c.id || c.conversationId;
        if (c.contactId && c.contactId === charId) return true;
        if (c.members && c.members.indexOf) return c.members.indexOf(charId) >= 0;
        if (c.memberProfiles) { for (var i = 0; i < c.memberProfiles.length; i++) if (c.memberProfiles[i].id === charId) return true; }
        // 单聊且 handle/name 匹配也算
        return true; // memberId 已过滤，默认信任
      });
      sc._convCache = filtered.map(function (c) { return { id: c.id || c.conversationId, name: c.name || c.title || c.handle || (c.id || c.conversationId), isGroup: c.isGroup, handle: c.handle, avatar: c.avatar }; });
      // 单聊（非群聊）会话记忆开关默认开启：首次列出会话时自动挂载并启用
      var mountChanged = false;
      (sc._convCache || []).forEach(function (conv) {
        if (conv.isGroup) return;
        var has = false;
        (sc.memoryMounts || []).forEach(function (m) { if (m.conversationId === conv.id) has = true; });
        if (!has) {
          if (!sc.memoryMounts) sc.memoryMounts = [];
          sc.memoryMounts.push({ conversationId: conv.id, convName: conv.name || '', isGroup: false, enabled: true, shortLimit: 50, factLimit: 0, coreEnabled: false });
          mountChanged = true;
        }
      });
      if (mountChanged) Store.saveSpaces();
      sc._convLoading = false;
      render();
    }).catch(function () { sc._convLoading = false; sc._convCache = []; render(); });
  }

  // 发布图片工具
  function setupPostModalTools() {
    if (!root) return;
    $all('.mp-tool', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tool = btn.getAttribute('data-tool');
        if (tool === 'text') { var txt = window.prompt('输入文字图内容（点击后显示）：'); if (txt != null && trim(txt)) { pendingImages.push({ type: 'text', value: trim(txt), textContent: trim(txt) }); refreshPostImages(); } }
        else if (tool === 'url') { var url = window.prompt('输入图片 URL：'); if (url != null && trim(url)) { pendingImages.push({ type: 'url', value: trim(url) }); refreshPostImages(); } }
        else if (tool === 'ai') {
          var aiDesc = window.prompt('输入图片描述，插件将调用 Roche 当前生图配置生成：');
          if (aiDesc != null && trim(aiDesc)) {
            var oldHtml = btn.innerHTML;
            btn.innerHTML = '<span>生成中...</span>';
            callGenerateImage(trim(aiDesc)).then(function (imgUrl) {
              pendingImages.push({ type: 'ai', value: imgUrl, prompt: trim(aiDesc), textContent: trim(aiDesc) });
              refreshPostImages(); btn.innerHTML = oldHtml; toast('图片已生成');
            }).catch(function (err) {
              btn.innerHTML = oldHtml; toast('生成失败：' + (err && err.message || ''));
            });
          }
        }
      });
    });
    var fileInput = $('#moments-post-file', root);
    if (fileInput) {
      fileInput.addEventListener('change', function () {
        var f = fileInput.files && fileInput.files[0]; if (!f) return;
        if (f.size > 2 * 1024 * 1024) toast('图片超过 2MB，建议用 URL');
        var reader = new FileReader();
        reader.onload = function () {
          var dataUri = reader.result; pendingImages.push({ type: 'local', value: dataUri });
          cachedRoche.storage.get(KEYS.IMGCACHE).then(function (cache) { cache = cache || []; cache.push({ key: dataUri.slice(0, 32), dataUri: dataUri }); if (cache.length > 50) cache = cache.slice(-50); cachedRoche.storage.set(KEYS.IMGCACHE, cache); });
          refreshPostImages();
        };
        reader.readAsDataURL(f); fileInput.value = '';
      });
    }
  }
  function refreshPostImages() {
    var box = $('#moments-post-imgs', root); if (!box) return;
    box.innerHTML = pendingImages.map(function (img, idx) {
      var preview;
      if (img.type === 'text') preview = '<div class="mp-img-text">' + ICON.image + '<span>' + escapeHtml((img.textContent || '').slice(0, 8)) + '</span></div>';
      else if (img.type === 'ai' && !img.value) preview = '<div class="mp-img-text">' + ICON.image + '<span>加载中…</span></div>';
      else preview = '<img src="' + escapeHtml(img.value) + '">';
      var regenBtn = (img.type === 'ai' || (img.type === 'text' && img.prompt)) ? '<div class="mp-img-regen" data-mp-regen="' + idx + '" title="重新生成">' + ICON.refresh + '</div>' : '';
      return '<div class="mp-img">' + preview + regenBtn + '<div class="mp-img-del" data-mp-del="' + idx + '">' + ICON.close + '</div></div>';
    }).join('');
    $all('[data-mp-del]', box).forEach(function (d) { d.addEventListener('click', function () { pendingImages.splice(parseInt(d.getAttribute('data-mp-del'), 10), 1); refreshPostImages(); }); });
    $all('[data-mp-regen]', box).forEach(function (r) {
      r.addEventListener('click', function () {
        var i = parseInt(r.getAttribute('data-mp-regen'), 10);
        var im = pendingImages[i]; if (!im || !im.prompt || (im.type !== 'ai' && im.type !== 'text')) return;
        var old = r.innerHTML;
        r.innerHTML = '<span style="font-size:11px;color:#999;">…</span>';
        callGenerateImage(im.prompt || im.value).then(function (url) {
          im.type = 'ai'; im.value = url; refreshPostImages(); toast('已重新生成');
        }).catch(function (err) {
          r.innerHTML = old; toast('重新生成失败：' + (err && err.message || ''));
        });
      });
    });
  }

  // ========== CSS（微信拟真）==========
  var CSS = ''
+ '.' + ROOT_CLASS + '{position:absolute;inset:0;background:#EDEDED;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;color:#353535;font-size:14px;line-height:1.5;}'
 + '.' + ROOT_CLASS + '{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;touch-action:manipulation;overscroll-behavior:none;}'
+ '.' + ROOT_CLASS + ' *{box-sizing:border-box;}'
// 滚动容器：顶栏 sticky + 封面 + feed 全在里面滚动；底部留安全边距防输入栏遮挡
+ '.' + ROOT_CLASS + ' .moments-scroll{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;padding-bottom:var(--bottom-pad,80px);}'
// 顶栏 黑底白字 sticky；高度可调
+ '.' + ROOT_CLASS + ' .moments-topbar{position:sticky;top:0;left:0;right:0;z-index:20;display:flex;align-items:center;background:#1F1F1F;color:#fff;padding:0 6px;padding-top:calc(env(safe-area-inset-top,0px) + var(--topbar-pad,0px));height:calc(44px + var(--topbar-pad,0px) + env(safe-area-inset-top,0px));flex-shrink:0;box-sizing:border-box;box-shadow:0 1px 0 rgba(255,255,255,0.05);}'
+ '.' + ROOT_CLASS + ' .moments-tb-left{flex:1 1 0;height:100%;display:flex;align-items:center;justify-content:flex-start;cursor:pointer;}'
+ '.' + ROOT_CLASS + ' .moments-tb-title{flex:0 0 auto;text-align:center;font-size:17px;font-weight:600;letter-spacing:0.5px;cursor:pointer;user-select:none;padding:16px 32px;margin:-16px -32px;min-height:44px;display:flex;align-items:center;}'
+ '.' + ROOT_CLASS + ' .moments-tb-right{flex:1 1 0;height:100%;display:flex;align-items:center;justify-content:flex-end;gap:2px;}'
// 评论态：滚动区底部额外让出输入栏高度，确保不遮挡
+ '.' + ROOT_CLASS + '.commenting .moments-scroll{padding-bottom:calc(var(--cm-h,52px) + var(--bottom-pad,80px) + 12px);}'

+ '.' + ROOT_CLASS + ' .moments-range{width:100%;-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;background:#ddd;outline:none;margin:6px 0;}'
+ '.' + ROOT_CLASS + ' .moments-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#576B95;cursor:pointer;}'
+ '.' + ROOT_CLASS + ' .moments-range::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#576B95;cursor:pointer;border:none;}'
+ '.' + ROOT_CLASS + ' .moments-range-val{font-size:12px;color:#576B95;font-weight:600;min-width:42px;text-align:right;}'
+ '.' + ROOT_CLASS + ' .moments-tb-icon{width:40px;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;}'
+ '.' + ROOT_CLASS + ' .moments-dot{position:absolute;top:7px;right:8px;width:8px;height:8px;background:#FA5151;border-radius:50%;border:1.5px solid #1F1F1F;}'
// 封面
+ '.' + ROOT_CLASS + ' .moments-cover-wrap{position:relative;width:100%;height:318px;background:#3a3a3a;}'
+ '.' + ROOT_CLASS + ' .moments-cover{position:absolute;inset:0;background-size:cover;background-position:center;background-color:#576B95;cursor:pointer;overflow:hidden;}'
+ '.' + ROOT_CLASS + ' .moments-cover-mask{position:absolute;left:0;right:0;bottom:0;height:120px;background:linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.45));pointer-events:none;}'
+ '.' + ROOT_CLASS + ' .moments-cover-ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:rgba(255,255,255,0.7);font-size:12px;}'
+ '.' + ROOT_CLASS + ' .moments-cover-bar{position:absolute;left:0;right:0;bottom:-29px;display:flex;align-items:flex-start;justify-content:flex-end;gap:12px;padding:0 16px;z-index:2;pointer-events:none;}'
+ '.' + ROOT_CLASS + ' .moments-cover-bar .moments-cover-name,.' + ROOT_CLASS + ' .moments-cover-bar .moments-cover-avatar{pointer-events:auto;}'
+ '.' + ROOT_CLASS + ' .moments-cover-name{color:#fff;font-size:17px;font-weight:600;text-shadow:0 1px 4px rgba(0,0,0,0.8);cursor:pointer;}'
 // 封面设置弹窗
 + '.' + ROOT_CLASS + ' .moments-cover-preview{width:100%;height:150px;border-radius:10px;background-size:cover;background-position:center;background-color:#eee;margin-bottom:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#999;font-size:12px;}'
 + '.' + ROOT_CLASS + ' .moments-cover-preview svg{color:#bbb;}'
 + '.' + ROOT_CLASS + '.dark .moments-cover-preview{background-color:#2A2A2A;}'
+ '.' + ROOT_CLASS + ' .moments-cover-avatar{cursor:pointer;}'
+ '.' + ROOT_CLASS + ' .moments-avatar{width:70px;height:70px;border-radius:8px;overflow:hidden;border:3px solid #fff;background:#ddd;box-shadow:0 1px 6px rgba(0,0,0,0.2);}'
+ '.' + ROOT_CLASS + ' .moments-avatar.sm{width:38px;height:38px;border-radius:6px;border:none;}'
+ '.' + ROOT_CLASS + ' .moments-avatar img{width:100%;height:100%;object-fit:cover;display:block;}'
+ '.' + ROOT_CLASS + ' .moments-avatar-fb{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#576B95;color:#fff;font-size:22px;font-weight:600;}'
+ '.' + ROOT_CLASS + ' .moments-avatar.sm .moments-avatar-fb{font-size:16px;}'
// feed
+ '.' + ROOT_CLASS + ' .moments-feed{padding:0 0 30px 0;background:#EDEDED;}'
+ '.' + ROOT_CLASS + ' .moment{background:#fff;padding:12px 16px 14px;margin-bottom:2px;position:relative;box-shadow:0 1px 2px rgba(0,0,0,0.03);}'
+ '.' + ROOT_CLASS + ' .moment.first{padding-top:62px;}'
+ '.' + ROOT_CLASS + ' .moment-hd{display:flex;align-items:flex-start;}'
+ '.' + ROOT_CLASS + ' .moment-avatar{width:42px;height:42px;border-radius:4px;overflow:hidden;background:#ddd;flex-shrink:0;margin-right:10px;border:1px solid rgba(0,0,0,0.04);}'
+ '.' + ROOT_CLASS + ' .moment-avatar img{width:100%;height:100%;object-fit:cover;}'
+ '.' + ROOT_CLASS + ' .moment-avatar .moments-avatar-fb{font-size:18px;}'
+ '.' + ROOT_CLASS + ' .moment-meta{flex:1;padding-top:3px;}'
+ '.' + ROOT_CLASS + ' .moment-author{color:#576B95;font-size:15px;font-weight:600;cursor:pointer;}'
+ '.' + ROOT_CLASS + ' .moment-loc{color:#576B95;font-size:12px;margin-top:2px;display:flex;align-items:center;gap:2px;}'
 + '.' + ROOT_CLASS + ' .moment-ops{display:flex;align-items:center;gap:2px;padding:0 0 0 6px;flex-shrink:0;}'
 + '.' + ROOT_CLASS + ' .m-op{display:flex;align-items:center;justify-content:center;width:30px;height:30px;color:#999;border-radius:6px;cursor:pointer;}'
 + '.' + ROOT_CLASS + ' .m-op.danger{color:#FA5151;}'
 + '.' + ROOT_CLASS + ' .m-op:hover{background:#f2f2f2;}'
+ '.' + ROOT_CLASS + ' .moment-text{margin:14px 0 0 52px;font-size:15px;line-height:1.6;color:#353535;word-break:break-word;}'
// 图片网格
+ '.' + ROOT_CLASS + ' .moment-imgs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:14px 0 0 52px;}'
+ '.' + ROOT_CLASS + ' .moment-imgs.single{grid-template-columns:1fr;max-width:210px;}'
+ '.' + ROOT_CLASS + ' .m-img,.' + ROOT_CLASS + ' .m-img-text{width:100%;aspect-ratio:1;background:#f0f0f0;border-radius:4px;overflow:hidden;position:relative;}'
+ '.' + ROOT_CLASS + ' .moment-imgs.single .m-img{aspect-ratio:auto;max-height:240px;}'
+ '.' + ROOT_CLASS + ' .m-img img{width:100%;height:100%;object-fit:cover;display:block;}'
+ '.' + ROOT_CLASS + ' .m-img.loading{aspect-ratio:1;max-height:240px;}'
+ '.' + ROOT_CLASS + ' .m-img-loading{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#666;font-size:12px;background:#e4e4e4;}'
+ '.' + ROOT_CLASS + ' .m-img-spin{width:20px;height:20px;border:2px solid #c0c0c0;border-top-color:#576B95;border-radius:50%;animation:mom-spin 1s linear infinite;}'
+ '.' + ROOT_CLASS + ' .m-img-more{position:absolute;right:4px;bottom:4px;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,0.55);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:3;}'
// 文字图：原位显示
+ '.' + ROOT_CLASS + ' .m-img-text{cursor:pointer;background:linear-gradient(135deg,#eaeaea,#d5d5d5);}'
+ '.' + ROOT_CLASS + ' .m-img-text .mit-ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#999;font-size:11px;}'
+ '.' + ROOT_CLASS + ' .m-img-text .mit-tx{display:none;position:absolute;inset:0;padding:10px;align-items:center;justify-content:center;text-align:center;font-size:13px;line-height:1.6;color:#333;background:rgba(255,255,255,0.92);overflow:auto;}'
+ '.' + ROOT_CLASS + ' .m-img-text.revealed .mit-ph{display:none;}'
+ '.' + ROOT_CLASS + ' .m-img-text.revealed .mit-tx{display:flex;}'
// footer 时间+操作
+ '.' + ROOT_CLASS + ' .moment-ft{display:flex;align-items:center;justify-content:space-between;margin:12px 0 0 52px;position:relative;}'
+ '.' + ROOT_CLASS + ' .moment-time{font-size:12px;color:#b2b2b2;}'
+ '.' + ROOT_CLASS + ' .moment-acts{display:flex;align-items:center;justify-content:center;width:38px;height:30px;color:#7d7d7d;border-radius:4px;cursor:pointer;}'
// 操作气泡：相对 .moment-ft 定位，出现在"··"按钮左侧并垂直居中
+ '.' + ROOT_CLASS + ' .moment-act-pop{position:absolute;right:38px;top:50%;transform:translateY(-50%);display:none;z-index:30;}'
+ '.' + ROOT_CLASS + ' .moment-act-pop.open{display:flex;background:#4c4c4c;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.3);}'
+ '.' + ROOT_CLASS + ' .moment-act-pop.open::after{content:"";position:absolute;right:-6px;top:50%;transform:translateY(-50%);border:6px solid transparent;border-left-color:#4c4c4c;}'
+ '.' + ROOT_CLASS + ' .moment-act-pop-i{display:flex;align-items:center;gap:4px;color:#fff;font-size:13px;padding:8px 14px;cursor:pointer;}'
+ '.' + ROOT_CLASS + ' .moment-act-pop-i.subtle{color:rgba(255,255,255,0.6);font-size:12px;}'
+ '.' + ROOT_CLASS + ' .moment-act-pop-i.danger{color:#FA5151;}'
+ '.' + ROOT_CLASS + ' .moment-act-pop-i:not(:last-child){border-right:1px solid rgba(255,255,255,0.2);}'
// 互动区
+ '.' + ROOT_CLASS + ' .moment-int{background:#f7f7f7;border-radius:4px;padding:6px 10px;margin:10px 0 0 52px;position:relative;}'
+ '.' + ROOT_CLASS + ' .moment-likes{display:flex;align-items:flex-start;gap:5px;color:#576B95;font-size:13px;padding:3px 0;border-bottom:1px solid #eee;}'
+ '.' + ROOT_CLASS + ' .moment-likes svg{flex-shrink:0;margin-top:2px;}'
+ '.' + ROOT_CLASS + ' .moment-comments{padding-top:3px;}'
+ '.' + ROOT_CLASS + ' .moment-comments .mc{font-size:13px;line-height:1.7;color:#353535;cursor:pointer;position:relative;}'
+ '.' + ROOT_CLASS + ' .mc-n{color:#576B95;font-weight:600;}'
+ '.' + ROOT_CLASS + ' .mc-r{color:#999;}'
+ '.' + ROOT_CLASS + ' .mc-c{color:#353535;}'
+ '.' + ROOT_CLASS + ' .mc-at{color:#576B95;font-weight:500;}'
// 长按反馈
+ '.' + ROOT_CLASS + ' .moment.lp-active{background:#f0f0f0;transition:background 0.15s;}'
+ '.' + ROOT_CLASS + ' .mc.lp-active{background:rgba(87,107,149,0.08);border-radius:4px;transition:background 0.15s;}'
// 空状态
+ '.' + ROOT_CLASS + ' .moments-feed-empty{padding:90px 20px;text-align:center;color:#999;}'
+ '.' + ROOT_CLASS + ' .moments-feed-empty svg{color:#bbb;margin-bottom:12px;}'
+ '.' + ROOT_CLASS + ' .moments-fe-hint{font-size:12px;margin-top:6px;color:#bbb;}'
+ '.' + ROOT_CLASS + ' .moments-empty{padding:40px 20px;text-align:center;color:#999;font-size:13px;}'
// 局部 tip
+ '.' + ROOT_CLASS + ' .moments-tip{display:flex;align-items:center;gap:8px;padding:10px 16px;background:#fff;color:#888;font-size:13px;border-bottom:1px solid #f0f0f0;}'
+ '.' + ROOT_CLASS + ' .moments-spin{width:30px;height:30px;flex-shrink:0;}'
+ '.' + ROOT_CLASS + ' .moments-spin.sm{width:18px;height:18px;}'
+ '.' + ROOT_CLASS + ' .moments-spin svg{animation:mom-spin 1.2s linear infinite;}'
// mask + 侧边栏
+ '.' + ROOT_CLASS + ' .moments-mask{position:absolute;inset:0;background:rgba(0,0,0,0.4);z-index:50;}'
+ '.' + ROOT_CLASS + ' .moments-sidebar{position:absolute;top:0;left:0;bottom:0;width:280px;background:#fff;transform:translateX(-100%);transition:transform 0.25s;z-index:51;overflow-y:auto;-webkit-overflow-scrolling:touch;box-shadow:2px 0 12px rgba(0,0,0,0.15);}'
+ '.' + ROOT_CLASS + ' .moments-sidebar.open{transform:translateX(0);}'
+ '.' + ROOT_CLASS + ' .moments-sb-hd{position:sticky;top:0;z-index:3;display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:var(--sb-h,50px);border-bottom:1px solid #f0f0f0;background:#fff;flex-shrink:0;}'
+ '.' + ROOT_CLASS + ' .moments-sb-hd.demo{position:static;border:1px solid #f0f0f0;border-radius:8px;border-bottom:1px solid #f0f0f0;}'
+ '.' + ROOT_CLASS + ' .moments-sb-title{font-size:17px;font-weight:600;}'
+ '.' + ROOT_CLASS + ' .moments-sb-close{cursor:pointer;color:#999;padding:4px;}'
+ '.' + ROOT_CLASS + ' .moments-sb-hd .moments-sb-title,.' + ROOT_CLASS + ' .moments-sb-hd .moments-sb-close{transform:translateY(var(--sb-off,0px));}'
+ '.' + ROOT_CLASS + ' .moments-sb-sec{padding:10px 0;border-bottom:1px solid #f0f0f0;}'
+ '.' + ROOT_CLASS + ' .moments-sb-label{padding:0 16px 6px;font-size:12px;color:#999;}'
+ '.' + ROOT_CLASS + ' .moments-sb-item{display:flex;align-items:center;padding:10px 16px;cursor:pointer;gap:10px;}'
+ '.' + ROOT_CLASS + ' .moments-sb-item:hover{background:#f7f7f7;}'
+ '.' + ROOT_CLASS + ' .moments-sb-item.active{background:#e7edff;}'
+ '.' + ROOT_CLASS + ' .moments-sb-item.active .moments-sb-name{color:#576B95;font-weight:600;}'
+ '.' + ROOT_CLASS + ' .moments-sb-item.col{flex-direction:column;align-items:stretch;}'
+ '.' + ROOT_CLASS + ' .moments-sb-row{display:flex;align-items:center;gap:10px;}'
+ '.' + ROOT_CLASS + ' .moments-sb-info{flex:1;min-width:0;}'
+ '.' + ROOT_CLASS + ' .moments-sb-name{font-size:14px;font-weight:500;}'
+ '.' + ROOT_CLASS + ' .moments-sb-sub{font-size:11px;color:#999;margin-top:2px;}'
+ '.' + ROOT_CLASS + ' .moments-sb-empty{padding:10px 16px;font-size:12px;color:#bbb;}'
+ '.' + ROOT_CLASS + ' .moments-sb-item .add-av{background:#f0f0f0;color:#576B95;display:flex;align-items:center;justify-content:center;}'
+ '.' + ROOT_CLASS + ' .moments-sb-btns{display:flex;gap:6px;margin-top:8px;padding-left:48px;flex-wrap:wrap;}'
+ '.' + ROOT_CLASS + ' .mm-btn{font-size:11px;padding:3px 9px;border:1px solid #576B95;color:#576B95;border-radius:11px;cursor:pointer;background:#fff;}'
+ '.' + ROOT_CLASS + ' .mm-btn:hover{background:#576B95;color:#fff;}'
+ '.' + ROOT_CLASS + ' .mm-btn.on{background:#07C160;color:#fff;border-color:#07C160;}'
+ '.' + ROOT_CLASS + ' .mm-btn.danger{border-color:#FA5151;color:#FA5151;}'
+ '.' + ROOT_CLASS + ' .mm-btn.danger:hover{background:#FA5151;color:#fff;}'
// modal
+ '.' + ROOT_CLASS + ' .moments-modal-mask{position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;}'
+ '.' + ROOT_CLASS + ' .moments-viewer{position:absolute;inset:0;background:rgba(0,0,0,0.94);z-index:80;display:flex;align-items:center;justify-content:center;padding:0;touch-action:manipulation;}'
+ '.' + ROOT_CLASS + ' .moments-viewer img{max-width:100vw;max-height:100vh;width:auto;height:auto;object-fit:contain;display:block;user-select:none;-webkit-user-drag:none;}'
+ '.' + ROOT_CLASS + ' .moments-viewer-x{position:absolute;top:calc(env(safe-area-inset-top,0px) + 14px);right:18px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.18);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2;}'
+ '.' + ROOT_CLASS + ' .moments-modal{background:#fff;border-radius:12px;width:100%;max-width:min(420px, 92vw);max-height:85vh;display:flex;flex-direction:column;overflow:hidden;}'
+ '.' + ROOT_CLASS + ' .moments-modal.wide{max-width:min(480px, 95vw);}'
+ '.' + ROOT_CLASS + ' .moments-modal-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #f0f0f0;}'
+ '.' + ROOT_CLASS + ' .moments-modal-title{font-size:16px;font-weight:600;}'
+ '.' + ROOT_CLASS + ' .moments-modal-x{cursor:pointer;color:#999;padding:4px;}'
+ '.' + ROOT_CLASS + ' .moments-modal-bd{padding:16px;overflow-y:auto;-webkit-overflow-scrolling:touch;flex:1;min-height:0;}'
+ '.' + ROOT_CLASS + ' .moments-div{height:1px;background:#f0f0f0;margin:12px 0;}'
+ '.' + ROOT_CLASS + ' .moments-sec-title{font-size:14px;font-weight:600;margin-bottom:8px;}'
+ '.' + ROOT_CLASS + ' .moments-sec-hint{font-size:11px;color:#999;font-weight:400;margin-left:6px;}'
+ '.' + ROOT_CLASS + ' .moments-relation-svg{padding:10px;background:linear-gradient(135deg,#fafafa,#f0f0f0);border-radius:8px;margin-bottom:8px;}'
+ '.' + ROOT_CLASS + ' .moments-sync-vars{background:#fafafa;border-radius:8px;padding:10px;margin-bottom:8px;}'
+ '.' + ROOT_CLASS + ' .moments-sync-var-group{font-size:11px;color:#666;line-height:1.7;margin-bottom:4px;}'
+ '.' + ROOT_CLASS + ' .moments-sync-var-group b{color:#333;}'
+ '.' + ROOT_CLASS + ' .moments-sync-ta{width:100%;min-height:36px;border:1px solid #ddd;border-radius:6px;padding:8px 10px;font-size:12px;font-family:monospace;resize:vertical;box-sizing:border-box;margin-bottom:12px;}'
+ '.' + ROOT_CLASS + ' .moments-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;gap:12px;}'
+ '.' + ROOT_CLASS + ' .moments-row-label{font-size:14px;}'
+ '.' + ROOT_CLASS + ' .moments-input{border:1px solid #ddd;border-radius:6px;padding:6px 10px;font-size:14px;}'
+ '.' + ROOT_CLASS + ' .moments-input[type=number]{width:90px;}'
+ '.' + ROOT_CLASS + ' .moments-sw{width:44px;height:24px;background:#ccc;border-radius:12px;position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0;}'
+ '.' + ROOT_CLASS + ' .moments-sw.on{background:#07C160;}'
+ '.' + ROOT_CLASS + ' .moments-sw i{position:absolute;top:2px;left:2px;width:20px;height:20px;background:#fff;border-radius:50%;transition:left 0.2s;}'
+ '.' + ROOT_CLASS + ' .moments-sw.on i{left:22px;}'
+ '.' + ROOT_CLASS + ' .moments-conv{border:1px solid #f0f0f0;border-radius:8px;padding:10px;margin-bottom:8px;}'
+ '.' + ROOT_CLASS + ' .moments-conv.on{border-color:#576B95;background:#f8faff;}'
+ '.' + ROOT_CLASS + ' .moments-conv-hd{display:flex;align-items:center;justify-content:space-between;}'
+ '.' + ROOT_CLASS + ' .moments-conv-name{font-size:14px;font-weight:500;}'
+ '.' + ROOT_CLASS + ' .moments-conv-opts{display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;}'
+ '.' + ROOT_CLASS + ' .moments-conv-opts label{display:flex;align-items:center;gap:4px;font-size:12px;color:#666;}'
+ '.' + ROOT_CLASS + ' .moments-conv-opts input[type=number]{width:64px;}'
+ '.' + ROOT_CLASS + ' .moments-hint{font-size:12px;color:#999;line-height:1.6;margin:8px 0;}'
+ '.' + ROOT_CLASS + ' .moments-hint.ok{color:#07C160;font-weight:600;}'
+ '.' + ROOT_CLASS + ' .moments-group{background:#fff;border:1px solid #f0f0f0;border-radius:8px;margin-bottom:8px;overflow:hidden;}'
+ '.' + ROOT_CLASS + ' .moments-group-hd{display:flex;flex-direction:column;align-items:stretch;gap:4px;padding:12px;cursor:pointer;user-select:none;}'
+ '.' + ROOT_CLASS + ' .moments-group-hd-row{display:flex;align-items:center;gap:8px;width:100%;}'
+ '.' + ROOT_CLASS + ' .moments-group-desc{font-size:11px;color:#999;line-height:1.5;word-break:break-all;white-space:normal;width:100%;padding-left:22px;box-sizing:border-box;}'
+ '.' + ROOT_CLASS + '.dark .moments-group-desc{color:#888;}'
+ '.' + ROOT_CLASS + '.dark .moments-group-caret{color:#aaa;}'
+ '.' + ROOT_CLASS + ' .moments-group-caret{font-size:12px;color:#888;width:14px;text-align:center;flex-shrink:0;}'
+ '.' + ROOT_CLASS + ' .moments-group-title{font-size:14px;font-weight:600;flex-shrink:0;}'
+ '.' + ROOT_CLASS + ' .moments-group-bd{padding:0 12px 12px;border-top:1px solid #f5f5f5;}'
+ '.' + ROOT_CLASS + '.dark .moments-group{background:#1E1E1E;border-color:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moments-group-hd{color:#E0E0E0;}'
+ '.' + ROOT_CLASS + ' .moments-fold{background:#fff;border:1px solid #f0f0f0;border-radius:8px;margin:8px 0;padding:0 12px;}'
+ '.' + ROOT_CLASS + ' .moments-fold>summary{list-style:none;cursor:pointer;font-size:14px;font-weight:600;padding:12px 0;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}'
+ '.' + ROOT_CLASS + ' .moments-fold>summary::-webkit-details-marker{display:none;}'
+ '.' + ROOT_CLASS + ' .moments-fold>summary:before{content:"▸";color:#888;font-size:12px;width:14px;flex-shrink:0;}'
+ '.' + ROOT_CLASS + ' .moments-fold[open]>summary:before{content:"▾";}'
+ '.' + ROOT_CLASS + ' .moments-fold .moments-fold-bd{border-top:1px solid #f5f5f5;padding:10px 0;}'
+ '.' + ROOT_CLASS + '.dark .moments-fold{background:#1E1E1E;border-color:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moments-fold>summary{color:#E0E0E0;}'
+ '.' + ROOT_CLASS + ' .moments-scope-note{font-size:11px;color:#888;line-height:1.5;margin:4px 0 6px;padding:6px 8px;background:#f6f8f6;border-left:3px solid #07C160;border-radius:4px;}'
+ '.' + ROOT_CLASS + '.dark .moments-scope-note{background:#2A2A2A;color:#aaa;}'
+ '.' + ROOT_CLASS + ' .moments-btn-row{display:flex;gap:8px;margin-top:12px;}'
+ '.' + ROOT_CLASS + ' .moments-btn{flex:1;padding:10px;background:#07C160;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;}'
+ '.' + ROOT_CLASS + ' .moments-btn:hover{background:#06ad56;}'
+ '.' + ROOT_CLASS + ' .moments-btn.ghost{background:#f0f0f0;color:#353535;}'
// 副 API
+ '.' + ROOT_CLASS + ' .moments-sa{display:flex;align-items:center;justify-content:space-between;padding:10px;border:1px solid #f0f0f0;border-radius:8px;margin-bottom:8px;}'
+ '.' + ROOT_CLASS + ' .moments-sa.active{border-color:#07C160;background:#f6fff9;}'
+ '.' + ROOT_CLASS + ' .moments-sa-info{flex:1;min-width:0;}'
+ '.' + ROOT_CLASS + ' .moments-sa-name{font-size:14px;font-weight:500;}'
+ '.' + ROOT_CLASS + ' .moments-sa-sub{font-size:11px;color:#999;margin-top:2px;word-break:break-all;}'
+ '.' + ROOT_CLASS + ' .moments-sa-btns{display:flex;gap:4px;}'
+ '.' + ROOT_CLASS + ' .moments-form{display:flex;flex-direction:column;gap:10px;}'
+ '.' + ROOT_CLASS + ' .moments-form label{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#666;}'
+ '.' + ROOT_CLASS + ' .moments-form .moments-input{width:100%;}'
+ '.' + ROOT_CLASS + ' .moments-form-row{display:flex;gap:8px;align-items:flex-end;}'
+ '.' + ROOT_CLASS + ' .moments-form-row label{flex:1;}'
// 发朋友圈
+ '.' + ROOT_CLASS + ' .moments-post-as{font-size:13px;color:#666;margin-bottom:10px;}'
+ '.' + ROOT_CLASS + ' .moments-post-as b{color:#576B95;}'
+ '.' + ROOT_CLASS + ' .moments-post-text{width:100%;min-height:120px;border:1px solid #eee;border-radius:8px;padding:10px;font-size:14px;resize:vertical;font-family:inherit;}'
+ '.' + ROOT_CLASS + ' .moments-post-loc{width:100%;margin-top:10px;}'
+ '.' + ROOT_CLASS + ' .moments-post-imgs{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}'
+ '.' + ROOT_CLASS + ' .mp-img{position:relative;width:78px;height:78px;border-radius:6px;overflow:hidden;background:#f0f0f0;}'
+ '.' + ROOT_CLASS + ' .mp-img img{width:100%;height:100%;object-fit:cover;}'
+ '.' + ROOT_CLASS + ' .mp-img-text{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:10px;color:#888;gap:2px;}'
+ '.' + ROOT_CLASS + ' .mp-img-del{position:absolute;top:0;right:0;width:20px;height:20px;background:rgba(0,0,0,0.5);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;border-bottom-left-radius:6px;}'
 + '.' + ROOT_CLASS + ' .mp-img-regen{position:absolute;left:4px;bottom:4px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,0.55);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:3;}'
+ '.' + ROOT_CLASS + ' .moments-post-tools{display:flex;gap:14px;margin-top:10px;}'
+ '.' + ROOT_CLASS + ' .mp-tool{display:flex;align-items:center;gap:4px;cursor:pointer;color:#576B95;font-size:13px;padding:6px;border-radius:6px;}'
+ '.' + ROOT_CLASS + ' .mp-tool:hover{background:#f0f0f0;}'
// 评论栏
+ '.' + ROOT_CLASS + ' .moments-cm-bar{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;gap:6px;padding:8px 12px calc(8px + env(safe-area-inset-bottom,0px));background:#fff;border-top:1px solid #eee;z-index:40;}'
+ '.' + ROOT_CLASS + ' .moments-cm-row{display:flex;align-items:center;gap:8px;width:100%;}'
+ '.' + ROOT_CLASS + ' .moments-cm-sug{display:flex;flex-wrap:wrap;gap:8px;padding:2px 0 4px;max-height:110px;overflow-y:auto;}'
+ '.' + ROOT_CLASS + ' .moments-cm-sug-i{display:inline-flex;align-items:center;padding:6px 12px;background:#f0f0f0;border-radius:16px;font-size:12px;color:#576B95;cursor:pointer;white-space:nowrap;}'
+ '.' + ROOT_CLASS + ' .moments-cm-sug-i:hover{background:#e0e8ff;}'
+ '.' + ROOT_CLASS + ' .moments-cm-input{flex:1;border:1px solid #ddd;border-radius:6px;padding:8px 10px;font-size:14px;}'
+ '.' + ROOT_CLASS + ' .moments-cm-send{width:40px;height:38px;display:flex;align-items:center;justify-content:center;background:#07C160;color:#fff;border:none;border-radius:6px;cursor:pointer;}'
// sheet
+ '.' + ROOT_CLASS + ' .moments-sheet{background:#fff;border-radius:12px 12px 0 0;width:100%;max-width:480px;max-height:70vh;overflow-y:auto;-webkit-overflow-scrolling:touch;align-self:flex-end;padding-bottom:env(safe-area-inset-bottom,0px);}'
+ '.' + ROOT_CLASS + ' .moments-sheet-title{padding:16px;text-align:center;font-size:15px;font-weight:600;border-bottom:1px solid #f0f0f0;}'
+ '.' + ROOT_CLASS + ' .moments-sheet-item{display:flex;align-items:center;gap:10px;padding:12px 16px;cursor:pointer;}'
+ '.' + ROOT_CLASS + ' .moments-sheet-item:hover{background:#f7f7f7;}'
+ '.' + ROOT_CLASS + ' .moments-sheet-item.active{background:#eef2ff;}'
+ '.' + ROOT_CLASS + ' .moments-sheet-info{flex:1;}'
+ '.' + ROOT_CLASS + ' .moments-sheet-name{font-size:14px;font-weight:500;}'
+ '.' + ROOT_CLASS + ' .moments-sheet-sub{font-size:11px;color:#999;margin-top:2px;}'
// 通知
+ '.' + ROOT_CLASS + ' .moments-notif{display:flex;gap:10px;padding:12px 0;border-bottom:1px solid #f5f5f5;cursor:pointer;}'
+ '.' + ROOT_CLASS + ' .moments-notif.unread{background:#f8faff;margin:0 -16px;padding:12px 16px;}'
+ '.' + ROOT_CLASS + ' .moments-notif-info{flex:1;}'
+ '.' + ROOT_CLASS + ' .moments-notif-text{font-size:13px;line-height:1.5;}'
+ '.' + ROOT_CLASS + ' .moments-notif-text b{color:#576B95;}'
+ '.' + ROOT_CLASS + ' .moments-notif-time{font-size:11px;color:#999;margin-top:4px;}'
// boot loading
+ '.' + ROOT_CLASS + ' .moments-boot{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#EDEDED;gap:14px;}'
+ '.' + ROOT_CLASS + ' .moments-boot-text{font-size:13px;color:#999;}'
// 氛围提示词 + NPC
+ '.' + ROOT_CLASS + ' .moments-mood-ta{width:100%;min-height:80px;border:1px solid #eee;border-radius:8px;padding:10px;font-size:13px;resize:vertical;font-family:inherit;margin-top:4px;}'
 // AI 提示词与生图
 + '.' + ROOT_CLASS + ' .moments-prompt-ta{width:100%;min-height:80px;max-height:160px;overflow:auto;border:1px solid #ddd;border-radius:8px;padding:10px;font-size:13px;resize:vertical;font-family:inherit;box-sizing:border-box;margin:4px 0 8px;}'
+ '.' + ROOT_CLASS + ' .moments-preview.runtime{max-height:120px;overflow:auto;white-space:pre-wrap;word-break:break-all;}'
+ '.' + ROOT_CLASS + ' .moments-modal.allprompts{max-width:min(560px,96vw);}'
+ '.' + ROOT_CLASS + ' .moments-ref-value{max-height:120px;overflow:auto;background:#fafafa;border:1px solid #eee;border-radius:8px;padding:12px;font-size:12px;line-height:1.7;color:#444;white-space:pre-wrap;word-break:break-all;margin:4px 0 8px;}'
 + '.' + ROOT_CLASS + ' .moments-range-row{display:flex;align-items:center;gap:6px;padding:10px 0;flex-wrap:wrap;}'
 + '.' + ROOT_CLASS + ' .moments-range-row .moments-row-label{white-space:nowrap;}'
 + '.' + ROOT_CLASS + ' .moments-input.sm{width:56px;}'
 + '.' + ROOT_CLASS + ' .moments-sum-item{border:1px solid #f0f0f0;border-radius:8px;padding:10px;margin-bottom:8px;}'
 + '.' + ROOT_CLASS + ' .moments-sum-hd{display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:600;}'
 + '.' + ROOT_CLASS + ' .moments-sum-time{font-size:11px;color:#999;font-weight:400;}'
 + '.' + ROOT_CLASS + ' .moments-sum-body{font-size:12px;color:#666;line-height:1.6;margin:6px 0;word-break:break-word;}'
 + '.' + ROOT_CLASS + ' .moments-sum-btns{display:flex;gap:8px;justify-content:flex-end;}'
 + '.' + ROOT_CLASS + ' .moments-preview{background:#fafafa;border:1px solid #eee;border-radius:8px;padding:12px;font-size:12px;line-height:1.7;color:#444;white-space:pre-wrap;word-break:break-word;max-height:55vh;overflow-y:auto;margin:4px 0;}'
 + '.' + ROOT_CLASS + '.dark .moments-input,.' + ROOT_CLASS + '.dark .moments-mood-ta,.' + ROOT_CLASS + '.dark .moments-prompt-ta,.' + ROOT_CLASS + '.dark .moments-preview,.' + ROOT_CLASS + '.dark .moments-ref-value{background:#2A2A2A;border-color:#3a3a3a;color:#E0E0E0;}'
 + '.' + ROOT_CLASS + '.dark .moments-sum-item{border-color:#2A2A2A;}'
 + '.' + ROOT_CLASS + '.dark .moments-sum-body{color:#aaa;}'
+ '.' + ROOT_CLASS + ' .moments-mood-label{font-size:13px;color:#666;margin-top:12px;}'
+ '.' + ROOT_CLASS + ' .moments-mood-hint{font-size:11px;color:#aaa;margin-top:2px;}'
+ '.' + ROOT_CLASS + ' .moments-npc-item{display:flex;align-items:flex-start;gap:8px;padding:10px;border:1px solid #f0f0f0;border-radius:8px;margin-bottom:8px;}'
+ '.' + ROOT_CLASS + ' .moments-npc-item-info{flex:1;min-width:0;}'
+ '.' + ROOT_CLASS + ' .moments-npc-item-btns{display:flex;flex-direction:row;gap:6px;align-items:center;flex-shrink:0;}'
+ '.' + ROOT_CLASS + ' .moments-npc-item-name{font-size:14px;font-weight:500;}'
+ '.' + ROOT_CLASS + ' .moments-npc-item-sub{font-size:11px;color:#999;margin-top:2px;word-break:break-all;}'
+ '.' + ROOT_CLASS + ' .moments-npc-suggest{display:flex;align-items:flex-start;gap:8px;padding:10px;border:1px dashed #c8d4e8;border-radius:8px;margin-bottom:8px;background:#f8faff;}'
+ '@keyframes mom-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}'
// 夜间模式
+ '.' + ROOT_CLASS + '.dark{background:#121212;color:#E0E0E0;}'
+ '.' + ROOT_CLASS + '.dark .moments-boot{background:#121212;color:#888;}'
+ '.' + ROOT_CLASS + '.dark .moment{background:#1E1E1E;border-bottom-color:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .m-img,.' + ROOT_CLASS + '.dark .m-img-text,.' + ROOT_CLASS + '.dark .mp-img{background:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moment-acts,.' + ROOT_CLASS + '.dark .moment-int{background:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moment-likes{border-bottom-color:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moments-tip{background:#1E1E1E;color:#888;border-bottom-color:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moments-feed{background:#121212;}'
+ '.' + ROOT_CLASS + '.dark .moment{background:#1E1E1E;box-shadow:none;}'
+ '.' + ROOT_CLASS + '.dark .m-img-loading{background:#2A2A2A;color:#aaa;}'
+ '.' + ROOT_CLASS + '.dark .m-img-spin{border-color:#444;border-top-color:#8fa8e8;}'
+ '.' + ROOT_CLASS + '.dark .moment-text{color:#E0E0E0;}'
+ '.' + ROOT_CLASS + '.dark .moment-loc{color:#8fa8e8;}'
+ '.' + ROOT_CLASS + '.dark .mc-n{color:#8fa8e8;}'
+ '.' + ROOT_CLASS + '.dark .mc-c{color:#E0E0E0;}'
+ '.' + ROOT_CLASS + '.dark .mc-r{color:#888;}'
+ '.' + ROOT_CLASS + '.dark .mc-at{color:#8fa8e8;}'
+ '.' + ROOT_CLASS + '.dark .moment-likes{color:#8fa8e8;}'
+ '.' + ROOT_CLASS + '.dark .moment-time{color:#888;}'
+ '.' + ROOT_CLASS + '.dark .moment-acts{color:#aaa;}'
+ '.' + ROOT_CLASS + '.dark .moments-sidebar{background:#1E1E1E;box-shadow:2px 0 12px rgba(0,0,0,0.5);}'
+ '.' + ROOT_CLASS + '.dark .moments-sb-hd{background:#1E1E1E;border-bottom-color:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moments-sb-item:hover{background:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moments-sb-item.active{background:#2A3550;}'
+ '.' + ROOT_CLASS + '.dark .moments-sb-item.active .moments-sb-name{color:#8fa8e8;}'
+ '.' + ROOT_CLASS + '.dark .mm-btn{background:#1E1E1E;}'
+ '.' + ROOT_CLASS + '.dark .moments-modal{background:#1E1E1E;color:#E0E0E0;}'
+ '.' + ROOT_CLASS + '.dark .moments-div{background:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moments-btn.ghost{background:#2A2A2A;color:#E0E0E0;}'
+ '.' + ROOT_CLASS + '.dark .moments-cm-bar{background:#1E1E1E;border-top-color:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moments-post-text,.' + ROOT_CLASS + '.dark .moments-cm-input{background:#2A2A2A;border-color:#3a3a3a;color:#E0E0E0;}'
+ '.' + ROOT_CLASS + '.dark .moments-post-text::placeholder,.' + ROOT_CLASS + '.dark .moments-cm-input::placeholder{color:#888;}'
+ '.' + ROOT_CLASS + '.dark .moments-cm-sug-i{background:#2A2A2A;color:#8fa8e8;}'
+ '.' + ROOT_CLASS + '.dark .moments-sheet{background:#1E1E1E;color:#E0E0E0;}'
+ '.' + ROOT_CLASS + '.dark .moments-sheet-item:hover{background:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .mp-tool:hover{background:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moments-input,.' + ROOT_CLASS + '.dark .moments-mood-ta{background:#2A2A2A;border-color:#3a3a3a;color:#E0E0E0;}'
+ '.' + ROOT_CLASS + '.dark .moments-npc-item{border-color:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .moments-npc-suggest{background:#1E2433;border-color:#3a4a6a;}'
+ '.' + ROOT_CLASS + '.dark .moments-modal-mask{background:rgba(0,0,0,0.65);}'
+ '.' + ROOT_CLASS + '.dark .moments-sb-sub,.' + ROOT_CLASS + '.dark .moments-sb-label,.' + ROOT_CLASS + '.dark .moments-hint,.' + ROOT_CLASS + '.dark .moments-empty,.' + ROOT_CLASS + '.dark .moments-boot-text,.' + ROOT_CLASS + '.dark .moments-mood-hint{color:#888;}'
+ '.' + ROOT_CLASS + '.dark .moments-cover-ph{color:rgba(255,255,255,0.45);}'
+ '.' + ROOT_CLASS + '.dark .moment.lp-active{background:#2A2A2A;}'
+ '.' + ROOT_CLASS + '.dark .mc.lp-active{background:rgba(255,255,255,0.06);}'
+ '.' + ROOT_CLASS + '.dark .moment-act-pop-i.danger{color:#FF6B6B;}'
+ '.' + ROOT_CLASS + ' .moments-sheet-item.danger{color:#FA5151;}'
+ '.' + ROOT_CLASS + ' .moments-sheet-item.danger svg{color:#FA5151;}'
+ '.' + ROOT_CLASS + '.dark .moments-sheet-item.danger{color:#FF6B6B;}'
+ '.' + ROOT_CLASS + '.dark .moments-sheet-item.danger svg{color:#FF6B6B;}';

  // ========== 主聊天接入（静默上下文 + 工具）==========
  // chat 上下文/工具运行在主聊天运行时，此时 App 可能未打开，因此统一从 storage 读取最新数据；
  // 读不到时回退到内存 state（后台定时器每 60s 刷新一次）。
  function chatLoadState() {
    var roche = getRoche();
    if (!roche || !roche.storage || typeof roche.storage.get !== 'function') {
      return Promise.resolve({
        spaces: state.spaces || [], posts: state.posts || [], summaries: state.summaries || [],
        syncstate: state.syncstate || {}, chatconf: getChatConf(), activeSpaceId: state.activeSpaceId || null
      });
    }
    return Promise.all([
      roche.storage.get(KEYS.SPACES), roche.storage.get(KEYS.POSTS), roche.storage.get(KEYS.SUMMARIES),
      roche.storage.get(KEYS.SYNCSTATE), roche.storage.get(KEYS.CHATCONF), roche.storage.get(KEYS.ACTIVE)
    ]).then(function (r) {
      return {
        spaces: Array.isArray(r[0]) ? r[0] : (state.spaces || []),
        posts: Array.isArray(r[1]) ? r[1] : (state.posts || []),
        summaries: Array.isArray(r[2]) ? r[2] : (state.summaries || []),
        syncstate: (r[3] && typeof r[3] === 'object' && !Array.isArray(r[3])) ? r[3] : (state.syncstate || {}),
        chatconf: normalizeChatConf(r[4]),
        activeSpaceId: r[5] || state.activeSpaceId || null
      };
    }).catch(function () {
      return {
        spaces: state.spaces || [], posts: state.posts || [], summaries: state.summaries || [],
        syncstate: state.syncstate || {}, chatconf: getChatConf(), activeSpaceId: state.activeSpaceId || null
      };
    });
  }
  function chatSavePosts(posts) {
    state.posts = posts;
    var roche = getRoche();
    if (!roche || !roche.storage || typeof roche.storage.set !== 'function') return Promise.resolve();
    return Promise.resolve(roche.storage.set(KEYS.POSTS, posts)).catch(function () {});
  }
  function chatSaveSpaces(spaces) {
    state.spaces = spaces;
    var roche = getRoche();
    if (!roche || !roche.storage || typeof roche.storage.set !== 'function') return Promise.resolve();
    return Promise.resolve(roche.storage.set(KEYS.SPACES, spaces)).catch(function () {});
  }
  function chatSaveSummaries(summaries) {
    state.summaries = summaries;
    var roche = getRoche();
    if (!roche || !roche.storage || typeof roche.storage.set !== 'function') return Promise.resolve();
    return Promise.resolve(roche.storage.set(KEYS.SUMMARIES, summaries)).catch(function () {});
  }

  // 根据 ctx 选择空间：优先 ctx.userPersona，其次当前激活空间，最后第一个空间
  function resolveSpaceForCtx(loaded, ctx) {
    var spaces = loaded.spaces || [];
    if (!spaces.length) return null;
    var persona = ctx && ctx.userPersona;
    if (persona && persona.id) {
      for (var i = 0; i < spaces.length; i++) {
        if (spaces[i].userPersonaId === persona.id) return spaces[i];
      }
    }
    if (loaded.activeSpaceId) {
      for (var j = 0; j < spaces.length; j++) {
        if (spaces[j].id === loaded.activeSpaceId) return spaces[j];
      }
    }
    return spaces[0];
  }
  // 根据 ctx 匹配空间里绑定的 char（contact/conversation 里的角色 id）
  function resolveCharForCtx(space, ctx) {
    if (!space || !space.chars) return null;
    var cid = null;
    if (ctx) {
      if (ctx.contact && ctx.contact.id) cid = ctx.contact.id;
      else if (ctx.contact && ctx.contact.contactId) cid = ctx.contact.contactId;
      else if (ctx.contact && ctx.contact.characterId) cid = ctx.contact.characterId;
      else if (ctx.conversation && ctx.conversation.contactId) cid = ctx.conversation.contactId;
    }
    if (!cid) return null;
    for (var i = 0; i < space.chars.length; i++) {
      if (space.chars[i].charId === cid) return space.chars[i];
    }
    return null;
  }

  // 构建发送给 AI 的朋友圈上下文：编号（第 1 条=最新）、被总结范围只显示总结、其余显示原文
  // viewerCharId：以某 char 视角过滤陌生人动态（默认互相不可见）
  function buildFeedContext(space, posts, summaries, cfg, viewerCharId) {
    if (!space) return '';
    cfg = cfg || {};
    var max = parseInt(cfg.maxFeed, 10) || DEFAULT_FEED_MAX;
    if (max < 1) max = 1;
    var list = (posts || []).filter(function (p) { return p.spaceId === space.id; });
    if (viewerCharId) list = filterVisiblePostsForChar(space, list, viewerCharId);
    list.sort(function (a, b) { return b.createdAt - a.createdAt; });
    var visible = list.slice(0, max);
    var cover = {};
    (summaries || []).forEach(function (s) {
      if (!s || !s.postIds) return;
      var upd = s.updatedAt || s.createdAt || 0;
      for (var i = 0; i < s.postIds.length; i++) {
        var pid = s.postIds[i];
        if (!cover[pid] || upd >= (cover[pid].updatedAt || 0)) cover[pid] = s;
      }
    });
    var lines = [];
    lines.push('【朋友圈上下文 · 更新于 ' + formatStamp(Date.now()) + '】');
    lines.push('编号说明：第 1 条 = 最新一条。被总结过的范围只发送总结，其余朋友圈发送原文。');
    if (!visible.length) {
      lines.push('（当前空间暂无朋友圈动态）');
      return lines.join('\n');
    }
    var rendered = {};
    var coveredAny = false;
    for (var k = 0; k < visible.length; k++) {
      var p = visible[k];
      var num = k + 1;
      var sum = cover[p.id];
      if (sum) {
        if (!rendered[sum.id]) {
          rendered[sum.id] = true;
          coveredAny = true;
          lines.push('');
          lines.push('【第 ' + sum.from + ' - ' + sum.to + ' 条朋友圈总结' + (sum.includeComments === false ? '' : '（含评论）') + '】');
          lines.push(sum.summary || '（总结为空）');
        }
        continue;
      }
      var author = p.authorName || '未知';
      var s = '#' + num + ' 【' + author + ' · ' + formatStamp(p.createdAt) + '】' + (p.text || '(仅图片)');
      var imgDesc = describePostImages(p, cfg.imageMode);
      if (imgDesc) s += '（' + imgDesc + '）';
      if (p.location) s += '（地点：' + p.location + '）';
      if (cfg.includeComments !== false && p.likes && p.likes.length) {
        s += '\n    点赞：' + p.likes.map(function (l) { return l.name; }).join('、');
      }
      if (cfg.includeComments !== false && p.comments && p.comments.length) {
        s += '\n    评论：' + p.comments.map(function (cm) {
          var who = cm.authorName || '未知';
          return who + '（' + formatStamp(cm.createdAt) + '）' + (cm.replyToName ? ' 回复 ' + cm.replyToName : '') + '：' + displayCommentText(cm);
        }).join('；');
      }
      lines.push(s);
    }
    if (coveredAny) lines.push('');
    if (coveredAny) lines.push('注：被总结的范围内朋友圈原文已隐藏，只发送上述总结，以节省 token。');
    lines.push('');
    lines.push('你可以用 view_moments 刷新/查看更多；发朋友圈用 post_moment，评论用 comment_moment，点赞用 like_moment。');
    return lines.join('\n');
  }

  // 图片在发给 AI 时的表示：text=文字图（用生图提示词/描述文本），vision=识图
  // vision 模式下不发送图片链接：data URI 直接内嵌图片数据（模型直接收到图片本体）；
  // http(s) 链接一律不发链接文本，回退为生图提示词（由调用方通过 messages 图片块附加图片本体）
  function describePostImages(p, imageMode) {
    if (!p.images || !p.images.length) return '';
    var parts = [];
    (p.images || []).forEach(function (im, ii) {
      var v = im.value || '';
      if (imageMode === 'vision' && /^data:image\//i.test(v)) {
        parts.push('![图' + (ii + 1) + '](' + v + ')');
      } else {
        parts.push(im.prompt || im.textContent || '图片' + (ii + 1));
      }
    });
    return '图片 ' + p.images.length + ' 张：' + parts.join(' | ');
  }
  // 构造总结范围的内容原文（第 from 条到第 to 条，含评论/点赞可选；viewerCharId 只总结该 char 可见内容）
  function buildSummaryRequestContent(space, posts, from, to, includeComments, viewerCharId, imageMode) {
    var list = (posts || []).filter(function (p) { return p.spaceId === space.id; });
    if (viewerCharId) list = filterVisiblePostsForChar(space, list, viewerCharId);
    list.sort(function (a, b) { return b.createdAt - a.createdAt; });
    var seg = list.slice(from - 1, to);
    if (!seg.length) return { ok: false, error: '范围内没有该 char 可见的朋友圈' };
    var lines = [];
    lines.push('以下是第 ' + from + ' 条到第 ' + to + ' 条朋友圈（共 ' + seg.length + ' 条，最新在前编号，已按 ' + (viewerCharId ? '该 char 可见范围' : '全部') + ' 筛选）：');
    for (var i = 0; i < seg.length; i++) {
      var p = seg[i];
      var author = p.authorName || '未知';
      var s = '【第 ' + (from + i) + ' 条 · ' + author + ' · ' + formatStamp(p.createdAt) + '】' + (p.text || '(仅图片)');
      var imgDesc = describePostImages(p, imageMode);
      if (imgDesc) s += '（' + imgDesc + '）';
      if (includeComments !== false && p.comments && p.comments.length) {
        s += '\n  评论：' + p.comments.map(function (cm) {
          var who = cm.authorName || '未知';
          return who + (cm.replyToName ? ' 回复 ' + cm.replyToName : '') + '：' + displayCommentText(cm);
        }).join('；');
      }
      if (includeComments !== false && p.likes && p.likes.length) {
        s += '\n  点赞：' + p.likes.map(function (l) { return l.name; }).join('、');
      }
      lines.push(s);
    }
    return { ok: true, posts: seg, text: lines.join('\n\n') };
  }
  // 组装总结请求提示词：自定义模板（可含 {from}/{to}/{count}）+ 范围内原文
  function buildSummaryPrompt(cfg, from, to, contentText) {
    var tpl = (cfg && cfg.summaryPrompt) || DEFAULT_SUMMARY_PROMPT;
    return tpl
      .replace(/\{from\}/g, from)
      .replace(/\{to\}/g, to)
      .replace(/\{count\}/g, (to - from + 1)) + '\n\n' + contentText;
  }

  // ---- 主聊天工具执行 ----
  function toolRun(fn) {
    return function (args, ctx) {
      return chatLoadState().then(function (loaded) {
        return fn(args, ctx, loaded);
      }).catch(function (e) {
        return { ok: false, error: (e && e.message) || '执行失败' };
      });
    };
  }
  function resolvePostByIndex(args, loaded, space) {
    var pid = args && args.postId;
    var idx = parseInt((args && (args.postIndex != null ? args.postIndex : args.index)), 10);
    var list = (loaded.posts || []).filter(function (p) { return p.spaceId === space.id; });
    list.sort(function (a, b) { return b.createdAt - a.createdAt; });
    if (pid) {
      for (var i = 0; i < list.length; i++) if (list[i].id === pid) return list[i];
    }
    if (!isNaN(idx)) return list[idx - 1] || null;
    return null;
  }
  function getPostIndex(post, loaded, space) {
    var list = (loaded.posts || []).filter(function (p) { return p.spaceId === space.id; });
    list.sort(function (a, b) { return b.createdAt - a.createdAt; });
    for (var i = 0; i < list.length; i++) if (list[i].id === post.id) return i + 1;
    return -1;
  }
  function toolViewMoments(args, ctx, loaded) {
    var space = resolveSpaceForCtx(loaded, ctx);
    if (!space) return { ok: false, error: '还没有朋友圈空间，请先在朋友圈插件中创建。' };
    var cfg = loaded.chatconf || {};
    if (args && args.limit != null) {
      var lim = parseInt(args.limit, 10);
      cfg = { promptOnly: cfg.promptOnly, summaryPrompt: cfg.summaryPrompt, includeComments: cfg.includeComments !== false, maxFeed: (!isNaN(lim) && lim > 0) ? Math.min(30, lim) : DEFAULT_FEED_MAX };
    }
    return { ok: true, feed: buildFeedContext(space, loaded.posts, loaded.summaries, cfg), spaceName: space.userPersonaName || space.id };
  }
  function toolPostMoment(args, ctx, loaded) {
    var space = resolveSpaceForCtx(loaded, ctx);
    if (!space) return { ok: false, error: '未找到朋友圈空间' };
    var sc = resolveCharForCtx(space, ctx);
    if (!sc) return { ok: false, error: '当前聊天角色未绑定到朋友圈空间，请先在朋友圈插件中绑定该 char。' };
    var text = trim((args && args.text) || '');
    var imagePrompts = (args && args.imagePrompts) || [];
    if (typeof imagePrompts === 'string') imagePrompts = [imagePrompts];
    if (!text && !imagePrompts.length) return { ok: false, error: '朋友圈内容为空' };
    var images = [];
    for (var i = 0; i < imagePrompts.length; i++) {
      var pr = trim(imagePrompts[i]);
      if (pr) images.push({ type: 'ai', prompt: pr, textContent: pr });
    }
    var post = {
      id: uuid(), spaceId: space.id, authorType: 'char', authorId: sc.charId,
      authorName: sc.charName, authorHandle: sc.charName, authorAvatar: sc.charAvatar || '',
      text: text, images: images, location: trim((args && args.location) || ''), createdAt: Date.now(), likes: [], comments: []
    };
    var list = (loaded.posts || []).slice();
    list.push(post);
    list.sort(function (a, b) { return b.createdAt - a.createdAt; });
    var failCount = 0;
    var chain = Promise.resolve();
    images.forEach(function (im) {
      chain = chain.then(function () {
        return callGenerateImage(im.prompt).then(function (url) {
          im.type = 'ai'; im.value = url; im.usedPrompt = im.prompt;
        }).catch(function () {
          im.type = 'text'; im.value = im.prompt; im.textContent = im.prompt; failCount++;
        });
      });
    });
    return chain.then(function () {
      return chatSavePosts(list).then(function () {
        notifyUser(sc.charName + ' 发布了一条朋友圈：' + (text.slice(0, 30) || '(仅图片)'));
        // 聊天中发朋友圈也自动生成该 char 绑定 NPC 的评论/点赞（异步执行）
        if (getCharNpcs(sc).length) {
          triggerNpcComments(space, post, sc).catch(function (e) { console.warn('[Moments] 聊天发圈 NPC 评论失败', e); });
        }
        return {
          ok: true, postId: post.id, text: text, imageCount: images.length, imageFailCount: failCount,
          message: '已静默发布到朋友圈' + (failCount ? '（' + failCount + ' 张图生成失败，已降级为文字图）' : '')
        };
      });
    });
  }
  function toolCommentMoment(args, ctx, loaded) {
    var space = resolveSpaceForCtx(loaded, ctx);
    if (!space) return { ok: false, error: '未找到朋友圈空间' };
    var sc = resolveCharForCtx(space, ctx);
    if (!sc) return { ok: false, error: '当前聊天角色未绑定到朋友圈空间，请先在朋友圈插件中绑定该 char。' };
    var post = resolvePostByIndex(args, loaded, space);
    if (!post) return { ok: false, error: '找不到对应朋友圈（postIndex 从 1 开始，1=最新一条）' };
    var text = trim((args && args.text) || '');
    if (!text) return { ok: false, error: '评论内容为空' };
    var replyToName = trim((args && args.replyToName) || '');
    var replyTo = null;
    if (replyToName) {
      (post.comments || []).forEach(function (c) {
        if (c.authorHandle === replyToName || c.authorName === replyToName) replyTo = c.id;
      });
      if (!replyTo) replyToName = null; // 白名单校验：防模型幻觉编造评论者
    }
    if (!post.comments) post.comments = [];
    var comment = {
      id: uuid(), postId: post.id, authorType: 'char', authorId: sc.charId,
      authorName: sc.charName, authorHandle: sc.charName,
      text: text, replyTo: replyTo, replyToName: replyToName, createdAt: Date.now()
    };
    post.comments.push(comment);
    return chatSavePosts(loaded.posts).then(function () {
      notifyUser(sc.charName + ' 评论了「' + ((post.text || '(仅图片)').slice(0, 20)) + '」：' + text);
      return { ok: true, commentId: comment.id, postIndex: getPostIndex(post, loaded, space), message: '已静默评论' };
    });
  }
  function toolLikeMoment(args, ctx, loaded) {
    var space = resolveSpaceForCtx(loaded, ctx);
    if (!space) return { ok: false, error: '未找到朋友圈空间' };
    var sc = resolveCharForCtx(space, ctx);
    if (!sc) return { ok: false, error: '当前聊天角色未绑定到朋友圈空间，请先在朋友圈插件中绑定该 char。' };
    var post = resolvePostByIndex(args, loaded, space);
    if (!post) return { ok: false, error: '找不到对应朋友圈（postIndex 从 1 开始，1=最新一条）' };
    if (!post.likes) post.likes = [];
    var idx = -1;
    for (var i = 0; i < post.likes.length; i++) if (post.likes[i].id === sc.charId) { idx = i; break; }
    if (idx >= 0) post.likes.splice(idx, 1);
    else post.likes.push({ id: sc.charId, name: sc.charName, ts: Date.now() });
    return chatSavePosts(loaded.posts).then(function () {
      notifyUser(sc.charName + (idx >= 0 ? ' 取消了对「' : ' 点赞了「') + ((post.text || '(仅图片)').slice(0, 20)) + '」');
      return { ok: true, postIndex: getPostIndex(post, loaded, space), liked: idx < 0, message: idx >= 0 ? '已取消点赞' : '已点赞' };
    });
  }
  // 主聊天每轮上下文：提醒提示词 + 该 char 行为记录 + 朋友圈内容（含总结替换）
  function chatContextProvider(ctx) {
    return chatLoadState().then(function (loaded) {
      var space = resolveSpaceForCtx(loaded, ctx);
      var cfg = loaded.chatconf || {};
      var parts = [];
      parts.push('【朋友圈行动提醒】' + (cfg.promptOnly || DEFAULT_CHAT_REMINDER));
      if (space) {
        var moodLine = buildMoodPromptLine(space);
        if (moodLine) parts.push(moodLine);
        var relLine = relationNetLine(space);
        if (relLine) parts.push(relLine);
        var sc = resolveCharForCtx(space, ctx);
        if (sc) {
          var personaLineCc = buildMomentPersonaLine(space, sc);
          if (personaLineCc) parts.push(personaLineCc);
          if (getCharNpcs(sc).length) parts.push(DEFAULT_NPC_ACTION_NOTE);
          if (sc.memSync !== false) {
            var rec = buildCharActionRecord(space, sc, loaded.posts, loaded.syncstate);
            if (rec) parts.push(rec);
          }
          var npcInjectLine = buildNpcPromptInjectLine(space, sc);
          if (npcInjectLine) parts.push(npcInjectLine);
          // 针对该 char 的配置：总结模板、条数上限、是否含评论、已保存总结；并以该 char 视角过滤陌生人
          var scCfg = {
            promptOnly: cfg.promptOnly || '',
            summaryPrompt: sc.summaryPrompt || '',
            maxFeed: parseInt(sc.maxFeed, 10) || DEFAULT_FEED_MAX,
            includeComments: sc.includeComments !== false,
            imageMode: getChatConf().imageMode
          };
          // 总结只属于该 char：仅使用该 char 自己的总结
          var scSums = sc.summaries || [];
          var feed = buildFeedContext(space, loaded.posts, scSums, scCfg, sc.charId);
          if (feed) parts.push(feed);
        } else {
          var feed2 = buildFeedContext(space, loaded.posts, loaded.summaries || [], cfg, null);
          if (feed2) parts.push(feed2);
        }
      } else {
        parts.push('（尚未创建朋友圈空间，可忽略）');
      }
      return parts.join('\n\n');
    }).catch(function () {
      return '【朋友圈行动提醒】' + (getChatConf().promptOnly || DEFAULT_CHAT_REMINDER);
    });
  }

  // 预览发送给 AI 的最终提示词原文（按指定 char 配置：per-char 总结、条数上限、含评论、图片模式、可见范围）
  function buildPromptPreviewText(space, sc) {
    if (!space || !sc) return '（未选择 char）';
    var cfg = getChatConf();
    var reminder = cfg.promptOnly || DEFAULT_CHAT_REMINDER;
    var lines = ['【朋友圈行动提醒】' + reminder];
    var moodLine = buildMoodPromptLine(space);
    if (moodLine) lines.push(moodLine);
    var personaLinePr = buildMomentPersonaLine(space, sc);
    if (personaLinePr) lines.push(personaLinePr);
    var relLine = relationNetLine(space);
    if (relLine) lines.push(relLine);
    if (getCharNpcs(sc).length) lines.push(DEFAULT_NPC_ACTION_NOTE);
    if (sc.memSync !== false) {
      var rec = buildCharActionRecord(space, sc, state.posts, state.syncstate);
      if (rec) lines.push(rec);
    }
    var npcLine = buildNpcPromptInjectLine(space, sc);
    if (npcLine) lines.push(npcLine);
    var scCfg = {
      promptOnly: cfg.promptOnly || '',
      summaryPrompt: sc.summaryPrompt || '',
      maxFeed: parseInt(sc.maxFeed, 10) || DEFAULT_FEED_MAX,
      includeComments: sc.includeComments !== false,
      imageMode: getChatConf().imageMode
    };
    var feed = buildFeedContext(space, state.posts, sc.summaries || [], scCfg, sc.charId);
    if (feed) lines.push(feed);
    return lines.join('\n\n');
  }

  // ========== 提示词 UI ==========
  function renderPromptPanelModal(space) {
    var cfg = getChatConf();
    var userNm = space ? (space.userPersonaName || '') : '';
    var html = '<div class="moments-modal-mask" data-action="close-prompt-panel"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">AI 提示词 — ' + escapeHtml(userNm) + '</div><div class="moments-modal-x" data-action="close-prompt-panel">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">静默模式：朋友圈不再注入聊天消息。你在 Roche 聊天中发送请求时，插件自动把下方提示词与朋友圈内容拼进发给 AI 的 system prompt；AI 可主动发朋友圈/评论/点赞（通过主聊天工具）。全部提示词也可在侧边栏「总提示词」集中查看/编辑。</div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-sec-title">聊天自动注入提醒提示词<span class="moments-sec-hint">已预填默认模板，可编辑；清空=恢复默认</span></div>';
    html += '<textarea class="moments-prompt-ta" data-field="chat-promptOnly" rows="4">' + escapeHtml(cfg.promptOnly || DEFAULT_CHAT_REMINDER) + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="reset-chat-reminder">恢复默认</button></div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-sec-title">发送图片模式（插件全局）<span class="moments-sec-hint">所有 char 的聊天注入/评论/召唤/NPC/总结读取图片时统一按此设定</span></div>';
    html += '<div class="moments-row"><select class="moments-input" data-field="chat-imageMode"><option value="text"' + (cfg.imageMode !== 'vision' ? ' selected' : '') + '>文字图（生图提示词）</option><option value="vision"' + (cfg.imageMode === 'vision' ? ' selected' : '') + '>识图（发送图片本体给模型）</option></select></div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-row"><div class="moments-row-label">多图生图排队间隔（毫秒）<span class="moments-sec-hint">一条朋友圈多张图自动排队生成，间隔默认 3000，0=不等待</span></div><input class="moments-input" type="number" min="0" max="60000" step="100" value="' + (cfg.genInterval == null ? 3000 : cfg.genInterval) + '" data-field="chat-genInterval"></div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-hint">总结朋友圈提示词、注入条数上限、包含评论、已保存总结等总结相关功能已合并到每个 char 的「记忆挂载与总结」面板，针对各 char 独立配置。</div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-sec-title">主动私聊可见性过滤<span class="moments-sec-hint">开启后，user 评论某 char 的朋友圈时，只有与该 char 互为「好友/已加好友」的 char 才会判断是否私聊；否则绝不触发</span></div>';
    html += '<div class="moments-row"><div class="moments-row-label">按可见性过滤<span class="moments-sec-hint">关闭=保持现状（不检查可见性）</span></div><div class="moments-sw' + (cfg.dmVisibilityCheck ? ' on' : '') + '" data-action="toggle-dm-visi"><i></i></div></div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-sec-title">私聊写入聊天（可选）<span class="moments-sec-hint">默认 Roche_db / messages（与 Roche 官方同步一致）；仅当结构不同时才需手动指定</span></div>';
    html += '<div class="moments-row"><div class="moments-row-label">聊天 IndexedDB 库名</div><input class="moments-input" data-field="chat-dmDb" value="' + escapeHtml(cfg.dmDb || '') + '" placeholder="留空=Roche_db"></div>';
    html += '<div class="moments-row"><div class="moments-row-label">聊天消息存储名</div><input class="moments-input" data-field="chat-dmStore" value="' + escapeHtml(cfg.dmStore || '') + '" placeholder="留空=messages"></div>';
    html += '<div class="moments-btn-row"><button class="moments-btn" data-action="close-prompt-panel">完成</button></div>';
    return html + '</div></div></div>';
  }

  function renderSummaryResultModal() {
    var d = state.summaryDraft; if (!d) return '';
    var space = Store.getActiveSpace();
    var charLabel = '';
    if (d.charId && space) {
      var scX = getSpaceChar(space, d.charId);
      if (scX) charLabel = ' · ' + scX.charName;
    }
    var html = '<div class="moments-modal-mask" data-action="close-summary-result"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">总结结果 — 第 ' + d.from + '-' + d.to + ' 条朋友圈' + charLabel + '</div><div class="moments-modal-x" data-action="close-summary-result">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    if (d.loading) {
      html += '<div class="moments-empty"><div class="moments-spin">' + WINDMILL_SVG + '</div><div>正在请求 AI 总结...</div></div>';
    } else {
      html += '<div class="moments-hint">预览并审核总结内容，可编辑后点击保存。保存后该范围原文在注入聊天时会被隐藏，只发送此总结；除被总结范围外，其他朋友圈照常发送原文。</div>';
      if (d.error) html += '<div class="moments-empty">' + escapeHtml(d.error) + '</div>';
      html += '<textarea class="moments-prompt-ta" id="moments-summary-editor" rows="10">' + escapeHtml(d.summary || '') + '</textarea>';
      html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="cancel-summary">取消</button><button class="moments-btn ghost" data-action="regen-summary">重新生成</button><button class="moments-btn" data-action="save-summary">保存</button></div>';
    }
    return html + '</div></div></div>';
  }

  // 关系网自动生成：把人物资料与模板拼成最终发送内容（供生成与总提示词预览共用）
  function buildRelationGenPrompt(space) {
    if (!space) return '';
    var tpl = ((space.customPrompts && space.customPrompts.relationGenPrompt) || '').trim() || DEFAULT_RELATION_GEN_PROMPT;
    var lines = [];
    lines.push('user 名字：' + (space.userPersonaName || ''));
    lines.push('user 身份：' + (space.userIdentity || '未设定'));
    (space.chars || []).forEach(function (sc) {
      var c = findChar(sc.charId) || {};
      var persona = (c.persona || c.bio || sc.charPersona || '').slice(0, 300);
      lines.push('');
      lines.push('角色：' + sc.charName);
      lines.push('身份：' + (sc.customIdentity || '未设定'));
      lines.push('人设：' + (persona || '未设定'));
    });
    return '以下是人物资料：\n' + lines.join('\n') + '\n\n' + tpl;
  }
  // AI 自动生成关系网（rel-gen / rel-gen-again 共用）
  function runRelationGen(space) {
    if (!space) return;
    if (!space.chars || !space.chars.length) { toast('请先绑定至少一个 char'); return; }
    var relUserContent = buildRelationGenPrompt(space);
    state.relGenLoading = true; setGenLoading('正在生成关系网...');
    callAI({ messages: [{ role: 'system', content: '你是关系网设计助手，只输出严格遵守格式的关系列表。' }, { role: 'user', content: relUserContent }], temperature: 0.9 }).then(function (raw) {
      state.relGenLoading = false; setGenLoading(null);
      var items = parseRelationGenOutput(raw || '');
      if (!items.length) { toast('关系网生成失败：未能解析出关系，请重试'); render(); return; }
      state.relGenDraft = { items: items, raw: raw || '' };
      toast('关系网生成成功');
      render();
    }).catch(function (err) {
      state.relGenLoading = false; setGenLoading(null); toast('关系网生成失败：' + (err && err.message || '')); render();
    });
  }
  // 重新生成某条 AI 生图（feed 重新生成按钮 / 长按 / 弹窗共用）
  // 直接在现有 DOM 上注入占位（不依赖重渲染时机），确保生成/重新生成时必然显示占位
  function setImgLoadingUI(postId, idx, loading) {
    if (!root) return;
    var el = root.querySelector('.moment[data-id="' + postId + '"] .m-img[data-idx="' + idx + '"]') ||
      root.querySelector('.moment[data-id="' + postId + '"] .m-img-text[data-idx="' + idx + '"]');
    if (!el) return;
    if (loading) {
      el.classList.add('loading');
      el.innerHTML = '<div class="m-img-loading"><i class="m-img-spin"></i><span>图片加载中……</span></div><span class="m-img-more" data-action="open-image-menu" data-id="' + postId + '" data-idx="' + idx + '" title="更多操作">' + ICON.more + '</span>';
    }
  }
  function regenPostImage(postId, idx, opts) {
    var post = null;
    for (var i = 0; i < state.posts.length; i++) if (state.posts[i].id === postId) { post = state.posts[i]; break; }
    var img = post && post.images ? post.images[idx] : null;
    if (!img || !img.prompt || (img.type !== 'ai' && img.type !== 'text')) { toast('仅 AI 生图可以重新生成'); return; }
    // 仅「查看/编辑提示词」里的重新生成做提示词变化检查；more 菜单的重新生成直接重新请求生图
    if (opts && opts.checkChange && img.prompt === img.usedPrompt) {
      notifyUser('提示词没有变化，未重新生成。如需重新生成，请先修改图片提示词。');
      return;
    }
    var oldValue = img.value; var oldType = img.type; var oldUsed = img.usedPrompt;
    img.loading = true; img.value = '';
    if (root) render();
    setImgLoadingUI(postId, idx, true);
    setTip('正在重新生成图片...');
    callGenerateImage(img.prompt || img.value).then(function (url) {
      img.type = 'ai'; img.value = url; img.usedPrompt = img.prompt; img.loading = false;
      return Store.savePosts();
    }).then(function () {
      setTip(null); toast('图片已重新生成'); if (root) render();
    }).catch(function (err) {
      // 失败恢复旧图，避免留下空白占位
      img.loading = false; img.value = oldValue; img.type = oldType; img.usedPrompt = oldUsed;
      Store.savePosts().then(function () {
        setTip(null); toast('重新生成失败：' + (err && err.message || '未知错误')); if (root) render();
      });
    });
  }
  // 用当前 draft.prompt 请求 AI 总结（请求总结与重新生成共用）
  function runSummaryAI(d) {
    if (!d) return;
    d.loading = true; d.error = ''; d.summary = '';
    setGenLoading('正在生成朋友圈总结...');
    if (root) render();
    var sumCallOpts = { messages: [{ role: 'system', content: '你是朋友圈内容总结助手，只输出总结正文。' }, { role: 'user', content: d.prompt }], temperature: 0.5 };
    if (d.images && d.images.length) sumCallOpts.images = d.images;
    callAI(sumCallOpts).then(function (raw) {
      setGenLoading(null);
      if (state.summaryDraft !== d) return;
      d.loading = false; d.summary = trim(raw || '');
      toast('朋友圈总结生成成功');
      if (root) render();
    }).catch(function (err) {
      setGenLoading(null);
      if (state.summaryDraft !== d) return;
      d.loading = false; d.error = '总结失败：' + ((err && err.message) || '未知错误');
      toast('朋友圈总结生成失败：' + ((err && err.message) || '未知错误'));
      if (root) render();
    });
  }

  // ========== 总提示词：查看/编辑所有 user 可定义提示词 ==========
  // 全局/空间级提示词注册表（每项含影响范围备注、默认模板、读写与预览）
  function getAllPromptItems(space) {
    var items = [
      {
        key: 'chat-reminder',
        label: '聊天自动注入提醒（AI 行动提醒）',
        scope: '影响范围：所有聊天会话的 system prompt 注入（Roche 主聊天），提醒 AI 可主动发圈/评论/点赞；与「总提示词」其他项不重复。',
        def: DEFAULT_CHAT_REMINDER,
        get: function () { return getChatConf().promptOnly || DEFAULT_CHAT_REMINDER; },
        set: function (v) { state.chatconf = getChatConf(); state.chatconf.promptOnly = v; Store.saveChatConf(); },
        preview: function () { return '【朋友圈行动提醒】' + (getChatConf().promptOnly || DEFAULT_CHAT_REMINDER); }
      },
      {
        key: 'mood-charPost',
        label: '发圈氛围提示',
        scope: '影响范围：插件内 char 自动发朋友圈的生成提示词 + 聊天上下文注入；默认留空=不注入。',
        def: '',
        get: function () { var cp = (space && space.customPrompts) || {}; return cp.charPost || ''; },
        set: function (v) { if (space) { if (!space.customPrompts) space.customPrompts = {}; space.customPrompts.charPost = v; Store.saveSpaces(); } },
        preview: function () { return buildMoodPromptLine(space) || '（未设定，不注入）'; }
      },
      {
        key: 'mood-charComment',
        label: '评论氛围提示',
        scope: '影响范围：插件内 char 评论/召唤评论生成 + 聊天上下文注入；默认留空=不注入。',
        def: '',
        get: function () { var cp = (space && space.customPrompts) || {}; return cp.charComment || ''; },
        set: function (v) { if (space) { if (!space.customPrompts) space.customPrompts = {}; space.customPrompts.charComment = v; Store.saveSpaces(); } },
        preview: function () { return buildMoodPromptLine(space) || '（未设定，不注入）'; }
      },
      {
        key: 'mood-npcComment',
        label: 'NPC 评论氛围提示',
        scope: '影响范围：插件内 NPC 评论/点赞生成（含批量 NPC 评论）；默认留空=不注入。',
        def: '',
        get: function () { var cp = (space && space.customPrompts) || {}; return cp.npcComment || ''; },
        set: function (v) { if (space) { if (!space.customPrompts) space.customPrompts = {}; space.customPrompts.npcComment = v; Store.saveSpaces(); } },
        preview: function () { return buildMoodPromptLine(space) || '（未设定，不注入）'; }
      },
      {
        key: 'rel-gen-prompt',
        label: '关系网自动生成提示词',
        scope: '影响范围：仅「关系网」里 AI 自动生成关系的提示词模板，不进入聊天与朋友圈生成。',
        def: DEFAULT_RELATION_GEN_PROMPT,
        get: function () { return ((space && space.customPrompts && space.customPrompts.relationGenPrompt) || '').trim() || DEFAULT_RELATION_GEN_PROMPT; },
        set: function (v) { if (space) { if (!space.customPrompts) space.customPrompts = {}; space.customPrompts.relationGenPrompt = v; Store.saveSpaces(); } },
        preview: function () { return buildRelationGenPrompt(space) || '（未绑定 char，无内容）'; }
      }
    ];
    return items;
  }
  // 总提示词面板：按功能分类展示每个功能包含的提示词；可预览/编辑，编辑后自动同步并提示「已更新」
  // 内置提示词只读预览取值
  function getBuiltinPromptValue(key) {
    if (key === 'builtin-post-rules') return DEFAULT_POST_RULES;
    if (key === 'builtin-exec-note') return GENERATED_ACTION_NOTE;
    if (key === 'builtin-comment-principle') return DEFAULT_COMMENT_PRINCIPLE;
    if (key === 'builtin-npc-action-note') return DEFAULT_NPC_ACTION_NOTE;
    return '';
  }
  // 按功能分类生成提示词条目（field=空间级可编辑，perchar=当前 char 可编辑，builtin=内置只读，ref=引用只读自动同步）
  function buildPromptFeatureGroups(space, sc, cp, cfg) {
    function scVal(field, def) { return sc ? ((sc[field] != null && sc[field] !== '') ? sc[field] : (def || '')) : ''; }
    function scUserLine() { return sc ? ((sc.syncFormat && sc.syncFormat.userLine) || userDualNameLine(space)) : ''; }
    function scMoment() { return scVal('momentPersona', ''); }
    // 实际注入内容的只读预览辅助
    function charPersonaVal() { var c = findChar(sc && sc.charId) || {}; return (c.persona || c.bio || (sc && sc.charPersona) || ''); }
    function mentionablesVal() {
      if (!space) return '';
      var m = [space.userPersonaName || ''];
      (space.chars || []).forEach(function (ch) { if (ch.postEnabled || ch.commentEnabled) m.push(ch.charName); });
      return '可以 @ 的人：' + m.join('、');
    }
    function asyncRt(key, perChar) {
      return function () {
        var r = state._promptRuntime;
        if (!r) return '';
        if (r.loading) return '（加载中…）';
        if (r.spaceId !== (space && space.id)) return '';
        if (perChar && r.charId !== (sc && sc.charId)) return '';
        return r[key] || '';
      };
    }
    function runtimeItem(label, note, valueFn) { return { type: 'runtime', label: label, note: note, value: valueFn }; }
    function userDualVal() { return userDualNameLine(space); }
    function relationVal() { return relationNetLine(space) || ''; }
    function npcRosterVal() { return sc ? (buildNpcRosterPrompt(space, sc) || '') : ''; }
    function feedVal() {
      if (!sc) return '';
      var cfgF = { promptOnly: '', summaryPrompt: sc.summaryPrompt || '', maxFeed: parseInt(sc.maxFeed, 10) || DEFAULT_FEED_MAX, includeComments: sc.includeComments !== false, imageMode: getChatConf().imageMode };
      return buildFeedContext(space, state.posts, sc.summaries || [], cfgF, sc.charId) || '';
    }
    var groups = [];
    groups.push({
      key: 'post',
      label: '发一条（char 发朋友圈）',
      desc: '「发一条」按钮 / 后台定时发圈 / 聊天中发朋友圈时拼给 AI 的提示词',
      items: [
        { type: 'perchar', perChar: true, label: 'char 朋友圈人设', scope: '该 char 做任何朋友圈操作（发圈/评论/召唤/NPC 评论）与聊天注入时自动注入；每个 char 独立，留空=不注入。', key: 'perchar-momentPersona', dataField: 'allprompt-char-momentPersona', cid: sc ? sc.charId : '', value: scMoment },
        { type: 'field', label: '发圈氛围提示', scope: '该 char 发朋友圈生成时注入；聊天上下文也可见；留空=不注入。', key: 'field-mood-charPost', dataField: 'allprompt-mood-charPost', value: function () { return cp.charPost || ''; } },
        { type: 'builtin', key: 'builtin-post-rules', label: '发圈规则（内置）', scope: '发圈生成时固定注入，强调 <post> 格式与互动原则。', value: DEFAULT_POST_RULES },
        { type: 'builtin', key: 'builtin-exec-note', label: '执行说明（内置）', scope: '发圈/评论生成时固定注入，避免工具调用残留。', value: GENERATED_ACTION_NOTE },
        runtimeItem('char 人设（Roche 角色）', '发圈生成时注入，AI 可见该 char 的完整人设', charPersonaVal),
        runtimeItem('挂载的会话记忆', '发圈生成时注入该 char 挂载会话的短期/长期记忆', asyncRt('memory', true)),
        runtimeItem('世界书（空间级）', '发圈生成时注入空间级挂载的世界书词条内容', asyncRt('worldGlobal', false)),
        runtimeItem('世界书（该 char）', '发圈生成时注入该 char 挂载的世界书词条内容', asyncRt('worldLocal', true)),
        runtimeItem('user 认知行', '发圈生成时注入 user 双名字认知行', userDualVal),
        runtimeItem('user 人设', '发圈生成时注入当前 user 的人设', asyncRt('userPersona', false)),
        runtimeItem('关系网提示词', '发圈生成时注入关系网身份与关系', relationVal),
        runtimeItem('可 @ 的人', '发圈生成时注入可 @ 的人名列表', mentionablesVal),
        runtimeItem('朋友圈上下文（feed）', '发圈生成时注入该 char 可见的朋友圈内容（第1条=最新；被总结范围只发总结）', feedVal)
      ]
    });
    groups.push({
      key: 'summon',
      label: '召唤评论（char 评论）',
      desc: '插件内「召唤评论」/ 自动评论 / user 发圈后自动生成评论时拼给 AI 的提示词',
      items: [
        { type: 'ref', label: 'char 朋友圈人设', scope: '同「发一条」中的 char 朋友圈人设，自动同步。', from: '发一条', value: scMoment },
        { type: 'field', label: '评论氛围提示', scope: 'char 评论/召唤评论生成时注入；聊天上下文也可见；留空=不注入。', key: 'field-mood-charComment', dataField: 'allprompt-mood-charComment', value: function () { return cp.charComment || ''; } },
        { type: 'builtin', key: 'builtin-comment-principle', label: '评论/点赞原则（内置）', scope: '评论生成时固定注入，解释点赞/评论的含义。', value: DEFAULT_COMMENT_PRINCIPLE },
        runtimeItem('NPC 好友背景', '召唤评论含 NPC 时注入该 char 的 NPC 名单（发圈者开启 npcSummon）', npcRosterVal),
        runtimeItem('char 人设（Roche 角色）', '评论生成时注入，AI 可见该 char 的完整人设', charPersonaVal),
        runtimeItem('挂载的会话记忆', '评论生成时注入该 char 挂载会话的短期/长期记忆', asyncRt('memory', true)),
        runtimeItem('世界书（空间级）', '评论生成时注入空间级挂载的世界书词条内容', asyncRt('worldGlobal', false)),
        runtimeItem('世界书（该 char）', '评论生成时注入该 char 挂载的世界书词条内容', asyncRt('worldLocal', true)),
        runtimeItem('user 认知行', '评论生成时注入 user 双名字认知行', userDualVal),
        runtimeItem('user 人设', '评论生成时注入当前 user 的人设', asyncRt('userPersona', false)),
        runtimeItem('关系网提示词', '评论生成时注入关系网身份与关系', relationVal),
        runtimeItem('可 @ 的人', '评论生成时注入可 @ 的人名列表', mentionablesVal),
        runtimeItem('朋友圈上下文（feed）', '评论生成时注入该 char 可见的朋友圈内容（第1条=最新；被总结范围只发总结）', feedVal)
      ]
    });
    groups.push({
      key: 'npc',
      label: 'NPC 评论',
      desc: 'char 发圈后 NPC 自动评论/点赞（一次批量请求）时拼给 AI 的提示词',
      items: [
        { type: 'ref', label: 'char 朋友圈人设', scope: 'NPC 归属的 char 的人设，自动同步。', from: '发一条', value: scMoment },
        { type: 'field', label: 'NPC 评论氛围提示', scope: 'NPC 评论生成时注入；留空=不注入。', key: 'field-mood-npcComment', dataField: 'allprompt-mood-npcComment', value: function () { return cp.npcComment || ''; } },
        { type: 'perchar', perChar: true, label: 'NPC 提示词（合并）', scope: '该 char 的所有 NPC 评论生成 + 聊天 NPC 提示词注入；变量 {charName}/{npcList}。', key: 'perchar-npcPrompt', dataField: 'allprompt-char-npcPrompt', cid: sc ? sc.charId : '', value: function () { return scVal('npcPrompt', DEFAULT_NPC_ROSTER_PROMPT); } },
        { type: 'builtin', key: 'builtin-comment-principle', label: '评论/点赞原则（内置）', scope: 'NPC 评论生成时固定注入。', value: DEFAULT_COMMENT_PRINCIPLE },
        runtimeItem('char 人设（Roche 角色）', 'NPC 评论生成时注入，NPC 可见发圈 char 的完整人设', charPersonaVal),
        runtimeItem('NPC 名单（实际注入）', 'NPC 评论生成时注入的 NPC 名单与背景（合并提示词）', npcRosterVal),
        runtimeItem('朋友圈上下文（feed）', 'NPC 评论生成时注入发圈 char 可见的朋友圈内容（第1条=最新；被总结范围只发总结）', feedVal)
      ]
    });
    groups.push({
      key: 'chat',
      label: '聊天时 char 的提示词（聊天注入）',
      desc: '你在 Roche 主聊天与该 char 对话时，插件自动拼进 system prompt 的内容',
      items: [
        { type: 'field', label: '聊天自动注入提醒', scope: '所有聊天会话的 system prompt 注入，提醒 AI 可主动发圈/评论/点赞；已预填默认模板。', key: 'field-chat-reminder', dataField: 'allprompt-chat-reminder', value: function () { return cfg.promptOnly || DEFAULT_CHAT_REMINDER; } },
        { type: 'perchar', perChar: true, label: 'user 认知行', scope: '该 char 聊天注入时的 user 认知行；变量 {userName}/{charName}。', key: 'perchar-userLine', dataField: 'allprompt-char-userLine', cid: sc ? sc.charId : '', value: scUserLine },
        { type: 'perchar', perChar: true, label: '主动私聊判断提示词', scope: 'user 发朋友圈/评论后，AI 依据它判断是否私聊 user 并生成私聊内容；变量 {charName}/{userName}/{postText}/{commentText}/{activity}/{ts}。', key: 'perchar-dmPrompt', dataField: 'allprompt-char-dmPrompt', cid: sc ? sc.charId : '', value: function () { return scVal('dmPrompt', DEFAULT_DM_PROMPT); } },
        { type: 'ref', label: 'char 朋友圈人设', scope: '同「发一条」，聊天注入时自动同步。', from: '发一条', value: scMoment },
        { type: 'ref', label: '发圈/评论氛围提示', scope: '同「发一条」「召唤评论」，聊天注入时自动同步。', from: '发一条/召唤评论', value: function () { return buildMoodPromptLine(space) || '（未设置）'; } },
        { type: 'ref', label: 'NPC 提示词（合并）', scope: '同「NPC 评论」，该 char 开启 NPC 提示词注入时聊天可见。', from: 'NPC 评论', value: function () { return sc ? (buildNpcRosterPrompt(space, sc) || '（未绑定 NPC）') : ''; } },
        { type: 'ref', label: '总结提示词', scope: '同「总结 / 记忆同步」。', from: '总结 / 记忆同步', value: function () { return scVal('summaryPrompt', DEFAULT_SUMMARY_PROMPT); } },
        { type: 'builtin', key: 'builtin-npc-action-note', label: 'NPC 互动说明（内置）', scope: '该 char 绑定 NPC 时聊天注入的固定说明。', value: DEFAULT_NPC_ACTION_NOTE },
        runtimeItem('关系网提示词', '聊天注入时拼入关系网身份与关系', relationVal),
        runtimeItem('user 认知行（memSync）', '该 char 开启 memSync 时，聊天注入 user 认知行（始终注入，非行为内容）；未开启则聊天不注入', function () { if (sc && sc.memSync === false) return ''; return buildCharActionRecord(space, sc, state.posts, state.syncstate) || ''; }),
        runtimeItem('朋友圈上下文（feed）', '聊天注入时拼入该 char 可见的朋友圈内容（第1条=最新；被总结范围只发总结）', function () {
          if (!sc) return '';
          var cfgF = { promptOnly: '', summaryPrompt: sc.summaryPrompt || '', maxFeed: parseInt(sc.maxFeed, 10) || DEFAULT_FEED_MAX, includeComments: sc.includeComments !== false, imageMode: getChatConf().imageMode };
          return buildFeedContext(space, state.posts, sc.summaries || [], cfgF, sc.charId) || '';
        })
      ]
    });
    groups.push({
      key: 'summary',
      label: '总结 / 记忆同步',
      desc: '该 char 的朋友圈总结与同步到长期记忆时使用的提示词',
      items: [
        { type: 'perchar', perChar: true, label: '总结提示词', scope: '仅该 char 聊天注入时「总结朋友圈」的提示词模板；变量 {from}/{to}/{count}。', key: 'perchar-summaryPrompt', dataField: 'allprompt-char-summaryPrompt', cid: sc ? sc.charId : '', value: function () { return scVal('summaryPrompt', DEFAULT_SUMMARY_PROMPT); } },
        { type: 'perchar', perChar: true, label: '记忆同步提示词', scope: '仅该 char 把朋友圈行为同步进长期记忆的提示词模板；变量 {charName}。', key: 'perchar-syncPrompt', dataField: 'allprompt-char-syncPrompt', cid: sc ? sc.charId : '', value: function () { return scVal('syncPrompt', DEFAULT_SYNC_PROMPT); } }
      ]
    });
    groups.push({
      key: 'gen',
      label: '生成类：朋友圈人设 / NPC / 关系网',
      desc: '「AI 生成朋友圈人设」「AI 生成建议（NPC）」「AI 生成关系网」时使用的提示词；均只在这些生成动作时注入，不会进入发圈/评论/聊天',
      items: [
        { type: 'perchar', perChar: true, label: '朋友圈人设生成提示词', scope: '仅「AI 生成朋友圈人设」时使用；生成时 AI 可见该 char 的人设与挂载记忆；变量 {charName}/{userName}。', key: 'perchar-momentGenPrompt', dataField: 'allprompt-char-momentGenPrompt', cid: sc ? sc.charId : '', value: function () { return scVal('momentGenPrompt', DEFAULT_MOMENT_GEN_PROMPT); } },
        { type: 'perchar', perChar: true, label: '生成 NPC 提示词', scope: '仅「AI 生成建议」时发送给 AI 的提示词模板。', key: 'perchar-npcGenPrompt', dataField: 'allprompt-char-npcGenPrompt', cid: sc ? sc.charId : '', value: function () { return scVal('npcGenPrompt', DEFAULT_NPC_GEN_PROMPT); } },
        { type: 'field', label: '关系网自动生成提示词', scope: '仅「关系网」里 AI 自动生成关系的提示词模板，不进聊天与朋友圈生成；已预填默认模板。', key: 'field-rel-gen-prompt', dataField: 'allprompt-rel-gen-prompt', value: function () { return (cp.relationGenPrompt || '').trim() || DEFAULT_RELATION_GEN_PROMPT; } },
        runtimeItem('char 人设（生成时可见）', '「AI 生成朋友圈人设」时注入该 char 人设', charPersonaVal),
        runtimeItem('挂载的会话记忆（生成时可见）', '「AI 生成朋友圈人设」时注入挂载记忆', asyncRt('memory', true)),
        runtimeItem('user 人设（生成时可见）', '「AI 生成朋友圈人设」时注入当前 user 人设', asyncRt('userPersona', false))
      ]
    });
    return groups;
  }
  // 合成某个功能「实际发送给 AI 的完整提示词」（与真实构建逻辑一致；聊天分类与 chatContextProvider 完全一致）
  function previewFeaturePrompt(space, sc, key) {
    if (!space || !sc) return Promise.resolve('（未选择 char）');
    var rt = state._promptRuntime || {};
    var mem = (rt.spaceId === space.id && rt.charId === sc.charId) ? (rt.memory || '') : '';
    var worldG = (rt.spaceId === space.id) ? (rt.worldGlobal || '') : '';
    var worldL = (rt.spaceId === space.id && rt.charId === sc.charId) ? (rt.worldLocal || '') : '';
    var userPersona = (rt.spaceId === space.id) ? (rt.userPersona || '') : '';
    var c = findChar(sc.charId) || {};
    var persona = c.persona || c.bio || sc.charPersona || '';
    var cfg = getChatConf();
    var scCfg = { promptOnly: '', summaryPrompt: sc.summaryPrompt || '', maxFeed: parseInt(sc.maxFeed, 10) || DEFAULT_FEED_MAX, includeComments: sc.includeComments !== false, imageMode: cfg.imageMode };
    var feed = buildFeedContext(space, state.posts, sc.summaries || [], scCfg, sc.charId);
    var prompts = getSpacePrompts(space);
    var momentLine = buildMomentPersonaLine(space, sc);
    var relLine = relationNetLine(space);
    function mentionables() {
      var m = [space.userPersonaName || ''];
      (space.chars || []).forEach(function (ch) { if (ch.postEnabled || ch.commentEnabled) m.push(ch.charName); });
      return '可以 @ 的人：' + m.join('、');
    }
    if (key === 'chat') {
      // 与 chatContextProvider 逐项一致
      return Promise.resolve(buildPromptPreviewText(space, sc));
    }
    if (key === 'post') {
      var postCount = parseInt(sc.postCount, 10); if (isNaN(postCount) || postCount < 1) postCount = 1; if (postCount > 9) postCount = 9;
      var sys = '你是「' + sc.charName + '」，此刻正在刷微信朋友圈。\n';
      if (persona) sys += '\n你的人设：\n' + persona + '\n';
      if (sc.customIdentity) sys += '你在关系网中的身份：' + sc.customIdentity + '\n';
      if (mem) sys += '\n你最近的记忆与对话上下文（来自 Roche 聊天）：\n' + mem + '\n';
      if (worldG) sys += '\n【世界书（user 挂载 · 插件内生成）】\n' + worldG + '\n';
      if (worldL) sys += '\n【世界书（' + sc.charName + ' 挂载 · 插件内生成）】\n' + worldL + '\n';
      sys += '\n' + userDualNameLine(space) + '\n';
      if (userPersona) sys += '\n【当前 user 的人设】\n' + userPersona + '\n';
      if (relLine) sys += relLine + '\n';
      if (prompts.charPost) sys += '\n【发圈氛围提示（user 设定，请遵循）】' + prompts.charPost + '\n';
      if (momentLine) sys += '\n' + momentLine + '\n';
      if (feed) sys += '\n' + feed + '\n';
      sys += '\n' + mentionables() + '\n';
      sys += '\n' + DEFAULT_POST_RULES + '\n';
      sys += '\n现在请你做两件事：\n';
      sys += '1. 发 ' + postCount + ' 条属于你自己的朋友圈（' + (postCount > 1 ? '可以一次连续输出多条' : '只发一条') + '）\n';
      sys += '2. 根据你的兴趣和性格，从上面动态里挑 0-3 条去评论；也可以评论你自己刚发的最后一条\n';
      sys += '\n严格按以下格式输出，不要多余内容：\n';
      sys += '<post><text>你的朋友圈正文</text><images><img>图片1描述</img><img>图片2描述</img></images></post>\n';
      sys += '（共输出 ' + postCount + ' 个 <post> 块；配图能显著提升朋友圈的生动度与互动，请尽量为每条朋友圈配 1-3 张图；若配图，每行一个 <img> 生图提示词，插件会自动调用 Roche 生图配置生成图片）\n';
      sys += '<comment target="对方名字">你的评论</comment>   （可重复多行，target 填要评论的那条动态的作者名；评论自己刚发的就填 "' + sc.charName + '"；评论正文里可以用 @名字 提及某人）\n';
      sys += '\n要求：第一人称「我」，符合人设口吻，简短自然，可以依据人设适当使用 emoji（不必刻意回避，也不要过度使用），避免强行加话题标签。@某人 用 @名字 形式写在评论正文里。';
      sys += '\n配图要求（重要）：尽量配 1-3 张；若配图，<images>/<img> 标签格式必须正确（每个 <img> 单独一行一个生图提示词），提示词要具体（主体、场景、风格、氛围），可直接用于生图模型；纯文字心情可以不配图。';
      sys += '\n' + GENERATED_ACTION_NOTE;
      return Promise.resolve(sys);
    }
    if (key === 'summon') {
      var latest = null;
      for (var i = 0; i < state.posts.length; i++) if (state.posts[i].spaceId === space.id) { latest = state.posts[i]; break; }
      var post = latest || { id: '(示例)', spaceId: space.id, authorType: 'char', authorId: sc.charId, authorName: sc.charName, text: '(示例朋友圈正文)', images: [], likes: [], comments: [] };
      var sys = '你是「' + sc.charName + '」，正在看「' + (post.authorName || '') + '」的微信朋友圈。\n';
      if (persona) sys += '\n你的人设：\n' + persona + '\n';
      if (sc.customIdentity) sys += '你在关系网中的身份：' + sc.customIdentity + '\n';
      if (prompts.charComment) sys += '\n【评论氛围提示（user 设定，请遵循）】' + prompts.charComment + '\n';
      if (momentLine) sys += '\n' + momentLine + '\n';
      if (mem) sys += '\n你最近的记忆上下文：\n' + mem + '\n';
      if (worldG) sys += '\n【世界书（user 挂载 · 插件内生成）】\n' + worldG + '\n';
      if (worldL) sys += '\n【世界书（' + sc.charName + ' 挂载 · 插件内生成）】\n' + worldL + '\n';
      if (relLine) sys += relLine + '\n';
      if (userPersona) sys += '\n【当前 user 的人设】\n' + userPersona + '\n';
      if (feed) sys += '\n【你可见的朋友圈上下文】\n' + feed + '\n';
      sys += '\n这条朋友圈内容：\n' + (post.text || '(仅图片)') + '\n';
      var imgDesc1 = describePostImages(post, 'text');
      if (imgDesc1) sys += '（图片：' + imgDesc1 + '）\n';
      sys += post.authorType === 'user' ? '发朋友圈的是 user（' + (space.userPersonaName || '') + '）。\n' : '发朋友圈的是 ' + (post.authorName || '') + '（和你一样是 char）。\n';
      sys += '\n' + mentionables() + '\n';
      sys += '\n请以你的身份评论。可以写 1-3 条：评论朋友圈本身、回复已有评论里的某人、@某人都可以。\n';
      sys += '\n' + DEFAULT_COMMENT_PRINCIPLE + '\n';
      sys += '\n输出格式（严格遵守，不要多余内容）：\n';
      sys += '<comment reply-to="被回复人名字">评论正文</comment>   （reply-to 可选，回复某人评论时填那人名字；不回复就省略整个 reply-to 属性。可输出多条）\n';
      sys += '<like>1</like> 或 <like>0</like>   （放末尾，1 表示顺便给这条朋友圈点赞，0 表示不点）\n';
      sys += '\n要求：第一人称「我」，符合人设口吻，每条 1-2 句，简短自然，可以依据人设适当使用 emoji（不必刻意回避，也不要过度使用），避免强行加话题标签。@某人 用 @名字 形式写在评论正文里。';
      sys += '\n注：reply-to 只能填上方「已有评论」里出现过的评论者名字；若只是评论朋友圈本身则必须省略 reply-to。user 未评论时绝对不能填 user 的名字。';
      sys += '\n重要：回复某人评论时必须带 reply-to="被回复人名字"，展示为「小明 回复 小红：…」；回复正文里不要再写 @被回复人 的名字。';
      sys += '\n' + GENERATED_ACTION_NOTE;
      return Promise.resolve(sys);
    }
    if (key === 'npc') {
      var latestN = null;
      for (var j = 0; j < state.posts.length; j++) if (state.posts[j].spaceId === space.id) { latestN = state.posts[j]; break; }
      var postN = latestN || { id: '(示例)', spaceId: space.id, authorType: 'char', authorId: sc.charId, authorName: sc.charName, text: '(示例朋友圈正文)', images: [], likes: [], comments: [] };
      return Promise.resolve(buildNpcCommentSys(space, postN, sc, getCharNpcs(sc), []));
    }
    if (key === 'summary') {
      var from = parseInt(sc.sumFrom, 10) || 1; var to = parseInt(sc.sumTo, 10) || 3; if (to < from) to = from;
      var content = buildSummaryRequestContent(space, state.posts, from, to, sc.includeComments !== false, sc.charId, 'text');
      var prompt = buildSummaryPrompt({ summaryPrompt: sc.summaryPrompt || '' }, from, to, content.ok ? content.text : '(无可总结内容)');
      return Promise.resolve('（总结范围：第 ' + from + '-' + to + ' 条' + (sc.includeComments === false ? '' : '，含评论') + '）\n\n' + prompt);
    }
    if (key === 'sync') {
      var tpl = (sc.syncPrompt || '').trim() || DEFAULT_SYNC_PROMPT;
      return Promise.resolve('（记忆同步提示词，{charName} 已替换）\n\n' + tpl.replace(/\{charName\}/g, sc.charName));
    }
    if (key === 'gen') {
      var lines = [];
      var mg = '你是朋友圈人设生成助手。\n当前 char：' + sc.charName + (persona ? '\n【char 人设】\n' + persona : '') + (mem ? '\n【挂载的会话聊天记录/记忆】\n' + mem : '') + (userPersona ? '\n【当前 user 的人设】\n' + userPersona : '');
      lines.push('【AI 生成朋友圈人设 · 系统提示词】\n' + mg);
      lines.push('【AI 生成朋友圈人设 · 用户提示词】\n' + ((sc.momentGenPrompt || DEFAULT_MOMENT_GEN_PROMPT).replace(/\{charName\}/g, sc.charName).replace(/\{userName\}/g, space.userPersonaName || '')));
      var existNpc = (sc.npcs || []).map(function (n) { return '· ' + n.name + '：' + (n.bio || ''); }).join('\n');
      lines.push('【AI 生成 NPC · 系统提示词】\n' + (sc.npcGenPrompt || DEFAULT_NPC_GEN_PROMPT) + '\n\n【AI 生成 NPC · 用户提示词】\n' + (existNpc ? '已绑定的 NPC（生成时请勿重复）：\n' + existNpc + '\n\n' : '') + '【附加数据】\nchar 名字：' + sc.charName + '\nchar 人设：' + (persona || '(无)'));
      lines.push('【AI 生成关系网 · 发送内容】\n' + buildRelationGenPrompt(space));
      return Promise.resolve(lines.join('\n\n================\n\n'));
    }
    return Promise.resolve('（该分类暂无完整预览）');
  }

  // 加载生成/注入时会用到的运行时上下文（世界书/挂载记忆/user 人设），供总提示词预览
  function loadPromptRuntime(space, sc) {
    if (!space) return Promise.resolve();
    state._promptRuntime = state._promptRuntime || {};
    state._promptRuntime.loading = true;
    if (root) render();
    return Promise.all([
      loadWorldbookText(space.worldMounts || []),
      sc ? loadWorldbookText(sc.localWorldMounts || []) : Promise.resolve(''),
      sc ? loadMountedMemory(sc) : Promise.resolve(''),
      loadUserPersonaText(space)
    ]).then(function (r) {
      state._promptRuntime = { spaceId: space.id, charId: sc ? sc.charId : null, worldGlobal: r[0], worldLocal: r[1], memory: r[2], userPersona: r[3], loading: false };
      if (root) render();
    }).catch(function () {
      state._promptRuntime = state._promptRuntime || {};
      state._promptRuntime.loading = false;
      if (root) render();
    });
  }
  // 总提示词面板：按功能分类渲染；per-char 提示词随顶部 char 切换
  function renderAllPromptsModal(space) {
    if (!space) space = Store.getActiveSpace();
    var chars = (space && space.chars) || [];
    var charId = state._allPromptsCharId;
    var sc = null;
    for (var i = 0; i < chars.length; i++) { if (chars[i].charId === charId) sc = chars[i]; }
    if (!sc && chars.length) { sc = chars[0]; charId = sc.charId; }
    var cp = (space && space.customPrompts) || {};
    var cfg = getChatConf();
    var html = '<div class="moments-modal-mask" data-action="close-all-prompts"><div class="moments-modal wide allprompts" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">总提示词 — ' + escapeHtml((space && space.userPersonaName) || '') + '</div><div class="moments-modal-x" data-action="close-all-prompts">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">按<b>功能分类</b>查看每个功能包含的提示词；每项标注<b>影响范围</b>，可预览/编辑。编辑保存后会自动同步到受影响的提示词部分，并在本面板顶部提示「已更新」。</div>';
    if (state._promptUpdated) {
      html += '<div class="moments-hint ok">✓ 已更新：' + escapeHtml(state._promptUpdated.label) + ' —— 已自动同步到受影响的提示词。</div>';
    }
    html += '<div class="moments-div"></div>';
    if (chars.length) {
      html += '<div class="moments-row"><div class="moments-row-label">per-char 提示词当前 char</div><select class="moments-input" data-field="allprompt-char-select">';
      chars.forEach(function (ch) {
        html += '<option value="' + escapeHtml(ch.charId) + '"' + (ch.charId === charId ? ' selected' : '') + '>' + escapeHtml(ch.charName) + '</option>';
      });
      html += '</select></div><div class="moments-div"></div>';
    }
    var groups = buildPromptFeatureGroups(space, sc, cp, cfg);
    html += '<div class="moments-row"><div class="moments-row-label">分类折叠</div><div class="moments-btn-row" style="flex:1;margin-top:0;"><button class="moments-btn ghost" data-action="expand-all-prompts">全部展开</button><button class="moments-btn ghost" data-action="collapse-all-prompts">全部收起</button></div></div>';
    groups.forEach(function (g) {
      var isCollapsed = state._allPromptsCollapsed ? state._allPromptsCollapsed[g.key] !== false : true;
      html += '<div class="moments-group">';
      html += '<div class="moments-group-hd" data-action="toggle-allprompt-group" data-group="' + escapeHtml(g.key) + '"><div class="moments-group-hd-row"><span class="moments-group-caret">' + (isCollapsed ? '▸' : '▾') + '</span><span class="moments-group-title">' + escapeHtml(g.label) + '</span></div><div class="moments-group-desc">' + escapeHtml(g.desc) + '</div></div>';
      if (!isCollapsed) {
        html += '<div class="moments-group-bd">';
        g.items.forEach(function (it) {
          if (it.type === 'builtin') {
            html += '<div class="moments-mood-label">' + escapeHtml(it.label) + '<span class="moments-sec-hint">内置固定 · 只读</span></div>';
            html += '<div class="moments-scope-note">' + escapeHtml(it.scope) + '</div>';
            html += '<pre class="moments-preview">' + escapeHtml(it.value) + '</pre>';
          } else if (it.type === 'ref') {
            html += '<div class="moments-mood-label">' + escapeHtml(it.label) + '<span class="moments-sec-hint">引用 · 编辑入口见「' + escapeHtml(it.from) + '」</span></div>';
            html += '<div class="moments-scope-note">' + escapeHtml(it.scope) + '</div>';
            html += '<div class="moments-ref-value">' + escapeHtml(it.value() || '（未设置，不注入）') + '</div>';
          } else if (it.perChar && !sc) {
            html += '<div class="moments-mood-label">' + escapeHtml(it.label) + '</div><div class="moments-scope-note">' + escapeHtml(it.scope) + '</div><div class="moments-ref-value">（尚未绑定 char）</div>';
          } else if (it.type === 'runtime') {
            var rtVal = it.value() || '';
            html += '<div class="moments-mood-label">' + escapeHtml(it.label) + '<span class="moments-sec-hint">实际注入 · 只读预览</span></div>';
            html += '<div class="moments-scope-note">' + escapeHtml(it.note) + '</div>';
            html += '<pre class="moments-preview runtime">' + escapeHtml(rtVal || '（未挂载/未设置，不注入）') + '</pre>';
          } else {
            html += '<div class="moments-mood-label">' + escapeHtml(it.label) + '</div>';
            html += '<div class="moments-scope-note">' + escapeHtml(it.scope) + '</div>';
            html += '<textarea class="moments-prompt-ta" data-field="' + it.dataField + '" data-cid="' + escapeHtml(it.cid || '') + '" rows="3">' + escapeHtml(it.value()) + '</textarea>';
            html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="reset-all-prompt" data-key="' + escapeHtml(it.key) + '" data-cid="' + escapeHtml(it.cid || '') + '">恢复默认</button><button class="moments-btn ghost" data-action="preview-all-prompt" data-key="' + escapeHtml(it.key) + '" data-cid="' + escapeHtml(it.cid || '') + '">预览</button></div>';
          }
        });
        html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="preview-feature-prompt" data-key="' + escapeHtml(g.key) + '">预览实际发送的完整提示词</button></div>';
        html += '</div>';
      }
      html += '</div>';
    });
    html += '<div class="moments-btn-row"><button class="moments-btn" data-action="close-all-prompts">完成</button></div>';
    return html + '</div></div></div>';
  }

  // AI 生成朋友圈人设的结果预览/编辑/应用弹窗
  function renderMomentGenDraftModal(space) {
    var d = state.momentGenDraft; if (!d) return '';
    var html = '<div class="moments-modal-mask" data-action="close-moment-gen-draft"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">生成的朋友圈人设 — ' + escapeHtml(d.charName) + '</div><div class="moments-modal-x" data-action="close-moment-gen-draft">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">AI 根据该 char 的人设与挂载的会话聊天记录/记忆生成。可直接编辑后「应用」，或「重新生成」。</div>';
    html += '<textarea class="moments-prompt-ta" id="moment-gen-editor" rows="6">' + escapeHtml(d.text || '') + '</textarea>';
    html += '<div class="moments-btn-row"><button class="moments-btn ghost" data-action="close-moment-gen-draft">取消</button><button class="moments-btn ghost" data-action="regen-moment-persona">重新生成</button><button class="moments-btn" data-action="apply-moment-persona">应用</button></div>';
    return html + '</div></div></div>';
  }

  // 自定义该 char 的 user 认知行提示词（唯一保留的行为记录注入项）
  function renderSyncFormatModal(space, charId) {
    var sc = space ? getSpaceChar(space, charId) : null;
    if (!sc) return '';
    var sf = getSyncFormatForChar(sc);
    var cid = escapeHtml(charId);
    var html = '<div class="moments-modal-mask" data-action="close-sync-format"><div class="moments-modal wide" data-stop="1"><div class="moments-modal-hd"><div class="moments-modal-title">user 认知行提示词 — ' + escapeHtml(sc.charName) + '</div><div class="moments-modal-x" data-action="close-sync-format">' + ICON.close + '</div></div><div class="moments-modal-bd">';
    html += '<div class="moments-hint">仅保留 user 认知行的自定义与注入（其他行为记录内容已不再注入聊天）。留空 = 用内置默认。变量用 {varName} 格式。</div>';
    html += '<div class="moments-sync-vars"><div class="moments-sec-title">可用变量参考</div>';
    html += '<div class="moments-sync-var-group"><b>通用（user 认知行/行为记录）</b>：{now} 当前时间 · {userName} user名字 · {charName} char名字 · {userHandle}/{charHandle} 兼容旧模板（值=对应名字，不再有账号名）</div>';
    html += '<div class="moments-sync-var-group"><b>总结朋友圈提示词</b>：{from} 起始条数 · {to} 结束条数 · {count} 总条数</div>';
    html += '<div class="moments-sync-var-group"><b>记忆同步提示词</b>：{charName} 角色名</div>';
    html += '<div class="moments-sync-var-group"><b>历史分类模板变量（参考）</b>：{ts} 时间标签 · {postText} 朋友圈正文 · {actionTs} 动作时间 · {fromName} 互动者名 · {onName} 动态作者名 · {replyToName} 被回复者名 · {text} 文本内容</div>';
    html += '</div>';
    html += '<div class="moments-div"></div>';
    html += '<div class="moments-sec-title">user 认知行<span class="moments-sec-hint">已预填默认认知行，可编辑；清空=恢复默认；可用 {userName} {charName}</span></div>';
    html += '<textarea class="moments-sync-ta" data-field="charSync-userLine" data-cid="' + cid + '">' + escapeHtml(sf.userLine || userDualNameLine(space)) + '</textarea>';
    html += '<div class="moments-btn-row"><button class="mm-btn danger" data-action="reset-char-sync" data-cid="' + cid + '">恢复全部默认</button><button class="moments-btn ghost" data-action="close-sync-format">完成</button></div>';
    return html + '</div></div></div>';
  }

  // ========== 插件注册 ==========
  window.RochePlugin = window.RochePlugin || {};
  window.RochePlugin.register = window.RochePlugin.register || function () {};
  window.RochePlugin.register({
    id: PLUGIN_ID,
    name: '朋友圈',
    version: '2.16.0',
    // 主聊天接入（静默执行）：用户发送请求时自动注入朋友圈提示词与上下文，
    // 并提供 view_moments/post_moment/comment_moment/like_moment 工具让 AI 主动发圈/评论/点赞。
    // AI 角色发图时由 post_moment 自动调用 Roche 当前生图配置（roche.ai.generateImage）生成图片。
    chat: {
      contextProvider: chatContextProvider,
      tools: [
        {
          id: 'view_moments',
          description: '查看当前朋友圈动态（第 1 条为最新）。被总结过的范围只显示总结，其余显示原文。',
          parameters: { limit: 'number' },
          execute: toolRun(toolViewMoments)
        },
        {
          id: 'post_moment',
          description: '以你自己的身份发布一条朋友圈，静默同步到朋友圈。可带图片描述，插件会自动调用 Roche 生图配置生成图片。',
          parameters: { text: 'string', imagePrompts: 'array', location: 'string' },
          execute: toolRun(toolPostMoment)
        },
        {
          id: 'comment_moment',
          description: '评论某条朋友圈（postIndex 从 1 开始，1=最新一条）。可指定回复的评论者名字（replyToName）。',
          parameters: { postIndex: 'number', text: 'string', replyToName: 'string' },
          execute: toolRun(toolCommentMoment)
        },
        {
          id: 'like_moment',
          description: '给某条朋友圈点赞或取消点赞（postIndex 从 1 开始，1=最新一条）。',
          parameters: { postIndex: 'number' },
          execute: toolRun(toolLikeMoment)
        }
      ]
    },
    apps: [{
      id: APP_ID,
      name: '朋友圈',
      iconImage: WINDMILL_DATA_URI,
      async mount(container, roche) {
        cachedRoche = roche;
        root = container;
        state.bootLoading = true;

        // === 强制清理旧版本残留 ===
        // 1. 删除旧调试面板 DOM
        var oldPanels = document.querySelectorAll('.moments-dbg-panel');
        for (var i = 0; i < oldPanels.length; i++) oldPanels[i].remove();
        // 2. 删除旧调试 CSS
        var oldDbgCss = document.querySelectorAll('style:not([data-plugin="' + PLUGIN_ID + '"])');
        for (var j = 0; j < oldDbgCss.length; j++) {
          if (oldDbgCss[j].textContent && oldDbgCss[j].textContent.indexOf('moments-dbg') !== -1) oldDbgCss[j].remove();
        }
        // 3. 清除旧全局错误处理器
        window.onerror = null;
        window.onunhandledrejection = null;

        // 4. 强制替换 CSS（删除旧的再插入新的，确保顶栏安全区域等样式生效）
        var oldStyles = document.querySelectorAll('style[data-plugin="' + PLUGIN_ID + '"]');
        for (var k = 0; k < oldStyles.length; k++) oldStyles[k].remove();
        var st = document.createElement('style');
        st.setAttribute('data-plugin', PLUGIN_ID);
        st.textContent = CSS;
        document.head.appendChild(st);
        render();
        try {
          await refreshPersonas();
          await refreshChars();
          await Store.loadAll();
          if (!state.activeSpaceId || !Store.getActiveSpace()) {
            if (state.allPersonas.length) {
              var sp = ensureSpaceForPersona(state.activePersona || state.allPersonas[0]);
              state.activeSpaceId = sp.id;
              await Store.saveActive();
            }
          }
        } catch (e) { console.warn('[Moments] init error', e); }
        state.bootLoading = false;
        bindEvents();
        render();
      },
      async unmount(container, roche) {
        // 静默模式：不再向聊天消息流注入任何内容；朋友圈上下文由 register.chat 自动注入
        if (_docHandlers && _docHandlers.bound) {
          document.removeEventListener('click', _docHandlers.click, { capture: true });
          document.removeEventListener('dblclick', _docHandlers.dblclick, { capture: true });
          document.removeEventListener('change', _docHandlers.change, { capture: true });
          document.removeEventListener('input', _docHandlers.input, { capture: true });
          document.removeEventListener('touchstart', _docHandlers.touchstart, { capture: true });
          document.removeEventListener('touchend', _docHandlers.touchend, { capture: true });
          document.removeEventListener('touchcancel', _docHandlers.touchcancel, { capture: true });
          document.removeEventListener('touchmove', _docHandlers.touchmove, { capture: true });
          document.removeEventListener('mousedown', _docHandlers.mousedown, { capture: true });
          document.removeEventListener('mouseup', _docHandlers.mouseup, { capture: true });
          _docHandlers.bound = false;
        }
        pendingImages = [];
        if (container) container.replaceChildren();
        root = null;
      }
    }]
  });

  startBgTimer();
})();
