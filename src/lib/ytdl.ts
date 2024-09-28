export const youtubeRe = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/m;

export function isValidYTUrl(url: string): boolean {
    return youtubeRe.test(url);
}

export function getYTVideoId(url: string): string {
    const match = youtubeRe.exec(url);
    if (match)
        return match[5];
    return "";
}
