import { CardType } from '../types/chamber';

export type StatusEntry = {
  title: string;
  group?: string;
  value: number | string;
  units: string;
};

type PhisicalProperty = {
  current: number;
  setValue: number;
  setValueMin: number;
  setValueMax: number;
  units: string;
  status: StatusEntry[];
};

export type PropertyAlarm = {
  high: Omit<PhisicalProperty, 'status' | 'setValue'>;
  low: Omit<PhisicalProperty, 'status' | 'setValue'>;
  band: Omit<PhisicalProperty, 'status' | 'setValue'>;
  diff: Omit<PhisicalProperty, 'status' | 'setValue'>;
};

export type SocketData =
  | ({
      [K in CardType]?: PhisicalProperty;
    } & {
      chamberEquipment: {
        heater: Pick<PhisicalProperty, 'current' | 'units'>;

        ambientTemperature: Pick<PhisicalProperty, 'current' | 'units'>;
      };
      chamberControl: {
        control: boolean;
        lights: boolean;
        thermostatMax: Omit<PhisicalProperty, 'status' | 'setValue'>;
        thermostatMin: Omit<PhisicalProperty, 'status' | 'setValue'>;
        screenSaver: Omit<PhisicalProperty, 'status' | 'setValue'>;
        sampleTime: Omit<PhisicalProperty, 'status' | 'setValue'>;
        tempUnits: boolean;
        events: { name: string }[];
      };
      safety: {
        temperatureSafety: Pick<PhisicalProperty, 'current' | 'units'>;
        temperatureHeater: Pick<PhisicalProperty, 'current' | 'units'>;
      };
      cooling: {
        condensingTemperature: Pick<PhisicalProperty, 'current' | 'units'>;
        dischargePressure: Pick<PhisicalProperty, 'current' | 'units'>;
        suctionPressure: Pick<PhisicalProperty, 'current' | 'units'>;
        evaporatorTemperature: Pick<PhisicalProperty, 'current' | 'units'>;
      };
      steamer: {
        humidifierTemperature: Pick<PhisicalProperty, 'current' | 'units'>;
        setValue: Pick<PhisicalProperty, 'current' | 'units'>;
        power: Pick<PhisicalProperty, 'current' | 'units'>;
      };
      chamberSettings: {
        ip: string;
        controllerModel: string;
        controllerVersion: string;
        releaseDate: string;
        controllerType: string;
        boardType: string;
        bios: string;
        boot: string;
        mainCycle: string;
        version: string;
        serialNumber: Omit<PhisicalProperty, 'status' | 'setValue' | 'units'>;
        maintainanceTime: Omit<PhisicalProperty, 'status' | 'setValue'>;
        chamber: Omit<PhisicalProperty, 'status' | 'setValue'>;
      };
      alarms: {
        delay: Pick<PhisicalProperty, 'current' | 'units'>;
        mute: Pick<PhisicalProperty, 'current' | 'units'>;
        beep: boolean;
        temperature: PropertyAlarm;
        humidity: PropertyAlarm;
      };
    })
  | null;

type MappedDataPoint = {
  WriteValue: number | boolean;
};

export type MappedSendDataToDataPoint = {
  [key: string]: MappedDataPoint;
};

export type ChartData = {
  label: Date[];
  data: {
    [key: string]: {
      currentValue: string[];
      setPoint: string[];
    };
  };
} | null;

export type RawAlarm = {
  Description: string;
  UpdatedAt: Date;
  Active: boolean;
  DataPoint: string;
};

export type Alarm = {
  description: string;
  date: Date;
  active: boolean;
};

export type AlarmHistory = Alarm[];
