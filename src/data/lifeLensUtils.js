export const categoryIcons = {
  Music: "🎵",
  Movie: "🎬",
  Place: "📍",
  Purchase: "🛍️",
  Photo: "📸",
  Message: "💬",
  Search: "🔎",
  Event: "🎟️",
  "Personal Note": "📝",
};

export const categoryColors = {
  Music: "#9b8cff",
  Movie: "#ff7eb6",
  Place: "#4dd0e1",
  Purchase: "#ffd166",
  Photo: "#ff9f68",
  Message: "#7ee787",
  Search: "#70a1ff",
  Event: "#c084fc",
  "Personal Note": "#f59e0b",
};

export function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes));

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function groupByDate(items) {
  return items.reduce((groups, item) => {
    if (!groups[item.date]) {
      groups[item.date] = [];
    }

    groups[item.date].push(item);

    return groups;
  }, {});
}

export function getMinutes(time) {
  if (!time) return 0;

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

export function getTimeDifference(time1, time2) {
  return Math.abs(
    getMinutes(time1) - getMinutes(time2)
  );
}

export function findConnections(items) {
  const connections = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const first = items[i];
      const second = items[j];

      if (first.date !== second.date) {
        continue;
      }

      const sameLocation =
        first.location &&
        second.location &&
        first.location.toLowerCase() ===
          second.location.toLowerCase();

      const closeInTime =
        getTimeDifference(first.time, second.time) <= 90;

      if (sameLocation && closeInTime) {
        connections.push({
          id: `${first.id}-${second.id}`,
          items: [first, second],
          reason: "Same place and close in time",
        });
      }
    }
  }

  return connections;
}