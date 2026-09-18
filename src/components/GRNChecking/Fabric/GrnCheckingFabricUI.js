import React, {useState, useCallback, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Constant from '../../../utils/constants/constant';
import CommonStyles from '../../../utils/commonStyles/commonStyles';
import HeaderComponent from '../../../utils/commonComponents/headerComponent';
import LoaderComponent from '../../../utils/commonComponents/loaderComponent';
import AlertComponent from '../../../utils/commonComponents/alertComponent';
import AiUploadButton from '../AiUpload/AiUploadButton';
import GrnAlertHost from '../common/GrnAlertHost';
import {ColorContext} from '../../colorTheme/colorTheme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabled) {
  UIManager.setLayoutAnimationEnabled(true);
}

// Smoothly animates every expand/collapse toggle on this page (Company/
// Vendor sections, Fabric/Lot sections, Add Bale/docs panels, audit
// history) -- call right before the state flip that mounts/unmounts the
// collapsed content, so the whole page reflows with an animation instead
// of an instant jump.
const animateNext = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

const fmt = v => (v === null || v === undefined || v === '' ? '-' : String(v));

// Quantity/measurement display formatting: round to 2 decimals, then drop
// the hundredths digit if it's 0 (12.40 -> 12.4), and drop the tenths digit
// too if that's also 0 (12.00 -> 12). Only for read-only number display --
// never applied to an editable TextInput's own value (that would fight the
// user mid-type).
const fmtNum = v => {
  if (v === null || v === undefined || v === '') return '-';
  const num = Number(v);
  if (isNaN(num)) return '-';
  const [intPart, decPart] = (Math.round(num * 100) / 100).toFixed(2).split('.');
  if (decPart[1] !== '0') return `${intPart}.${decPart}`;
  if (decPart[0] !== '0') return `${intPart}.${decPart[0]}`;
  return intPart;
};

const STATUS_COLORS = {DRAFT: '#757575', SUBMITTED: '#F9A825', APPROVED: '#66BB6A'};
const statusColor = status => STATUS_COLORS[status] || STATUS_COLORS.DRAFT;

const searchImg = require('./../../../../assets/images/png/searchIcon.png');
const barcodeImg = require('./../../../../assets/images/png/barcode_download.png');

// ---- a minimal "choose one from a list" modal picker -- this codebase has
// no existing dropdown/select component for a data-driven option list, so
// this is a small local one shared by the lot picker and the move-to-lot
// destination picker. ----
const PickerModal = ({visible, title, options, labelKey, onSelect, onClose}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        <Text style={styles.modalTitle}>{title}</Text>
        <FlatList
          data={options}
          keyExtractor={(item, idx) => String(item.key ?? idx)}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.modalRow} onPress={() => onSelect(item)}>
              <Text style={styles.modalRowText}>{item[labelKey]}</Text>
              {item.sub ? <Text style={styles.modalRowSub}>{item.sub}</Text> : null}
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.modalEmpty}>Nothing available.</Text>}
        />
        <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
          <Text style={styles.modalCloseBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ---- Bale card: one bale, its pieces, and every DRAFT/SUBMITTED action ----
const BaleCard = ({
  lot,
  bale,
  siblingLots,
  selected,
  onUpdatePiece,
  onUpdateBaleField,
  onRemovePiece,
  onSaveDraft,
  onSubmit,
  onUnsubmit,
  onMoveToLot,
  onToggleSelect,
  uploadJob,
  downloadWorksheetPdf,
  downloadBalePiecesBarcode,
}) => {
  const [moveModalVisible, set_moveModalVisible] = useState(false);
  const isDraft = bale.status === 'DRAFT';
  const totalInMtrs = (bale.pieces || []).reduce((s, p) => s + (Number(p.totalInMtrs) || 0), 0);
  const checkedMtrs = (bale.pieces || []).reduce((s, p) => s + (Number(p.checkedMtrs) || 0), 0);
  const baleDiffOk = Math.abs(totalInMtrs - checkedMtrs) < 0.05;

  return (
    <View style={styles.baleCard}>
      <View style={styles.baleCardHeader}>
        <View style={styles.baleNoFieldRow}>
          <Text style={styles.baleNoLabel}>Bale No</Text>
          <TextInput
            style={[styles.baleNoInput, !isDraft && styles.inputDisabled]}
            editable={isDraft}
            value={bale.baleNo === null || bale.baleNo === undefined ? '' : String(bale.baleNo)}
            onChangeText={v => onUpdateBaleField('baleNo', v)}
          />
          <Text style={styles.baleNoPcs}>({fmt(bale.totalPcs)} Pcs)</Text>
        </View>
        <View style={styles.baleStatusRow}>
          <Text style={[styles.baleStatus, {color: statusColor(bale.status)}]}>{bale.status}</Text>
          {bale.status === 'APPROVED' ? (
            <TouchableOpacity onPress={() => downloadBalePiecesBarcode(bale.id)} style={styles.barcodeIconBtn}>
              <Image source={barcodeImg} style={styles.barcodeIcon} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.baleHeaderDivider} />

      <View style={styles.baleActionsRow}>
        <AiUploadButton
          label="AI Doc Upload (Bale)"
          job={uploadJob}
          extraFields={{baleId: bale.id}}
          style={styles.aiUploadSpacing}
          disabled={bale.status !== 'DRAFT'}
        />
        {bale.status === 'SUBMITTED' ? (
          <Pressable
            onPress={onUnsubmit}
            style={({pressed}) => [styles.revertBtn, pressed && styles.revertBtnPressed]}>
            <Text style={styles.revertBtnText}>Revert to Draft</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.pieceTable}>
        <View style={styles.pieceTableHeaderRow}>
          <Text style={[styles.pieceTableHeaderText, styles.pieceColPcNo]}>Pc</Text>
          <Text style={[styles.pieceTableHeaderText, styles.pieceColInput]}>{'Total\nIn Mtrs'}</Text>
          <Text style={[styles.pieceTableHeaderText, styles.pieceColInput]}>Checked Mtrs</Text>
          <Text style={[styles.pieceTableHeaderText, styles.pieceColDiff]} numberOfLines={1}>Diff</Text>
          <View style={styles.removePieceBtnPlaceholder} />
        </View>

        {(bale.pieces || []).map((piece, idx) => {
          const checkedEnabled = isDraft && Number(piece.totalInMtrs) > 0;
          const canRemove = isDraft && (bale.pieces || []).length > 1;
          const pieceDiff = (Number(piece.totalInMtrs) || 0) - (Number(piece.checkedMtrs) || 0);
          const diffOk = Math.abs(pieceDiff) < 0.05;
          return (
            <View key={piece.pcNo} style={[styles.pieceRow, idx % 2 === 1 && styles.pieceRowAlt]}>
              <Text style={[styles.pieceLabel, styles.pieceColPcNo]}>{piece.pcNo}</Text>
              <TextInput
                style={[styles.pieceInput, styles.pieceColInput, !isDraft && styles.inputDisabled]}
                editable={isDraft}
                keyboardType="numeric"
                placeholder="Total In Mtrs"
                placeholderTextColor="#999"
                value={piece.totalInMtrs === null || piece.totalInMtrs === undefined ? '' : String(piece.totalInMtrs)}
                onChangeText={v => onUpdatePiece(piece.pcNo, 'totalInMtrs', v === '' ? null : Number(v))}
              />
              <TextInput
                style={[styles.pieceInput, styles.pieceColInput, !checkedEnabled && styles.inputDisabled]}
                editable={checkedEnabled}
                keyboardType="numeric"
                placeholder="Checked Mtrs"
                placeholderTextColor="#999"
                value={piece.checkedMtrs === null || piece.checkedMtrs === undefined ? '' : String(piece.checkedMtrs)}
                onChangeText={v => onUpdatePiece(piece.pcNo, 'checkedMtrs', v === '' ? null : Number(v))}
              />
              <View style={styles.pieceColDiff}>
                <View style={[styles.diffChip, diffOk ? styles.diffChipOk : styles.diffChipBad]}>
                  <Text style={[styles.diffChipText, diffOk ? styles.diffChipTextOk : styles.diffChipTextBad]}>
                    {fmtNum(pieceDiff)}
                  </Text>
                </View>
              </View>
              {canRemove ? (
                <TouchableOpacity onPress={() => onRemovePiece(piece.pcNo)} style={styles.removePieceBtn}>
                  <Text style={styles.removePieceBtnText}>×</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.removePieceBtnPlaceholder} />
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.baleHeaderDivider} />

      <View style={styles.baleTotalsRow}>
        <View style={styles.baleTotalsCol}>
          <Text style={styles.baleTotalsLabel}>Total In Mtrs</Text>
          <Text style={styles.baleTotalsValue}>{fmtNum(totalInMtrs)}</Text>
        </View>
        <View style={styles.baleTotalsCol}>
          <Text style={styles.baleTotalsLabel}>Checked</Text>
          <Text style={styles.baleTotalsValue}>{fmtNum(checkedMtrs)}</Text>
        </View>
        <View style={[styles.baleTotalsCol, styles.baleTotalsColLast]}>
          <Text style={styles.baleTotalsLabel}>Difference</Text>
          <View style={[styles.diffChip, baleDiffOk ? styles.diffChipOk : styles.diffChipBad]}>
            <Text style={[styles.diffChipText, baleDiffOk ? styles.diffChipTextOk : styles.diffChipTextBad]}>
              {fmtNum(totalInMtrs - checkedMtrs)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.damageRow}>
        <Text style={styles.damageLabel}>Total Damage in Mtrs (manual):</Text>
        <TextInput
          style={[styles.pieceInput, styles.damageInput, !isDraft && styles.inputDisabled]}
          editable={isDraft}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#999"
          value={bale.damageMtrs === null || bale.damageMtrs === undefined ? '' : String(bale.damageMtrs)}
          onChangeText={v => onUpdateBaleField('damageMtrs', v === '' ? null : Number(v))}
        />
      </View>

      {bale.status === 'APPROVED' && bale.grnNo ? (
        <View style={styles.baleApprovedRow}>
          <Text style={styles.grnLink}>GRN No: {bale.grnNo}</Text>
        </View>
      ) : null}
      {bale.status === 'SUBMITTED' ? <Text style={styles.lockedHint}>Locked from editing</Text> : null}

      <View style={styles.moveAndSelectRow}>
        {bale.status !== 'APPROVED' ? (
          <TouchableOpacity
            style={styles.selectRow}
            onPress={() => onToggleSelect(!selected)}>
            <View style={[styles.checkbox, selected && styles.checkboxChecked]} />
            <Text style={styles.selectLabel}>Select for Approval</Text>
          </TouchableOpacity>
        ) : null}

        {isDraft && siblingLots.length > 0 ? (
          <Pressable
            onPress={() => set_moveModalVisible(true)}
            style={({pressed}) => [styles.revertBtn, pressed && styles.revertBtnPressed]}>
            <Text style={styles.revertBtnText}>Move to Lot</Text>
          </Pressable>
        ) : null}
      </View>

      <PickerModal
        visible={moveModalVisible}
        title="Move to Lot"
        options={siblingLots.map(l => ({key: l.id, label: `Lot ${l.rollNo}`, sub: l.lotDateDisplay}))}
        labelKey="label"
        onSelect={item => {
          set_moveModalVisible(false);
          onMoveToLot(item.key);
        }}
        onClose={() => set_moveModalVisible(false)}
      />
    </View>
  );
};

// ---- Lot section: one opened roll, its bales, AI upload, add-bale ----
const LotSection = ({
  lot,
  siblingLots,
  selectedBaleIds,
  onAddBaleManual,
  onUpdatePiece,
  onUpdateBaleField,
  onRemovePiece,
  onSaveBaleDraft,
  onSubmitBale,
  onUnsubmitBale,
  onMoveBaleToLot,
  onToggleSelectForApproval,
  lotUploadJob,
  baleUploadJob,
  downloadWorksheetPdf,
  downloadLotBalesBarcode,
  downloadBalePiecesBarcode,
  poNumber,
  vendorName,
}) => {
  const [expanded, set_expanded] = useState(false);
  const [addBaleOpen, set_addBaleOpen] = useState(false);
  const [newBaleNo, set_newBaleNo] = useState('');
  const [newTotalPcs, set_newTotalPcs] = useState('');
  const [docsOpen, set_docsOpen] = useState(false);
  const [baleSearchText, set_baleSearchText] = useState('');
  const [draftOnly, set_draftOnly] = useState(false);

  const filteredBales = (lot.bales || []).filter(bale => {
    const term = baleSearchText.trim().toUpperCase();
    if (!term) return true;
    return bale.baleNo?.toString().toUpperCase().includes(term);
  });

  return (
    <View style={styles.lotSection}>
      <View style={[styles.lotHeaderBlock, expanded && styles.lotHeaderBlockShadowed]}>
        <TouchableOpacity style={styles.caretRow} onPress={() => { animateNext(); set_expanded(e => !e); }}>
          <Text style={styles.caretIcon}>{expanded ? '▼' : '▶'}</Text>
          <Text style={styles.lotTitle}>Lot / Roll No: {lot.rollNo}</Text>
          <View style={styles.baleCountBadge}>
            <Text style={styles.baleCountBadgeText}>
              {filteredBales.length} {filteredBales.length === 1 ? 'bale' : 'bales'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.fabricFieldsGrid}>
          <View style={styles.fabricFieldsRow}>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Lot / Roll No</Text>
              <Text style={styles.fieldValue}>{fmt(lot.rollNo)}</Text>
            </View>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Lot Date</Text>
              <Text style={styles.fieldValue}>{fmt(lot.lotDateDisplay)}</Text>
            </View>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Total In Mtrs</Text>
              <Text style={styles.fieldValue}>{fmtNum(lot.receivedQty)}</Text>
            </View>
          </View>
          <View style={styles.fabricFieldsRow}>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Received Qty</Text>
              <Text style={styles.fieldValue}>{fmtNum(lot.receivedQty)}</Text>
            </View>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Checked Qty</Text>
              <Text style={styles.fieldValue}>{fmtNum(lot.checkedQty)}</Text>
            </View>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Damaged Qty</Text>
              <Text style={styles.fieldValue}>{fmtNum(lot.damagedQty)}</Text>
            </View>
          </View>
          <View style={styles.fabricFieldsRow}>
            <View style={[styles.fabricField, styles.balanceQtyField]}>
              <Text style={styles.fieldLabel}>Balance Qty</Text>
              <Text style={[styles.fieldValue, styles.balanceQtyValue]}>{fmtNum(lot.balanceQty)}</Text>
            </View>
          </View>
        </View>

        {expanded ? (
          <>
            <View style={styles.lotPrimaryActionRow}>
              <AiUploadButton
                label="AI Doc Upload (Lot)"
                job={lotUploadJob}
                extraFields={{lotId: lot.id, expectedPoNumber: poNumber, expectedVendorName: vendorName}}
              />
            </View>

            <View style={styles.lotSecondaryActionRow}>
              <TouchableOpacity style={styles.lotActionBtn} onPress={() => { animateNext(); set_addBaleOpen(o => !o); }}>
                <Text style={styles.buttonText} numberOfLines={1}>Add Bale</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.lotActionBtn} onPress={() => downloadWorksheetPdf(lot.id, 2, draftOnly)}>
                <Text style={styles.buttonText} numberOfLines={1}>Worksheet PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.draftOnlyRow} onPress={() => set_draftOnly(o => !o)}>
                <View style={[styles.checkbox, draftOnly && styles.checkboxChecked]} />
                <Text style={styles.draftOnlyLabel} numberOfLines={1}>Draft Only</Text>
              </TouchableOpacity>
              <View style={styles.lotSecondaryActionSpacer} />
              <TouchableOpacity onPress={() => downloadLotBalesBarcode(lot.id)} style={styles.barcodeIconBtn}>
                <Image source={barcodeImg} style={styles.barcodeIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.baleSearchRow}>
              <Image source={searchImg} style={styles.baleSearchIcon} />
              <TextInput
                style={styles.baleSearchInput}
                placeholder="Search Bale No"
                placeholderTextColor="#999"
                value={baleSearchText}
                onChangeText={set_baleSearchText}
              />
            </View>
          </>
        ) : null}
      </View>

      {expanded ? (
        <View>
          {addBaleOpen ? (
            <View style={styles.addBaleForm}>
              <TextInput
                style={styles.addBaleInput}
                placeholder="Bale No"
                placeholderTextColor="#999"
                value={newBaleNo}
                onChangeText={set_newBaleNo}
              />
              <TextInput
                style={styles.addBaleInput}
                placeholder="Total Pcs"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={newTotalPcs}
                onChangeText={set_newTotalPcs}
              />
              <TouchableOpacity
                style={styles.lotActionBtn}
                onPress={async () => {
                  const ok = await onAddBaleManual(lot, newBaleNo, newTotalPcs);
                  if (ok) {
                    set_newBaleNo('');
                    set_newTotalPcs('');
                    set_addBaleOpen(false);
                  }
                }}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.lotActionBtn} onPress={() => set_addBaleOpen(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {(lot.uploadHistory || []).length > 0 ? (
            <TouchableOpacity onPress={() => { animateNext(); set_docsOpen(o => !o); }}>
              <Text style={styles.docsToggle}>view uploaded docs ({lot.uploadHistory.length})</Text>
            </TouchableOpacity>
          ) : null}
          {docsOpen
            ? (lot.uploadHistory || []).map((d, i) => (
                <Text key={i} style={styles.docsRow}>
                  {d.fileName} -- {d.uploadedAtDisplay}
                </Text>
              ))
            : null}

          {filteredBales.length === 0 && baleSearchText.trim() ? (
            <Text style={styles.noBaleMatchText}>No bale matches "{baleSearchText}".</Text>
          ) : null}

          {filteredBales.map(bale => (
            <BaleCard
              key={bale.id}
              lot={lot}
              bale={bale}
              siblingLots={siblingLots}
              selected={selectedBaleIds.includes(bale.id)}
              onUpdatePiece={(pcNo, field, value) => onUpdatePiece(lot.id, bale.id, pcNo, field, value)}
              onUpdateBaleField={(field, value) => onUpdateBaleField(lot.id, bale.id, field, value)}
              onRemovePiece={pcNo => onRemovePiece(lot, bale, pcNo)}
              onSaveDraft={() => onSaveBaleDraft(bale)}
              onSubmit={() => onSubmitBale(lot, bale)}
              onUnsubmit={() => onUnsubmitBale(lot, bale)}
              onMoveToLot={newLotId => onMoveBaleToLot(bale, newLotId)}
              onToggleSelect={next => onToggleSelectForApproval(lot, bale, next)}
              uploadJob={baleUploadJob}
              downloadWorksheetPdf={downloadWorksheetPdf}
              downloadBalePiecesBarcode={downloadBalePiecesBarcode}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

// ---- Fabric section: one PO line item, its lot picker and lots ----
const FabricSection = ({
  lineItem,
  lots,
  availableRolls,
  selectedBaleIds,
  onFetchAvailableRolls,
  onOpenLot,
  ...lotHandlers
}) => {
  const [expanded, set_expanded] = useState(false);
  const [lotPickerVisible, set_lotPickerVisible] = useState(false);

  const lineItemLots = lots.filter(l => l.poLineitemId === lineItem.lineitemId);

  const totalCheckedQty = lineItemLots.reduce((s, l) => s + (Number(l.checkedQty) || 0), 0);
  const totalDamagedQty = lineItemLots.reduce((s, l) => s + (Number(l.damagedQty) || 0), 0);
  const totalBalanceQty = (Number(lineItem.totalReceivedQty) || 0) - totalCheckedQty - totalDamagedQty;

  const openLotPicker = () => {
    onFetchAvailableRolls(lineItem);
    set_lotPickerVisible(true);
  };

  return (
    <View style={styles.fabricSection}>
      <View style={styles.fabricHeaderCard}>
        <View style={styles.fabricHeaderTopRow}>
          <TouchableOpacity
            style={[styles.caretRow, {flex: 1}]}
            onPress={() => { animateNext(); set_expanded(e => !e); }}>
            <Text style={styles.caretIcon}>{expanded ? '▼' : '▶'}</Text>
            <Text style={styles.fabricTitle}>{lineItem.description}</Text>
          </TouchableOpacity>
          {lineItem.rollCount > 0 ? (
            <TouchableOpacity
              onPress={() => lotHandlers.downloadFabricLotsBarcode(lineItem.lineitemId)}
              style={styles.barcodeIconBtn}>
              <Image source={barcodeImg} style={styles.barcodeIcon} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.fabricFieldsGrid}>
          <View style={styles.fabricFieldsRow}>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Fabric No (Color)</Text>
              <Text style={styles.fieldValue}>{fmt(lineItem.description)}</Text>
            </View>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Fabric Code</Text>
              <Text style={styles.fieldValue}>{fmt(lineItem.fabricCode)}</Text>
            </View>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Lots</Text>
              <Text style={styles.fieldValue}>{fmt(lineItem.rollCount)}</Text>
            </View>
          </View>
          <View style={styles.fabricFieldsRow}>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>UOM</Text>
              <Text style={styles.fieldValue}>{fmt(lineItem.uom)}</Text>
            </View>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Total Order Qty</Text>
              <Text style={styles.fieldValue}>{fmtNum(lineItem.totalOrderQty)}</Text>
            </View>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Total Received Qty</Text>
              <Text style={styles.fieldValue}>{fmtNum(lineItem.totalReceivedQty)}</Text>
            </View>
          </View>
          <View style={styles.fabricFieldsRow}>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Total Checked Qty</Text>
              <Text style={styles.fieldValue}>{fmtNum(totalCheckedQty)}</Text>
            </View>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Total Damaged Qty</Text>
              <Text style={styles.fieldValue}>{fmtNum(totalDamagedQty)}</Text>
            </View>
            <View style={styles.fabricField}>
              <Text style={styles.fieldLabel}>Total Balance Qty</Text>
              <Text style={styles.fieldValue}>{fmtNum(totalBalanceQty)}</Text>
            </View>
          </View>
        </View>

        {expanded ? (
          <TouchableOpacity style={styles.lotActionBtn} onPress={openLotPicker}>
            <Text style={styles.buttonText}>Choose a lot / roll to check</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {expanded ? (
        <View>
          {lineItemLots.map(lot => (
            <LotSection
              key={lot.id}
              lot={lot}
              siblingLots={lineItemLots.filter(l => l.id !== lot.id)}
              selectedBaleIds={selectedBaleIds}
              onAddBaleManual={lotHandlers.addBaleManual}
              onUpdatePiece={lotHandlers.updatePieceField}
              onUpdateBaleField={lotHandlers.updateBaleField}
              onRemovePiece={lotHandlers.removePiece}
              onSaveBaleDraft={lotHandlers.saveBaleDraft}
              onSubmitBale={lotHandlers.submitBale}
              onUnsubmitBale={lotHandlers.unsubmitBale}
              onMoveBaleToLot={lotHandlers.moveBaleToLot}
              onToggleSelectForApproval={lotHandlers.toggleSelectForApproval}
              lotUploadJob={lotHandlers.lotUploadJob}
              baleUploadJob={lotHandlers.baleUploadJob}
              downloadWorksheetPdf={lotHandlers.downloadWorksheetPdf}
              downloadLotBalesBarcode={lotHandlers.downloadLotBalesBarcode}
              downloadBalePiecesBarcode={lotHandlers.downloadBalePiecesBarcode}
              poNumber={lotHandlers.poNumber}
              vendorName={lotHandlers.vendorName}
            />
          ))}
        </View>
      ) : null}

      <PickerModal
        visible={lotPickerVisible}
        title="Choose a lot / roll to check"
        options={(availableRolls || []).map((r, idx) => {
          const rollNo = r?.rollNo ?? r?.roll_no ?? r?.rollNumber;
          const receivedQty = r?.receivedQty ?? r?.received_qty;
          return {
            key: rollNo ?? idx,
            label:
              rollNo !== undefined
                ? `${rollNo} (Recv: ${receivedQty ?? '-'})`
                // Fallback while we confirm the real field names -- see
                // GRNCHK_DEBUG log in adb logcat for the actual shape.
                : JSON.stringify(r),
          };
        })}
        labelKey="label"
        onSelect={item => {
          set_lotPickerVisible(false);
          onOpenLot(lineItem, item.key);
        }}
        onClose={() => set_lotPickerVisible(false)}
      />
    </View>
  );
};

const GrnCheckingFabricUI = props => {
  const {colors} = useContext(ColorContext);
  const [remarks, set_remarks] = useState(props.header?.remarks || '');
  const [checkingDate, set_checkingDate] = useState(props.header?.checkingDate || '');
  const [isDatePickerVisible, set_isDatePickerVisible] = useState(false);
  const [refreshing, set_refreshing] = useState(false);
  const [vendorOpen, set_vendorOpen] = useState(true);
  const [poDetailsOpen, set_poDetailsOpen] = useState(true);

  React.useEffect(() => {
    if (props.header) {
      set_remarks(props.header.remarks || '');
      set_checkingDate(props.header.checkingDate || '');
    }
  }, [props.header]);

  const onRefresh = useCallback(async () => {
    set_refreshing(true);
    await props.onRefresh();
    set_refreshing(false);
  }, [props.onRefresh]);

  const lotHandlers = {
    addBaleManual: props.addBaleManual,
    updatePieceField: props.updatePieceField,
    updateBaleField: props.updateBaleField,
    removePiece: props.removePiece,
    saveBaleDraft: props.saveBaleDraft,
    submitBale: props.submitBale,
    unsubmitBale: props.unsubmitBale,
    moveBaleToLot: props.moveBaleToLot,
    toggleSelectForApproval: props.toggleSelectForApproval,
    lotUploadJob: props.lotUploadJob,
    baleUploadJob: props.baleUploadJob,
    downloadWorksheetPdf: props.downloadWorksheetPdf,
    downloadFabricLotsBarcode: props.downloadFabricLotsBarcode,
    downloadLotBalesBarcode: props.downloadLotBalesBarcode,
    downloadBalePiecesBarcode: props.downloadBalePiecesBarcode,
    poNumber: props.header?.poNumber,
    vendorName: props.vendorDetails?.vendorName,
  };

  return (
    <View style={CommonStyles.mainComponentViewStyle}>
      <GrnAlertHost />
      <View style={CommonStyles.headerView}>
        <HeaderComponent
          isBackBtnEnable={true}
          isSettingsEnable={false}
          isChatEnable={false}
          isTImerEnable={false}
          isTitleHeaderEnable={true}
          title={`GRN Checking - ${props.header?.itemType === 'RM' ? 'RM' : 'Fabric'}`}
          backBtnAction={props.backBtnAction}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={[styles.sectionHeaderBar, {backgroundColor: colors.color2}]} onPress={() => { animateNext(); set_vendorOpen(o => !o); }}>
            <Text style={styles.sectionHeaderText}>Vendor Details</Text>
            <Text style={styles.sectionCaret}>{vendorOpen ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          {vendorOpen ? (
            <View style={styles.sectionBody}>
              <Text style={styles.entityName}>{fmt(props.vendorDetails?.vendorName)}</Text>
              <Text style={styles.entitySub}>{fmt(props.vendorDetails?.vendorAddress)}</Text>
              <Text style={styles.entitySub}>{fmt(props.vendorDetails?.vendorMobile)}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.sectionContainer}>
          <TouchableOpacity style={[styles.sectionHeaderBar, {backgroundColor: colors.color2}]} onPress={() => { animateNext(); set_poDetailsOpen(o => !o); }}>
            <Text style={styles.sectionHeaderText}>PO Details</Text>
            <Text style={styles.sectionCaret}>{poDetailsOpen ? '▼' : '▶'}</Text>
          </TouchableOpacity>
          {poDetailsOpen ? (
            <View style={styles.sectionBody}>
              <Text style={styles.fieldLabel}>PO No</Text>
              <Text style={styles.fieldValue}>{fmt(props.header?.poNumberWithSymbol)}</Text>

              <Text style={styles.fieldLabel}>Checking Date</Text>
              <TouchableOpacity onPress={() => set_isDatePickerVisible(true)} style={styles.dateFieldBox}>
                <Text style={styles.dateFieldText}>{fmt(checkingDate)}</Text>
                <Image
                  source={require('./../../../../assets/images/png/calendar11.png')}
                  style={styles.dateFieldIcon}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={date => {
                  const iso = date.toISOString().slice(0, 10);
                  set_checkingDate(iso);
                  set_isDatePickerVisible(false);
                  props.saveHeaderMeta(remarks, iso);
                }}
                onCancel={() => set_isDatePickerVisible(false)}
              />

              <Text style={styles.fieldLabel}>Remarks</Text>
              <TextInput
                style={styles.remarksInput}
                multiline
                value={remarks}
                onChangeText={set_remarks}
                onBlur={() => props.saveHeaderMeta(remarks, checkingDate)}
              />

              <Text style={styles.fieldLabel}>GRN No</Text>
              <View style={styles.grnNoRow}>
                {(props.grnNumbers || []).length === 0 ? (
                  <Text style={styles.fieldValue}>-</Text>
                ) : (
                  props.grnNumbers.map(grnNo => (
                    <TouchableOpacity key={grnNo} onPress={() => props.downloadGrnPdf(grnNo)}>
                      <Text style={styles.grnLinkText}>{grnNo}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          ) : null}
        </View>

        {(props.fabricLineItems || []).map(li => (
          <FabricSection
            key={li.lineitemId}
            lineItem={li}
            lots={props.lots}
            availableRolls={props.availableRollsByLineItem?.[li.lineitemId]}
            selectedBaleIds={props.selectedBaleIds}
            onFetchAvailableRolls={props.fetchAvailableRolls}
            onOpenLot={props.openLot}
            {...lotHandlers}
          />
        ))}

        <View style={{height: 90}} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn} onPress={props.backBtnAction}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={props.saveAllDrafts}>
          <Text style={styles.buttonText}>Save as Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={props.submitAllDraftBales}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomBtn, styles.approveBtn, props.selectedBaleIds.length === 0 && styles.inputDisabled]}
          disabled={props.selectedBaleIds.length === 0}
          onPress={props.approveSelectedBales}>
          <Text style={styles.buttonText}>Approve ({props.selectedBaleIds.length})</Text>
        </TouchableOpacity>
      </View>

      {props.isPopUp ? (
        <View style={CommonStyles.customPopUpStyle}>
          <AlertComponent
            header={props.popUpAlert}
            message={props.popUpMessage}
            isLeftBtnEnable={props.isPopupLeft}
            isRightBtnEnable={true}
            leftBtnTilte={'NO'}
            rightBtnTilte={props.popUpRBtnTitle}
            popUpRightBtnAction={props.popOkBtnAction}
            popUpLeftBtnAction={() => {}}
          />
        </View>
      ) : null}

      {props.MainLoading === true ? (
        <LoaderComponent isLoader={true} loaderText={Constant.LOADER_MESSAGE} isButtonEnable={false} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // width: '100%' is required, not decorative -- CommonStyles.mainComponentViewStyle
  // (this screen's outer wrapper, shared app-wide) sets alignItems: 'center',
  // so without an explicit width this ScrollView shrink-wraps to its own
  // content's intrinsic width and gets centered instead of stretching full
  // screen width. That intrinsic width varies with how much text a given
  // record actually has (vendor name length, digit counts, etc.), which is
  // exactly why some PO records rendered visibly narrower than others.
  scroll: {flex: 1, width: '100%', paddingHorizontal: 6},
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    elevation: 2,
  },
  sectionHeaderBar: {
    backgroundColor: '#2979ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCaret: {
    color: '#fff',
    fontSize: 11,
  },
  sectionBody: {
    padding: 12,
  },
  entityName: {fontSize: 16, fontWeight: '700', color: '#000', textTransform: 'uppercase'},
  entitySub: {fontSize: 12, color: '#666'},
  fieldLabel: {fontSize: 11, color: '#888', marginTop: 8},
  fieldValue: {fontSize: 14, color: '#000'},
  dateFieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  dateFieldText: {fontSize: 14, color: '#000'},
  dateFieldIcon: {width: 20, height: 20, resizeMode: 'contain'},
  remarksInput: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    padding: 8,
    minHeight: 50,
    textAlignVertical: 'top',
    color: '#000',
  },
  grnNoRow: {flexDirection: 'row', flexWrap: 'wrap'},
  grnLinkText: {color: '#2979ff', marginRight: 10, textDecorationLine: 'underline'},

  fabricSection: {
    marginTop: 10,
  },
  fabricHeaderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    // Box shadow covering the caret/title, the fields grid, and (when
    // expanded) the "Choose a lot / roll to check" button -- so this whole
    // block reads as one raised header for the fabric section, distinct
    // from the plain Lot sections that follow below it.
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  caretRow: {flexDirection: 'row', alignItems: 'center'},
  caretIcon: {fontSize: 12, marginRight: 8, color: '#555'},
  fabricTitle: {fontSize: 14, fontWeight: '700', flex: 1},
  fabricHeaderTopRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  barcodeIconBtn: {marginLeft: 8, padding: 2},
  barcodeIcon: {width: 20, height: 20, resizeMode: 'contain', tintColor: '#2979ff'},
  fabricFieldsGrid: {marginTop: 8},
  fabricFieldsRow: {flexDirection: 'row', marginBottom: 8},
  fabricField: {flex: 1, paddingRight: 8},

  lotSection: {
    backgroundColor: '#F7F9FC',
    borderRadius: 6,
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#2979ff',
  },
  lotTitle: {fontSize: 13, fontWeight: '700', flex: 1, color: '#000'},
  // Roll details -- Lot/Roll No through Search Bale No -- as its own
  // nested container with a subtle tint distinct from both the outer
  // lotSection (light gray-blue) and the plain white bale cards below.
  lotHeaderBlock: {
    backgroundColor: '#EEF3FB',
    borderRadius: 6,
    padding: 10,
  },
  lotHeaderBlockShadowed: {
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  baleCountBadge: {
    backgroundColor: 'rgba(41,121,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  baleCountBadgeText: {color: '#2979ff', fontSize: 10, fontWeight: '700'},
  lotPrimaryActionRow: {marginTop: 8},
  lotSecondaryActionRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 8,
    marginBottom: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E4EA',
    borderStyle: 'dashed',
  },
  lotSecondaryActionSpacer: {flex: 1},
  lotActionBtn: {
    backgroundColor: '#455a64',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  addBaleForm: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 8},
  addBaleInput: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 90,
    color: '#000',
  },
  docsToggle: {color: '#2979ff', fontSize: 12, marginTop: 4},
  docsRow: {fontSize: 11, color: '#666', marginTop: 2},
  baleSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  baleSearchIcon: {width: 13, height: 13, tintColor: '#999', marginRight: 6},
  baleSearchInput: {
    flex: 1,
    paddingVertical: 6,
    color: '#000',
    fontSize: 12,
  },
  noBaleMatchText: {fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 4, marginBottom: 4},
  balanceQtyField: {
    backgroundColor: 'rgba(41,121,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 0,
    alignSelf: 'flex-start',
  },
  balanceQtyValue: {color: '#2979ff', fontSize: 15},

  baleCard: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  baleCardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  baleHeaderDivider: {
    borderTopWidth: 1,
    borderTopColor: '#E0E4EA',
    borderStyle: 'dashed',
    marginTop: 8,
    paddingTop: 0,
  },
  baleNoFieldRow: {flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8},
  baleNoLabel: {fontSize: 13, fontWeight: '700', color: '#000', marginRight: 6},
  baleNoInput: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
    color: '#000',
    minWidth: 80,
    marginRight: 6,
  },
  baleNoPcs: {fontSize: 12, color: '#555'},
  baleStatusRow: {flexDirection: 'row', alignItems: 'center'},
  baleStatus: {fontSize: 11, color: '#2979ff', fontWeight: '600'},
  // Piece qtys table -- a real bordered/rounded table frame (not loose
  // rows), tinted header band, zebra-striped rows, tabular numerals, and a
  // color-coded Difference chip instead of plain text.
  pieceTable: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pieceTableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(41,121,255,0.08)',
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  pieceTableHeaderText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2979ff',
    marginRight: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  pieceColPcNo: {width: 26, textAlign: 'center', marginRight: 6},
  pieceColInput: {flex: 1},
  pieceColDiff: {width: 64, alignItems: 'flex-end', textAlign: 'right', marginRight: 10, flexShrink: 0},
  pieceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  pieceRowAlt: {backgroundColor: '#F7F9FC'},
  pieceLabel: {fontSize: 12, fontWeight: '700', color: '#6b7280', fontVariant: ['tabular-nums']},
  pieceInput: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 6,
    fontSize: 12,
    color: '#000',
    fontVariant: ['tabular-nums'],
  },
  inputDisabled: {backgroundColor: '#F0F0F0', color: '#999'},
  diffChip: {
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  diffChipOk: {backgroundColor: 'rgba(46,125,50,0.08)'},
  diffChipBad: {backgroundColor: 'rgba(198,40,40,0.08)'},
  diffChipText: {fontSize: 11, fontWeight: '700', fontVariant: ['tabular-nums']},
  diffChipTextOk: {color: '#2e7d32'},
  diffChipTextBad: {color: '#c62828'},
  removePieceBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePieceBtnPlaceholder: {width: 20, height: 20},
  removePieceBtnText: {color: '#6b7280', fontWeight: '700', fontSize: 12},
  // Bale-level totals summary -- same table language as the piece table
  // above it (bordered frame, tinted look, colored Difference chip).
  baleTotalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: 'rgba(41,121,255,0.05)',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  baleTotalsCol: {alignItems: 'flex-start'},
  baleTotalsColLast: {alignItems: 'flex-end'},
  baleTotalsLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  baleTotalsValue: {fontSize: 14, fontWeight: '700', color: '#000', fontVariant: ['tabular-nums']},
  damageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 8,
    marginBottom: 12,
  },
  damageLabel: {fontSize: 11, color: '#888', flexShrink: 1, marginRight: 8},
  damageInput: {minWidth: 90, marginRight: 0},
  baleTotalsText: {fontSize: 11, color: '#333', marginRight: 12},
  grnLink: {color: '#2979ff', fontSize: 12, marginTop: 6},
  baleApprovedRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6},
  lockedHint: {color: '#999', fontStyle: 'italic', fontSize: 11, marginTop: 6},
  baleActionsRow: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8},
  baleActionBtn: {
    backgroundColor: '#2979ff',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revertBtn: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FB8C00',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revertBtnPressed: {
    backgroundColor: '#FB8C00',
  },
  revertBtnText: {color: '#000', fontSize: 12, fontWeight: '600', textAlign: 'center'},
  buttonText: {color: '#fff', fontSize: 12, fontWeight: '600', textAlign: 'center'},
  aiUploadSpacing: {marginRight: 8, marginBottom: 8},
  moveAndSelectRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4},
  selectRow: {flexDirection: 'row', alignItems: 'center'},
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#2979ff',
    marginRight: 8,
  },
  checkboxChecked: {backgroundColor: '#2979ff'},
  selectLabel: {fontSize: 12, color: '#333'},
  draftOnlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  draftOnlyLabel: {fontSize: 11, color: '#333'},

  bottomBar: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  bottomBtn: {
    flex: 1,
    backgroundColor: '#455a64',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  approveBtn: {backgroundColor: '#2e7d32'},

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
  },
  modalTitle: {fontSize: 15, fontWeight: '700', marginBottom: 8, color: '#000'},
  modalRow: {paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE'},
  modalRowText: {fontSize: 14, color: '#000'},
  modalRowSub: {fontSize: 11, color: '#888'},
  modalEmpty: {fontSize: 12, color: '#888', paddingVertical: 20, textAlign: 'center'},
  modalCloseBtn: {marginTop: 10, alignSelf: 'flex-end'},
  modalCloseBtnText: {color: '#2979ff', fontWeight: '600'},
});

export default GrnCheckingFabricUI;
