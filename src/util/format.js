export function formatPrice(val) {
    if (!val) return '';
    return `${(val / 100).toFixed(2)}`;
}