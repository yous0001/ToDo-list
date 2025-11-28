declare module "@pqina/flip" {
  export type TickInstance = {
    value: string | number;
    root?: HTMLElement;
    destroy: () => void;
  };

  type TickCreateOptions = {
    value?: string | number;
    didInit?: (tick: TickInstance) => void;
    didUpdate?: (tick: TickInstance) => void;
  };

  interface TickDOM {
    create: (
      element?: HTMLElement,
      options?: TickCreateOptions
    ) => TickInstance | null;
  }

  interface Tick {
    DOM: TickDOM;
  }

  const Tick: Tick;
  export default Tick;
}
