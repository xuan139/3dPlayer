import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import cameraScreen from './camera/camera.js';
import photoScreen from './photo/photo.js';
import videoScreen from './video/video.js';
import settingScreen from './config/config.js';
import photomaniuplation from './photo/photomaniuplation';
import webViewScreen from './video/videoweb.js';
const Tab = createMaterialBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="3D拍照"
        activeColor="#e91e63"
        barStyle={{ backgroundColor: '' }}

      >
        <Tab.Screen
          name="3D"
          component={cameraScreen}
          options={{
            tabBarLabel: '3D拍照',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="camera" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Photo"
          component={photoScreen}
          options={{
            
            tabBarLabel: '3D视频',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="image" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="video"
          component={videoScreen}
          options={{
            tabBarLabel: '在线3D',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="movie" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="webViewScreen"
          component={webViewScreen}
          // screenOptions={{ presentation: 'modal' }}
          options={{
            tabBarLabel: 'WEB',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="movie" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="setting"
          component={settingScreen}
          options={{
            tabBarLabel: '设置',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="menu-open" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}




// const Tab = createMaterialBottomTabNavigator();

// // const Drawer = createDrawerNavigator();

// export default function App() {
//   return (
//     <Tab.Navigator>
//         <Tab.Screen name="3D拍照" component={cameraScreen} />
//         <Tab.Screen name="浏览本机" component={photoScreen} />
//         <Tab.Screen name="浏览视频" component={videoScreen} />
//         <Tab.Screen name="3D设置" component={settingScreen} /> 
//     </Tab.Navigator>
//     );
// }