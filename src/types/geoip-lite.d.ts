declare module 'geoip-lite' {
  export interface Lookup {
    range: number[]
    country: string
    region: string
    eu: string
    timezone: string
    city: string
    ll: [number, number]
    metro: number
    area: number
  }

  export function lookup(ip: string): Lookup | null
  export function pretty(n: number): string
  export function startWatchingDataUpdate(): void
  export function stopWatchingDataUpdate(): void
}
