import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { APIError, IPAddress, APIError_t, Task } from "../types";

export class RateFetch extends OpenAPIRoute {
	schema = {
		tags: ["ip", "network"],
		summary: "Get information about current rate limit",
		operationId: "rateFetch",
		responses: {
			"200": {
				description: "Returns current rate-limit stats for the passed token",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: z.boolean(),
								data: IPAddress,
								meta: z.object({}),
							}),
						}),
					},
				},
			},
			"404": {
				description: "Resource not found",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: z.boolean(),
								errors: z.array(APIError),
							}),
						}),
					},
				},
			},
		},
	};

	async handle(c) {
		// Implement your own object fetch here
		try{
			const {results: ipAddr} = await c.GET('jwtPayload');
			return Response.json({
				data: ipAddr
			});

		} catch (error) {
		// @ts-ignore: check if the object exists
			return Response.json({
				success: false,
				errors: [{
					message: "IP address not found",
					code: 404,
				}],
			});
		}
	}
}
