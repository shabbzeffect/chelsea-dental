'use client';

type PresetRange = 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'thisYear' | 'custom';

const presetLabels: Record<PresetRange, string> = {
  thisMonth: 'This Month',
  lastMonth: 'Last Month',
  thisQuarter: 'This Quarter',
  thisYear: 'This Year',
  custom: 'Custom',
};

export function getPresetDates(preset: PresetRange): { start: string; end: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (preset) {
    case 'thisMonth':
      return {
        start: new Date(year, month, 1).toISOString().split('T')[0],
        end: new Date(year, month + 1, 0).toISOString().split('T')[0],
      };
    case 'lastMonth':
      return {
        start: new Date(year, month - 1, 1).toISOString().split('T')[0],
        end: new Date(year, month, 0).toISOString().split('T')[0],
      };
    case 'thisQuarter': {
      const quarterStart = Math.floor(month / 3) * 3;
      return {
        start: new Date(year, quarterStart, 1).toISOString().split('T')[0],
        end: new Date(year, quarterStart + 3, 0).toISOString().split('T')[0],
      };
    }
    case 'thisYear':
      return {
        start: new Date(year, 0, 1).toISOString().split('T')[0],
        end: new Date(year, 11, 31).toISOString().split('T')[0],
      };
    case 'custom':
      return {
        start: new Date(year, month, 1).toISOString().split('T')[0],
        end: new Date(year, month + 1, 0).toISOString().split('T')[0],
      };
  }
}

interface DateRangeFilterProps {
  preset: PresetRange;
  startDate: string;
  endDate: string;
  dateRange?: { start: string; end: string };
  onPresetChange: (preset: PresetRange) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateRangeFilter({
  preset,
  startDate,
  endDate,
  dateRange,
  onPresetChange,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 no-print">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
        </div>

        <div className="flex gap-1">
          {(['thisMonth', 'lastMonth', 'thisQuarter', 'thisYear', 'custom'] as PresetRange[]).map((p) => (
            <button
              key={p}
              onClick={() => onPresetChange(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                preset === p
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {presetLabels[p]}
            </button>
          ))}
        </div>

        {preset === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        )}

        {dateRange && (
          <div className="ml-auto text-sm text-gray-500">
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </div>
        )}
      </div>
    </div>
  );
}
