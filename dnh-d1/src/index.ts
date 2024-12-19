import { fromHono } from "chanfana";
import { Hono } from "hono";
import { jwt } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { IPFetch } from "endpoints/ipFetch";
import { DomainFetch } from "endpoints/domainFetch";
import { ASNFetch } from "endpoints/asnFetch";
import { PDNSFetch, PDNSFetchReverse } from "endpoints/pdnsFetch";
import { RateFetch } from "endpoints/rateFetch";

// Start a Hono app
// Setup JWT token middleware
// Specify the variable types to infer the `c.get('jwtPayload')`:
type Variables = JwtVariables
const app = new Hono<{ Variables: Variables }>()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
  })
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
	// https://chanfana.pages.dev/user-guide/security/?h=auth
	schema: {
		security: [
			{
				BearerAuth: [],
			}
		]
	}
});

// Register OpenAPI endpoints
// openapi.get("/api/tasks", TaskList);
// openapi.post("/api/tasks", TaskCreate);
// openapi.get("/api/tasks/:taskSlug", TaskFetch);
// openapi.delete("/api/tasks/:taskSlug", TaskDelete);

// https://chanfana.pages.dev/user-guide/security/?h=auth
openapi.registry.registerComponent(
	'securitySchemes',
	'BearerAuth',
	{
		type: 'http',
		scheme: 'bearer'
	}
)

openapi.get("/api/rate", RateFetch);
openapi.get("/api/domain/:domainName", DomainFetch);
openapi.get("/api/ip/:ipAddress", IPFetch);
openapi.get("/api/asn/:asnNumber", ASNFetch);
openapi.get("/api/pdns/:domainName", PDNSFetch);
openapi.get("/api/pdns/r/:ipAddress", PDNSFetchReverse);

// Export the Hono app
export default app;
