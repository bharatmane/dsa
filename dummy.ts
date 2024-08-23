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





import { useEffect, useState } from 'react';
import { switchMap, map } from 'rxjs/operators';
import { Subscription } from 'rxjs'; // Assuming you're using RxJS

const useMissionSubscription = (
  cpsService: any,
  handleNewMissionReceived: (mission: any, fxRates: any) => void // Add fxRates as well
) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const fxRateObservable = cpsService.getUpdates(Constants.TOPIC_FX_RATES_KEY, "");
    const missionsObservable = cpsService.getUpdates(Constants.TOPIC_MISSIONS_KEY, "");

    if (subscription) {
      subscription.unsubscribe();
    }

    const newSubscription = fxRateObservable
      .pipe(
        switchMap((fxRate) => 
          missionsObservable.pipe(
            map((mission) => [fxRate, mission])
          )
        )
      )
      .subscribe({
        next: ([fxRate, mission]) => handleNewMissionReceived(mission, fxRate), // Pass both mission and fxRates
        error: (error) => console.error("Error in Mission Subscription: ", error),
      });

    setSubscription(newSubscription);

    return () => {
      if (newSubscription) {
        newSubscription.unsubscribe();
      }
    };
  }, [cpsService, handleNewMissionReceived]); // Add handleNewMissionReceived to the dependency array

  return subscription;
};

export default useMissionSubscription;
