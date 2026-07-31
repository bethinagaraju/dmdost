import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SEO } from "@/components/seo/SEO";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy" 
        description="Privacy Policy for DmDost - Instagram Automation SaaS. Learn how we handle and protect your data."
        canonical="https://dmdost.in/privacy-policy"
      />
      <LandingNavbar />
      
      <main className="container mx-auto px-4 py-24 md:py-32 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-foreground font-medium"><strong>Effective Date:</strong> August 1, 2026</p>
          
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">1. Introduction</h2>
            <p>Welcome to DmDost. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website (<a href="https://dmdost.in" className="text-primary hover:underline">https://dmdost.in</a>) and use our Instagram Automation SaaS platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Instagram Business Account Data:</strong> Accessed only after explicit user authorization through the official Instagram Login API.</li>
              <li><strong className="text-foreground">Meta User Information:</strong> Basic profile details necessary for providing our automation services.</li>
              <li><strong className="text-foreground">OAuth Access Tokens:</strong> Tokens are encrypted and securely stored. We never store Instagram passwords.</li>
              <li><strong className="text-foreground">Email Address:</strong> Used for account creation, communication, and notifications.</li>
              <li><strong className="text-foreground">Workspace Information:</strong> Configuration and team settings within your DmDost account.</li>
              <li><strong className="text-foreground">Automation Settings:</strong> Your specific configurations for keyword automation, smart auto-replies, and comment to DM features.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">3. How We Use Data</h2>
            <p>We use your data solely to provide, maintain, and improve the DmDost services. This includes executing your configured Instagram automations via official Meta APIs. We do not use your data for unauthorized advertising, and <strong className="text-foreground">DmDost never sells user data.</strong></p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">4. Security</h2>
            <p>We implement robust security measures to protect your data. All OAuth access tokens are encrypted at rest and in transit. We regularly review our security practices to ensure your information is safe.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">5. Cookies</h2>
            <p>Our website uses cookies to enhance user experience, analyze site usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">6. Third Party Services</h2>
            <p>We integrate with the following third-party services to deliver our platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Meta Platform APIs:</strong> For official Instagram integration.</li>
              <li><strong className="text-foreground">PostgreSQL Storage:</strong> Our secure database provider for storing application data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">7. User Rights</h2>
            <p>You have the right to access, update, or delete your personal information. You can manage most of this data directly within your DmDost dashboard.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">8. Data Retention and Account Deletion</h2>
            <p>We retain your data as long as your account is active. If you wish to delete your data, please follow our <a href="/data-deletion" className="text-primary hover:underline">Data Deletion Instructions</a>. Upon deletion, all OAuth Tokens, Automation Data, and Workspace Data will be permanently removed.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">9. Children's Privacy</h2>
            <p>DmDost is not intended for children under the age of 13. We do not knowingly collect data relating to children.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">10. Contact Information</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@dmdost.in" className="text-primary hover:underline">support@dmdost.in</a>.</p>
          </section>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
}
