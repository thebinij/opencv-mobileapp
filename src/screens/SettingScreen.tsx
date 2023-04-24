import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RadioButton} from 'react-native-paper';
import {Appbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = () => {
  const [value, setValue] = useState('HAAR');

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem('@modelType', value);
    } catch (e) {
      // saving error
      console.log('error storing data', e);
    }
  };

  useEffect(() => {
    // Update localStorage when `value` changes
    storeData(value);
  }, [value]);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Settings"></Appbar.Content>
      </Appbar.Header>
      <View style={styles.wrapper}>
        <Text style={{fontWeight: 'bold', paddingBottom: 4}}>Model Type</Text>

        <RadioButton.Group
          onValueChange={newValue => setValue(newValue)}
          value={value}>
          <View style={styles.radioButtonContainer}>
            <Text>DNN</Text>
            <RadioButton value="DNN" />

            <Text>HAAR</Text>
            <RadioButton value="HAAR" />
          </View>
        </RadioButton.Group>
      </View>
    </View>
  );
};

export default SettingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
