import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Info */}
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 block">Get in Touch</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 mb-8">
            We'd love to <br /> <span className="text-gray-400 italic">hear from you</span>
          </h1>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed">
            Whether you have a question about our products, shipping, or anything else, our team is ready to answer all your questions.
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-gray-50 rounded-2xl text-black">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                <p className="text-gray-500">support@luxecart.com</p>
                <p className="text-gray-500">hello@luxecart.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-gray-50 rounded-2xl text-black">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Call Us</h4>
                <p className="text-gray-500">+1 (555) 123-4567</p>
                <p className="text-gray-500">Mon-Fri, 9am-6pm EST</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-gray-50 rounded-2xl text-black">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Visit Us</h4>
                <p className="text-gray-500">123 Design District</p>
                <p className="text-gray-500">New York, NY 10013</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-[3rem] p-12 md:p-16"
        >
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">First Name</label>
                <Input 
                  type="text" 
                  className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus-visible:ring-black h-auto"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Last Name</label>
                <Input 
                  type="text" 
                  className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus-visible:ring-black h-auto"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Email Address</label>
              <Input 
                type="email" 
                className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus-visible:ring-black h-auto"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Message</label>
              <Textarea 
                rows={5}
                className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus-visible:ring-black resize-none h-auto"
              />
            </div>

            <Button className="w-full py-7 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3">
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
