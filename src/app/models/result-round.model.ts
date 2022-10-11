import { Team } from "./team";
import { User } from "./user";

export class ResultRound {
    id: number;
    point: number;
    team: Team;
    image: string;
    name: string;
    result: {
        point: number;
    };
    members: Array<User>
}
