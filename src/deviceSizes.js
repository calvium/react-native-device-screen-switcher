// https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
const deviceSizes = {
  'iPhone 4': {
    windowPhysicalPixels: {
      width: 640,
      height: 960,
      scale: 2,
      fontScale: 2,
    },
  },
  'iPhone 5': {
    windowPhysicalPixels: {
      width: 640,
      height: 1136,
      scale: 2,
      fontScale: 2,
    },
  },
  'iPhone 6': { // 6s, 7, 8
    windowPhysicalPixels: {
      width: 750,
      height: 1334,
      scale: 2,
      fontScale: 2,
    },
  },
  'iPhone 6 Plus': { // 6s+, 7+, 8+
    windowPhysicalPixels: {
      width: 1242,
      height: 2208,
      scale: 3,
      fontScale: 3,
    },
  },
  'iPhone X': { // note: this won't have the bezel
     windowPhysicalPixels: {
       width: 1125,
       height: 2436,
       scale: 3,
       fontScale: 3
     }
  }
};

export default deviceSizes;
