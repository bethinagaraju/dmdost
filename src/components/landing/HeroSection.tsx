import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, Camera, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center bg-background">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 fluid-bg" />
      <div className="absolute top-1/4 right-0 w-[800px] h-[800px] blob-gradient rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] blob-gradient rounded-full opacity-10" />

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text Content */}
          <div className="flex-1 max-w-2xl pt-10 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.1] text-foreground mb-6"
            >
              Automate and<br />
              Scale Your<br />
              Instagram.<br />
              <span className="text-gradient">Fast.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Increase your reach to convert, engagement, and grow with your marketing, and create your impact.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12"
            >
              <Button size="lg" asChild className="gradient-brand text-white border-0 hover:opacity-90 shadow-lg shadow-purple-500/25 h-14 px-8 text-lg rounded-xl">
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Go to Dashboard" : "Start for Free"}
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="h-14 px-6 text-lg hover:bg-transparent hover:text-primary transition-colors group">
                Watch Demo <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Trust section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center lg:justify-start gap-8"
            >
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full bg-orange-100 flex items-center justify-center border-2 border-background"><CheckCircle2 className="size-4 text-orange-500" /></div>
                  <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-background"><CheckCircle2 className="size-4 text-blue-500" /></div>
                </div>
                <div className="text-muted-foreground leading-tight">
                  <span className="text-foreground font-bold">Trusted by</span><br />500k+ creators
                </div>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <div className="hidden sm:flex items-center gap-3 text-sm font-medium">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full bg-green-100 flex items-center justify-center border-2 border-background"><CheckCircle2 className="size-4 text-green-500" /></div>
                  <div className="size-8 rounded-full bg-purple-100 flex items-center justify-center border-2 border-background"><CheckCircle2 className="size-4 text-purple-500" /></div>
                </div>
                <div className="text-muted-foreground leading-tight">
                  <span className="text-foreground font-bold">Trusted by</span><br />500k+ creators
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Phone Mockup */}
          <div className="flex-1 relative lg:h-[700px] w-full max-w-lg mx-auto flex items-center justify-center">
            
            {/* Phone Frame */}
            <motion.div 
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: -5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-[320px] h-[650px] bg-white rounded-[3rem] p-4 shadow-2xl z-10 border-8 border-gray-900"
            >
              {/* Screen Content */}
              <div className="w-full h-full bg-gray-50 rounded-[2rem] overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20" />
                
                {/* Header */}
                <div className="px-6 pt-10 pb-4 border-b bg-white flex justify-between items-center">
                  <div className="text-sm font-bold">9:41</div>
                  <div className="flex gap-1">
                    <div className="size-2 rounded-full bg-foreground" />
                    <div className="size-2 rounded-full bg-foreground" />
                    <div className="size-2 rounded-full bg-foreground" />
                  </div>
                </div>

                {/* Dashboard UI */}
                <div className="p-4 space-y-4">
                  <div className="bg-white rounded-2xl p-6 text-center card-shadow">
                    <Camera className="size-8 text-pink-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold">312</div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Follower Growth</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-5 text-center card-shadow">
                      <div className="text-2xl font-bold text-blue-600">1450</div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase mt-1">Total Reach</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 text-center card-shadow">
                      <div className="text-2xl font-bold text-green-600">3,550</div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase mt-1">Plays</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 text-center card-shadow">
                      <div className="text-2xl font-bold text-orange-500">1250</div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase mt-1">Views</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 text-center card-shadow">
                      <div className="text-2xl font-bold text-purple-600">1500</div>
                      <div className="text-[10px] text-muted-foreground font-medium uppercase mt-1">Clicks</div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white rounded-full h-14 flex items-center justify-around card-shadow px-2">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Camera className="size-5" /></div>
                    <div className="size-10 rounded-full flex items-center justify-center text-muted-foreground"><MessageCircle className="size-5" /></div>
                    <div className="size-10 rounded-full flex items-center justify-center text-muted-foreground"><Heart className="size-5" /></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 left-0 bg-white/90 backdrop-blur p-4 rounded-2xl card-shadow-lg z-20 flex items-center gap-3 border border-white/50"
            >
              <div className="size-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white">
                <Camera className="size-5" />
              </div>
              <span className="font-bold">IG Post</span>
            </motion.div>

            <motion.div
              animate={{ y: [15, -15, 15] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-20 -right-10 bg-white/90 backdrop-blur p-4 rounded-2xl card-shadow-lg z-20 flex items-center gap-3 border border-white/50"
            >
              <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <MessageCircle className="size-5" />
              </div>
              <span className="font-bold">Message</span>
            </motion.div>

            <motion.div
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-32 -left-8 bg-white/90 backdrop-blur p-4 rounded-2xl card-shadow-lg z-20 flex items-center gap-3 border border-white/50"
            >
              <div className="size-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <MessageCircle className="size-5" />
              </div>
              <span className="font-bold">Message</span>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-20 -right-4 bg-white/90 backdrop-blur p-4 rounded-2xl card-shadow-lg z-20 flex items-center gap-3 border border-white/50"
            >
              <div className="size-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                <Sparkles className="size-5" />
              </div>
              <span className="font-bold">Sparkle</span>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
