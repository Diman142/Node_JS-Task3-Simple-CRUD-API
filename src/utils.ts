import { NewUserType, User } from "./types"
import {v4 as uuidv4} from "uuid";

const regexExpForUUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

export const getUserById = (users: User[], userId: string): User | undefined => 
	users.find(u => u.id === userId) ;

export const instanceOfNewUser = (object: Record<any, unknown>): object is NewUserType => 
    'username' in object && 'age' in object && 'hobbies' in object;

export const addIdForNewUser = (newUser: NewUserType): User => ({
	id: uuidv4(),
	...newUser
});

export const isUserIdValid = (id: string): boolean => {
	const res = id.match(regexExpForUUID);
	if(res === null || id.length !== 36) {
		return false;
	}
	return true;
}
	
export const getUrlForWorker = (workerId: number, url: string):string => 
	`localhost:400${workerId}${url}`