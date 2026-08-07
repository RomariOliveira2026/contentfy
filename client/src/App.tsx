import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import GoogleAnalytics from "./components/GoogleAnalytics";
import ScrollToTop from "./components/ScrollToTop";
import GlobalBackButton from "./components/GlobalBackButton";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ProductPlans from "./pages/ProductPlans";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutError from "./pages/CheckoutError";
import ExperienceHomePage from "./pages/members/ExperienceHome";
import MyAccount from "./pages/MyAccount";
import MyProducts from "./pages/MyProducts";
import CourseViewer from "./pages/members/CourseViewer";
import Certificates from "./pages/members/Certificates";
import ProductViewer from "./pages/members/ProductViewer";
import AffiliateDashboard from "./pages/affiliate/Dashboard";
import AffiliateRegister from "./pages/affiliate/Register";
import AffiliateLinks from "./pages/affiliate/Links";
import AffiliateSales from "./pages/affiliate/Sales";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import AdminAffiliates from "./pages/admin/Affiliates";
import AdminSales from "./pages/admin/Sales";
import AdminCustomers from "./pages/admin/Customers";
import AdminCourses from "./pages/admin/Courses";
import AdminSettings from "./pages/admin/Settings";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import CreatorDashboard from "./pages/creator/Dashboard";
import CreatorProducts from "./pages/creator/Products";
import CreatorProductWizard from "./pages/creator/ProductWizard";
import CreatorCourses from "./pages/creator/Courses";
import CreatorCourseBuilder from "./pages/creator/CourseBuilder";
import CreatorSales from "./pages/creator/Sales";
import CreatorStudents from "./pages/creator/Students";
import CreatorAffiliates from "./pages/creator/Affiliates";
import CreatorSettings from "./pages/creator/Settings";
import AIStudioDashboard from "./pages/creator/ai/AIStudioDashboard";
import AIWriter from "./pages/creator/ai/AIWriter";
import AICourseBuilderPage from "./pages/creator/ai/AICourseBuilderPage";
import AIQuizBuilderPage from "./pages/creator/ai/AIQuizBuilderPage";
import AICertificatePage from "./pages/creator/ai/AICertificatePage";
import AIEmailsPage from "./pages/creator/ai/AIEmailsPage";
import AISalesPage from "./pages/creator/ai/AISalesPage";
import About from "./pages/About";
import Features from "./pages/Features";
import Examples from "./pages/Examples";
import Process from "./pages/Process";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Pricing from "./pages/Pricing";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Desacelere from "./pages/Desacelere";
import Explore from "./pages/Explore";
import ShowcaseProductPage from "./pages/ShowcaseProductPage";
import BrandQa from "./pages/dev/BrandQa";
import MyPurchases from "./pages/members/MyPurchases";
import OrderProtection from "./pages/members/OrderProtection";
import AdminRefunds from "./pages/admin/Refunds";
import GuaranteePolicy from "./pages/GuaranteePolicy";
import MyListPage from "./pages/MyListPage";
import DiscoveryCategoryPage from "./pages/DiscoveryCategoryPage";
import AdminDiscovery from "./pages/admin/Discovery";

const EvolutionPage = lazy(() => import("./pages/members/Evolution"));
const MyEvolutionPage = lazy(() => import("./pages/members/MyEvolution"));
const AchievementsPage = lazy(() => import("./pages/members/Achievements"));
const AdminSuccess = lazy(() => import("./pages/admin/Success"));
const CreatorSuccess = lazy(() => import("./pages/creator/Success"));
const AdminIntelligence = lazy(() => import("./pages/admin/Intelligence"));
const CreatorIntelligence = lazy(() => import("./pages/creator/Intelligence"));
const AdminOrchestrator = lazy(() => import("./pages/admin/Orchestrator"));

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/dev/brand-qa" component={BrandQa} />
      <Route path={"/"} component={Home} />
      <Route path="/explorar/categoria/:slug" component={DiscoveryCategoryPage} />
      <Route path="/explorar" component={Explore} />
      <Route path="/minha-lista" component={MyListPage} />
      <Route path="/produto/:slug" component={ShowcaseProductPage} />
      <Route path="/products" component={Products} />
      <Route path="/products/:slug/plans" component={ProductPlans} />
      <Route path="/products/:slug" component={ProductDetail} />
      <Route path="/about" component={About} />
      <Route path="/features" component={Features} />
      <Route path="/examples" component={Examples} />
      <Route path="/process" component={Process} />
      <Route path="/faq" component={FAQ} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/garantia" component={GuaranteePolicy} />
      <Route path="/politica-de-reembolso" component={GuaranteePolicy} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/desacelere" component={Desacelere} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/checkout/error" component={CheckoutError} />
      <Route path="/checkout/:slug" component={Checkout} />
      
        {/* Members Area */}
      <Route path="/my-account" component={MyAccount} />
      <Route path="/dashboard" component={ExperienceHomePage} />
      <Route path="/my-account/home" component={ExperienceHomePage} />
      <Route path="/my-account/products" component={MyProducts} />
      <Route path="/my-account/purchases/:orderId/protection" component={OrderProtection} />
      <Route path="/my-account/purchases" component={MyPurchases} />
      <Route path="/my-account/certificates" component={Certificates} />
      <Route path="/my-account/evolucao">
        {() => (
          <Suspense fallback={null}>
            <EvolutionPage />
          </Suspense>
        )}
      </Route>
      <Route path="/my-account/sucesso">
        {() => (
          <Suspense fallback={null}>
            <MyEvolutionPage />
          </Suspense>
        )}
      </Route>
      <Route path="/my-account/achievements">
        {() => (
          <Suspense fallback={null}>
            <AchievementsPage />
          </Suspense>
        )}
      </Route>
      <Route path="/my-account/course/:id" component={CourseViewer} />
      <Route path="/my-account/product/:id" component={ProductViewer} />
      
      {/* Affiliate Routes */}
      <Route path="/affiliate/register" component={AffiliateRegister} />
      <Route path="/affiliate" component={AffiliateDashboard} />
      <Route path="/affiliate/links" component={AffiliateLinks} />
      <Route path="/affiliate/sales" component={AffiliateSales} />
      
      {/* Admin Routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/products/new" component={ProductForm} />
      <Route path="/admin/products/:id/edit" component={ProductForm} />
      <Route path="/admin/affiliates" component={AdminAffiliates} />
      <Route path="/admin/sales" component={AdminSales} />
      <Route path="/admin/refunds" component={AdminRefunds} />
      <Route path="/admin/discovery" component={AdminDiscovery} />
      <Route path="/admin/success">
        {() => (
          <Suspense fallback={null}>
            <AdminSuccess />
          </Suspense>
        )}
      </Route>
      <Route path="/admin/intelligence">
        {() => (
          <Suspense fallback={null}>
            <AdminIntelligence />
          </Suspense>
        )}
      </Route>
      <Route path="/admin/orchestrator">
        {() => (
          <Suspense fallback={null}>
            <AdminOrchestrator />
          </Suspense>
        )}
      </Route>
      <Route path="/admin/customers" component={AdminCustomers} />
      <Route path="/admin/courses" component={AdminCourses} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/sales/:id" component={AdminOrderDetail} />

      {/* Creator Area */}
      <Route path="/creator/dashboard" component={CreatorDashboard} />
      <Route path="/creator/ai/writer" component={AIWriter} />
      <Route path="/creator/ai/course" component={AICourseBuilderPage} />
      <Route path="/creator/ai/quiz" component={AIQuizBuilderPage} />
      <Route path="/creator/ai/certificate" component={AICertificatePage} />
      <Route path="/creator/ai/emails" component={AIEmailsPage} />
      <Route path="/creator/ai/sales-page" component={AISalesPage} />
      <Route path="/creator/ai" component={AIStudioDashboard} />
      <Route path="/creator/products/new" component={CreatorProductWizard} />
      <Route path="/creator/products/:id/edit" component={CreatorProductWizard} />
      <Route path="/creator/products" component={CreatorProducts} />
      <Route path="/creator/courses/:id/builder" component={CreatorCourseBuilder} />
      <Route path="/creator/courses" component={CreatorCourses} />
      <Route path="/creator/sales" component={CreatorSales} />
      <Route path="/creator/students" component={CreatorStudents} />
      <Route path="/creator/success">
        {() => (
          <Suspense fallback={null}>
            <CreatorSuccess />
          </Suspense>
        )}
      </Route>
      <Route path="/creator/intelligence">
        {() => (
          <Suspense fallback={null}>
            <CreatorIntelligence />
          </Suspense>
        )}
      </Route>
      <Route path="/creator/affiliates" component={CreatorAffiliates} />
      <Route path="/creator/settings" component={CreatorSettings} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <GoogleAnalytics />
        <ScrollToTop />
        <TooltipProvider>
          <Toaster />
          <Router />
          <GlobalBackButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
