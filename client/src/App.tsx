import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Input from "@/pages/input";
import Generate from "@/pages/generate";
import BrandVariations from "@/pages/brand-variations";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Input} />
        <Route path="/generate" component={Generate} />
        <Route path="/brand-variations" component={BrandVariations} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;