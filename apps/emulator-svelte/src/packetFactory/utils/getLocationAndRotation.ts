import { getLocation } from "./getLocation";

export const getLocationAndRotation = ({
  x = 0,
  y = 0,
  z = 0,
  pitch = 0,
  roll = 0,
  yaw = 0,
} = {}) => ({
  ...getLocation({ x, y, z }),
  pitch,
  roll,
  yaw,
});
