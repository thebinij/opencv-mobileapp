import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Appbar} from 'react-native-paper';
import FaceDectector from '../components/FaceDectector';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="OpenCV Demo App" />
      </Appbar.Header>
      <FaceDectector />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },
});
