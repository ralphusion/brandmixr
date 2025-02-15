import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { FontProvider } from "./contexts/FontContext";
import Input from "@/pages/input";
import Generate from "@/pages/generate";
import BrandVariations from "@/pages/brand-variations";
import MoodBoard from "@/pages/mood-board";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FontProvider>
        <Switch>
          <Route path="/" component={Input} />
          <Route path="/generate" component={Generate} />
          <Route path="/brand-variations" component={BrandVariations} />
          <Route path="/mood-board" component={MoodBoard} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </FontProvider>
    </QueryClientProvider>
  );
}

export default App;