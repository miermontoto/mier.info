export function randElement(col) {
    return col.at([Math.floor(Math.random() * col.length)]);
}

export function randArray(col) {
    for (let i = col.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [col[i], col[j]] = [col[j], col[i]];
    }
    return col;
}
