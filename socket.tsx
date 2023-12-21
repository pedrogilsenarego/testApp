import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { testWebsocket } from '../redux/general/actions';
import {
  mapNewAlarmHistory,
  mapNewDataToSocketData,
  receiveDataKeys,
  sentDataKeys
} from './mapper';
import { ChartData, SocketData } from './types';

export const WebSocketContext = createContext<{
  data: SocketData;
  chartData: ChartData | null;
  currentDate: Date | null;
  alarmHistory: any | null;
  newAlarm: any | null;
  isConnected: boolean;
  sendData: (request: string, key?: string, data?: any) => void;
}>({
  currentDate: null,
  chartData: null,
  alarmHistory: null,
  newAlarm: null,
  data: null,
  isConnected: false,
  sendData: () => {}
});

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const useChartData = () => {
  const { chartData } = useContext(WebSocketContext);
  return chartData;
};

type Props = {
  children: React.ReactNode;
  idle: boolean;
};
const socket = io(`http://${window.location.hostname}:11978`);

export const WebSocketProvider = ({ children, idle = true }: Props) => {
  const [rawdata, setRawData] = useState<any>({});
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [rawAlarmHistory, setRawAlarmHistory] = useState<any>([]);
  const [rawNewAlarm, setRawNewAlarm] = useState<any>([]);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const data = useMemo(() => mapNewDataToSocketData(rawdata), [rawdata]);
  const alarmHistory = useMemo(
    () => mapNewAlarmHistory(rawAlarmHistory),
    [rawAlarmHistory]
  );
  const newAlarm = useMemo(
    () => mapNewAlarmHistory(rawNewAlarm),
    [rawNewAlarm]
  );
  const dispatch = useDispatch();
  const sendData = useCallback(
    (request: string, key?: string, data?: number | string | boolean) => {
      if (!idle) {
        try {
          const payload: Record<string, any> = {};
          if (key) {
            payload[key] = { WriteValue: data };
          }
          if (request === sentDataKeys.DROP_ACTIVE_ALARM) setRawNewAlarm([]);
          socket.emit(request, payload);
          console.log(request, payload);
        } catch (error) {
          console.error('Socket emit error:', error);
        }
      }
    },
    [idle]
  );

  useEffect(() => {
    if (!idle) {
      socket.on('connect', () => {
        setIsConnected(true);
      });
      socket.on('disconnect', () => {
        setIsConnected(false);
      });
      socket.on(receiveDataKeys.DATA_POINTS, (newData) => {
        console.log('receivedData', newData);
        setRawData((prevRawData: any) => {
          const mergedData = { ...prevRawData };
          for (const key in newData) {
            if (newData.hasOwnProperty(key)) {
              if (typeof newData[key] === 'object' && newData[key] !== null) {
                mergedData[key] = { ...mergedData[key], ...newData[key] };
              } else {
                mergedData[key] = newData[key];
              }
            }
          }
          return mergedData;
        });
      });
      socket.on(receiveDataKeys.CURRENT_DATE_TIME, (newDate) => {
        console.log('currentDateTime', newDate);
        setCurrentDate(newDate);
      });
      socket.on(receiveDataKeys.CHART_DATA, (rawChartData: ChartData) => {
        console.log(receiveDataKeys.CHART_DATA, rawChartData);
        if (rawChartData && rawChartData?.label.length > 1) {
          setChartData(rawChartData);
          dispatch(testWebsocket(rawChartData));
        }
      });
      socket.on(receiveDataKeys.ALARM_HISTORY, (newAlarmHistory) => {
        console.log(receiveDataKeys.ALARM_HISTORY, newAlarmHistory);
        if (Object.keys(newAlarmHistory).length === 0) {
          setRawAlarmHistory([]);
        } else setRawAlarmHistory(newAlarmHistory);
      });
      socket.on(receiveDataKeys.NEW_ALARM, (newAlarm) => {
        console.log(receiveDataKeys.NEW_ALARM, newAlarm);
        if (!newAlarm) {
          return;
        } else {
          setRawNewAlarm((oldAlarm: any[]) => [...newAlarm, ...oldAlarm]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idle]);

  const contextValue = useMemo(
    () => ({
      data,
      isConnected,
      sendData,
      currentDate,
      chartData,
      alarmHistory,
      newAlarm
    }),
    [
      data,
      isConnected,
      sendData,
      currentDate,
      chartData,
      alarmHistory,
      newAlarm
    ]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
