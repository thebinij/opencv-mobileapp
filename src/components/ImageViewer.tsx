import { Image, StyleSheet } from 'react-native';

interface ImageViewerProps {
    selectedImage: string | { uri: string };
    width?: number;
    height?: number;
  }
  
  export default function ImageViewer({  selectedImage, width = 120, height = 120 }: ImageViewerProps) {
    const imageSource = typeof selectedImage === 'string' ? { uri: selectedImage } : selectedImage;
  
    return <Image source={imageSource} style={[styles.image, { width, height }]} />;
  }
  
  const styles = StyleSheet.create({
    image: {
      resizeMode: 'contain',
    },
  });