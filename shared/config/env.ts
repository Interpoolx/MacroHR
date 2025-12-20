// src/config/env.ts

const getEnv = (key: string, defaultValue: string = ""): string => {
    if (typeof import.meta !== "undefined" && (import.meta as any).env) {
        return (import.meta as any).env[key] || defaultValue;
    }
    try {
        if (typeof process !== "undefined" && process.env) {
            return process.env[key] || defaultValue;
        }
    } catch (e) { }
    return defaultValue;
};

export { getEnv };