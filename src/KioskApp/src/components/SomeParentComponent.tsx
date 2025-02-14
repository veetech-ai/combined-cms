import { TimerProvider } from '../contexts/TimerContext';

function SomeParentComponent() {
  return (
    <TimerProvider>
      <PaymentModal />
    </TimerProvider>
  );
}

export default SomeParentComponent; 