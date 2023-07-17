import { useState } from 'react';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import { Doughnut } from '../doughnut';
import { Barchart } from '../barchart';
import { Fieldset } from 'primereact/fieldset';
import './index.scss';

interface Sensor {
  id: string;
  name: string;
  connected: boolean;
  unit: string;
  value: string;
}

export interface SensorProps {
  handleConnect: (id: string, connect: boolean) => void;
  sensor: Sensor;
  bgColor: string;
  borderColor: string;
}

interface WebSocketMessage {
  command: string;
  id: string;
}

export const Sensors = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [showConnectedOnly, setShowConnectedOnly] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<string>('Not Connected');
  const [isError, setIsError] = useState<boolean>(false);

  const connectWebsocket = () => {
    setLoading(true);
    setIsError(false);
    setStatus('Connecting...');

    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      setLoading(false);
      setIsError(false);
      setStatus('Connected to WebSockets');
    };

    ws.onmessage = (event) => {
      const data: Sensor = JSON.parse(event.data);
      setSensors((prevSensors) => {
        const sensorIndex = prevSensors.findIndex(
          (sensor) => sensor.id === data.id
        );

        if (sensorIndex !== -1) {
          prevSensors[sensorIndex] = data;
          return [...prevSensors];
        }

        return [...prevSensors, data];
      });
    };

    ws.onerror = (error) => {
      setLoading(false);
      setIsError(true);
      setStatus(`WebSocket error: ${error}`);
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        setStatus('WebSocket Closed');
        setIsError(false);
      } else {
        setStatus('Unable to connect to WebSocket');
        setIsError(true);
        console.log(event);
      }
      setSocket(null);
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  };

  const handleToggleShowConnectedOnly = () => {
    setShowConnectedOnly((prevValue) => !prevValue);
  };

  const handleConnectSensor = (id: string) => {
    if (socket) {
      const message: WebSocketMessage = { command: 'connect', id };
      socket.send(JSON.stringify(message));
    }
  };

  const handleDisconnectSensor = (id: string) => {
    if (socket) {
      const message: WebSocketMessage = { command: 'disconnect', id };
      socket.send(JSON.stringify(message));
    }
  };

  const handleConnect = (id: string, connected: boolean) => {
    if (connected) {
      handleConnectSensor(id);
    } else {
      handleDisconnectSensor(id);
    }
  };

  const filteredSensors = showConnectedOnly
    ? sensors.filter((sensor) => sensor.connected)
    : sensors;

  const chartColors = [
    '--blue-500',
    '--green-500',
    '--yellow-500',
    '--cyan-500',
    '--pink-500',
    '--orange-500',
  ];

  return (
    <div className="p-4 sensor-container">
      <Card className="my-2">
        <div className="grid container">
          <div className="col-12 md:col-8">
            <Fieldset legend="Actions" className="darker-bg">
              <div className="flex">
                {!socket && (
                  <Button
                    onClick={connectWebsocket}
                    loading={loading}
                    className="p-button-success"
                  >
                    Connect to Iot Sensors
                  </Button>
                )}
                {socket && socket.readyState === 1 && (
                  <div className="flex">
                    <Button
                      label={
                        showConnectedOnly
                          ? 'Show All Sensors'
                          : 'Show Only Connected Sensors'
                      }
                      onClick={handleToggleShowConnectedOnly}
                      className="m-4 w-50"
                    />

                    <Button
                      onClick={() => socket?.close()}
                      className="m-4 p-button-danger w-50"
                    >
                      Close Connection
                    </Button>
                  </div>
                )}
              </div>
            </Fieldset>
          </div>
          <div className="col-12 md:col-4">
            <Fieldset
              legend="Status"
              style={{ height: '100%' }}
              className={
                isError ? 'bg-error' : socket ? 'bg-success' : 'darker-bg'
              }
            >
              {status}
            </Fieldset>
          </div>
        </div>
      </Card>

      {socket?.readyState === 0 && <ProgressBar />}
      {socket?.readyState === 1 && (
        <div className="grid container">
          {filteredSensors.map((sensor) => (
            <div key={sensor.id} className="col-12 md:col-6 lg:col-2">
              <Card title={sensor.name} className="card">
                {sensor.id === '0' || sensor.id === '2' ? (
                  <Doughnut
                    sensor={sensor}
                    handleConnect={handleConnect}
                    bgColor={chartColors[parseInt(sensor.id)]}
                    borderColor="'--blue-200'"
                  />
                ) : (
                  <Barchart
                    sensor={sensor}
                    handleConnect={handleConnect}
                    bgColor={chartColors[parseInt(sensor.id)]}
                    borderColor="'--blue-200'"
                  />
                )}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
