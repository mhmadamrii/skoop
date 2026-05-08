import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name='another'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
