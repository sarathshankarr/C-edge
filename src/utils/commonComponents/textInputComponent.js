import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-paper';

const TextInputComponent = ({
  navigation,
  route,
  inputText,
  labelText,
  setValue,
  isEditable,
  maxLengthVal,
  keyboardType,
  autoCapitalize,
  widthValue,
  isSecure,
  isBackground,
  ...props
}) => {
  const [widthTextInput, set_widthTextInput] = useState('90%');
  const [isSecureText, set_isSecureText] = useState(undefined);
  const [backgroundColor, set_backgroundColor] = useState('transparent');
  const [autoCapitalizeValue, set_autoCapitalizeValue] = useState('none');

  const styles = getStyles(isEditable);
  useEffect(() => {
    if (widthValue) {
      set_widthTextInput(widthValue);
    }

    set_isSecureText(isSecure);
    set_backgroundColor(isBackground);
    set_autoCapitalizeValue(autoCapitalize);
  }, [widthValue, isSecure, isBackground, autoCapitalize]);

  return (
    <View style={[styles.mainComponentStyle]}>
      <View style={[styles.textInputContainerStyle, {width: widthTextInput}]}>
        <TextInput
          label={labelText}
          value={inputText}
          editable={isEditable}
          maxLength={maxLengthVal}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalizeValue}
          onChangeText={async text => {
            var trimmedStr = text.trimStart();
            setValue(trimmedStr);
          }}
          secureTextEntry={isSecureText}
          underlineColor={'transparent'}
          style={[
            styles.textInputStyle,
            // {backgroundColor: isEditable ? 'transparent' : '#dedede'},
          ]}
          activeUnderlineColor={'#7F7F81'}
          selectionColor={'transparent'}
          multiline={true} // Enable multiline
          theme={{
            colors: {
              label: 'grey', // Explicitly set the label color
              background: 'transparent',
              primary: 'transparent',
            },
          }}
        />
      </View>
    </View>
  );
};

export default TextInputComponent;

const getStyles = (isEditable) => StyleSheet.create({
  textInputStyle: {
    fontWeight: 'normal',
    fontSize: 20,
    flex: 1,
    // height: hp('7%'),
    backgroundColor: 'transparent',
  },

  textInputContainerStyle: {
    flexDirection: 'row',
    width: wp('80%'),
    // height: hp('7%'),
    borderRadius: wp('1%'),
    borderWidth: 1,
    borderColor: '#dedede',
    backgroundColor:  isEditable ? '#fff' : '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
  },
});






       {/* <TextInput
                    label = {labelText}
                    value = {inputText}
                    editable = {isEditable}
                    maxLength = {maxLengthVal}
                    keyboardType = {keyboardType}
                    autoCapitalize= {autoCapitalizeValue}
                    backgroundColor = {isEditable ? 'transparent' : '#dedede'}
                    onChangeText={async (text) => {
                        var trimmedStr = text.trimStart();
                        setValue(trimmedStr);
                    }}
                    // mode="outlined"
                    secureTextEntry = {isSecureText}
                    underlineColor={'transparent'}
                    style = {styles.textInputStyle}
                    activeUnderlineColor = {'#7F7F81'}
                    selectionColor={'transparent'} 
                    multiline={true} // Enable multiline
                    theme={{
                        colors: {
                            label : 'grey',
                            background:'transparent',
                            // text: 'green',
                            primary: 'transparent',
                            // placeholder: 'green'
                        },
                       
                    }}
                /> */}