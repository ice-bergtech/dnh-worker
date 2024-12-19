import { APIError, IPAddress_t, Task } from "../types";
export interface Env {
    // If you set another name in wrangler.toml as the value for 'binding',
    // replace "DB" with the variable name you defined.
    DB: D1Database;
}

export class db {
    async fetch(ip, env): Promise<IPAddress_t> {
        const { pathname } = new URL(request.url);

        // If you did not use `DB` as your binding name, change it here
        const { results } = await env.DB.prepare(
            "SELECT * FROM Customers WHERE CompanyName = ?",
        )
            .bind("Bs Beverages")
            .all();
        return Response.json(results);
    },
} satisfies ExportedHandler<Env>;

