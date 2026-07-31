import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ToastNotifications } from "@/components/ToastNotifications";

// Landing
import LandingPage from "@/pages/landing/LandingPage";

// Public Pages
import PrivacyPolicyPage from "@/pages/public/PrivacyPolicyPage";
import TermsAndConditionsPage from "@/pages/public/TermsAndConditionsPage";
import ContactPage from "@/pages/public/ContactPage";
import DataDeletionPage from "@/pages/public/DataDeletionPage";

// Auth
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import OtpVerificationPage from "@/pages/auth/OtpVerificationPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// Dashboard
import OverviewPage from "@/pages/dashboard/OverviewPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import InstagramPage from "@/pages/dashboard/InstagramPage";
import AutomationsPage from "@/pages/dashboard/AutomationsPage";
import TemplatesPage from "@/pages/dashboard/TemplatesPage";
import MessagesPage from "@/pages/dashboard/MessagesPage";
import CommentsPage from "@/pages/dashboard/CommentsPage";
import FollowersPage from "@/pages/dashboard/FollowersPage";
import SubscriptionPage from "@/pages/dashboard/SubscriptionPage";
import BillingPage from "@/pages/dashboard/BillingPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import NotificationsPage from "@/pages/dashboard/NotificationsPage";
import ActivityLogsPage from "@/pages/dashboard/ActivityLogsPage";
import SupportPage from "@/pages/dashboard/SupportPage";

// Admin
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminSubscriptionsPage from "@/pages/admin/AdminSubscriptionsPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import AdminLogsPage from "@/pages/admin/AdminLogsPage";
import AdminSupportPage from "@/pages/admin/AdminSupportPage";

// Error
import NotFoundPage from "@/pages/error/NotFoundPage";
import ServerErrorPage from "@/pages/error/ServerErrorPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/data-deletion" element={<DataDeletionPage />} />

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/otp-verification" element={<OtpVerificationPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="/dashboard/instagram" element={<InstagramPage />} />
            <Route path="/dashboard/automations" element={<AutomationsPage />} />
            <Route path="/dashboard/templates" element={<TemplatesPage />} />
            <Route path="/dashboard/messages" element={<MessagesPage />} />
            <Route path="/dashboard/comments" element={<CommentsPage />} />
            <Route path="/dashboard/followers" element={<FollowersPage />} />
            <Route path="/dashboard/subscription" element={<SubscriptionPage />} />
            <Route path="/dashboard/billing" element={<BillingPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard/logs" element={<ActivityLogsPage />} />
            <Route path="/dashboard/support" element={<SupportPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/logs" element={<AdminLogsPage />} />
            <Route path="/admin/support" element={<AdminSupportPage />} />
          </Route>

          {/* Error pages */}
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <ToastNotifications />
      </AuthProvider>
    </BrowserRouter>
  );
}
