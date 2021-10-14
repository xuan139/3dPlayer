import React, {useState,useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as MediaLibrary from 'expo-media-library';


 export default testingScreen = () => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('Begin');
  const [rotatedeg,setrotatedeg] = useState();
  const [heightValue, setheightValue] = useState(Dimensions.get('screen').height);
  const [widthValue, setwidthValue] = useState(Dimensions.get('screen').width);

  useEffect(() => {
    setwidthValue(Dimensions.get('screen').width);
    setheightValue(Dimensions.get('screen').height);
  })


  const rotate90andFlip = async () => {
    setStatus('Rotating...');
    const manipResult = await ImageManipulator.manipulateAsync(
      // image.localUri || image.uri,
      image,
      [{ rotate: 90}],
      [{aspect: [16, 9]}],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    console.log('manipResult',manipResult);
    setImage(manipResult.uri);
    setStatus('Rotated');
  };

  const pickImage = async () => {
    setStatus('Choose Image');
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    console.log('ori-image type is ',image.type);
    if (!image.cancelled) {
      setImage(image.uri);
      // rotate90andFlip();
    }

  };

  const makePost = async ()  => {
    let apiUrl='http://192.168.1.3:8000/trans3d/upload';
    let formData = new FormData();
    formData.append('image', {
      uri:image,
      name: 'image',
      type: image.type,
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
    console.log('formData',formData)
    console.log('option',apiUrl,options)
    setStatus('Begin Transfer...')
    fetch(apiUrl, options)
    .then((response) => response.json())
    .then((responseJson)=>{ 
        setImage('http://192.168.1.3:8000'+responseJson['file_url']);
        // rotate90andFlip();
        setStatus('Complete Transfer to 3D');
    }
    );

  };
  async function savePicture() {
    MediaLibrary.saveToLibraryAsync(image)
    setStatus('Saved View in Album');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyleGreen}
          onPress={pickImage}>
          <Image source={{uri: image}} 
            style={styles.img }
            height={heightValue}
            width={widthValue}
          />
        </TouchableOpacity>

      </ScrollView>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyleGreen}
          onPress={makePost}>
          <Text style={styles.textStyleWhite}>
            2d-3d
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyleGreen}
          onPress={savePicture}>
          <Text style={styles.textStyleWhite}>
            save
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyleGreen}
          onPress={rotate90andFlip}>
          <Text style={styles.textStyleWhite}>
            rotate
          </Text>
        </TouchableOpacity>
        <Text style={styles.buttonStyleGreen}>
            Status={status} 
          </Text>
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'stretch',
  },
  scrollView: {
    position: "absolute",
    backgroundColor: 'white',
    marginHorizontal: 1,
    // paddingTop:'100%',

  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 1,
  },
  textStyle: {
    padding: 1,
    color: 'black',
    textAlign: 'center',
  },
  textStyleGreen: {
    padding: 5,
    color: 'green',
  },
  textStyleWhite: {
    padding: 10,
    color: 'green',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: 'orange',
    marginVertical: 12,
    width: '100%',

  },
  buttonStyleGreen: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginVertical: 2,
    width: '100%',
  },

  buttonStyleBule: {
    alignItems: 'center',
    backgroundColor: 'blue',
    marginVertical: 2,
    width: '100%',
  },
  img:{
    flex: 1,
    resizeMode: "contain",
    backgroundColor: 'white',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    // transform:[{rotate:'90deg'}],
  },
});