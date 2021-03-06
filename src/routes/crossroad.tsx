import { TSettings, useSettings } from '@euc-tricorder/providers/settings';
import * as routes from '@euc-tricorder/routes';
import { CustomNavigatorProps } from '@euc-tricorder/types';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useReducer } from 'react';
import Tts from 'react-native-tts';

export type Stack = {
  Register: {};
  Home: {
    device: NonNullable<TSettings['device']>;
  };
};

export type CrossroadNavigatorProps<
  P extends keyof Stack
> = CustomNavigatorProps<Stack, P>;

const Root = createStackNavigator<Stack>();

type State =
  | { phase: 'loading' }
  | { phase: 'auto-connect'; device: NonNullable<TSettings['device']> }
  | { phase: 'register' };

type Action =
  | { type: 'init' }
  | { type: 'loaded'; device: TSettings['device'] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded': {
      const { device } = action;

      if (!device) {
        return { phase: 'register' };
      }

      return { phase: 'auto-connect', device };
    }

    default: {
      return state;
    }
  }
}

export const Crossroad: React.FC = () => {
  const { getSettingsForKey } = useSettings();
  const [state, dispatch] = useReducer(reducer, { phase: 'loading' });

  useEffect(() => {
    PushNotificationIOS.requestPermissions();
    Tts.setDucking(true);
    Tts.setIgnoreSilentSwitch('ignore');
  }, []);

  useEffect(() => {
    const getRememberedDevice = async () => {
      const rememberedDevice = await getSettingsForKey('device');
      dispatch({ type: 'loaded', device: rememberedDevice });
    };

    getRememberedDevice();
  }, [getSettingsForKey]);

  if (state.phase === 'loading') {
    return null;
  }

  return (
    <Root.Navigator
      initialRouteName={state.phase === 'auto-connect' ? 'Home' : 'Register'}
      screenOptions={{ headerShown: false }}>
      <Root.Screen
        name="Home"
        component={routes.Home}
        initialParams={
          state.phase === 'auto-connect' ? { device: state.device } : undefined
        }
      />
      <Root.Screen name="Register" component={routes.Register} />
    </Root.Navigator>
  );
};
