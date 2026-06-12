import { useMemo, useState } from "react";

type Question = {
  id: string;
  title: string;
  hint: string;
  options: string[];
  multiple?: boolean;
};

type Answers = Record<string, string[]>;

type RouteResult = {
  id: string;
  name: string;
  eyebrow: string;
  explanation: string;
  tools: string[];
  firstVersion: string;
  difficult: string[];
  nextStep: string;
  supportNote: string;
};

const questions: Question[] = [
  {
    id: "device",
    title: "使える端末はどれですか？",
    hint: "いちばんよく使えるものを選んでください",
    options: ["PC", "スマートフォンのみ", "タブレット", "共有PCを時々使える", "わからない"],
  },
  {
    id: "aiTools",
    title: "使えるAIツールはどれですか？",
    hint: "複数選べます。今使っていなくても、登録済みなら選んでOKです",
    multiple: true,
    options: [
      "ChatGPT 無料版",
      "ChatGPT 有料版",
      "Claude",
      "Claude 有料版",
      "Gemini",
      "Google AI Studio",
      "Manus",
      "Bolt.new",
      "v0",
      "わからない",
    ],
  },
  {
    id: "project",
    title: "何を作りたいですか？",
    hint: "まず最初に作りたいものを1つ選びましょう",
    options: [
      "個人ホームページ",
      "ポートフォリオ・作品ページ",
      "お店・活動紹介ページ",
      "クイズ",
      "ToDoリスト",
      "カウンター",
      "診断アプリ",
      "メモ・記録アプリ",
      "画像生成アプリ",
      "プロンプト保存アプリ",
      "アラームアプリ",
      "通知アプリ",
      "位置情報アプリ",
      "カメラアプリ",
      "その他",
    ],
  },
  {
    id: "goal",
    title: "最終的な目標は何ですか？",
    hint: "今の気持ちにいちばん近いものを選んでください",
    options: [
      "まず試してみたい",
      "自分で使いたい",
      "家族や友人に共有したい",
      "オンラインで公開したい",
      "販売したい",
      "仕事で使いたい",
    ],
  },
  {
    id: "services",
    title: "登録できるサービスはどれですか？",
    hint: "複数選べます。登録したくない場合も、そのまま教えてください",
    multiple: true,
    options: [
      "GitHub",
      "Vercel",
      "Google AI Studio",
      "Expo",
      "Manus",
      "Bolt.new",
      "v0",
      "Stripe",
      "サービスに登録したくない",
      "わからない",
    ],
  },
  {
    id: "files",
    title: "ZIPファイルやフォルダを扱えますか？",
    hint: "ダウンロードしたファイルを開いたり、移動したりする操作について教えてください",
    options: [
      "はい",
      "たぶんできる",
      "苦手",
      "わからない",
      "スマートフォンだけなので難しい",
    ],
  },
  {
    id: "features",
    title: "必要な機能はどれですか？",
    hint: "複数選べます。最初から必要だと思うものを選んでください",
    multiple: true,
    options: [
      "文字入力",
      "ボタン",
      "結果表示",
      "データ保存",
      "画像アップロード",
      "画像生成",
      "通知",
      "アラーム",
      "位置情報",
      "カメラ",
      "ログイン",
      "決済",
      "共有",
    ],
  },
  {
    id: "support",
    title: "どこまで自分でやりたいですか？",
    hint: "必要なサポートの量を教えてください",
    options: [
      "全部自分でやりたい",
      "手順があればできる",
      "途中で確認してほしい",
      "企画だけ手伝ってほしい",
      "誰かに作ってほしい",
      "公開まで手伝ってほしい",
    ],
  },
];

const routes: Record<string, RouteResult> = {
  hybrid: {
    id: "hybrid",
    name: "Claude Code × Codex ハイブリッドコース",
    eyebrow: "両方の強みを使い分ける",
    explanation:
      "Claude Codeを制作の基盤にし、Codexを画像生成や見た目の確認に活用して、完成度の高いページやアプリを素早く作るルートです。",
    tools: ["Claude Code", "Codex", "Next.js", "GitHub + Vercel"],
    firstVersion: "参考画像をもとに、構成・文章・見た目を整えた1ページのLPやポートフォリオ",
    difficult: ["複数ツール間で指示を揃えること", "参考画像の完全な再現", "生成物の権利・内容・表示崩れの確認"],
    nextStep: "Claude CodeでLPの目的・構成・文章・Next.js実装を進め、必要な画像と見た目の確認をCodexへ依頼しましょう。",
    supportNote: "役割を分けると速く進みます。Claude Codeを全体の進行役にし、Codexには画像や視覚的な調整を具体的に依頼しましょう。",
  },
  fast: {
    id: "fast",
    name: "Claude・有料AIで爆速コース",
    eyebrow: "AIと一緒に最短で形に",
    explanation:
      "Claudeのアプリ作成機能や有料AIの長い対話・ファイル支援を活かし、企画から動く試作品まで一気に進めるルートです。",
    tools: ["Claude Artifacts", "Claude 有料版 / ChatGPT 有料版", "GitHub + Vercel"],
    firstVersion: "Claude上でその場で動かして試せる、診断・クイズ・カウンターなどの小さなWebアプリ",
    difficult: ["要望を一度に詰め込みすぎること", "AIの提案を確認せず公開すること", "ログイン・決済などの安全確認"],
    nextStep: "Claudeに「初心者向けに、まず動く小さなアプリを作って」と伝え、作りたいものと必要な機能を1つずつ追加しましょう。",
    supportNote: "Claude無料版でも小さな試作はできます。有料版は利用量が多く、長い相談や繰り返しの修正を進めやすくなります。",
  },
  smartphone: {
    id: "smartphone",
    name: "スマホでかんたん試作ルート",
    eyebrow: "まず体験するなら",
    explanation:
      "スマートフォン中心で、難しいファイル操作をせずに小さなアイデアを形にするルートです。",
    tools: ["ChatGPT / Claude / Gemini", "Manus", "Bolt.new"],
    firstVersion: "ボタンを押すと結果が変わる診断・クイズなど、保存機能なしの小さな作品",
    difficult: ["細かなファイル管理", "複雑な公開設定", "スマホ固有機能の安定した動作"],
    nextStep: "作りたい画面を1つに絞り、使えるAIツールへ「画面案を考えて」と相談しましょう。",
    supportNote: "スマホだけで難しくなったら、途中からPCを使える人に公開作業だけ頼む方法もあります。",
  },
  web: {
    id: "web",
    name: "PC ＋ GitHub ＋ Vercel ルート",
    eyebrow: "公開できるWebアプリへ",
    explanation:
      "PCでファイルを扱い、GitHubに置いた作品をVercelでオンライン公開する王道ルートです。",
    tools: ["ChatGPT / Claude", "GitHub", "Vercel", "v0 / Bolt.new"],
    firstVersion: "入力・ボタン・結果表示までの、データ保存やログインを使わないWebアプリ",
    difficult: ["ログインや決済の安全な実装", "個人データの管理", "スマホのバックグラウンド機能"],
    nextStep: "最初の1画面に必要な入力・ボタン・表示結果を書き出し、Viteで試作品を作りましょう。",
    supportNote: "GitHubとVercelは最初だけ設定が必要です。公開前に詳しい人へ確認を頼むと安心です。",
  },
  homepage: {
    id: "homepage",
    name: "ホームページ作成ルート",
    eyebrow: "伝えたい内容を形に",
    explanation:
      "ページに載せる文章と画像を整理し、シンプルなWebサイトとして公開するルートです。",
    tools: ["ChatGPT / Claude", "v0 / Bolt.new", "GitHub + Vercel"],
    firstVersion: "紹介文、写真、活動内容、問い合わせ先だけの1ページサイト",
    difficult: ["会員機能", "ネットショップの決済", "頻繁な情報更新の仕組み"],
    nextStep: "「誰に・何を伝えるページか」を1文で決め、載せたい内容を3項目に絞りましょう。",
    supportNote: "最初は1ページで十分です。決済が必要なら、既存のショップサービスへのリンクが安全です。",
  },
  ai: {
    id: "ai",
    name: "AI機能つきアプリルート",
    eyebrow: "AIを作品に組み込むなら",
    explanation:
      "画像生成や文章生成など、AIサービスと接続する必要がある一段進んだルートです。",
    tools: ["Google AI Studio", "AI API", "GitHub + Vercel"],
    firstVersion: "最初はAIを接続せず、入力欄と仮の結果表示だけで使い方を確認する試作品",
    difficult: ["APIキーの安全な管理", "利用料金の管理", "生成結果の品質と安全性"],
    nextStep: "まずAIなしの画面を作り、誰が何を入力して何が返ると便利かを確認しましょう。",
    supportNote: "AI APIの接続には専門知識が必要です。APIキーを画面側のコードへ直接書かないでください。",
  },
  caution: {
    id: "caution",
    name: "高度な機能・要相談ルート",
    eyebrow: "先に難しさを確認",
    explanation:
      "端末機能、安全性、個人情報、審査などへの対応が必要です。小さく分けて専門家と進めるのが安全です。",
    tools: ["Expo（スマホアプリの場合）", "専門家のレビュー", "既存の安全な外部サービス"],
    firstVersion: "高度な機能を外し、画面の流れと操作だけを確認できる試作品",
    difficult: ["通知・アラームの安定動作", "位置情報・カメラの権限", "ログイン・決済の安全性"],
    nextStep: "必要な高度機能を1つだけ選び、「なぜ必要か」と「なくても試せるか」を整理しましょう。",
    supportNote: "個人情報・決済・端末権限を扱う前に、経験者や専門家の確認を受けてください。",
  },
};

const advancedFeatures = ["通知", "アラーム", "位置情報", "カメラ", "ログイン", "決済"];
const advancedProjects = ["アラームアプリ", "通知アプリ", "位置情報アプリ", "カメラアプリ"];
const homepageProjects = ["個人ホームページ", "ポートフォリオ・作品ページ", "お店・活動紹介ページ"];
const aiProjects = ["画像生成アプリ", "プロンプト保存アプリ"];

function includesAny(values: string[] = [], targets: string[]) {
  return targets.some((target) => values.includes(target));
}

function diagnose(answers: Answers) {
  const matches: string[] = [];

  if (
    includesAny(answers.features, advancedFeatures) ||
    includesAny(answers.project, advancedProjects) ||
    answers.goal?.includes("販売したい")
  ) {
    matches.push("caution");
  }
  if (
    answers.aiTools?.includes("ChatGPT 有料版") &&
    answers.aiTools?.includes("Claude 有料版")
  ) {
    matches.push("hybrid");
  } else if (includesAny(answers.aiTools, ["ChatGPT 有料版", "Claude", "Claude 有料版"])) {
    matches.push("fast");
  }
  if (includesAny(answers.project, homepageProjects)) matches.push("homepage");
  if (includesAny(answers.project, aiProjects) || answers.features?.includes("画像生成")) {
    matches.push("ai");
  }
  if (
    answers.device?.includes("PC") ||
    answers.device?.includes("共有PCを時々使える") ||
    (answers.services?.includes("GitHub") && answers.services?.includes("Vercel"))
  ) {
    matches.push("web");
  }
  if (
    answers.device?.includes("スマートフォンのみ") ||
    answers.device?.includes("タブレット") ||
    answers.files?.includes("スマートフォンだけなので難しい")
  ) {
    matches.push("smartphone");
  }

  if (matches.length === 0) matches.push("smartphone");
  return {
    main: routes[matches[0]],
    secondary: matches.slice(1).map((id) => routes[id]),
  };
}

function App() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => diagnose(answers), [answers]);
  const question = questions[current];
  const selected = answers[question?.id] ?? [];
  const progress = showResult ? 100 : ((current + 1) / questions.length) * 100;

  const choose = (option: string) => {
    if (!question.multiple) {
      setAnswers((previous) => ({ ...previous, [question.id]: [option] }));
      return;
    }
    setAnswers((previous) => {
      const existing = previous[question.id] ?? [];
      const next = existing.includes(option)
        ? existing.filter((item) => item !== option)
        : [...existing, option];
      return { ...previous, [question.id]: next };
    });
  };

  const next = () => {
    if (current === questions.length - 1) {
      setShowResult(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrent((value) => value + 1);
  };

  const back = () => {
    if (showResult) {
      setShowResult(false);
      setCurrent(questions.length - 1);
    } else {
      setCurrent((value) => Math.max(0, value - 1));
    }
  };

  const restart = () => {
    setStarted(false);
    setCurrent(0);
    setAnswers({});
    setShowResult(false);
    setCopied(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const answerText = (id: string) => answers[id]?.join("、") || "未回答";
  const summary = `AIアプリ制作ルート診断

使える端末:
${answerText("device")}

使えるAIツール:
${answerText("aiTools")}

作りたいもの:
${answerText("project")}

目標:
${answerText("goal")}

登録できるサービス:
${answerText("services")}

ZIP・ファイル操作:
${answerText("files")}

必要な機能:
${answerText("features")}

自分でやりたい範囲:
${answerText("support")}

おすすめルート:
${result.main.name}

次の一歩:
${result.main.nextStep}`;

  const consultation = `アプリ作りについて相談したいです。

${summary}

この条件で、初心者でも進められる最初の一歩と、注意点を教えてください。`;

  const copy = async (text: string, kind: string) => {
    const fallbackCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    };

    try {
      if (!navigator.clipboard) throw new Error("Clipboard API is unavailable");
      await navigator.clipboard.writeText(text);
    } catch {
      fallbackCopy();
    }
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  };

  if (!started) {
    return (
      <main className="app-shell landing">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <section className="welcome-card">
          <div className="brand-mark" aria-hidden="true">
            <span>AI</span>
          </div>
          <p className="eyebrow">AI APP ROUTE NAVIGATOR</p>
          <h1>
            作りたい気持ちを、
            <br />
            <span>最初の一歩</span>に変えよう。
          </h1>
          <p className="lead">
            8つのかんたんな質問から、あなたに合うアプリ制作ルートを案内します。
            専門知識は必要ありません。
          </p>
          <button className="primary-button start-button" onClick={() => setStarted(true)}>
            診断をはじめる
            <span aria-hidden="true">→</span>
          </button>
          <div className="welcome-notes">
            <span>約3分</span>
            <span>登録不要</span>
            <span>回答は保存されません</span>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="logo-button" onClick={restart} aria-label="最初に戻る">
          <span className="mini-mark">AI</span>
          <span>Route Navigator</span>
        </button>
        <span className="step-label">{showResult ? "診断結果" : `${current + 1} / ${questions.length}`}</span>
      </header>

      <div className="progress-track" aria-label={`進み具合 ${Math.round(progress)}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      {!showResult ? (
        <section className="question-card">
          <div className="question-heading">
            <span className="question-number">QUESTION {String(current + 1).padStart(2, "0")}</span>
            <h2>{question.title}</h2>
            <p>{question.hint}</p>
          </div>

          <div className="options-grid">
            {question.options.map((option) => {
              const active = selected.includes(option);
              return (
                <button
                  className={`option-button ${active ? "selected" : ""}`}
                  key={option}
                  onClick={() => choose(option)}
                  aria-pressed={active}
                >
                  <span className={question.multiple ? "check-box" : "radio-dot"}>
                    {active && "✓"}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          <nav className="question-nav">
            <button className="back-button" onClick={back} disabled={current === 0}>
              ← 戻る
            </button>
            <button className="primary-button" onClick={next} disabled={selected.length === 0}>
              {current === questions.length - 1 ? "結果を見る" : "次へ"}
              <span aria-hidden="true">→</span>
            </button>
          </nav>
        </section>
      ) : (
        <section className="result-page">
          <div className={`result-hero ${result.main.id}`}>
            <p className="eyebrow">{result.main.eyebrow}</p>
            <span className="result-label">あなたへのおすすめ</span>
            <h1>{result.main.name}</h1>
            <p>{result.main.explanation}</p>
          </div>

          <div className="result-grid">
            <article className="result-panel">
              <span className="panel-icon">01</span>
              <h2>向いているツール</h2>
              <div className="tag-list">
                {result.main.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
            </article>
            <article className="result-panel accent-panel">
              <span className="panel-icon">02</span>
              <h2>最初に作るとよいもの</h2>
              <p>{result.main.firstVersion}</p>
            </article>
            <article className="result-panel">
              <span className="panel-icon">03</span>
              <h2>難しくなりやすいこと</h2>
              <ul>
                {result.main.difficult.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
            <article className="result-panel next-panel">
              <span className="panel-icon">04</span>
              <h2>次の一歩</h2>
              <p>{result.main.nextStep}</p>
            </article>
          </div>

          <aside className="support-note">
            <strong>サポートについて</strong>
            <p>{result.main.supportNote}</p>
          </aside>

          {result.secondary.length > 0 && (
            <div className="secondary-routes">
              <p className="section-kicker">あわせて確認したいルート</p>
              {result.secondary.map((route) => (
                <div key={route.id}>
                  <strong>{route.name}</strong>
                  <span>{route.explanation}</span>
                </div>
              ))}
            </div>
          )}

          <div className="summary-card">
            <div>
              <p className="section-kicker">CONSULTATION NOTE</p>
              <h2>この結果を使って相談できます</h2>
              <p>回答とおすすめルートを、相談しやすい文章にまとめました。</p>
            </div>
            <div className="copy-actions">
              <button className="secondary-button" onClick={() => copy(summary, "result")}>
                {copied === "result" ? "コピーしました" : "診断結果をコピー"}
              </button>
              <button className="primary-button" onClick={() => copy(consultation, "consultation")}>
                {copied === "consultation" ? "コピーしました" : "相談メッセージをコピー"}
              </button>
            </div>
          </div>

          <a
            className="consultation-link"
            href="https://yui1143078.substack.com/"
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <small>制作について迷ったら</small>
              <strong>ご相談は私まで</strong>
            </span>
            <span className="consultation-link-action">
              Substackを開く
              <span aria-hidden="true">↗</span>
            </span>
          </a>

          <div className="result-footer">
            <button className="back-button" onClick={back}>← 回答を見直す</button>
            <button className="restart-button" onClick={restart}>最初からやり直す</button>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
