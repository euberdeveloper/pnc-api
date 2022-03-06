export type SwapTypesInInterface<T, ReplacedType, ReplacingType> = {
    [k in keyof T]: T[k] extends ReplacedType ? ReplacingType : T[k];
};

export type SwapDatesWithStrings<T> = SwapTypesInInterface<T, Date, string>;
