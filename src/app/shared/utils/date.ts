import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(duration);

export const formatDate = (
  date: string | Date | undefined,
  format = 'DD/MM/YYYY'
) => {
  if (!date) {
    return '';
  }

  if (typeof date === 'string' && /^\d{10,13}$/.test(date))
    return dayjs(new Date(parseInt(date)))
      .local()
      .format(format);

  return dayjs(date).local().format(format);
};

export const diffFromNow = (date: string | Date): string | undefined => {
  const timeDifference: number = dayjs(date).diff(new Date(), 'second');

  if (timeDifference > 0) {
    const duration = dayjs.duration(timeDifference, 'second');

    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    const parts = [];
    if (days > 0) {
      parts.push(`${days} days`);
    }
    if (hours > 0) {
      parts.push(`${hours} hours`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} minutes`);
    }
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} seconds`);
    }

    return parts.join(' ');
  }
  return;
};
