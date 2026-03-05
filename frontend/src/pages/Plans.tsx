import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Plans = ()=> {
    const currentUser = useSelector((state: any) => state.user.currentUser);
    const plans = [
    {
      name: 'Starter',
      price: '0',
      priceId : 'N/A',
      link : '/signin',
      description: 'Perfect for getting started',
      features: [
        'Track up to 3 habits',
        'Basic statistics',
        '7-day history',
      ],
      cta: 'Get Started',
      highlight: false,
    },
    {
      name: 'Premium',
      price: '9.99',
      priceId : 'price_1T6rduJWghtPYWYOdFOrnPpt',
      link : 'https://buy.stripe.com/test_fZu3cw5CGh2Pg6X8HV9IQ00',
      description: 'For serious habit builders',
      features: [
        'Unlimited habits',
        'Advanced analytics',
        'Smart reminders',
        'Unlimited history',
        'Cloud backup',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      highlight: true,
    },
    {
      name: 'Family',
      price: '19.99',
      priceId : 'price_1T6rebJWghtPYWYOEImMjSmk',
      link : 'https://buy.stripe.com/test_aFaaEYaX0aEr9IzbU79IQ01',
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

  return (
        <div className="mx-auto md:h-screen p-2 lg:py-5 lg:px-6 dark:bg-stone-950">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
              Pricing
            </span>
            <h2 className=" font-display text-3xl font-bold text-stone-900 dark:text-white md:text-5xl">
              Simple, honest pricing
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-stone-500 dark:text-stone-400">
              Start free. Upgrade when you&rsquo;re ready. All plans include a
              14-day trial.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:mx-20">
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

                <hr className="my-4 border-stone-200 dark:border-stone-800" />

                <ul className="space-y-2">
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
                  to={`${plan.link}?prefilled_email=${currentUser?.email || ''}`}
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
  )
}

export default Plans;