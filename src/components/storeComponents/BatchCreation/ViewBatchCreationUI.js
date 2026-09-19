import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CommonStyles from './../../../utils/commonStyles/commonStyles';
import HeaderComponent from './../../../utils/commonComponents/headerComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// batchDetails row columns — field names best-effort match the `edit`
// endpoint's viewDTO.batchDetails[] shape (see report §5); unconfirmed
// against a live server per report §11.
const DETAIL_COLUMNS = [
  {key: 'batchName', label: 'Batch No', width: 120},
  {key: 'rollNo', label: 'Lot No', width: 100},
  {key: 'noOfPieces', label: 'Pieces', width: 90},
  {key: 'mtr', label: 'MTR', width: 90},
  {key: 'greyReceivedh', label: 'Grey Recd', width: 110},
];

const InfoRow = ({label, value}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoColon}>:</Text>
    <Text style={styles.infoValue}>{value ?? ''}</Text>
  </View>
);

const ViewBatchCreationUI = ({route, ...props}) => {
  const itemsObj = props.itemsObj || {};
  const viewDTO = itemsObj?.viewDTO || {};
  const locationsMap = itemsObj?.locationsMap || {};
  const fabricMap = itemsObj?.fabricMap || {};
  const fabricFlowConfigMap = itemsObj?.fabricFlowConfigMap || {};

  const details = useMemo(
    () => viewDTO?.batchDetails || viewDTO?.batchCreationDetails || [],
    [viewDTO],
  );

  const locationLabel = locationsMap?.[viewDTO?.locationId] || viewDTO?.locationId;
  const fabricLabel = fabricMap?.[viewDTO?.fabricId] || viewDTO?.fabricId;
  const flowLabel = fabricFlowConfigMap?.[viewDTO?.fabricFlow] || viewDTO?.fabricFlow;

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
          title={'Batch Creation View'}
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

          <InfoRow label="Batch Id" value={viewDTO?.id} />
          <InfoRow label="Location" value={locationLabel} />
          <InfoRow label="Fabric Type" value={fabricLabel} />
          <InfoRow label="Cotton D" value={viewDTO?.cottonD} />
          <InfoRow label="Polys D" value={viewDTO?.polysD} />
          <InfoRow label="Desize D" value={viewDTO?.desizeD} />
          <InfoRow label="Party Name" value={viewDTO?.partyName} />
          <InfoRow label="Creation Date" value={viewDTO?.creationDate} />
          <InfoRow label="DC No" value={viewDTO?.dcNo} />
          <InfoRow label="Quality Name" value={viewDTO?.qualityNameh || viewDTO?.qualityName} />
          <InfoRow label="Grey Shortage" value={viewDTO?.greyShortage} />
          <InfoRow label="Weight" value={viewDTO?.weight} />
          <InfoRow label="Reed and Pick" value={viewDTO?.reedPick} />
          <InfoRow label="Fabric Process Flow" value={flowLabel} />
          <InfoRow label="Bio Finish" value={viewDTO?.bioFinish} />
          <InfoRow label="Remazol" value={viewDTO?.remazol} />
          <InfoRow label="Mercerise" value={viewDTO?.mercerise} />
          <InfoRow label="Lycra" value={viewDTO?.lycra} />
          <InfoRow label="Roll/Trolley" value={viewDTO?.rolltrolley} />
          <InfoRow label="Total Issued" value={viewDTO?.totalIssued} />
          <InfoRow label="Sample" value={viewDTO?.sample} />
          <InfoRow label="BSR" value={viewDTO?.bsr} />
          <InfoRow label="Delivery At" value={viewDTO?.deliveryAt} />

          {details.length > 0 && (
            <View style={styles.wrapper}>
              <ScrollView nestedScrollEnabled={true} horizontal>
                <View style={styles.table}>
                  <View style={styles.table_head}>
                    {DETAIL_COLUMNS.map(col => (
                      <View style={{width: col.width}} key={col.key}>
                        <Text style={styles.table_head_captions}>{col.label}</Text>
                      </View>
                    ))}
                  </View>

                  {details.map((row, index) => (
                    <View key={row?.id ?? index} style={styles.table_body_single_row}>
                      {DETAIL_COLUMNS.map(col => (
                        <View style={{width: col.width}} key={col.key}>
                          <Text style={styles.table_data}>{row?.[col.key] ?? ''}</Text>
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

export default ViewBatchCreationUI;

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  infoLabel: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
    width: 140,
  },
  infoColon: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    color: '#000',
    flexShrink: 1,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: hp('3%'),
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
