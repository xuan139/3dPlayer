import React, { useRef,useState, useEffect } from 'react';
import {Text,Platform , ScrollView,SafeAreaView,StyleSheet,Dimensions,TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import Slider from '@react-native-community/slider';



export default function photoScreen() {
  const [image, setImage] = useState(null);
  const [heightValue, setheightValue] = useState(Dimensions.get('screen').height);
  const [widthValue, setwidthValue] = useState(Dimensions.get('screen').width);

  function setOrientation() {
    if (Dimensions.get('window').height > Dimensions.get('window').width) {
      //Device is in portrait mode, rotate to landscape mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
    else {
      //Device is in landscape mode, rotate to portrait mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
  }


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

  const pickImage = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });


    console.log('ori-image type is ',image.type);
    if (!image.cancelled) {
      setImage(image.uri);
      console.log(image);
    }

  };


   return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
    <Video
      source={{ uri: image }}
      resizeMode="cover"
      // shouldPlay
      onFullscreenUpdate={setOrientation}
      useNativeControls
      style={{ width: Dimensions.get('window').width, height: 200 }}
        />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={pickImage}>
        <Text style={styles.textStyleWhite}>浏览本机</Text>
      </TouchableOpacity>
      <Text style={styles.text, {top:398,color:'green'}}>adjust  : {widthValue} </Text>
      <Slider style={{top:398,color:'green'}}
          maximumValue={1600}
          minimumValue={1500}
          minimumTrackTintColor="#0ff"
          maximumTrackTintColor="#ff0"
          step={1}
          value={widthValue}
          onValueChange={
            (widthValue) => setwidthValue(widthValue)
          }
        />
    </ScrollView>
    </SafeAreaView>
  );
  }
  

  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFF',
      flex: 1,
    },
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 40,
    },
    textStyleWhite: {
      padding: 30,
      color: 'green',
    },
    text: {
      marginTop: 36,
      marginBottom: 12,
    },

    slider: {
      bottom: 158,
    },
  });





 