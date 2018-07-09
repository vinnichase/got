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
