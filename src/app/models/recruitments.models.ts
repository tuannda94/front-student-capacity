import { Capacity } from "./capacity";
import { Contest } from "./contest";
import { Enterprise } from "./enterprise.model";
import { Skill } from "./skill.models";
import { User } from "./user";

export class Recruitments {
    id: number;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    hot: number;
    image: string;
    user: Array<User>;
    skill: Array<Skill>;
    contest: Array<Capacity>;
    enterprise: Array<Enterprise>;
    short_description: string;
    count_user: number;
    contest_count: number;
    rounds_count: number;
    user_wishlist: boolean;
}
