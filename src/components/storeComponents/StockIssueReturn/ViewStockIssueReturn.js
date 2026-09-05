import React, {useState, useCallback, useEffect} from 'react';
import ViewStockIssueReturnUI from './ViewStockIssueReturnUI';

const ViewStockIssueReturn = ({navigation, route, ...props}) => {
  const [itemsObj, set_itemsObj] = useState({});

  useEffect(() => {
    if (route?.params?.viewObject) {
      set_itemsObj(route.params.viewObject || {});
    }
  }, [route?.params]);

  const backBtnAction = useCallback(() => {
    navigation.navigate('StockIssueReturnList');
  }, [navigation]);

  return (
    <ViewStockIssueReturnUI itemsObj={itemsObj} backBtnAction={backBtnAction} />
  );
};

export default ViewStockIssueReturn;
