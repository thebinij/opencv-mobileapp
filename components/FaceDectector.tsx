import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { FileMeta } from "../utils/types";
import * as ImagePicker from "expo-image-picker";
import { BACKEND_URL, SIZES } from "../utils/constants";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button, ProgressBar } from "react-native-paper";
import ImageViewer from "./ImageViewer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FaceDectector = () => {
  const [hasGalleryPermission, setHasGalleryPermission] =
    useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState<FileMeta | any>(null);
  const [loading, setLoading] = useState(false);
  const [modelValue, setModelValue] = useState("HAAR");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        setHasGalleryPermission(status === "granted");
      }
    })();
  }, []);

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

  if (hasGalleryPermission === false) {
    return <Text>No access to Internal Storage</Text>;
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@modelType");
      if (value !== null) {
        // value previously stored
        setModelValue(value);
      }
    } catch (e) {
      // error reading value
      console.log("error reading data", e);
    }
  };

  const setFile = async (localUri: string) => {
    let filename = localUri.split("/").pop();
    if (!filename) return;
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    setSelectedFile({ uri: localUri, name: filename, type });
  };

  const processImage = async () => {
    if (!selectedFile) return;
    await getData();
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      setLoading(true);
      const response: AxiosResponse = await axios.post(
        `${BACKEND_URL}/api/process-image`,
        formData,
        {
          headers: {
            "Content-Type": `multipart/form-data`,
          },
          params: {
            model: modelValue,
          },
        }
      );

      setResultImage(response.data);
    } catch (error: AxiosError | any) {
      if (error.response) {
        console.error(
          `Request failed with status code ${error.response.status}:`,
          error.response.data
        );
      } else if (error.request) {
        console.error("Request failed:", error.request);
      } else {
        console.error("Unknown error occurred:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View
        style={{
          flex: 1,
          padding: SIZES.medium,
          paddingBottom: resultImage ? 0 : 100,
        }}
      >
        <Button icon="camera" mode="contained" onPress={pickImage}>
          Pick an image
        </Button>

        {selectedImage && (
          <>
            <View style={styles.wrapper}>
              <Text style={{ fontWeight: "bold", paddingBottom: 4 }}>
                Source Image
              </Text>
              <ImageViewer selectedImage={selectedImage} />
            </View>

            <View style={styles.wrapper}>
              <Button
                mode="contained"
                onPress={processImage}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Detect Faces"}
              </Button>
            </View>

            <ProgressBar visible={loading} indeterminate />

            {resultImage && (
              <View style={styles.wrapper}>
                <Text style={{ fontWeight: "bold", paddingBottom: 4 }}>
                  Result Image
                </Text>
                <ImageViewer
                  width={400}
                  height={400}
                  selectedImage={resultImage}
                />
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default FaceDectector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  wrapper: {
    paddingVertical: 10,
    alignItems: "center",
  },
});
