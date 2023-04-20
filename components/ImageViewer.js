import { Image, StyleSheet } from 'react-native';

export default function ImageViewer({ placeholderImageSource, selectedImage }) {
    const imageSource = selectedImage !== null
      ? { uri: selectedImage }
      : placeholderImageSource;
  
    return <Image source={imageSource} style={styles.image} />;
  }

  const styles = StyleSheet.create({
    image: {
      width: 280,
      height: 280,
      resizeMode: 'contain',
    },
  });