import React, {useState, useCallback, useContext} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {registerGrnAlertHost} from './GrnAlert';
import {ColorContext} from '../../colorTheme/colorTheme';

// Mount once near the root of a GRN Checking screen -- see GrnAlert.js for
// how showGrnAlert(...) reaches whichever instance is currently mounted.
//
// Registers on FOCUS, not just mount -- React Navigation's stack keeps
// every previous screen mounted (List stays mounted under Fabric/Rm), so a
// plain mount-only registration would leave the LAST-visited screen's host
// as the permanent listener; navigating back to an earlier screen would
// then silently drop every showGrnAlert() call from it (its own host's
// effect already ran once and never re-fires). useFocusEffect re-registers
// this screen every time it becomes the visible one again.
const GrnAlertHost = () => {
  const {colors} = useContext(ColorContext);
  const [state, set_state] = useState(null);

  useFocusEffect(
    useCallback(() => registerGrnAlertHost(payload => set_state(payload)), []),
  );

  const close = useCallback(() => set_state(null), []);

  const handlePress = useCallback(
    btn => {
      close();
      // Match Alert.alert's own timing -- onPress fires after the dialog
      // has already started dismissing, not before.
      setTimeout(() => btn.onPress && btn.onPress(), 0);
    },
    [close],
  );

  if (!state) return null;

  const buttons = state.buttons;
  const stacked = buttons.length > 2;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {state.title ? <Text style={styles.title}>{state.title}</Text> : null}
          {state.message ? <Text style={styles.message}>{state.message}</Text> : null}

          <View style={[styles.actions, stacked && styles.actionsStacked]}>
            {buttons.map((btn, idx) => {
              const isCancel = btn.style === 'cancel';
              const isDestructive = btn.style === 'destructive';
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.btn,
                    stacked ? styles.btnStacked : styles.btnInline,
                    isCancel ? styles.btnCancel : {backgroundColor: isDestructive ? '#c62828' : colors.color2},
                    idx > 0 && (stacked ? styles.btnStackedSpacing : styles.btnInlineSpacing),
                  ]}
                  onPress={() => handlePress(btn)}>
                  <Text style={[styles.btnText, isCancel && styles.btnTextCancel]} numberOfLines={1}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 8},
  message: {fontSize: 14, color: '#444', lineHeight: 20},
  actions: {flexDirection: 'row', marginTop: 18},
  actionsStacked: {flexDirection: 'column'},
  btn: {
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInline: {flex: 1},
  btnInlineSpacing: {marginLeft: 10},
  btnStacked: {width: '100%'},
  btnStackedSpacing: {marginTop: 8},
  btnCancel: {backgroundColor: '#F0F0F0'},
  btnText: {fontSize: 14, fontWeight: '700', color: '#fff'},
  btnTextCancel: {color: '#333'},
});

export default GrnAlertHost;
