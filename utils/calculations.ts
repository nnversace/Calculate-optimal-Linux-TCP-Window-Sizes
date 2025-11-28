import { TcpParams, NetworkInput } from '../types';

/**
 * Calculates TCP tuning parameters based on Bandwidth-Delay Product (BDP).
 * BDP = Bandwidth (bits/sec) * RTT (sec) / 8 (bits to bytes)
 */
export const calculateTcpParams = (input: NetworkInput): TcpParams => {
  const { bandwidth, rtt } = input;

  // Convert inputs to basic units
  const bandwidthBitsPerSec = bandwidth * 1_000_000;
  const rttSeconds = rtt / 1000;

  // Calculate BDP in bytes
  const bdpBytes = Math.floor((bandwidthBitsPerSec * rttSeconds) / 8);

  // Linux constraints & heuristics
  // We typically want the max buffer to be the BDP or slightly larger to accommodate overhead.
  const maxBuffer = Math.max(bdpBytes, 65536); // Minimum floor of 64KB for safety

  // Define defaults (Standard Linux defaults or slightly optimized)
  const minBuffer = 4096;
  const defaultRmem = Math.min(Math.floor(maxBuffer / 2), 87380); // Default is usually moderate
  const defaultWmem = Math.min(Math.floor(maxBuffer / 2), 65536);

  return {
    bdpBytes,
    rmemMax: maxBuffer,
    wmemMax: maxBuffer,
    tcpRmem: [minBuffer, 87380, maxBuffer], // 87380 is a common robust default
    tcpWmem: [minBuffer, 65536, maxBuffer], // 65536 is a common robust default
  };
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
