import type { PricingPlan } from "@/types";

export const APP_NAME = "DmDost";
export const APP_TAGLINE = "Automate Your Instagram, Amplify Your Growth";

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    color: "text-muted-foreground",
    features: [
      "1 Instagram Account",
      "2 Active Automations",
      "500 Messages/Month",
      "Basic Templates",
      "Email Support",
    ],
    limits: {
      automations: 2,
      messages: 500,
      accounts: 1,
      teamMembers: 1,
    },
  },
  {
    id: "starter",
    name: "Starter",
    price: { monthly: 19, yearly: 15 },
    color: "text-chart-2",
    features: [
      "3 Instagram Accounts",
      "10 Active Automations",
      "5,000 Messages/Month",
      "All Templates",
      "Comment Automation",
      "Priority Email Support",
      "Analytics Dashboard",
    ],
    limits: {
      automations: 10,
      messages: 5000,
      accounts: 3,
      teamMembers: 2,
    },
  },
  {
    id: "professional",
    name: "Professional",
    price: { monthly: 49, yearly: 39 },
    color: "text-primary",
    popular: true,
    features: [
      "5 Instagram Accounts",
      "20 Active Automations",
      "10,000 Messages/Month",
      "All Templates + Custom",
      "All Automation Types",
      "Team Collaboration (3)",
      "Advanced Analytics",
      "Webhook Support",
      "Priority Chat Support",
    ],
    limits: {
      automations: 20,
      messages: 10000,
      accounts: 5,
      teamMembers: 3,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: 149, yearly: 119 },
    color: "text-accent",
    features: [
      "Unlimited Instagram Accounts",
      "Unlimited Automations",
      "Unlimited Messages",
      "Custom Templates",
      "All Automation Types",
      "Unlimited Team Members",
      "Advanced Analytics + Reports",
      "Webhook Support",
      "API Access",
      "Dedicated Account Manager",
      "Custom Integrations",
      "SLA Support",
    ],
    limits: {
      automations: "unlimited",
      messages: "unlimited",
      accounts: "unlimited",
      teamMembers: "unlimited",
    },
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Jessica Thompson",
    role: "E-commerce Founder",
    company: "StyleHive Co.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jess",
    rating: 5,
    content: "DmDost transformed our Instagram strategy. We went from manually responding to hundreds of comments to having everything automated. Our conversion rate increased by 340% in just 2 months!",
  },
  {
    id: 2,
    name: "Marcus Rivera",
    role: "Digital Marketing Agency",
    company: "GrowthLab Agency",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    rating: 5,
    content: "Managing 20+ client accounts used to be a nightmare. Now with DmDost, we handle everything seamlessly. The keyword DM feature alone has generated over $50k in additional revenue for our clients.",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Fitness Coach & Influencer",
    company: "FitWithPriya",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    rating: 5,
    content: "As a fitness coach, engagement is everything. DmDost helps me personally connect with every follower at scale. My client acquisition has tripled since I started using it!",
  },
  {
    id: 4,
    name: "David Chen",
    role: "SaaS Founder",
    company: "TechFlow Inc.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    rating: 5,
    content: "The analytics dashboard is incredible. I can see exactly which automations are driving the most engagement and optimize accordingly. Best ROI tool we've invested in this year.",
  },
  {
    id: 5,
    name: "Sofia Martinez",
    role: "Fashion Blogger",
    company: "StyleBysofia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
    rating: 5,
    content: "My welcome DM automation has built such a strong community. New followers immediately feel valued and connected. My engagement rate went from 2% to 8.5% in just 6 weeks!",
  },
];

export const FAQS = [
  {
    id: 1,
    question: "Is DmDost safe to use with my Instagram account?",
    answer: "Yes, absolutely! DmDost uses the official Instagram Graph API, which means your account is 100% safe. We follow all of Instagram's terms of service and rate limits to ensure your account stays protected.",
  },
  {
    id: 2,
    question: "How does the keyword DM automation work?",
    answer: "When someone comments on your post with a specific keyword you've set (like 'price', 'discount', or 'info'), DmDost automatically sends them a personalized DM with your predefined message or template.",
  },
  {
    id: 3,
    question: "Can I use DmDost for multiple Instagram accounts?",
    answer: "Yes! Depending on your plan, you can connect and manage multiple Instagram accounts from a single dashboard. Our Professional plan supports up to 5 accounts, and Enterprise supports unlimited accounts.",
  },
  {
    id: 4,
    question: "What types of automations are available?",
    answer: "We support 6 automation types: Keyword DM (triggered by comment keywords), Comment Reply, Follow Check DM, Welcome DM for new followers, Story Reply automation, and Live Reply automation.",
  },
  {
    id: 5,
    question: "Can I cancel my subscription anytime?",
    answer: "Yes! You can cancel your subscription at any time from your billing settings. You'll continue to have access to all features until the end of your current billing period.",
  },
  {
    id: 6,
    question: "Do I need technical knowledge to set up automations?",
    answer: "Not at all! Our intuitive automation builder requires zero coding knowledge. Simply select your trigger, set your conditions, choose a template, and you're good to go. Setup takes less than 5 minutes!",
  },
  {
    id: 7,
    question: "Is there a free trial available?",
    answer: "Yes! Our Free plan gives you access to core features with 2 automations and 500 messages per month — no credit card required. Upgrade anytime when you're ready to scale.",
  },
  {
    id: 8,
    question: "How does the analytics dashboard work?",
    answer: "Our analytics dashboard tracks all key metrics including messages sent, comments replied, followers gained, automation success rates, and more. You can view data by daily, weekly, monthly, and yearly timeframes.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Create Your Account",
    description: "Sign up for free in 30 seconds. No credit card required. Get instant access to your dashboard.",
    icon: "UserPlus",
  },
  {
    step: 2,
    title: "Connect Instagram",
    description: "Securely connect your Instagram business or creator account via the official API with just a few clicks.",
    icon: "Instagram",
  },
  {
    step: 3,
    title: "Create Automations",
    description: "Use our intuitive builder to create powerful automations with triggers, conditions, and personalized message templates.",
    icon: "Zap",
  },
  {
    step: 4,
    title: "Sit Back & Relax",
    description: "Watch your engagement soar while DmDost handles all your DMs, comments, and follower interactions automatically.",
    icon: "TrendingUp",
  },
];

export const FEATURES = [
  {
    id: 1,
    title: "Instagram Auto DM",
    description: "Send personalized automated DMs triggered by comments, follows, mentions, and more. Scale your outreach without losing the personal touch.",
    icon: "MessageCircle",
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    id: 2,
    title: "Comment Automation",
    description: "Automatically reply to comments with personalized responses. Detect keywords and respond intelligently at scale.",
    icon: "MessageSquare",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    id: 3,
    title: "Follow Check",
    description: "Send exclusive DMs only to your followers or check if users follow you before sending messages. Perfect for giveaways.",
    icon: "UserCheck",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    id: 4,
    title: "Analytics Dashboard",
    description: "Track every metric that matters. View real-time analytics for all your automations, messages, and engagement rates.",
    icon: "BarChart3",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    id: 5,
    title: "Unlimited Automation",
    description: "Create as many automation workflows as you need on Enterprise plan. No limits on triggers, conditions, or message sequences.",
    icon: "Infinity",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  {
    id: 6,
    title: "Webhook Support",
    description: "Integrate DmDost with your existing tools via webhooks. Connect to Zapier, Slack, CRMs, and thousands of other apps.",
    icon: "Webhook",
    color: "text-chart-1",
    bg: "bg-chart-1/10",
  },
  {
    id: 7,
    title: "Team Collaboration",
    description: "Invite team members to manage Instagram accounts together. Role-based access control for safe collaboration.",
    icon: "Users",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    id: 8,
    title: "Enterprise Security",
    description: "Bank-grade encryption, 2FA authentication, API token management, and full audit logs keep your accounts safe.",
    icon: "Shield",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
];

export const TRUSTED_COMPANIES = [
  "TechFlow Inc.",
  "GrowthLab",
  "StyleHive Co.",
  "FitnessPro",
  "CreativeStudio",
  "BrandBoost",
];

export const STATS = [
  { label: "Active Users", value: "50,000+" },
  { label: "Messages Sent", value: "10M+" },
  { label: "Automations Created", value: "500K+" },
  { label: "Customer Satisfaction", value: "98.5%" },
];

export const SIDEBAR_NAV_ITEMS = [
  {
    group: "Main",
    items: [
      { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Analytics", href: "/dashboard/analytics", icon: "BarChart3" },
    ],
  },
  {
    group: "Instagram",
    items: [
      { label: "Accounts", href: "/dashboard/instagram", icon: "Instagram" },
      { label: "Automations", href: "/dashboard/automations", icon: "Zap" },
      { label: "Templates", href: "/dashboard/templates", icon: "FileText" },
      { label: "Messages", href: "/dashboard/messages", icon: "MessageCircle" },
      { label: "Comments", href: "/dashboard/comments", icon: "MessageSquare" },
      { label: "Followers", href: "/dashboard/followers", icon: "Users" },
    ],
  },
  {
    group: "Account",
    items: [
      { label: "Subscription", href: "/dashboard/subscription", icon: "CreditCard" },
      { label: "Billing", href: "/dashboard/billing", icon: "Receipt" },
      { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
      { label: "Notifications", href: "/dashboard/notifications", icon: "Bell" },
    ],
  },
  {
    group: "Other",
    items: [
      { label: "Activity Logs", href: "/dashboard/logs", icon: "Activity" },
      { label: "Support", href: "/dashboard/support", icon: "HelpCircle" },
    ],
  },
];

export const ADMIN_NAV_ITEMS = [
  {
    group: "Admin",
    items: [
      { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
      { label: "Users", href: "/admin/users", icon: "Users" },
      { label: "Subscriptions", href: "/admin/subscriptions", icon: "CreditCard" },
      { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
      { label: "Support Tickets", href: "/admin/support", icon: "Ticket" },
      { label: "System Logs", href: "/admin/logs", icon: "Activity" },
    ],
  },
];
