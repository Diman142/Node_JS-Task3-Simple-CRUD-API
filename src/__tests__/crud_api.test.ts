import request from 'supertest';
import {app, server} from '../index';

const mockUser = {
	username: "Petya",
	age: 33,
	hobbies: [
		"running"
	]
}

const updatedUser = {
	username: "Vasya",
	age: 22,
	hobbies: [
		"swiming"
	]
}

describe('simple CRUD', () => {
	it('should return empty array and status 200', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toEqual(200);
		expect(res.body).toEqual([]);
	})

	it('should add user in db', async () => {
		const res = await request(app)
		.post('/api/users')
		.send(mockUser);
		expect(res.body.username).toEqual("Petya");
		expect(res.body.age).toEqual(33);
		expect(res.body.hobbies).toEqual([
			"running"
		]);
		expect(res.status).toEqual(201);

		const resForGet = await request(app).get('/api/users');
        expect(resForGet.status).toEqual(200);
		expect(resForGet.body.length).toEqual(1);
	})

	it('should return user by id', async () => {
		const resForGet = await request(app).get('/api/users');
        expect(resForGet.status).toEqual(200);
		expect(resForGet.body.length).toEqual(1);

		const firstUserFromDb = resForGet.body[0];
		const res = await request(app).get(`/api/users/${firstUserFromDb.id}`);
		expect(res.status).toEqual(200);
		expect(res.body).toEqual(firstUserFromDb);
	})

	it('should update user in db', async () => {
		const resForGet = await request(app).get('/api/users');
        expect(resForGet.status).toEqual(200);
		expect(resForGet.body.length).toEqual(1);

		const oldUser = resForGet.body[0];
		const res = await request(app)
		.put( `/api/users/${oldUser.id}`)
		.send(updatedUser)
		.expect(200);

		const getUpdatedUser = await request(app)
		.get( `/api/users/${res.body.id}`)
		.expect(200);
		expect(getUpdatedUser.body.username).toEqual("Vasya");
		expect(getUpdatedUser.body.age).toEqual(22);
		expect(getUpdatedUser.body.hobbies).toEqual([
			"swiming"
		]);
	})

	it('should delete user from db', async () => {
		const resForGet = await request(app).get('/api/users');
        expect(resForGet.status).toEqual(200);
		expect(resForGet.body.length).not.toEqual(0);

		const removedUserId = resForGet.body[0].id;
		await request(app)
		.delete( `/api/users/${removedUserId}`)
		.expect(204);

		const res = await request(app).get(`/api/users/${removedUserId}`);
		expect(res.status).toEqual(404);
	})

	server.close();
})
