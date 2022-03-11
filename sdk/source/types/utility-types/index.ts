// TODO: make it deep
export type SwapTypesInInterface<Interface, ReplacedType, ReplacingType> = {
    [k in keyof Interface]: Interface[k] extends ReplacedType ? ReplacingType : Interface[k];
};
export type SwapDatesWithStrings<T> = SwapTypesInInterface<T, Date, string>;
