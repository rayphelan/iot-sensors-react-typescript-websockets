import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { SensorProps } from '../sensors';
import { ConnectSwitch } from '../connect-switch';

export const Barchart = (props: SensorProps) => {
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
      labels: [''],
      datasets: [
        {
          label: `${value} ${unit}`,
          data: [value],
          backgroundColor: [
            documentStyle.getPropertyValue(bgColor),
            documentStyle.getPropertyValue('--surface-b'),
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      animations: false,
      events: [],
      responsive: true,
    };

    setChartData(data);
    setChartOptions(options);
  }, [name, unit, value, bgColor, borderColor]);

  return (
    <>
      <ConnectSwitch
        id={id}
        connected={connected}
        handleConnect={handleConnect}
      />
      {connected && (
        <div className="card">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      )}
    </>
  );
};
