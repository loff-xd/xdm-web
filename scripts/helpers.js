Array.prototype.remove = function(index) { // INCREASE READABILITY FOR ARRAYS
    this.splice(index, 1);
}

export function compareBySSCC(a, b){
    if (a.lastFour < b.lastFour) return -1;
    if (a.lastFour > b.lastFour) return 1;
    return 0;
}