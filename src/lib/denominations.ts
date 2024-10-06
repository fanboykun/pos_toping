// Denominations in rupiah
const denominations = [1000, 2000, 5000, 10000, 20000, 50000, 75000, 100000];

// Helper function to round up to the nearest suggestion
const roundToNearest = (amount: number) => {
    for (let i = 0; i < denominations.length; i++) {
    if (denominations[i] >= amount) {
        return denominations[i];
    }
    }
    return denominations[denominations.length - 1]; // return highest denomination if none match
};

// Helper function to add custom rounding like 25000 or 40000
const getCustomSuggestions = (amount: number) => {
    const roundedUp = Math.ceil(amount / 1000) * 1000; // Round to nearest 1000
    return [roundedUp, roundToNearest(amount)];
};

// Main function to suggest payment amounts
export const suggestPaymentAmounts = (charge: number) => {
    if(charge == 0) return [0]
    const suggestions = new Set<number>();

    // Include original charge
    suggestions.add(roundToNearestThousand(charge));

    // Include exact denominations that are greater or equal to the charge
    denominations.forEach(denom => {
        if (denom >= charge) {
        suggestions.add(denom);
        }
    });

    // Add custom rounded suggestions
    getCustomSuggestions(charge).forEach(suggestion => suggestions.add(suggestion));

    // Convert to array and sort in ascending order
    return Array.from(suggestions).sort((a, b) => a - b);
};

export const roundToNearestThousand = (amount: number): number => {
    return Math.ceil(amount / 1000) * 1000;
}

