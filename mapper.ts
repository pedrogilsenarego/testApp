import { Alarm, AlarmHistory, RawAlarm, SocketData } from './types';

export const sentDataKeys = {
  SET_DATA: 'setdata',
  GET_ALARM_HISTORY: 'getAlarmHistory',
  DROP_ALARM_HISTORY: 'dropAlarmHistory',
  DROP_ACTIVE_ALARM: 'dropActiveAlarm',
  MUTE_ACTIVE_ALARM: 'muteActiveAlarm',
  GET_CHART_DATA: 'getChartData',
  TEST_ALARM: 'testAlarm'
};

export const receiveDataKeys = {
  DATA_POINTS: 'data',
  CURRENT_DATE_TIME: 'currentDateTime',
  CHART_DATA: 'chartData',
  ALARM_HISTORY: 'alarmHistory',
  NEW_ALARM: 'newAlarm'
};

export const dataPointsKeys = {
  temperature: {
    setPoint: 'UC1.TemperatureSetpoint',
    probe: 'UC1.TemperatureProbe',
    probe2: 'UC1.TemperatureProbe2',
    mobile: 'UC1.TemperatureMobile',
    air: 'UC1.TemperatureAir',
    softCool: 'UC1.PowerTL2',
    heat: 'UC1.PowerTL1',
    cool: 'UC1.PowerCool',
    integrator: 'UC1.YiT'
  },
  humidity: {
    setPoint: 'UC1.HumiditySetpoint',
    probe: 'UC1.HumidityProbe',
    probe2: 'UC1.HumidityProbe2',
    humidify: 'UC1.PowerHL1',
    dry: 'UC1.PowerHL2',
    integrator: 'UC1.YiH'
  },
  co2: { setPoint: '' },
  radiation: { setPoint: '' },
  chamberEquipment: {
    heater: 'UC1.HeaterTemperature',
    ambientTemperature: 'UC2.TemperatureAmbient',
    safety: {
      temperatureSafety: 'UC2.TemperatureSafety',
      teamperatureHeater: 'UC2.HeaterTemperature'
    },
    cooling: {
      condensingTemperature: 'UC1.CondensingTemperature',
      dischargePressure: 'UC1.DischargePressure',
      suctionPressure: 'UC1.SuctionPressure',
      evaporatorPressure: 'UC1.EvaporatorTemperature'
    },
    steamer: {
      humidifierTemperature: 'UC1.HumidifierTemperature',
      setValue: 'UC1.xSP_STEAMER',
      power: 'UC1.PowerSteamer'
    }
  },
  controlChamber: {
    controlPower: 'UC1.CONTROL_ON',
    controlLights: 'UC1.CHAMBER_LIGHT',
    thermostatMax: 'UC2.xMAX_TEMP',
    thermostatMin: 'UC2.xMIN_TEMP',
    screenSaver: 'HMI.ScreenCounter',
    sampleTime: 'HMI.SAMPLE_TIME',
    tempUnits: 'HMI.TemperatureUnit',
    events: [
      'UC1.Event0',
      'UC1.Event1',
      'UC1.Event2',
      'UC1.Event3',
      'UC1.Event4',
      'UC1.Event5',
      'UC1.Event6',
      'UC1.Event7'
    ]
  },
  settingsChamber: {
    ip: {
      one: 'HMI.xIPAddress1',
      two: 'HMI.xIPAddress2',
      three: 'HMI.xIPAddress3',
      four: 'HMI.xIPAddress4'
    },
    controllerModel: 'HMI.PLCVersion',
    controllerVersion: 'HMI.Version',
    releaseDate: 'HMI.ReleaseDate',
    controllerType: 'HMI.PLCType',
    boardType: 'HMI.BoardType',
    bios: 'HMI.BIOS',
    boot: 'HMI.Boot',
    mainCycle: 'HMI.MainCycle',
    serialNumber: 'HMI.SERIAL_NUMBER',
    maintainance: 'HMI.MaintenanceTime',
    chamberTime: 'HMI.ChamberTime',
    version: 'HMI.Version'
  },
  alarms: {
    delay: 'UC1.xALARM_DELAY',
    mute: 'UC1.xALARM_MUTE',
    beep: 'HMI.BLINK_ALARM',
    temperature: {
      high: 'UC1.xALARM_0_0',
      low: 'UC1.xALARM_0_1',
      band: 'UC1.xALARM_0_2',
      diff: 'UC2.xDIF_T'
    },
    humidity: {
      high: 'UC1.xALARM_1_0',
      low: 'UC1.xALARM_1_1',
      band: 'UC1.xALARM_1_2',
      diff: 'UC2.xDIF_H'
    }
  }
};

export const mapNewAlarmHistory = (newData: any[]): AlarmHistory => {
  if (!newData) return [];
  const mappedHistory = newData.map(
    (point: RawAlarm): Alarm => ({
      description: point.Description,
      date: point.UpdatedAt,
      active: point.Active
    })
  );
  return mappedHistory;
};

export const mapNewDataToSocketData = (newData: any): SocketData => {
  const mappedData = {
    temperature: {
      current:
        newData[dataPointsKeys.temperature.probe]?.ActualValue.toFixed(1) ||
        'OFF',
      setValue:
        newData[dataPointsKeys.temperature.setPoint]?.ActualValue.toFixed(1) ||
        'OFF',
      setValueMin:
        newData[dataPointsKeys.temperature.setPoint]?.Minimum || 'OFF',
      setValueMax:
        newData[dataPointsKeys.temperature.setPoint]?.Maximum || 'OFF',
      units: newData[dataPointsKeys.temperature.probe]?.Units || 'Undefined',
      status: [
        {
          title: 'Process Value',
          value:
            newData[dataPointsKeys.temperature.probe]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.temperature.probe]?.Units
        },
        {
          title: 'Set Value',
          group: 'Power',
          value:
            newData[dataPointsKeys.temperature.setPoint]?.ActualValue.toFixed(
              1
            ),
          units: newData[dataPointsKeys.temperature.setPoint]?.Units
        },
        {
          title: 'T2',
          value:
            newData[dataPointsKeys.temperature.probe2]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.temperature.probe2]?.Units
        },
        {
          title: 'Mobile',
          value:
            newData[dataPointsKeys.temperature.mobile]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.temperature.mobile]?.Units
        },
        {
          title: 'Air',
          value:
            newData[dataPointsKeys.temperature.air]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.temperature.air]?.Units
        },
        {
          title: 'Capicitive (TCap)',
          value:
            newData[dataPointsKeys.temperature.probe2]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.temperature.probe2]?.Units
        },

        {
          title: 'Soft Cool',
          value:
            newData[dataPointsKeys.temperature.softCool]?.ActualValue.toFixed(
              1
            ),
          units: newData[dataPointsKeys.temperature.softCool]?.Units
        },
        {
          title: 'Heat',
          value:
            newData[dataPointsKeys.temperature.heat]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.temperature.heat]?.Units,
          group: 'power'
        },
        {
          title: 'Cool',
          value:
            newData[dataPointsKeys.temperature.cool]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.temperature.cool]?.Units,
          group: 'power'
        },
        {
          title: 'Integrator',
          value:
            newData[dataPointsKeys.temperature.integrator]?.ActualValue.toFixed(
              1
            ),
          units: newData[dataPointsKeys.temperature.integrator]?.Units,
          group: 'power'
        }
      ]
    },
    humidity: {
      current:
        newData[dataPointsKeys.humidity.probe]?.ActualValue.toFixed(1) || 'OFF',
      setValue:
        newData[dataPointsKeys.humidity.setPoint]?.ActualValue.toFixed(1) ||
        'OFF',
      setValueMin: newData[dataPointsKeys.humidity.setPoint]?.Minimum || 'OFF',
      setValueMax: newData[dataPointsKeys.humidity.setPoint]?.Maximum || 'OFF',
      units: newData[dataPointsKeys.humidity.probe]?.Units || 'Undefined',
      status: [
        {
          title: 'Process Value',
          value: newData[dataPointsKeys.humidity.probe]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.humidity.probe]?.Units
        },
        {
          title: 'Set Value',
          value:
            newData[dataPointsKeys.humidity.setPoint]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.humidity.setPoint]?.Units
        },
        {
          title: 'H2',
          value:
            newData[dataPointsKeys.humidity.probe2]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.humidity.probe2]?.Units
        },
        {
          title: 'Humidify',
          value:
            newData[dataPointsKeys.humidity.humidify]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.humidity.humidify]?.Units
        },
        {
          title: 'Dry',
          value: newData[dataPointsKeys.humidity.dry]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.humidity.dry]?.Units
        },
        {
          title: 'Integrator',
          value:
            newData[dataPointsKeys.humidity.integrator]?.ActualValue.toFixed(1),
          units: newData[dataPointsKeys.humidity.integrator]?.Units,
          group: 'power'
        }
      ]
    },
    chamberEquipment: {
      heater: {
        current:
          newData[dataPointsKeys.chamberEquipment.heater]?.ActualValue.toFixed(
            1
          ) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.heater]?.Units || 'Undefined'
      },
      ambientTemperature: {
        current:
          newData[
            dataPointsKeys.chamberEquipment.ambientTemperature
          ]?.ActualValue.toFixed(1) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.ambientTemperature]?.Units ||
          'Undefined'
      }
    },
    safety: {
      temperatureSafety: {
        current:
          newData[
            dataPointsKeys.chamberEquipment.safety.temperatureSafety
          ]?.ActualValue.toFixed(1) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.safety.temperatureSafety]
            ?.Units || 'Undefined'
      },
      temperatureHeater: {
        current:
          newData[
            dataPointsKeys.chamberEquipment.safety.teamperatureHeater
          ]?.ActualValue.toFixed(1) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.safety.teamperatureHeater]
            ?.Units || 'Undefined'
      }
    },
    cooling: {
      condensingTemperature: {
        current:
          newData[
            dataPointsKeys.chamberEquipment.cooling.condensingTemperature
          ]?.ActualValue.toFixed(1) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.cooling.condensingTemperature]
            ?.Units || 'Undefined'
      },
      dischargePressure: {
        current:
          newData[
            dataPointsKeys.chamberEquipment.cooling.dischargePressure
          ]?.ActualValue.toFixed(1) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.cooling.dischargePressure]
            ?.Units || 'Undefined'
      },
      suctionPressure: {
        current:
          newData[
            dataPointsKeys.chamberEquipment.cooling.suctionPressure
          ]?.ActualValue.toFixed(1) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.cooling.suctionPressure]
            ?.Units || 'Undefined'
      },
      evaporatorTemperature: {
        current:
          newData[
            dataPointsKeys.chamberEquipment.cooling.evaporatorPressure
          ]?.ActualValue.toFixed(1) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.cooling.evaporatorPressure]
            ?.Units || 'Undefined'
      }
    },
    steamer: {
      humidifierTemperature: {
        current:
          newData[
            dataPointsKeys.chamberEquipment.steamer.humidifierTemperature
          ]?.ActualValue.toFixed(1) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.steamer.humidifierTemperature]
            ?.Units || 'Undefined'
      },
      setValue: {
        current:
          newData[
            dataPointsKeys.chamberEquipment.steamer.setValue
          ]?.ActualValue.toFixed(1) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.steamer.setValue]?.Units ||
          'Undefined'
      },
      power: {
        current:
          newData[
            dataPointsKeys.chamberEquipment.steamer.power
          ]?.ActualValue.toFixed(1) || 'OFF',
        units:
          newData[dataPointsKeys.chamberEquipment.steamer.power]?.Units ||
          'Undefined'
      }
    },
    chamberSettings: {
      ip: `${
        newData[dataPointsKeys.settingsChamber.ip.one]?.ActualValue || 0
      }.${newData[dataPointsKeys.settingsChamber.ip.two]?.ActualValue || 0}.${
        newData[dataPointsKeys.settingsChamber.ip.three]?.ActualValue || 0
      }.${newData[dataPointsKeys.settingsChamber.ip.four]?.ActualValue || 0}`,
      controllerModel:
        newData[dataPointsKeys.settingsChamber.controllerModel]?.ActualValue ||
        'Undefined',
      controllerVersion:
        newData[dataPointsKeys.settingsChamber.controllerVersion]
          ?.ActualValue || 'Undefined',
      releaseDate:
        newData[dataPointsKeys.settingsChamber.releaseDate]?.ActualValue ||
        'Undefined',
      controllerType:
        newData[dataPointsKeys.settingsChamber.controllerType]?.ActualValue ||
        'Undefined',
      boardType:
        newData[dataPointsKeys.settingsChamber.boardType]?.ActualValue ||
        'Undefined',
      bios:
        newData[dataPointsKeys.settingsChamber.bios]?.ActualValue ||
        'Undefined',
      boot:
        newData[dataPointsKeys.settingsChamber.boot]?.ActualValue ||
        'Undefined',
      mainCycle:
        newData[dataPointsKeys.settingsChamber.mainCycle]?.ActualValue ||
        'Undefined',
      version:
        newData[dataPointsKeys.settingsChamber.version]?.ActualValue ||
        'Undefined',
      serialNumber: {
        current:
          newData[dataPointsKeys.settingsChamber.serialNumber]?.ActualValue ||
          'Undefined',
        setValueMin:
          newData[dataPointsKeys.settingsChamber.serialNumber]?.Minimum || '',
        setValueMax:
          newData[dataPointsKeys.settingsChamber.serialNumber]?.Maximum || ''
      },
      maintainanceTime: {
        current:
          newData[dataPointsKeys.settingsChamber.maintainance]?.ActualValue ||
          'Undefined',
        setValueMin:
          newData[dataPointsKeys.settingsChamber.maintainance]?.Minimum || '',
        setValueMax:
          newData[dataPointsKeys.settingsChamber.maintainance]?.Maximum || '',
        units: newData[dataPointsKeys.settingsChamber.maintainance]?.Units || ''
      },
      chamber: {
        current:
          newData[dataPointsKeys.settingsChamber.chamberTime]?.ActualValue ||
          'Undefined',
        setValueMin:
          newData[dataPointsKeys.settingsChamber.chamberTime]?.Minimum || '',
        setValueMax:
          newData[dataPointsKeys.settingsChamber.chamberTime]?.Maximum || '',
        units: newData[dataPointsKeys.settingsChamber.chamberTime]?.Units || ''
      }
    },
    chamberControl: {
      control:
        (newData[dataPointsKeys.controlChamber.controlPower]?.ActualValue === 0
          ? false
          : true) || false,
      lights:
        (newData[dataPointsKeys.controlChamber.controlLights]?.ActualValue === 0
          ? false
          : true) || false,
      thermostatMax: {
        current:
          newData[
            dataPointsKeys.controlChamber.thermostatMax
          ]?.ActualValue.toFixed(0) || 'Undefined',
        units:
          newData[dataPointsKeys.controlChamber.thermostatMax]?.Units || '',
        setValueMin:
          newData[dataPointsKeys.controlChamber.thermostatMax]?.Minimum || '',
        setValueMax:
          newData[dataPointsKeys.controlChamber.thermostatMax]?.Maximum || ''
      },
      thermostatMin: {
        current:
          newData[
            dataPointsKeys.controlChamber.thermostatMin
          ]?.ActualValue.toFixed(0) || 'Undefined',
        units:
          newData[dataPointsKeys.controlChamber.thermostatMin]?.Units || '',
        setValueMin:
          newData[dataPointsKeys.controlChamber.thermostatMin]?.Minimum || '',
        setValueMax:
          newData[dataPointsKeys.controlChamber.thermostatMin]?.Maximum || ''
      },
      screenSaver: {
        current:
          newData[
            dataPointsKeys.controlChamber.screenSaver
          ]?.ActualValue.toFixed(0) || 'Undefined',
        units: newData[dataPointsKeys.controlChamber.screenSaver]?.Units || '',
        setValueMin:
          newData[dataPointsKeys.controlChamber.screenSaver]?.Minimum || '',
        setValueMax:
          newData[dataPointsKeys.controlChamber.screenSaver]?.Maximum || ''
      },
      sampleTime: {
        current:
          newData[
            dataPointsKeys.controlChamber.sampleTime
          ]?.ActualValue.toFixed(0) || 'Undefined',
        units: newData[dataPointsKeys.controlChamber.sampleTime]?.Units || '',
        setValueMin:
          newData[dataPointsKeys.controlChamber.sampleTime]?.Minimum || '',
        setValueMax:
          newData[dataPointsKeys.controlChamber.sampleTime]?.Maximum || ''
      },
      tempUnits:
        (newData[dataPointsKeys.controlChamber.tempUnits]?.ActualValue === 0
          ? false
          : true) || false,
      events: dataPointsKeys.controlChamber.events.map((event) => {
        return { name: newData[event]?.TextValue };
      })
    },
    alarms: {
      mute: {
        current:
          newData[dataPointsKeys.alarms.mute]?.ActualValue.toFixed(0) ||
          'Undefined',
        units: newData[dataPointsKeys.alarms.mute]?.Units || ''
      },
      delay: {
        current:
          newData[dataPointsKeys.alarms.delay]?.ActualValue.toFixed(0) ||
          'Undefined',
        units: newData[dataPointsKeys.alarms.delay]?.Units || ''
      },
      temperature: {
        high: {
          current:
            newData[
              dataPointsKeys.alarms.temperature.high
            ]?.ActualValue.toFixed(0) || 'Undefined',
          units: newData[dataPointsKeys.alarms.temperature.high]?.Units || '',
          setValueMin:
            newData[dataPointsKeys.alarms.temperature.high]?.Minimum || '',
          setValueMax:
            newData[dataPointsKeys.alarms.temperature.high]?.Maximum || ''
        },
        low: {
          current:
            newData[dataPointsKeys.alarms.temperature.low]?.ActualValue.toFixed(
              0
            ) || 'Undefined',
          units: newData[dataPointsKeys.alarms.temperature.low]?.Units || '',
          setValueMin:
            newData[dataPointsKeys.alarms.temperature.low]?.Minimum || '',
          setValueMax:
            newData[dataPointsKeys.alarms.temperature.low]?.Maximum || ''
        },
        band: {
          current:
            newData[
              dataPointsKeys.alarms.temperature.band
            ]?.ActualValue.toFixed(0) || 'Undefined',
          units: newData[dataPointsKeys.alarms.temperature.band]?.Units || '',
          setValueMin:
            newData[dataPointsKeys.alarms.temperature.band]?.Minimum || '',
          setValueMax:
            newData[dataPointsKeys.alarms.temperature.band]?.Maximum || ''
        },
        diff: {
          current:
            newData[
              dataPointsKeys.alarms.temperature.diff
            ]?.ActualValue.toFixed(0) || 'Undefined',
          units: newData[dataPointsKeys.alarms.temperature.diff]?.Units || '',
          setValueMin:
            newData[dataPointsKeys.alarms.temperature.diff]?.Minimum || '',
          setValueMax:
            newData[dataPointsKeys.alarms.temperature.diff]?.Maximum || ''
        }
      },
      humidity: {
        high: {
          current:
            newData[dataPointsKeys.alarms.humidity.high]?.ActualValue.toFixed(
              0
            ) || 'Undefined',
          units: newData[dataPointsKeys.alarms.humidity.high]?.Units || '',
          setValueMin:
            newData[dataPointsKeys.alarms.humidity.high]?.Minimum || '',
          setValueMax:
            newData[dataPointsKeys.alarms.humidity.high]?.Maximum || ''
        },
        low: {
          current:
            newData[dataPointsKeys.alarms.humidity.low]?.ActualValue.toFixed(
              0
            ) || 'Undefined',
          units: newData[dataPointsKeys.alarms.humidity.low]?.Units || '',
          setValueMin:
            newData[dataPointsKeys.alarms.humidity.low]?.Minimum || '',
          setValueMax:
            newData[dataPointsKeys.alarms.humidity.low]?.Maximum || ''
        },
        band: {
          current:
            newData[dataPointsKeys.alarms.humidity.band]?.ActualValue.toFixed(
              0
            ) || 'Undefined',
          units: newData[dataPointsKeys.alarms.humidity.band]?.Units || '',
          setValueMin:
            newData[dataPointsKeys.alarms.humidity.band]?.Minimum || '',
          setValueMax:
            newData[dataPointsKeys.alarms.humidity.band]?.Maximum || ''
        },
        diff: {
          current:
            newData[dataPointsKeys.alarms.humidity.diff]?.ActualValue.toFixed(
              0
            ) || 'Undefined',
          units: newData[dataPointsKeys.alarms.humidity.diff]?.Units || '',
          setValueMin:
            newData[dataPointsKeys.alarms.humidity.diff]?.Minimum || '',
          setValueMax:
            newData[dataPointsKeys.alarms.humidity.diff]?.Maximum || ''
        }
      },
      beep:
        (newData[dataPointsKeys.alarms.beep]?.ActualValue === 0
          ? false
          : true) || false
    }
  };

  return mappedData;
};
