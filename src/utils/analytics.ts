interface GatherWindow extends Window {
    analytics: {
        track(event: string, properties?: {}): void;
    };
}

export const trackAction = (action: string, payload?: any) => {
    try {
        (window as any as GatherWindow).analytics.track(action, {...payload});
    } catch (e) { //this will not work locally unless web components are used inside gather/gather
        console.error(e);
    }
}
