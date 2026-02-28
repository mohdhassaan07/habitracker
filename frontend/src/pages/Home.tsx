import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, CheckCircle, Zap, Target,
  Flame, Menu, X, Star, ChevronDown, Sparkles,
  BarChart3, Clock,
} from 'lucide-react';

/* ── animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

/* ── component ──────────────────────────────────────────── */
function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentUser = useSelector((state: any) => state.user.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate('/journal');
  }, [currentUser]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── data ────────────────────────────────────────────── */
  const features = [
    {
      name: 'Progress Tracking',
      description:
        'Interactive graphs and visual indicators that make your growth tangible and rewarding.',
      icon: <BarChart3 className="h-6 w-6" />,
      accent: 'from-blue-500/20 to-sky-500/20',
      iconBg: 'bg-blue-500/10 text-blue-400',
      span: 'lg:col-span-2',
    },
    {
      name: 'Streak Analytics',
      description: 'Build momentum with detailed streak insights and performance trends.',
      icon: <Flame className="h-6 w-6" />,
      accent: 'from-indigo-500/20 to-blue-500/20',
      iconBg: 'bg-indigo-500/10 text-indigo-400',
      span: '',
    },
    {
      name: 'Goal Achievement',
      description:
        'Set milestones, track progress, and celebrate your wins along the way.',
      icon: <Target className="h-6 w-6" />,
      accent: 'from-emerald-500/20 to-teal-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      span: 'lg:col-span-2',
    },
    {
      name: 'Quick Capture',
      description: 'Log habits in seconds with streamlined one-tap tracking.',
      icon: <Zap className="h-6 w-6" />,
      accent: 'from-sky-400/20 to-blue-400/20',
      iconBg: 'bg-sky-400/10 text-sky-400',
      span: '',
    },
    {
      name: 'AI Insights',
      description:
        'Personalized recommendations powered by your habit data and behavioural science.',
      icon: <Sparkles className="h-6 w-6" />,
      accent: 'from-violet-500/20 to-fuchsia-500/20',
      iconBg: 'bg-violet-500/10 text-violet-400',
      span: '',
    },
    {
      name: 'Time Blocking',
      description:
        'Schedule habits into specific windows of your day for a rock-solid routine.',
      icon: <Clock className="h-6 w-6" />,
      accent: 'from-indigo-500/20 to-sky-500/20',
      iconBg: 'bg-indigo-500/10 text-indigo-400',
      span: 'lg:col-span-2',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Freelance Designer',
      image:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote:
        "Habitron transformed my morning routine. I've been consistent with meditation for over 6 months now — the longest streak I've ever maintained!",
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      image:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote:
        'The analytics are incredible. Seeing my progress visually keeps me motivated to stick with my exercise routine.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      image:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote:
        "I've tried many habit trackers, but Habitron's clean interface and smart reminders make it the only one I've stuck with.",
      rating: 5,
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '0',
      description: 'Perfect for getting started',
      features: [
        'Track up to 3 habits',
        'Basic statistics',
        'Daily reminders',
        '7-day history',
        'Mobile access',
      ],
      cta: 'Get Started',
      highlight: false,
    },
    {
      name: 'Premium',
      price: '9.99',
      description: 'For serious habit builders',
      features: [
        'Unlimited habits',
        'Advanced analytics',
        'Smart reminders',
        'Unlimited history',
        'Cloud backup',
        'CSV export',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      highlight: true,
    },
    {
      name: 'Family',
      price: '19.99',
      description: 'For households building together',
      features: [
        'Everything in Premium',
        'Up to 5 users',
        'Shared challenges',
        'Group analytics',
        'Family dashboard',
      ],
      cta: 'Start Free Trial',
      highlight: false,
    },
  ];

  const faqs = [
    {
      question: 'How is Habitron different from other habit trackers?',
      answer:
        'Habitron combines powerful tracking with behavioural science. Smart reminders, detailed analytics, and achievement systems keep you consistent for the long term.',
    },
    {
      question: 'Can I use Habitron on all my devices?',
      answer:
        'Yes! Habitron works on iOS, Android, and web. Your data syncs automatically across every device.',
    },
    {
      question: 'Is there a limit to how many habits I can track?',
      answer:
        'The free plan supports up to 3 habits. Upgrade to Premium for unlimited tracking.',
    },
    {
      question: 'Do you offer a free trial?',
      answer:
        'Yes — a 14-day free trial of Premium with full access to every feature.',
    },
  ];

  /* ── render ──────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 font-body overflow-x-hidden">
      {/* ░░ grain overlay ░░ */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.018] dark:opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ░░ navbar ░░ */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed w-full z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800/50 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <span className="font-display text-xl font-bold tracking-tight text-stone-900 dark:text-white">
            Habitron
          </span>

          {/* desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {['Features', 'Testimonials', 'Pricing', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-stone-500 dark:text-stone-400 transition-colors hover:text-stone-900 dark:hover:text-white"
              >
                {item}
              </a>
            ))}
            <Link
              to="/signin"
              className="rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white dark:text-stone-950 transition-all hover:bg-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Get Started
            </Link>
          </div>

          {/* mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-black/80 backdrop-blur-xl md:hidden"
            >
              <div className="space-y-4 px-6 py-6">
                {['Features', 'Testimonials', 'Pricing', 'FAQ'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-lg text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                  >
                    {item}
                  </a>
                ))}
                <Link
                  to="/signin"
                  className="block rounded-full bg-blue-500 py-3 text-center font-medium text-white dark:text-stone-950"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ░░ hero ░░ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* ambient glow */}
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/[0.08] dark:bg-blue-500/[0.07] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-amber-300/[0.06] dark:bg-amber-500/[0.04] blur-[100px]" />
        <div className="absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-blue-300/[0.06] dark:bg-blue-600/[0.04] blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            {/* badge */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              <Sparkles className="h-4 w-4" />
              Now with AI-powered insights
            </motion.div>

            {/* heading */}
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-stone-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Build habits
              <br />
              <span className="text-blue-500">that actually</span>
              <br />
              stick.
            </motion.h1>

            {/* subtitle */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-stone-500 dark:text-stone-400 md:text-xl"
            >
              Simple daily tracking, insightful analytics, and gentle reminders
              that help you become who you want to be.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/signin"
                className="group flex items-center gap-2 rounded-full bg-blue-500 px-8 py-4 text-lg font-semibold text-white dark:text-stone-950 transition-all duration-300 hover:bg-blue-400 hover:shadow-xl hover:shadow-blue-500/25"
              >
                Start for free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 rounded-full border border-stone-300 dark:border-stone-800 px-8 py-4 font-medium text-stone-600 dark:text-stone-400 transition-all duration-300 hover:border-stone-400 dark:hover:border-stone-600 hover:text-stone-900 dark:hover:text-white"
              >
                See how it works
              </a>
            </motion.div>

            {/* trust badges */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-stone-400 dark:text-stone-500"
            >
              {[
                'Free forever plan',
                'No credit card required',
                'Setup in 2 minutes',
              ].map((text, i) => (
                <span key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 dark:from-stone-950 to-transparent" />
      </section>

      {/* ░░ social proof strip ░░ */}
      

      {/* ░░ features — bento grid ░░ */}
      <section id="features" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
              Features
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 dark:text-white md:text-5xl">
              Everything you need to
              <br />
              <span className="text-stone-400 dark:text-stone-500">build lasting habits</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className={`group relative rounded-2xl border border-stone-200 dark:border-stone-800/50 bg-white/60 dark:bg-stone-900/50 p-6 transition-all duration-500 hover:border-stone-300 dark:hover:border-stone-700/80 hover:bg-white dark:hover:bg-stone-900/80 ${f.span}`}
              >
                {/* hover glow */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative z-10">
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.iconBg}`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-stone-900 dark:text-white">
                    {f.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░ testimonials ░░ */}
      <section id="testimonials" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.03] dark:via-blue-500/[0.02] to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
              Testimonials
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 dark:text-white md:text-5xl">
              Loved by thousands
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="rounded-2xl border border-stone-200 dark:border-stone-800/50 bg-white/60 dark:bg-stone-900/50 p-8 transition-all duration-300 hover:border-stone-300 dark:hover:border-stone-700/60"
              >
                {/* stars */}
                <div className="mb-6 flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${
                        j < t.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300 dark:text-stone-700'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-stone-200 dark:ring-stone-800"
                  />
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-stone-400 dark:text-stone-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░ pricing ░░ */}
      <section id="pricing" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
              Pricing
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 dark:text-white md:text-5xl">
              Simple, honest pricing
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-stone-500 dark:text-stone-400">
              Start free. Upgrade when you&rsquo;re ready. All plans include a
              14-day trial.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlight
                    ? 'border-2 border-blue-500/40 bg-gradient-to-b from-blue-500/10 to-white dark:to-stone-900/80 shadow-xl shadow-blue-500/5'
                    : 'border border-stone-200 dark:border-stone-800/50 bg-white/60 dark:bg-stone-900/50 hover:border-stone-300 dark:hover:border-stone-700/60'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white dark:text-stone-950">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="font-display text-xl font-bold text-stone-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-stone-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-stone-400 dark:text-stone-500">/month</span>
                </div>

                <hr className="my-6 border-stone-200 dark:border-stone-800" />

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signin"
                  className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-blue-500 text-white dark:text-stone-950 hover:bg-blue-400 hover:shadow-lg hover:shadow-blue-500/25'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-white hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░ FAQ accordion ░░ */}
      <section id="faq" className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
              FAQ
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 dark:text-white md:text-5xl">
              Common questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800/50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-stone-100/50 dark:hover:bg-stone-900/50"
                >
                  <span className="pr-4 font-medium text-stone-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-stone-400 dark:text-stone-500 transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ░░ final CTA ░░ */}
      <section className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/[0.04] to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-white md:text-5xl">
            Ready to transform
            <br />
            your daily routine?
          </h2>
          <p className="mt-6 text-lg text-stone-500 dark:text-stone-400">
            Join 50,000+ people building better habits with Habitron.
          </p>
          <Link
            to="/signin"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-blue-500 px-10 py-4 text-lg font-semibold text-white dark:text-stone-950 transition-all duration-300 hover:bg-blue-400 hover:shadow-xl hover:shadow-blue-500/25"
          >
            Get started — it&rsquo;s free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

      {/* ░░ footer ░░ */}
      <footer className="border-t border-stone-200 dark:border-stone-800/50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <span className="font-display text-lg font-bold text-stone-900 dark:text-white">
              Habitron
            </span>
            <div className="flex flex-wrap items-center gap-6 text-sm text-stone-400 dark:text-stone-500">
              <a href="#features" className="transition-colors hover:text-stone-900 dark:hover:text-white">
                Features
              </a>
              <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">
                Pricing
              </a>
              <a href="#faq" className="transition-colors hover:text-stone-900 dark:hover:text-white">
                FAQ
              </a>
              <a href="#" className="transition-colors hover:text-stone-900 dark:hover:text-white">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-stone-900 dark:hover:text-white">
                Terms
              </a>
            </div>
            <p className="text-sm text-stone-400 dark:text-stone-600">
              &copy; {new Date().getFullYear()} Habitron
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;