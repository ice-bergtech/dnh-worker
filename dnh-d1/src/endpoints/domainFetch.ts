import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { APIError, Domain, Task } from "../types";

export class DomainFetch extends OpenAPIRoute {
	schema = {
		tags: ["ip", "domain"],
		summary: "Get information about a domain name",
		request: {
			params: z.object({
				domainName: Str({ description: "Domain Name" }),
			}),
		},
		responses: {
			"200": {
				description: "Returns information about a domain",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: z.boolean(),
								data: Domain,
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
		const { domainName } = data.params;

		// Implement your own object fetch here
		try{
			const {results: domain} = await c.env.DB.prepare("SELECT * FROM domain WHERE name = ?").bind(domainName).all();
			return Response.json({
				data: domain
			});

		} catch (error) {
		// @ts-ignore: check if the object exists
			return Response.json({
				success: false,
				errors: [{
					message: "Domain not found",
					code: 404,
				}],
			});
		}
	}
}
