import React, { useState, useEffect } from 'react';
import { Text,Button,TouchableOpacity, StyleSheet,Dimensions, ScrollView,SafeAreaView,RefreshControl } from 'react-native';
import { Video } from 'expo-av';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as ScreenOrientation from 'expo-screen-orientation';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};


export default function videoScreen() {

  const [videourl, setVideo] = useState(null);
  const [serverIp, setserverIp] = useState('http://139.155.179.142/');
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [status, setStatus] = useState('Status');

  function setOrientation() {
    if (Dimensions.get('window').height > Dimensions.get('window').width) {
      //Device is in portrait mode, rotate to landscape mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    else {
      //Device is in landscape mode, rotate to portrait mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }

  const downloadFile = async (filename)=> {
    let uri = serverIp + filename
    let fileUri = FileSystem.documentDirectory + filename;
    setStatus('downloading');
    FileSystem.downloadAsync(uri, fileUri)
       .then(({
          uri
       }) => {
        setStatus('saving to mobile');
        MediaLibrary.saveToLibraryAsync(uri)
        setStatus('saved');
       })
       .catch(error => {
          console.error(error);
       })
 }
 

return (
  <SafeAreaView style={styles.container}>

  <ScrollView 
      contentContainerStyle={styles.scrollView}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* <Text>Pull down </Text> */}
    <StatusBar style="auto" />
    <Text>{status}</Text>
    <Video
        source={{ uri: serverIp + 'zhz1output.mp4' }}
        resizeMode="cover"
        // shouldPlay
        onFullscreenUpdate={setOrientation}
        useNativeControls
        style={{ width: Dimensions.get('window').width, height: 200 }}
      />
        <Button
          title={'???????????????'}
          onPress={() =>
            downloadFile('zhz1output.mp4')
          }
        />
    <Video
        source={{ uri: serverIp + 'yanxi1.mp4' }}
        resizeMode="cover"
        // shouldPlay
        onFullscreenUpdate={setOrientation}
        useNativeControls
        style={{ width: Dimensions.get('window').width, height: 200 }}
      />
        <Button
          title={'??????1??????'}
          onPress={() =>
            downloadFile('yanxi1.mp4')
          }
        />
      <Video
        source={{ uri: serverIp + 'fish.mp4' }}
        resizeMode="cover"
        // shouldPlay
        onFullscreenUpdate={setOrientation}
        useNativeControls
        style={{ width: Dimensions.get('window').width, height: 200 }}
      />
        <Button
          title={'fish ??????'}
          onPress={() =>
            downloadFile('fish.mp4')
          }
        />
      <Video
        source={{ uri: serverIp + 'dilireb1.mp4' }}
        resizeMode="cover"
        // shouldPlay
        onFullscreenUpdate={setOrientation}
        useNativeControls
        style={{ width: Dimensions.get('window').width, height: 200 }}
      />
        <Button
          title={'??????????????????'}
          onPress={() =>
            downloadFile('dilireb1.mp4')
          }
        />
      <Video
        source={{ uri: serverIp  + 'yanxi2.mp4' }}
        resizeMode="cover"
        // shouldPlay
        onFullscreenUpdate={setOrientation}
        useNativeControls
        style={{ width: Dimensions.get('window').width, height: 200 }}
      />
        <Button
          title={'??????2??????'}
          onPress={() =>
            downloadFile('yanxi2.mp4')
          }
        />
        <Video
        source={{ uri: serverIp + 'yanxi3.mp4' }}
        resizeMode="cover"
        // shouldPlay
        onFullscreenUpdate={setOrientation}
        useNativeControls
        style={{ width: Dimensions.get('window').width, height: 200 }}
      />
        <Button
          title={'??????3??????'}
          onPress={() =>
            downloadFile('yanxi3.mp4')
          }
        />
    <Video
        source={{ uri: serverIp + 'yanxi4.mp4' }}
        resizeMode="cover"
        // shouldPlay
        onFullscreenUpdate={setOrientation}
        useNativeControls
        style={{ width: Dimensions.get('window').width, height: 200 }}
      />
        <Button
          title={'??????4??????'}
          onPress={() =>
            downloadFile('yanxi4.mp4')
          }
        />


    <Video
        source={{ uri: serverIp + 'yanxi5.mp4' }}
        resizeMode="cover"
        // shouldPlay
        onFullscreenUpdate={setOrientation}
        useNativeControls
        style={{ width: Dimensions.get('window').width, height: 200 }}
      />
        <Button
          title={'??????5??????'}
          onPress={() =>
            downloadFile('yanxi5.mp4')
          }
        />
      <Video
        source={{ uri: serverIp + 'yanxi6.mp4' }}
        resizeMode="cover"
        // shouldPlay
        onFullscreenUpdate={setOrientation}
        useNativeControls
        style={{ width: Dimensions.get('window').width, height: 200 }}
      />
        <Button
          title={'??????6??????'}
          onPress={() =>
            downloadFile('yanxi6.mp4')
          }
        />



  </ScrollView >
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  textStyleWhite: {
    padding: 10,
    color: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    // flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: 'orange',
    marginVertical: 1,
    width: '100%',
  },
  button: {
    alignItems: "center",
    backgroundColor: "pink",
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    
  },
});