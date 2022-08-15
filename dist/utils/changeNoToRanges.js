"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changeNoToRanges = (arr) => {
    if (arr.length === 12)
        return "cały rok";
    if (arr.length === 0)
        return "niedostępne";
    const miesiace = [
        "styczeń",
        "luty",
        "marzec",
        "kwiecień",
        "maj",
        "czerwiec",
        "lipiec",
        "sierpień",
        "wrzesień",
        "październik",
        "listopad",
        "grudzień",
    ];
    const nArr = arr.map((el, i) => miesiace[el - 1]);
    let str = nArr.reduce((previousValue, currentValue, i, array) => {
        return arr[i - 1] === arr[i] - 1
            ? previousValue + "-" + currentValue
            : previousValue + ", " + currentValue;
    }, "");
    str = str.replace(",", ""); //replace first ,
    //console.log(str);
    str = str.replace(/(?<=-)(\w|[ąćęłńóśźż])+-/g, ""); //replace numbers between two -
    return str;
};
exports.default = changeNoToRanges;
