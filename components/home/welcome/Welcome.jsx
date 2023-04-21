import {
  View,
  Text
} from "react-native";

import styles from "./welcome.style";


const Welcome = () => {
  return (
    <View  style={{paddingBottom:10 }}> 
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome User</Text>
      </View>

    </View>
  );
};

export default Welcome;
