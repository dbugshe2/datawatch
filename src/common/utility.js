// eslint-disable-next-line no-unused-vars
import * as React from 'react';

// ? convert Bytes to Megabytes
export const bytesToMB = Bytes => {
  return parseFloat(Bytes / 1024 / 1024).toFixed(0);
};

// ? convert Bytes to gigabytes
export const bytesToGB = Bytes => {
  return parseFloat(Bytes / 1024 / 1024 / 1024).toFixed(0);
};

// ? convert Bytes to gigabytes
export const mbToBytes = MB => {
  return MB * 1024 * 1024;
};
