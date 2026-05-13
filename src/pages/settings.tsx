import { useState } from "react";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings, Theme, Cursor } from "@/lib/settings-context";

const THEMES: { id: Theme; label: string; color: string; desc: string }[] = [
  { id: "matrix", label: "MATRIX", color: "#FF9900", desc: "Amber on black — the classic" },
  { id: "cyber",  label: "CYBER",  color: "#00FFFF", desc: "Cyan neon on deep blue" },
  { id: "blood",  label: "BLOOD",  color: "#FF2020", desc: "Red on dark — danger mode" },
  { id: "void",   label: "VOID",   color: "#AA44FF", desc: "Purple on dark — deep space" },
];

const CURSORS: { id: Cursor; label: string; desc: string }[] = [
  { id: "default",    label: "DEFAULT",    desc: "System default cursor" },
  { id: "crosshair",  label: "CROSSHAIR",  desc: "Targeting crosshair" },
  { id: "dot",        label: "DOT",        desc: "Amber dot cursor" },
  { id: "none",       label: "INVISIBLE",  desc: "Hidden cursor" },
];

const FAVICON_PRESETS = [
  { label: "Google",      url: "https://www.google.com/favicon.ico" },
  { label: "YouTube",     url: "https://www.youtube.com/favicon.ico" },
  { label: "Wikipedia",   url: "https://www.wikipedia.org/favicon.ico" },
  { label: "GitHub",      url: "https://github.com/favicon.ico" },
  { label: "Reddit",      url: "https://www.reddit.com/favicon.ico" },
  { label: "Discord",     url: "https://discord.com/favicon.ico" },
];

export default function Settings() {
  const { theme, setTheme, cursor, setCursor, tabCloaker, setTabCloaker } = useSettings();
  const [cloakTitle, setCloakTitle] = useState(tabCloaker.title);
  const [cloakFavicon, setCloakFavicon] = useState(tabCloaker.faviconUrl);
  const [saved, setSaved] = useState(false);

  const handleSaveCloaker = () => {
    setTabCloaker({ ...tabCloaker, title: cloakTitle, faviconUrl: cloakFavicon });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggleCloaker = () => {
    setTabCloaker({ ...tabCloaker, enabled: !tabCloaker.enabled });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold glow-text">&gt; SYSTEM_SETTINGS_</h1>
          <p className="text-primary/40 text-xs font-mono uppercase tracking-widest mt-1">Customise your experience</p>
        </div>

        <div className="space-y-8">
          <section className="border border-primary/20 p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/20 pb-2">
              &gt; THEME_
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4 border text-left transition-all ${
                    theme === t.id
                      ? "border-primary bg-primary/10"
                      : "border-primary/20 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: t.color }}>
                      {t.label}
                    </span>
                    {theme === t.id && <span className="ml-auto text-xs text-primary">[ACTIVE]</span>}
                  </div>
                  <p className="text-primary/40 text-xs font-mono">{t.desc}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="border border-primary/20 p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 border-b border-primary/20 pb-2">
              &gt; CURSOR_
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {CURSORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCursor(c.id)}
                  className={`p-4 border text-left transition-all ${
                    cursor === c.id
                      ? "border-primary bg-primary/10"
                      : "border-primary/20 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                      {c.label}
                    </span>
                    {cursor === c.id && <span className="text-xs text-primary">[ACTIVE]</span>}
                  </div>
                  <p className="text-primary/40 text-xs font-mono">{c.desc}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="border border-primary/20 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-primary/20 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                &gt; TAB_CLOAKER_
              </h2>
              <button
                onClick={handleToggleCloaker}
                className={`px-3 py-1 text-xs font-mono uppercase border transition-all ${
                  tabCloaker.enabled
                    ? "border-primary bg-primary text-black font-bold"
                    : "border-primary/30 text-primary/60 hover:border-primary/60"
                }`}
              >
                {tabCloaker.enabled ? "ON" : "OFF"}
              </button>
            </div>
            <p className="text-primary/40 text-xs font-mono mb-4">
              Disguise this tab — changes what appears in the browser title bar and favicon.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-primary/70 uppercase text-xs tracking-widest font-mono block mb-1">Tab Title</label>
                <Input
                  value={cloakTitle}
                  onChange={(e) => setCloakTitle(e.target.value)}
                  placeholder="e.g. Google"
                  className="bg-background border-primary/30 focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="text-primary/70 uppercase text-xs tracking-widest font-mono block mb-2">Favicon URL</label>
                <Input
                  value={cloakFavicon}
                  onChange={(e) => setCloakFavicon(e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                  className="bg-background border-primary/30 focus:border-primary font-mono"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {FAVICON_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => { setCloakFavicon(p.url); setCloakTitle((prev) => prev || p.label); }}
                      className="flex items-center gap-1.5 px-2 py-1 border border-primary/20 hover:border-primary/50 text-xs font-mono text-primary/60 hover:text-primary transition-all"
                    >
                      <img src={p.url} alt="" className="w-3 h-3" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveCloaker}
                className="bg-primary text-black font-bold uppercase tracking-wider hover:bg-primary/90"
              >
                {saved ? "SAVED!" : "APPLY_CLOAKER"}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
