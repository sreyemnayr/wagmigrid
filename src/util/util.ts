export function shuffle(a: any[], b: any = undefined, c: any = undefined, d: any = undefined) {//array,placeholder,placeholder,placeholder
    c = a.length; while (c) b = Math.random() * c-- | 0, d = a[c], a[c] = a[b], a[b] = d
}