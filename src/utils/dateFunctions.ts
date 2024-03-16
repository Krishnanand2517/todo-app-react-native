const getMonthIndex = (month: string) => {
  const months = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sept: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  const monthIndex = months[month];
  if (monthIndex === undefined) {
    throw new Error('Invalid month name');
  }
  return monthIndex;
};

export const toIsoDateTime = (dateString: string, timeString: string) => {
  // Parse the date string
  const dateParts = dateString.split(' ');
  if (dateParts.length !== 3) {
    throw new Error('Invalid date format. Expected format: DD Month YYYY');
  }
  const day = parseInt(dateParts[0], 10);
  const month = dateParts[1].toLowerCase();
  const year = parseInt(dateParts[2], 10);

  // Parse the time string
  let hours;
  let minutes;

  if (timeString) {
    const timeParts = timeString.split(':');
    if (timeParts.length !== 2) {
      throw new Error('Invalid time format. Expected format: HH:mm');
    }
    hours = parseInt(timeParts[0], 10);
    minutes = parseInt(timeParts[1], 10);

    // Handle Meridiem (AM/PM)
    const meridiem = timeString.slice(-2).toLowerCase();
    if (meridiem === 'pm' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'am' && hours === 12) {
      hours = 0;
    } else if (meridiem !== 'am' && meridiem !== 'pm') {
      throw new Error(
        'Invalid time format. Missing or invalid meridiem (AM/PM)',
      );
    }
  } else {
    hours = 0;
    minutes = 0;
  }

  // Create and format the ISO 8601 DateTime
  const date = new Date(year, getMonthIndex(month), day, hours, minutes);
  return date.toISOString();
};
