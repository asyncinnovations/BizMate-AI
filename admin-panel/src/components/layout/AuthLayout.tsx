import { cn } from "@/lib/cn";

const ORBIT_RINGS = [
  { size: 300, duration: 52, reverse: true },
  { size: 244, duration: 38, reverse: false },
  { size: 188, duration: 30, reverse: true },
  { size: 132, duration: 22, reverse: false },
] as const;

function OrbitGraphic() {
  return (
    <div
      className="relative mx-auto h-[min(340px,38vh)] w-full max-w-[360px]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {ORBIT_RINGS.map((ring, i) => (
          <div
            key={ring.size}
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-[#1a6fff]/22"
            style={{
              width: ring.size,
              height: ring.size,
              marginLeft: -(ring.size / 2),
              marginTop: -(ring.size / 2),
              animation: `${ring.reverse ? "orbit-spin-reverse" : "orbit-spin"} ${ring.duration}s linear infinite`,
            }}
          >
            <span
              className={cn(
                "absolute left-1/2 top-0 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                i % 2 === 0
                  ? "bg-[#1a6fff] shadow-[0_0_14px_rgba(26,111,255,0.95)]"
                  : "bg-[#22d4ee] shadow-[0_0_12px_rgba(34,212,238,0.9)]"
              )}
            />
          </div>
        ))}

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[5.5rem] w-[5.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a6fff]/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f0f6ff] shadow-[0_0_22px_8px_rgba(26,111,255,0.95)]" />
      </div>
    </div>
  );
}

const FEATURE_PILLS = [
  "Workflow Automation",
  "Compliance Engine",
  "AI Advisory",
] as const;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-[var(--text-primary)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)]">
        <aside className="relative hidden min-h-screen flex-col bg-[#060b16] lg:flex">
          <div className="absolute inset-0 bg-dot-grid opacity-[0.38]" />
          <div className="pointer-events-none absolute left-[6%] top-[18%] h-[420px] w-[420px] rounded-full bg-[rgba(26,111,255,0.07)] blur-[110px]" />
          <div className="pointer-events-none absolute bottom-[8%] right-[5%] h-[320px] w-[320px] rounded-full bg-[rgba(0,200,232,0.06)] blur-[100px]" />

          <div className="relative z-10 flex min-h-0 flex-1 flex-col px-10 pb-12 pt-10 xl:px-14">
            <div className="flex shrink-0 items-center gap-3">
              <div className="grid h-10 w-10 grid-cols-2 gap-1 rounded-xl bg-[#1a6fff] p-2">
                <span className="rounded-[3px] bg-white/95" />
                <span className="rounded-[3px] bg-white/65" />
                <span className="rounded-[3px] bg-white/65" />
                <span className="rounded-[3px] bg-white/95" />
              </div>
              <span className="font-display text-xl font-bold tracking-[0.2em] text-white">
                BIZMATE
              </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col justify-center py-10">
              <OrbitGraphic />
            </div>

            <div className="mt-auto shrink-0 space-y-5">
              <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-[2.75rem]">
                Intelligent Business
                <br />
                <span className="text-[#4da3ff]">at Scale.</span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-[#8aa4c4]">
                One operating system for workflow automation, compliance management,
                and AI-powered advisory.
              </p>
              <div className="flex flex-wrap gap-3">
                {FEATURE_PILLS.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-[#1a6fff]/35 bg-[#050a14]/80 px-4 py-2 text-sm text-[#c6d9ff] backdrop-blur-sm"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1a6fff] shadow-[0_0_8px_#1a6fff]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="relative flex min-h-screen items-center justify-center bg-black px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="relative w-full max-w-[400px]">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="grid h-9 w-9 grid-cols-2 gap-1 rounded-xl bg-[#1a6fff] p-2">
                <span className="rounded-[3px] bg-white/95" />
                <span className="rounded-[3px] bg-white/65" />
                <span className="rounded-[3px] bg-white/65" />
                <span className="rounded-[3px] bg-white/95" />
              </div>
              <span className="font-display text-lg font-bold tracking-[0.18em] text-white">
                BIZMATE
              </span>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
