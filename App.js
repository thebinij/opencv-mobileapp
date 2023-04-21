import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "./components/Button";
import ImageViewer from "./components/ImageViewer";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";
import { useForm, Controller } from "react-hook-form";

const backendURL =
  "https://f0aa-2400-1a00-b050-4a4-b435-f0ac-6637-c07f.ngrok-free.app";

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control } = useForm();
  const [modelOpen, setModelOpen] = useState(false);
  const [modelValue, setModelValue] = useState(null);
  const [model, setModel] = useState([
    { label: "DNN", value: "dnn" },
    { label: "HAAR", value: "haar" },
  ]);

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
    <View style={styles.container}>
      <Text style={{ fontSize: 16, paddingVertical:10 }}>Welcome to Open CV Demo App</Text>

      <Button onPress={pickImage}>Pick an image</Button>

      {selectedImage && (
        <>
          <View style={styles.sourceContainer}>
            <Text style={{ fontWeight: "bold", paddingBottom: 4 }}>
              Source Image
            </Text>
            <ImageViewer
              placeholderImageSource=""
              selectedImage={selectedImage}
            />
          </View>
          <View style={styles.processImage}>
            <Controller
              name="model"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.dropdownModel}>
                  <DropDownPicker
                    style={styles.dropdown}
                    open={modelOpen}
                    value={modelValue}
                    items={model}
                    setOpen={setModelOpen}
                    setValue={setModelValue}
                    setItems={setModel}
                    placeholder="Select Model"
                    placeholderStyle={styles.placeholderStyles}
                    onChangeValue={onChange}
                  />
                </View>
              )}
            />

            <Button onPress={handleSubmit(onFileUpload)} disabled={loading}>
              {loading ? "Uploading..." : "Detect Faces"}
            </Button>
          </View>
        </>
      )}

      {resultImage && (
        <View style={styles.sourceContainer}>
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

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 70,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  sourceContainer: {
    paddingVertical: 10,
    alignItems: "center",
    zIndex: -1
  },
  placeholderStyles: {
    color: "grey",
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 40,
  },
  dropdownModel: {
    width: "35%",
    margin: 0,
  },
  processImage: {
    flexDirection: "row",
    gap: 6,
  },
});
