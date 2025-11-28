export interface TcpParams {
  rmemMax: number;
  wmemMax: number;
  tcpRmem: [number, number, number]; // min, default, max
  tcpWmem: [number, number, number]; // min, default, max
  bdpBytes: number;
}

export interface NetworkInput {
  bandwidth: number; // in Mbps
  rtt: number; // in ms
}

export enum CalculationMode {
  WAN = 'WAN',
  LAN = 'LAN',
  HIGH_SPEED = 'HIGH_SPEED',
}
