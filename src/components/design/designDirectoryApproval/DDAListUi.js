import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, TextInput } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import * as Constant from "../../../utils/constants/constant";
import color from '../../../utils/commonStyles/color';
let searchImg = require('./../../../../assets/images/png/searchIcon.png');
let exampleImage = require('./../../../../assets/images/png/img4.jpg');

const DDAListUi = ({ route, ...props }) => {


  const [isListOpen, set_ListOpen] = useState(false);
  const [filterArray, set_filterArray] = useState([]);
  const [allList, setAllList] = useState([]);

  useEffect(() => {
    set_filterArray(props?.itemsArray || []);
    setAllList(props?.itemsArray || [])

    console.log("PROPS===> ", props?.itemsArray[0]?.designName);
  }, [props.itemsArray])


  const [recName, set_recName] = useState('');
  const isKeyboard = useRef(false);

  const backBtnAction = () => {
    props.backBtnAction();
  };
  const Prev = () => {
    props.prevBtnAction();
  };
  const Next = () => {
    props.nextBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  // const filterPets = (recName) => {
  //   set_recName(recName);
  //   console.log("filter pets", recName);
  //   // if (isKeyboard.current) {
  //   //   set_recName(recName);
  //   //   if (recName) {
  //   //     set_ListOpen(true);
  //   //   } else {
  //   //     set_ListOpen(false);
  //   //   }

  //     const styleArray = props.itemsArray.filter(style => (
  //       style.designType.toUpperCase().includes(recName.toUpperCase()) ||
  //       style.designName.toString().toUpperCase().includes(recName.toUpperCase()) 
  //     ));

  //     // style.rmFabric.toUpperCase().includes(recName.toUpperCase())
  //     set_filterArray(styleArray);
  //   // }
  // };

  // const filterPets = (recName) => {
  //   set_recName(recName);

  //   if (recName) {
  //     const styleArray = props.itemsArray.filter(style => 
  //       style.designName?.toUpperCase().includes(recName.toUpperCase()) || 
  //       style.designType?.toUpperCase().includes(recName.toUpperCase())
  //     );

  //     set_filterArray(styleArray.length > 0 ? styleArray : []);
  //   } else {
  //     set_filterArray(props.itemsArray);
  //   }
  // };

  const filterPets = (recName) => {

    if (isKeyboard.current === true) {

      set_recName(recName)
      let nestedFilter = props.itemsArray;
      const styleArray = nestedFilter.filter(style =>
        style.designName?.toUpperCase().includes(recName.toUpperCase()) ||
        style.designType?.toUpperCase().includes(recName.toUpperCase())
      );

      if (styleArray && styleArray.length > 0) {
        set_filterArray(styleArray);
      } else {
        set_filterArray([]);
      }
    }

  };


  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => actionOnRow(item)} style={CommonStyles.cellBackViewStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[CommonStyles.tylesTextStyle, { textAlign: 'center', flex: 1 }]}>{item.designName}</Text>
        <Text style={[CommonStyles.tylesTextStyle, { textAlign: 'center', flex: 1 }]}>{item.designType}</Text>
        <View style={{ flex: 1.2 }}>
          <Text style={[CommonStyles.tylesTextStyle, { textAlign: 'center', flex: 1 }]}>{item.approveBy}</Text>
          <Text style={[CommonStyles.tylesTextStyle, { textAlign: 'center', flex: 1 }]}>{item.approvedate}</Text>
        </View>
        <Image source={{ uri: `data:image/png;base64,${item.designImg}` }} style={[styles.imageStyle, { flex: 1.3 }]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={CommonStyles.mainComponentViewStyle}>
      <View style={CommonStyles.headerView}>
        <HeaderComponent
          isBackBtnEnable={true}
          isTitleHeaderEnable={true}
          title="Design Directory Approval"
          backBtnAction={backBtnAction}
        />
      </View>

      <View style={CommonStyles.headerStyle}>
        <View style={CommonStyles.searchBarStyle}>
          <View style={CommonStyles.searchInputContainerStyle}>
            <Image source={searchImg} style={CommonStyles.searchImageStyle} />
            <TextInput style={CommonStyles.searchTextInputStyle}
              underlineColorAndroid="transparent"
              placeholder="Search"
              placeholderTextColor="#7F7F81"
              autoCapitalize="none"
              value={recName}
              onFocus={() => isKeyboard.current = true}
              onChangeText={(name) => { filterPets(name) }}
            />
          </View>
        </View>


       { filterArray && filterArray.length > 0 ? <View style={CommonStyles.listCommonHeader}>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'center', flex: 1 }]}>Design   Name</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'center', flex: 1 }]}>Design     Type</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'center', flex: 1 }]}>Approved By &  Date</Text>
          <Text style={[CommonStyles.tylesHeaderTextStyle, { textAlign: 'center', flex: 1.3 }]}>Design Image</Text>
        </View> : null}

       

        {!props.isLoading && filterArray.length === 0 ? (
          <View style={CommonStyles.noRecordsFoundStyle}>
            <Text  style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>{Constant.noRecFound}</Text>
          </View>
        ) : (
          <View style={CommonStyles.listStyle}>
            <FlatList
              data={filterArray}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

      </View>

      {props.isPopUp ? <View style={CommonStyles.customPopUpStyle}>
        <AlertComponent
          header={props.popUpAlert}
          message={props.popUpMessage}
          isLeftBtnEnable={props.isPopLeft}
          isRightBtnEnable={true}
          leftBtnTilte="NO"
          rightBtnTilte={props.popUpRBtnTitle}
          popUpRightBtnAction={popOkBtnAction}
        />
      </View> : null}

      {props.isLoading && <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} />}

      {/* Previous and Next buttons */}
      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity style={[styles.navButton, {backgroundColor: props.prevDisable || props.isLoading ? color.lightcolor : color.color2}]} disabled={props.isLoading || props.prevDisable} onPress={()=>Prev()}>
          <Text style={styles.navButtonText}>{'Prev'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, {backgroundColor: props.nextDisable || props.isLoading || filterArray.length === 0 ? color.lightcolor : color.color2}]} disabled={props.isLoading || props.nextDisable || filterArray.length === 0 } onPress={()=>Next()}>
          <Text style={styles.navButtonText}>{'Next'} </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    // borderWidth:1,
    // borderColor:'#000'
  },
  noDataView: {
    marginTop: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff', // Background color of the buttons container
  },
  navButton: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    backgroundColor: '#1F74BA', 
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight:'bold'
  },
});

export default DDAListUi;

