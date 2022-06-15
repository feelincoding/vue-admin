import type { SystemEdptType } from '@/types/SystemType';

export const stringArrToEdptArr = (arr: string[]) => {
  const edpts: SystemEdptType[] = [];
  arr.forEach((edpt) => {
    const afterStr = edpt.split(':');
    edpts.push({
      protocol: afterStr[0],
      domain: afterStr[1].substring(2),
      port: afterStr[2],
    });
  });

  return edpts;
};

export const edptArrToStringArr = (edpts: SystemEdptType[]) => {
  const arr: string[] = [];
  edpts.forEach((edpt) => {
    arr.push(`${edpt.protocol}://${edpt.domain}:${edpt.port}`);
  });
  console.log();
  return arr;
};

export const edptToString = (edpt: SystemEdptType) => {
  return `${edpt.protocol}://${edpt.domain}:${edpt.port}`;
};

export const stringToEdpt = (str: string) => {
  const afterStr = str.split(':');
  return {
    protocol: afterStr[0],
    domain: afterStr[1].substring(2),
    port: afterStr[2],
  };
};

export const convertDate = (str: string) => {
  const date = new Date(str);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
};

export const convertTime = (str: string) => {
  const date = new Date(str);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2);
};

export const convertBaseTime = (str: string) => {
  //2022-05-27 20:30
  const date = new Date(str);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();

  return (
    year +
    '-' +
    ('0' + month).slice(-2) +
    '-' +
    ('0' + day).slice(-2) +
    ' ' +
    ('0' + hour).slice(-2) +
    ':' +
    ('0' + minute).slice(-2)
  );
};

export const getPauseTime = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = today.getDate();
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${date} ${hours}:${minutes}`;
};

export const addDate = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const getTimeArr = (endTime: string, timeInterval: number): string[] => {
  let tempEndTime = new Date(endTime);
  let tempStartTime = new Date(endTime);
  tempEndTime.setMinutes(tempEndTime.getMinutes() - 1);
  tempStartTime.setMinutes(tempStartTime.getMinutes() - timeInterval);

  let yearEnd = tempEndTime.getFullYear();
  let monthEnd = String(tempEndTime.getMonth() + 1).padStart(2, '0');
  let dateEnd = String(tempEndTime.getDate()).padStart(2, '0');
  let hoursEnd = String(tempEndTime.getHours()).padStart(2, '0');
  let minutesEnd = String(tempEndTime.getMinutes()).padStart(2, '0');

  let yearStart = tempStartTime.getFullYear();
  let monthStart = String(tempStartTime.getMonth() + 1).padStart(2, '0');
  let dateStart = String(tempStartTime.getDate()).padStart(2, '0');
  let hoursStart = String(tempStartTime.getHours()).padStart(2, '0');
  let minutesStart = String(tempStartTime.getMinutes()).padStart(2, '0');

  return [
    `${yearEnd}-${monthEnd}-${dateEnd} ${hoursEnd}:${minutesEnd}`,
    `${yearStart}-${monthStart}-${dateStart} ${hoursStart}:${minutesStart}`,
  ];
};
