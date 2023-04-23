import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import Button from "../components/common/Button";
("expo-image-picker");
import ImageViewer from "../components/common/ImageViewer";
import { COLORS, SIZES } from "../constants";
import axios from "axios";
import { Welcome } from "../components";
import * as ImagePicker from "expo-image-picker";

const backendURL =
  "https://opencv.hackhive.xyz";
const modelType = ["HAAR", "DNN"];

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelValue, setModelValue] = useState("HAAR");

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (result.canceled) {
      return;
    }
    const localUri = result.assets[0].uri;
    setFile(localUri);
    setSelectedImage(localUri);
  };

  const setFile = async (localUri) => {
    let filename = localUri.split("/").pop();
    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    setSelectedFile({ uri: localUri, name: filename, type });
  };

  const onFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendURL}/api/process-image`,
        formData,
        {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          },
          params: {
            model: modelValue,
          },
        }
      );
      setResultImage(response.data);
    } catch (error) {
      console.error("Error uploading and processing image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => <></>,
          headerTitle: "OpenCV Demo App",
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
            paddingBottom: resultImage ? 0 : 100,
          }}
        >
          <Welcome />

          <Button onPress={pickImage}>Pick an image</Button>

          {selectedImage && (
            <>
              <View style={styles.wrapper}>
                <Text style={{ fontWeight: "bold", paddingBottom: 4 }}>
                  Source Image
                </Text>
                <ImageViewer
                  placeholderImageSource=""
                  selectedImage={selectedImage}
                />
              </View>
              <View style={styles.wrapper}>
                <Text style={{ fontWeight: "bold", paddingBottom: 4 }}>
                  Model Type
                </Text>
                <FlatList
                  data={modelType}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.tab(modelValue, item)}
                      onPress={() => {
                        setModelValue(item);
                      }}
                    >
                      <Text style={styles.tabText(modelValue, item)}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item}
                  contentContainerStyle={{ columnGap: SIZES.small }}
                  horizontal
                />
              </View>
              <View style={styles.wrapper}>
                <Button onPress={onFileUpload} disabled={loading}>
                  {loading ? "Uploading..." : "Detect Faces"}
                </Button>
              </View>
            </>
          )}

          {resultImage && (
            <View style={styles.wrapper}>
              <Text style={{ fontWeight: "bold", paddingBottom: 4 }}>
                Result Image
              </Text>
              <ImageViewer
                width={400}
                height={400}
                placeholderImageSource=""
                selectedImage={resultImage}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  wrapper: {
    paddingVertical: 10,
    alignItems: "center",
  },
  tabsContainer: {
    width: "100%",
    marginTop: SIZES.medium,
  },
  tab: (modelType, item) => ({
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: modelType === item ? COLORS.secondary : COLORS.gray2,
  }),
  tabText: (modelType, item) => ({
    color: modelType === item ? COLORS.secondary : COLORS.gray2,
  }),
});
