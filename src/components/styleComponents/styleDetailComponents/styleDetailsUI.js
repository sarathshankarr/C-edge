import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, } from "react-native-responsive-screen";
import * as Constant from "../../../utils/constants/constant";
import CommonStyles from "../../../utils/commonStyles/commonStyles";
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import { getEnvironment } from '../../../config/environment/environmentConfig';
const Environment = getEnvironment();

let arrowImg = require('./../../../../assets/images/png/arrowImg.png');
// let shirt3 = require('./../../../../assets/images/png/shirt3.jpeg');
const StyleDetailsUI = ({ route, ...props }) => {

  console.log("props.itemObj====> ", props.itemObj);

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const rgtBtnAction = () => {
    props.rgtBtnAction();
  };

  const lftBtnAction = () => {
    props.viewProcessFlowAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const sizeDetailsAction = () => {
    props.sizeDetailsAction();
  };

  let imgURL = Environment.uri + "ImageServlet?Path=" + props.image;

  return (

    <View style={[CommonStyles.mainComponentViewStyle]}>

      <View style={[CommonStyles.headerView]}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={'Details'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <View style={CommonStyles.headerStyle}>

        <View style={[CommonStyles.topViewStyle]}>
          <View style={CommonStyles.topSubViewStyle}>
            {console.log("Image URL ====>", imgURL)}
            <Image
              borderRadius={100}
              style={[CommonStyles.imgStyle]}
              source={{ uri: imgURL }}
            />
          </View>
        </View>

        <View style={{ marginTop: hp('5%') }}>
          <View style={{ width: '100%', flexDirection: 'row', marginVertical: hp('1%') }}>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{'Style No'}</Text>
              <Text style={[CommonStyles.tylesHeaderTextStyle, { marginLeft: hp('1%') }]}>{':'}</Text>
            </View>
            <View style={{ width: '60%', paddingLeft: hp('1%') }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{props.itemObj && props.itemObj.styleName ? props.itemObj.styleName : 'N/A'}</Text>
            </View>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', marginVertical: hp('1%') }}>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{'Fabric'}</Text>
              <Text style={[CommonStyles.tylesHeaderTextStyle, { marginLeft: hp('1%') }]}>{':'}</Text>
            </View>
            <View style={{ width: '60%', paddingLeft: hp('1%') }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{props.itemObj && props.itemObj.fabricName ? props.itemObj.fabricName : 'N/A'}</Text>
            </View>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', marginVertical: hp('1%') }}>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{'Customer Style No *'}</Text>
              <Text style={[CommonStyles.tylesHeaderTextStyle, { marginLeft: hp('1%') }]}>{':'}</Text>
            </View>
            <View style={{ width: '60%', paddingLeft: hp('1%') }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{props.itemObj && props.itemObj.customerStyle ? props.itemObj.customerStyle : 'N/A'}</Text>
            </View>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', marginVertical: hp('1%') }}>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{'Shipping Date'}</Text>
              <Text style={[CommonStyles.tylesHeaderTextStyle, { marginLeft: hp('1%') }]}>{':'}</Text>
            </View>
            <View style={{ width: '60%', paddingLeft: hp('1%') }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{props.itemObj && props.itemObj.shippingDate ? props.itemObj.shippingDate : 'N/A'}</Text>
            </View>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', marginVertical: hp('1%') }}>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{'Season'}</Text>
              <Text style={[CommonStyles.tylesHeaderTextStyle, { marginLeft: hp('1%') }]}>{':'}</Text>
            </View>
            <View style={{ width: '60%', paddingLeft: hp('1%') }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{props.itemObj && props.itemObj.season ? props.itemObj.season : 'N/A'}</Text>
            </View>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', marginVertical: hp('1%') }}>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{'FOB Price'}</Text>
              <Text style={[CommonStyles.tylesHeaderTextStyle, { marginLeft: hp('1%') }]}>{':'}</Text>
            </View>
            <View style={{ width: '60%', paddingLeft: hp('1%') }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{props.itemObj && props.itemObj.fob ? props.itemObj.fob : 'N/A'}</Text>
            </View>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: hp('1%') }}>
            <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{'Total Qty'}</Text>
              <Text style={[CommonStyles.tylesHeaderTextStyle, { marginLeft: hp('1%') }]}>{':'}</Text>
            </View>
            <View style={{ width: '60%', paddingLeft: hp('1%') }}>
              <Text style={[CommonStyles.tylesHeaderTextStyle, {}]}>{props.itemObj && props.itemObj.totalQty ? props.itemObj.totalQty : 'N/A'}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={sizeDetailsAction} style={styles.buttonStyle}>
                <Image source={arrowImg} style={styles.arrowIconStyle} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>

      <View style={CommonStyles.bottomViewComponentStyle}>
        <BottomComponent
          rightBtnTitle={'View Time and Action'}
          leftBtnTitle={'Production Summary'}
          isLeftBtnEnable={true}
          rigthBtnState={true}
          isRightBtnEnable={true}
          rightButtonAction={async () => rgtBtnAction()}
          leftButtonAction={async () => lftBtnAction()}
        />
      </View>

      {props.isPopUp ? <View style={CommonStyles.customPopUpStyle}>
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
      </View> : null}

      {props.isLoading === true ? <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} /> : null}

    </View>
  );
}

export default StyleDetailsUI;

const styles = StyleSheet.create({

  buttonStyle: {
    height: hp('5%'),
    width: wp('10%'),
    alignItems: 'flex-end',
  },

  arrowIconStyle: {
    width: wp('6%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },

});