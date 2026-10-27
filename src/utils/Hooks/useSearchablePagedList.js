import {useCallback, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as APIServiceCall from '../apiCalls/apiCallsComponent';
import {MOBILE_LIST_PAGE_SIZE} from '../constants/mobileListConfig';

// Server-side searchable + paged list for the mobile list APIs.
//
// config  — an entry from MOBILE_LIST_CONFIG (endpoint/path, menuId, extraBody,
//           searchOptions, dateFilters, searchUsesDateFilter, uniqueKey)
// options — {onInvalidLogin, extraBody, menuId, mapRow}
//           menuId/extraBody override the config; mapRow(row) converts each API row
//           (e.g. to the field names a screen's existing row UI already reads)
//
// Behaviour (mirrors the web list pages):
//   - page load / refresh: no search, default date filter, rows 0..25
//   - infinite scroll: +25 per page (list and search alike), stops when a page
//     returns < 25 raw rows
//   - pages are de-duplicated by config.uniqueKey (backend repeats the previous
//     page's last row, so a full page can be 26 rows with 1 duplicate)
//   - search runs on the Search button; a new search, field change, clear or
//     date-filter change empties the list and starts again from page 1
//   - only the latest request's response is applied
const NOT_SEARCHING = '-1';

const useSearchablePagedList = (config, options = {}) => {
  const pageSize = MOBILE_LIST_PAGE_SIZE;
  const searchOptions = (config.searchOptions || []).filter(
    o => o.onlyMenuId === undefined || o.onlyMenuId === (options.menuId ?? config.menuId),
  );
  const dateFilters = config.dateFilters || [];
  const defaultDateFilter = dateFilters[0]?.value;

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [searchField, setSearchField] = useState(searchOptions[0]?.value);
  const [searchText, setSearchText] = useState('');
  const [activeSearch, setActiveSearch] = useState(null); // {field, text} or null
  const [dateFilter, setDateFilterState] = useState(defaultDateFilter);

  // Latest values for callbacks fired from FlatList (onEndReached etc.)
  const stateRef = useRef({});
  stateRef.current = {rows, isLoading, isLoadingMore, hasMore, activeSearch, dateFilter};
  const requestIdRef = useRef(0);
  const nextFromRef = useRef(0);
  const loadingMoreRef = useRef(false); // synchronous guard against double page loads
  const listRef = useRef(null); // attach to the FlatList: ref={list.listRef}
  const abortRef = useRef(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const getKey = useCallback(
    row => (row ? row[config.uniqueKey] : undefined),
    [config.uniqueKey],
  );

  const load = useCallback(
    async ({fromRecord, search, filter, append, refreshing = false, clear = false}) => {
      const requestId = ++requestIdRef.current;
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller =
        typeof AbortController !== 'undefined' ? new AbortController() : null;
      abortRef.current = controller;

      setError(undefined);
      loadingMoreRef.current = !!append;
      if (clear) {
        setRows([]);
        setHasMore(true);
      }
      if (append) {
        setIsLoadingMore(true);
      } else if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const userName = await AsyncStorage.getItem('userName');
      const userPwd = await AsyncStorage.getItem('userPsd');
      const compId = await AsyncStorage.getItem('companyId');

      const opts = optionsRef.current;
      const menuId = opts.menuId ?? config.menuId;
      const body = {
        userName,
        userPwd,
        fromRecord,
        toRecord: fromRecord + pageSize,
        styleSearchDropdown: search ? search.field : NOT_SEARCHING,
        searchKeyValue: search ? search.text : '',
        ...(config.sendCompany === false ? {} : {compIds: String(compId ?? '')}),
        ...(menuId !== undefined ? {menuId} : {}),
        ...(dateFilters.length ? {dataFilter: filter} : {}),
        ...(config.extraBody || {}),
        ...(opts.extraBody || {}),
      };

      const path = config.path || 'mobileList/' + config.endpoint;
      const result = await APIServiceCall.postMobileList(
        path,
        body,
        controller?.signal,
      );

      // A newer request was started — ignore this one.
      if (requestId !== requestIdRef.current) {
        return;
      }
      loadingMoreRef.current = false;
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);

      if (result.kind === 'ok') {
        const pageRows = opts.mapRow ? result.rows.map(opts.mapRow) : result.rows;
        nextFromRef.current = fromRecord + pageSize;
        // Stop rule uses the raw response size, before de-duplication.
        setHasMore(pageRows.length >= pageSize);
        setRows(prev => {
          if (!append) {
            return pageRows;
          }
          const seen = new Set(prev.map(getKey));
          const fresh = pageRows.filter(r => {
            const key = getKey(r);
            if (key === undefined || key === null) {
              return true;
            }
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          });
          return [...prev, ...fresh];
        });
      } else if (result.kind === 'invalidLogin') {
        setHasMore(false);
        if (!append) {
          setRows([]);
        }
        opts.onInvalidLogin && opts.onInvalidLogin();
      } else if (result.kind === 'aborted') {
        // superseded; nothing to do
      } else {
        setError(
          result.kind === 'noInternet'
            ? 'No internet connection. Please check and try again.'
            : 'Something went wrong while loading. Please try again.',
        );
        if (!append) {
          setRows([]);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, getKey, pageSize],
  );

  // Page 1 with the given search/filter
  const reload = useCallback(
    (search, filter, refreshing, clear) =>
      load({fromRecord: 0, search, filter, append: false, refreshing, clear}),
    [load],
  );

  useEffect(() => {
    reload(null, defaultDateFilter);
    return () => {
      // Invalidate any in-flight request so its response is ignored after unmount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      requestIdRef.current++;
      abortRef.current && abortRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    const s = stateRef.current;
    if (
      loadingMoreRef.current ||
      !s.hasMore ||
      s.isLoading ||
      s.isLoadingMore ||
      s.rows.length === 0
    ) {
      return;
    }
    load({
      fromRecord: nextFromRef.current,
      search: s.activeSearch,
      filter: s.dateFilter,
      append: true,
    });
  }, [load]);

  // Fallback for onEndReached (which can miss when the user stops right at the
  // bottom): pass as onScrollEndDrag and onMomentumScrollEnd on the FlatList.
  const onScrollEnd = useCallback(
    e => {
      const n = e?.nativeEvent;
      if (!n) {
        return;
      }
      const distanceFromEnd =
        n.contentSize.height - (n.contentOffset.y + n.layoutMeasurement.height);
      if (distanceFromEnd <= Math.max(40, n.layoutMeasurement.height * 0.2)) {
        loadMore();
      }
    },
    [loadMore],
  );

  const scrollToTop = useCallback(() => {
    try {
      listRef.current &&
        listRef.current.scrollToOffset({offset: 0, animated: false});
    } catch (e) {
      // list not mounted / empty
    }
  }, []);

  // Pull-to-refresh / screen re-focus: back to the default state, like a web page load.
  const refresh = useCallback(
    (asPullToRefresh = true) => {
      setSearchText('');
      setActiveSearch(null);
      setSearchField(searchOptions[0]?.value);
      setDateFilterState(defaultDateFilter);
      scrollToTop();
      reload(null, defaultDateFilter, asPullToRefresh);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reload, defaultDateFilter, scrollToTop],
  );

  const clearSearch = useCallback(() => {
    setSearchText('');
    setActiveSearch(null);
    scrollToTop();
    reload(null, stateRef.current.dateFilter, false, true);
  }, [reload, scrollToTop]);

  const submitSearch = useCallback(() => {
    const text = searchText.trim();
    if (!text) {
      clearSearch();
      return;
    }
    const search = {field: searchField, text};
    setActiveSearch(search);
    scrollToTop();
    reload(search, stateRef.current.dateFilter, false, true);
  }, [searchText, searchField, reload, clearSearch, scrollToTop]);

  // Changing the search field while a search is active re-runs it from page 1
  // with the new field.
  const changeSearchField = useCallback(
    value => {
      setSearchField(value);
      const active = stateRef.current.activeSearch;
      if (!active || active.field === value) {
        return;
      }
      const text = searchText.trim() || active.text;
      const search = {field: value, text};
      setSearchText(text);
      setActiveSearch(search);
      scrollToTop();
      reload(search, stateRef.current.dateFilter, false, true);
    },
    [searchText, reload, scrollToTop],
  );

  const setDateFilter = useCallback(
    value => {
      if (value === stateRef.current.dateFilter) {
        return;
      }
      setDateFilterState(value);
      let search = stateRef.current.activeSearch;
      if (search && !config.searchUsesDateFilter) {
        // Search ignores the date filter on this endpoint: changing the
        // filter goes back to the plain (filtered) list.
        search = null;
        setSearchText('');
        setActiveSearch(null);
      }
      scrollToTop();
      reload(search, value, false, true);
    },
    [config.searchUsesDateFilter, reload, scrollToTop],
  );

  const retry = useCallback(() => {
    reload(stateRef.current.activeSearch, stateRef.current.dateFilter);
  }, [reload]);

  return {
    rows,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    hasMore,
    searchOptions,
    searchField,
    setSearchField: changeSearchField,
    searchText,
    setSearchText,
    activeSearch,
    submitSearch,
    clearSearch,
    dateFilters,
    dateFilter,
    setDateFilter,
    loadMore,
    onScrollEnd,
    listRef,
    scrollToTop,
    refresh,
    retry,
    getKey,
  };
};

export default useSearchablePagedList;
