import { DynamicColorIOS } from 'react-native';
import { NativeTabs, Icon } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs
      labelStyle={{
        // For the text color
        color: DynamicColorIOS({
          dark: 'white',
          light: 'black',
        }),
      }}
      // For the selected icon color
      tintColor={DynamicColorIOS({
        dark: 'white',
        light: 'black',
      })}
    >
      <NativeTabs.Trigger name='feed'>
        <Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          drawable='custom_home_drawable'
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='discover'>
        <Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          drawable='custom_home_drawable'
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='library'>
        <Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          drawable='custom_home_drawable'
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='upload'>
        <Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          drawable='custom_home_drawable'
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='profile'>
        <Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          drawable='custom_home_drawable'
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
