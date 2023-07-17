import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import type { SensorProps } from '../sensors';
import { ConnectSwitch } from '../connect-switch';

export const Doughnut = (props: SensorProps) => {
  const {
    sensor: { name, id, value, connected, unit },
    handleConnect,
    bgColor,
    borderColor,
  } = props;

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: [`${value} ${unit}`],
      datasets: [
        {
          data: [value, 100 - parseInt(value)],
          backgroundColor: [
            documentStyle.getPropertyValue(bgColor),
            documentStyle.getPropertyValue('--surface-b'),
          ],
        },
      ],
    };
    const options = {
      cutout: '60%',
      animations: false,
      events: [],
      responsive: true,
      borderWidth: 1,
      borderColor: documentStyle.getPropertyValue(borderColor),
    };

    setChartData(data);
    setChartOptions(options);
  }, [value, name, unit, bgColor, borderColor]);

  return (
    <>
      <ConnectSwitch
        id={id}
        connected={connected}
        handleConnect={handleConnect}
      />
      {connected && (
        <div className="flex justify-content-center w-full md:w-50">
          <Chart
            type="doughnut"
            data={chartData}
            options={chartOptions}
            className="w-full"
          />
        </div>
      )}
    </>
  );
};
