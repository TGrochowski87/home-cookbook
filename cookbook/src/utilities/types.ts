/**
 * Makes selected properties required in the type.
 * Opposite to `WithOptional`.
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Makes selected properties optional in the type.
 * Opposite to `WithRequired`.
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Pick<Partial<T>, K>;

// This is useful for redux actions as redux uses immer internally to allow simpler updates of immutable data but it causes conflicts with readonly Array properties.
/**
 * Makes all properties in the type writeable by stripping the readonly modifier.
 */
export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

/**
 * Makes all properties from the first depth level in the type writeable by stripping the readonly modifier.
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
