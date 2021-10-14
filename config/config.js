import React, { useState, useEffect } from 'react';
import { Text, Image, RefreshControl, Platform , ScrollView,SafeAreaView,StyleSheet,Dimensions,TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Slider from '@react-native-community/slider';


const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
export default function settingScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const [image, setImage] = useState(null);
  const [isLandscape,setOrientation] = useState(false);
  const [rotateAngle,setRotateAngle] = useState(90);
  const [heightValue, setheightValue] = useState(Dimensions.get('screen').height);
  const [widthValue, setwidthValue] = useState(Dimensions.get('screen').width);

  useEffect(() => {
    const onChange = (result) => {
      if (result.screen.width>result.screen.height){
        rotate90andFlip();
      }
      console.log('on change screen height,width',result.screen.height,result.screen.width);
    };

    Dimensions.addEventListener('change', onChange);
    return () => Dimensions.removeEventListener('change', onChange);
  })

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
  
  
  const rotate90andFlip = async () => {
    const manipResult = await ImageManipulator.manipulateAsync(
      // image.localUri || image.uri,
      image,
      [{ rotate: 90}],
          // image.height = Dimensions.get('screen').height,
          // image.width = Dimensions.get('screen').width,
      // [{ resize: { 1960:1080}}],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    console.log('manipResult',manipResult);
    setImage(manipResult.uri);
  };
  const takephoto = async () => {
    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      // aspect: [16, 9],
      quality: 1,
    });
    console.log(image);

    if (!image.cancelled) {
      setImage(image.uri);
    }
  };

  const pickImage = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      quality: 1,
    });
    console.log('ori-image',image);
    if (!image.cancelled) {
      setImage(image.uri);
    }
  };


   return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
      contentContainerStyle={styles.scrollView}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

          <TouchableOpacity 
              // style={styles.button}
              activeOpacity={0.7}
              onPress={rotate90andFlip}
              onLongPress={pickImage}
            >

            <Image source={{uri: image}} 
                  style={styles.img }
                  height={heightValue}
                  width={widthValue}

            />

          </TouchableOpacity>

          <Text style={styles.text, {bottom:158,color:'red'}}>Height: {heightValue} </Text>
          <Slider style={styles.slider,{bottom:158,color:'red'}}
            maximumValue={1200}
            minimumValue={300}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#fff"
            step={1}
            value={heightValue}
            onValueChange={
              (heightValue) => setheightValue(heightValue)
            }
          />
          <Text style={styles.text, {bottom:258,color:'red'}}>Width : {widthValue} </Text>
          <Slider style={styles.slider,{bottom:258,color:'red'}}
            maximumValue={700}
            minimumValue={100}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#fff"
            step={1}
            value={widthValue}
            onValueChange={
              (widthValue) => setwidthValue(widthValue)
            }
          />
          </ScrollView >

    

    </SafeAreaView>
  );
  }
  

  
  const styles = StyleSheet.create({
    container: {
      // ...StyleSheet.absoluteFillObject,
      flex: 1,
      alignItems: 'stretch',
    },

    control: {
      position: "absolute",
      flexDirection: "row",
      bottom: 38,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },

    button: {
      alignItems: "center",
      backgroundColor: "#DDDDDD",
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      
    },

    scrollView: {
      // flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },

    slider: {
      bottom: 158,
    },

    img:{
      // flex: 1,
      resizeMode: "contain",
      backgroundColor: 'white',
      alignItems: 'center',
      // position:'absolute',left:0,bottom:0,right:0,top:0,resizeMode:'contain',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },


    countContainer: {
      alignItems: "center",
      padding: 10
    },


    text: {
      // flex: 1,
      color: "green",
      padding: 1,
      // flexDirection: 'row',
      // justifyContent: 'center',
      // alignItems: 'center',
      // backgroundColor: 'black',
      // bottom: 238,
    },
  });





 