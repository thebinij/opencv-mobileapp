import AppNavigator from "./navigation/Navigation";

import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";

export default function App() {
  const theme = {
    ...DefaultTheme,
  };
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}
