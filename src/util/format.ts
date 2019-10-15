export function formatPrice(val: number): number {
    if (!val) return 0;
    return +`${(val / 100).toFixed(2)}`;
}

export function formatRMB(value: string | number | undefined) {
    return `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}