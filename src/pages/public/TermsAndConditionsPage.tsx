import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SEO } from "@/components/seo/SEO";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Terms & Conditions" 
        description="Terms and Conditions for DmDost - Instagram Automation SaaS. Read our rules and guidelines for using our platform."
        canonical="https://dmdost.in/terms-and-conditions"
      />
      <LandingNavbar />
      
      <main className="container mx-auto px-4 py-24 md:py-32 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using DmDost, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account or password.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. Meta Platform Policy Compliance</h2>
            <p>As a user of DmDost, you must comply with all Meta (Facebook/Instagram) Platform Policies. Any violation of Meta's rules may result in the immediate suspension or termination of your DmDost account.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. Instagram Automation Rules</h2>
            <p>You agree to use our automation tools responsibly. Spamming, harassment, or creating abusive automation flows is strictly prohibited and will lead to account termination.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. Subscription and Payments</h2>
            <p>DmDost offers subscription-based services. By selecting a subscription plan, you agree to pay DmDost the monthly or annual subscription fees indicated for that service. Payments will be charged on a pre-pay basis on the day you sign up.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">6. Refund Policy</h2>
            <p>Refunds are processed according to our specific refund policy, generally offering a window within the first 7 days of the initial subscription, provided the service usage limits haven't been exceeded.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">7. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of DmDost and its licensors.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">8. Service Availability</h2>
            <p>We strive to ensure 99.9% uptime, but DmDost does not guarantee that the service will be uninterrupted or error-free. We may occasionally suspend the service for maintenance or updates.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">9. Account Suspension and Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">10. Limitation of Liability</h2>
            <p>In no event shall DmDost, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">11. Disclaimer</h2>
            <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">12. Governing Law (India)</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">13. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at: <a href="mailto:support@dmdost.in" className="text-primary hover:underline">support@dmdost.in</a>.</p>
          </section>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
}
