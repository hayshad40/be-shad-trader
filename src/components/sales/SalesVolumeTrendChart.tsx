import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { SaleOrder, User } from '../../types';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  PackageCheck,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
  Layers,
} from 'lucide-react';

interface SalesVolumeTrendChartProps {
  orders: SaleOrder[];
  currentUser: User;
  formatMoney: (amount: number) => string;
}

interface DayTrendData {
  dateStr: string;
  dayShort: string;
  dayFull: string;
  formattedDate: string;
  isToday: boolean;
  salesVolume: number;
  orderCount: number;
  unitsCount: number;
  orders: SaleOrder[];
}

export const SalesVolumeTrendChart: React.FC<SalesVolumeTrendChartProps> = ({
  orders,
  currentUser,
  formatMoney,
}) => {
  const [metricView, setMetricView] = useState<'volume' | 'count'>('volume');
  const [statusFilter, setStatusFilter] = useState<'all' | 'processed' | 'pending'>('all');
  const [showTableBreakdown, setShowTableBreakdown] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Filter orders for the logged-in field representative
  const repOrders = useMemo(() => {
    return orders.filter((ord) => {
      // 1. Direct match on orderTakerId or salesmanId
      if (ord.orderTakerId === currentUser.id || ord.salesmanId === currentUser.id) {
        return true;
      }
      // 2. Check notes for rep name (e.g. Field Order Taker (Rashid Khan))
      if (ord.notes && ord.notes.toLowerCase().includes(currentUser.name.toLowerCase())) {
        return true;
      }
      // 3. If currently in ORDER_TAKER role, include orders tagged with order_taker or created in this role
      if (currentUser.role === 'ORDER_TAKER') {
        if (ord.orderTakerId === 'user_order_taker' || ord.salesmanId === 'user_order_taker') {
          return true;
        }
        if (ord.notes && ord.notes.toLowerCase().includes('order taker')) {
          return true;
        }
      }
      // 4. If admin or manager inspecting terminal, show field orders
      if (['SUPER_ADMIN', 'TENANT_OWNER', 'MANAGER'].includes(currentUser.role)) {
        return ord.orderTakerId === 'user_order_taker' || ord.salesmanId === 'user_order_taker' || !ord.orderTakerId;
      }
      return false;
    });
  }, [orders, currentUser]);

  // Compute 7-day chronological dates ending today
  const trendData = useMemo<DayTrendData[]>(() => {
    // Reference date (today in local context, falling back to latest order date if needed)
    const today = new Date();
    const days: DayTrendData[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = i === 0;

      const dayShort = isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayFull = d.toLocaleDateString('en-US', { weekday: 'long' });
      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Find rep orders on this day
      const dayOrders = repOrders.filter((ord) => {
        // Status filter
        if (statusFilter === 'pending' && ord.orderStatus !== 'pending') return false;
        if (statusFilter === 'processed' && ord.orderStatus === 'pending') return false;

        const orderDateMatch = ord.orderDate === dateStr;
        const createdDateMatch = ord.createdAt && ord.createdAt.split('T')[0] === dateStr;
        return orderDateMatch || createdDateMatch;
      });

      const dayVolume = dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const dayUnits = dayOrders.reduce(
        (sum, o) => sum + (o.items ? o.items.reduce((iSum, item) => iSum + (item.quantity || 0), 0) : 0),
        0
      );

      days.push({
        dateStr,
        dayShort,
        dayFull,
        formattedDate,
        isToday,
        salesVolume: dayVolume,
        orderCount: dayOrders.length,
        unitsCount: dayUnits,
        orders: dayOrders,
      });
    }

    return days;
  }, [repOrders, statusFilter]);

  // Summary statistics across 7 days
  const stats = useMemo(() => {
    const totalVolume = trendData.reduce((sum, d) => sum + d.salesVolume, 0);
    const totalOrders = trendData.reduce((sum, d) => sum + d.orderCount, 0);
    const totalUnits = trendData.reduce((sum, d) => sum + d.unitsCount, 0);
    const avgDailyVolume = Math.round(totalVolume / 7);

    let peakDay = trendData[0];
    trendData.forEach((d) => {
      if (d.salesVolume > (peakDay?.salesVolume || 0)) {
        peakDay = d;
      }
    });

    const todayData = trendData[trendData.length - 1];
    const prevDaysVolume = trendData.slice(0, 6).reduce((sum, d) => sum + d.salesVolume, 0);
    const prevDaysAvg = Math.round(prevDaysVolume / 6) || 1;
    const todayPacing = todayData
      ? Math.round(((todayData.salesVolume - prevDaysAvg) / prevDaysAvg) * 100)
      : 0;

    return {
      totalVolume,
      totalOrders,
      totalUnits,
      avgDailyVolume,
      peakDay,
      todayVolume: todayData?.salesVolume || 0,
      todayPacing,
    };
  }, [trendData]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayTrendData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/80 text-xs min-w-[210px] space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-slate-200">
                {data.dayFull}, {data.formattedDate}
              </span>
            </div>
            {data.isToday && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                TODAY
              </span>
            )}
          </div>

          <div className="space-y-1.5 pt-0.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Sales Volume:</span>
              <span className="font-mono font-bold text-sm text-amber-400">
                {formatMoney(data.salesVolume)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Orders Booked:</span>
              <span className="font-bold text-emerald-400">
                {data.orderCount} {data.orderCount === 1 ? 'booking' : 'bookings'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Total Units / Cases:</span>
              <span className="text-slate-300 font-medium">{data.unitsCount} units</span>
            </div>
          </div>

          {data.orders.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Booked Outlets ({data.orders.length})
              </span>
              <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                {data.orders.map((o) => (
                  <div key={o.id} className="flex justify-between items-center text-[11px] text-slate-300">
                    <span className="truncate max-w-[120px] font-medium">{o.customerName}</span>
                    <span className="font-mono text-amber-300 text-[10px] shrink-0">
                      {formatMoney(o.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base text-slate-900">
                  Last 7 Days Sales Volume Trend
                </h4>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Sparkles className="w-3 h-3" />
                  Live Recharts
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Visualizing daily order booking volume booked by{' '}
                <span className="font-semibold text-slate-800">{currentUser.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* View & Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMetricView('volume')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                metricView === 'volume'
                  ? 'bg-white text-amber-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Volume ({currentUser.role === 'SALESMAN' ? 'Sales' : 'PKR'})</span>
            </button>
            <button
              onClick={() => setMetricView('count')}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                metricView === 'count'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Orders ({stats.totalOrders})</span>
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl px-2.5 py-1 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Bookings</option>
            <option value="processed">Approved / Dispatched</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">7-Day Total Sales</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-amber-700 font-mono">
              {formatMoney(stats.totalVolume)}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">
            Across {stats.totalOrders} customer bookings
          </span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">Daily Average</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-slate-800 font-mono">
              {formatMoney(stats.avgDailyVolume)}
            </span>
            <span className="text-[10px] text-slate-400">/ day</span>
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">Standard 7-day pacing</span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">Peak Booking Day</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-emerald-700 font-mono truncate">
              {stats.peakDay ? stats.peakDay.dayShort : '-'}
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              {stats.peakDay ? formatMoney(stats.peakDay.salesVolume) : ''}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">
            {stats.peakDay ? stats.peakDay.formattedDate : 'No bookings'}
          </span>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 block">Today's Performance</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-indigo-700 font-mono">
              {formatMoney(stats.todayVolume)}
            </span>
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold block">
            {stats.todayPacing >= 0 ? `+${stats.todayPacing}%` : `${stats.todayPacing}%`} vs daily avg
          </span>
        </div>
      </div>

      {/* Main Recharts Line / Area Chart */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="h-60 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setSelectedDay(e.activePayload[0].payload.dateStr);
                }
              }}
            >
              <defs>
                {/* Amber Gradient for Sales Volume */}
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                </linearGradient>
                {/* Indigo Gradient for Order Count */}
                <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

              <XAxis
                dataKey="dayShort"
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={({ x, y, payload }) => {
                  const dayObj = trendData.find((d) => d.dayShort === payload.value);
                  const isCurrentDay = dayObj?.isToday;
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={14}
                        textAnchor="middle"
                        fill={isCurrentDay ? '#d97706' : '#64748b'}
                        fontSize={11}
                        fontWeight={isCurrentDay ? 800 : 500}
                      >
                        {payload.value}
                      </text>
                      {dayObj && (
                        <text
                          x={0}
                          y={0}
                          dy={26}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize={9}
                        >
                          {dayObj.formattedDate.split(' ')[1]}
                        </text>
                      )}
                    </g>
                  );
                }}
                height={35}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickFormatter={(value) => {
                  if (metricView === 'volume') {
                    if (value >= 100000) return `${(value / 1000).toFixed(0)}k`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return `${value}`;
                  }
                  return `${value} ord`;
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              {metricView === 'volume' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="salesVolume"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#volumeGradient)"
                    activeDot={{
                      r: 6,
                      fill: '#b45309',
                      stroke: '#ffffff',
                      strokeWidth: 2,
                    }}
                    dot={{
                      r: 4,
                      fill: '#ffffff',
                      stroke: '#d97706',
                      strokeWidth: 2,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="salesVolume"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="orderCount"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#countGradient)"
                    activeDot={{
                      r: 6,
                      fill: '#4338ca',
                      stroke: '#ffffff',
                      strokeWidth: 2,
                    }}
                    dot={{
                      r: 4,
                      fill: '#ffffff',
                      stroke: '#4f46e5',
                      strokeWidth: 2,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orderCount"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Footer with Day Pills & Quick Summary */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium">Daily Breakdown:</span>
            {trendData.map((d) => (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDay(selectedDay === d.dateStr ? null : d.dateStr)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                  selectedDay === d.dateStr
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : d.isToday
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={`${d.dayFull}, ${d.formattedDate}: ${formatMoney(d.salesVolume)} (${d.orderCount} orders)`}
              >
                {d.dayShort}: {metricView === 'volume' ? formatMoney(d.salesVolume) : `${d.orderCount} ord`}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowTableBreakdown(!showTableBreakdown)}
            className="text-amber-700 hover:text-amber-800 font-semibold text-[11px] flex items-center gap-1 self-start sm:self-auto"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{showTableBreakdown ? 'Hide Detailed Table' : 'Show Day-by-Day Table'}</span>
            {showTableBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Selected Day Order Detail or Table Breakdown */}
      {selectedDay && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs space-y-2">
          {(() => {
            const dayInfo = trendData.find((d) => d.dateStr === selectedDay);
            if (!dayInfo) return null;
            return (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-900">
                      {dayInfo.dayFull} ({dayInfo.formattedDate})
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-800">
                      {formatMoney(dayInfo.salesVolume)} • {dayInfo.orderCount} bookings
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="text-amber-700 hover:text-amber-900 text-[11px] font-semibold"
                  >
                    Close
                  </button>
                </div>
                {dayInfo.orders.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {dayInfo.orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white p-2.5 rounded-lg border border-amber-200/80 shadow-2xs flex justify-between items-center"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-indigo-700 font-mono text-[11px]">
                              {ord.orderNumber}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="font-semibold text-slate-800 truncate max-w-[130px]">
                              {ord.customerName}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            {ord.items.length} product(s) • Status: <span className="capitalize">{ord.orderStatus}</span>
                          </span>
                        </div>
                        <span className="font-mono font-bold text-amber-700 text-xs shrink-0">
                          {formatMoney(ord.totalAmount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-[11px]">No orders recorded on this date.</p>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Expandable Day-by-Day Table */}
      {showTableBreakdown && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3 text-center">Bookings</th>
                <th className="py-2.5 px-3 text-center">Units Sold</th>
                <th className="py-2.5 px-3 text-right">Sales Volume</th>
                <th className="py-2.5 px-3 text-right">Daily Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trendData.map((d) => {
                const sharePercent = stats.totalVolume > 0 ? ((d.salesVolume / stats.totalVolume) * 100).toFixed(1) : '0';
                return (
                  <tr
                    key={d.dateStr}
                    className={`hover:bg-slate-50 transition cursor-pointer ${
                      d.isToday ? 'bg-amber-50/40 font-medium' : ''
                    }`}
                    onClick={() => setSelectedDay(selectedDay === d.dateStr ? null : d.dateStr)}
                  >
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-700">
                      {d.dateStr} {d.isToday && <span className="text-amber-600 font-bold ml-1">• Today</span>}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{d.dayFull}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {d.orderCount}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-600">{d.unitsCount}</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-700 font-mono">
                      {formatMoney(d.salesVolume)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-500">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, Number(sharePercent))}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono">{sharePercent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50/80 font-bold text-slate-900 border-t border-slate-200">
              <tr>
                <td colSpan={2} className="py-2 px-3">
                  7-Day Total
                </td>
                <td className="py-2 px-3 text-center text-indigo-700">{stats.totalOrders}</td>
                <td className="py-2 px-3 text-center text-slate-700">{stats.totalUnits}</td>
                <td className="py-2 px-3 text-right text-amber-800 font-mono">
                  {formatMoney(stats.totalVolume)}
                </td>
                <td className="py-2 px-3 text-right text-slate-600">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
