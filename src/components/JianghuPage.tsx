import { ArrowLeft, ArrowUpRight, MessageCircleMore } from "lucide-react";
import { profile } from "../data/resume";

const moves = [
  {
    number: "壹",
    title: "破迷雾",
    kicker: "把玄学讲明白",
    copy: "术语再多，先找真正的问题；系统再复杂，也能画出一条人人看得懂的路。",
  },
  {
    number: "贰",
    title: "接地气",
    kicker: "让技术落到人间",
    copy: "能和工程师深挖根因，也能与业务伙伴聊清取舍——同一件事，换一种对方听得懂的说法。",
  },
  {
    number: "叁",
    title: "聚群侠",
    kicker: "把差异变成默契",
    copy: "跨语言、跨文化、跨职能都不怕。中文是母语，英文是工作语言，幽默是默认协议。",
  },
];

export function JianghuPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="jianghu-page" lang="zh-CN">
      <div className="jianghu-scenery" aria-hidden="true">
        <span className="jianghu-sun" />
        <span className="ink-mountain ink-mountain--far" />
        <span className="ink-mountain ink-mountain--near" />
        <span className="jianghu-mist jianghu-mist--one" />
        <span className="jianghu-mist jianghu-mist--two" />
      </div>

      <button className="jianghu-back" onClick={onBack}>
        <ArrowLeft size={17} /> 归来
      </button>

      <main className="jianghu-scroll">
        <header className="jianghu-hero">
          <div className="jianghu-hero__copy">
            <span className="jianghu-overline">江湖传说 · 第壹卷</span>
            <p className="jianghu-lead">会讲人话，也会讲机器话。</p>
            <p className="jianghu-intro">
              江湖人称 Lily。行走数据与 AI 之境多年，见过大阵仗，也收拾过小混乱。
              <strong>中文母语</strong>，最擅长把复杂事说清、把难办的事拆开，再用一点幽默让大家愿意一起把它做完。
            </p>
            <div className="jianghu-bilingual">
              <span>Native Chinese</span>
              <i />
              <span>Fluent in ambiguity</span>
            </div>
          </div>

          <div className="jianghu-title-lockup" aria-label="冯氏解题谱">
            <div className="jianghu-title-side">复杂问题 · 从说人话开始</div>
            <h1><span>冯氏</span><span>解题谱</span></h1>
            <span className="jianghu-seal">Lily<br />印</span>
          </div>
        </header>

        <section className="jianghu-moves" aria-labelledby="moves-title">
          <div className="jianghu-section-heading">
            <span>不传之秘</span>
            <h2 id="moves-title">三式，专治复杂</h2>
            <p>不是武功排名，是我习惯怎样与人一起解决问题。</p>
          </div>
          <div className="jianghu-move-grid">
            {moves.map((move) => (
              <article className="jianghu-move" key={move.number}>
                <span className="jianghu-move__number">{move.number}</span>
                <div>
                  <span>{move.kicker}</span>
                  <h3>{move.title}</h3>
                  <p>{move.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="jianghu-passport" aria-labelledby="passport-title">
          <div>
            <span className="jianghu-overline">通关文牒</span>
            <h2 id="passport-title">语言是桥，不是门槛。</h2>
            <p>需要中文语境、跨文化判断，或只是想把一团乱麻聊出头绪——都可以来找我。</p>
          </div>
          <dl>
            <div><dt>中文</dt><dd>母语 · 语境在线</dd></div>
            <div><dt>English</dt><dd>工作语言 · 清晰直接</dd></div>
            <div><dt>复杂场面</dt><dd>先稳住 · 再拆解</dd></div>
            <div><dt>幽默</dt><dd>随身携带 · 适量投放</dd></div>
          </dl>
        </section>

        <section className="jianghu-ending">
          <MessageCircleMore size={22} />
          <blockquote>“若你手上正有一桩难事，不妨说来听听。”</blockquote>
          <p>先把事情说清，再把系统做稳。最好，大家还能会心一笑。</p>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
            江湖会面 · LinkedIn <ArrowUpRight size={15} />
          </a>
        </section>
      </main>
    </div>
  );
}
