import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Search } from 'lucide-react';

const SLIDE_DURATION = 5000; // 5 seconds

const slides = [
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80",
    title: "ESSENCE",
    subtitle: "REDEFINED",
    description: "Experience the intersection of cinematic design and premium craftsmanship.",
    label: "A New Era of Luxury"
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80",
    title: "TIMELESS",
    subtitle: "ELEGANCE",
    description: "Curated collections for those who appreciate the finer details of life.",
    label: "Spring Collection 2026"
  },
  {
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1920&q=80",
    title: "MODERN",
    subtitle: "MINIMALISM",
    description: "Discover the beauty of simplicity through our latest arrivals.",
    label: "Limited Edition"
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1920&q=80",
    title: "URBAN",
    subtitle: "SOPHISTICATION",
    description: "Bold designs that make a statement in every environment.",
    label: "Exclusive Access"
  }
];

const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right to left
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '20%' : '-20%',
      opacity: 0,
      scale: 1.1,
      filter: 'blur(10px)',
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        x: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 1.2, ease: "easeInOut" },
        scale: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 1.2 }
      }
    } as const,
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '20%' : '-20%',
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)',
      transition: {
        x: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 1.2, ease: "easeInOut" },
        filter: { duration: 1.2 }
      }
    } as const)
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();

    if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      return;
    }

    navigate('/shop');
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-black">
      <AnimatePresence initial={true} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image Container with Ken Burns */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <motion.div
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                scale: { duration: SLIDE_DURATION / 1000, ease: "linear" },
                opacity: { duration: 1.5, ease: "easeOut" }
              }}
              className="w-full h-full"
            >
              <img
                src={slides[currentIndex].image}
                alt={slides[currentIndex].title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <motion.span
                initial={{ opacity: 0, y: 20, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.3em" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xs font-bold uppercase text-gray-400 mb-4 block"
              >
                {slides[currentIndex].label}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9] mb-8"
              >
                {slides[currentIndex].title} <br />
                <span className="text-gray-300 italic font-light">{slides[currentIndex].subtitle}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-sm sm:text-base md:text-lg text-gray-400 mb-10 max-w-xl mx-auto font-light leading-relaxed"
              >
                {slides[currentIndex].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Link
                  to="/shop"
                  className="group relative px-8 py-4 bg-white text-black text-sm font-bold rounded-full overflow-hidden transition-all duration-500 hover:pr-12"
                >
                  <span className="relative z-10">Explore Collection</span>
                  <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500" size={18} />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 border border-white/20 text-white text-sm font-bold rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Our Story
                </Link>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.25 }}
                onSubmit={handleHeroSearch}
                className="mt-6 flex w-full max-w-xl mx-auto"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, styles, collections..."
                    className="w-full h-12 pl-11 pr-3 rounded-l-full border border-white/20 bg-black/35 text-white placeholder:text-gray-400 focus:outline-none focus:border-white/40"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 px-6 rounded-r-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                  Search
                </button>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1 transition-all duration-500 rounded-full ${currentIndex === index ? 'w-12 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 right-10 z-20 hidden lg:flex flex-col items-center"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4 [writing-mode:vertical-rl]">Scroll to discover</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSlider;
