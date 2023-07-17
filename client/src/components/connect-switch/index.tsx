import { InputSwitch, InputSwitchChangeParams } from 'primereact/inputswitch';

interface ConnectSwitchProps {
  handleConnect: (id: string, connected: boolean) => void;
  connected: boolean;
  id: string;
}
export const ConnectSwitch = (props: ConnectSwitchProps) => {
  const { handleConnect, connected, id } = props;

  return (
    <div className="flex connect-switch-container">
      <span className="switch-label">Off</span>
      <InputSwitch
        checked={connected}
        onChange={(e: InputSwitchChangeParams) => handleConnect(id, e.value)}
      />
      <span className="switch-label">On</span>
    </div>
  );
};
