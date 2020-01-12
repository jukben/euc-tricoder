import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { useAdapter } from '../../../providers';

export const Speedometer = () => {
  const [speed, setSpeed] = useState(0);

  const { adapter } = useAdapter();

  useEffect(() => {
    if (!adapter) {
      return;
    }

    const id = adapter.addListener(({ speed: s }) => {
      setSpeed(s);
    });

    return () => adapter.removeListener(id);
  }, [adapter]);

  return <Text>Speedometer: {speed}</Text>;
};
