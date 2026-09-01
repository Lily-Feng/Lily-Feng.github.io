import { ArrowLeft, ArrowUpRight, MessageCircleMore } from "lucide-react";
import { profile } from "../data/resume";

const basics = [
  ["本命语言", "中文 · Native"],
  ["江湖坐标", "旧金山湾区"],
  ["修行年限", "十五载有余"],
  ["当下主线", "Data & AI"],
];

const expertise = [
  {
    title: "多智能体协同阵法",
    english: "Agentic Workflows & MCP",
    copy: "让 Agent 不只会答话，还能识路、调工具、彼此协作，真正接得住企业里的复杂差事。",
  },
  {
    title: "数据灵脉与语义经络",
    english: "Databricks · Azure · Semantic Layers",
    copy: "把散落的数据、平台与业务语义连成一张可用、可管、也看得懂的脉络。",
  },
  {
    title: "天眼洞察与护山大阵",
    english: "Security · Telemetry · Observability",
    copy: "系统既要跑得快，也要知道它为何慢；既要放得开，也要守得住。",
  },
  {
    title: "商鉴奇门遁甲",
    english: "Power BI · Enterprise Analytics",
    copy: "多年企业 BI 与性能工程底子，擅长在规模、容量、体验和成本之间找正解。",
  },
];

const chronicles = [
  {
    period: "2003—2012",
    place: "南京 · 杭州",
    title: "江南筑基，先练内功",
    copy: "南京大学计算机科班出身。初入江湖便与性能、基准和容量规划较上了劲；后来在杭州带领二十余人的性能团队，把“跑得动”练成“跑得稳、跑得久”。",
  },
  {
    period: "2012—2018",
    place: "洛杉矶 · 北美各地",
    title: "西行问道，专解大阵仗",
    copy: "担任 Principal Consultant，与 eBay、Facebook、Disney、Hulu、Yahoo、Wells Fargo 等大型企业过招。常见招式：架构、扩展性、峰值压力与容量规划。",
  },
  {
    period: "2018—今",
    place: "旧金山湾区",
    title: "湾区造阵，数据与 AI 并行",
    copy: "现任 Visa Senior Staff Software Engineer，建设企业级 Data、AI 与 BI 平台能力，横跨 Power BI、Azure、Databricks、语义层、安全与可观测性。",
  },
  {
    period: "当下新章",
    place: "Agentic AI",
    title: "智造灵仆，也做真产品",
    copy: "一边打造面向基础设施运维的 Agentic Workforce，一边在五人 AI micro-pod 中快速做产品。目标不是让 AI 看起来聪明，而是让它真的把事情办成。",
  },
];

const learning = [
  ["南京大学", "计算机科学 · 本科"],
  ["UIUC", "工商管理 · MBA"],
  ["UT Austin", "数据科学 · 硕士在读"],
];

function SectionHeading({ eyebrow, title, english }: { eyebrow: string; title: string; english: string }) {
  return (
    <div className="jianghu-section-heading">
      <span>{eyebrow}</span>
      <h2>{title} <small>{english}</small></h2>
    </div>
  );
}

export function JianghuPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="jianghu-page" lang="zh-CN">
      <div className="jianghu-scenery" aria-hidden="true">
        <span className="jianghu-landscape" />
        <span className="jianghu-mist jianghu-mist--one" />
        <span className="jianghu-mist jianghu-mist--two" />
        <span className="jianghu-vignette" />
      </div>

      <button className="jianghu-back" onClick={onBack}>
        <ArrowLeft size={17} /> 归来
      </button>

      <main className="jianghu-scroll">
        <header className="jianghu-hero">
          <div className="jianghu-hero__copy">
            <span className="jianghu-overline">江湖传说 · 冯氏卷</span>
            <p className="jianghu-lead">一位中文母语的<br /><em>Data & AI 行路人</em></p>
            <p className="jianghu-intro">
              能在中文语境里听懂弦外之音，也能在技术、业务与产品之间把复杂的事讲明白。
              代码写过，平台建过，大阵仗见过——遇到难题，通常先沏茶，再拆解。
            </p>
            <dl className="jianghu-basics">
              {basics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </div>

          <div className="jianghu-title-lockup" aria-label="冯氏江湖小传">
            <div className="jianghu-title-side">纵横代码千万行 · 笔走游龙绘乾坤</div>
            <h1><span>冯氏</span><span>江湖小传</span></h1>
            <span className="jianghu-seal">Lily<br />印</span>
          </div>
        </header>

        <div className="jianghu-content-scroll">
          <section className="jianghu-profile" aria-labelledby="profile-title">
            <SectionHeading eyebrow="其人其事" title="人物生平" english="Profile" />
            <div className="jianghu-profile__body">
              <p id="profile-title">
                冯氏 Lily，资深首席软件工程师（Senior Staff Software Engineer），行走软件、数据与 AI 江湖十五载有余。
                早年筑基于企业商鉴（BI）与性能工程，后来一路修到企业级数据平台、语义层与智能体系统。
                如今既能俯身查一处性能瓶颈，也能抬头规划一座平台；能与工程师深挖根因，也能把取舍讲给业务伙伴听。
              </p>
              <blockquote>
                <span>独门心法</span>
                技术可以很深，沟通不必很玄。先把人和问题看明白，再选兵器。
              </blockquote>
            </div>
          </section>

          <section className="jianghu-expertise" aria-labelledby="expertise-title">
            <SectionHeading eyebrow="看家本领" title="武学造诣" english="Expertise" />
            <div className="jianghu-expertise-grid" id="expertise-title">
              {expertise.map((item, index) => (
                <article key={item.title}>
                  <span className="jianghu-index">零{index + 1}</span>
                  <h3>{item.title}</h3>
                  <small>{item.english}</small>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="jianghu-chronicles" aria-labelledby="chronicles-title">
            <SectionHeading eyebrow="一路走来" title="江湖纪事" english="Chronicles" />
            <div className="jianghu-timeline" id="chronicles-title">
              {chronicles.map((item) => (
                <article key={item.period}>
                  <div className="jianghu-timeline__meta"><time>{item.period}</time><span>{item.place}</span></div>
                  <div><h3>{item.title}</h3><p>{item.copy}</p></div>
                </article>
              ))}
            </div>
          </section>

          <section className="jianghu-learning" aria-labelledby="learning-title">
            <SectionHeading eyebrow="仍在修行" title="师承与新功课" english="Learning" />
            <div className="jianghu-learning-grid" id="learning-title">
              {learning.map(([school, degree]) => <div key={school}><strong>{school}</strong><span>{degree}</span></div>)}
            </div>
          </section>

          <section className="jianghu-language">
            <div>
              <span className="jianghu-overline">江湖暗号</span>
              <h2>中文，是母语；<br />幽默，是默认协议。</h2>
            </div>
            <div className="jianghu-language__copy">
              <p>
                熟悉中文里的分寸、语境和那些没有说完的半句话。跨语言协作时，我愿意做那座桥：
                少一点 lost in translation，多一点“原来你是这个意思”。
              </p>
              <p className="jianghu-aside">故障不会因为语气温柔就自行消失，但人会更愿意一起修。</p>
            </div>
          </section>
        </div>

        <section className="jianghu-ending">
          <MessageCircleMore size={22} />
          <blockquote>“若你手上正有一桩难事，不妨说来听听。”</blockquote>
          <p>复杂问题，先说人话；跨文化协作，多一点会心一笑。</p>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            江湖会面 · LinkedIn <ArrowUpRight size={15} />
          </a>
        </section>
      </main>
    </div>
  );
}
