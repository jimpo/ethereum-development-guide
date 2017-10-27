export function breakDownTimeInterval(seconds) {
  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;

  const days = Math.floor(seconds / secondsInDay);
  seconds = seconds % secondsInDay;
  const hours = Math.floor(seconds / secondsInHour);
  seconds = seconds % secondsInHour;
  const minutes = Math.floor(seconds / secondsInMinute);
  seconds = seconds % secondsInMinute;

  return {days, hours, minutes, seconds};
}

export function formatCountdown(remainingTime) {
  let {hours, minutes, seconds} = breakDownTimeInterval(remainingTime);
  let hoursStr = hours.toString().padStart(2, '0');
  let minutesStr = minutes.toString().padStart(2, '0');
  let secondsStr = seconds.toString().padStart(2, '0');
  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

export function hueForCountdown(remainingTime, totalTime) {
  if (remainingTime > totalTime) {
    throw Error("remainingTime must not be greater than totalTime");
  } else if (remainingTime === totalTime) {
    remainingTime--;
  }

  const tiers = [0, 15, 30, 45, 60, 75, 120, 165, 195, 225, 250, 270];
  return tiers[Math.floor(remainingTime * tiers.length / totalTime)];
}
