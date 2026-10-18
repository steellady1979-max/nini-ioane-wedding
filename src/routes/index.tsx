import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import video from "@/assets/envelope.mp4.asset.json";
import frame from "@/assets/lace-frame.png.asset.json";
import kids from "@/assets/kids-sticker.png.asset.json";

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

function Index() {
  const [open, setOpen] = useState(false);
  return open ? <Landing /> : <Intro onOpen={() => setOpen(true)} />;
}

function Intro({ onOpen }: { onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const start = () => {
    setPlaying(true);
    ref.current?.play().catch(onOpen);
  };
  return (
    <div className="fixed inset-0 bg-ivory">
      <video ref={ref} src={video.url} muted playsInline preload="auto" onEnded={onOpen} className="h-full w-full object-cover" />
      {!playing && (
        <button onClick={start} className="absolute inset-0 flex flex-col items-center justify-end pb-[18vh]">
          <span className="animate-pulse rounded-full border border-cocoa/40 bg-background/70 px-8 py-3 font-display text-2xl text-cocoa backdrop-blur-sm not-italic">
            გახსენი კონვერტი
          </span>
        </button>
      )}
      {playing && (
        <button onClick={onOpen} className="absolute bottom-6 right-6 text-sm text-cocoa/70">გამოტოვება →</button>
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

function Landing() {
  const cd = useCountdown();
  return (
    <main className="min-h-screen animate-in fade-in duration-1000 bg-background text-foreground">
      <section className="relative mx-auto aspect-[2/3] max-h-screen w-full max-w-[640px]">
        <img src={frame.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-between px-[16%] py-[14%] text-center text-cocoa">
          <p className="font-display text-xl not-italic tracking-wide">გეპატიჟებით</p>
          <img src={kids.url} alt="ნინი და იოანე ბავშვობაში" className="sticker w-[88%] -rotate-2" />
          <div>
            <h1 className="font-display text-4xl not-italic sm:text-5xl">ნინი & იოანე</h1>
            <p className="mt-3 font-display text-lg not-italic">8 ნოემბერი · 18:00</p>
          </div>
        </div>
      </section>

      <div className="lace-edge" />

      <section className="bg-blush/40 px-6 py-16 text-center">
        <h2 className="font-display text-3xl not-italic text-cocoa">დარჩა</h2>
        <div className="mx-auto mt-8 grid max-w-md grid-cols-4 gap-3">
          {cd.map(([v, l]) => (
            <div key={l} className="rounded-t-full border border-border bg-background/80 px-2 pb-3 pt-6">
              <div className="font-display text-3xl not-italic text-cocoa tabular-nums">{String(v).padStart(2, "0")}</div>
              <div className="mt-1 text-xs text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-xl px-6 py-20">
        <h2 className="text-center font-display text-3xl not-italic text-cocoa">დღის განრიგი</h2>
        <ol className="relative mt-12 space-y-14 border-l border-border pl-8">
          {schedule.map((s) => (
            <li key={s.time} className="relative">
              <span className="absolute -left-[41px] top-1 h-4 w-4 rotate-45 border border-cocoa/50 bg-ivory" />
              <p className="font-display text-2xl not-italic text-cocoa">{s.time} — {s.title}</p>
              <p className="mt-1 text-muted-foreground">„{s.place}"</p>
              {/* photo slot — will be filled later */}
              <div className="mt-4 flex aspect-[4/3] items-center justify-center rounded-t-[999px] border border-dashed border-border bg-ivory text-sm text-muted-foreground">
                ფოტო მალე
              </div>
              <a href={s.map} target="_blank" rel="noreferrer" className="mt-4 inline-block border-b border-cocoa/40 text-cocoa">რუკაზე ნახვა →</a>
            </li>
          ))}
        </ol>
      </section>

      <div className="lace-edge rotate-180" />
      <footer className="bg-ivory py-12 text-center font-display text-2xl not-italic text-cocoa">ნ & ი</footer>
    </main>
  );
}
