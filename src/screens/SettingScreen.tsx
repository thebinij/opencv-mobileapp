import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {RadioButton} from 'react-native-paper';
import {Appbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen = () => {
  const [value, setValue] = useState('HAAR');

  const storeData = async (newvalue: string) => {
    try {
      await AsyncStorage.setItem('@modelType', newvalue);
    } catch (e) {
      // saving error
      console.log('error storing data', e);
    }
  };

  function changeValue(newvalue: string) {
    setValue(newvalue);
    storeData(newvalue);
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <View style={styles.wrapper}>
        <Text style={styles.text}>Model Type</Text>

        <RadioButton.Group
          onValueChange={newValue => changeValue(newValue)}
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
    backgroundColor: '#1212',
  },
  text: {
    fontWeight: 'bold',
    paddingBottom: 4,
  },
  wrapper: {
    paddingVertical: 10,
    alignItems: 'center',
    color: '#000',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
