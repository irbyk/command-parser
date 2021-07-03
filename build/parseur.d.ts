import { Message } from 'discord.js';
interface ArgumentsCommande {
    [key: string]: TypeArgument;
}
interface Commande {
    nom: string;
    arguments?: ArgumentsCommande;
    handler: (commande: CommandeParsee, message: Message) => Promise<void>;
    aide?: (message: Message) => Promise<void>;
    description?: string;
}
interface CommandeParsee {
    commande: string;
    arguments: Arguments;
    pseudo: string;
    id: string;
    canal: string;
    valide: boolean;
}
export declare enum TypeArgument {
    NUMBER = "number",
    STRING = "string"
}
export declare class Parseur {
    private listeCommandes;
    private caractereAppel;
    constructor(caractereAppel: string);
    private valide;
    addCommande(command: Commande): void;
    parser(message: Message): Promise<CommandeParsee>;
    getAides(): Promise<string>;
}
interface Arguments {
    [key: string]: any;
}
export {};
//# sourceMappingURL=parseur.d.ts.map