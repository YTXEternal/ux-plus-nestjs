/**
 * YYYY-MM-DD hh:mm:ss
 *
 * @param {(number | InstanceType<typeof Date>)} date
 * @param {string} format
 * @returns {*}
 */
export const generateDate = (opt?: {
  date?: number | InstanceType<typeof Date>;
  format?: string;
}) => {
  const defaultOption = {
    format: 'YYYY-MM-DD',
    date: new Date(),
  };
  const { date, format } = Object.assign(defaultOption, opt);

  // @ts-ignore
  if (isNaN(date)) throw new TypeError('Invalid date value');

  if (typeof date !== 'number' && !(date instanceof Date)) {
    throw new TypeError('Invalid date value');
  }
  let localDate: null | InstanceType<typeof Date> = null;

  if (typeof date === 'number') {
    localDate = new Date(date);
  } else if (date instanceof Date) {
    localDate = date;
  } else {
    localDate = new Date();
  }

  const zerofill = (n: number): string => n.toString().padStart(2, '0');

  const yyyy = localDate.getFullYear() + '';
  const month = zerofill(localDate.getMonth() + 1);
  const dd = zerofill(localDate.getDate());
  const hh = zerofill(localDate.getHours());
  const mm = zerofill(localDate.getMinutes());
  const ss = zerofill(localDate.getSeconds());

  return format.replace(/YYYY|MM|DD|hh|mm|ss/g, (match) => {
    switch (match) {
      case 'YYYY':
        return yyyy;
      case 'MM':
        return month;
      case 'DD':
        return dd;
      case 'hh':
        return hh;
      case 'mm':
        return mm;
      case 'ss':
        return ss;
      default:
        return match;
    }
  });
};
