import { createStore } from './createStore';
import type { DailyLogDraft } from '../StockDashboard/components/DailyLogModal';
import { emptyDraft } from '../StockDashboard/components/DailyLogModal';

const store = createStore<DailyLogDraft>(() => emptyDraft([]));

export const useDraftStore = store.useStore;
export const setDraft = (d: DailyLogDraft) => store.setState(d);
export const resetDraft = store.reset;
