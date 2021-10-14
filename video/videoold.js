import React, { useState, useEffect } from 'react';
import { Text ,View, StyleSheet, Button,Dimensions, TouchableOpacity } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { DateTime } from 'luxon';

export default function videoScreenold() {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [videourl, setVideo] = useState(null);

  const pickVideo = async () => {
    let videoPick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      // allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    console.log('ori-video type is ',videoPick.type);
    if (!videoPick.cancelled) {
      setVideo(videoPick.uri);
    }

  };

  const makePost = async ()  => {
    let apiUrl='http://192.168.1.3:8000/trans3d/uploadVideo';
    let formData = new FormData();
    formData.append('video', {
      uri:videourl,
      name: 'name',
      type: 'video',
    });
    
    console.log('formData',formData);
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    console.log('option',apiUrl,options)
    // setImage('http://192.168.1.6:8000/media/test_y1S4o3bto3d.png')
    fetch(apiUrl, options)
    .then((response) => response.json())
    .then((responseJson) => {
        setVideo('http://www.uiuchome.com/target.mp4')
        console.log(responseJson['file_url'])}
        // setImage(responseJson['file_url'])
      );

    };

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: videourl,
        }}

        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Text style={styles.recordTitle}></Text>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
      </View>

      <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={pickVideo}>
          <Text style={styles.textStyleWhite}>
            Choose Video
          </Text>
        </TouchableOpacity>

      <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={makePost}>
          <Text style={styles.textStyleWhite}>
            Transfer to 3d Video
          </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    width: 1984,
    height: 1080,
    // minWidth: Dimensions.get('screen').height,
    // minHeight: Dimensions.get('screen').width+190,
    transform: [{ rotate: '90deg'}],
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: 'orange',
    marginVertical: 10,
    width: '100%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});