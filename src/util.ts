export function find(object, func) {
    if (func(object || {})) {
        return object;
    }
    if (Array.isArray(object)) {
        for (const item of object) {
            const result = find(item, func);
            if (result) { return result; }
        }
    } else if (typeof object === 'object') {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const item = object[key];
                const result = find(item, func);
                if (result) { return result; }
            }
        }
    }
}

export function toArray<T>(object: { [key: string]: T }): T[] {
    return Object.keys(object).map(key => object[key]);
}

export class Option<T> {
    constructor(private value?: T) { }

    public get(orElse?: T): T | undefined  {
        return this.value || orElse || undefined;
    }

    public map<R>(fn: (value: T) => R): Option<R> {
        return this.value ? Some<R>(fn(this.value)) : Some<R>();
    }

    public toArray() {
        return this.value ? [this.value] : [];
    }
}

export function Some<T>(value?: T): Option<T> {
    return value ? new Option<T>(value) : new Option<T>();
}
