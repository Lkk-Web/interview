import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE, ADMIN_TOKEN } from '../constants';
import type { AssetPoint } from './types';
import './AddAssetHistoryModal.less';

interface Props {
  last?: AssetPoint;
  onSuccess?: (item: AssetPoint) => void;
  onClose: () => void;
}

interface FormState {
  date: string;
  cash: string;
  stockValue: string;
  loan: string;
  other: string;
  remark: string;
}

const today = () => new Date().toISOString().slice(0, 10);

const AddAssetHistoryModal: React.FC<Props> = ({ last, onSuccess, onClose }) => {
  const [form, setForm] = useState<FormState>({
    date: today(),
    cash: '',
    stockValue: '',
    loan: '',
    other: '',
    remark: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/stock/asset-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
        body: JSON.stringify({
          date: form.date,
          cash: form.cash !== '' ? Number(form.cash) : last?.cash ?? 0,
          stockValue: form.stockValue !== '' ? Number(form.stockValue) : last?.stockValue ?? 0,
          loan: form.loan !== '' ? Number(form.loan) : last?.loan ?? 0,
          other: form.other !== '' ? Number(form.other) : last?.other ?? 0,
          remark: form.remark || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }
      const item: AssetPoint = await res.json();
      onSuccess?.(item);
      toast.success('提交成功');
      onClose();
    } catch (err: any) {
      setError(err.message ?? '提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aah-overlay" onClick={onClose}>
      <div className="aah-modal" onClick={(e) => e.stopPropagation()}>
        <div className="aah-header">
          <span>新增资产快照</span>
          <button className="aah-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="aah-form" onSubmit={handleSubmit}>
          <label>
            日期
            <input type="date" value={form.date} onChange={set('date')} required />
          </label>
          <label>
            现金
            <input
              type="number"
              placeholder={last ? String(last.cash) : ''}
              value={form.cash}
              onChange={set('cash')}
              required={!last}
            />
          </label>
          <label>
            股票市值
            <input
              type="number"
              placeholder={last ? String(last.stockValue) : ''}
              value={form.stockValue}
              onChange={set('stockValue')}
              required={!last}
            />
          </label>
          <label>
            贷款（负数）
            <input
              type="number"
              placeholder={last ? String(last.loan) : ''}
              value={form.loan}
              onChange={set('loan')}
              required={!last}
            />
          </label>
          <label>
            其他
            <input
              type="number"
              placeholder={last ? String(last.other) : '0'}
              value={form.other}
              onChange={set('other')}
            />
          </label>
          <label>
            备注
            <textarea
              placeholder="变动说明…"
              value={form.remark}
              onChange={set('remark')}
              rows={2}
            />
          </label>

          {error && <div className="aah-error">{error}</div>}

          <div className="aah-actions">
            <button type="button" className="aah-btn-cancel" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="aah-btn-submit" disabled={loading}>
              {loading ? '提交中…' : '提交'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetHistoryModal;
