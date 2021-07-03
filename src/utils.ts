import Discord from 'discord.js';

// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export function getRandomIntInclusive(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min +1)) + min;
}

export async function sendTexte(texte: string, message: Discord.Message): Promise<Discord.Message> {
	if(texte.length > 2000) {
		const buf = Buffer.from(texte, 'utf8');
		return await message.channel.send('', {files: [{attachment: buf, name: 'texte.txt'}]});
	} else {
		return await message.channel.send(texte);
	}
}
