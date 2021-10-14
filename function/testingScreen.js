import * as ScreenOrientation from 'expo-screen-orientation'
import { View,Button,Share,Dimensions, ScrollView, StyleSheet, Text } from 'react-native'
import { Video } from 'expo-av'
import { setStatusBarHidden } from 'expo-status-bar'
import React, { useRef, useState,useEffect } from 'react'
import VideoPlayer from 'expo-video-player'
// import { Constants, FileSystem } from 'expo';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function testingScreen(){
  const [status, setStatus] = useState('Begin');
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []
  )



  const downloadFile = async ()=> {
    let uri = "http://139.155.179.142:3000/ron.mp4"
    let fileUri = FileSystem.documentDirectory + "ron.mp4";
    setStatus('begin downloading');
    FileSystem.downloadAsync(uri, fileUri)
       .then(({
          uri
       }) => {
        setStatus('begin save to local');
        MediaLibrary.saveToLibraryAsync(uri)
        setStatus('save to local success');
       })
       .catch(error => {
          console.error(error);
       })
 }
 

//  const saveFile = async (fileUri) => {
//   const {
//      status
//   } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
//   if (status === "granted") {
//     console.log(fileUri)
//      const asset = await MediaLibrary.createAssetAsync(fileUri)
//      await MediaLibrary.createAlbumAsync("Download", asset, false)
//   }
// }
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
      }}
    >
        <Text>
            Status={status} 
          </Text>
      <Button          
        title="download..."
        onPress={downloadFile}
        />
    </View>
  );
}




