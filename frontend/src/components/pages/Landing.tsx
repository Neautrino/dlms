'use client'

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Shield,
  Wallet,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stats = [
  { value: '20K+', label: 'Active Users' },
  { value: '$50M+', label: 'Total Earnings' },
  { value: '99%', label: 'Success Rate' },
  { value: '150+', label: 'Countries' },
];

const features = [
  {
    icon: <Wallet className="w-6 h-6" />,
    title: 'Secure Payments',
    description: 'Instant and secure payments with built-in escrow protection',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Verified Skills',
    description: 'NFT-based skill verification and reputation system',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Quality Assurance',
    description: 'Rigorous vetting process for all platform participants',
  },
];

const testimonials = [
  {
    quote: "DLabor has transformed how we hire and manage our global workforce. The platform's security and ease of use are unmatched.",
    author: "Sarah Chen",
    role: "CTO at TechFlow",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&h=250&auto=format&fit=crop",
  },
  {
    quote: "As a freelancer, DLabor has opened up countless opportunities. The blockchain-based payment system ensures I get paid on time, every time.",
    author: "Michael Rodriguez",
    role: "Senior Developer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&h=250&auto=format&fit=crop",
  },
  {
    quote: "The verification system gives us confidence in hiring. It's revolutionized how we build our remote teams.",
    author: "Emily Watson",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&h=250&auto=format&fit=crop",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Theme Toggle - Positioned in top-right */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-background to-secondary/20">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] [mask-image:radial-gradient(white,transparent_90%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <Badge variant="secondary">New</Badge>
                <span className="text-sm font-medium">Web3-powered workforce platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Empowering Labor Through{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Decentralization
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                Join thousands of professionals in the future of work. Secure payments, 
                verified credentials, and endless opportunities await.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full group" asChild>
                  <Link href="/home">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full" asChild>
                  <Link href="#Qfeatures" >Learn More</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop"
                  alt="Platform preview"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 rounded-2xl transform translate-x-4 translate-y-4 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30" id="features">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            {...fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose DLabor?
            </h2>
            <p className="text-muted-foreground text-lg">
              Experience the future of work with our innovative platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-background rounded-xl p-8 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            {...fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-muted-foreground text-lg">
              See what our users have to say about their experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-xl p-8 shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Work Experience?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/80">
              Join thousands of professionals already using DLabor to advance their careers
              and businesses.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full"
              asChild
            >
              <Link href="/home">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}