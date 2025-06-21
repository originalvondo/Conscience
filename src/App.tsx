import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MagazinePage from "./pages/MagazinePage";
import CreateMagazine from "./pages/CreateMagazine";
import AuthPage from "./pages/AuthPage";
import AuthorPage from "./pages/AuthorPage";
import NotFound from "./pages/NotFound";
import AuthorsPage from "./pages/AuthorsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path={`${__BASE_URL__}`} element={<Index />} />
          <Route path={`${__BASE_URL__}/authors`} element={<AuthorsPage />} />
          <Route path={`${__BASE_URL__}/magazine/:slug`} element={<MagazinePage />} />
          <Route path={`${__BASE_URL__}/magazine/create`} element={<CreateMagazine />} />
          {/* <Route path={`${__BASE_URL__}/auth`} element={<AuthPage />} /> */}
          <Route path={`${__BASE_URL__}/author/:username`} element={<AuthorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
