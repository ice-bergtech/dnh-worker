import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { APIError, IPAddress, APIError_t, Task } from "../types";

export class ASNFetch extends OpenAPIRoute {
	schema = {
		tags: ["ip", "network"],
		summary: "Get information about an ip address",
		request: {
			params: z.object({
				ipAddress: Str({ description: "IP address" }),
			}),
		},
		responses: {
			"200": {
				description: "Returns a single IP address if found",
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
		// Get validated data
		const data = await this.getValidatedData<typeof this.schema>();

		// Retrieve the validated slug
		const { ipAddress } = data.params;

		// Implement your own object fetch here
		try{
			const {results: ipAddr} = await c.env.DB.prepare("SELECT * FROM ip WHERE ip = ?").bind(ipAddress).all();
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
