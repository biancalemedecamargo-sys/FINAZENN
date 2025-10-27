import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Investments from "./pages/Investments";
import Debts from "./pages/Debts";
import Goals from "./pages/Goals";
import Insights from "./pages/Insights";
import Config from "./pages/Config";
import Home from "./pages/Home";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation(getLoginUrl());
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Component />;
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/"} component={() => user ? <Dashboard /> : <Home />} />

      {/* Protected Routes */}
      <Route path={"/dashboard"} component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path={"/transactions"} component={() => <ProtectedRoute component={Transactions} />} />
      <Route path={"/investments"} component={() => <ProtectedRoute component={Investments} />} />
      <Route path={"/debts"} component={() => <ProtectedRoute component={Debts} />} />
      <Route path={"/goals"} component={() => <ProtectedRoute component={Goals} />} />
      <Route path={"/insights"} component={() => <ProtectedRoute component={Insights} />} />
      <Route path={"/config"} component={() => <ProtectedRoute component={Config} />} />

      {/* 404 */}
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

