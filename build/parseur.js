"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parseur = exports.TypeArgument = void 0;
const utils_1 = require("./utils");
var TypeArgument;
(function (TypeArgument) {
    TypeArgument["NUMBER"] = "number";
    TypeArgument["STRING"] = "string";
})(TypeArgument = exports.TypeArgument || (exports.TypeArgument = {}));
class Parseur {
    constructor(caractereAppel) {
        this.listeCommandes = new Map();
        this.caractereAppel = caractereAppel;
    }
    valide(texte) {
        return texte.startsWith(this.caractereAppel);
    }
    addCommande(command) {
        this.listeCommandes.set(command.nom, command);
    }
    async parser(message) {
        const canal = message.channel.id;
        const pseudo = message.author.username;
        const id = message.author.id;
        const valide = this.valide(message.content);
        // console.log(`Message ${valide ? 'valide' : 'non valide'} reçu de ${pseudo}:${id} via ${canal} = ${message.content}`)
        if (!valide) {
            return {
                commande: '',
                arguments: [],
                pseudo: pseudo,
                id: id,
                canal: canal,
                valide: false
            };
        }
        const texte = message.content.slice(this.caractereAppel.length);
        const liste = extraireArguments(texte);
        let nomCommande = liste[0];
        if (nomCommande === '?') {
            utils_1.sendTexte(await this.getAides(), message);
            return {
                commande: '?',
                arguments: {},
                pseudo: pseudo,
                id: id,
                canal: canal,
                valide: true
            };
        }
        if (nomCommande.startsWith('?')) {
            nomCommande = nomCommande.slice(1);
            const commande = this.listeCommandes.get(nomCommande);
            if (commande === undefined) {
                message.reply(`La commande ${nomCommande} n'est pas une commande valide. Tape ${this.caractereAppel}? pour avoir la liste des commandes.`);
                return {
                    commande: '',
                    arguments: liste,
                    pseudo: pseudo,
                    id: id,
                    canal: canal,
                    valide: false
                };
            }
            if (commande.aide !== undefined) {
                commande.aide(message);
            }
            else {
                const texte = getCommandeAide(commande) +
                    (commande.description !== undefined ? `\n\n${commande.description}` : '');
                utils_1.sendTexte(texte, message);
            }
            return {
                commande: '?',
                arguments: liste,
                pseudo: pseudo,
                id: id,
                canal: canal,
                valide: valide
            };
        }
        const commande = this.listeCommandes.get(nomCommande);
        if (commande === undefined) {
            message.reply(`La commande ${nomCommande} n'est pas une commande valide. Tape ${this.caractereAppel}? pour avoir la liste des commandes.`);
            return {
                commande: '',
                arguments: liste,
                pseudo: pseudo,
                id: id,
                canal: canal,
                valide: false
            };
        }
        const nombreArgument = commande.arguments === undefined ? 0 : Object.keys(commande.arguments).length;
        if (nombreArgument + 1 === liste.length) {
            const args = liste.slice(-nombreArgument);
            try {
                const commmandeParsee = {
                    commande: nomCommande,
                    arguments: validerArgument(args, commande.arguments),
                    pseudo: pseudo,
                    id: id,
                    canal: canal,
                    valide: true
                };
                await commande.handler(commmandeParsee, message);
                return commmandeParsee;
            }
            catch (err) {
                throw err;
            }
        }
        else {
            message.reply(`Il ne faut que ${nombreArgument} argument${(nombreArgument > 1 ? 's' : '')} pour la commande "${nomCommande}"\nTape ${this.caractereAppel}?${nomCommande} pour avoir plus d'info sur la commande.`);
            return {
                commande: nomCommande,
                arguments: liste.slice(-2),
                pseudo: pseudo,
                id: id,
                canal: canal,
                valide: false
            };
        }
    }
    async getAides() {
        let texte = '';
        for (const [_, commande] of this.listeCommandes) {
            texte += getCommandeAide(commande);
            texte += '\n';
        }
        return texte;
    }
}
exports.Parseur = Parseur;
function extraireArguments(texte) {
    const liste = texte.split(' ');
    let resultat = [];
    let dansString = false;
    let argument = '';
    for (const s of liste) {
        if (dansString) {
            if (s.endsWith('"')) {
                dansString = false;
                argument += ' ' + s.slice(0, s.length - 1);
                resultat.push(argument);
            }
            else {
                argument += ' ' + s;
            }
        }
        else {
            if (s.startsWith('"')) {
                if (s.endsWith('"')) {
                    argument = s.slice(1, s.length - 1);
                    resultat.push(argument);
                }
                else {
                    dansString = true;
                    argument = s.slice(1);
                }
            }
            else {
                resultat.push(s);
            }
        }
    }
    console.log(resultat.toLocaleString());
    return resultat;
}
function validerArgument(args, types) {
    if (types === undefined) {
        return args;
    }
    let cles = Object.keys(types);
    let resultat = {};
    console.log(cles.toLocaleString());
    for (const i in args) {
        switch (types[cles[i]]) {
            case TypeArgument.NUMBER:
                {
                    const valeur = Number(args[i]);
                    if (isNaN(valeur)) {
                        throw new Error(`${args[i]} n'est pas un nombre valide.`);
                    }
                    resultat[cles[i]] = valeur;
                }
                ;
                break;
            case TypeArgument.STRING: {
                resultat[cles[i]] = args[i];
            }
        }
    }
    console.dir(resultat);
    return resultat;
}
function getCommandeAide(commande) {
    let texte = `${commande.nom}`;
    if (commande.arguments !== undefined) {
        for (const arg in commande.arguments) {
            texte += ` <${arg} : ${commande.arguments[arg]}>`;
        }
    }
    return texte;
}
//# sourceMappingURL=parseur.js.map