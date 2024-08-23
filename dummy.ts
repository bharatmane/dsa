useMarginCallSubscription.ts
import { useEffect, useState } from 'react';
import { Subscription } from 'rxjs'; // Assuming you're using RxJS

const useMarginCallSubscription = (cpsService: any, marginCallSubscriptionFilter: string) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (marginCallSubscriptionFilter === "") return;

    const marginCallObservable = cpsService.getUpdates(Constants.TOPIC_MARGIN_CALL_KEY, marginCallSubscriptionFilter);

    if (subscription) {
      subscription.unsubscribe();
    }

    const newSubscription = marginCallObservable.subscribe({
      next: (value) => handleNewMarginCallReceived(value),
      error: (error) => console.error("Error in Margin Call Subscription: ", error),
    });

    setSubscription(newSubscription);

    return () => {
      if (newSubscription) {
        newSubscription.unsubscribe();
      }
    };
  }, [cpsService, marginCallSubscriptionFilter]);

  return subscription;
};

export default useMarginCallSubscription;


2. Use the Hook in Your Component
Now, in your MarginCallGrid component, import and use the hook:
import useMarginCallSubscription from './hooks/useMarginCallSubscription';

const MarginCallGrid = ({
  millionsToggle,
  missionToggle,
  marginCallSubscriptionFilter,
  selectedPreference,
}: Props) => {
  const cpsService = useMemo(() => new ApertureCPSService(), []);
  const marginCallSubscription = useMarginCallSubscription(cpsService, marginCallSubscriptionFilter);

  // Rest of the component logic...
};



