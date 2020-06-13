const request = require("supertest");
const redis = require("redis");
const redisMock = require("redis-mock");

const { app } = require("../index");
const { closeInstnace } = require("../redis-fetch");

jest.spyOn(redis, "createClient").mockImplementation(redisMock.createClient);

afterAll(() => {
    closeInstnace();
})

describe("post bid", () => {
	it("should create new auction if budget is sufficent", async () => {
		const res = await request(app).post("/api/bid").send({
			auction_id: 10,
			campaign_id: 1,
			price: 1,
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty("didBid");
		expect(res.body.didBid).toEqual(true);
	});
});
