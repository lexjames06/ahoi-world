export type OptionalType = Record<string, unknown> | undefined;

export type UUIDV4<T extends OptionalType = undefined> = string & { _uuidv4Brand: T };
