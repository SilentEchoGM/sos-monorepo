const platforms = ["XboxOne", "PS4", "Switch", "Steam", "Epic"];

export const getPlatformId = () =>
  `${platforms[Math.floor(Math.random() * platforms.length)]}|${
    Math.floor(Math.random() * Math.pow(2, 32)) + ""
  }|0`;
