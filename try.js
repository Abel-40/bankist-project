const date = new Date();
const options = {
  day: '2-digit',
  month: 'long',
  year: '2-digit',
  weekday: 'short',
  timeZoneName: 'long',
};
const formatter = new Intl.DateTimeFormat('en-gb', options);

console.log(formatter.format(date));
