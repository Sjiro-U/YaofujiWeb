// 農地管理用のデータ型定義とモックデータ

export type CropStatus = 'planted' | 'harvest' | 'empty';
export type Direction = 'north' | 'east' | 'south' | 'west';

export interface Crop {
    id: string;
    name: string;
    color: string;
    variety?: string;      // 品種（例：桃太郎、アイコなど）
    isCustom?: boolean;    // ユーザーが追加したカスタム作物
}

export interface Plot {
    id: string;
    row: number;
    col: number;
    crop: Crop | null;           // 単一作物
    status: CropStatus;
    plantedDate?: string;
    notes?: string;
    // マージ関連
    mergedWith?: string;         // マージ先のPlot ID（このPlotはマージされて非表示）
    isMergeStart?: boolean;      // マージの起点かどうか
    mergeCount?: number;         // マージされた区画数（起点のみ）
}

export interface ActivityLog {
    id: string;
    plotId: string;
    date: string;
    type: 'watering' | 'thinning' | 'fertilizing' | 'pesticide' | 'other';
    notes: string;
    photos?: string[];
}

export interface FarmData {
    name: string;
    rows: number;
    cols: number;
    plots: Plot[];
    logs: ActivityLog[];
    direction?: Direction;       // 農地の方角（北が上など）
}

// 方角ラベル
export const DIRECTION_LABELS: Record<Direction, string> = {
    north: '北',
    east: '東',
    south: '南',
    west: '西',
};

// 利用可能な野菜リスト
export const AVAILABLE_CROPS: Crop[] = [
    { id: 'tomato', name: 'トマト', color: '#E53935' },
    { id: 'eggplant', name: 'ナス', color: '#5E35B1' },
    { id: 'cucumber', name: 'きゅうり', color: '#43A047' },
    { id: 'carrot', name: 'にんじん', color: '#FB8C00' },
    { id: 'daikon', name: '大根', color: '#FAFAFA' },
    { id: 'spinach', name: 'ほうれん草', color: '#2E7D32' },
    { id: 'cabbage', name: 'キャベツ', color: '#81C784' },
    { id: 'potato', name: 'じゃがいも', color: '#795548' },
    { id: 'onion', name: 'たまねぎ', color: '#FFCC80' },
    { id: 'pepper', name: 'ピーマン', color: '#66BB6A' },
];

// ステータスラベル
export const STATUS_LABELS: Record<CropStatus, string> = {
    planted: '定植済み',
    harvest: '収穫期',
    empty: '空き',
};

// ステータス色
export const STATUS_COLORS: Record<CropStatus, string> = {
    planted: 'var(--status-planted)',
    harvest: 'var(--status-harvest)',
    empty: 'var(--status-empty)',
};

// 作業種類ラベル
export const LOG_TYPE_LABELS: Record<ActivityLog['type'], string> = {
    watering: '水やり',
    thinning: '間引き',
    fertilizing: '追肥・土壌',
    pesticide: '防除・除草',
    other: 'その他',
};

// 初期データ生成（SFC近隣農地）
export function createInitialFarmData(): FarmData {
    const rows = 6;  // 縦6マス
    const cols = 9;  // 横9マス
    const plots: Plot[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            plots.push({
                id: `${row}-${col}`,
                row,
                col,
                crop: null,
                status: 'empty',
            });
        }
    }

    // サンプルデータを追加
    plots[0].crop = AVAILABLE_CROPS[0]; // トマト
    plots[0].status = 'harvest';
    plots[0].plantedDate = '2025-09-15';

    plots[1].crop = AVAILABLE_CROPS[1]; // ナス
    plots[1].status = 'planted';
    plots[1].plantedDate = '2025-10-01';

    plots[9].crop = AVAILABLE_CROPS[5]; // ほうれん草（2行目の最初）
    plots[9].status = 'planted';
    plots[9].plantedDate = '2025-12-20';

    return {
        name: 'SFC近隣農地',
        rows,
        cols,
        plots,
        logs: [
            {
                id: '1',
                plotId: '0-0',
                date: '2026-01-07',
                type: 'watering',
                notes: '朝に水やり実施',
            },
            {
                id: '2',
                plotId: '0-1',
                date: '2026-01-05',
                type: 'fertilizing',
                notes: '追肥（有機肥料）実施',
            },
        ],
        direction: 'north',  // 方角のデフォルト値
    };
}

// 2つ目の農地（フィールドゆう）のデータ生成
// 横長レイアウト: 9畝（列）× 3区画（行）、各区画は単一品種
export function createFieldYuFarmData(): FarmData {
    const rows = 3;  // 各畝内の区画数（縦2.7m → 3区画）
    const cols = 9;  // 畝の数（横に9個並ぶ）
    const plots: Plot[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            plots.push({
                id: `yu-${row}-${col}`,
                row,
                col,
                crop: null,
                status: 'empty',
            });
        }
    }

    // サンプルデータ
    // 畝0の区画0
    plots[0].crop = AVAILABLE_CROPS[3]; // にんじん
    plots[0].status = 'planted';
    plots[0].plantedDate = '2025-11-01';

    // 畝0の区画1
    plots[9].crop = AVAILABLE_CROPS[5]; // ほうれん草
    plots[9].status = 'planted';
    plots[9].plantedDate = '2025-11-01';

    // 畝3（マージ例：区画0〜2を結合して大根）
    plots[3].crop = AVAILABLE_CROPS[4]; // 大根
    plots[3].status = 'harvest';
    plots[3].plantedDate = '2025-10-15';
    plots[3].isMergeStart = true;
    plots[3].mergeCount = 3;
    plots[12].mergedWith = 'yu-0-3'; // 区画1をマージ
    plots[21].mergedWith = 'yu-0-3'; // 区画2をマージ

    // 畝5の区画1
    plots[14].crop = AVAILABLE_CROPS[6]; // キャベツ
    plots[14].status = 'planted';
    plots[14].plantedDate = '2025-10-20';

    return {
        name: 'フィールドゆう',
        rows,
        cols,
        plots,
        logs: [],
        direction: 'north', // 北向き
    };
}

// LocalStorage キー
const STORAGE_KEY = 'yaofuji_farm_data';
const STORAGE_KEY_FIELD_YU = 'yaofuji_farm_data_field_yu';

// データの保存
export function saveFarmData(data: FarmData): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
}

// 2つ目の農地データの保存
export function saveFieldYuFarmData(data: FarmData): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_FIELD_YU, JSON.stringify(data));
    }
}

// データの読み込み
export function loadFarmData(): FarmData {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                // パースエラー時は初期データを返す
            }
        }
    }
    return createInitialFarmData();
}

// 2つ目の農地データの読み込み
export function loadFieldYuFarmData(): FarmData {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_FIELD_YU);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                // パースエラー時は初期データを返す
            }
        }
    }
    return createFieldYuFarmData();
}

// 日数計算
export function daysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// カスタム作物のLocalStorageキー
const CUSTOM_CROPS_KEY = 'yaofuji_custom_crops';

// カスタム作物の保存
export function saveCustomCrops(crops: Crop[]): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(CUSTOM_CROPS_KEY, JSON.stringify(crops));
    }
}

// カスタム作物の読み込み
export function loadCustomCrops(): Crop[] {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(CUSTOM_CROPS_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return [];
            }
        }
    }
    return [];
}

// 全作物リスト取得（デフォルト + カスタム）
export function getAllCrops(): Crop[] {
    return [...AVAILABLE_CROPS, ...loadCustomCrops()];
}

// サカタ通信の育て方リンク生成
export const SAKATA_LINKS: Record<string, string> = {
    tomato: 'https://sakata-tsushin.com/lesson-vegetable/detail_1/',
    eggplant: 'https://sakata-tsushin.com/lesson-vegetable/detail_2/',
    cucumber: 'https://sakata-tsushin.com/lesson-vegetable/detail_3/',
    carrot: 'https://sakata-tsushin.com/lesson-vegetable/detail_20/',
    daikon: 'https://sakata-tsushin.com/lesson-vegetable/detail_8/',
    spinach: 'https://sakata-tsushin.com/lesson-vegetable/detail_14/',
    cabbage: 'https://sakata-tsushin.com/lesson-vegetable/detail_7/',
    potato: 'https://sakata-tsushin.com/lesson-vegetable/detail_11/',
    onion: 'https://sakata-tsushin.com/lesson-vegetable/detail_16/',
    pepper: 'https://sakata-tsushin.com/lesson-vegetable/detail_4/',
};

// サカタのタネリンク取得
export function getSakataLink(cropId: string): string | null {
    return SAKATA_LINKS[cropId] || null;
}
