/* global React */
const { useMemo } = React;

function Gallery({
  sets = [],
  activeSetKey,
  onShuffle,
  getRecordById,
  copyFn,
  fallbackImg,
}) {
  const activeSet = useMemo(() => {
    return sets.find((s) => s.key === activeSetKey) || sets[0] || null;
  }, [sets, activeSetKey]);

  const activeRecord = useMemo(() => {
    if (!activeSet || !getRecordById || !activeSet.recordId) return null;
    const record = getRecordById(activeSet.recordId);
    // Debug logging
    if (!record) {
      console.log(`Gallery: Could not find record for ID "${activeSet.recordId}"`);
      console.log(`Available record IDs:`, getRecordById.__allIds?.slice(0, 10));
    }
    return record;
  }, [activeSet, getRecordById]);

  if (!sets.length) {
    return (
      <div className="text-center text-zinc-400 p-6">
        No gallery sets configured.
      </div>
    );
  }

  // Filenames (match your requested mapping)
  const styles = [
    { key: "cinematic", label: "CINEMATIC" },
    { key: "silkscreen", label: "SILKSCREEN" },
    { key: "lithograph", label: "LITHOGRAPH" },
    { key: "watercolor", label: "WATERCOLOR" },
    { key: "cyanotype", label: "CYANOTYPE" },
    { key: "soft_analog", label: "SOFT ANALOG" },
    { key: "digital", label: "DIGITAL" },
    { key: "aged_print", label: "AGED PRINT" },
    { key: "halftone", label: "HALFTONE" },
    { key: "ink_wash", label: "INK WASH" },
    { key: "ink_splash", label: "INK SPLASH" },
    { key: "impasto_oil", label: "IMPASTO" },
    { key: "xerography", label: "PHOTOCOPY" },
    { key: "neon_noir", label: "NEON NOIR" },
    { key: "paper_cut", label: "PAPER CUT" },
    { key: "vector", label: "VECTOR" },
    { key: "glitch", label: "GLITCH" },
    { key: "mixed_media", label: "MIXED MEDIA" },
    { key: "street", label: "STREET" },
    { key: "risograph", label: "RISOGRAPH" },
  ];

  const tileH =
    (typeof window !== "undefined" && window.innerWidth < 640)
      ? (activeSet.tileHeight?.mobile || 180)
      : (activeSet.tileHeight?.desktop || 260);

  const imgStyle = {
    aspectRatio: activeSet.aspectRatio || "2 / 3",
    height: tileH,
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="text-xs text-zinc-300/75">
          {activeRecord ? (
            <>Now showing: <span className="text-zinc-100 font-semibold">{activeRecord.title}</span></>
          ) : (
            <>Now showing: <span className="text-zinc-100 font-semibold">Look not found</span></>
          )}
        </div>
        <button className="gp-btn-secondary" onClick={onShuffle}>
          Shuffle
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {styles.map((s) => {
          const srcPng = `${activeSet.folder}/${s.key}.png`;
          const srcJpg = `${activeSet.folder}/${s.key}.jpg`;
          return (
            <div key={s.key} className="group">
              <div
                className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-black"
                style={imgStyle}
              >
                <img
                  src={srcPng}
                  alt={s.label}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const img = e.currentTarget;
                    const tried = img.dataset.triedJpg === "1";
                    if (!tried) {
                      img.dataset.triedJpg = "1";
                      img.src = srcJpg;
                      return;
                    }
                    img.onerror = null;
                    img.src = fallbackImg;
                  }}
                />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-center text-zinc-300">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-zinc-800/70 bg-zinc-950/60 p-4">
        <div className="text-center">
          <div className="text-sm sm:text-base font-semibold">
            <span className="gp-logo">{activeRecord?.title || "Look not found"}</span>
          </div>
          <div className="mt-2 text-xs text-zinc-300/75">
            {activeRecord ? "Prompt sourced from your JSONL lookbook." : "This set's recordId did not resolve."}
          </div>
        </div>

        {activeRecord && (
          <pre className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3 overflow-auto">
            <code className="whitespace-pre-wrap text-[12px] leading-5 text-zinc-100">
              {activeRecord.prompt}
            </code>
          </pre>
        )}

        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          <button
            className="gp-btn-secondary"
            onClick={() => {
              if (!activeRecord) return;
              copyFn(`${activeRecord.title}\n\n${activeRecord.prompt}`);
            }}
            disabled={!activeRecord}
          >
            Copy Look Prompt
          </button>
        </div>
      </div>
    </div>
  );
}

window.GP_Gallery = Gallery;