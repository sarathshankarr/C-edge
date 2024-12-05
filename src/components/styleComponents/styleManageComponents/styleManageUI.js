import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ImageBackground,
  Image,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';

let shirt1 = require('./../../../../assets/images/png/shirt1.png');
let shirt3 = require('./../../../../assets/images/png/shirt3.jpeg');
let searchImg = require('./../../../../assets/images/png/searchIcon.png');

const StyleManageUI = ({route, ...props}) => {
  const [filterArray, set_filterArray] = useState(undefined);
  const [recName, set_recName] = useState(undefined);
  let isKeyboard = useRef(false);
  const [refreshing, set_refreshing] = useState(false);

  React.useEffect(() => {
    if (props.itemsArray) {
      set_filterArray(props.itemsArray);
    }
  }, [props.itemsArray]);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const actionOnRow = (item, index) => {
    props.actionOnRow(item, index);
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const filterPets = recName => {
    if (isKeyboard.current === true) {
      set_recName(recName);
      let nestedFilter = props.itemsArray;
      const styleArray = nestedFilter.filter(
        style =>
          style.styleName.toUpperCase().includes(recName.toUpperCase()) ||
          style.process.toUpperCase().includes(recName.toUpperCase()) ||
          style.fabric.toUpperCase().includes(recName.toUpperCase()),
      );

      if (styleArray && styleArray.length > 0) {
        set_filterArray(styleArray);
      } else {
        set_filterArray([]);
      }
    }
  };

  const renderItem = ({item, index}) => {
    return (
      // <TouchableOpacity onPress={() => actionOnRow(item,index)} style={CommonStyles.cellBackViewStyle}>

      //   <View style={{flexDirection :'row', justifyContent:'space-between', alignItems:'center'}}>
      //     <Text style={[CommonStyles.tylesTextStyle,{flex:1.5,marginRight:hp('1%')}]}>{item.styleName}</Text>
      //     {/* <View style={{flex:1, alignItems:'center'}}>
      //       <View style = {[styles.imgStyle,{backgroundColor:'white'}]}>
      //         <ImageBackground imageStyle = {{borderRadius:100}} resizeMode='contain' style={[CommonStyles.imgStyle1]} source={item.image}></ImageBackground>
      //         <ImageBackground imageStyle = {{borderRadius:100}} resizeMode='stretch' style={[CommonStyles.imgStyle1]} source={index % 2 === 0 ? shirt1 : shirt3}></ImageBackground>
      //       </View>
      //     </View> */}

      //     <Text style={[CommonStyles.tylesTextStyle,{flex:2.5,marginRight:hp('1%')}]}>{item.fabric}</Text>
      //     <Text style={[CommonStyles.tylesTextStyle,{flex:2.5,marginRight:hp('1%')}]}>{item.color}</Text>
      //     <Text style={[CommonStyles.tylesTextStyle,{flex:1.5}]}>{item.process}</Text>
      //   </View>

      // </TouchableOpacity>
      <TouchableOpacity
        onPress={() => actionOnRow(item, index)}
        style={CommonStyles.cellBackViewStyle}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* First column (styleName, fabric, color) */}
          <View style={{flex: 3}}>
            <Text
              style={[
                CommonStyles.tylesTextStyle,
                {fontWeight: '500', fontSize: 15},
              ]}>
              {item.styleName}
            </Text>

            <Text style={CommonStyles.tylesTextStyle}>
              {item.fabric} <Text style={{fontWeight: 'bold'}}> (</Text>
              <Text style={{fontWeight: '500'}}>{item.color}</Text>
              <Text style={{fontWeight: 'bold'}}> )</Text>
            </Text>
          </View>

          <View style={{width: 25}} />
          <View style={{flex: 1}}>
            <Text style={CommonStyles.tylesTextStyle}>{item.process}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const fetchMore = () => {
    props.fetchMore(true);
  };

  const onRefresh = () => {
    set_refreshing(true);
    props.fetchMore(false);
    set_refreshing(false);
  };

  return (
    <View style={[CommonStyles.mainComponentViewStyle]}>
      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Style List'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={[CommonStyles.headerStyle]}>
        {filterArray ? (
          <View style={CommonStyles.searchBarStyle}>
            <View style={[CommonStyles.searchInputContainerStyle]}>
              <Image source={searchImg} style={CommonStyles.searchImageStyle} />
              <TextInput
                style={CommonStyles.searchTextInputStyle}
                underlineColorAndroid="transparent"
                placeholder="Search"
                placeholderTextColor="#7F7F81"
                autoCapitalize="none"
                value={recName}
                onFocus={() => (isKeyboard.current = true)}
                onChangeText={name => {
                  filterPets(name);
                }}
              />
            </View>
          </View>
        ) : null}

        {filterArray && filterArray.length > 0 ? (
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                CommonStyles.tylesHeaderTextStyle,
                {flex: 3, textAlign: 'left'},
              ]}>
              {'Style Details'}
            </Text>
            <Text style={[CommonStyles.tylesHeaderTextStyle, {flex: 1}]}>
              {'Process'}
            </Text>
          </View>
        ) : (
          <View style={CommonStyles.noRecordsFoundStyle}>
            {!props.MainLoading ? (
              <Text style={[CommonStyles.tylesHeaderTextStyle, {fontSize: 18}]}>
                {Constant.noRecFound}
              </Text>
            ) : null}
          </View>
        )}

        {/* <View style={CommonStyles.listStyle}>
          <FlatList
            data={filterArray}
            renderItem={renderItem}
            keyExtractor={(item, index) => "" + index}
            showsVerticalScrollIndicator={false}
          />
        </View> */}

        <View style={CommonStyles.listStyle}>
          
            <FlatList
              data={filterArray}
              renderItem={renderItem}
              keyExtractor={(item, index) => '' + index}
              showsVerticalScrollIndicator={false}
              onEndReached={() => fetchMore()}
              onEndReachedThreshold={0.2}
              ListFooterComponent={() =>
                props.isLoading && <ActivityIndicator size="large" />
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          
        </View>
      </View>

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopLeft}
            isRightBtnEnable={true}
            leftBtnTilte={'NO'}
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={() => popOkBtnAction()}
            popUpLeftBtnAction={() => popCancelBtnAction()}
          />
        </View>
      ) : null}

      {props.MainLoading === true ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

export default StyleManageUI;

const styles = StyleSheet.create({
  imgStyle: {
    height: hp('5%'),
    aspectRatio: 1,
    borderColor: '#5177c0',
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5177c0',
  },
});
