export default {
  formatTime(time) {
    const min = Math.floor(time / 60) || 0;
    const sec = Math.round(time - min * 60 || 0);

    return `${min}:${sec < 10 ? 0 : ""}${sec}`;
  },
};
