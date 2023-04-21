import { Image, StyleSheet } from 'react-native';

export default function ImageViewer({ placeholderImageSource, selectedImage,width=120, height=120 }) {
    const imageSource = selectedImage !== null
      ? { uri: selectedImage }
      : placeholderImageSource;
  
    return <Image source={imageSource} style={[styles.image, { width, height }]} />;
  }

  const styles = StyleSheet.create({
    image: {
      resizeMode: 'contain',
    },
  });