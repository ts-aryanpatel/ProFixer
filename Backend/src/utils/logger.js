// Simple logging utility to replace console.log in production
class Logger {
    constructor(module) {
        this.module = module;
        this.isDevelopment = process.env.NODE_ENV !== 'production';
    }

    info(message, data = null) {
        if (this.isDevelopment) {
            console.log(`[${this.module}] ℹ️ ${message}`, data || '');
        }
        // In production, could send to logging service like Sentry
    }

    error(message, error = null) {
        console.error(`[${this.module}] ❌ ${message}`, error || '');
        // In production, send to logging service
    }

    warn(message, data = null) {
        console.warn(`[${this.module}] ⚠️ ${message}`, data || '');
    }

    debug(message, data = null) {
        if (this.isDevelopment) {
            console.debug(`[${this.module}] 🔍 ${message}`, data || '');
        }
    }

    success(message, data = null) {
        if (this.isDevelopment) {
            console.log(`[${this.module}] ✅ ${message}`, data || '');
        }
    }
}

export default Logger;
