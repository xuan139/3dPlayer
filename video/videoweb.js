import React, { useState, useEffect } from 'react';
import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';

export default function videoWebScreen() {
    return (
          <WebView 
            allowsFullscreenVideo={true} 
            allowsBackForwardNavigationGestures={true}
            style={{ marginTop: 20 }}
            source={{ uri: 'http://139.155.179.142' }}
          />

      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },


});


// import React, { useState, useEffect } from 'react';
// import { Text,Button,View,FlatList,TouchableOpacity, StyleSheet,Dimensions, ScrollView,SafeAreaView,RefreshControl } from 'react-native';
// import { Video } from 'expo-av';
// import * as ScreenOrientation from 'expo-screen-orientation';
// import * as MediaLibrary from 'expo-media-library';
// import * as FileSystem from 'expo-file-system';
// import Constants from 'expo-constants';
// import { StatusBar } from 'expo-status-bar';

// const wait = timeout => {
//   return new Promise(resolve => {
//     setTimeout(resolve, timeout);
//   });
// };


// export default function videoWebScreen () {
//   const [serverIp, setserverIp] = useState('http://139.155.179.142/');
//   const [isLoading, setLoading] = useState(true);
//   const [data, setData] = useState([]);
//   console.log(data);

//   const [refreshing, setRefreshing] = React.useState(false);
//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);

//     wait(2000).then(() => setRefreshing(false));
//   }, []);

//   const [status, setStatus] = useState('Status');

//   function setOrientation() {
//     if (Dimensions.get('window').height > Dimensions.get('window').width) {
//       //Device is in portrait mode, rotate to landscape mode.
//       ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
//     }
//     else {
//       //Device is in landscape mode, rotate to portrait mode.
//       ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
//     }
//   }

//   const downloadFile = async (filename)=> {
//     let uri = serverIp + filename
//     let fileUri = FileSystem.documentDirectory + filename;
//     setStatus('downloading');
//     FileSystem.downloadAsync(uri, fileUri)
//        .then(({
//           uri
//        }) => {
//         setStatus('saving to mobile');
//         MediaLibrary.saveToLibraryAsync(uri)
//         setStatus('saved');
//        })
//        .catch(error => {
//           console.error(error);
//        })
//  }

//   useEffect(() => {
//     fetch('http://139.155.179.142/videolist.json')
//       .then((response) => response.json())
//       .then((json) => setData(json))
//       .catch((error) => console.error(error))
//       .finally(() => setLoading(false));
//   }, []);

//   return (

//     <SafeAreaView style={{ flex: 1, padding: 24 }}>
//       {isLoading ? <Text>Loading...</Text> : 
//       ( <ScrollView 

//         contentContainerStyle={styles.scrollView}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
//         {/* <Text style={{ fontSize: 18, color: 'green', textAlign: 'center'}}>{data.title}</Text> */}
//         <Text style={{ fontSize: 14, color: 'green', textAlign: 'center', paddingBottom: 10}}>VIDEOS:</Text>
//         <Text>{status}</Text>
//           <FlatList
//             scrollEnabled={false} // this line is important
//             data={data.videolist}
//             keyExtractor={({ id }, index) => id}
//             renderItem={({ item }) => (
//               <View>

//               <Text>{item.title}</Text>     
//               <Video
//                   source={{ uri: serverIp + item.name }}
//                   resizeMode="cover"
//                   // shouldPlay
//                   onFullscreenUpdate={setOrientation}
//                   useNativeControls
//                   style={{ width: Dimensions.get('window').width, height: 200 }}
//                 />

//               <Button
//                 title={item.title}
//                 onPress={() =>
//                 downloadFile(item.name)
//                 }
//               />
//               </View>         
//             )}

//           />
//         </ScrollView>
//       )}
//       </SafeAreaView>
//     );
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       marginTop: Constants.statusBarHeight,
//     },
//     textStyleWhite: {
//       padding: 10,
//       color: 'green',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     scrollView: {
//       // flex: 1,
//       backgroundColor: 'white',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     buttonStyle: {
//       alignItems: 'center',
//       backgroundColor: 'orange',
//       marginVertical: 1,
//       width: '100%',
//     },
//     button: {
//       alignItems: "center",
//       backgroundColor: "pink",
//       padding: 10,
//       flexDirection: 'row',
//       justifyContent: 'center',
      
//     },
//   });