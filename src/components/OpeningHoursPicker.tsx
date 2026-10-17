'use client';

import React from 'react';
import { Clock, Copy, Sparkles } from 'lucide-react';
import { WeekSchedule, DaySchedule } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface OpeningHoursPickerProps {
  value: WeekSchedule;
  onChange: (val: WeekSchedule) => void;
}

export const DEFAULT_WEEK_SCHEDULE: WeekSchedule = {
  monday: { open: '00:00', close: '23:59', closed: false },
  tuesday: { open: '00:00', close: '23:59', closed: false },
  wednesday: { open: '00:00', close: '23:59', closed: false },
  thursday: { open: '00:00', close: '23:59', closed: false },
  friday: { open: '00:00', close: '23:59', closed: false },
  saturday: { open: '00:00', close: '23:59', closed: false },
  sunday: { open: '00:00', close: '23:59', closed: false },
};

const DAY_LABELS: { key: keyof WeekSchedule; labelDe: string; labelEn: string; shortDe: string; shortEn: string }[] = [
  { key: 'monday', labelDe: 'Montag', labelEn: 'Monday', shortDe: 'Mo', shortEn: 'Mon' },
  { key: 'tuesday', labelDe: 'Dienstag', labelEn: 'Tuesday', shortDe: 'Di', shortEn: 'Tue' },
  { key: 'wednesday', labelDe: 'Mittwoch', labelEn: 'Wednesday', shortDe: 'Mi', shortEn: 'Wed' },
  { key: 'thursday', labelDe: 'Donnerstag', labelEn: 'Thursday', shortDe: 'Do', shortEn: 'Thu' },
  { key: 'friday', labelDe: 'Freitag', labelEn: 'Friday', shortDe: 'Fr', shortEn: 'Fri' },
  { key: 'saturday', labelDe: 'Samstag', labelEn: 'Saturday', shortDe: 'Sa', shortEn: 'Sat' },
  { key: 'sunday', labelDe: 'Sonntag', labelEn: 'Sunday', shortDe: 'So', shortEn: 'Sun' },
];

export const OpeningHoursPicker: React.FC<OpeningHoursPickerProps> = ({ value, onChange }) => {
  const { locale } = useTranslation();
  const schedule = value || DEFAULT_WEEK_SCHEDULE;

  const handleDayChange = (dayKey: keyof WeekSchedule, updates: Partial<DaySchedule>) => {
    onChange({
      ...schedule,
      [dayKey]: {
        ...schedule[dayKey],
        ...updates,
      },
    });
  };

  const copyMondayToWeekdays = () => {
    const mondayVal = schedule.monday;
    onChange({
      ...schedule,
      tuesday: { ...mondayVal },
      wednesday: { ...mondayVal },
      thursday: { ...mondayVal },
      friday: { ...mondayVal },
    });
  };

  const setAll24Hours = () => {
    const allDays: Partial<WeekSchedule> = {};
    DAY_LABELS.forEach((d) => {
      allDays[d.key] = { open: '00:00', close: '23:59', closed: false };
    });
    onChange(allDays as WeekSchedule);
  };

  return (
    <div className="space-y-3">
      {/* Quick Action Shortcuts (Hick's Law / Cognitive Friction Reduction) */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        <button
          type="button"
          onClick={copyMondayToWeekdays}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#145BFF] text-[11px] font-bold transition-colors cursor-pointer"
        >
          <Copy className="w-3 h-3" />
          <span>{locale === 'de' ? 'Montag auf Mo–Fr übertragen' : 'Apply Monday to Mon–Fri'}</span>
        </button>

        <button
          type="button"
          onClick={setAll24Hours}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-[#FF9F1A]" />
          <span>{locale === 'de' ? '24/7 Geöffnet' : 'Open 24/7'}</span>
        </button>
      </div>

      {/* 7 Days Table/List */}
      <div className="space-y-2 border border-[#E8ECF4] rounded-2xl p-3 bg-[#FAFBFF]">
        {DAY_LABELS.map((day) => {
          const item = schedule[day.key] || { open: '09:00', close: '18:00', closed: false };
          return (
            <div
              key={day.key}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-xl transition-colors ${
                item.closed ? 'bg-gray-100/60 opacity-75' : 'bg-white shadow-2xs'
              }`}
            >
              {/* Day Label & Closed Toggle */}
              <div className="flex items-center justify-between sm:justify-start gap-3 sm:w-36">
                <span className="text-xs font-bold text-[#0D2B75]">
                  {locale === 'de' ? day.labelDe : day.labelEn}
                </span>
                <button
                  type="button"
                  onClick={() => handleDayChange(day.key, { closed: !item.closed })}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                    item.closed
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-gray-200'
                  }`}
                >
                  {item.closed
                    ? locale === 'de'
                      ? 'Geschlossen'
                      : 'Closed'
                    : locale === 'de'
                    ? 'Geöffnet'
                    : 'Open'}
                </button>
              </div>

              {/* Time Pickers */}
              {!item.closed ? (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-[#FAFBFF] px-2.5 py-1 rounded-lg border border-[#E8ECF4]">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <input
                      type="time"
                      value={item.open}
                      onChange={(e) => handleDayChange(day.key, { open: e.target.value })}
                      className="bg-transparent text-xs font-medium text-gray-800 outline-none"
                    />
                  </div>
                  <span className="text-gray-400 text-xs">{locale === 'de' ? 'bis' : 'to'}</span>
                  <div className="flex items-center gap-1 bg-[#FAFBFF] px-2.5 py-1 rounded-lg border border-[#E8ECF4]">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <input
                      type="time"
                      value={item.close}
                      onChange={(e) => handleDayChange(day.key, { close: e.target.value })}
                      className="bg-transparent text-xs font-medium text-gray-800 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <span className="text-[11px] text-gray-400 italic">
                  {locale === 'de' ? 'Ganztägig geschlossen' : 'Closed all day'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
