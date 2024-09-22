// place files you want to import through the `$lib` alias in this folder.
export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
export const capitalizeFirstLetterOfEachWord = (str: string): string => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
}
export const formatCurrency = (data: number|null|undefined) => {
    return data?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })?.split(',')?.at(0) ?? 'Rp 0'
}

export const formatDay = (date: Date) => {
    return date.toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
}

export const formatTime = (date: Date) => {
    return date.toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric', timeZoneName: 'short' }).replace('.', ':')
}

export const formatNumberUnit = (num: number) => {
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(1).split('.').at(0)}B`; // Billions
    } else if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1).split('.').at(0)}M`; // Millions
    } else if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1).split('.').at(0)}K`; // Thousands
    } else {
        return num.toString(); // Less than 1,000, no formatting
    }
}

export const generateSecureRandomId = () => {
    return 'id-' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
}

