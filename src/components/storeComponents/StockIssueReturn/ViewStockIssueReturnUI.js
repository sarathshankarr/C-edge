import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CommonStyles from './../../../utils/commonStyles/commonStyles';
import HeaderComponent from './../../../utils/commonComponents/headerComponent';
import * as Constant from './../../../utils/constants/constant';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Confirmed shape from POST stockIssueReturn/view:
// {status, data: {sird_id, sird_date, sird_saveType, particulars: [{sirp_id,
//   sirp_type, sirp_fabRmId, sirp_stockIssueId, sirp_approvedQty,
//   sirp_returnQty, sirp_rollId, sirp_rollNo, fabRollData}]}}
const PARTICULAR_COLUMNS = [
  {key: 'sirp_type', label: 'Type', width: 90},
  {key: 'sirp_fabRmId', label: 'Fabric/RM Id', width: 120},
  {key: 'sirp_stockIssueId', label: 'Stock Issue Id', width: 130},
  {key: 'sirp_approvedQty', label: 'Approved Qty', width: 120},
  {key: 'sirp_returnQty', label: 'Return Qty', width: 110},
  {key: 'sirp_rollId', label: 'Roll Id', width: 100},
  {key: 'sirp_rollNo', label: 'Roll No', width: 110},
  {key: 'fabRollData', label: 'Roll Data', width: 140},
];

const ViewStockIssueReturnUI = ({route, ...props}) => {
  const itemsObj = props.itemsObj || {};
  const particulars = useMemo(() => itemsObj?.particulars || [], [itemsObj]);

  const backBtnAction = () => {
    props.backBtnAction();
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
          title={'Stock Issue Return View'}
          backBtnAction={backBtnAction}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: hp('15%'), width: '100%'}}>
        <View
          style={{
            marginBottom: hp('5%'),
            width: '90%',
            marginHorizontal: wp('5%'),
          }}>
          <View style={{height: 15}} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stock Id</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>{itemsObj?.sird_id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>
              {itemsObj?.sird_date
                ? Constant.formatDateIntoDMY(itemsObj.sird_date)
                : ''}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Save Type</Text>
            <Text style={styles.infoColon}>:</Text>
            <Text style={styles.infoValue}>{itemsObj?.sird_saveType}</Text>
          </View>

          {particulars.length > 0 && (
            <View style={styles.wrapper}>
              <ScrollView nestedScrollEnabled={true} horizontal>
                <View style={styles.table}>
                  <View style={styles.table_head}>
                    {PARTICULAR_COLUMNS.map(col => (
                      <View style={{width: col.width}} key={col.key}>
                        <Text style={styles.table_head_captions}>
                          {col.label}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {particulars.map((row, index) => (
                    <View key={row?.sirp_id ?? index} style={styles.table_body_single_row}>
                      {PARTICULAR_COLUMNS.map(col => (
                        <View style={{width: col.width}} key={col.key}>
                          <Text style={styles.table_data}>
                            {row?.[col.key] ?? ''}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>

      <View style={CommonStyles.bottomViewComponentStyle1}>
        <View style={styles.mainComponentStyle}>
          <TouchableOpacity style={styles.backButtonStyle} onPress={backBtnAction}>
            <Text style={styles.backBtnTextStyle}>{'Back'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ViewStockIssueReturnUI;

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    width: 100,
  },
  infoColon: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: hp('5%'),
    width: '100%',
  },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  table_head: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#5177c0',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  table_head_captions: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  table_body_single_row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 7,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  table_data: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
  },
  mainComponentStyle: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: 'white',
    position: 'absolute',
    padding: 20,
    justifyContent: 'center',
  },
  backButtonStyle: {
    backgroundColor: '#2979ff',
    height: hp('7%'),
    borderRadius: hp('0.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnTextStyle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
