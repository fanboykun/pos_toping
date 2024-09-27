import { createCanvas } from "canvas";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createGradientAvatar = (document: Document|undefined = undefined) => {
    const getRandomColor = () => {
        const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "cyan", "magenta"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Create a canvas with node-canvas
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 100, 100);
    gradient.addColorStop(1, getRandomColor());
    gradient.addColorStop(0.5, getRandomColor());
    gradient.addColorStop(0, getRandomColor());

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 100);

    // Convert the canvas to a base64-encoded data URL
    return canvas.toDataURL();
    
}

export const getFistCharFromName = (name: string|undefined) => {
    const defaultChar = 'AK'
    if(name == undefined) return defaultChar
    try {
        const splitted = name.split(' ')
        const first = splitted.at(0)?.charAt(0).toUpperCase()
        const second = splitted.at(1)?.charAt(0).toUpperCase()
        if(splitted.length >= 2) return `${first}${second}`
        return first
    } catch(err) {
        console.log(err)
        return defaultChar
    }
}


