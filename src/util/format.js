export function formatPrice(val) {
    if (!val) return '0';
    return `${(val / 100).toFixed(2)}`;
}