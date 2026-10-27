import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as Constant from './../../../utils/constants/constant';
import QRScanner2 from './../../qrScanner2/QrScanner2';

const scanImg = require('./../../../../assets/images/png/scan.png');

// GRN Checking bale/piece selection for one Batch Creation row (select mode)
// or the read-only list of a batch's saved picks (view mode). Mirrors the
// web form's popup — every validation/message here is the app's job, the
// server never reports piece errors back (it silently caps/skips on save).

// All meter maths is rounded to 4 decimals; anything <= EPS counts as zero.
export const EPS = 0.00005;
export const round4 = v => Math.round(v * 10000) / 10000;

const SOURCE_RANK = {MANUAL: 1, BALE_SCAN: 2, PIECE_SCAN: 3};
export const SOURCE_LABEL = {
  MANUAL: 'Manual',
  BALE_SCAN: 'Bale scan',
  PIECE_SCAN: 'Piece scan',
};

export const summarizePicks = picks => {
  const list = picks || [];
  return {
    count: list.length,
    total: round4(list.reduce((s, p) => s + (Number(p.allocatedMtrs) || 0), 0)),
  };
};

const sameCode = (a, b) =>
  !!a && !!b && String(a).toLowerCase() === String(b).toLowerCase();

const Checkbox = ({checked, onPress, disabled}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
    style={[styles.checkbox, checked && styles.checkboxChecked]}>
    {checked ? <Text style={styles.checkboxTick}>✓</Text> : null}
  </TouchableOpacity>
);

// Props (select mode): visible, rollNo, bales (each piece already carries
// `available`), initialPicks, onCancel, onAdd(picks).
// Props (view mode): visible, readOnly, viewPicks, onCancel.
const BalePieceSelectionModal = props => {
  const {visible, readOnly} = props;

  const scanInputRef = useRef(null);
  const scrollRef = useRef(null);
  const cardY = useRef({});
  const rowY = useRef({});
  const timers = useRef([]);

  const [scanText, set_scanText] = useState('');
  const [successText, set_successText] = useState('');
  // pieceId -> {qty, source, barcode}
  const [sel, set_sel] = useState({});
  // pieceId -> text being typed into Selected Mtrs (committed on end-editing)
  const [qtyText, set_qtyText] = useState({});
  const [highlightBale, set_highlightBale] = useState(null);
  const [highlightPiece, set_highlightPiece] = useState(null);
  const [cameraOpen, set_cameraOpen] = useState(false);

  const allBales = useMemo(() => props.bales || [], [props.bales]);

  // Only pieces with something available are shown; a bale with none is hidden.
  const visibleBales = useMemo(
    () =>
      allBales
        .map(b => ({...b, pieces: (b.pieces || []).filter(p => p.available > EPS)}))
        .filter(b => b.pieces.length > 0),
    [allBales],
  );

  const pieceById = useMemo(() => {
    const m = {};
    visibleBales.forEach(b => b.pieces.forEach(p => (m[p.pieceId] = {piece: p, bale: b})));
    return m;
  }, [visibleBales]);

  const focusScan = useCallback(() => {
    setTimeout(() => scanInputRef.current?.focus(), 100);
  }, []);

  const showAlert = useCallback(
    msg => {
      Alert.alert(Constant.DefaultAlert_MSG, msg, [{text: 'OK', onPress: focusScan}], {
        onDismiss: focusScan,
      });
    },
    [focusScan],
  );

  // Reset everything each time the popup opens; prefill from the row's
  // current (or saved) picks — only pieces still available, qty capped.
  useEffect(() => {
    if (!visible) return;
    set_scanText('');
    set_successText('');
    set_qtyText({});
    set_highlightBale(null);
    set_highlightPiece(null);
    set_cameraOpen(false);
    cardY.current = {};
    rowY.current = {};
    if (readOnly) return;
    const initial = {};
    (props.initialPicks || []).forEach(pick => {
      const hit = pieceById[pick.pieceId];
      if (!hit) return;
      const qty = round4(Math.min(Number(pick.allocatedMtrs) || 0, hit.piece.available));
      if (qty <= EPS) return;
      initial[pick.pieceId] = {
        qty,
        source: pick.selectionSource || 'MANUAL',
        barcode: pick.scannedBarcode || '',
      };
    });
    set_sel(initial);
    focusScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const flash = (setter, value) => {
    setter(value);
    timers.current.push(setTimeout(() => setter(cur => (cur === value ? null : cur)), 1500));
  };

  const scrollToY = y => {
    if (y === undefined) return;
    setTimeout(() => scrollRef.current?.scrollTo({y: Math.max(y - 20, 0), animated: true}), 50);
  };

  // Selecting an already-selected piece never changes its qty; it only
  // upgrades the source (and barcode) — PIECE_SCAN > BALE_SCAN > MANUAL.
  const withPiece = (cur, piece, source, barcode) => {
    const existing = cur[piece.pieceId];
    if (existing) {
      if (SOURCE_RANK[source] > SOURCE_RANK[existing.source]) {
        return {...cur, [piece.pieceId]: {...existing, source, barcode: barcode || ''}};
      }
      return cur;
    }
    return {
      ...cur,
      [piece.pieceId]: {qty: round4(piece.available), source, barcode: barcode || ''},
    };
  };

  const withoutPiece = (cur, pieceId) => {
    const next = {...cur};
    delete next[pieceId];
    return next;
  };

  const dropQtyText = pieceIds =>
    set_qtyText(cur => {
      const next = {...cur};
      pieceIds.forEach(id => delete next[id]);
      return next;
    });

  const togglePiece = piece => {
    if (sel[piece.pieceId]) {
      set_sel(cur => withoutPiece(cur, piece.pieceId));
      dropQtyText([piece.pieceId]);
    } else {
      set_sel(cur => withPiece(cur, piece, 'MANUAL', ''));
    }
  };

  const toggleBale = bale => {
    const allSelected = bale.pieces.every(p => sel[p.pieceId]);
    if (allSelected) {
      set_sel(cur => bale.pieces.reduce((acc, p) => withoutPiece(acc, p.pieceId), cur));
      dropQtyText(bale.pieces.map(p => p.pieceId));
    } else {
      set_sel(cur => bale.pieces.reduce((acc, p) => withPiece(acc, p, 'MANUAL', ''), cur));
    }
  };

  // Partial meters. Returns the new selection and an alert message (if the
  // value had to be capped to what's available).
  const applyQty = (cur, pieceId, text) => {
    const hit = pieceById[pieceId];
    if (!hit || !cur[pieceId]) return {next: cur, msg: null};
    const v = parseFloat(text);
    if (String(text).trim() === '' || isNaN(v) || v <= EPS) {
      return {next: withoutPiece(cur, pieceId), msg: null};
    }
    const available = round4(hit.piece.available);
    if (round4(v) > available) {
      return {
        next: {...cur, [pieceId]: {...cur[pieceId], qty: available}},
        msg: `Bale ${hit.bale.baleNo} / Piece ${hit.piece.pcNo} has only ${available} mtrs available.`,
      };
    }
    return {next: {...cur, [pieceId]: {...cur[pieceId], qty: round4(v)}}, msg: null};
  };

  const commitQty = pieceId => {
    if (qtyText[pieceId] === undefined) return;
    const {next, msg} = applyQty(sel, pieceId, qtyText[pieceId]);
    set_sel(next);
    dropQtyText([pieceId]);
    if (msg) showAlert(msg);
  };

  const runScan = raw => {
    const code = String(raw ?? '').trim();
    set_scanText('');
    focusScan();
    if (!code) return;

    const bale = allBales.find(b => sameCode(b.baleBarcode, code));
    if (bale) {
      const shown = visibleBales.find(b => b.baleId === bale.baleId);
      if (!shown) {
        showAlert(`Barcode ${code}: this bale has nothing left to add.`);
        return;
      }
      set_sel(cur => shown.pieces.reduce((acc, p) => withPiece(acc, p, 'BALE_SCAN', code), cur));
      set_successText(`Bale ${shown.baleNo} selected (${shown.pieces.length} pcs).`);
      flash(set_highlightBale, shown.baleId);
      scrollToY(cardY.current[shown.baleId]);
      return;
    }

    let found = null;
    allBales.some(b =>
      (b.pieces || []).some(p => {
        if (sameCode(p.pieceBarcode, code)) {
          found = {bale: b, piece: p};
          return true;
        }
        return false;
      }),
    );
    if (!found) {
      showAlert(`Barcode ${code} is not in this lot, or is already fully used.`);
      return;
    }
    if (!(found.piece.available > EPS)) {
      showAlert(`Barcode ${code}: this piece has nothing left to add.`);
      return;
    }
    set_sel(cur => withPiece(cur, found.piece, 'PIECE_SCAN', code));
    set_successText(`Bale ${found.bale.baleNo} / Piece ${found.piece.pcNo} selected.`);
    flash(set_highlightPiece, found.piece.pieceId);
    const baseY = cardY.current[found.bale.baleId];
    const offY = rowY.current[found.piece.pieceId];
    if (baseY !== undefined) scrollToY(baseY + (offY || 0));
  };

  const onCameraRead = value => {
    set_cameraOpen(false);
    if (value === null || value === undefined) {
      focusScan();
      return;
    }
    runScan(value);
  };

  const onAddPress = () => {
    // Flush any Selected Mtrs still being typed (Add tapped without blurring).
    let next = sel;
    let msg = null;
    Object.keys(qtyText).forEach(id => {
      const r = applyQty(next, id, qtyText[id]);
      next = r.next;
      msg = msg || r.msg;
    });
    if (Object.keys(qtyText).length) {
      set_sel(next);
      set_qtyText({});
    }
    if (msg) {
      showAlert(msg);
      return;
    }
    const picks = [];
    visibleBales.forEach(b =>
      b.pieces.forEach(p => {
        const s = next[p.pieceId];
        if (!s) return;
        picks.push({
          pieceId: p.pieceId,
          allocatedMtrs: round4(s.qty),
          selectionSource: s.source,
          scannedBarcode: s.barcode || '',
          baleId: b.baleId,
          baleNo: b.baleNo,
          pcNo: p.pcNo,
          checkedMtrs: p.checkedMtrs,
          rollNo: props.rollNo,
        });
      }),
    );
    props.onAdd(picks);
  };

  const onClose = () => {
    if (cameraOpen) {
      set_cameraOpen(false);
      focusScan();
      return;
    }
    props.onCancel();
  };

  const selectedSummary = useMemo(() => {
    const ids = Object.keys(sel);
    return {
      count: ids.length,
      total: round4(ids.reduce((s, id) => s + (Number(sel[id].qty) || 0), 0)),
    };
  }, [sel]);

  // ---- view mode ----------------------------------------------------------
  const viewGroups = useMemo(() => {
    if (!readOnly) return [];
    const groups = [];
    const byKey = {};
    (props.viewPicks || []).forEach(p => {
      const key = `${p.rollNo ?? ''}|${p.baleId ?? p.baleNo ?? ''}`;
      if (!byKey[key]) {
        byKey[key] = {key, rollNo: p.rollNo, baleNo: p.baleNo, picks: []};
        groups.push(byKey[key]);
      }
      byKey[key].picks.push(p);
    });
    return groups;
  }, [readOnly, props.viewPicks]);

  const viewMultiLot = useMemo(
    () => new Set((props.viewPicks || []).map(p => p.rollNo)).size > 1,
    [props.viewPicks],
  );
  const viewSummary = summarizePicks(props.viewPicks);

  const renderSelectBody = () => {
    if (visibleBales.length === 0) {
      return <Text style={styles.emptyText}>No bales / pieces left in this lot.</Text>;
    }
    return visibleBales.map(bale => {
      const allSelected = bale.pieces.every(p => sel[p.pieceId]);
      return (
        <View
          key={String(bale.baleId)}
          onLayout={e => (cardY.current[bale.baleId] = e.nativeEvent.layout.y)}
          style={[styles.card, highlightBale === bale.baleId && styles.cardHighlight]}>
          <View style={styles.cardHeader}>
            <Checkbox checked={allSelected} onPress={() => toggleBale(bale)} />
            <Text style={styles.cardTitle}>Bale No: {bale.baleNo}</Text>
            <Text style={styles.cardCount}>{bale.pieces.length} Pcs</Text>
          </View>
          <View style={styles.tableHead}>
            <View style={styles.colCheck} />
            <Text style={[styles.th, styles.colPc]}>Piece No</Text>
            <Text style={[styles.th, styles.colNum]}>Checked Mtrs</Text>
            <Text style={[styles.th, styles.colNum]}>Available</Text>
            <Text style={[styles.th, styles.colQty]}>Selected Mtrs</Text>
          </View>
          {bale.pieces.map(p => {
            const s = sel[p.pieceId];
            const text =
              qtyText[p.pieceId] !== undefined
                ? qtyText[p.pieceId]
                : s
                ? String(s.qty)
                : '';
            return (
              <View
                key={String(p.pieceId)}
                onLayout={e => (rowY.current[p.pieceId] = e.nativeEvent.layout.y)}
                style={[styles.tr, highlightPiece === p.pieceId && styles.trHighlight]}>
                <View style={styles.colCheck}>
                  <Checkbox checked={!!s} onPress={() => togglePiece(p)} />
                </View>
                <Text style={[styles.td, styles.colPc]}>{p.pcNo}</Text>
                <Text style={[styles.td, styles.colNum]}>{p.checkedMtrs}</Text>
                <Text style={[styles.td, styles.colNum]}>{round4(p.available)}</Text>
                <View style={styles.colQty}>
                  <TextInput
                    style={[styles.qtyInput, !s && styles.qtyInputDisabled]}
                    value={text}
                    editable={!!s}
                    keyboardType="decimal-pad"
                    onChangeText={v => set_qtyText(cur => ({...cur, [p.pieceId]: v}))}
                    onEndEditing={() => commitQty(p.pieceId)}
                  />
                  {s ? <Text style={styles.sourceLabel}>{SOURCE_LABEL[s.source]}</Text> : null}
                </View>
              </View>
            );
          })}
        </View>
      );
    });
  };

  const renderViewBody = () => {
    if (viewGroups.length === 0) {
      return <Text style={styles.emptyText}>No bales / pieces were selected for this batch.</Text>;
    }
    return viewGroups.map(g => (
      <View key={g.key} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, {marginLeft: 0}]}>
            {viewMultiLot ? `Lot ${g.rollNo} - ` : ''}Bale No: {g.baleNo}
          </Text>
          <Text style={styles.cardCount}>{g.picks.length} Pcs</Text>
        </View>
        <View style={styles.tableHead}>
          <Text style={[styles.th, styles.colPc]}>Piece No</Text>
          <Text style={[styles.th, styles.colNum]}>Checked Mtrs</Text>
          <Text style={[styles.th, styles.colNum]}>Selected Mtrs</Text>
          <Text style={[styles.th, styles.colNum]}>Selected By</Text>
          <Text style={[styles.th, styles.colBarcode]}>Barcode</Text>
        </View>
        {g.picks.map(p => (
          <View key={String(p.pieceId)} style={styles.tr}>
            <Text style={[styles.td, styles.colPc]}>{p.pcNo}</Text>
            <Text style={[styles.td, styles.colNum]}>{p.checkedMtrs}</Text>
            <Text style={[styles.td, styles.colNum]}>{round4(Number(p.allocatedMtrs) || 0)}</Text>
            <Text style={[styles.td, styles.colNum]}>
              {SOURCE_LABEL[p.selectionSource] || p.selectionSource || '-'}
            </Text>
            <Text style={[styles.td, styles.colBarcode]}>{p.scannedBarcode || '-'}</Text>
          </View>
        ))}
      </View>
    ));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {readOnly ? 'Bales / Pieces in this Batch' : `Select Bales / Pieces - Lot ${props.rollNo}`}
            </Text>
            <TouchableOpacity onPress={props.onCancel} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
          </View>

          {!readOnly ? (
            <View style={styles.scanWrap}>
              <View style={styles.scanRow}>
                <TextInput
                  ref={scanInputRef}
                  style={styles.scanInput}
                  placeholder="Scan for Bales or Pieces"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={scanText}
                  onChangeText={set_scanText}
                  onSubmitEditing={() => runScan(scanText)}
                  blurOnSubmit={false}
                  returnKeyType="done"
                />
                <TouchableOpacity style={styles.cameraBtn} onPress={() => set_cameraOpen(true)}>
                  <Image source={scanImg} style={styles.cameraIcon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.successText} numberOfLines={1}>
                {successText}
              </Text>
            </View>
          ) : null}

          <ScrollView
            ref={scrollRef}
            style={styles.body}
            contentContainerStyle={{paddingBottom: 8}}
            keyboardShouldPersistTaps="handled">
            {readOnly ? renderViewBody() : renderSelectBody()}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {readOnly
                ? `Total: ${viewSummary.count} pcs, ${viewSummary.total} mtrs`
                : `Selected: ${selectedSummary.count} pcs, ${selectedSummary.total} mtrs`}
            </Text>
            <View style={styles.footerBtns}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={props.onCancel}>
                <Text style={styles.btnCancelText}>{readOnly ? 'Close' : 'Cancel'}</Text>
              </TouchableOpacity>
              {!readOnly ? (
                <TouchableOpacity style={[styles.btn, styles.btnAdd]} onPress={onAddPress}>
                  <Text style={styles.btnAddText}>Add</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        {cameraOpen ? (
          <View style={StyleSheet.absoluteFill}>
            <QRScanner2 onRead={onCameraRead} />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BalePieceSelectionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: hp('90%'),
    minHeight: hp('50%'),
    backgroundColor: '#fff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  closeX: {
    fontSize: 18,
    color: '#555',
    paddingLeft: 12,
  },
  scanWrap: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#000',
    fontSize: 14,
  },
  cameraBtn: {
    marginLeft: 8,
    padding: 6,
  },
  cameraIcon: {
    width: 30,
    height: 30,
  },
  successText: {
    fontSize: 12,
    color: '#166534',
    minHeight: 18,
    marginTop: 4,
  },
  body: {
    paddingHorizontal: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 30,
    marginBottom: 30,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 8,
    marginTop: 10,
    overflow: 'hidden',
  },
  cardHighlight: {
    borderColor: '#22c55e',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f5f7fb',
  },
  cardTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  cardCount: {
    fontSize: 12,
    color: '#888',
  },
  tableHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  th: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    textAlign: 'center',
  },
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  trHighlight: {
    backgroundColor: '#dcfce7',
  },
  td: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  colCheck: {
    width: 30,
    alignItems: 'center',
  },
  colPc: {
    flex: 0.8,
  },
  colNum: {
    flex: 1,
  },
  colQty: {
    flex: 1.3,
    alignItems: 'center',
  },
  colBarcode: {
    flex: 1.6,
  },
  qtyInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#dedede',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  qtyInputDisabled: {
    backgroundColor: '#f0f0f0',
  },
  sourceLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#999',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#2979ff',
    borderColor: '#2979ff',
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  footerBtns: {
    flexDirection: 'row',
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnCancel: {
    backgroundColor: '#E7E7E9',
  },
  btnCancelText: {
    color: '#000',
    fontWeight: '700',
  },
  btnAdd: {
    backgroundColor: '#2979ff',
  },
  btnAddText: {
    color: '#fff',
    fontWeight: '700',
  },
});
