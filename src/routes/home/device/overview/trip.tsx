import { useSettings } from '@euc-tricorder/providers';
import React, { useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';

const Container = styled.View`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #ededed;
  background: #fafafa;
  position: absolute;
  bottom: 0;
  padding: 5px;
`;

type Props = {
  distance: number;
};

const initialState = {
  running: false,
  initialDistance: 0,
};

export type TTrip = typeof initialState;

export const Trip = ({ distance }: Props) => {
  const [trip, setTrip] = useState(initialState);
  const { getSettingsForKey, setSettingsForKey } = useSettings();

  useEffect(() => {
    const rehydrateState = async () => {
      const data = await getSettingsForKey('trip');
      if (!data) {
        return;
      }
      setTrip(data);
    };

    rehydrateState();
  }, [getSettingsForKey]);

  useEffect(() => {
    const saveState = () => {
      setSettingsForKey('trip', trip);
    };

    saveState();
  }, [setSettingsForKey, trip]);

  const { running, initialDistance } = trip;

  const handleTripStart = () => {
    setTrip((prev) => ({
      running: !prev.running,
      initialDistance: distance,
    }));
  };

  return (
    <Container>
      {running ? (
        <Text>{(distance - initialDistance).toFixed(1)} Km</Text>
      ) : (
        <Text>To start measuring your trip, press the arrow...</Text>
      )}
      <Pressable onPress={handleTripStart}>
        <Icon name={running ? 'check' : 'play'} size={26} />
      </Pressable>
    </Container>
  );
};
