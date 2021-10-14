import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
const useScreenDimensions = () => {
const [screenData, setScreenData] = useState(Dimensions.get('screen'));

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.screen);
      alert('rotation')
    };

    Dimensions.addEventListener('change', onChange);

    return () => Dimensions.removeEventListener('change', onChange);
  });

  return {
    ...screenData,
    isLandscape: screenData.width > screenData.height,
  };
};