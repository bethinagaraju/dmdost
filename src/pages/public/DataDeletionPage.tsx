import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SEO } from "@/components/seo/SEO";

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Data Deletion Instructions" 
        description="Learn how to request deletion of your DmDost account and associated Instagram automation data."
        canonical="https://dmdost.in/data-deletion"
      />
      <LandingNavbar />
      
      <main className="container mx-auto px-4 py-24 md:py-32 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Data Deletion Instructions</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">Users may request deletion of all stored data associated with their DmDost account at any time.</p>
          
          <section className="bg-card border rounded-2xl p-8 mt-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-foreground mt-0">How to Request Deletion</h2>
            
            <div className="space-y-4">
              <p>Please send an email to our support team with the following details:</p>
              
              <ul className="list-none pl-0 space-y-4">
                <li className="flex gap-4">
                  <div className="font-semibold w-24 shrink-0 text-foreground">Email:</div>
                  <div><a href="mailto:support@dmdost.in" className="text-primary hover:underline">support@dmdost.in</a></div>
                </li>
                <li className="flex gap-4">
                  <div className="font-semibold w-24 shrink-0 text-foreground">Subject:</div>
                  <div className="font-medium bg-muted px-2 py-1 rounded text-foreground inline-block">Delete My Account</div>
                </li>
              </ul>

              <p className="mt-6 font-medium text-foreground">Please include the following information in your email:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your Registered Email Address</li>
                <li>Your connected Instagram Username</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">What happens next?</h2>
            <p>After verifying your identity, the DmDost team will permanently delete:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>OAuth Tokens (Instagram connection)</li>
              <li>Automation Data (keywords, smart replies)</li>
              <li>Workspace Data</li>
              <li>All other stored User Information</li>
            </ul>
            
            <div className="mt-8 p-4 bg-primary/10 border-l-4 border-primary rounded-r text-foreground">
              <p className="font-medium m-0">Deletion will be completed within 7 business days of your verified request.</p>
            </div>
          </section>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
}
