import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
        {/* Info */}
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 block">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white mb-6 md:mb-8">
            We&apos;d love to <br /> <span className="text-gray-400 italic">hear from you</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 md:mb-12 leading-relaxed">
            Whether you have a question about our products, shipping, or anything else, our team is ready to answer all your questions.
          </p>

          <div className="space-y-6 md:space-y-8">
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-2xl text-black dark:text-white">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Email Us</h4>
                <p className="text-gray-500 dark:text-gray-400">support@luxecart.com</p>
                <p className="text-gray-500 dark:text-gray-400">hello@luxecart.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-2xl text-black dark:text-white">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Call Us</h4>
                <p className="text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
                <p className="text-gray-500 dark:text-gray-400">Mon-Fri, 9am-6pm EST</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-2xl text-black dark:text-white">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Visit Us</h4>
                <p className="text-gray-500 dark:text-gray-400">123 Design District</p>
                <p className="text-gray-500 dark:text-gray-400">New York, NY 10013</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-neutral-900 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16"
        >
          <form className="space-y-6 md:space-y-8" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 ml-1">First Name</label>
                <Input 
                  type="text" 
                  className="w-full px-6 py-4 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 ml-1">Last Name</label>
                <Input 
                  type="text" 
                  className="w-full px-6 py-4 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 ml-1">Email Address</label>
              <Input 
                type="email" 
                className="w-full px-6 py-4 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white h-auto dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 ml-1">Message</label>
              <Textarea 
                rows={5}
                className="w-full px-6 py-4 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-2xl focus-visible:ring-black dark:focus-visible:ring-white resize-none h-auto dark:text-white"
              />
            </div>

            <Button className="w-full py-6 md:py-7 bg-black text-white dark:bg-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center space-x-3 h-auto">
              <Send size={20} />
              <span>Send Message</span>
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
