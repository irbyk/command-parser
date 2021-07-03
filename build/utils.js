"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTexte = exports.getRandomIntInclusive = void 0;
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomIntInclusive = getRandomIntInclusive;
async function sendTexte(texte, message) {
    if (texte.length > 2000) {
        const buf = Buffer.from(texte, 'utf8');
        return await message.channel.send('', { files: [{ attachment: buf, name: 'texte.txt' }] });
    }
    else {
        return await message.channel.send(texte);
    }
}
exports.sendTexte = sendTexte;
//# sourceMappingURL=utils.js.map