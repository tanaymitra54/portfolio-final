import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  FileText,
  Github,
  Home,
  Linkedin,
  Mail,
  User,
  Volume2,
  VolumeX,
  LayoutGrid,
} from "lucide-react";
import "../studio.css";

type Disk = {
  id: string;
  title: string;
  kicker: string;
  role: string;
  stack: string;
  tags: string[];
  read: string;
  blurb: string;
  href: string;
  color: string;
};

const WORK: Disk[] = [
  {
    id: "kgen",
    title: "KGEN",
    kicker: "Prediction markets",
    role: "SDE INTERN",
    stack: "Trading APIs · Postgres · SEO",
    tags: ["DEV"],
    read: "2 MIN",
    blurb: "Prediction-market backend: market creation, leveraged trading, settlement, and search.",
    href: "https://github.com/tanaymitra54",
    color: "#2f6b45",
  },
  {
    id: "samsung",
    title: "SAMSUNG PRISM",
    kicker: "Small language models",
    role: "PROJECT INTERN",
    stack: "Python · Transformers · Search",
    tags: ["RESEARCH"],
    read: "3 MIN",
    blurb: "Raised small-model reasoning accuracy by 15% with a quantum-inspired annealing search.",
    href: "https://github.com/tanaymitra54/samsung_backup",
    color: "#1d4e89",
  },
  {
    id: "cerify",
    title: "CERIFY.AI",
    kicker: "Legal clause models",
    role: "SOFTWARE ENGINEERING INTERN",
    stack: "Python · SLMs · Blockchain",
    tags: ["ML", "DEV"],
    read: "3 MIN",
    blurb: "Fine-tuned models on 10K+ legal samples. Clause classification up 22%, fewer false positives.",
    href: "https://github.com/tanaymitra54/ContractSLM",
    color: "#0e7490",
  },
  {
    id: "devswarm",
    title: "DEVSWARM",
    kicker: "Go-to-market systems",
    role: "GTM ENGINEER",
    stack: "HubSpot · Analytics · Routing",
    tags: ["DEV"],
    read: "2 MIN",
    blurb: "CRM automation that cut manual sales work by 40% and lifted SQL conversion by 25%.",
    href: "https://github.com/tanaymitra54",
    color: "#a16207",
  },
  {
    id: "railq",
    title: "RAILQ",
    kicker: "Railway scheduling",
    role: "SOLO · RESEARCH + BUILD",
    stack: "TensorFlow · OpenWeatherMap",
    tags: ["ML"],
    read: "4 MIN",
    blurb: "Weather-aware track allocation. 90% efficiency and 85% robustness in severe-weather sims.",
    href: "https://github.com/tanaymitra54/AHCO-Railway-Traffic-Optimization",
    color: "#b91c1c",
  },
  {
    id: "swiftcheck",
    title: "SWIFTCHECK",
    kicker: "QR attendance",
    role: "DESIGN + FULL STACK",
    stack: "Kotlin · Next.js · Express",
    tags: ["DEV"],
    read: "3 MIN",
    blurb: "Rotating QR codes, device binding, a faculty dashboard, and live attendance charts.",
    href: "https://github.com/tanaymitra54/smart-attendance",
    color: "#6d28d9",
  },
];

const PERSONAL: Disk[] = [
  {
    id: "wellwise",
    title: "WELL-WISE",
    kicker: "Health risk models",
    role: "SOLO · ML + BUILD",
    stack: "Flask · Streamlit · scikit-learn",
    tags: ["ML"],
    read: "3 MIN",
    blurb: "Risk scores for four conditions, plus fitness plans. 88%+ accuracy, 100+ users on Railway.",
    href: "https://github.com/tanaymitra54",
    color: "#15803d",
  },
  {
    id: "shelf",
    title: "SHELF LIFE",
    kicker: "AI for Bharat",
    role: "SOLO · ML",
    stack: "Python · Computer vision",
    tags: ["ML"],
    read: "2 MIN",
    blurb: "Shelf-life predictor for produce. Trained and shipped as a small vision app.",
    href: "https://github.com/tanaymitra54/Shelf-life-predictor",
    color: "#ca8a04",
  },
  {
    id: "scopetube",
    title: "SCOPETUBE",
    kicker: "Focus Chrome extension",
    role: "SOLO · FRONTEND",
    stack: "React · TypeScript · Vite",
    tags: ["DEV"],
    read: "2 MIN",
    blurb: "Hides YouTube recommendations and keeps search. Filtering stays on the device.",
    href: "https://github.com/tanaymitra54",
    color: "#0369a1",
  },
  {
    id: "cinematch",
    title: "CINEMATCH",
    kicker: "Movie recommender",
    role: "SOLO · ML",
    stack: "Pandas · Cosine similarity · Streamlit",
    tags: ["ML"],
    read: "2 MIN",
    blurb: "Suggests films from genre, cast, and plot keywords, with a Streamlit front end.",
    href: "https://github.com/tanaymitra54",
    color: "#be123c",
  },
  {
    id: "voice",
    title: "VOICE ASSISTANT",
    kicker: "Search and file tasks",
    role: "SOLO · BUILD",
    stack: "Python · LangChain · ElevenLabs",
    tags: ["AI"],
    read: "3 MIN",
    blurb: "Voice search, web lookup, and file writing, split so new tools can plug in.",
    href: "https://github.com/tanaymitra54",
    color: "#4338ca",
  },
  {
    id: "notesflix",
    title: "NOTESFLIX",
    kicker: "Campus notes",
    role: "SOLO · FRONTEND",
    stack: "HTML · CSS · JavaScript",
    tags: ["DEV"],
    read: "2 MIN",
    blurb: "Students browse, share, and download subject notes for exam prep.",
    href: "https://github.com/tanaymitra54",
    color: "#c2410c",
  },
];

const SKY = [1, 2, 3, 1, 4, 2, 5, 1, 3, 6, 2, 4, 1, 2, 5, 3, 1, 4, 2, 6, 1, 3, 2, 4, 1, 5, 2, 3];

let audioCtx: AudioContext | null = null;

function audio() {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function thock(muted: boolean, pitch = 1, level = 1) {
  if (muted) return;
  const ac = audio();
  const t = ac.currentTime;
  const body = ac.createOscillator();
  const bodyAmp = ac.createGain();
  body.type = "sine";
  body.frequency.setValueAtTime(168 * pitch, t);
  body.frequency.exponentialRampToValueAtTime(62 * pitch, t + 0.1);
  bodyAmp.gain.setValueAtTime(0.28 * level, t);
  bodyAmp.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
  body.connect(bodyAmp);
  bodyAmp.connect(ac.destination);
  body.start(t);
  body.stop(t + 0.12);

  const len = Math.floor(ac.sampleRate * 0.045);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const noise = ac.createBufferSource();
  noise.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 380;
  const noiseAmp = ac.createGain();
  noiseAmp.gain.setValueAtTime(0.42 * level, t);
  noiseAmp.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  noise.connect(filter);
  filter.connect(noiseAmp);
  noiseAmp.connect(ac.destination);
  noise.start(t);
}

function chennaiTime() {
  return new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function StudioPage() {
  const [section, setSection] = useState("home");
  const [chrome, setChrome] = useState<"red" | "dark">("red");
  const [muted, setMuted] = useState(false);
  const [micro, setMicro] = useState(true);
  const [workOpen, setWorkOpen] = useState(false);
  const [personalOpen, setPersonalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clock, setClock] = useState(chennaiTime);
  const [hover, setHover] = useState<{ disk: Disk; top: number; left: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const tiles = useRef<HTMLDivElement>(null);
  const contactTiles = useRef<HTMLDivElement>(null);
  const lastCell = useRef("");
  const paintRef = useRef<(layer: HTMLElement | null, x: number, y: number) => void>(() => {});

  useEffect(() => {
    document.body.classList.add("studio-on");
    return () => document.body.classList.remove("studio-on");
  }, []);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = visible.target.getAttribute("data-section") || "home";
        setSection(id);
        setChrome(id === "home" || id === "contact" ? "red" : "dark");
      },
      { threshold: [0.25, 0.5] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setClock(chennaiTime()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  function clearTiles(layer: HTMLElement | null) {
    layer?.querySelectorAll<HTMLElement>(".tile").forEach((el) => {
      el.dataset.hot = "0";
      el.style.transform = "";
      el.style.background = "";
      el.style.boxShadow = "";
    });
  }

  function paintTiles(layer: HTMLElement | null, clientX: number, clientY: number) {
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    if (clientY < rect.top || clientY > rect.bottom || clientX < rect.left || clientX > rect.right) {
      clearTiles(layer);
      return;
    }
    if (layer.classList.contains("hero-tiles")) {
      const nx = (clientX - rect.left) / rect.width;
      const ny = (clientY - rect.top) / rect.height;
      const dx = (nx - 0.5) / 0.16;
      const dy = (ny - 0.76) / 0.22;
      if (dx * dx + dy * dy < 1) {
        clearTiles(layer);
        return;
      }
    }
    const cell = layer.classList.contains("hero-tiles") ? 64 : 52;
    const col = Math.floor((clientX - rect.left) / cell);
    const row = Math.floor((clientY - rect.top) / cell);
    const key = `${layer.className}:${col},${row}`;
    if (key !== lastCell.current) {
      lastCell.current = key;
      thock(muted, 1.25, 0.45);
    }
    clearTiles(layer);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (let r = row - 2; r <= row + 2; r++) {
      for (let c = col - 2; c <= col + 2; c++) {
        const el = layer.querySelector<HTMLElement>(`[data-cell="${c},${r}"]`);
        if (!el) continue;
        const dist = Math.hypot(c - col, r - row);
        const lift = Math.max(0, 1 - dist / 2.6);
        if (lift <= 0.05) continue;
        el.dataset.hot = "1";
        const red = Math.round(227 + (252 - 227) * lift);
        const green = Math.round(73 + (176 - 73) * lift);
        const blue = Math.round(68 + (166 - 68) * lift);
        el.style.background = `rgb(${red}, ${green}, ${blue})`;
        if (!reduce) el.style.transform = `translateY(${(-8 * lift).toFixed(1)}px)`;
        el.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,${(0.5 * lift).toFixed(2)}), 0 ${(5 * lift).toFixed(1)}px 0 rgba(140,28,36,${(0.4 * lift).toFixed(2)})`;
      }
    }
  }

  paintRef.current = paintTiles;

  useEffect(() => {
    function fill(layer: HTMLElement | null, cell: number) {
      if (!layer) return;
      const cols = Math.ceil(layer.clientWidth / cell) + 1;
      const rows = Math.ceil(layer.clientHeight / cell) + 1;
      layer.innerHTML = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const el = document.createElement("div");
          el.className = "tile";
          el.dataset.cell = `${c},${r}`;
          el.style.left = `${c * cell}px`;
          el.style.top = `${r * cell}px`;
          el.style.width = `${cell - 2}px`;
          el.style.height = `${cell - 2}px`;
          layer.appendChild(el);
        }
      }
    }
    const build = () => {
      fill(tiles.current, 64);
      fill(contactTiles.current, 52);
    };
    build();
    const hero = document.querySelector(".hero");
    const contact = document.querySelector(".contact");
    const onHero = (e: Event) => {
      const p = e as PointerEvent;
      paintRef.current(tiles.current, p.clientX, p.clientY);
    };
    const onContact = (e: Event) => {
      const p = e as PointerEvent;
      paintRef.current(contactTiles.current, p.clientX, p.clientY);
    };
    hero?.addEventListener("pointermove", onHero);
    contact?.addEventListener("pointermove", onContact);
    window.addEventListener("resize", build);
    return () => {
      hero?.removeEventListener("pointermove", onHero);
      contact?.removeEventListener("pointermove", onContact);
      window.removeEventListener("resize", build);
    };
  }, []);

  function go(id: string) {
    thock(muted, 0.9);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  async function copyEmail() {
    thock(muted, 1);
    try {
      await navigator.clipboard.writeText("tanaymitra9@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="studio" data-chrome={chrome} ref={root}>
      <nav className="studio-nav" aria-label="Sections">
        <a href="#home" data-on={section === "home"} onClick={(e) => { e.preventDefault(); go("home"); }}>
          <Home aria-hidden="true" /> <span>HOME</span>
        </a>
        <a href="#about" data-on={section === "about"} onClick={(e) => { e.preventDefault(); go("about"); }}>
          <User aria-hidden="true" /> <span>ABOUT</span>
        </a>
        <a href="#work" data-on={section === "work"} onClick={(e) => { e.preventDefault(); go("work"); }}>
          <LayoutGrid aria-hidden="true" /> <span>WORK</span>
        </a>
        <a href="#contact" data-on={section === "contact"} onClick={(e) => { e.preventDefault(); go("contact"); }}>
          <Mail aria-hidden="true" /> <span>CONTACT</span>
        </a>
        <button
          type="button"
          data-on={!muted}
          aria-pressed={!muted}
          aria-label={muted ? "Unmute sounds" : "Mute sounds"}
          onClick={() => setMuted((m) => !m)}
        >
          {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>
      </nav>

      <header
        className="hero"
        id="home"
        data-section="home"
        onPointerLeave={() => clearTiles(tiles.current)}
      >
        <div className="hero-grid" />
        <div className="hero-tiles" ref={tiles} />
        <img className="diorama" src="/hero-diorama.jpg" alt="" />
        <div className="hero-copy">
          <p className="kicker">I'M TANAY</p>
          <h1 className="display">MAKING THINGS<br />FEEL RIGHT</h1>
          <p className="role">SOFTWARE ENGINEER · FULL STACK, AI, AND PRODUCT</p>
        </div>
        <button className="scroll-cue" type="button" onClick={() => go("about")}>
          <ArrowDown aria-hidden="true" size={14} /> SCROLL
        </button>
      </header>

      <section className="about" id="about" data-section="about">
        <p className="eyebrow">ABOUT</p>
        <p className="about-lead">
          Shipping product engineering at KGen, and research at Samsung PRISM. I build full stack systems and machine learning, with a soft spot for{" "}
          <span className="micro">
            micro
            <button
              className="switch"
              type="button"
              data-on={micro}
              aria-pressed={micro}
              aria-label="Micro interactions"
              onClick={() => {
                setMicro((v) => !v);
                thock(muted, micro ? 0.85 : 1.05);
              }}
            >
              <i />
            </button>
          </span>{" "}
          <span className={micro ? "" : "dim"}>interactions: the small moments that make a product feel right.</span>
        </p>
        <div className="actions">
          <a className="btn btn-cream" href="/Tanay-Mitra-Resume.pdf" target="_blank" rel="noreferrer">
            <FileText aria-hidden="true" /> Résumé PDF <ArrowUpRight aria-hidden="true" />
          </a>
          <button className="btn btn-red" type="button" onClick={() => go("timeline")}>
            <User aria-hidden="true" /> More about me <ArrowUpRight aria-hidden="true" />
          </button>
        </div>

        <div className="timeline" id="timeline">
          <p className="eyebrow">TIMELINE</p>
          <div className="track" aria-hidden="true">
            <div className="rail" />
            <div className="bar" style={{ left: "0%", width: "100%", background: "#3a3a3a" }}>
              <span>B.TECH</span>
            </div>
            <div className="bar" style={{ left: "25%", width: "14%", background: "#666" }}>
              <span>DEVSWARM</span>
            </div>
            <div className="bar" style={{ left: "50%", width: "19%", background: "#c43a3a" }}>
              <span>CERIFY · PRISM · KGEN</span>
            </div>
            <i className="dot" style={{ left: "32%" }} />
            <i className="dot" style={{ left: "38%" }} />
            <i className="dot" style={{ left: "44%" }} />
            <div className="now" style={{ left: "69%" }}>
              <i />
              <b>OCT 2026 · NOW</b>
            </div>
          </div>
          <div className="years">
            <span>2024</span><span>2025</span><span>2026</span><span>2027</span><span>2028</span>
          </div>
        </div>
      </section>

      <section className="sheet" data-section="about">
        <div className="block">
          <h3><span className="tag">—</span>EXPERIENCE</h3>
          <article className="row">
            <div>
              <strong>Kratos Gamers Network (KGen)</strong>
              <p>SDE intern on a prediction market. Trading APIs, database integrity, SEO, and generative search.</p>
            </div>
            <time>AUG 2026 – NOW</time>
          </article>
          <article className="row">
            <div>
              <strong>Samsung PRISM, SRI-B</strong>
              <p>Project intern. Improved small language model reasoning by 15% with simulated annealing and NLP pipelines.</p>
            </div>
            <time>JUN 2026 – NOW</time>
          </article>
          <article className="row">
            <div>
              <strong>Cerify.ai</strong>
              <p>Fine-tuned models on 10K+ legal and smart-contract samples and wired inference into audit workflows.</p>
            </div>
            <time>JAN 2026 – JUN 2026</time>
          </article>
          <article className="row">
            <div>
              <strong>Devswarm.ai</strong>
              <p>GTM engineer. HubSpot automation, lead scoring, and routing. Manual sales work down 40%.</p>
            </div>
            <time>JUN 2025 – DEC 2025</time>
          </article>
        </div>

        <div className="block">
          <h3><span className="tag">—</span>EDUCATION</h3>
          <article className="row">
            <div>
              <strong>B.Tech, Computer Science</strong>
              <p>Vellore Institute of Technology, Chennai · CGPA 9.09</p>
            </div>
            <time>2024 – 2028</time>
          </article>
          <article className="row">
            <div>
              <strong>Kendriya Vidyalaya</strong>
              <p>New Bongaigaon · 98%</p>
            </div>
            <time>2015 – 2022</time>
          </article>
        </div>

        <div className="block">
          <h3><span className="tag">—</span>CAMPUS</h3>
          <article className="row">
            <div>
              <strong>TakeUForward</strong>
              <p>Campus ambassador. Introduced 50+ students to DSA and ran coding workshops at VIT Chennai.</p>
            </div>
            <time>JUL 2025 – DEC 2025</time>
          </article>
          <article className="row">
            <div>
              <strong>Unstop</strong>
              <p>Campus ambassador. Promoted hackathons and hiring challenges on campus.</p>
            </div>
            <time>SEP 2025 – DEC 2025</time>
          </article>
        </div>

        <div className="block">
          <h3 className="eyebrow" style={{ marginBottom: 12 }}>TOOLKIT</h3>
          <table className="kit">
            <tbody>
              <tr><th>Languages</th><td>Python, TypeScript, JavaScript, Java, C, C++</td></tr>
              <tr><th>Frontend</th><td>React, Next.js, Tailwind CSS, HTML, CSS</td></tr>
              <tr><th>Backend</th><td>Node.js, Express, Flask, FastAPI</td></tr>
              <tr><th>AI</th><td>scikit-learn, TensorFlow, LangChain, NLP</td></tr>
              <tr><th>Data</th><td>Postgres, Firebase, Supabase, MongoDB, MySQL</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="work" id="work" data-section="work">
        <p className="eyebrow">WORK</p>
        <h2 className="display" style={{ fontSize: "clamp(48px, 7vw, 92px)" }}>SELECTED WORK</h2>
        <div className="shelves">
          <Shelf
            title="WORK"
            meta="INTERNSHIPS & RESEARCH · 06 DISKS"
            open={workOpen}
            disks={WORK}
            onToggle={() => {
              setWorkOpen((v) => !v);
              thock(muted, 0.75);
            }}
          />
          <Shelf
            title="PERSONAL"
            meta="PROJECTS · 06 DISKS"
            open={personalOpen}
            disks={PERSONAL}
            onToggle={() => {
              setPersonalOpen((v) => !v);
              thock(muted, 0.7);
            }}
          />
        </div>
        <div onMouseLeave={() => setHover(null)}>
        {workOpen && (
          <DiskList
            label="WORK · INTERNSHIPS"
            disks={WORK}
            activeId={hover?.disk.id}
            onHover={(disk, row) => {
              const work = row.closest(".work") as HTMLElement;
              const wr = work.getBoundingClientRect();
              const rr = row.getBoundingClientRect();
              setHover({
                disk,
                top: rr.top - wr.top + rr.height / 2 - 118,
                left: rr.left - wr.left + rr.width * 0.46,
              });
              thock(muted, 0.8);
            }}
          />
        )}
        {personalOpen && (
          <DiskList
            label="PERSONAL · PROJECTS"
            disks={PERSONAL}
            activeId={hover?.disk.id}
            onHover={(disk, row) => {
              const work = row.closest(".work") as HTMLElement;
              const wr = work.getBoundingClientRect();
              const rr = row.getBoundingClientRect();
              setHover({
                disk,
                top: rr.top - wr.top + rr.height / 2 - 118,
                left: rr.left - wr.left + rr.width * 0.46,
              });
              thock(muted, 0.8);
            }}
          />
        )}
        </div>
        {hover && (
          <div className="crt" style={{ top: hover.top, left: hover.left }}>
            <div className="slot" key={hover.disk.id}>
              <span className="floppy peek" style={{ background: hover.disk.color }} />
            </div>
            <div className="bezel">
              <div className="screen" key={hover.disk.id}>
                <div className="boot">LOAD</div>
                <div className="preview">
                  <b>{hover.disk.title}</b>
                  <small>{hover.disk.kicker}</small>
                  <i className="bar" style={{ background: hover.disk.color }} />
                </div>
              </div>
              <div className="chin">
                <span>LOAD</span>
                <span>{hover.disk.title}</span>
              </div>
            </div>
            <div className="load-note">CLICK TO OPEN THE REPO</div>
          </div>
        )}
      </section>

      <section
        className="contact"
        id="contact"
        data-section="contact"
        onPointerLeave={() => clearTiles(contactTiles.current)}
      >
        <div className="sky" aria-hidden="true">
          {SKY.map((h, i) => (
            <div className="col" key={i}>
              {Array.from({ length: h }, (_, n) => (
                <div key={n} className={n === 1 && h > 3 ? "cell hole" : "cell"} />
              ))}
            </div>
          ))}
        </div>
        <div className="contact-body">
          <div className="hero-tiles contact-tiles" ref={contactTiles} />
          <div className="contact-front">
          <p className="eyebrow">CONTACT</p>
          <h2>LET'S MAKE SOMETHING FEEL RIGHT</h2>
          <div className="status">
            <span className="live">● OPEN TO SOFTWARE ENGINEERING ROLES</span>
            <span>{clock.toUpperCase()} IN CHENNAI, INDIA</span>
          </div>
          <div className="contact-links">
            <button className="pill light" type="button" onClick={copyEmail}>
              <Mail aria-hidden="true" size={16} />
              {copied ? "Copied" : "tanaymitra9@gmail.com"}
              <ArrowUpRight aria-hidden="true" size={16} />
            </button>
            <a className="pill" href="https://www.linkedin.com/in/tanaymitra9" target="_blank" rel="noreferrer">
              <Linkedin aria-hidden="true" size={16} /> LinkedIn <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            <a className="pill" href="https://github.com/tanaymitra54" target="_blank" rel="noreferrer">
              <Github aria-hidden="true" size={16} /> GitHub <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            <a className="pill" href="https://leetcode.com/tanaymitra98" target="_blank" rel="noreferrer">
              LeetCode <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </div>
          <footer className="foot">
            <span>© 2026 TANAY MITRA</span>
            <span>REACT · VITE · TAILWIND</span>
          </footer>
          </div>
        </div>
      </section>
    </div>
  );
}

function Shelf({
  title,
  meta,
  open,
  disks,
  onToggle,
}: {
  title: string;
  meta: string;
  open: boolean;
  disks: Disk[];
  onToggle: () => void;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hot, setHot] = useState<number | null>(null);
  const [pop, setPop] = useState(false);

  function track(e: React.PointerEvent<HTMLButtonElement>) {
    if (open || pop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (py - 0.5) * -12, y: (px - 0.5) * 16 });
    setHot(Math.min(disks.length - 1, Math.max(0, Math.floor(px * disks.length))));
  }

  function release() {
    setTilt({ x: 0, y: 0 });
    setHot(null);
  }

  function click() {
    if (!open) {
      setPop(true);
      window.setTimeout(() => {
        setPop(false);
        onToggle();
      }, 380);
      return;
    }
    onToggle();
  }

  return (
    <div className="shelf">
      <h3>{title}</h3>
      <p className="meta">{meta}</p>
      <button
        className={pop ? "case pop" : "case"}
        type="button"
        onClick={click}
        onPointerMove={track}
        onPointerLeave={release}
        aria-expanded={open}
      >
        {(!open || pop) && (
          <div className="stack" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
            <div className="disks-in">
              {disks.map((d, i) => {
                const lift = pop ? -78 : hot === i ? -28 : hot !== null && Math.abs(hot - i) === 1 ? -12 : 0;
                const slide = pop ? (i - (disks.length - 1) / 2) * 10 : hot === i ? (pxShift(i, hot)) : 0;
                return (
                  <span
                    key={d.id}
                    className="floppy"
                    style={{
                      background: d.color,
                      transform: `translate(${slide}px, ${lift}px)`,
                      zIndex: hot === i ? 4 : 1,
                      transitionDelay: pop ? `${i * 28}ms` : "0ms",
                    }}
                  >
                    <b>{d.title.split(" ")[0]}</b>
                  </span>
                );
              })}
            </div>
          </div>
        )}
        <span className="lip">{title} · {String(disks.length).padStart(2, "0")}</span>
      </button>
      <p className="names">{disks.map((d) => d.title).join(" · ")}</p>
      <p className="hint">{open ? "Click the box to put them back." : "Click the box to take them out."}</p>
    </div>
  );
}

function pxShift(index: number, hot: number | null) {
  if (hot === null || index !== hot) return 0;
  return index < 3 ? -6 : 6;
}

function DiskList({
  label,
  disks,
  activeId,
  onHover,
}: {
  label: string;
  disks: Disk[];
  activeId?: string;
  onHover: (disk: Disk, row: HTMLAnchorElement) => void;
}) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      {disks.map((disk, i) => (
        <a
          key={disk.id}
          className="project"
          data-on={activeId === disk.id}
          href={disk.href}
          target="_blank"
          rel="noreferrer"
          onMouseEnter={(e) => onHover(disk, e.currentTarget)}
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <span className="floppy" style={{ background: disk.color }} aria-hidden="true" />
          <span>
            <h4>{String(i + 1).padStart(2, "0")} {disk.title}</h4>
            <div className="sub">{disk.kicker}</div>
            <p className="blurb">{disk.blurb}</p>
          </span>
          <span>
            <div className="role">{disk.role}</div>
            <div className="stack">{disk.stack}</div>
            <div className="pills">{disk.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </span>
          <span>
            <span className="btn btn-ghost">Repo <ArrowUpRight aria-hidden="true" /></span>
            <div className="read">{disk.read} READ</div>
          </span>
        </a>
      ))}
    </div>
  );
}
