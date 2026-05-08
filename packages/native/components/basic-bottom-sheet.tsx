import { useRef, useState } from 'react';
import {
  Host,
  ModalBottomSheet,
  Button,
  Column,
  Text,
} from '@expo/ui/jetpack-compose';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

export function BasicBottomSheetExample() {
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);

  const hideSheet = async () => {
    await sheetRef.current?.hide();
    setVisible(false);
  };

  return (
    <Host matchContents>
      <Button onClick={() => setVisible(true)}>
        <Text>Open Sheet</Text>
      </Button>
      {visible && (
        <ModalBottomSheet
          ref={sheetRef}
          onDismissRequest={() => setVisible(false)}
        >
          <Column
            verticalArrangement={{ spacedBy: 12 }}
            modifiers={[paddingAll(24)]}
          >
            <Text>Hello from bottom sheet!</Text>
            <Text>You can add more content here.</Text>
            <Button onClick={hideSheet}>
              <Text>Close</Text>
            </Button>
          </Column>
        </ModalBottomSheet>
      )}
    </Host>
  );
}
