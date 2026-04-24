import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.pinimg.com/736x/3e/d8/cd/3ed8cdc7b3bf477f94ee399ea28547c8.jpg" 
            alt="LuxeCart Vision" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-white dark:to-black" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-black dark:text-white mb-6 uppercase"
          >
            OUR <span className="text-gray-400 font-light">STORY</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            Redefining the digital shopping experience through minimalist design and premium craftsmanship.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Crafting Excellence</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Founded in 2024, LuxeCart emerged from a simple vision: to create a marketplace where quality meets simplicity. We believe that every product tells a story, and every purchase should be an experience.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our team of curators travels the world to find unique pieces that embody our values of sustainability, durability, and timeless design.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://i.pinimg.com/1200x/a8/ea/13/a8ea1364ebbba07aff1d8aa32b144ba0.jpg" 
              alt="Quality Materials" 
              className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 dark:bg-neutral-900/50 py-24 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-4">Our Core Values</h2>
            <div className="w-12 h-1 bg-black dark:bg-white mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: <Shield size={32} />, title: "Quality", desc: "Uncompromising standards in every detail." },
              { icon: <Zap size={32} />, title: "Innovation", desc: "Pushing boundaries in digital commerce." },
              { icon: <Globe size={32} />, title: "Sustainability", desc: "Caring for our planet and people." },
              { icon: <Heart size={32} />, title: "Passion", desc: "Driven by the love for great design." }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-[2rem] border border-gray-100 dark:border-neutral-800 text-center hover:shadow-xl transition-all duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 dark:bg-neutral-800 text-black dark:text-white mb-6 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-500">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{value.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section Placeholder */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-12">Join Our Journey</h2>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 mb-10">
          We are always looking for passionate individuals to join our growing team. If you share our vision for the future of retail, we&apos;d love to hear from you.
        </p>
        <button className="px-10 py-4 bg-black text-white dark:bg-white dark:text-black font-bold rounded-full hover:scale-105 transition-transform duration-300">
          View Careers
        </button>
      </section>
    </div>
  );
};

export default About;
