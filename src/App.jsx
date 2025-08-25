import React, { useEffect, useRef, useState } from "react";

/* ---------- 资源路径助手：保证在 GitHub Pages 项目页下可用 ---------- */
const asset = (p) => {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  const path = String(p).replace(/^\/+/, "");
  return `${base}/${path}`;
};

/* —— 常量（公司名 & 邮箱） —— */
const COMPANY_NAME = "INNOVATION AEROSPACE LOGISTICS CO., LTD.";
const MAIL = "dgdesk@ia-logistics.net";

/* —— 小箭头图标（纯 SVG） —— */
const ArrowRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M5 12h14" />
    <path d="M13 5l7 7-7 7" />
  </svg>
);

/* —— 勾号图标 —— */
const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/* —— 入场动画钩子（可选） —— */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("opacity-0", "translate-y-4");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.remove("opacity-0", "translate-y-4");
          el.classList.add("transition", "duration-700", "ease-out");
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
};

/* —— 让子组件拿到 setPage —— */
const PageContext = React.createContext({ page: "home", setPage: () => {} });

/* —— Services 数据（图片位于 public 根目录） —— */
const SERVICE_ITEMS = [
  {
    key: "airdg",
    title: "Air DG",
    img: asset("airdg.png"),
    desc: "Time-critical air freight for dangerous goods with full IATA DGR compliance.",
    bullets: [
      "IATA DGR compliant acceptance & screening",
      "Time-critical routings and AWB documentation",
      "Lithium batteries, gases, flammables, toxics",
    ],
    badges: ["IATA DGR", "Time-Critical", "CN Export"],
  },
  {
    key: "oceandg",
    title: "Ocean DG",
    img: asset("oceandg.png"),
    desc: "IMDG documentation & vessel approvals with segregation and UN packaging compatibility.",
    bullets: [
      "IMDG documentation (DGD) & vessel approvals",
      "UN packaging compatibility and segregation",
      "FCL / LCL with port-side risk controls",
    ],
    badges: ["IMDG", "UN Packaging", "Port Ops"],
  },
  {
    key: "roaddg",
    title: "Road DG",
    img: asset("roaddg.png"),
    desc: "ADR-aligned trucking, domestic drayage, last-mile delivery with handling SOPs.",
    bullets: [
      "ADR-compatible domestic drayage",
      "Last-mile delivery with handling SOPs",
      "Temperature & shock control options",
    ],
    badges: ["ADR", "SOP", "Controls"],
  },
  {
    key: "packdg",
    title: "DG Packaging & Labels",
    img: asset("packdg.png"),
    desc: "UN-certified packaging, correct labels/marks, on-site repack & rework.",
    bullets: [
      "UN-certified boxes, inner packs, absorbents",
      "Correct labels/marks for all DG classes",
      "On-site repack & rework at origin",
    ],
    badges: ["UN Cert", "Labels/Marks", "On-site"],
  },
  {
    key: "docdg",
    title: "DG Documentation",
    img: asset("docdg.png"),
    desc: "Accurate declarations, HS/PI mapping, carrier/terminal pre-checks.",
    bullets: [
      "Shipper’s Declaration, MSDS/PSDS review",
      "HS code & PI matched to cargo chemistry",
      "Pre-check with carrier & terminal",
    ],
    badges: ["DGD", "MSDS", "Pre-check"],
  },
  {
    key: "ComplianceConsultingdg",
    title: "Compliance Consulting",
    img: asset("ComplianceConsultingdg.png"),
    desc: "UN/Class assignment, packing instructions, export license advisory & training.",
    bullets: [
      "Class/UN assignment & packing instruction",
      "Export license and Chinese customs advisory",
      "Facility audit and staff training",
    ],
    badges: ["PI/UN", "Customs", "Training"],
  },
];

/* —— Services 下拉菜单（悬停/聚焦显示） —— */
const ServicesMega = ({ onSelect }) => {
  return (
    <div
      className="absolute left-1/2 z-40 mt-3 w-[min(1100px,92vw)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
      role="menu"
      aria-label="Services menu"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SERVICE_ITEMS.map((svc) => (
          <button
            key={svc.key}
            onClick={() => onSelect(svc.key)}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white text-left hover:bg-slate-50"
            role="menuitem"
          >
            <div className="h-28 w-full overflow-hidden">
              <img
                src={svc.img}
                alt={svc.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.replaceWith(
                    Object.assign(document.createElement("div"), {
                      className:
                        "h-full w-full grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100",
                      innerHTML: `<span class='text-slate-400 text-sm'>${svc.title}</span>`,
                    })
                  );
                }}
              />
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold text-slate-900">{svc.title}</div>
              <div className="mt-1 line-clamp-2 text-xs text-slate-600">{svc.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ================= Layout：导航 + 页脚（含 Resources 入口） ================= */
const Layout = ({ children, setPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const svcTimerRef = useRef(null);
  const wrapRef = useRef(null);

  const openSvc = () => {
    clearTimeout(svcTimerRef.current);
    setSvcOpen(true);
  };
  const closeSvc = () => {
    clearTimeout(svcTimerRef.current);
    svcTimerRef.current = setTimeout(() => setSvcOpen(false), 120);
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setSvcOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* 品牌区 */}
          <button onClick={() => setPage("home")} className="flex items-center gap-3 group" aria-label="Go Home">
            <img src={asset("logo.png")} alt="IAL Logo" className="h-9 w-auto rounded-sm" />
            <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition">
              {COMPANY_NAME}
            </span>
          </button>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700" ref={wrapRef}>
            <button onClick={() => setPage("home")} className="hover:text-blue-700">Home</button>
            <button onClick={() => setPage("about")} className="hover:text-blue-700">About Us</button>

            {/* Services（悬停打开 mega menu） */}
            <div className="relative" onMouseEnter={openSvc} onMouseLeave={closeSvc}>
              <button
                className={"hover:text-blue-700 inline-flex items-center gap-1 " + (svcOpen ? "text-blue-700" : "")}
                aria-haspopup="menu"
                aria-expanded={svcOpen}
                onFocus={openSvc}
              >
                Services
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {svcOpen && (
                <ServicesMega
                  onSelect={(pageKey) => {
                    setPage(pageKey); // 进入独立服务页
                    setSvcOpen(false);
                  }}
                />
              )}
            </div>

            <button onClick={() => setPage("resources")} className="hover:text-blue-700">Resources</button>
            <button onClick={() => setPage("careers")} className="hover:text-blue-700">Join our team</button>
            <button onClick={() => setPage("contact")} className="hover:text-blue-700">Contact</button>
          </nav>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-slate-700"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>

        {/* 移动端菜单 */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto max-w-7xl px-6 py-3 grid gap-2">
              {[
                ["Home", "home"],
                ["About Us", "about"],
                ["Services", "services"],
                ["Resources", "resources"],
                ["Join our team", "careers"],
                ["Contact", "contact"],
              ].map(([label, key]) => (
                <button
                  key={key}
                  onClick={() => {
                    setPage(key);
                    setMenuOpen(false);
                  }}
                  className="rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* 内容 */}
      <main className="flex-1">{children}</main>

      {/* Footer（左侧版权 + 右侧 FOLLOW US logos） */}
      <footer className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          {/* 左侧版权 */}
          <div>
            © {new Date().getFullYear()} INNOVATION AEROSPACE LOGISTICS CO., LTD. ALL RIGHTS RESERVED.
          </div>

          {/* 右侧 FOLLOW US */}
          <div className="mt-3 md:mt-0 flex items-center gap-4">
            <span className="text-slate-500 text-sm">FOLLOW US</span>

            {/* LinkedIn logo */}
            <a
              href="https://www.linkedin.com/company/innovation-aerospace-logistics-inc/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:opacity-80 transition"
            >
              <img src={asset("linkedin.png")} alt="LinkedIn" className="h-6 w-auto" />
            </a>

            {/* JCtrans logo */}
            <a
              href="https://www.jctrans.com/cn/store/home/ed571607bdebadcd4bc7e5a851d7f97c"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="JCtrans"
              className="hover:opacity-80 transition"
            >
              <img src={asset("jctrans.png")} alt="JCtrans" className="h-6 w-auto" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ================= Home：视频背景 + Expert Support ================= */
const Home = ({ setPage }) => {
  const [ready, setReady] = useState(false);

  return (
    <section className="relative isolate overflow-hidden min-h-[100dvh]">
      {/* 背景视频 */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"                     // 不使用 poster
          onCanPlay={() => setReady(true)}       // 可播放时再显示
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <source src={asset("home-bg.mp4")} type="video/mp4" />
        </video>
        {/* 左→右渐变，提升对比度 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* 顶部文案 */}
      <div className="mx-auto max-w-7xl px-6 pt-24 sm:pt-28 text-white">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium">
          {["IATA DGR", "IMDG", "ADR", "24/7 Ops", "China Origin Expert"].map((t) => (
            <span key={t} className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">
              {t}
            </span>
          ))}
        </div>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Your Trusted Partner for{" "}
          <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent font-extrabold">
            Dangerous Goods
          </span>{" "}
          from China
        </h1>
        <p className="mt-4 max-w-2xl text-slate-200">
          Compliance-first DG logistics for high-stakes cargo. Customs-savvy, fast, and safe — from China to the world.
        </p>

        {/* 顶部主 CTA */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => setPage("contact")}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage("services")}
            className="rounded-2xl px-5 py-3 text-sm font-semibold text-white/90 ring-1 ring-inset ring-white/40 hover:bg-white/10"
          >
            Explore Services
          </button>
        </div>
      </div>

      {/* 底部覆盖层：Need Expert Support?（紧凑白色按钮） */}
      <div className="absolute bottom-0 inset-x-0 z-20 bg-black/60 py-6">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Need Expert Support?</h2>
          <p className="mt-1 text-sm text-slate-300">
            Our DG specialists are available 24/7 to help with compliance and logistics challenges.
          </p>
          <div className="mt-4">
            <button
              onClick={() => setPage("contact")}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow hover:bg-slate-100 transition"
            >
              Talk to an Expert <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ================= About Us（顶部大图英雄区 + 底部白色内容带） ================= */
const About = () => {
  const DG_LABELS = [
    { src: asset("2.png"), label: "Class 2 — Gas" },
    { src: asset("3.png"), label: "Class 3 — Flammable Liquid" },
    { src: asset("4.png"), label: "Class 4 — Flammable Solid" },
    { src: asset("5.1.png"), label: "Class 5.1 — Oxidizer" },
    { src: asset("5.2.png"), label: "Class 5.2 — Organic Peroxide" },
    { src: asset("6.png"), label: "Class 6 — Toxic" },
    { src: asset("8.png"), label: "Class 8 — Corrosive" },
    { src: asset("9.png"), label: "Class 9 — Miscellaneous" },
    { src: asset("9-battery.png"), label: "Lithium Battery" },
  ];

  return (
    <section id="about" className="relative isolate">
      {/* —— 顶部英雄区（沉浸式背景） —— */}
      <div className="relative min-h-[56vh] lg:min-h-[60vh]">
        {/* 背景图 + 线性遮罩 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{ backgroundImage: `url('${asset("about-bg.jpg")}')` }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

        {/* 英雄区内容 */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
              About Us
            </h2>
            <p className="mt-5 text-base lg:text-lg leading-7 text-slate-200">
              <strong>{COMPANY_NAME}</strong> delivers
              compliance-first dangerous goods logistics from China to the world — safe, efficient,
              and aligned with IATA DGR / IMDG / ADR and Chinese regulations.
            </p>
            <p className="mt-4 text-base lg:text-lg leading-7 text-slate-200">
              We specialize in Classes <span className="font-semibold">2, 3, 4, 5, 6, 8, 9</span>.
              Our team combines DG handling expertise with deep China customs know-how to minimize rework
              and delays while safeguarding compliance.
            </p>
          </div>
        </div>
      </div>

      {/* —— 下方白色内容带（浮在背景上） —— */}
      <div className="relative -mt-10 lg:-mt-12 pb-16 bg-transparent">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/60 p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              {/* 左侧：卖点与简述（5/12） */}
              <div className="lg:col-span-5">
                <h3 className="text-xl font-semibold text-slate-900">
                  Compliance • Precision • Velocity
                </h3>
                <p className="mt-3 text-slate-600 leading-7">
                  We design end-to-end DG flows across documentation, UN packaging, and multi-modal
                  transportation. Our processes emphasize first-time-right declarations, pre-checks
                  with carriers/terminals, and predictable lead times.
                </p>

                {/* 关键卖点（极简条目） */}
                <ul className="mt-6 space-y-3">
                  {[
                    ["IATA DGR / IMDG / ADR", "Global standards alignment across air, ocean, and road."],
                    ["China Customs Expertise", "Border-clearance know-how and license advisory."],
                    ["End-to-End Execution", "Docs, packing, labeling, and multimodal routing."],
                  ].map(([t, s]) => (
                    <li key={t} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">{t}</div>
                        <div className="text-sm text-slate-600">{s}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 右侧：DG 标签 3×3 白卡（7/12） */}
              <div className="lg:col-span-7">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold tracking-wide text-slate-700">
                    DG Classes We Handle
                  </h4>
                  <span className="text-[11px] text-slate-500">Representative labels</span>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {DG_LABELS.map((it) => (
                    <div
                      key={it.label}
                      className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 hover:shadow-md transition p-4 flex flex-col items-center"
                      title={it.label}
                    >
                      <img
                        src={it.src}
                        alt={it.label}
                        className="h-16 w-16 object-contain"
                        loading="lazy"
                      />
                      <p className="mt-3 text-center text-[13px] font-medium text-slate-800">
                        {it.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 轻说明 */}
                <p className="mt-4 text-xs text-slate-500">
                  We provide UN-certified packing, correct labels/marks, and pre-checks to reduce origin rework.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ================= Services（总览网格） ================= */
const ServiceCard = ({ svc }) => {
  const appCtx = React.useContext(PageContext);
  return (
    <button
      onClick={() => appCtx.setPage(svc.key)}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm hover:bg-slate-50"
    >
      <div className="h-40 w-full overflow-hidden">
        <img
          src={svc.img}
          alt={svc.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.replaceWith(
              Object.assign(document.createElement("div"), {
                className:
                  "h-full w-full grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100",
                innerHTML: `<span class='text-slate-400 text-sm'>${svc.title}</span>`,
              })
            );
          }}
        />
      </div>
      <div className="p-5">
        <div className="text-lg font-semibold text-slate-900">{svc.title}</div>
        <div className="mt-1 line-clamp-2 text-sm text-slate-600">{svc.desc}</div>
      </div>
    </button>
  );
};

const Services = () => (
  <section id="services" className="bg-white py-16">
    <div className="mx-auto max-w-7xl px-6">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Services</h2>
        <p className="mt-3 text-slate-700">
          End-to-end dangerous goods logistics under IATA DGR / IMDG / ADR — powered by China customs expertise.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICE_ITEMS.map((svc) => (
          <ServiceCard key={svc.key} svc={svc} />
        ))}
      </div>
    </div>
  </section>
);

/* —— 单个服务详情页（背景图使用各自 PNG） —— */
const ServiceDetailWithBg = ({ svc, back }) => (
  <section className="bg-white">
    {/* 顶部背景大图 */}
    <div
      className="h-[420px] bg-cover bg-center flex items-end"
      style={{ backgroundImage: `url('${svc.img}')` }}
    >
      <div className="w-full bg-gradient-to-t from-black/60 via-black/20 to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-white text-3xl sm:text-4xl font-bold">{svc.title}</h1>
          <p className="mt-2 max-w-3xl text-slate-100">{svc.desc}</p>
        </div>
      </div>
    </div>

    {/* 正文 */}
    <div className="mx-auto max-w-7xl px-6 py-10">
      <button
        onClick={back}
        className="mb-5 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        All Services
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {svc.badges.map((b) => (
            <span key={b} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-700">
              {b}
            </span>
          ))}
        </div>

        <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-2">
          {svc.bullets.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <IconCheck className="mt-0.5 h-4 w-4 text-blue-600 shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <a
            href={`mailto:${MAIL}?subject=DG%20Quote%20Request&body=Please%20share%20cargo%20details%20(UN%2C%20PI%2C%20weight%2C%20dims%2C%20origin%2Fdest).`}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Request a DG Quote
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
);

/* ================= Join Our Team（全部岗位纯文字） ================= */
const Careers = () => {
  const roles = [
    {
      title: "DG Operations Manager (Ocean)",
      desc:
        "Lead DG ocean operations with full IMDG compliance, SOP execution, and on-time delivery.",
      bullets: [
        "IMDG documentation & vessel coordination",
        "Team management & SOP execution",
        "Client operations support & exception handling",
      ],
    },
    {
      title: "Sales Representative",
      desc:
        "Drive new business, manage accounts, and promote our DG logistics solutions.",
      bullets: [
        "Client acquisition & relationship management",
        "Solution selling across DG services",
        "Pipeline ownership & revenue growth",
      ],
    },
    {
      title: "Warehouse Supervisor",
      desc:
        "Oversee DG warehouse operations with safety, compliance, and efficiency.",
      bullets: [
        "Inventory accuracy & cargo safety control",
        "DG storage compliance & hazard zones",
        "Shift/team coordination & reporting",
      ],
    },
  ];

  return (
    <section id="careers" className="bg-white">
      {/* Hero 横幅（可选 /careers-hero.png） */}
      <div
        className="h-[300px] sm:h-[360px] lg:h-[420px] bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url('${asset("careers-hero.png")}')` }}
      >
        <div className="w-full bg-gradient-to-t from-black/60 via-black/25 to-transparent">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Join Our Team</h2>
            <p className="mt-2 max-w-3xl text-slate-100">
              We’re growing our DG logistics team. If you’re compliance-driven and
              customer-obsessed, explore the roles below.
            </p>
          </div>
        </div>
      </div>

      {/* 职位卡片 */}
      <div className="mx-auto max-w-7xl px-6 py-14 space-y-6">
        {roles.map((r) => (
          <article
            key={r.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">{r.title}</h3>
            <p className="mt-2 text-sm text-slate-700">{r.desc}</p>
            <ul className="mt-3 text-sm text-slate-700 list-disc list-inside">
              {r.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <div className="mt-4">
              <a
                href={`mailto:${MAIL}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Apply Now
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

/* ================= Contact Us ================= */
const Contact = () => {
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const message = e.target.message.value.trim();

    if (!name) return alert("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Please enter a valid email address.");
    if (!message) return alert("Please enter your message.");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Your message has been sent successfully.");
      e.target.reset();
    }, 1200);
  };

  return (
    <section id="contact" className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
          Contact Us
        </h2>
        <p className="mt-3 text-center text-slate-600">
          Get in touch with our team for inquiries, quotes, or support.
        </p>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              name="name"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Message</label>
            <textarea
              name="message"
              rows="4"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Tell us about your request or shipment details..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg px-4 py-2 font-semibold text-white ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {success && (
          <div className="mt-6 text-center text-green-600 font-medium">
            {success}
          </div>
        )}

        {/* 邮箱直达（可选） */}
        <div className="mt-8 text-center text-sm text-slate-600">
          Prefer email?{" "}
          <a href={`mailto:${MAIL}`} className="text-blue-600 hover:text-blue-700 font-medium">
            {MAIL}
          </a>
        </div>
      </div>
    </section>
  );
};

/* ================= Resources（工具/知识中心） ================= */
const Resources = () => (
  <section id="resources" className="relative bg-gray-50 py-20">
    <div className="mx-auto max-w-7xl px-6">
      <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl text-center">Resources</h2>
      <p className="max-w-2xl mx-auto text-center text-slate-600 mt-3">
        Useful tools, references, and knowledge for international DG logistics, trade, and shipping.
      </p>

      {/* 外部资源卡片 */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Currency Converter */}
        <article className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Currency Converter</h3>
          <p className="text-sm text-slate-600 mb-4">
            Convert currencies in real time for quotes, freight charges, and duty/tax estimates.
          </p>
          <a
            href="https://www.xe.com/currencyconverter/"
            target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Open Tool →
          </a>
        </article>

        {/* 2. Incoterms 2020（PDF 放到 public/incoterms-2020.pdf） */}
        <article className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Incoterms 2020</h3>
          <p className="text-sm text-slate-600 mb-4">
            Responsibilities, costs, and risks between sellers and buyers.
          </p>
          <a
            href={asset("incoterms-2020.pdf")}
            target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Download PDF →
          </a>
        </article>

        {/* 3. World Clock */}
        <article className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">World Clock</h3>
          <p className="text-sm text-slate-600 mb-4">
            Check global time zones for cut-offs, CFS closing, and departure coordination.
          </p>
          <a
            href="https://www.timeanddate.com/worldclock/"
            target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Visit Website →
          </a>
        </article>

        {/* 5. Glossary of Shipping Terms */}
        <article className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Glossary of Shipping Terms</h3>
          <p className="text-sm text-slate-600 mb-4">
            A to Z logistics & shipping terminology reference.
          </p>
          <a
            href="https://www.oocl.com/eng/resourcecenter/shippinglossary/Pages/default.aspx"
            target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Open Glossary →
          </a>
        </article>

        {/* 额外：IATA DGR（官方） */}
        <article className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">IATA DGR (Official)</h3>
          <p className="text-sm text-slate-600 mb-4">
            Official Dangerous Goods Regulations for air transport.
          </p>
          <a
            href="https://www.iata.org/en/publications/dgr/"
            target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            IATA DGR →
          </a>
        </article>

        {/* 占位：可扩展更多工具 */}
        <article className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">More Tools</h3>
          <p className="text-sm text-slate-600 mb-4">
            Add route planners, HS lookup, port schedules, or airline DG manuals.
          </p>
          <span className="text-slate-400 text-sm">Coming soon</span>
        </article>
      </div>

      {/* 内置知识：Hazmat Definitions */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-slate-900">Hazmat Definitions</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            ["Dangerous Goods (DG)", "Articles or substances capable of posing a risk to health, safety, property, or the environment. Regulated by IATA/ICAO (air), IMDG (ocean), ADR (road), etc."],
            ["UN Number", "Four-digit identifier assigned by the UN Committee of Experts to hazardous substances or articles (e.g., UN 3481)."],
            ["Proper Shipping Name (PSN)", "The name used to describe a DG for transport documents and marking/labeling."],
            ["Class / Division", "Primary hazard classification (e.g., Class 3 Flammable Liquid, 5.1 Oxidizer)."],
            ["Packing Group (PG)", "Indicates degree of danger for certain classes: I (high), II (medium), III (low)."],
            ["Packing Instruction (PI)", "Specific packaging requirements (e.g., IATA PI 965–970 for lithium batteries)."],
            ["Special Provisions (SP)", "Additional conditions/limitations applicable to specific UN entries."],
            ["Overpack", "An enclosure used to contain one or more packages to form a single handling unit (marking rules apply)."],
            ["Limited Quantity (LQ)", "Smaller inner pack limits with reduced markings/labels under certain conditions."],
            ["Excepted Quantity (EQ)", "Very small quantities allowed under simplified provisions (marking with EQ mark)."],
          ].map(([term, def]) => (
            <div key={term} className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
              <div className="text-sm font-semibold text-slate-900">{term}</div>
              <div className="mt-1 text-sm text-slate-600">{def}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 内置知识：Common UN Packaging Types */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-slate-900">Common UN Packaging Types</h3>
        <p className="mt-2 text-sm text-slate-600">
          Typical UN spec codes used for DG shipments. Always verify the exact code, test level, PG, and compatibility with your MSDS/PSDS and modal regulations.
        </p>

        {/* 表格 */}
        <div className="mt-5 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">UN Code</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Material</th>
                <th className="px-4 py-3 font-semibold">Typical Use</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["1A1", "Drum, non-removable head", "Steel", "Liquids (no opening top)", "Robust; closures must be torque-set."],
                ["1A2", "Drum, removable head", "Steel", "Solids / viscous", "Lid + bolt ring; gaskets required."],
                ["1H1", "Drum, non-removable head", "Plastic (HDPE)", "Liquids", "Check permeation; temp limits apply."],
                ["1H2", "Drum, removable head", "Plastic (HDPE)", "Solids / gels", "Use with liners if needed."],
                ["1B1/1B2", "Drum (NRH/RH)", "Aluminum", "Corrosives / sensitive chems", "Lighter; compatibility check needed."],
                ["1N1/1N2", "Drum (NRH/RH)", "Other metal", "Specialty chems", "Less common than steel."],
                ["3A1/3A2", "Jerrican (NRH/RH)", "Steel", "Liquids (small volumes)", "For higher strength needs."],
                ["3H1/3H2", "Jerrican (NRH/RH)", "Plastic (HDPE)", "Common liquids", "Very common for Class 3/8."],
                ["4G", "Box", "Fibreboard", "Inner packagings (glass/plastic/metal)", "Most common outer; use dividers/foam."],
                ["4GV", "Box, variation", "Fibreboard", "Various inner packagings", "Tested to accept a range of inners."],
                ["4GU", "Box, variation", "Fibreboard", "Universal inner packagings", "Vendor-specific universal design."],
                ["4C1/4C2", "Box", "Plywood / Reconstituted wood", "Heavier inners", "Moisture and nail/screw specs apply."],
                ["4D", "Box", "Plywood", "Heavier inners / industrial", "Check construction standard."],
                ["4H1/4H2", "Box", "Plastic", "Light to medium solids", "Less common than 4G for export."],
                ["5H4", "Bag", "Woven plastic", "Solids / powders", "Inner linings often required."],
                ["5M1/5M2", "Bag", "Paper / Multi-wall", "Powders / granules", "Moisture barrier may be needed."],
                ["6HA1", "Composite (plastic receptacle in steel drum)", "Composite", "Aggressive liquids", "Combines strengths; check PI."],
                ["6HG1", "Composite (glass in fiberboard box)", "Composite", "Glass inners", "Cushioning + absorbent required."],
                ["UN Mark", "e.g., 4G/Y30/S/24/CN/XYZ", "—", "Marking example", "Type / PG / year / country / maker."],
              ].map((row) => (
                <tr key={row[0]} className="hover:bg-slate-50">
                  {row.map((cell, idx) => (
                    <td key={idx} className="px-4 py-3 text-slate-700">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 额外提示 */}
        <div className="mt-4 text-xs text-slate-500">
          Always match <span className="font-medium">PI (Packing Instruction)</span>, inner packaging limitations,
          <span className="font-medium"> PG level</span>, closure torque, absorbent/vermiculite, and
          <span className="font-medium"> compatibility</span> per the modal rules (IATA/IMDG/ADR) and MSDS/PSDS.
        </div>
      </div>
    </div>
  </section>
);

/* ================= App 入口 ================= */
export default function App() {
  const [page, setPage] = useState("home");

  // 命中服务 key 时渲染详情页
  const renderServiceDetail = () => {
    const svc = SERVICE_ITEMS.find((s) => s.key === page);
    if (!svc) return null;
    return <ServiceDetailWithBg svc={svc} back={() => setPage("services")} />;
  };

  return (
    <PageContext.Provider value={{ page, setPage }}>
      <Layout setPage={setPage}>
        {page === "home" && <Home setPage={setPage} />}
        {page === "about" && <About />}
        {page === "services" && <Services />}
        {page === "resources" && <Resources />}
        {page === "careers" && <Careers />}
        {page === "contact" && <Contact />}
        {/* 6 个服务详情页 */}
        {renderServiceDetail()}
      </Layout>
    </PageContext.Provider>
  );
}
