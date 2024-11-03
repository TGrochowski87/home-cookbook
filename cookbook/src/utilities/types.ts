// TODO: Summaries

export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Pick<Partial<T>, K>;

export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
