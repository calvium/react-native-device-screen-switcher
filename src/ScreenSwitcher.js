import React, {PropTypes, Component, Children} from 'react';

import {View, Dimensions, TouchableHighlight, StyleSheet, ActionSheetIOS, Text} from 'react-native';
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

/**
 * Insert this component at the root of your app to
 * add a 'Switch'
 */
class ScreenSwitcher extends Component {
  constructor(props) {
    super(props);

    // Do nothing in production mode
    if (!__DEV__) {
      return;
    }
    this.state = {count: 0};

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

          const deviceInfo = deviceSizes[deviceNames[index]];
          if (!deviceInfo) {
            return;
          }

          performResize(deviceInfo);

          this.setState({count: this.state.count + 1}); // force re-render
        }
      );
    };
  }

  render() {
    // In production, just pass through children unchanged
    if (!__DEV__) {
      return Children.only(this.props.children);
    }

    // In dev mode, resize the main content
    const {children} = this.props;

    const {width, height} = Dimensions.get('window');
    return (
      <View style={styles.outer}>
        <View style={{width, height}}>
          {children}
        </View>
        <TouchableHighlight style={styles.buttonContainer} onPress={this.resize}>
          <Text style={styles.buttonText}>Switch</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

ScreenSwitcher.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScreenSwitcher;
