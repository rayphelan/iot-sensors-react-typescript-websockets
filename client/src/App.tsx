import 'primereact/resources/themes/lara-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { Sensors } from './components/sensors';

function App() {
  return (
    <div className="text-center">
      <Sensors />
    </div>
  );
}

export default App;
