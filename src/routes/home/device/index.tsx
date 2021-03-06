import { DeviceData } from '@euc-tricorder/adapters';
import { AlarmProvider, TelemetryProvider } from '@euc-tricorder/providers';
import { CustomNavigatorProps } from '@euc-tricorder/types';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { DetailScreen } from './detail';
import { OverviewScreen } from './overview';

export type Stack = {
  Overview: {};
  Detail: { characteristic: keyof DeviceData };
};

export type DeviceNavigatorProps<P extends keyof Stack> = CustomNavigatorProps<
  Stack,
  P
>;

const Device = createStackNavigator<Stack>();

export const DeviceScreen = () => {
  return (
    <TelemetryProvider>
      <AlarmProvider>
        <Device.Navigator>
          <Device.Screen
            name="Overview"
            component={OverviewScreen}
            options={{ headerShown: false }}
          />
          <Device.Screen name="Detail" component={DetailScreen} />
        </Device.Navigator>
      </AlarmProvider>
    </TelemetryProvider>
  );
};
