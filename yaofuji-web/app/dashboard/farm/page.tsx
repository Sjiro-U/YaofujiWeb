'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import {
    FarmData,
    Plot,
    Crop,
    CropStatus,
    Direction,
    AVAILABLE_CROPS,
    STATUS_LABELS,
    STATUS_COLORS,
    DIRECTION_LABELS,
    loadFarmData,
    saveFarmData,
    loadFieldYuFarmData,
    saveFieldYuFarmData,
    loadCustomCrops,
    saveCustomCrops,
    getAllCrops,
    daysSince,
} from '@/lib/farmData';
import { ArrowLeft, X, Check, Droplets, Calendar, Compass, Plus, Merge, RotateCcw } from 'lucide-react';
import styles from './page.module.css';

type FarmType = 'sfc' | 'fieldYu';

export default function FarmPage() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const [activeFarm, setActiveFarm] = useState<FarmType>('sfc');
    const [sfcFarmData, setSfcFarmData] = useState<FarmData | null>(null);
    const [fieldYuData, setFieldYuData] = useState<FarmData | null>(null);
    const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editCrop, setEditCrop] = useState<string>('');
    const [editStatus, setEditStatus] = useState<CropStatus>('empty');
    const [editVariety, setEditVariety] = useState<string>('');
    const [allCrops, setAllCrops] = useState<Crop[]>([]);
    const [showAddCrop, setShowAddCrop] = useState(false);
    const [newCropName, setNewCropName] = useState('');
    const [newCropColor, setNewCropColor] = useState('#4CAF50');
    // マージモード
    const [isMergeMode, setIsMergeMode] = useState(false);
    const [mergeSelection, setMergeSelection] = useState<Set<string>>(new Set());
    // リセットモード
    const [isResetMode, setIsResetMode] = useState(false);
    const [resetSelection, setResetSelection] = useState<Set<string>>(new Set());

    const farmData = activeFarm === 'sfc' ? sfcFarmData : fieldYuData;
    const setFarmData = activeFarm === 'sfc' ? setSfcFarmData : setFieldYuData;

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        setSfcFarmData(loadFarmData());
        setFieldYuData(loadFieldYuFarmData());
        setAllCrops(getAllCrops());
    }, [isLoggedIn, router]);

    if (!isLoggedIn || !farmData) {
        return null;
    }

    const handlePlotClick = (plot: Plot) => {
        setSelectedPlot(plot);
        setEditCrop(plot.crop?.id || '');
        setEditStatus(plot.status);
        setEditVariety(plot.crop?.variety || '');
        setIsEditing(false);
    };

    const handleSave = () => {
        if (!selectedPlot || !farmData) return;

        const baseCrop = allCrops.find((c) => c.id === editCrop) || null;
        const crop = baseCrop ? { ...baseCrop, variety: editVariety || undefined } : null;

        // マージ親の場合、子区画のIDリストを取得
        const mergedChildIds = selectedPlot.isMergeStart
            ? farmData.plots.filter(p => p.mergedWith === selectedPlot.id).map(p => p.id)
            : [];

        const updatedPlots = farmData.plots.map((p) => {
            // 選択された区画（親区画）を更新
            if (p.id === selectedPlot.id) {
                return {
                    ...p,
                    crop,
                    status: editStatus,
                    plantedDate: crop && !p.plantedDate ? new Date().toISOString().split('T')[0] : p.plantedDate,
                };
            }
            // マージグループの子区画も同じステータスに更新
            if (mergedChildIds.includes(p.id)) {
                return {
                    ...p,
                    status: editStatus,
                };
            }
            return p;
        });

        const newData = { ...farmData, plots: updatedPlots };
        setFarmData(newData);
        // アクティブな農地に応じて保存関数を呼び分け
        if (activeFarm === 'sfc') {
            saveFarmData(newData);
        } else {
            saveFieldYuFarmData(newData);
        }
        setSelectedPlot(updatedPlots.find((p) => p.id === selectedPlot.id) || null);
        setIsEditing(false);
    };

    // 方角変更
    const handleDirectionChange = (direction: Direction) => {
        if (!farmData) return;
        const newData = { ...farmData, direction };
        setFarmData(newData);
        if (activeFarm === 'sfc') {
            saveFarmData(newData);
        } else {
            saveFieldYuFarmData(newData);
        }
    };

    // カスタム作物追加
    const handleAddCrop = () => {
        if (!newCropName.trim()) return;
        const customCrops = loadCustomCrops();
        const newCrop: Crop = {
            id: `custom_${Date.now()}`,
            name: newCropName.trim(),
            color: newCropColor,
            isCustom: true,
        };
        const updatedCrops = [...customCrops, newCrop];
        saveCustomCrops(updatedCrops);
        setAllCrops(getAllCrops());
        setNewCropName('');
        setShowAddCrop(false);
    };

    // カスタム作物削除
    const handleDeleteCrop = (cropId: string) => {
        if (!confirm('この作物を削除しますか？')) return;
        const customCrops = loadCustomCrops();
        const updatedCrops = customCrops.filter(c => c.id !== cropId);
        saveCustomCrops(updatedCrops);
        setAllCrops(getAllCrops());
        // 削除した作物が選択中ならクリア
        if (editCrop === cropId) {
            setEditCrop('');
        }
    };

    // マージモードでの区画選択トグル
    const toggleMergeSelection = (plotId: string) => {
        const newSelection = new Set(mergeSelection);
        if (newSelection.has(plotId)) {
            newSelection.delete(plotId);
        } else {
            newSelection.add(plotId);
        }
        setMergeSelection(newSelection);
    };

    // リセットモードでの区画選択トグル
    const toggleResetSelection = (plotId: string) => {
        const newSelection = new Set(resetSelection);
        if (newSelection.has(plotId)) {
            newSelection.delete(plotId);
        } else {
            newSelection.add(plotId);
        }
        setResetSelection(newSelection);
    };

    // 選択された区画をリセット（初期状態に戻す）
    const applyReset = () => {
        if (!farmData || resetSelection.size < 1) return;

        const selectedIds = Array.from(resetSelection);

        const updatedPlots = farmData.plots.map(p => {
            if (selectedIds.includes(p.id)) {
                return {
                    ...p,
                    crop: null,
                    status: 'empty' as const,
                    plantedDate: undefined,
                    isMergeStart: false,
                    mergeCount: undefined,
                    mergedWith: undefined,
                };
            }
            // マージ親がリセットされた場合、子もマージ解除
            if (p.mergedWith && selectedIds.includes(p.mergedWith)) {
                return {
                    ...p,
                    mergedWith: undefined,
                };
            }
            return p;
        });

        const newData = { ...farmData, plots: updatedPlots };
        setFarmData(newData);
        if (activeFarm === 'sfc') {
            saveFarmData(newData);
        } else {
            saveFieldYuFarmData(newData);
        }
        setResetSelection(new Set());
        setIsResetMode(false);
    };

    // 選択された区画をマージ（隣接区画の境界をなくす）
    const applyMerge = () => {
        if (!farmData || mergeSelection.size < 2) return;

        // 選択された区画のIDリスト
        const selectedIds = Array.from(mergeSelection);

        // 選択された区画をソート
        const sortedPlots = selectedIds
            .map(id => farmData.plots.find(p => p.id === id))
            .filter((p): p is Plot => p !== undefined)
            .sort((a, b) => {
                if (a.col !== b.col) return a.col - b.col;
                return a.row - b.row;
            });

        if (sortedPlots.length < 2) return;

        // BFSで連結している区画のみを抽出
        const selectedSet = new Set(selectedIds);
        const startPlot = sortedPlots[0];
        const visited = new Set<string>();
        const queue: Plot[] = [startPlot];
        const connectedPlots: Plot[] = [];

        while (queue.length > 0) {
            const current = queue.shift()!;
            if (visited.has(current.id)) continue;
            visited.add(current.id);
            connectedPlots.push(current);

            // 上下左右の隣接マスをチェック
            const neighbors = [
                farmData.plots.find(p => p.row === current.row - 1 && p.col === current.col),
                farmData.plots.find(p => p.row === current.row + 1 && p.col === current.col),
                farmData.plots.find(p => p.row === current.row && p.col === current.col - 1),
                farmData.plots.find(p => p.row === current.row && p.col === current.col + 1),
            ];

            for (const neighbor of neighbors) {
                if (neighbor && selectedSet.has(neighbor.id) && !visited.has(neighbor.id)) {
                    queue.push(neighbor);
                }
            }
        }

        // 連結している区画が2つ未満ならマージしない
        if (connectedPlots.length < 2) {
            alert('隣り合う区画を2つ以上選択してください');
            return;
        }

        const startPlotId = connectedPlots[0].id;
        const connectedIds = connectedPlots.map(p => p.id);

        // マージ時にすべての区画のステータスを「空き」に統一し、作物情報もクリア
        const updatedPlots = farmData.plots.map(p => {
            if (p.id === startPlotId) {
                return {
                    ...p,
                    isMergeStart: true,
                    mergeCount: connectedPlots.length,
                    status: 'empty' as const,
                    crop: null,
                    plantedDate: undefined,
                };
            }
            if (connectedIds.includes(p.id) && p.id !== startPlotId) {
                return {
                    ...p,
                    mergedWith: startPlotId,
                    status: 'empty' as const,
                    crop: null,
                    plantedDate: undefined,
                };
            }
            return p;
        });

        const newData = { ...farmData, plots: updatedPlots };
        setFarmData(newData);
        if (activeFarm === 'sfc') {
            saveFarmData(newData);
        } else {
            saveFieldYuFarmData(newData);
        }
        setMergeSelection(new Set());
        setIsMergeMode(false);
    };

    // マージ解除
    const handleUnmergePlots = (plotId: string) => {
        if (!farmData) return;

        const updatedPlots = farmData.plots.map(p => {
            if (p.id === plotId) {
                return { ...p, isMergeStart: false, mergeCount: undefined };
            }
            if (p.mergedWith === plotId) {
                return { ...p, mergedWith: undefined };
            }
            return p;
        });

        const newData = { ...farmData, plots: updatedPlots };
        setFarmData(newData);
        if (activeFarm === 'sfc') {
            saveFarmData(newData);
        } else {
            saveFieldYuFarmData(newData);
        }
        setSelectedPlot(updatedPlots.find(p => p.id === plotId) || null);
    };

    // 隣接チェック（境界線を消すかどうかの判定用）
    const isAdjacentMerged = (plot: Plot, direction: 'top' | 'bottom' | 'left' | 'right'): boolean => {
        if (!farmData) return false;

        let adjRow = plot.row;
        let adjCol = plot.col;
        if (direction === 'top') adjRow--;
        if (direction === 'bottom') adjRow++;
        if (direction === 'left') adjCol--;
        if (direction === 'right') adjCol++;
        const adjPlot = farmData.plots.find(p => p.row === adjRow && p.col === adjCol);
        if (!adjPlot) return false;

        // 既存のマージ済み区画の判定（マージモードに関係なく適用）
        const isMerged = plot.isMergeStart || plot.mergedWith;
        if (isMerged) {
            const mergeGroupId = plot.isMergeStart ? plot.id : plot.mergedWith;
            const adjMergeGroupId = adjPlot.isMergeStart ? adjPlot.id : adjPlot.mergedWith;
            if (mergeGroupId === adjMergeGroupId) {
                return true;
            }
        }

        // マージモード中の新規選択の判定
        if (isMergeMode) {
            if (mergeSelection.has(plot.id) && mergeSelection.has(adjPlot.id)) {
                return true;
            }
        }

        return false;
    };

    const getLastWatering = (plotId: string): string | null => {
        const wateringLogs = farmData.logs
            .filter((log) => log.plotId === plotId && log.type === 'watering')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return wateringLogs[0]?.date || null;
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* ヘッダー */}
                <div className={styles.header}>
                    <Link href="/dashboard" className={styles.backLink}>
                        <ArrowLeft size={18} />
                        ダッシュボードへ
                    </Link>
                    <h1>農地管理</h1>
                    <div className={styles.farmTabs}>
                        <button
                            className={`${styles.farmTab} ${activeFarm === 'sfc' ? styles.activeTab : ''}`}
                            onClick={() => { setActiveFarm('sfc'); setSelectedPlot(null); }}
                        >
                            SFC近隣農地
                        </button>
                        <button
                            className={`${styles.farmTab} ${activeFarm === 'fieldYu' ? styles.activeTab : ''}`}
                            onClick={() => { setActiveFarm('fieldYu'); setSelectedPlot(null); }}
                        >
                            フィールドゆう
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* 農地マップ */}
                    <div className={styles.mapSection}>
                        <div className={styles.mapHeader}>
                            <span>{isMergeMode ? 'マージする区画をクリックして選択' : isResetMode ? 'リセットする区画をクリックして選択' : 'クリックして区画を選択'}</span>
                            <div className={styles.compassSelector}>
                                <div
                                    className={styles.compassRose}
                                    style={{
                                        transform: `rotate(${farmData.direction === 'north' ? 0 :
                                            farmData.direction === 'east' ? 90 :
                                                farmData.direction === 'south' ? 180 :
                                                    farmData.direction === 'west' ? -90 : 0
                                            }deg)`
                                    }}
                                >
                                    <div className={styles.compassNeedle} />
                                    <span className={styles.compassN}>N</span>
                                </div>
                                <select
                                    value={farmData.direction || 'north'}
                                    onChange={(e) => handleDirectionChange(e.target.value as Direction)}
                                    className={styles.directionSelect}
                                >
                                    {Object.entries(DIRECTION_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}向き</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.mergeControls}>
                                {!isMergeMode && !isResetMode ? (
                                    <>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => { setIsMergeMode(true); setMergeSelection(new Set()); }}
                                        >
                                            <Merge size={16} />
                                            マージ
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => { setIsResetMode(true); setResetSelection(new Set()); }}
                                        >
                                            <RotateCcw size={16} />
                                            リセット
                                        </button>
                                    </>
                                ) : isMergeMode ? (
                                    <>
                                        <button
                                            className="btn btn-accent"
                                            onClick={applyMerge}
                                            disabled={mergeSelection.size < 2}
                                        >
                                            マージ実行 ({mergeSelection.size}個選択)
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => { setIsMergeMode(false); setMergeSelection(new Set()); }}
                                        >
                                            キャンセル
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-accent"
                                            onClick={applyReset}
                                            disabled={resetSelection.size < 1}
                                        >
                                            リセット実行 ({resetSelection.size}個選択)
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => { setIsResetMode(false); setResetSelection(new Set()); }}
                                        >
                                            キャンセル
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className={styles.legend}>
                                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                    <div key={key} className={styles.legendItem}>
                                        <span
                                            className={styles.legendDot}
                                            style={{ background: STATUS_COLORS[key as CropStatus] }}
                                        />
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div
                            className={styles.farmGrid}
                            style={{
                                gridTemplateColumns: `repeat(${farmData.cols}, 1fr)`,
                                gridTemplateRows: `repeat(${farmData.rows}, 1fr)`,
                                gap: 0,
                            }}
                        >
                            {farmData.plots.map((plot, index) => {
                                const bgColor = plot.crop?.color;
                                const isMergeStart = plot.isMergeStart && plot.mergeCount && plot.mergeCount > 1;
                                const isMergedChild = !!plot.mergedWith;
                                const isSelected = mergeSelection.has(plot.id);
                                const isResetSelected = resetSelection.has(plot.id);

                                // マージグループのID取得
                                const mergeGroupId = plot.isMergeStart ? plot.id : plot.mergedWith;

                                // 選択中のマージグループか判定（マージグループ全体を選択状態にする）
                                const selectedMergeGroupId = selectedPlot?.isMergeStart
                                    ? selectedPlot.id
                                    : selectedPlot?.mergedWith;
                                const isInSelectedMergeGroup = mergeGroupId && selectedMergeGroupId && mergeGroupId === selectedMergeGroupId;

                                // 境界線を消すかどうかの判定
                                const noBorderTop = isAdjacentMerged(plot, 'top');
                                const noBorderBottom = isAdjacentMerged(plot, 'bottom');
                                const noBorderLeft = isAdjacentMerged(plot, 'left');
                                const noBorderRight = isAdjacentMerged(plot, 'right');
                                const isMergedPlot = isMergeStart || isMergedChild;

                                // 選択状態かどうか
                                const isPlotSelected = selectedPlot?.id === plot.id || isInSelectedMergeGroup;

                                // ステータスアイコンを表示する条件：
                                // - 通常区画（マージされていない）
                                // - マージグループの右上区画（上と右に隣接がない）
                                const showStatusIcon = !isMergedPlot || (!noBorderTop && !noBorderRight);

                                // 選択時のborder色（外枠のみ選択色、内側はなし）
                                const selectionColor = 'var(--color-primary)';
                                const statusColor = STATUS_COLORS[plot.status];

                                return (
                                    <button
                                        key={plot.id}
                                        className={`${styles.plotCell} ${styles.fieldYuPlot} ${isSelected ? styles.mergeSelected : ''}`}
                                        style={{
                                            background: isSelected
                                                ? 'rgba(76, 175, 80, 0.3)'
                                                : isResetSelected
                                                    ? 'rgba(244, 67, 54, 0.3)'
                                                    : bgColor
                                                        ? `linear-gradient(135deg, ${bgColor}40, ${bgColor}20)`
                                                        : isMergedChild
                                                            ? farmData.plots.find(p => p.id === plot.mergedWith)?.crop?.color
                                                                ? `linear-gradient(135deg, ${farmData.plots.find(p => p.id === plot.mergedWith)?.crop?.color}40, ${farmData.plots.find(p => p.id === plot.mergedWith)?.crop?.color}20)`
                                                                : undefined
                                                            : undefined,
                                            // 外枠のみ選択色、内側（隣接マージ区画がある方向）はborderなし
                                            borderTopColor: noBorderTop ? 'transparent' : (isPlotSelected ? selectionColor : statusColor),
                                            borderBottomColor: noBorderBottom ? 'transparent' : (isPlotSelected ? selectionColor : statusColor),
                                            borderLeftColor: noBorderLeft ? 'transparent' : (isPlotSelected ? selectionColor : statusColor),
                                            borderRightColor: noBorderRight ? 'transparent' : (isPlotSelected ? selectionColor : statusColor),
                                            borderTopWidth: noBorderTop ? 0 : 3,
                                            borderBottomWidth: noBorderBottom ? 0 : 3,
                                            borderLeftWidth: noBorderLeft ? 0 : 3,
                                            borderRightWidth: noBorderRight ? 0 : 3,
                                            borderTopLeftRadius: (noBorderTop || noBorderLeft) ? 0 : undefined,
                                            borderTopRightRadius: (noBorderTop || noBorderRight) ? 0 : undefined,
                                            borderBottomLeftRadius: (noBorderBottom || noBorderLeft) ? 0 : undefined,
                                            borderBottomRightRadius: (noBorderBottom || noBorderRight) ? 0 : undefined,
                                        }}
                                        onClick={() => {
                                            if (isMergeMode) {
                                                toggleMergeSelection(plot.id);
                                            } else if (isResetMode) {
                                                toggleResetSelection(plot.id);
                                            } else {
                                                // マージされた子区画をクリックした場合、親区画を選択
                                                if (isMergedChild) {
                                                    const parentPlot = farmData.plots.find(p => p.id === plot.mergedWith);
                                                    if (parentPlot) {
                                                        handlePlotClick(parentPlot);
                                                        return;
                                                    }
                                                }
                                                handlePlotClick(plot);
                                            }
                                        }}
                                    >
                                        {/* ステータス丸はマージグループの右上区画または通常区画のみに表示 */}
                                        {showStatusIcon && (
                                            <span className={styles.plotStatus} style={{ background: STATUS_COLORS[plot.status] }} />
                                        )}
                                        {plot.crop && !isMergedChild && (
                                            <span className={styles.plotCrop}>
                                                {plot.crop.name}
                                                {plot.crop.variety && <small>({plot.crop.variety})</small>}
                                            </span>
                                        )}
                                        {(isSelected || isResetSelected) && <span className={styles.mergeIndicator}>✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                        {activeFarm === 'fieldYu' && (
                            <div className={styles.ridgeLabels}>
                                {Array.from({ length: farmData.cols }, (_, i) => (
                                    <span key={i}>畝{i + 1}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 詳細パネル */}
                    <div className={styles.detailPanel}>
                        {selectedPlot ? (
                            <>
                                <div className={styles.panelHeader}>
                                    <h2>区画 {selectedPlot.row + 1}-{selectedPlot.col + 1}</h2>
                                    <button onClick={() => setSelectedPlot(null)} className={styles.closeBtn}>
                                        <X size={18} />
                                    </button>
                                </div>

                                {isEditing ? (
                                    <div className={styles.editForm}>
                                        <div className="form-group">
                                            <label className="form-label">作物</label>
                                            <div className={styles.cropSelectRow}>
                                                <select
                                                    className="form-input"
                                                    value={editCrop}
                                                    onChange={(e) => setEditCrop(e.target.value)}
                                                >
                                                    <option value="">（なし）</option>
                                                    {allCrops.map((crop) => (
                                                        <option key={crop.id} value={crop.id}>
                                                            {crop.name}{crop.isCustom ? ' ★' : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    className={styles.addCropBtn}
                                                    onClick={() => setShowAddCrop(true)}
                                                    title="新しい作物を追加"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                                {editCrop && allCrops.find(c => c.id === editCrop)?.isCustom && (
                                                    <button
                                                        type="button"
                                                        className={styles.deleteCropBtn}
                                                        onClick={() => handleDeleteCrop(editCrop)}
                                                        title="この作物を削除"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {editCrop && (
                                            <div className="form-group">
                                                <label className="form-label">品種（任意）</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={editVariety}
                                                    onChange={(e) => setEditVariety(e.target.value)}
                                                    placeholder="例：桃太郎、アイコ"
                                                />
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label className="form-label">ステータス</label>
                                            <select
                                                className="form-input"
                                                value={editStatus}
                                                onChange={(e) => setEditStatus(e.target.value as CropStatus)}
                                            >
                                                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                                    <option key={key} value={key}>
                                                        {label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.editActions}>
                                            <button className="btn btn-primary" onClick={handleSave}>
                                                <Check size={16} />
                                                保存
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                                キャンセル
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.plotInfo}>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>作物</span>
                                            <span className={styles.infoValue}>
                                                {selectedPlot.crop ? (
                                                    <span className={styles.cropBadge} style={{ background: selectedPlot.crop.color }}>
                                                        {selectedPlot.crop.name}
                                                        {selectedPlot.crop.variety && ` (${selectedPlot.crop.variety})`}
                                                    </span>
                                                ) : (
                                                    '未設定'
                                                )}
                                            </span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>ステータス</span>
                                            <span
                                                className={styles.statusBadge}
                                                style={{ background: STATUS_COLORS[selectedPlot.status] }}
                                            >
                                                {STATUS_LABELS[selectedPlot.status]}
                                            </span>
                                        </div>
                                        {selectedPlot.isMergeStart && selectedPlot.mergeCount && selectedPlot.mergeCount > 1 && (
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>マージ</span>
                                                <span className={styles.infoValue}>
                                                    {selectedPlot.mergeCount}区画を結合中
                                                </span>
                                            </div>
                                        )}
                                        {selectedPlot.plantedDate && (
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>
                                                    <Calendar size={14} />
                                                    植付日
                                                </span>
                                                <span className={styles.infoValue}>
                                                    {selectedPlot.plantedDate}
                                                    <small>（{daysSince(selectedPlot.plantedDate)}日前）</small>
                                                </span>
                                            </div>
                                        )}
                                        {(() => {
                                            const lastWatering = getLastWatering(selectedPlot.id);
                                            if (lastWatering) {
                                                return (
                                                    <div className={styles.infoRow}>
                                                        <span className={styles.infoLabel}>
                                                            <Droplets size={14} />
                                                            最終水やり
                                                        </span>
                                                        <span className={styles.infoValue}>
                                                            {daysSince(lastWatering)}日前
                                                        </span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                        <div className={styles.buttonGroup}>
                                            <button className="btn btn-accent" onClick={() => setIsEditing(true)}>
                                                編集する
                                            </button>
                                            {activeFarm === 'fieldYu' && selectedPlot.isMergeStart && selectedPlot.mergeCount && selectedPlot.mergeCount > 1 && (
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => handleUnmergePlots(selectedPlot.id)}
                                                >
                                                    マージ解除
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.emptyPanel}>
                                <p>区画をクリックして詳細を表示</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 作物追加モーダル */}
            {showAddCrop && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>新しい作物を追加</h3>
                            <button onClick={() => setShowAddCrop(false)} className={styles.closeBtn}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className="form-group">
                                <label className="form-label">作物名</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newCropName}
                                    onChange={(e) => setNewCropName(e.target.value)}
                                    placeholder="例：ブロッコリー"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">表示色</label>
                                <div className={styles.colorPicker}>
                                    <input
                                        type="color"
                                        value={newCropColor}
                                        onChange={(e) => setNewCropColor(e.target.value)}
                                    />
                                    <span>{newCropColor}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className="btn btn-secondary" onClick={() => setShowAddCrop(false)}>
                                キャンセル
                            </button>
                            <button className="btn btn-primary" onClick={handleAddCrop}>
                                追加
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
