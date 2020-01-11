import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { BleManager, State } from 'react-native-ble-plx';

const BleAPI = {
  manager: (null as unknown) as BleManager,
  state: 'Unknown' as State,
};

export type BleAPI = typeof BleAPI;

const BleContext = React.createContext<BleAPI>(BleAPI);

export const useBle = () => useContext(BleContext);

export const BleProvider: React.FC = ({ children }) => {
  const bleManagerRef = useRef<BleManager>(
    new BleManager({
      restoreStateIdentifier: 'eucmonitor',
    }),
  );
  const [state, setState] = useState<State>('Unknown' as State);

  useEffect(() => {
    bleManagerRef.current.onStateChange(newState => {
      setState(newState);
    });
  }, []);

  const api = useMemo(() => ({ manager: bleManagerRef.current, state }), [
    state,
  ]);

  return <BleContext.Provider value={api}>{children}</BleContext.Provider>;
};
