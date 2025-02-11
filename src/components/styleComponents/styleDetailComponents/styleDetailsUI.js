import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import BottomComponent from '../../../utils/commonComponents/bottomComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ColorContext} from '../../colorTheme/colorTheme';
import {List, TextInput} from 'react-native-paper';

let arrowImg = require('./../../../../assets/images/png/arrowImg.png');
let closeImg = require('./../../../../assets/images/png/close1.png');

let downArrowImg = require('./../../../../assets/images/png/dropDownImg.png');

const HeadingItemsList = [
  {id: 1, title: ' Edit Style'},
  {id: 2, title: 'Production Summary'},
  {id: 3, title: 'View Time and Action'},
  {id: 4, title: 'RM Allocation(BOM)'},
];

const StyleDetailsUI = ({route, ...props}) => {
  const {colors} = useContext(ColorContext);
  const styles = getStyles(colors);

  useEffect(() => {
    // console.log('item obj1 ==> ', props.itemObj);
    if (props.itemObj) {
      if (props.itemObj.styleName) {
        setStyleNo(props.itemObj.styleName);
      }
      if (props.itemObj.styleDesc) {
        setStyleDescription(props.itemObj.styleDesc);
      }
      if (props.itemObj.colorsMap) {
        const colorsMapList = Object.keys(props.itemObj.colorsMap).map(key => ({
          id: key,
          name: props.itemObj.colorsMap[key],
        }));
        setColorList(colorsMapList);
        setFilteredColor(colorsMapList);
        set_editColor(false);
      }
      if (props.itemObj.loadFabricStyles) {
        const loadFabricStylesList = Object.keys(
          props.itemObj.loadFabricStyles,
        ).map(key => ({
          id: props.itemObj.loadFabricStyles[key],
          name: key,
        }));
        setFilteredFabric(loadFabricStylesList);
        setFabricList(loadFabricStylesList);
      }
      if (props.itemObj.brandsMap) {
        const brandsMapList = Object.keys(props.itemObj.brandsMap).map(key => ({
          id: key,
          name: props.itemObj.brandsMap[key],
        }));
        setBrandList(brandsMapList);
        setFilteredBrand(brandsMapList);
      }
      if (props.itemObj.customerStyle) {
        setCustomerStyleNo(props.itemObj.customerStyle);
      }
      if (props.itemObj.season) {
        setSeasonName(props.itemObj.season);
      }
      if (props.itemObj.sizeGroupId) {
        setSeasonId(props.itemObj.sizeGroupId);
        set_editSeason(false);
      }
      if (props.itemObj.locationId) {
        setLocationId(props.itemObj.locationId);
        setLocationName(props.itemObj.locationsMap[props.itemObj.locationId]);
        set_editLocation(false);
      }
      if (props.itemObj.fabricId) {
        if (props.itemObj.loadFabricStyles) {
          const loadFabricStylesList = Object.keys(
            props.itemObj.loadFabricStyles,
          ).map(key => ({
            id: props.itemObj.loadFabricStyles[key],
            name: key,
          }));

          const found = loadFabricStylesList.filter(
            item => item.id === props.itemObj.fabricId,
          );

          // console.log('found  ===> ', found, fabricId);
          if (found && found?.length > 0) {
            setFabricId(props.itemObj.fabricId);
            setFabricName(found[0]?.name || '');
          } else {
            setFabricId(0);
            setFabricName('');
          }
        }
      }
      set_editFabric(false);
      if (props.itemObj.colorId) {
        setSelectedIndices([props.itemObj.colorId.toString()]);
        set_editColor(false);
        // console.log('setted color ', props.itemObj.colorId.toString());
      }
      if (props.itemObj.brandId) {
        setBrandId(props.itemObj.brandId);
        setBrandName(props.itemObj.brandsMap[props.itemObj.brandId]);
      }
      if (props.itemObj.poQty) {
        setBuyerPOQty(props.itemObj.poQty.toString());
      }
      if (props.itemObj.hsn) {
        setHSN(props.itemObj.hsn);
      }
      if (props.itemObj.appConsumption) {
        setApprovedConsumption(props.itemObj.appConsumption);
      }
      if (props.itemObj.configurationId) {
        setProcessWorkFlowId(props.itemObj.configurationId);
        setProcessWorkFlowName(
          props.itemObj.confMap[props.itemObj.configurationId],
        );
        set_editeditProcessWF(false);
      }
      if (props.itemObj.fob) {
        setStylePriceFOB(props.itemObj.fob);
      }
      if (props.itemObj.mrp) {
        setMRPTagPrice(props.itemObj.mrp);
      }
      if (props.itemObj.sizeRangeId) {
        setScaleOrSizeId(props.itemObj.sizeRangeId);
        setScaleOrSizeName(
          props.itemObj.sizeRangesMap[props.itemObj.sizeRangeId],
        );
        set_editScaleOrSize(false);
      }
      if (props.itemObj.sizesGSCodesList) {
        // console.log("table   ==> ", props.itemObj.sizesGSCodesList);
        const ScaleTable = props.itemObj?.sizesGSCodesList?.map(
          (item, index) => ({
            id: item.size_id,
            name: item.sizeCode,
            consumption: item.size_cons,
            invLimit: item.sizeInvLimit,
          }),
        );
        set_scaleTable(ScaleTable);

        set_showScaleTable(true);
      }
      if (props.itemObj.styleTrimCodeMappingList) {
        const ary = props.itemObj.styleTrimCodeMappingList;

        const table = ary.map(item => ({
          rmType: item.trimTypeName,
          List: Object.entries(item.trimWiseTrimNamesMap).map(([id, name]) => ({
            id,
            name,
          })),
        }));

        const table1 = ary.map((item, index) => ({
          idx: index + 1,
          rmType: item.trimTypeName ?? '',
          selectedRmName: '',
          selectedRmId: '',
          showList: false,
          showRmRow: false,
          childList: [],
          List: item.trimWiseTrimNamesMap
            ? Object.entries(item.trimWiseTrimNamesMap).map(([id, name]) => ({
                id,
                name,
              }))
            : [],
          filteredList: item.trimWiseTrimNamesMap
            ? Object.entries(item.trimWiseTrimNamesMap).map(([id, name]) => ({
                id,
                name,
              }))
            : [],
        }));

        setRmAllocationBomList(table1);
        // console.log("table ==> ",table1[0].List , typeof table, table?.length);
      }
    }
  }, [props.itemObj]);

  useEffect(() => {
    if (props.listItems) {
      if (props.listItems.styleDetailsList) {
        // console.log('item obj2 ==> ', props.listItems.styleDetailsList);
      }
    }
  }, [props.listItems]);

  const [selectedTab, setSelectedTab] = useState(1);

  const [name, setName] = useState('');
  const [scaleTable, set_scaleTable] = useState([]);
  const [showScaleTable, set_showScaleTable] = useState(false);
  const [styleNo, setStyleNo] = useState('');
  const [styleDescription, setStyleDescription] = useState('');
  const [customerStyleNo, setCustomerStyleNo] = useState('');
  const [buyerPOQty, setBuyerPOQty] = useState('');
  const [hsn, setHSN] = useState('');
  const [stylePriceFOB, setStylePriceFOB] = useState('');
  const [mrpTagPrice, setMRPTagPrice] = useState('');
  const [approvedConsumption, setApprovedConsumption] = useState('');

  const [editFabric, set_editFabric] = useState(true);
  const [editColor, set_editColor] = useState(true);
  const [editSeason, set_editSeason] = useState(true);
  const [editScaleOrSize, set_editScaleOrSize] = useState(true);
  const [editProcessWF, set_editeditProcessWF] = useState(true);
  const [editLocation, set_editLocation] = useState(true);

  // Location
  const [locationList, setLocationList] = useState([]);
  const [filteredLocation, setFilteredLocation] = useState([]);
  const [showLocationList, setShowLocationList] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationId, setLocationId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [RmAllocationBomList, setRmAllocationBomList] = useState([]);

  const actionOnLocation = item => {
    setLocationId(item.id);
    setLocationName(item.name);
    setShowLocationList(false);
  };

  const handleSearchLocation = text => {
    if (text.trim().length > 0) {
      const filtered = locationList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredLocation(filtered);
    } else {
      setFilteredLocation(locationList);
    }
  };

  // Fabric
  const [fabricList, setFabricList] = useState([]);
  const [filteredFabric, setFilteredFabric] = useState([]);
  const [showFabricList, setShowFabricList] = useState(false);
  const [fabricName, setFabricName] = useState('');
  const [fabricId, setFabricId] = useState('');

  const actionOnFabric = item => {
    setFabricId(item.id);
    setFabricName(item.name);
    setShowFabricList(false);
  };

  const handleSearchFabric = text => {
    if (text.trim().length > 0) {
      const filtered = fabricList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredFabric(filtered);
    } else {
      setFilteredFabric(fabricList);
    }
  };

  // Color
  const [colorList, setColorList] = useState([]);
  const [filteredColor, setFilteredColor] = useState([]);
  const [showColorList, setShowColorList] = useState(false);
  const [colorName, setColorName] = useState([]);
  const [colorId, setColorId] = useState('0');
  const [selectedIndices, setSelectedIndices] = useState([]);

  const actionOnColor = id => {
    setSelectedIndices(prevSelected => {
      const exists = prevSelected.some(i => i === id);

      if (exists) {
        return prevSelected.filter(i => i !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSearchColor = text => {
    if (text.trim().length > 0) {
      const filtered = colorList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredColor(filtered);
    } else {
      setFilteredColor(colorList);
    }
  };

  // Season
  const [seasonList, setSeasonList] = useState([]);
  const [filteredSeason, setFilteredSeason] = useState([]);
  const [showSeasonList, setShowSeasonList] = useState(false);
  const [seasonName, setSeasonName] = useState('');
  const [seasonId, setSeasonId] = useState('');

  const actionOnSeason = item => {
    setSeasonId(item.id);
    setSeasonName(item.name);
    setShowSeasonList(false);
    setScaleOrSizeId('');
    setScaleOrSizeName('');
    set_scaleTable([]);
    // props.getloadScalesOnSizeGroup(item.id);
  };

  const handleSearchSeason = text => {
    if (text.trim().length > 0) {
      const filtered = seasonList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredSeason(filtered);
    } else {
      setFilteredSeason(seasonList);
    }
  };

  // ScaleOrSize
  const [scaleOrSizeList, setScaleOrSizeList] = useState([]);
  const [filteredScaleOrSize, setFilteredScaleOrSize] = useState([]);
  const [showScaleOrSizeList, setShowScaleOrSizeList] = useState(false);
  const [scaleOrSizeName, setScaleOrSizeName] = useState('');
  const [scaleOrSizeId, setScaleOrSizeId] = useState('');

  const actionOnScaleOrSize = item => {
    setScaleOrSizeId(item.id);
    setScaleOrSizeName(item.name);
    setShowScaleOrSizeList(false);
    props.getSizesBasedOnScale(seasonId, item.id);
    set_showScaleTable(item.id ? true : false);
  };

  const handleSearchScaleOrSize = text => {
    if (text.trim().length > 0) {
      const filtered = scaleOrSizeList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredScaleOrSize(filtered);
    } else {
      setFilteredScaleOrSize(scaleOrSizeList);
    }
  };

  // Process Work Flow
  const [processWorkFlowList, setProcessWorkFlowList] = useState([]);
  const [filteredProcessWorkFlow, setFilteredProcessWorkFlow] = useState([]);
  const [showProcessWorkFlowList, setShowProcessWorkFlowList] = useState(false);
  const [processWorkFlowName, setProcessWorkFlowName] = useState('');
  const [processWorkFlowId, setProcessWorkFlowId] = useState('');

  const actionOnProcessWorkFlow = item => {
    setProcessWorkFlowId(item.id);
    setProcessWorkFlowName(item.name);
    setShowProcessWorkFlowList(false);
  };

  const handleSearchProcessWorkFlow = text => {
    if (text.trim().length > 0) {
      const filtered = processWorkFlowList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProcessWorkFlow(filtered);
    } else {
      setFilteredProcessWorkFlow(processWorkFlowList);
    }
  };

  // Brand
  const [brandList, setBrandList] = useState([]);
  const [filteredBrand, setFilteredBrand] = useState([]);
  const [showBrandList, setShowBrandList] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [brandId, setBrandId] = useState('');

  const actionOnBrand = item => {
    setBrandId(item.id);
    setBrandName(item.name);
    setShowBrandList(false);
  };

  const handleSearchBrand = text => {
    if (text.trim().length > 0) {
      const filtered = brandList.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredBrand(filtered);
    } else {
      setFilteredBrand(brandList);
    }
  };

  const backBtnAction = () => {
    props.backBtnAction();
  };

  const rgtBtnAction = () => {
    if (
      !styleNo &&
      !customerStyleNo &&
      !locationId &&
      selectedIndices.length > 0 &&
      !seasonId &&
      buyerPOQty &&
      !scaleOrSizeId &&
      !hsn &&
      !processWorkFlowId
    ) {
      Alert.alert('Please fill all mandatory fields !');
      return;
    }

    if (!brandId) {
      Alert.alert(
        'Confirm',
        'Do you want to Continue without Brand?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => proceedWithSubmission(),
          },
        ],
        {cancelable: false},
      );
      return;
    }
    proceedWithSubmission();
  };
  const proceedWithSubmission = () => {
    const consumptionObj = {};
    const invLimitObj = {};
    const emptyObj1 = {};
    const emptyObj2 = {};

    scaleTable.forEach(item => {
      consumptionObj[item.id] = item.consumption;
      invLimitObj[item.id] = item.invLimit;
      emptyObj1[item.id] = '';
      emptyObj2[item.id] = '0';
    });

    const colorStr = selectedIndices.join(',') + ',';
    const colorStr1 = selectedIndices.join(',');

    const tempObj = {
      styleNo: styleNo,
      styleDesc: styleDescription,
      customerStyle: customerStyleNo,
      locationId: locationId,
      fabricId: fabricId,
      colorIDStr: colorStr,
      fabric: fabricName,
      multi_loc: locationId,
      colorId: selectedIndices.length === 1 ? colorStr1 : '0',
      brandId: brandId,
      poQty: buyerPOQty,
      sizeGroupId: seasonId,
      sizeRangeId: scaleOrSizeId,
      hsn: hsn,
      configurationId: processWorkFlowId,
      price: stylePriceFOB,
      mrp: mrpTagPrice,
      newBrand: '',
      gst: '0',
      appConsumption: approvedConsumption,
      gsCodesMap: emptyObj2,
      gsCodesPriceMap: emptyObj1,
      articleNumberMap: emptyObj1,
      gscodesizeprice: emptyObj1,
      sizeWiseEAN: emptyObj1,
      sizeCons: consumptionObj,
      weightMap: emptyObj2,
      sizeWiseInvLimit: invLimitObj,
    };
    // console.log("Temp obj ===> ", tempObj)
    props.submitAction(tempObj);
  };

  const lftBtnAction = () => {
    props.backBtnAction();
  };

  const popOkBtnAction = () => {
    props.popOkBtnAction();
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => actionOnRow(item, index)}
        style={CommonStyles.cellBackViewStyle}>
        <View style={[{flexDirection: 'row'}]}>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 1, textAlign: 'center'},
            ]}>
            {item.size}
          </Text>
          <Text
            style={[
              CommonStyles.tylesTextStyle,
              {flex: 2, textAlign: 'center'},
            ]}>
            {item.sizeQty}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const RemoveRow = selectedId => {
    const filtered = RmAllocationBomList.map(r =>
      r.id === selectedId
        ? {
            ...r,
            showRmRow: !r.showRmRow,
          }
        : {...r, showRmRow: false},
    );
    setRmAllocationBomList(filtered);
  };

  const ToggleRow = selectedId => {
    const filtered = RmAllocationBomList.map(r => ({
      ...r,
      showRmRow: r.id === selectedId ? !r.showRmRow : false,
    }));
    setRmAllocationBomList(filtered);
  };

  const handleAdd = selectedId => {
    const selectedItem = RmAllocationBomList.find(r => r.idx === selectedId);

    if (!selectedItem) return;
    if (!selectedItem.selectedRmId) {
      Alert.alert('Please select RM Name');
      return;
    }

    const alreadyExists = selectedItem.childList.some(
      child => child.id === selectedItem.selectedRmId,
    );

    if (alreadyExists) {
      Alert.alert('This RM is already selected');
      return;
    }

    const newObj = {
      id: selectedItem.selectedRmId,
      name: selectedItem.selectedRmName,
      consumption: '',
      requiredQty: '',
    };

    const updatedList = RmAllocationBomList.map(r =>
      r.idx === selectedId
        ? {...r, childList: [...r.childList, newObj], showRmRow: true}
        : r,
    );

    setRmAllocationBomList(updatedList);
  };

  const ToggleChildRow = (childIdx, selectedId) => {
    const updatedList = RmAllocationBomList.map(r =>
      r.idx === selectedId
        ? {
            ...r,
            childList: r.childList.filter((_, index) => index !== childIdx),
          }
        : r,
    );

    setRmAllocationBomList(updatedList);
  };

  const actionOnRMList = (item, selectedId) => {
    const updatedList = RmAllocationBomList.map(r =>
      r.idx === selectedId
        ? {
            ...r,
            selectedRmName: item?.name,
            selectedRmId: item?.id,
            showList: false,
          }
        : r,
    );

    setRmAllocationBomList(updatedList);
  };

  const handleChangeChildItems = (text, type, childIdx, selectedId) => {
    // console.log('handleChangeChildItems ===> ', text, type, childIdx, selectedId)
    const updatedList = RmAllocationBomList.map(r =>
      r.idx === selectedId
        ? {
            ...r,
            childList: r.childList.map((item, index) =>
              index === childIdx
                ? {
                    ...item,
                    [type === 'cons' ? 'consumption' : 'requiredQty']: text,
                  }
                : item,
            ),
          }
        : r,
    );

    setRmAllocationBomList(updatedList);
  };

  const handleChangeSearchQuery = (text, selectedId) => {
    const filtered = RmAllocationBomList.map(item =>
      item.idx === selectedId
        ? {
            ...item,
            filteredList: item.List.filter(item1 =>
              item1.name.toLowerCase().includes(text.toLowerCase()),
            ),
          }
        : item,
    );

    setSearchQuery(text);
    setRmAllocationBomList(filtered);
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
          title={'Details'}
          backBtnAction={() => backBtnAction()}
        />
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={130}
        extraScrollHeight={130}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: '90%',
            marginHorizontal: 10,
            marginTop: hp('2%'),
          }}>
          <ScrollView
            // horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}>
            {HeadingItemsList.map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  selectedTab === tab.id && styles.activeTabButton,
                ]}
                onPress={() => setSelectedTab(tab.id)}>
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab.id && styles.activeTabText,
                  ]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedTab == 1 && (
          <View
            style={{
              marginBottom: hp('5%'),
              // width: '100%',
              marginTop: hp('2%'),
              marginHorizontal: wp('5%'),
            }}>
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="Style No *"
                value={styleNo}
                mode="outlined"
                editable={props?.itemObj?.styleName ? false : true}
                style={{
                  backgroundColor: props?.itemObj?.styleName
                    ? '#f8f8f8'
                    : '#fff',
                }}
                onChangeText={text => {
                  setStyleNo(text);
                  setCustomerStyleNo(text);
                }}
              />
            </View>
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="Style Description"
                value={styleDescription}
                mode="outlined"
                multiline
                onChangeText={text => setStyleDescription(text)}
              />
            </View>
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="Customer Style No *"
                value={customerStyleNo}
                mode="outlined"
                onChangeText={text => setCustomerStyleNo(text)}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: editLocation ? '#e8e8e8' : '#fff',
                marginTop: hp('2%'),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderWidth: 0.5,
                  borderColor: '#D8D8D8',
                  borderRadius: hp('0.5%'),
                  width: wp('90%'),
                }}
                onPress={() => {
                  setShowLocationList(!showLocationList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          locationId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Location *'}
                      </Text>
                      {locationId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {locationName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showLocationList && editLocation && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchLocation}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredLocation.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredLocation.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnLocation(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: editFabric ? '#e8e8e8' : '#fff',
                marginTop: hp('2%'),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderWidth: 0.5,
                  borderColor: '#D8D8D8',
                  borderRadius: hp('0.5%'),
                  width: wp('90%'),
                }}
                onPress={() => {
                  setShowFabricList(!showFabricList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          fabricId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Fabric '}
                      </Text>
                      {fabricId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {fabricName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showFabricList && editFabric && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchFabric}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredFabric.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredFabric.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnFabric(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: editColor ? '#e8e8e8' : '#fff',
                marginTop: hp('2%'),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderWidth: 0.5,
                  borderColor: '#D8D8D8',
                  borderRadius: hp('0.5%'),
                  width: wp('90%'),
                }}
                onPress={() => {
                  setShowColorList(!showColorList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          selectedIndices.length > 0
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Color *'}
                      </Text>
                      {selectedIndices.length > 0 ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {colorList
                            .filter(color => selectedIndices.includes(color.id))
                            .map(color => color.name)
                            .join(', ')}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showColorList && editColor && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchColor}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredColor.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredColor.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.itemContainer}
                          onPress={() => actionOnColor(item.id)}>
                          <CustomCheckBox
                            isChecked={selectedIndices.includes(item.id)}
                            onToggle={() => actionOnColor(item.id)}
                          />
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: editSeason ? '#e8e8e8' : '#fff',
                marginTop: hp('2%'),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderWidth: 0.5,
                  borderColor: '#D8D8D8',
                  borderRadius: hp('0.5%'),
                  width: wp('90%'),
                }}
                onPress={() => {
                  setShowSeasonList(!showSeasonList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          seasonName
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Season  *'}
                      </Text>
                      {seasonName ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {seasonName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showSeasonList && editSeason && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchSeason}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredSeason.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredSeason.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnSeason(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="Buyer PO Qty *"
                value={buyerPOQty}
                mode="outlined"
                onChangeText={text => setBuyerPOQty(text)}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                marginTop: hp('2%'),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderWidth: 0.5,
                  borderColor: '#D8D8D8',
                  borderRadius: hp('0.5%'),
                  width: wp('90%'),
                }}
                onPress={() => {
                  setShowBrandList(!showBrandList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          brandId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Brand/Project'}
                      </Text>
                      {brandId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {brandName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showBrandList && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchBrand}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredBrand.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredBrand.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnBrand(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="Style Price FOB "
                value={stylePriceFOB}
                mode="outlined"
                onChangeText={text => setStylePriceFOB(text)}
              />
            </View>

            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="Approved consumption"
                value={approvedConsumption}
                mode="outlined"
                onChangeText={text => setApprovedConsumption(text)}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: editScaleOrSize ? '#e8e8e8' : '#fff',
                marginTop: hp('2%'),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderWidth: 0.5,
                  borderColor: '#D8D8D8',
                  borderRadius: hp('0.5%'),
                  width: wp('90%'),
                }}
                onPress={() => {
                  setShowScaleOrSizeList(!showScaleOrSizeList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          scaleOrSizeId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Scale/Size group *'}
                      </Text>
                      {scaleOrSizeId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {scaleOrSizeName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showScaleOrSizeList && editScaleOrSize && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchScaleOrSize}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredScaleOrSize.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredScaleOrSize.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnScaleOrSize(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {showScaleTable && (
              <View style={styles.wrapper}>
                <View style={styles.table}>
                  {/* Table Head */}
                  <View style={styles.table_head}>
                    <View style={{width: '30%', alignItems: 'center'}}>
                      <Text style={styles.table_head_captions}>Size</Text>
                    </View>
                    <View style={{width: '1%'}} />
                    <View style={{width: '34%', alignItems: 'center'}}>
                      <Text style={styles.table_head_captions}>Cons.</Text>
                    </View>
                    <View style={{width: '1%'}} />
                    <View style={{width: '34%', alignItems: 'flex-end'}}>
                      <Text style={styles.table_head_captions}>Inv Limit</Text>
                    </View>
                  </View>
                </View>

                {/* Table Body */}
                {scaleTable &&
                  scaleTable.map((item, index) => (
                    <View key={index} style={styles.table_body_single_row}>
                      <View style={{width: '30%', alignItems: 'center'}}>
                        <Text style={styles.table_data}>{item.name}</Text>
                      </View>
                      <View style={{width: '1%'}} />
                      <View style={{width: '34%'}}>
                        <TextInput
                          style={styles.table_data_input}
                          value={item.consumption.toString()}
                          onChangeText={text => {
                            const updatedTable = [...scaleTable];
                            updatedTable[index].consumption = text;
                            set_scaleTable(updatedTable);
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={{width: '1%'}} />
                      <View style={{width: '34%'}}>
                        <TextInput
                          style={styles.table_data_input}
                          value={item.invLimit.toString()}
                          onChangeText={text => {
                            const updatedTable = [...scaleTable];
                            updatedTable[index].invLimit = text;
                            set_scaleTable(updatedTable);
                          }}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  ))}
              </View>
            )}

            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="HSN *"
                value={hsn}
                mode="outlined"
                onChangeText={text => setHSN(text)}
              />
            </View>
            <View style={{marginTop: hp('2%')}}>
              <TextInput
                label="MRP Tag price"
                value={mrpTagPrice}
                mode="outlined"
                onChangeText={text => setMRPTagPrice(text)}
              />
            </View>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: editProcessWF ? '#e8e8e8' : '#fff',
                marginTop: hp('2%'),
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderWidth: 0.5,
                  borderColor: '#D8D8D8',
                  borderRadius: hp('0.5%'),
                  width: wp('90%'),
                }}
                onPress={() => {
                  setShowProcessWorkFlowList(!showProcessWorkFlowList);
                }}>
                <View>
                  <View style={[styles.SectionStyle1, {}]}>
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={
                          processWorkFlowId
                            ? [styles.dropTextLightStyle]
                            : [styles.dropTextInputStyle]
                        }>
                        {'Process work flow *'}
                      </Text>
                      {processWorkFlowId ? (
                        <Text style={[styles.dropTextInputStyle]}>
                          {processWorkFlowName}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={{justifyContent: 'center'}}>
                  <Image source={downArrowImg} style={styles.imageStyle} />
                </View>
              </TouchableOpacity>

              {showProcessWorkFlowList && editProcessWF && (
                <View style={styles.dropdownContent1}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search "
                    onChangeText={handleSearchProcessWorkFlow}
                    placeholderTextColor="#000"
                  />
                  <ScrollView
                    style={styles.scrollView}
                    nestedScrollEnabled={true}>
                    {filteredProcessWorkFlow.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        Sorry, no results found!
                      </Text>
                    ) : (
                      filteredProcessWorkFlow.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownOption}
                          onPress={() => actionOnProcessWorkFlow(item)}>
                          <Text style={{color: '#000'}}>{item.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        )}

        {selectedTab == 2 && (
          <View
            style={{
              marginBottom: hp('5%'),
              marginTop: hp('2%'),
            }}>
            <View style={styles.wrapper}>
              <View style={styles.table}>
                <View style={styles.table_head}>
                  <View style={{width: '55%'}}>
                    <Text style={styles.table_head_captions}>
                      Production Name
                    </Text>
                  </View>
                  <View style={{width: '2%'}} />
                  <View style={{width: '20%'}}>
                    <Text style={styles.table_head_captions}>Total Qty</Text>
                  </View>
                  <View style={{width: '2%'}} />
                  <View style={{width: '20%'}}>
                    <Text style={styles.table_head_captions}>
                      Processed Qty
                    </Text>
                  </View>
                  <View style={{width: '1%'}} />
                </View>

                {props.listItems.productionSummary &&
                  props.listItems.productionSummary.styleresponselist &&
                  props.listItems.productionSummary.styleresponselist.map(
                    (item, index) => (
                      <View key={index} style={[styles.table_body_single_row]}>
                        <View style={{width: '55%'}}>
                          <Text style={styles.table_data}>
                            {item.processName}
                          </Text>
                        </View>
                        <View style={{width: '2%'}} />
                        <View style={{width: '20%'}}>
                          <Text style={styles.table_data}>{item.totalqty}</Text>
                        </View>
                        <View style={{width: '2%'}} />
                        <View style={{width: '20%'}}>
                          <Text style={styles.table_data}>
                            {item.processqty}
                          </Text>
                        </View>
                        <View style={{width: '1%'}} />
                      </View>
                    ),
                  )}
              </View>
            </View>
          </View>
        )}

        {selectedTab == 3 && (
          <View style={styles.wrapper}>
            <View style={styles.table}>
              <View style={styles.table_head}>
                <View style={{width: '35%'}}>
                  <Text style={styles.table_head_captions}>Process</Text>
                </View>
                <View style={{width: '1%'}} />
                <View style={{width: '15%'}}>
                  <Text style={styles.table_head_captions}>Start Date</Text>
                </View>
                <View style={{width: '1%'}} />
                <View style={{width: '15%'}}>
                  <Text style={styles.table_head_captions}>End Date</Text>
                </View>
                <View style={{width: '1%'}} />
                <View style={{width: '15%'}}>
                  <Text style={styles.table_head_captions}>
                    Actual Start Date
                  </Text>
                </View>
                <View style={{width: '2%'}} />
                <View style={{width: '15%'}}>
                  <Text style={styles.table_head_captions}>
                    Actual Start Date
                  </Text>
                </View>
              </View>
              {props.listItems.timeAndAction &&
                props.listItems.timeAndAction.map((item, index) => (
                  <View key={index} style={[styles.table_body_single_row]}>
                    <View style={{width: '35%'}}>
                      <Text style={styles.table_data}>{item.processName}</Text>
                    </View>
                    <View style={{width: '1%'}} />
                    <View style={{width: '15%'}}>
                      <Text style={styles.table_data}>
                        {item.plannedEndDate}
                      </Text>
                    </View>
                    <View style={{width: '1%'}} />
                    <View style={{width: '15%'}}>
                      <Text style={styles.table_data}>
                        {item.plannedStartDate}
                      </Text>
                    </View>
                    <View style={{width: '1%'}} />
                    <View style={{width: '15%'}}>
                      <Text style={styles.table_data}>
                        {item.actualStartDate}
                      </Text>
                    </View>
                    <View style={{width: '2%'}} />
                    <View style={{width: '15%'}}>
                      <Text style={styles.table_data}>
                        {item.actualEndDate}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}
        {selectedTab == 4 && (
          <View style={styles.wrapper}>
            <View style={styles.table}>
              <View style={styles.table_head}>
                <View style={{width: '15%'}}>
                  <Text style={styles.table_head_captions}>
                    Raw Material Type
                  </Text>
                </View>
                <View style={{width: '1%'}} />
                <View style={{width: '50%'}}>
                  <Text style={styles.table_head_captions}>
                    Raw Material Name
                  </Text>
                </View>
                <View style={{width: '1%'}} />
                <View style={{width: '16%'}}>
                  <Text style={styles.table_head_captions}>consumption</Text>
                </View>
                <View style={{width: '2%'}} />
                <View style={{width: '16%'}}>
                  <Text style={styles.table_head_captions}>Req Qty</Text>
                </View>
              </View>

              {RmAllocationBomList &&
                RmAllocationBomList?.map((item, index) => (
                  <View key={index}>
                    <View style={[styles.table_body_single_row]}>
                      <View style={{width: '15%'}}>
                        <Text style={styles.table_data}>{item?.rmType}</Text>
                      </View>
                      <View style={{width: '1%'}} />
                      <View style={{width: '50%'}}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: hp('1%'),
                            backgroundColor: '#ffffff',
                          }}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              borderWidth: 0.5,
                              borderColor: '#D8D8D8',
                              borderRadius: hp('0.5%'),
                              width: '100%',
                              overflow: 'hidden',
                            }}
                            onPress={() => {
                              setRmAllocationBomList(
                                RmAllocationBomList.map(r =>
                                  r.idx === item.idx
                                    ? {
                                        ...r,
                                        showList: !r.showList,
                                        filteredList: r.List,
                                      }
                                    : {
                                        ...r,
                                        showList: false,
                                        filteredList: r.List,
                                      },
                                ),
                              );
                            }}>
                            <View style={[styles.SectionStyle1]}>
                              <View style={{flexDirection: 'column'}}>
                                <Text
                                  style={
                                    item.selectedRmId
                                      ? styles.dropTextLightStyle
                                      : styles.dropTextInputStyle
                                  }>
                                  {'RM Name '}
                                </Text>
                                <Text style={styles.dropTextInputStyle}>
                                  {item.selectedRmId
                                    ? item.selectedRmName
                                    : 'Select '}
                                </Text>
                              </View>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                              <Image
                                source={downArrowImg}
                                style={styles.imageStyle}
                              />
                            </View>
                          </TouchableOpacity>
                          {item?.showList && (
                            <View style={styles.dropdownContent2}>
                              <TextInput
                                style={styles.searchInput}
                                placeholder="Search"
                                onChangeText={text =>
                                  handleChangeSearchQuery(text, item.idx)
                                }
                                placeholderTextColor="#000"
                              />
                              <ScrollView nestedScrollEnabled={true}>
                                {item?.filteredList?.length === 0 ? (
                                  <Text style={styles.noCategoriesText}>
                                    Sorry, no results found!
                                  </Text>
                                ) : (
                                  item?.filteredList?.map(item1 => (
                                    <TouchableOpacity
                                      key={item1?.id}
                                      style={{
                                        backgroundColor: item.childList.some(
                                          child => child.id === item1.id,
                                        )
                                          ? '#f3f3f3'
                                          : '#fff',
                                      }}
                                      onPress={() =>
                                        actionOnRMList(item1, item.idx)
                                      }>
                                      <View style={styles.dropdownOption}>
                                        {/* <Text style={{color: '#000'}}> */}
                                        <Text
                                          style={{
                                            color: '#000',
                                            flexWrap: 'wrap',
                                            width: '100%',
                                          }}
                                          numberOfLines={2}>
                                          {item1?.name}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  ))
                                )}
                              </ScrollView>
                            </View>
                          )}
                        </View>
                      </View>
                      <View style={{width: '1%'}} />
                      <View style={{width: '30%'}}>
                        <TouchableOpacity
                          onPress={() => handleAdd(item.idx)}
                          style={{
                            backgroundColor: '#f3f3f3',
                            padding: 5,
                            borderRadius: 15,
                            alignItems: 'center',
                            marginHorizontal: 20,
                          }}>
                          <Text style={{color: 'black'}}>ADD</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {item.showRmRow &&
                      item.childList.map((child, index) => (
                        <View
                          key={index}
                          style={[styles.table_body_single_row]}>
                          <View style={{width: '15%'}}>
                            <TouchableOpacity
                              style={{alignItems: '', justifyContent: ''}}
                              onPress={() => ToggleChildRow(index, item.idx)}>
                              <Image
                                source={closeImg}
                                style={styles.imageStyle1}
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={{width: '1%'}} />
                          <View style={{width: '50%'}}>
                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: hp('1%'),
                                backgroundColor: child.id
                                  ? '#f3f3f3'
                                  : '#ffffff',
                              }}>
                              <TouchableOpacity
                                style={{
                                  flexDirection: 'row',
                                  borderWidth: 0.5,
                                  borderColor: '#D8D8D8',
                                  borderRadius: hp('0.5%'),
                                  width: '100%',
                                  overflow: 'hidden',
                                }}
                                onPress={() => console.log('hi')}>
                                <View style={[styles.SectionStyle1]}>
                                  <View style={{flexDirection: 'column'}}>
                                    <Text
                                      style={
                                        item.idx
                                          ? styles.dropTextLightStyle
                                          : styles.dropTextInputStyle
                                      }>
                                      {'Rm Name '}
                                    </Text>
                                    <Text style={styles.dropTextInputStyle}>
                                      {child.id ? child.name : 'Select '}
                                    </Text>
                                  </View>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                  <Image
                                    source={downArrowImg}
                                    style={styles.imageStyle}
                                  />
                                </View>
                              </TouchableOpacity>
                              {false && (
                                <View style={styles.dropdownContent2}>
                                  <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search Stock"
                                    onChangeText={text =>
                                      console.log('text, row.id')
                                    }
                                    placeholderTextColor="#000"
                                  />
                                  <ScrollView nestedScrollEnabled={true}>
                                    {item?.List?.length === 0 ? (
                                      <Text style={styles.noCategoriesText}>
                                        Sorry, no results found!
                                      </Text>
                                    ) : (
                                      item?.List?.map(item1 => (
                                        <TouchableOpacity
                                          key={item1?.id}
                                          onPress={() =>
                                            console.log('item1, row.id')
                                          }>
                                          <View style={styles.dropdownOption}>
                                            <Text style={{color: '#000'}}>
                                              {item1?.name}
                                            </Text>
                                          </View>
                                        </TouchableOpacity>
                                      ))
                                    )}
                                  </ScrollView>
                                </View>
                              )}
                            </View>
                          </View>
                          <View style={{width: '1%'}} />
                          <View style={{width: '16%'}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={child.consumption}
                              onChangeText={text =>
                                handleChangeChildItems(
                                  text,
                                  'cons',
                                  index,
                                  item.idx,
                                )
                              }
                              keyboardType="numeric"
                            />
                          </View>
                          <View style={{width: '2%'}} />
                          <View style={{width: '16%'}}>
                            <TextInput
                              style={styles.table_data_input}
                              value={child.requiredQty}
                              onChangeText={text =>
                                handleChangeChildItems(
                                  text,
                                  'req',
                                  index,
                                  item.idx,
                                )
                              }
                              keyboardType="numeric"
                            />
                          </View>
                        </View>
                      ))}
                  </View>
                ))}
            </View>
          </View>
        )}

        <View style={{height: 200}}></View>
      </KeyboardAwareScrollView>

      {(selectedTab == 1 || selectedTab == 4) && (
        <View style={CommonStyles.bottomViewComponentStyle}>
          <BottomComponent
            rightBtnTitle={'Update'}
            leftBtnTitle={'Back'}
            isLeftBtnEnable={true}
            rigthBtnState={true}
            isRightBtnEnable={true}
            rightButtonAction={async () => rgtBtnAction()}
            leftButtonAction={async () => lftBtnAction()}
          />
        </View>
      )}

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

      {props.isLoading === true ? (
        <LoaderComponent
          isLoader={true}
          loaderText={Constant.LOADER_MESSAGE}
          isButtonEnable={false}
        />
      ) : null}
    </View>
  );
};

export default StyleDetailsUI;

const getStyles = colors =>
  StyleSheet.create({
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
    scrollView: {
      // paddingHorizontal: wp("2%"),
      maxHeight: 200,
    },
    tabsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      borderRadius: 10,
      // justifyContent: 'center'
    },
    tabButton: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 30,
      backgroundColor: '#f3f3f3',
      marginRight: 3,
      marginBottom: 10, // Adds space between rows of tabs
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 100,
    },
    activeTabButton: {
      backgroundColor: '#1f74ba',
      elevation: 3, // Slight increase in shadow for active tab
    },
    tabText: {
      fontSize: 14,
      color: '#555',
      fontWeight: '500', // Makes text slightly bolder for better readability
      textAlign: 'center',
    },
    activeTabText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    imageStyle: {
      // margin: "4%",
      height: wp('12%'),
      aspectRatio: 1,
      marginRight: wp('8%'),
      resizeMode: 'stretch',
    },
    popSearchViewStyle: {
      height: hp('40%'),
      width: wp('90%'),
      backgroundColor: '#f0f0f0',
      // bottom: 220,
      // position: 'absolute',
      // flex:1,
      alignSelf: 'center',
      // borderTopRightRadius: 15,
      // borderTopLeftRadius: 15,
      alignItems: 'center',
    },
    popSearchViewStyle1: {
      width: wp('90%'),
      backgroundColor: '#f0f0f0',
      // bottom: 220,
      // position: 'absolute',
      // flex:1,
      alignSelf: 'center',
      alignItems: 'center',
    },

    flatcontainer: {
      flex: 1,
    },

    flatview: {
      height: hp('8%'),
      marginBottom: hp('0.3%'),
      alignContent: 'center',
      justifyContent: 'center',
      borderBottomColor: 'black',
      borderBottomWidth: wp('0.1%'),
      width: wp('80%'),
      alignItems: 'center',
    },

    SectionStyle1: {
      flexDirection: 'row',
      // justifyContent: "center",
      alignItems: 'center',
      height: hp('7%'),
      width: wp('75%'),
      borderRadius: hp('0.5%'),
      // alignSelf: "center",
      // backgroundColor: "grey",
    },

    imageStyle: {
      // margin: "4%",
      height: wp('12%'),
      aspectRatio: 1,
      marginRight: wp('8%'),
      resizeMode: 'stretch',
    },

    dropTextInputStyle: {
      fontWeight: '300',
      fontSize: 18,
      marginLeft: wp('4%'),
      color: 'black',
      width: wp('80%'),
    },

    dropTextLightStyle: {
      fontWeight: '300',
      fontSize: 12,
      width: wp('60%'),
      alignSelf: 'flex-start',
      marginTop: hp('1%'),
      marginLeft: wp('4%'),
      color: '#000',
    },
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      marginTop: hp('2%'),
      width: '100%',
    },
    table: {
      width: '95%', // Reduces extra space on the sides
      backgroundColor: '#fff',
      elevation: 1,
      borderRadius: 5,
      overflow: 'hidden',
    },
    table_head: {
      backgroundColor: colors.color2,
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 5,
    },
    table_head_captions: {
      fontSize: 14,
      color: 'white',
      fontWeight: '600',
      textAlign: 'center',
    },
    table_body_single_row: {
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ddd',
      paddingVertical: 5,
      paddingHorizontal: 5,
      alignItems: 'center',
    },
    imageStyle1: {
      height: 30,
      aspectRatio: 1,
      resizeMode: 'contain',
      tintColor: 'red',
      alignSelf: 'center',
    },
    table_data: {
      fontSize: 13,
      color: '#333',
      textAlign: 'center',
    },
    searchInput: {
      marginTop: 10,
      borderRadius: 10,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginHorizontal: 10,
      paddingLeft: 10,
      marginBottom: 10,
      color: '#000000',
    },
    dropdownOption: {
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    dropdownContent1: {
      elevation: 5,
      // height: 220,
      maxHeight: 220,
      alignSelf: 'center',
      width: '98%',
      backgroundColor: '#fff',
      borderRadius: 10,
      borderColor: 'lightgray', // Optional: Adds subtle border (for effect)
      borderWidth: 1,
      marginTop: 3,
    },
    dropdownContent2: {
      elevation: 5,
      height: 220,
      alignSelf: 'center',
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 10,
      borderColor: 'lightgray', // Optional: Adds subtle border (for effect)
      borderWidth: 1,
      marginTop: 3,
    },
    noCategoriesText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      fontWeight: '600',
      color: '#000000',
    },
    itemContainer: {
      borderBottomColor: '#e0e0e0',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  });
