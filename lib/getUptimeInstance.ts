export const getUptime = (launchTime: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - launchTime.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
        return `${diffDays}d ${diffHours}h ${diffMinutes}m`;
    }