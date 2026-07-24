import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import GoogleAnalytics from "./components/GoogleAnalytics";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import ProductPlans from "./pages/ProductPlans";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutError from "./pages/CheckoutError";
import MembersDashboard from "./pages/members/Dashboard";
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

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
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
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/desacelere" component={Desacelere} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/checkout/error" component={CheckoutError} />
      <Route path="/checkout/:slug" component={Checkout} />
      
        {/* Members Area */}
      <Route path="/my-account" component={MyAccount} />
      <Route path="/dashboard" component={MembersDashboard} />
      <Route path="/my-account/products" component={MyProducts} />
      <Route path="/my-account/certificates" component={Certificates} />
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
      <Route path="/admin/customers" component={AdminCustomers} />
      <Route path="/admin/courses" component={AdminCourses} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/sales/:id" component={AdminOrderDetail} />
      
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
