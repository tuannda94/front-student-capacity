import { Team } from "./team";
import { User } from "./user";

export class ResultRound {
    id: number;
    point : number;
    round_id: number;
    team: {
        name: string;
        image: string;
        users: Array<User>;
    }
}
