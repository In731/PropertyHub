import { SearchBar } from '../components/SearchBar';
import { PropertyCard } from '../components/PropertyCard';
import { useProperties } from '../context/PropertiesContext';
import { Building2, Home as HomeIcon, Key, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function Home() {
  const navigate = useNavigate();
  const { properties } = useProperties();
  const featuredProperties = properties.slice(0, 6);
  const [counters, setCounters] = useState({ properties: 0, customers: 0, cities: 0, agents: 0 });

  // Animated counter effect
  useEffect(() => {
    const targets = { properties: 1000, customers: 500, cities: 50, agents: 100 };
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounters({
        properties: Math.floor(targets.properties * progress),
        customers: Math.floor(targets.customers * progress),
        cities: Math.floor(targets.cities * progress),
        agents: Math.floor(targets.agents * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/4 right-20 w-32 h-32 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find Your Dream Home
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover the perfect property from thousands of listings across India
            </motion.p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <SearchBar />
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center" variants={itemVariants}>
              <div className="text-3xl md:text-4xl font-bold mb-2">{counters.properties}+</div>
              <div className="text-blue-100">Properties</div>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="text-3xl md:text-4xl font-bold mb-2">{counters.customers}+</div>
              <div className="text-blue-100">Happy Customers</div>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="text-3xl md:text-4xl font-bold mb-2">{counters.cities}+</div>
              <div className="text-blue-100">Cities</div>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="text-3xl md:text-4xl font-bold mb-2">{counters.agents}+</div>
              <div className="text-blue-100">Agents</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Browse by Category
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/properties?propertyType=apartment')}
            >
              <motion.div variants={floatingVariants} animate="animate">
                <Building2 className="w-12 h-12 text-blue-600 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Apartments</h3>
              <p className="text-gray-600">Find modern apartments in prime locations</p>
            </motion.div>
            <motion.div
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/properties?propertyType=house')}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.2,
                  },
                }}
              >
                <HomeIcon className="w-12 h-12 text-blue-600 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Houses</h3>
              <p className="text-gray-600">Spacious houses for your family</p>
            </motion.div>
            <motion.div
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/properties?propertyType=villa')}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.4,
                  },
                }}
              >
                <Key className="w-12 h-12 text-blue-600 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Villas</h3>
              <p className="text-gray-600">Luxury villas with premium amenities</p>
            </motion.div>
            <motion.div
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/properties?status=for-sale')}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.6,
                  },
                }}
              >
                <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Investment</h3>
              <p className="text-gray-600">Great opportunities for investors</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex justify-between items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <a href="/properties" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </a>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Find Your Dream Property?
          </motion.h2>
          <motion.p
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of satisfied customers who found their perfect home with us
          </motion.p>
          <motion.button
            onClick={() => navigate('/properties')}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
        </div>
      </section>
    </div>
  );
}