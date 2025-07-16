import { ChatPage } from "@/pages";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

export default function App() {
  return (
    <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
      <CssBaseline />
      <ChatPage />
    </ThemeProvider>
  );
}
