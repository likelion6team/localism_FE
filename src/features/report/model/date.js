
export function toKoreaDateObject(createdRaw) {
  let date;
  if (createdRaw) {
    date = new Date(createdRaw.replace(/\.\d+$/, ""));
  } else {
    date = new Date();
  }
  const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  return {
    y: koreaDate.getFullYear(),
    m: String(koreaDate.getMonth() + 1).padStart(2, "0"),
    d: String(koreaDate.getDate()).padStart(2, "0"),
    h: String(koreaDate.getHours()).padStart(2, "0"),
    min: String(koreaDate.getMinutes()).padStart(2, "0"),
    s: String(koreaDate.getSeconds()).padStart(2, "0"),
  };
}
export function toKoreaDateObject(createdRaw) {
  let date;
  if (createdRaw) {
    date = new Date(createdRaw.replace(/\.\d+$/, ""));
  } else {
    date = new Date();
  }
  const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  return {
    y: koreaDate.getFullYear(),
    m: String(koreaDate.getMonth() + 1).padStart(2, "0"),
    d: String(koreaDate.getDate()).padStart(2, "0"),
    h: String(koreaDate.getHours()).padStart(2, "0"),
    min: String(koreaDate.getMinutes()).padStart(2, "0"),
    s: String(koreaDate.getSeconds()).padStart(2, "0"),
  };
}
