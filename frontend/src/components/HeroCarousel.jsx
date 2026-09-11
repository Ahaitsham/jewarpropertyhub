function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const previousSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  return (
    <section
      className="container-page py-8 sm:py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[320px] overflow-hidden rounded-2xl sm:h-[420px] lg:h-[500px]">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current
                ? 'scale-100 opacity-100'
                : 'scale-105 opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-6 text-white sm:px-10 lg:px-14">
                <p className="mb-2 text-sm font-medium uppercase tracking-wider text-white/80">
                  Jewar Property Hub
                </p>

                <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
                  {slide.description}
                </p>

                <Link
                  to="/properties"
                  className="mt-6 inline-flex rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-stone-100"
                >
                  Explore Properties
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Previous button */}
        <button
          onClick={previousSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:left-5 sm:h-10 sm:w-10"
        >
          ‹
        </button>

        {/* Next button */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:right-5 sm:h-10 sm:w-10"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.image}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? 'w-7 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel