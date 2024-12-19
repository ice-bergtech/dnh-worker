import { DateTime, Str, Int } from "chanfana";
import { z } from "zod";

export const Task = z.object({
	name: Str({ example: "lorem" }),
	slug: Str(),
	description: Str({ required: false }),
	completed: z.boolean().default(false),
	due_date: DateTime(),
});

// https://datatracker.ietf.org/doc/html/draft-dulaunoy-dnsop-passive-dns-cof-13
// https://datatracker.ietf.org/doc/html/draft-dulaunoy-dnsop-passive-dns-cof-13#section-3.4.2
export const PassiveDNS = z.object({
	rrname: Str(),
	rrtype: Str(),
	rdata: z.array(Str()),
	time_first: DateTime(),
	time_last: DateTime(),
	count: Int(),
	bailiwick: Str() // Authoritative name server
})

export type PassiveDNS_t = z.infer<typeof PassiveDNS>

export const Network = z.object({
	cidr: Str(),
	asn: Str(),
	time_first: DateTime(),
	time_last: DateTime(),
	city: Str(),
	country: Str(),
	comment: Str(),
	ref: Str(),
	time_registered: DateTime(),
	time_updated: DateTime(),
})

export type Network_t = z.infer<typeof Network>


export const ASN = z.object({
	asn: Str(),
	city: Str(),
	country: Str(),
	name: Str(),
	time_registered: DateTime(),
	time_updated: DateTime(),
	comment: Str(),
	ref: Str(),
	networks: z.array(Network)
})

export type ASN_t = z.infer<typeof ASN>

export const Domain = z.object({
	name: Str(),
	time_first: DateTime(),
	time_last: DateTime(),
	records: z.array(PassiveDNS),
	ports: z.array(Int())
})

export type Domain_t = z.infer<typeof Domain>

export const IPAddress = z.object({
	ip: Str(),
	network: Network,
	asn: ASN 
})

export type IPAddress_t = z.infer<typeof IPAddress>

export const APIError = z.object({
	message: Str(),
	code: Int()
})

export type APIError_t = z.infer<typeof APIError>
