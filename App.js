import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Button from "./components/Button";
import React, { useState } from 'react';
import ImageViewer from "./components/ImageViewer";

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };


  return (
    <View style={styles.container}>
      <Text>Welcome to Open CV Demo App</Text>

      <Button onPress={pickImage} >Pick an image</Button>

      {selectedImage && <ImageViewer placeholderImageSource="" selectedImage={selectedImage} /> }

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }
});
