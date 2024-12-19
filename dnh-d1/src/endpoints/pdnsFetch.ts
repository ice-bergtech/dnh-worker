import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { APIError, IPAddress, APIError_t, Task, PassiveDNS } from "../types";

export class PDNSFetch extends OpenAPIRoute {
	schema = {
		tags: ["ip", "network"],
		summary: "Get passive DNS records for an domain name",
		request: {
			params: z.object({
				domainName: Str({ description: "Domain Name" }),
			}),
			headers: z.object({
				Authorization: Str()
			})
		},
		responses: {
			"200": {
				description: "Returns list of passive DNS entries",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: z.boolean(),
								data: z.array(PassiveDNS),
								meta: z.object({}),
							}),
						}),
					},
				},
			},
			"404": {
				description: "Records for domain not found",
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
			const {results: pdnsRecords} = await c.env.DB.prepare("SELECT * FROM pdns WHERE rrname = ?").bind(domainName).all();
			return Response.json({
				data: pdnsRecords
			});

		} catch (error) {
		// @ts-ignore: check if the object exists
			return Response.json({
				success: false,
				errors: [{
					message: "Records for domain not found",
					code: 404,
				}],
			});
		}
	}
}

export class PDNSFetchReverse extends OpenAPIRoute {
	schema = {
		tags: ["ip", "network"],
		summary: "Get passive Reverse DNS records for an IP address",
		request: {
			params: z.object({
				ipAddress: Str({ description: "IP address" }),
			}),
		},
		responses: {
			"200": {
				description: "Returns a list of passive DNS records for an IP address",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: z.boolean(),
								data: z.array(PassiveDNS),
								meta: z.object({}),
							}),
						}),
					},
				},
			},
			"404": {
				description: "Records for address not found",
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
			const {results: pdnsRecords} = await c.env.DB.prepare("SELECT * FROM pdns WHERE rrname = ?").bind(ipAddress).all();
			return Response.json({
				data: pdnsRecords
			});

		} catch (error) {
		// @ts-ignore: check if the object exists
			return Response.json({
				success: false,
				errors: [{
					message: "Records for address not found",
					code: 404,
				}],
			});
		}
	}
}