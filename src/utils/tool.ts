const addCommasToNumber = (number) => {
    if (number === null || number === undefined || number === 0) return '0';
    const [integerPart, decimalPart] = number.toFixed(2).split('.');
    return `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimalPart}`;
}
export {
    addCommasToNumber
}
