import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingScreen from "../screens/SettingScreen";
import HomeScreen from "../screens/HomeScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen}  options={{
          tabBarIcon(props){
            return <Ionicons size={20} name={props.focused ? "home" : "ios-home-outline"} />
          }
        }} />
        <Tab.Screen name="Settings" component={SettingScreen}  options={{
          tabBarIcon(props){
            return <Ionicons size={20} name={props.focused ? "ios-settings" : "ios-settings-outline"} />
          }
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
