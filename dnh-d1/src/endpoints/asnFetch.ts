import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { APIError, IPAddress, APIError_t, Task, ASN } from "../types";

export class ASNFetch extends OpenAPIRoute {
	schema = {
		tags: ["network"],
		summary: "Get information about an ASN address",
		request: {
			params: z.object({
				asnNumber: Str({ description: "AS Number" }),
			}),
		},
		responses: {
			"200": {
				description: "Returns information about an ASN",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: z.boolean(),
								data: ASN,
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
		const { asnNumber } = data.params;

		// Implement your own object fetch here
		try{
			const {results: asInfo} = await c.env.DB.prepare("SELECT * FROM asn WHERE asn = ?").bind(asnNumber).all();
			return Response.json({
				data: asInfo
			});
		} catch (error) {
		// @ts-ignore: check if the object exists
			return Response.json({
				success: false,
				errors: [{
					message: "ASN info not found",
					code: 404,
				}],
			});
		}
	}
}
