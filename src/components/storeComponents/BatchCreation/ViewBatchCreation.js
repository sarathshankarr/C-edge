import React, {useState, useCallback, useEffect} from 'react';
import ViewBatchCreationUI from './ViewBatchCreationUI';

const ViewBatchCreation = ({navigation, route, ...props}) => {
  const [itemsObj, set_itemsObj] = useState({});

  useEffect(() => {
    if (route?.params?.viewObject) {
      set_itemsObj(route.params.viewObject || {});
    }
  }, [route?.params]);

  const backBtnAction = useCallback(() => {
    navigation.navigate('BatchCreationList');
  }, [navigation]);

  return (
    <ViewBatchCreationUI itemsObj={itemsObj} backBtnAction={backBtnAction} />
  );
};

export default ViewBatchCreation;
