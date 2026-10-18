import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import video from "@/assets/envelope.mp4.asset.json";
import kids from "@/assets/kids-sticker-2.png.asset.json";
import archBg from "@/assets/arch-bg.png.asset.json";
import floralBg from "@/assets/floral-bg.png.asset.json";
import ornament from "@/assets/ornament-frame.png.asset.json";
import envelope from "@/assets/wish-envelope.png.asset.json";
import garden from "@/assets/ceremony-garden.jpg.asset.json";
import rsvpFrame from "@/assets/lace-flower-frame.png.asset.json";
import wax from "@/assets/wax-seal.png.asset.json";
import mapBtn from "@/assets/map-btn.png.asset.json";
import church from "@/assets/church.png.asset.json";
import song from "@/assets/mukhambazi.mp3.asset.json";

const plaque = "inline-flex h-11 w-44 items-center justify-center bg-[length:100%_100%] bg-center bg-no-repeat text-sm text-graphite transition hover:-translate-y-0.5 disabled:opacity-40";
const plaqueStyle = { backgroundImage: `url(${mapBtn.url})` };

function MapLink({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`mt-3 ${plaque}`} style={plaqueStyle}>რუკაზე ნახვა</a>
  );
}

// Shared audio, created on the envelope tap so browsers allow playback (user gesture).
let audioEl: HTMLAudioElement | null = null;
function startMusic() {
  if (!audioEl) { audioEl = new Audio(song.url); audioEl.loop = true; audioEl.volume = 0.6; }
  audioEl.play().catch(() => {});
}

function MusicButton() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const a = audioEl; if (!a) return;
    const sync = () => setOn(!a.paused);
    sync();
    a.addEventListener("play", sync); a.addEventListener("pause", sync);
    return () => { a.removeEventListener("play", sync); a.removeEventListener("pause", sync); };
  }, []);
  const toggle = () => {
    if (!audioEl) return startMusic();
    if (audioEl.paused) audioEl.play().catch(() => {}); else audioEl.pause();
    setOn(!audioEl.paused);
  };
  return (
    <button onClick={toggle} aria-label={on ? "მუსიკის გამორთვა" : "მუსიკის ჩართვა"}
      className={`fixed bottom-4 right-4 z-40 inline-flex h-10 w-32 items-center justify-center bg-[length:100%_100%] bg-center bg-no-repeat text-xs text-graphite drop-shadow-md transition hover:-translate-y-0.5 ${on ? "opacity-100" : "opacity-70"}`}
      style={{ backgroundImage: `url(${mapBtn.url})` }}>
      მუსიკა
    </button>
  );
}

const CAL_TITLE = "ნინი & იოანე — ქორწილი";
const CAL_PLACE = "არმაზის ხეობა";
const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CAL_TITLE)}&dates=20261108T090000Z/20261108T200000Z&location=${encodeURIComponent(CAL_PLACE)}&details=${encodeURIComponent("13:00 ჯვრისწერა · 17:00 ხელის მოწერა · 18:00 სადილი")}`;

function downloadIcs() {
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//nini-ioane//wedding//KA", "BEGIN:VEVENT",
    "UID:nini-ioane-20261108@wedding", "DTSTAMP:20261018T000000Z",
    "DTSTART:20261108T090000Z", "DTEND:20261108T200000Z",
    `SUMMARY:${CAL_TITLE}`, `LOCATION:${CAL_PLACE}`,
    "DESCRIPTION:13:00 ჯვრისწერა · 17:00 ხელის მოწერა · 18:00 სადილი",
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:ხვალ ქორწილია ♡", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "nini-ioane.ics"; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function CalendarButtons() {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <a href={gcalUrl} target="_blank" rel="noreferrer" className={plaque} style={plaqueStyle}>Google კალენდარი</a>
      <button type="button" onClick={downloadIcs} className={plaque} style={plaqueStyle}>Apple / Outlook</button>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ნინი & იოანე — 8 ნოემბერი" },
      { name: "description", content: "გეპატიჟებით ნინისა და იოანეს ქორწილში — 8 ნოემბერი, 18:00." },
      { property: "og:title", content: "ნინი & იოანე — საქორწილო მოსაწვევი" },
      { property: "og:description", content: "გეპატიჟებით — 8 ნოემბერი, 18:00, არმაზის ხეობა." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WEDDING = new Date("2026-11-08T18:00:00+04:00").getTime();

const schedule = [
  { time: "13:00", title: "ჯვრისწერა", place: "ილორის წმ. გიორგის სახელობის ეკლესია", map: "https://maps.app.goo.gl/NpFqZMV5gd69h2jp6?g_st=ic" },
  { time: "17:00", title: "ხელის მოწერა", place: "არმაზის ხეობა", map: "https://maps.app.goo.gl/bYzGqqmibnKE9bJBA?g_st=ic" },
  { time: "18:00", title: "სადილი", place: "არმაზის ხეობა", map: "https://maps.app.goo.gl/bYzGqqmibnKE9bJBA?g_st=ic" },
];

const locations = [
  {
    name: "ილორის წმ. გიორგის სახელობის ეკლესია",
    note: "ჯვრისწერა",
    map: "https://maps.app.goo.gl/NpFqZMV5gd69h2jp6?g_st=ic",
    photo: church.url as string | null,
  },
  {
    name: "არმაზის ხეობა",
    note: "ხელის მოწერა და სადილი",
    map: "https://maps.app.goo.gl/bYzGqqmibnKE9bJBA?g_st=ic",
    photo: garden.url as string | null,
  },
];

function Index() {
  const [open, setOpen] = useState(false);
  return open ? <Landing /> : <Intro onOpen={() => setOpen(true)} />;
}

function Intro({ onOpen }: { onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const tap = () => {
    if (playing) return onOpen(); // any touch during the clip skips it
    setPlaying(true);
    startMusic();
    const v = ref.current;
    if (!v) return onOpen();
    v.playbackRate = 1.8;
    v.play().catch(onOpen);
    // If the clip can't decode or autoplay is blocked, never trap the guest here.
    setTimeout(() => { if (v.readyState < 2 || v.currentTime === 0) onOpen(); }, 1500);
  };
  return (
    <div className="fixed inset-0 cursor-pointer bg-ivory" onClick={tap}>
      <video ref={ref} src={video.url} muted playsInline preload="auto" onEnded={onOpen} onError={onOpen} className="pointer-events-none h-full w-full object-cover" />
      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-[18vh]">
          <span className={`animate-pulse font-display text-xl not-italic ${plaque} h-14 w-60`} style={plaqueStyle}>
            გახსენი კონვერტი
          </span>
        </div>
      )}
    </div>
  );
}

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.max(0, WEDDING - (now ?? WEDDING));
  return [
    [Math.floor(d / 864e5), "დღე"],
    [Math.floor(d / 36e5) % 24, "საათი"],
    [Math.floor(d / 6e4) % 60, "წუთი"],
    [Math.floor(d / 1e3) % 60, "წამი"],
  ] as const;
}

const line = "w-full border-0 border-b border-graphite/30 bg-transparent px-1 py-2 text-center text-graphite outline-none placeholder:text-muted-foreground focus:border-graphite";

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(
      "main h2, main section > div > *, main section > p, main section > button, main li, main figure, main footer > *"
    ));
    els.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        const el = e.target as HTMLElement;
        el.style.transitionDelay = `${i * 160}ms`;
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Landing() {
  const cd = useCountdown();
  useReveal();
  return (
    <main className="min-h-screen animate-in fade-in duration-1000 bg-ivory text-foreground">
      <MusicButton />
      {/* Hero — arch lace background, lifted like a paper card */}
      <section className="relative mx-auto aspect-[2/3] w-full max-w-[640px] overflow-hidden bg-cover bg-center hero-card" style={{ backgroundImage: `url(${archBg.url})` }}>
        <div className="absolute inset-x-[15%] top-[14%] bottom-[5%] flex flex-col items-center text-center text-graphite">
          <p className="font-display text-base not-italic tracking-wide sm:text-lg">გეპატიჟებით</p>
          <h1 className="mt-[5%] font-display text-[2.6rem] leading-tight not-italic sm:text-7xl">
            ნინი<span className="mx-2 align-middle text-2xl sm:text-4xl">&</span>იოანე
          </h1>
          <p className="mt-[4%] font-display text-xl not-italic tracking-widest sm:text-3xl">8 | ნოემბერი | 2026</p>
          <p className="mt-1 text-sm tracking-[0.3em]">18:00</p>
          <div className="mt-auto flex w-full justify-center">
            <img src={kids.url} alt="ნინი და იოანე ბავშვობაში" className="sticker w-[84%] sm:w-[90%]" />
          </div>
        </div>
      </section>

      <div className="bg-repeat-y bg-[length:100%_auto] pb-16" style={{ backgroundImage: `url(${floralBg.url})` }}>
      {/* Countdown in ornament frame */}
      <section className="px-4 pt-14 text-center">
        <h2 className="font-display text-3xl not-italic text-graphite">ჩვენს დღემდე დარჩა</h2>
        <div className="relative mx-auto mt-6 aspect-[2134/728] max-w-[520px]">
          <img src={ornament.url} alt="" className="absolute inset-0 h-full w-full mix-blend-multiply" />
          <div className="absolute inset-0 grid grid-cols-4 items-center px-[12%]">
            {cd.map(([v, l], i) => (
              <div key={l} className={i ? "border-l border-graphite/20" : ""}>
                <div className="font-display text-3xl not-italic text-graphite tabular-nums sm:text-4xl">{String(v).padStart(2, "0")}</div>
                <div className="text-[10px] tracking-widest text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <CalendarButtons />
      </section>

      {/* Schedule — vertical timeline, no photo slots */}
      <section className="mx-auto max-w-3xl px-4 pt-16">
        <h2 className="text-center font-display text-3xl not-italic text-graphite">დღის განრიგი</h2>
        <ol className="relative mt-12 space-y-16">
          <span aria-hidden className="absolute bottom-0 left-5 top-0 w-px bg-ecru/60 md:left-1/2" />
          {schedule.map((s, i) => (
            <li key={s.time} className="relative pl-14 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
              <span aria-hidden className="lace-dot absolute left-5 top-1 -translate-x-1/2 md:left-1/2" />
              <div className={i % 2 ? "md:col-start-2" : "md:col-start-1 md:text-right"}>
                <p className="font-display text-4xl not-italic text-graphite">{s.time}</p>
                <p className="mt-1 font-display text-xl not-italic text-graphite">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.place}</p>
                {i < 2 && <div><MapLink href={s.map} /></div>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Locations />
      </div>

      <div className="bg-rsvp overflow-hidden">
        <Rsvp />
      </div>

      <div className="bg-repeat-y bg-[length:100%_auto] pb-16" style={{ backgroundImage: `url(${floralBg.url})` }}>
      <Wishes />

      <footer className="flex flex-col items-center pt-16 text-center">
        <img src={wax.url} alt="" className="w-20 drop-shadow-md" />
        <p className="mt-3 font-display text-2xl not-italic text-graphite">ნ & ი</p>
        <p className="mt-1 text-xs tracking-[0.3em] text-muted-foreground">08 · 11 · 2026</p>
      </footer>
      </div>
    </main>
  );
}

function Locations() {
  return (
    <section className="mx-auto max-w-3xl px-4 pt-16">
      <h2 className="text-center font-display text-3xl not-italic text-graphite">ლოკაციები</h2>
      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        {locations.map((l) => (
          <figure key={l.name} className="text-center">
            {l.photo ? (
              <img src={l.photo} alt={l.name} className="photo" />
            ) : (
              <div className="photo-slot">ფოტო მალე</div>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

const field = "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-graphite outline-none placeholder:text-muted-foreground focus:border-graphite/50";

function Rsvp() {
  const [sent, setSent] = useState(false);
  const [ans, setAns] = useState<"yes" | "no" | null>(null);
  return (
    <section className="mx-auto w-full max-w-[760px]">
      <div className="relative bg-[length:100%_100%] bg-center bg-no-repeat flex aspect-[1086/1448] flex-col justify-center px-[22%] py-[20%] text-center" style={{ backgroundImage: `url(${rsvpFrame.url})` }}>
        <h2 className="font-display text-2xl sm:text-3xl not-italic text-graphite">გთხოვთ გვაცნობოთ</h2>
        <p className="mt-2 text-sm text-muted-foreground">გთხოვთ, გვიპასუხოთ 25 ოქტომბრამდე</p>
        {sent ? (
          <p className="mt-8 font-display text-xl not-italic text-graphite">გმადლობთ! ♡</p>
        ) : (
          <form className="mx-auto mt-8 w-full max-w-xs space-y-5" onSubmit={(e) => { e.preventDefault(); if (ans) setSent(true); }}>
            <input required maxLength={100} placeholder="სახელი, გვარი" className={line} />
            <div className="flex flex-col gap-3 pt-1">
              {(["yes", "no"] as const).map((k) => (
                <button type="button" key={k} onClick={() => setAns(k)}
                  className={`w-full rounded-full border px-5 py-2.5 text-sm transition ${ans === k ? "border-graphite bg-graphite text-ivory" : "border-graphite/30 text-graphite hover:border-graphite/60"}`}>
                  {k === "yes" ? "სიამოვნებით მოვალ" : "ვერ მოვახერხებ"}
                </button>
              ))}
            </div>
            {ans === "yes" && <input type="number" min={1} max={10} placeholder="სტუმრების რაოდენობა" className={line} />}
            <div className="pt-2"><button disabled={!ans} className="w-full rounded-full bg-graphite px-5 py-3 font-display text-base not-italic tracking-wide text-ivory transition hover:opacity-90 disabled:opacity-40">გაგზავნა</button></div>
          </form>
        )}
      </div>
    </section>
  );
}

function Wishes() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <section className="mx-auto max-w-[460px] px-4 pt-16 text-center">
      <h2 className="font-display text-3xl not-italic text-graphite">სურვილების კონვერტი</h2>
      <p className="mt-2 text-sm text-muted-foreground">დააწკაპეთ კონვერტს და დაუტოვეთ წყვილს სურვილი</p>
      <button onClick={() => setOpen(true)} className="mx-auto mt-6 block w-[70%] transition hover:-translate-y-1">
        <img src={envelope.url} alt="სურვილების კონვერტი" className="w-full drop-shadow-xl" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/30 p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setOpen(false)}>
          <div className="flex aspect-[1086/1448] w-full max-w-md flex-col justify-center bg-rsvp bg-[length:100%_100%] bg-center bg-no-repeat px-[20%] py-[18%] text-center shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-500" style={{ backgroundImage: `url(${rsvpFrame.url})` }} onClick={(e) => e.stopPropagation()}>
            {sent ? (
              <>
                <p className="font-display text-2xl not-italic text-graphite">გმადლობთ! ♡</p>
                <button onClick={() => setOpen(false)} className={`mx-auto mt-6 ${plaque}`} style={plaqueStyle}>დახურვა</button>
              </>
            ) : (
              <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <p className="font-display text-2xl not-italic text-graphite">თქვენი სურვილი</p>
                <input required maxLength={100} placeholder="სახელი, გვარი" className={field} />
                <textarea required maxLength={1000} rows={4} placeholder="თქვენი სურვილი წყვილისთვის" className={field} />
                <button className={`mx-auto ${plaque}`} style={plaqueStyle}>გაგზავნა</button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
