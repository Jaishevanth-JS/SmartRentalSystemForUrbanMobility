import React, { useState, useEffect } from 'react';

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

const DateTimePicker = ({ label, value, onChange, minDate, error }) => {
  // value expected: "YYYY-MM-DD HH:mm AM/PM"
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState('AM');

  useEffect(() => {
    if (value && value.includes(' ')) {
      const parts = value.split(' ');
      if (parts[0]) setDate(parts[0]);
      if (parts[1]) {
        const [h, m] = parts[1].split(':');
        setHour(h);
        setMinute(m);
      }
      if (parts[2]) setAmpm(parts[2]);
    } else if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setDate(d.toISOString().split('T')[0]);
        let h = d.getHours();
        const m = d.getMinutes().toString().padStart(2, '0');
        const p = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        setHour(h.toString().padStart(2, '0'));
        setMinute(MINUTES.includes(m) ? m : (Math.round(parseInt(m)/5)*5%60).toString().padStart(2, '0'));
        setAmpm(p);
      }
    }
  }, [value]);

  const update = (d, h, m, p) => {
    if (!d) {
      onChange('');
      return;
    }
    onChange(`${d} ${h}:${m} ${p}`);
  };


  const selectCls = "h-11 px-3 bg-[#f5f0eb] border border-[#e2d5c3] rounded-xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold appearance-none cursor-pointer transition-colors hover:bg-[#efe8df]";

  return (
    <div className="flex-1 space-y-1.5">
      {label && <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block">{label}</label>}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Date Input */}
        <div className="relative flex-grow min-w-[160px]">
          <input 
            type="date" 
            min={minDate}
            value={date}
            onChange={(e) => { setDate(e.target.value); update(e.target.value, hour, minute, ampm); }}
            className="w-full h-11 px-4 bg-[#f5f0eb] border border-[#e2d5c3] rounded-xl focus:outline-none focus:border-[#8b5e3c] text-sm font-bold cursor-pointer"
          />
        </div>

        {/* Time Container */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#e2d5c3] shadow-sm">
          <select 
            value={hour} 
            onChange={(e) => { setHour(e.target.value); update(date, e.target.value, minute, ampm); }}
            className={selectCls + " border-none bg-transparent h-9"}
          >
            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <span className="font-bold text-[#8b5e3c]">:</span>
          <select 
            value={minute} 
            onChange={(e) => { setMinute(e.target.value); update(date, hour, e.target.value, ampm); }}
            className={selectCls + " border-none bg-transparent h-9"}
          >
            {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          
          {/* AM/PM Toggle */}
          <div className="flex bg-[#f5f0eb] rounded-lg p-0.5 ml-1">
            <button
              type="button"
              onClick={() => { setAmpm('AM'); update(date, hour, minute, 'AM'); }}
              className={`px-3 py-1.5 text-[10px] font-black rounded-md transition-all ${ampm === 'AM' ? 'bg-[#8b5e3c] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => { setAmpm('PM'); update(date, hour, minute, 'PM'); }}
              className={`px-3 py-1.5 text-[10px] font-black rounded-md transition-all ${ampm === 'PM' ? 'bg-[#8b5e3c] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              PM
            </button>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase flex items-center gap-1">
        <span className="w-1 h-1 bg-red-500 rounded-full"></span> {error}
      </p>}
    </div>
  );
};

export default DateTimePicker;
