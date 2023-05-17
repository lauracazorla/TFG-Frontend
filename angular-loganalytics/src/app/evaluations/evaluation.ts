export class Evaluation { //añadir id
    name: string;
    subject: string;
    team: string;
    date: string;
    value: number;
    groupable: boolean;
    entities: Map<string,number>; //crear pair para nombre e id
                                //Nombre de metrica (?)
}
