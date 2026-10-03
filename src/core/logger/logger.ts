export default class logger {
    prefix: string
    time: string = `[${new Date().toISOString()}]`
    constructor(prefix: string) {
        this.prefix = prefix
    }
    info(...message: any[]): void { console.info(`\x1b[90m[${new Date().toISOString()}]\x1b[36m${this.prefix}\x1b[0m ${message}`) }
    log(...message: any[]): void { console.log(`\x1b[90m[${new Date().toISOString()}]\x1b[36m${this.prefix}\x1b[0m ${message}`) }
    debug(...message: any[]): void { console.debug(`\x1b[90m[${new Date().toISOString()}]\x1b[36m${this.prefix}\x1b[0m ${message}`) }
    error(...message: any[]): void { console.error(`\x1b[90m[${new Date().toISOString()}]\x1b[36m${this.prefix}\x1b[0m \x1b[31m${message}\x1b[0m`) }
    warn(...message: any[]): void { console.warn(`\x1b[90m[${new Date().toISOString()}]\x1b[36m${this.prefix}\x1b[0m \x1b[33m${message}`) }
}