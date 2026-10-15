import { createRoot } from "react-dom/client";
import App from "./App";
import { loadLanguage } from "./i18n";
import { ToastProvider } from "./components/ui";
import "./tokens/tokens.css";
import "./styles.css";
import "./interfaces/interfaces.css";
// The catalogue loads first, so the first screen is already in the right language.
void loadLanguage().then(() =>
  createRoot(document.getElementById("root")!).render(
    <ToastProvider>
      <App />
    </ToastProvider>
  ),
);
