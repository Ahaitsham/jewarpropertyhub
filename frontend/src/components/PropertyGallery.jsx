import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function PropertyGallery({ media = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (!media.length) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-md bg-stone-100 text-stone-400">
        No media available
      </div>
    );
  }

  const active = media[activeIndex];

  function go(delta) {
    setActiveIndex((i) => (i + delta + media.length) % media.length);
  }

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-stone-100">
        {active.type === 'VIDEO' ? (
          <video src={active.url} controls className="h-full w-full object-cover" />
        ) : (
          <img
            src={active.url}
            alt="Property"
            className="h-full w-full cursor-zoom-in object-cover"
            onClick={() => setFullscreen(true)}
          />
        )}

        {media.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveIndex(i)}
              className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded border-2 ${
                i === activeIndex ? 'border-brand-600' : 'border-transparent'
              }`}
            >
              {m.type === 'VIDEO' ? (
                <div className="flex h-full w-full items-center justify-center bg-stone-800 text-[10px] text-white">
                  Video
                </div>
              ) : (
                <img src={m.url} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {fullscreen && active.type === 'IMAGE' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setFullscreen(false)}
        >
          <button className="absolute right-4 top-4 text-white" aria-label="Close">
            <X size={28} />
          </button>
          <img src={active.url} alt="Property" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
