import dayjs from 'dayjs';

export function formatNumber(value, locale = 'vi-VN', options = {}) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  }).format(value);
}



export function formatDate(dateStr, locale = 'vi') {
  if (!dateStr) return ''
  return dayjs(dateStr).locale(locale).format('DD/M/YYYY');
}