import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Bell, Zap, PieChart, Clock, Target, LineChart, Flame, Menu, X, Facebook, Twitter, Instagram, Linkedin, Github, Star } from 'lucide-react';
import {  useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SigninForm from '@/components/SigninForm';
function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const currentUser = useSelector((state: any) => state.user.currentUser);
    const navigate = useNavigate();
    useEffect(() => {
        if (currentUser) {
            navigate('/journal');
        }
    }, [currentUser]);
    

    useEffect(() => {   
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Features data
    const mainFeatures = [
        {
            name: 'Progress Tracking',
            description: 'Track your habits with interactive graphs and visual progress indicators.',
            icon: <LineChart className="h-6 w-6 text-blue-600" />,
            stats: { value: '87%', label: 'Success Rate' },
            graph: { type: 'line', data: [40, 65, 55, 80, 70, 90, 85] },
        },
        {
            name: 'Streak Analytics',
            description: 'Build and maintain streaks with detailed performance insights.',
            icon: <Flame className="h-6 w-6 text-blue-600" />,
            stats: { value: '21', label: 'Day Streak' },
            graph: { type: 'bar', data: [5, 8, 12, 15, 18, 21] },
        },
        {
            name: 'Goal Achievement',
            description: 'Set and track goals with milestone tracking and celebrations.',
            icon: <Target className="h-6 w-6 text-blue-600" />,
            stats: { value: '92%', label: 'Goal Progress' },
            graph: { type: 'progress', data: 92 },
        },
    ];

    const additionalFeatures = [
        {
            name: 'Smart Reminders',
            description: 'Get notified at the right time to complete your habits.',
            icon: <Bell className="h-6 w-6 text-blue-600" />,
        },
        {
            name: 'Quick Add',
            description: 'Create new habits in seconds with our streamlined process.',
            icon: <Zap className="h-6 w-6 text-blue-600" />,
        },
        {
            name: 'Categories',
            description: 'Organize habits by category for better management.',
            icon: <PieChart className="h-6 w-6 text-blue-600" />,
        },
        {
            name: 'Time Blocking',
            description: 'Schedule habits at specific times for better routine.',
            icon: <Clock className="h-6 w-6 text-blue-600" />,
        },
    ];

    // Pricing data
    const plans = [
        {
            name: 'Free',
            price: '0',
            description: 'Perfect for getting started',
            features: [
                'Track up to 3 habits',
                'Basic statistics',
                'Daily reminders',
                '7-day streak history',
                'Mobile app access',
            ],
            notIncluded: [
                'Advanced analytics',
                'Unlimited habits',
                'Categories & tags',
                'CSV export',
                'Priority support',
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
                'Advanced analytics & insights',
                'Smart reminders',
                'Unlimited streak history',
                'Categories & tags',
                'CSV data export',
                'Cloud backup',
                'Priority support',
            ],
            notIncluded: [],
            cta: 'Start Free Trial',
            highlight: true,
        },
        {
            name: 'Family',
            price: '19.99',
            description: 'For households building habits together',
            features: [
                'Everything in Premium',
                'Up to 5 users',
                'Shared habits & challenges',
                'Group analytics',
                'Family dashboard',
                'Premium support',
            ],
            notIncluded: [],
            cta: 'Start Free Trial',
            highlight: false,
        },
    ];

    // Testimonials data
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Freelance Designer',
            image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            quote: 'Habitron transformed my morning routine. I\'ve been consistent with meditation for over 6 months now - the longest streak I\'ve ever maintained!',
            rating: 5,
        },
        {
            name: 'Michael Chen',
            role: 'Software Engineer',
            image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            quote: 'The analytics are incredible. Being able to see my progress visually has kept me motivated to stick with my exercise routine.',
            rating: 5,
        },
        {
            name: 'Emily Rodriguez',
            role: 'Marketing Manager',
            image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            quote: 'I\'ve tried many habit trackers, but Habitron\'s clean interface and smart reminders make it the only one I\'ve stuck with long-term.',
            rating: 4,
        },
    ];

    // FAQ data
    const faqs = [
        {
            question: 'How is Habitron different from other habit trackers?',
            answer: 'Habitron combines powerful tracking tools with behavioral science principles to help you build lasting habits. Our approach focuses on both tracking and motivation, with features like smart reminders, detailed analytics, and achievement systems designed to keep you consistent in the long term.',
        },
        {
            question: 'Can I use Habitron on all my devices?',
            answer: 'Yes! Habitron is available on iOS, Android, and web. Your data syncs automatically across all your devices, so you can track your habits wherever you are.',
        },
        {
            question: 'Is there a limit to how many habits I can track?',
            answer: 'The free plan allows you to track up to 3 habits. For unlimited habit tracking, you can upgrade to our Premium plan.',
        },
        {
            question: 'Do you offer a free trial?',
            answer: 'Yes, we offer a 14-day free trial of our Premium plan so you can experience all the features before deciding to subscribe.',
        },
    ];

    const renderGraph = (type: string, data: number[] | number) => {
        const height = 100;
        const width = 200;

        if (type === 'line') {
            const points = (data as number[]).map((value, index, array) => {
                const x = (index / (array.length - 1)) * width;
                const y = height - (value / 100) * height;
                return `${x},${y}`;
            }).join(' ');

            return (
                <div className="relative h-[100px] w-[200px]">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent rounded-lg" />
                    <div className="relative h-full w-full">
                        <svg className="h-full w-full" viewBox={`0 0 ${width} ${height}`}>
                            <polyline
                                points={points}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-blue-600"
                            />
                        </svg>
                    </div>
                </div>
            );
        }

        if (type === 'bar') {
            return (
                <div className="flex items-end justify-between h-[100px] w-[200px] space-x-2">
                    {(data as number[]).map((value, index) => (
                        <div
                            key={index}
                            className="bg-blue-600 rounded-t w-6"
                            style={{ height: `${(value / 30) * 100}%` }}
                        />
                    ))}
                </div>
            );
        }

        if (type === 'progress') {
            return (
                <div className="relative pt-1 w-[200px]">
                    <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            Progress
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div
                            style={{ width: `${data}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                        />
                    </div>
                </div>
            );
        }
    };
    
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-400">
            <SigninForm isModalOpen = {isModalOpen} setIsModalOpen = {setModalOpen} />
            {/* Navbar */}
            <nav className={`fixed w-full z-20 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-800 shadow-md py-2' : 'bg-transparent py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <span className="text-2xl font-bold text-blue-600">Habitron</span>

                        <div className="hidden md:flex items-center space-x-4">
                            <a href="#features" className="text-gray-800 dark:text-gray-400 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                            <a href="#testimonials" className="text-gray-800 dark:text-gray-400 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Testimonials</a>
                            <a href="#pricing" className="text-gray-800 dark:text-gray-400 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                            <a href="#faq" className="text-gray-800 dark:text-gray-400 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">FAQ</a>
                            <button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                                Get Started
                            </button>
                        </div>

                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden bg-white shadow-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-blue-600">Features</a>
                            <a href="#testimonials" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-blue-600">Testimonials</a>
                            <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-blue-600">Pricing</a>
                            <a href="#faq" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-blue-600">FAQ</a>
                            <a href="#signup" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700" onClick={() => setModalOpen(true)} >Get Started</a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-secondary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-slide-down">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                New Feature <span className="ml-2 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            </span>
                            <h1 className="mt-4 text-4xl tracking-tight font-extrabold dark:text-gray-300 text-gray-900 sm:mt-5 sm:text-5xl lg:mt-6 xl:text-6xl">
                                <span className="block">Build better habits,</span>
                                <span className="block text-blue-600">achieve your goals</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl max-w-2xl mx-auto">
                                Habitron helps you track and build consistent habits through simple daily tracking, insightful analytics, and gentle reminders.
                            </p>
                        </div>

                        <div className="mt-8 sm:mt-12 animate-slide-up">
                            <div className="flex justify-center space-x-4">
                                <button onClick={() => setModalOpen(true)} className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                                    Get started
                                    <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                                </button>
                                <a href="#features" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                                    Learn more
                                </a>
                            </div>
                        </div>

                        <div className="mt-12 animate-fade-in max-w-2xl mx-auto">
                            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
                                    <span className="ml-3 text-gray-600">Track unlimited habits</span>
                                </li>
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
                                    <span className="ml-3 text-gray-600">Detailed progress analytics</span>
                                </li>
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="flex-shrink-0 h-6 w-6 text-green-500" />
                                    <span className="ml-3 text-gray-600">Smart reminders</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 md:py-24 bg-white dark:bg-gray-800 dark:text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl font-extrabold dark:text-gray-300 text-gray-900 sm:text-4xl">
                            Everything you need to build better habits
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                            Powerful analytics and tracking tools to help you create lasting change.
                        </p>
                    </div>

                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {mainFeatures.map((feature) => (
                                <div
                                    key={feature.name}
                                    className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-100">
                                                {feature.icon}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                                            <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-600">{feature.stats.value}</p>
                                            <p className="text-sm text-gray-500">{feature.stats.label}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {renderGraph(feature.graph.type, feature.graph.data)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {additionalFeatures.map((feature) => (
                                <div
                                    key={feature.name}
                                    className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div>
                                        <span className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-md">
                                            {feature.icon}
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                                        <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Testimonials</h2>
                        <p className="mt-2 text-3xl font-extrabold dark:text-gray-300 text-gray-900 sm:text-4xl">
                            What our users are saying
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                            Join thousands of people who have transformed their habits with Habitron.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.name}
                                className="bg-white rounded-lg shadow-md p-8 transform transition duration-500 hover:scale-105"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full overflow-hidden">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>

                                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>

                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-16 md:py-24 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Pricing</h2>
                        <p className="mt-2 text-3xl font-extrabold dark:text-gray-300 text-gray-900 sm:text-4xl">
                            Simple, transparent pricing
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                            Start for free, upgrade when you're ready. All plans come with a 14-day free trial.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${plan.highlight
                                    ? 'ring-2 ring-blue-600 transform scale-105 md:scale-110 bg-white'
                                    : 'bg-white'
                                    }`}
                            >
                                {plan.highlight && (
                                    <div className="bg-blue-600 py-1.5 text-center">
                                        <p className="text-sm font-semibold uppercase tracking-wide text-white">
                                            Most Popular
                                        </p>
                                    </div>
                                )}

                                <div className="px-6 py-8">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                                        <div className="mt-4 flex items-baseline justify-center">
                                            <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                                                ${plan.price}
                                            </span>
                                            <span className="ml-1 text-xl font-medium text-gray-500">
                                                /month
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                                    </div>

                                    <div className="mt-8">
                                        <div className="space-y-4">
                                            {plan.features.map((feature) => (
                                                <div key={feature} className="flex items-start">
                                                    <div className="flex-shrink-0">
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                    </div>
                                                    <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                                </div>
                                            ))}

                                            {plan.notIncluded.map((feature) => (
                                                <div key={feature} className="flex items-start opacity-70">
                                                    <div className="flex-shrink-0">
                                                        <X className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <p className="ml-3 text-sm text-gray-500">{feature}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 pb-8">
                                    <a
                                        href="#signup"
                                        className={`block w-full py-3 px-4 rounded-md shadow ${plan.highlight
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white font-medium'
                                            : 'bg-white hover:bg-gray-50 text-blue-600 font-medium border border-blue-600'
                                            } text-center transition-colors`}
                                    >
                                        {plan.cta}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">FAQ</h2>
                        <p className="mt-2 text-3xl font-extrabold dark:text-gray-300 text-gray-900 sm:text-4xl">
                            Frequently asked questions
                        </p>
                    </div>

                    <div className="mt-12">
                        <div className="divide-y divide-gray-200">
                            {faqs.map((faq, index) => (
                                <div key={index} className="py-6">
                                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                                    <p className="mt-2 text-base text-gray-600">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>



            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-1">
                            <span className="text-2xl font-bold text-white">Habitron</span>
                            <p className="mt-2 text-gray-400">
                                Build better habits, achieve your goals, and become the best version of yourself.
                            </p>
                            <div className="mt-4 flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">LinkedIn</span>
                                    <Linkedin size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">GitHub</span>
                                    <Github size={20} />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Product</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Integrations
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        API
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Resources</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Guides
                                    </a>
                                </li>
                                <li>
                                    <a href="#faq" className="text-gray-400 hover:text-white transition-colors">
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Support
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Company</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Privacy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        Terms
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-800">
                        <p className="text-gray-400 text-sm text-center">
                            &copy; {new Date().getFullYear()} Habitron. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;