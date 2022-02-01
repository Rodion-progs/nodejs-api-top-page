import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from  '../src/app.module';
import { Types, disconnect } from 'mongoose';
import { WRONG_PASSWORD_ERROR, USER_NOT_FOUND_ERROR } from '../src/auth/auth.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const loginDto: AuthDto = {
	login: 'gdsg@mail.ru',
	password: "12345337"
}

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;
	
	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		
		app = moduleFixture.createNestApplication();
		await app.init();
		
	});
	
	it('/auth/login (POST) - success', () => {
		return request(app.getHttpServer())
		.post('/auth/login')
		.send(loginDto)
		.expect(200)
		.then(({ body }: request.Response) => {
			expect(body.access_token).toBeDefined();
		});
	});
	
	it('/auth/login (POST) - fail', () => {
		return request(app.getHttpServer())
		.post('/auth/login')
		.send({ ...loginDto, password: "gsgsh"})
		.expect(401, {
			statusCode: 401,
			message: WRONG_PASSWORD_ERROR,
			error: "Unauthorized"
		})
	});
	
	it('/auth/login (POST) - fail', () => {
		return request(app.getHttpServer())
		.post('/auth/login')
		.send({ ...loginDto, login: 'gdgs'})
		.expect(401, {
			statusCode: 401,
			message: USER_NOT_FOUND_ERROR,
			error: "Unauthorized"
		})
	});
	
	
	
	afterAll(() => {
		disconnect()
	})
});
