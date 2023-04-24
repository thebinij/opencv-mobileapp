import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import AppNavigator from "./src/navigation/Navigation";

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
