import { fromHono } from "chanfana";
import { Hono } from "hono";
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
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);


openapi.get("/api/rate", RateFetch);
openapi.get("/api/domain/:domainName", DomainFetch);
openapi.get("/api/ip/:ipAddress", IPFetch);
openapi.get("/api/asn/:asnNumber", ASNFetch);
openapi.get("/api/pdns/:domainName", PDNSFetch);
openapi.get("/api/pdns/r/:ipAddress", PDNSFetchReverse);

// Export the Hono app
export default app;
