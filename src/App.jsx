import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ShoppingCart,
  Search,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Info,
  User,
  Star,
  Lock,
  DollarSign,
  Send,
  HelpCircle,
  RefreshCw,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Trash2,
  Check,
  Eye,
  Flag
} from 'lucide-react';

// Sample E-Commerce Products with Safety Indicators
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'UltraBass Wireless Headphones ANC',
    category: 'Electronics',
    price: 189.00,
    originalPrice: 249.00,
    rating: 4.8,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    seller: {
      name: 'AudioTech Official',
      verified: true,
      rating: 4.9,
      joinedYear: '2021',
      trustScore: 98
    },
    description: 'High-fidelity audio with active noise cancellation, 30-hour battery life, and ergonomic design.',
    isSuspicious: false,
    flags: []
  },
  {
    id: 'prod-2',
    title: 'PlayStation 5 Console Digital Edition (BRAND NEW IN BOX)',
    category: 'Gaming',
    price: 120.00,
    originalPrice: 599.00,
    rating: 2.1,
    reviewsCount: 3,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    seller: {
      name: 'QuickDeals_998',
      verified: false,
      rating: 2.3,
      joinedYear: '2025',
      trustScore: 32
    },
    description: 'Brand new PS5 console! Selling urgently due to moving out. Payment via direct bank transfer or Telegram gift card link only!',
    isSuspicious: true,
    flags: [
      'Unusually Low Price (-80% off retail)',
      'New Account with Low Trust Score',
      'Requests Off-Platform Direct Transfer / Gift Cards'
    ]
  },
  {
    id: 'prod-3',
    title: 'FitPulse Smartwatch Series 7 - Black',
    category: 'Wearables',
    price: 129.50,
    originalPrice: 159.00,
    rating: 4.6,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    seller: {
      name: 'FitGear Singapore',
      verified: true,
      rating: 4.7,
      joinedYear: '2022',
      trustScore: 94
    },
    description: 'Track heart rate, sleep metrics, workout routines, and phone notifications in crystal clear OLED.',
    isSuspicious: false,
    flags: []
  },
  {
    id: 'prod-4',
    title: 'Limited Edition Urban Runner Sneakers',
    category: 'Footwear',
    price: 65.00,
    originalPrice: 220.00,
    rating: 3.2,
    reviewsCount: 8,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    seller: {
      name: 'SneakerHeads_Global_Direct',
      verified: false,
      rating: 3.5,
      joinedYear: '2024',
      trustScore: 54
    },
    description: 'Auth guaranteed! DM me on WhatsApp +65 8123-4567 before placing order for extra 20% discount payload link.',
    isSuspicious: true,
    flags: [
      'Encourages WhatsApp off-platform chat',
      'Unverified external payment link request'
    ]
  }
];

// Interactive Scenarios for Quiz Module
const SCENARIOS = [
  {
    id: 'sc-1',
    title: 'Off-Platform Payment Request',
    sellerName: 'QuickDeals_998',
    itemTitle: 'PlayStation 5 Console',
    chatHistory: [
      { sender: 'seller', text: 'Hi! Are you interested in buying the PS5?' },
      { sender: 'user', text: 'Yes! Is it still available?' },
      { sender: 'seller', text: 'Yes, but the platform checkout fees are too high. If you transfer $100 directly to my PayNow account right now, I will express ship it today!' }
    ],
    question: 'What is the safest action to take here?',
    options: [
      {
        label: 'A. Pay via direct PayNow because it saves money and guarantees fast shipping.',
        isCorrect: false,
        feedback: 'Dangerous! Paying off-platform voids all buyer protection guarantees. Scammers frequently disappear once direct payments are made.'
      },
      {
        label: 'B. Refuse off-platform payment and insist on using the platform’s official secure checkout.',
        isCorrect: true,
        feedback: 'Correct! Official platform escrow systems hold funds safely until you receive and verify the item.'
      },
      {
        label: 'C. Ask for their NRIC or photo ID first before transferring money directly.',
        isCorrect: false,
        feedback: 'Risky! Scammers often use stolen IC images or fake IDs to build false trust.'
      }
    ],
    safetyTip: 'Never transact outside the official app. Escrow protection protects your funds until delivery.'
  },
  {
    id: 'sc-2',
    title: 'SMS Delivery OTP Request',
    sellerName: 'ExpressCourier_SG',
    itemTitle: 'Package Delivery Update',
    chatHistory: [
      { sender: 'seller', text: 'Hello! Your parcel delivery failed due to missing street unit number.' },
      { sender: 'seller', text: 'I just sent a 6-digit confirmation OTP to your mobile phone. Please reply with the code so I can re-route your delivery driver.' }
    ],
    question: 'How should you respond to this OTP request?',
    options: [
      {
        label: 'A. Share the 6-digit OTP code immediately so your parcel isn’t returned.',
        isCorrect: false,
        feedback: 'Critical Risk! OTPs (One-Time Passwords) act as your digital signature/password. Never share OTPs with delivery agents or sellers.'
      },
      {
        label: 'B. Never share the OTP. Check the official logistics tracking page directly in the application.',
        isCorrect: true,
        feedback: 'Correct! Genuine couriers and platform sellers NEVER need your OTP to update an address.'
      },
      {
        label: 'C. Ask them which bank sent the OTP before replying.',
        isCorrect: false,
        feedback: 'Incorrect. Regardless of sender, sharing any OTP allows scammers to take over your accounts or authorize fraudulent transactions.'
      }
    ],
    safetyTip: 'OTPs are secret authorization codes. Treat them like your bank PIN!'
  },
  {
    id: 'sc-3',
    title: 'External Discount Link / Phishing',
    sellerName: 'SneakerHeads_Global_Direct',
    itemTitle: 'Urban Runner Sneakers',
    chatHistory: [
      { sender: 'seller', text: 'Special offer! Click this link to claim your 30% discount voucher: http://bit.ly/cheap-shoes-checkout-sg' },
      { sender: 'seller', text: 'Log in with your platform password on that page to apply the code!' }
    ],
    question: 'Is it safe to click this link and sign in?',
    options: [
      {
        label: 'A. Yes, bit.ly links are standard shortened URLs used for promotional discounts.',
        isCorrect: false,
        feedback: 'Danger! Shortened or mismatched links are frequently used in phishing attacks to steal your login credentials.'
      },
      {
        label: 'B. No. Do not click external links or re-enter your password on unfamiliar websites.',
        isCorrect: true,
        feedback: 'Spot on! Always verify URLs carefully and use native in-app promotional vouchers.'
      },
      {
        label: 'C. Click the link, but use a fake password first to see if it works.',
        isCorrect: false,
        feedback: 'Not recommended. Clicking untrusted links can expose your device to malicious scripts or drive-by downloads.'
      }
    ],
    safetyTip: 'Phishing websites imitate real platforms to steal passwords and credit card details.'
  }
];

export default function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'scenarios' | 'guide'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // SafeChat AI Assistant state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your SafeChat AI Safety Assistant. Paste any suspicious message, listing link, or scenario here to check for online shopping scams!',
      timestamp: '10:00 AM'
    }
  ]);
  const [inputChatText, setInputChatText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Safety Score & Gamification state
  const [safetyScore, setSafetyScore] = useState(100);
  const [completedScenarios, setCompletedScenarios] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Scenario Simulator state
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [scenarioAnswer, setScenarioAnswer] = useState(null);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
  };

  // Add to cart with safety validation check
  const handleAddToCart = (product) => {
    if (product.isSuspicious) {
      showToast(`Warning: "${product.title}" has been flagged for suspicious listing patterns! Proceed with caution.`, 'warning');
    } else {
      showToast(`Added "${product.title}" to your cart.`, 'success');
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Handle SafeChat Analyzer query
  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputChatText;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputChatText('');
    setIsAnalyzing(true);

    // AI Safety Detection logic simulation
    setTimeout(() => {
      let aiResponse = '';
      let threatLevel = 'low';

      const lower = query.toLowerCase();

      if (lower.includes('paynow') || lower.includes('transfer') || lower.includes('outside') || lower.includes('telegram') || lower.includes('bank')) {
        threatLevel = 'high';
        aiResponse = '🚨 HIGH SCAM RISK DETECTED!\nReason: Requesting off-platform payments (PayNow, Telegram, direct transfer). Real sellers use official platform escrow. Do NOT transfer funds directly!';
      } else if (lower.includes('otp') || lower.includes('code') || lower.includes('password') || lower.includes('pin')) {
        threatLevel = 'high';
        aiResponse = '🚨 CRITICAL SECURITY THREAT!\nReason: Requests for OTP or account verification codes. Sharing OTPs gives scammers full access to your bank/account. Never share your OTP!';
      } else if (lower.includes('http') || lower.includes('bit.ly') || lower.includes('link') || lower.includes('click')) {
        threatLevel = 'medium';
        aiResponse = '⚠️ SUSPICIOUS PHISHING LINK!\nReason: External or shortened URLs can lead to fake login pages designed to harvest your personal credentials. Stick to in-app links.';
      } else if (lower.includes('ps5') || lower.includes('$120') || lower.includes('cheap')) {
        threatLevel = 'medium';
        aiResponse = '⚠️ TOO GOOD TO BE TRUE DEAL!\nReason: A price vastly lower than market average (-70%+) is a classic bait tactic. Verify seller background before making any payment.';
      } else {
        aiResponse = '✅ SafeChat Analysis: This query appears safe! However, always ensure you keep all communications inside the official platform and never share sensitive passwords.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponse,
          threatLevel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAnalyzing(false);
    }, 800);
  };

  // Handle Scenario Answer Choice
  const handleSelectOption = (index) => {
    const currentScenario = SCENARIOS[activeScenarioIdx];
    const selectedOption = currentScenario.options[index];
    setScenarioAnswer(index);

    if (selectedOption.isCorrect) {
      if (!completedScenarios[currentScenario.id]) {
        setSafetyScore((prev) => Math.min(100, prev + 15));
        setCompletedScenarios((prev) => ({ ...prev, [currentScenario.id]: true }));
      }
      showToast('Correct decision! Your safety score increased.', 'success');
    } else {
      setSafetyScore((prev) => Math.max(0, prev - 15));
      showToast('Caution! That choice places your security at risk.', 'error');
    }
  };

  // Checkout simulation check
  const handleAttemptCheckout = () => {
    const hasSuspiciousItem = cart.some((item) => item.isSuspicious);
    if (hasSuspiciousItem) {
      showToast('Checkout Blocked! Your cart contains high-risk flagged items. Analyze them with SafeChat first!', 'error');
    } else {
      showToast('Safe Checkout Initiated! Payments protected via Platform Escrow.', 'success');
      setIsCheckoutModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Banner & Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
              <div className="bg-emerald-500 p-2 rounded-lg text-slate-900 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wide flex items-center gap-2">
                  SafeShop <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-medium">Academy Edition</span>
                </h1>
                <p className="text-xs text-slate-400">E-Commerce Scam Prevention & Safety Simulator</p>
              </div>
            </div>

            {/* Middle Nav Tabs */}
            <nav className="hidden md:flex space-x-1">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'marketplace'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Marketplace
              </button>
              <button
                onClick={() => setActiveTab('scenarios')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'scenarios'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-4 h-4" />
                Safety Simulator
                {Object.keys(completedScenarios).length > 0 && (
                  <span className="bg-emerald-500 text-slate-950 text-xs px-1.5 py-0.5 rounded-full font-bold">
                    {Object.keys(completedScenarios).length}/{SCENARIOS.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'guide'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Scam Prevention Guide
              </button>
            </nav>

            {/* Right Action Widgets */}
            <div className="flex items-center space-x-3">
              {/* Safety Score Widget */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">
                <Shield className={`w-4 h-4 ${safetyScore >= 80 ? 'text-emerald-400' : safetyScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`} />
                <span className="text-xs text-slate-300">Safety Index:</span>
                <span className={`text-sm font-bold ${safetyScore >= 80 ? 'text-emerald-400' : safetyScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {safetyScore}/100
                </span>
              </div>

              {/* SafeChat Assistant Toggle Button */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="relative bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>SafeChat AI</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="View Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-bounce">
          {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
          <p className="text-sm text-slate-200">{toastMessage.message}</p>
        </div>
      )}

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden mb-4 bg-slate-200 p-1 rounded-lg gap-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex-1 py-1.5 rounded-md text-center ${activeTab === 'marketplace' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`flex-1 py-1.5 rounded-md text-center ${activeTab === 'scenarios' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            Quiz Simulator
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 rounded-md text-center ${activeTab === 'guide' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            Safety Guide
          </button>
        </div>

        {/* TAB 1: MARKETPLACE INTERFACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            
            {/* Safety Alert Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-900">Student Safety Awareness Active</h3>
                  <p className="text-xs text-amber-700">
                    Some items in this store contain realistic scam indicators (unrealistic prices, off-platform payment prompts). Use SafeChat AI to inspect products!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(true)}
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Analyze Listings
              </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {INITIAL_PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative group"
                >
                  {/* Flag Tag for Suspicious Items */}
                  {product.isSuspicious && (
                    <div className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Flag className="w-3 h-3" />
                      Suspicious Listing
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Seller Tag */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="flex items-center gap-1 truncate max-w-[140px]">
                          <User className="w-3 h-3" />
                          {product.seller.name}
                        </span>
                        {product.seller.verified ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded">
                            Unverified
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm leading-snug">
                        {product.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SAFETY QUIZ SIMULATOR */}
        {activeTab === 'scenarios' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Interactive Safety Training
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Scenario {activeScenarioIdx + 1} of {SCENARIOS.length}: {SCENARIOS[activeScenarioIdx].title}
                  </h2>
                </div>
                <div className="flex gap-1">
                  {SCENARIOS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveScenarioIdx(i);
                        setScenarioAnswer(null);
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        activeScenarioIdx === i
                          ? 'bg-emerald-600 text-white'
                          : completedScenarios[SCENARIOS[i].id]
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Simulation Window */}
              <div className="bg-slate-900 rounded-xl p-4 mb-6 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs text-slate-400">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Seller: <strong className="text-slate-200">{SCENARIOS[activeScenarioIdx].sellerName}</strong></span>
                  <span className="text-slate-600">|</span>
                  <span>Listing: <span className="text-slate-300">{SCENARIOS[activeScenarioIdx].itemTitle}</span></span>
                </div>

                {SCENARIOS[activeScenarioIdx].chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Scenario Question */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                  {SCENARIOS[activeScenarioIdx].question}
                </h3>

                <div className="space-y-2.5">
                  {SCENARIOS[activeScenarioIdx].options.map((opt, optIdx) => {
                    const isSelected = scenarioAnswer === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium'
                              : 'bg-rose-50 border-rose-500 text-rose-950 font-medium'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="shrink-0 mt-0.5">
                          {isSelected ? (
                            opt.isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-rose-600" />
                            )
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-500">
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                          )}
                        </span>
                        <div className="flex-1">
                          <p>{opt.label}</p>
                          {isSelected && (
                            <p className={`mt-2 text-xs p-2 rounded-lg ${opt.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                              {opt.feedback}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Safety Tip Box */}
                {scenarioAnswer !== null && (
                  <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-3 text-xs text-sky-900">
                    <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Pro Safety Rule:</strong>
                      {SCENARIOS[activeScenarioIdx].safetyTip}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCAM PREVENTION GUIDE */}
        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  E-Commerce Scam Defense Handbook
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Essential safety rules for students buying and selling items on online marketplaces.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm mb-2">
                    <ShieldAlert className="w-4 h-4" />
                    1. Never Transact Off-Platform
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Scammers frequently request direct PayNow, bank transfers, or gift cards by offering false discounts. Once money is sent directly, platform customer support cannot recover your funds.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm mb-2">
                    <Lock className="w-4 h-4" />
                    2. Keep OTPs strictly Confidential
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No legitimate delivery service, buyer, or platform employee will ever ask for your 6-digit One-Time Password. Sharing OTPs gives scammers full control of your account.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm mb-2">
                    <ExternalLink className="w-4 h-4" />
                    3. Inspect Phishing URLs
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Be cautious of shortened URLs (bit.ly, tinyurl) sent by buyers or sellers. Always verify that the domain matches the official platform website before entering passwords or payment card details.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    4. Check Seller Verification & Reviews
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Review seller registration dates, feedback history, and verified trust badges. Newly created accounts offering luxury items at huge discounts (-70% off) are high risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="relative h-56 bg-slate-100">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full p-1.5 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                  {selectedProduct.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedProduct.title}</h3>
                <p className="text-xs text-slate-500 mt-2">{selectedProduct.description}</p>
              </div>

              {/* Seller Trust Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Seller Profile: {selectedProduct.seller.name}</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${selectedProduct.seller.trustScore > 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    Trust Score: {selectedProduct.seller.trustScore}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <span>Joined: {selectedProduct.seller.joinedYear}</span>
                  <span>Rating: ⭐ {selectedProduct.seller.rating}</span>
                </div>
              </div>

              {/* Flagged Risks */}
              {selectedProduct.isSuspicious && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    SafeChat Risk Assessment Flags:
                  </div>
                  <ul className="text-xs text-rose-700 list-disc list-inside space-y-0.5">
                    {selectedProduct.flags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block">Listed Price</span>
                  <span className="text-xl font-bold text-slate-900">${selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleSendMessage(`Is the listing "${selectedProduct.title}" safe to buy? Price is $${selectedProduct.price}`);
                      setIsChatOpen(true);
                      setSelectedProduct(null);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI Scan
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Shopping Cart ({cart.length})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Your cart is currently empty.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl relative">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">${item.price.toFixed(2)} x {item.quantity}</p>
                      {item.isSuspicious && (
                        <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3" /> Flagged Item
                        </span>
                      )}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={handleAttemptCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Secure Escrow Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT SIMULATION SUCCESS MODAL */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Platform Escrow Protection Active</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your payment of <strong>${cartTotal.toFixed(2)}</strong> will be safely held in official escrow and only released to sellers after you confirm package arrival!
            </p>
            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setCart([]);
                setIsCartOpen(false);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-sm"
            >
              Complete Simulation
            </button>
          </div>
        </div>
      )}

      {/* SAFECHAT AI ASSISTANT SIDE DRAWER */}
      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">SafeChat AI Assistant</h3>
                <p className="text-[10px] text-slate-400">Scam & Phishing Analysis Engine</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white p-1">
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none'
                      : msg.threatLevel === 'high'
                      ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-bl-none shadow-sm'
                      : msg.threatLevel === 'medium'
                      ? 'bg-amber-50 border border-amber-200 text-amber-950 rounded-bl-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" /> SafeChat scanning text patterns...
              </div>
            )}
          </div>

          {/* Preset Quick Scan Buttons */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSendMessage('PayNow off platform transfer request')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
            >
              Check PayNow prompt
            </button>
            <button
              onClick={() => handleSendMessage('Seller asking for 6-digit OTP code')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0"
            >
              Check OTP prompt
            </button>
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputChatText}
              onChange={(e) => setInputChatText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Paste suspicious text or query..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 text-center">
        <p>© 2026 SafeChat Academy Edition. Educational Online Shopping Safety Simulation.</p>
      </footer>
    </div>
  );
}