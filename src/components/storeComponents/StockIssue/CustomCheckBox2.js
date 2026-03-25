import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CustomCheckBox2 = ({isChecked, isIndeterminate, onToggle, disabled}) => {
    return (
      <TouchableOpacity onPress={onToggle} disabled={disabled}>
        <View style={[
          checkBoxstyles.box,
          isChecked && checkBoxstyles.checked,
          isIndeterminate && checkBoxstyles.indeterminate,
          {opacity: disabled ? 0.6 : 1}
        ]}>
          {isChecked && <Text style={checkBoxstyles.tick}>✓</Text>}
          {isIndeterminate && <Text style={checkBoxstyles.dash}>—</Text>}
        </View>
      </TouchableOpacity>
    );
  };
  
  export default CustomCheckBox2;
  const checkBoxstyles = StyleSheet.create({
    box: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checked: {
      backgroundColor: 'black',
    },
    indeterminate: {
      backgroundColor: 'black',  // or a lighter shade like '#80BFFF'
      opacity: 0.5,                // ← visually distinct from fully checked
    },
    tick: {
      color: '#fff',
      fontSize: 13,
      fontWeight: 'bold',
    },
    dash: {
      color: '#fff',
      fontSize: 13,
      fontWeight: 'bold',
    },
  });