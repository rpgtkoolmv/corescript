
declare interface Number {
    /**
     * Returns a number whose value is limited to the given range.
     * 
     * @method Number.prototype.clamp
     * @param {number} min The lower boundary
     * @param {number} max The upper boundary
     * @returns {number} A number in the range (min, max)
     * 
     * @memberOf Number
     */

    clamp(min: number, max: number): number;
    /**
     * Returns a modulo value wich is always positive.
     *
     * @method Number.prototype.mod 
     * @param {number} n The divisor
     * @returns {number} A modulo value
     * 
     * @memberOf Number
     */
    mod(n: number): number;

    /**
     * Makes a number string with leading zeros.
     * 
     * @param {number} length The  length of the output string
     * @returns {string} A string with leading zeros
     * 
     * @memberOf Number
     */
    padZero(length: number): string;
}

declare interface String {
    /**
     * Replaces %1, %2 and so on in the string to the arguments.
     * 
     * @method String.prototype.format
     * @param {any} args The objects to format 
     * @returns {string} A formatted string 
     * 
     * @memberOf String
     */
    format(...args): string;

    /**
     * Make a number string with leading zeros
     * 
     * @method String.prototype.padZero
     * @param {Number} length The length of the output string
     * @returns {String} A string with leading zeros
     */
    padZero(length: number): string;
}