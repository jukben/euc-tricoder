import {
  Subscription as BleSubscription,
  Device as BleDevice,
} from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { createAdapter, AdapterService } from '../api';
import { KS_SERVICE, KS_CHAR, KS_COMMANDS } from './constants';
import { decodeData } from './utils';

import { ExtractParameterType } from '../../types';

const NAME = 'KingSong 18-XL';

export type BleListener = ExtractParameterType<
  BleDevice['monitorCharacteristicForService'],
  2
>;

export type Listener = ExtractParameterType<AdapterService['addListener'], 0>;

export const ks18xl = createAdapter(NAME, device => {
  let monitorSubscription: BleSubscription | null = null;
  let onDisconnectSubscription: BleSubscription | null = null;
  let listeners: Array<Listener> = [];

  const handleListening: BleListener = (error, characteristics) => {
    if (error) {
      return;
    }

    if (characteristics && characteristics.value) {
      const bufferValue = Buffer.from(characteristics.value, 'base64').buffer;
      const data = decodeData(bufferValue);

      if (!data) {
        return;
      }

      return listeners.forEach(listener => {
        listener(data);
      });
    }
  };

  const handleDisconnect = () => {
    console.log('disconnect...');
  };

  const connect: AdapterService['connect'] = async () => {
    await device.connect();

    await device.discoverAllServicesAndCharacteristics();

    await device.readCharacteristicForService(KS_SERVICE, KS_CHAR);

    await device.writeCharacteristicWithoutResponseForService(
      KS_SERVICE,
      KS_CHAR,
      KS_COMMANDS.REQUEST_NAME,
    );

    onDisconnectSubscription = device.onDisconnected(handleDisconnect);

    monitorSubscription = device.monitorCharacteristicForService(
      KS_SERVICE,
      KS_CHAR,
      handleListening,
    );
  };

  const disconnect: AdapterService['disconnect'] = async () => {
    monitorSubscription && monitorSubscription.remove();
    onDisconnectSubscription && onDisconnectSubscription.remove();
    await device.cancelConnection();
    listeners = [];
  };

  const isConnected = () => device.isConnected();

  const addListener: AdapterService['addListener'] = listener =>
    listeners.push(listener) - 1;

  const removeListener: AdapterService['removeListener'] = id =>
    delete listeners[id];

  const getName = () => device.name || NAME;

  const getAdapterName = () => NAME;

  const getId = () => device.id;

  return {
    getId,
    getName,
    getAdapterName,
    connect,
    disconnect,
    isConnected,
    addListener,
    removeListener,
  };
});