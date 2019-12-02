export function formatPrice(val: number, precision: number = 2): number {
    if (!val) return 0;
    val = Number(val) || 0;
    const radix = Math.pow(10, precision);
    return Math.round(val) / radix;
}

export function formatRMB(value: string | number | undefined) {
    return `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}