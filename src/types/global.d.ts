// Global type declarations for browser environment
declare global {
  // Declare Node.js modules as empty objects to prevent bundling errors
  declare module 'worker_threads' {
    export const parentPort: any
    export const workerData: any
  }
  
  declare module 'fs' {
    export const readFileSync: any
    export const writeFileSync: any
    export const existsSync: any
  }
  
  declare module 'path' {
    export const join: any
    export const resolve: any
    export const dirname: any
    export const basename: any
    export const extname: any
  }
  
  declare module 'os' {
    export const platform: any
    export const homedir: any
    export const tmpdir: any
  }
  
  declare module 'crypto' {
    export const randomBytes: any
    export const createHash: any
  }
  
  declare module 'stream' {
    export const Readable: any
    export const Writable: any
    export const Transform: any
    export const Duplex: any
  }
  
  declare module 'util' {
    export const promisify: any
    export const inspect: any
  }
  
  declare module 'buffer' {
    export const Buffer: any
  }
  
  declare module 'events' {
    export const EventEmitter: any
  }
  
  declare module 'assert' {
    export const strict: any
    export const deepStrictEqual: any
  }
  
  declare module 'constants' {
    export const O_RDONLY: any
    export const O_WRONLY: any
  }
  
  declare module 'domain' {
    export const create: any
  }
  
  declare module 'punycode' {
    export const encode: any
    export const decode: any
  }
  
  declare module 'querystring' {
    export const parse: any
    export const stringify: any
  }
  
  declare module 'string_decoder' {
    export const StringDecoder: any
  }
  
  declare module 'sys' {
    export const inspect: any
  }
  
  declare module 'timers' {
    export const setTimeout: any
    export const clearTimeout: any
    export const setInterval: any
    export const clearInterval: any
  }
  
  declare module 'tty' {
    export const isatty: any
  }
  
  declare module 'url' {
    export const parse: any
    export const format: any
    export const resolve: any
  }
  
  declare module 'zlib' {
    export const gzip: any
    export const gunzip: any
  }
}

export {}
