import React, {PropTypes, Component, Children} from 'react';

import {View, Dimensions, TouchableHighlight, StyleSheet, ActionSheetIOS, Text, Platform} from 'react-native';
import deviceSizes from './deviceSizes';

const styles = StyleSheet.create({
  buttonContainer: {position: 'absolute', right: 0, bottom: 0},
  buttonText: {padding: 5, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)'},
  outer: {
    flex: 1,
    backgroundColor: '#003355',
  },
});

/**
 * Force resize of Dimensions.get by using the setter.
 */
function performResize(deviceInfo) {
  const {windowPhysicalPixels} = deviceInfo;
  const {width, height} = windowPhysicalPixels;

  // Force RN to re-set the Dimensions sizes
  Dimensions.set({windowPhysicalPixels});
  console.log(`Resizing window to physical pixels ${width}x${height}`);
  // TODO: Android uses screenPhysicalPixels - see https://github.com/facebook/react-native/blob/master/Libraries/Utilities/Dimensions.js
}

// Disable if Production or Android (Android support coming later)
const isActive = Platform.OS === 'ios' && __DEV__;

/**
 * Insert this component at the root of your app to
 * add a 'Switch'
 */
class ScreenSwitcher extends Component {
  constructor(props) {
    super(props);

    // Do nothing in production mode
    if (!isActive) {
      return;
    }
    this.state = {screenSwitcherDeviceName: 'Default'};

    this.resize = () => {
      const deviceNames = Object.keys(deviceSizes);
      const options = [...deviceNames, 'Cancel'];
      let cancelButtonIndex = deviceNames.length;
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Simulate Device Screen Size',
          options,
          cancelButtonIndex,
        },
        index => {
          if (index === cancelButtonIndex) {
            return;
          }

          const deviceName = deviceNames[index];
          const deviceInfo = deviceSizes[deviceName];
          if (!deviceInfo) {
            return;
          }

          performResize(deviceInfo);

          this.setState({screenSwitcherDeviceName: deviceName}); // force re-render of this component
        }
      );
    };
  }

  render() {
    // In production, just pass through children unchanged
    if (!isActive) {
      return Children.only(this.props.children);
    }

    // In dev mode, resize the main content
    const {children, hideButton} = this.props;

    const {width, height} = Dimensions.get('window');
    return (
      <View style={styles.outer}>
        <View style={{width, height}}>
          {children}
        </View>
        {hideButton
          ? undefined
          : <TouchableHighlight style={styles.buttonContainer} onPress={this.resize}>
              <Text style={styles.buttonText}>Switch</Text>
            </TouchableHighlight>}
      </View>
    );
  }
}

if (isActive) {
  // Use context to force re-renders for our children when screen is resized. Ensures that images are rendered with
  // correct density (2x, @3x)
  ScreenSwitcher.prototype.getChildContext = function() {
    const {screenSwitcherDeviceName} = this.state;
    return {screenSwitcherDeviceName};
  };

  ScreenSwitcher.childContextTypes = {
    /**
     * Used to force re-render of children when screen is resized
     */
    screenSwitcherDeviceName: PropTypes.string,
  };
}

ScreenSwitcher.defaultProps = {
  hideButton: false,
};

ScreenSwitcher.propTypes = {
  children: PropTypes.node.isRequired,
  hideButton: PropTypes.bool,
};

export default ScreenSwitcher;
