// This is a buffer payload, try decrypting it
/**
check encoded_sample.payload in consts
 */

import { decodeData } from "./wam/index.js";
import { read, readFileSync, writeFileSync } from "fs";
import { WAM_EVENTS, WAM_GLOBALS } from "./wam/utils.js";

const buf = Buffer.from(
	"V0FNBQGVAwAwCwiADQZNYWMgT1OAEREyLjMwMDAuMTAxMjAyNDM4MSAVUC8f7/FliCcBEENocm9tZSAxMjIuMC4wLjAYeQKICwMGQ2hyb21lKIMDOHkGBBhpDYiPDgl4MjU1NzY5MjeImREHMTAuMTUuNyhrGDirOAQ4wwICGO0zCGsDOagG/xIBEgISAxIEEgUSBhIHEggSCRIKEgsSDBINEg4SDxIQEhESEhITEhQSFVAvH+/xZShpDTmUB/+CAQR3YXdjIgISA1AvH+/xZThpDQI5sBL/IgEiAlAvJe/xZThpDQM5TgX/ggEOaW5pdGlhbC1hc3NldHMSAhIEQgNoE1AvJe/xZThpDQQ54AX/UgHOA3cAYgIA8OfzigAAAFAvL+/xZThpDQU50A3/ggISMDA1RTRBRDgxNzEwMzU0MjA3IgtCA3E+MgECUC8w7/FlOGkNBjnQDf+CAhIwMDVFNEFEODE3MTAzNTQyMDciC0IDJEMyAQMSB1AvMe/xZThpDQc50A3/ggISMDA1RTRBRDgxNzEwMzU0MjA3IgtCA5RDMgEEEgcyBBRQLzHv8WU4aQ0IOQID/yIBUC8x7/FlOGkNCTlWB/8yAQYSAhIFEgMSBhIEEgdQLzHv8WU4aQ0KOSgM/xIGEgkSBxIFEgoyARQSGxIdEgJCC6xYIg1SDB2XAABSA9CbAABSBECcAAASDlAvMe/xZThpDQs57hD/UgVPlq0TUgSh6wMAMgMGMgIIUC8x7/FlOGkNDDloBf+CAQVlMno3ZVIC+O7xZTIFElIDQ4ABACIGMgcGUC8x7/FlOGkNDTnsEP9SB0+WrRMyAhJSA0OAAQASATIECVIFH60DADIGAlAvMe/xZThpDQ45ggL/QhaMWEIXmlhCLFF1Qi1adYIqBE1BSU5SK5WdAABSLjGeAABCIhVYQgKeF0IDnhcSBBIFIgYyBwYyCAYyCQZCCnEOMgsGMgwGQg2UF0IODBlCD6oXQhAOGUIRDhlCEg4ZQhMVWEIUFVhCFRVYEh4iIBIhQhhidVIZHJcAAFIaHJcAAFIbQZwAADIcAhIfUihNnAAAIjVQLzHv8WU4aQ0PObAC/4IBUS9yc3JjLnBocC92My95bC9sLzAsY3Jvc3MvNmJKQlppUVdGeWIyN1pkNHY0eC1Idks2U2pqNVpQV1liLmNzcz9fbmNfeD1JajNXcDhsZzVLekICEQgSA1AvMe/xZThpDRA5sAL/ggEyL3JzcmMucGhwL3YzL3lGL3IvcDU1SGZYV19fbU0uanM/X25jX3g9SWozV3A4bGc1S3pCAm8BEgNQLzHv8WU4aQ0RObAC/4IBMi9yc3JjLnBocC92My95Ri9yL29mb3JzLUNqNUlxLmpzP19uY194PUlqM1dwOGxnNUt6QgIXDBIDUC8x7/FlOGkNEjmwAv+CATIvcnNyYy5waHAvdjMveTAvci9LYjQ2SXlhSnp2TS5qcz9fbmNfeD1JajNXcDhsZzVLekICjBASA1AvMe/xZThpDRM5sAL/ggF+L3JzcmMucGhwL3YzaUE4SDQveVUvbC9tYWtlaGFzdGVfamhhc2gvaUN5bmEwTWpCR1YxUEctVUgwYzlFUWU4dDc3TmdUUkNkRFFqSnhPSG9yUEp2c1dxZWhkRXRXd0RRVkVILWctRkRDLmpzP19uY194PUlqM1dwOGxnNUt6QgJTFBIDUC8x7/FlOGkNFDmwAv+CAYEvcnNyYy10cmFuc2xhdGlvbnMucGhwL3Y2aUE4SDQveVgvbC9lbl9VUy9pQ3luYTBNakJHVjFQRy1VSDBjOUVRZTh0NzdOZ1RSQ2REUWpKeE9Ib3JQSnZzV3FlaGRFdFd3RFFWRUgtZy1GREMuanM/X25jX3g9SWozV3A4bGc1S3pCApg8EgNQLzHv8WU4aQ0VObAC/4IBRy9yc3JjLnBocC92M2l4cHM0L3l5L2wvbWFrZWhhc3RlX2poYXNoLzNrbmxrUkFVVWpCLmpzP19uY194PUlqM1dwOGxnNUt6QgLqIhIDUC8x7/FlOGkNFjmwAv+CAUovcnNyYy10cmFuc2xhdGlvbnMucGhwL3Y2aXhwczQveUsvbC9lbl9VUy8za25sa1JBVVVqQi5qcz9fbmNfeD1JajNXcDhsZzVLekIClzwSA1AvMe/xZThpDRc5sAL/ggEyL3JzcmMucGhwL3YzL3lKL3IvNHJYU0ZpLVV2cnguanM/X25jX3g9SWozV3A4bGc1S3pCAp0cEgNQLzHv8WU4aQ0YObAC/4IBRy9yc3JjLnBocC92M2lGUzI0L3lIL2wvbWFrZWhhc3RlX2poYXNoLzRyOVpsTWxxN29jLmpzP19uY194PUlqM1dwOGxnNUt6QgKJJBIDUC8x7/FlOGkNGTmwAv+CAUovcnNyYy10cmFuc2xhdGlvbnMucGhwL3Y2aUZTMjQveV8vbC9lbl9VUy80cjlabE1scTdvYy5qcz9fbmNfeD1JajNXcDhsZzVLekIClzwSA1AvMe/xZThpDRo5sAL/ggFHL3JzcmMucGhwL3YzaVJkZzQveXkvbC9tYWtlaGFzdGVfamhhc2gvNnpNbXBOVG5GTFAuanM/X25jX3g9SWozV3A4bGc1S3pCAr8/EgNQLzHv8WU4aQ0bObAC/4IBSi9yc3JjLXRyYW5zbGF0aW9ucy5waHAvdjZpUmRnNC95Yy9sL2VuX1VTLzZ6TW1wTlRuRkxQLmpzP19uY194PUlqM1dwOGxnNUt6QgK/PBIDUC8x7/FlOGkNHDmwAv+CATIvcnNyYy5waHAvdjMveVgvci83ZTROTW1YMkIwbS5qcz9fbmNfeD1JajNXcDhsZzVLekICDCcSA1AvMe/xZThpDR05sAL/ggEML2tpbGxzd2l0Y2gvQgKnARIDUC8x7/FlOGkNHjmwAv+CATIvcnNyYy5waHAvdjMveXkvci8wVmZaUDMtaXU2bi5qcz9fbmNfeD1JajNXcDhsZzVLekICZAMSA1AvMe/xZThpDR85sAL/ggFHL3JzcmMucGhwL3YzaVNEOTQveXQvbC9tYWtlaGFzdGVfamhhc2gvMnNQLWZyUFhxODkuanM/X25jX3g9SWozV3A4bGc1S3pCAlcEEgNQLzHv8WU4aQ0gObAC/4IBMi9yc3JjLnBocC92My95TS9yL0ZQbE5ndVh5QjllLmpzP19uY194PUlqM1dwOGxnNUt6QgLgDBIDUC8x7/FlOGkNITmwAv+CAUcvcnNyYy5waHAvdjNpSUJjNC95NC9sL21ha2VoYXN0ZV9qaGFzaC82dXVpNVYxa2FpWS5qcz9fbmNfeD1JajNXcDhsZzVLekICER0SA1AvMe/xZThpDSI5sAL/ggFHL3JzcmMucGhwL3YzaWxuSDQveVIvbC9tYWtlaGFzdGVfamhhc2gvRkpacnd4ZnRadTIuanM/X25jX3g9SWozV3A4bGc1S3pCAsIYEgNQLzHv8WU4aQ0jObAC/4IBRy9yc3JjLnBocC92M2lIQjc0L3luL2wvbWFrZWhhc3RlX2poYXNoL1oxdmxSN0R2VEpILmpzP19uY194PUlqM1dwOGxnNUt6QgLwBBIDUC8x7/FlOGkNJDmwAv+CAUcvcnNyYy5waHAvdjNpTzNPNC95ZC9sL21ha2VoYXN0ZV9qaGFzaC9fRHc1Ym9Sc1VIZS5qcz9fbmNfeD1JajNXcDhsZzVLekICLxYSA1AvMe/xZThpDSU5sAL/ggE7L3JzcmMucGhwL3YzL3lWL2wvMCxjcm9zcy9FaU0xV2hLeVZWNy5jc3M/X25jX3g9SWozV3A4bGc1S3pCAlsDEgNQLzHv8WU4aQ0mObAC/4IBMi9yc3JjLnBocC92My95VS9yL0RkUWJVcFNINTJVLmpzP19uY194PUlqM1dwOGxnNUt6QgKUERIDUC8x7/FlOGkNJzmwAv+CAUcvcnNyYy5waHAvdjNpbzAzNC95dS9sL21ha2VoYXN0ZV9qaGFzaC8wd3JXbjdvaVE5Ny5qcz9fbmNfeD1JajNXcDhsZzVLekICrxESA1AvMe/xZThpDSg5sAL/ggEyL3JzcmMucGhwL3YzL3lUL3IvQkNFUE1WZ3JER2MuanM/X25jX3g9SWozV3A4bGc1S3pCAukREgNQLzHv8WU4aQ0pObAC/4IBRy9yc3JjLnBocC92M2k2OGE0L3lWL2wvbWFrZWhhc3RlX2poYXNoL0V1TDBERWJoN1VNLmpzP19uY194PUlqM1dwOGxnNUt6QgIoEhIDUC8x7/FlOGkNKjmwAv+CAUcvcnNyYy5waHAvdjNpUFM0NC95eS9sL21ha2VoYXN0ZV9qaGFzaC90WHRCN016RjBiTC5qcz9fbmNfeD1JajNXcDhsZzVLekIC5BgSA1AvMe/xZThpDSs5sAL/ggE7L3JzcmMucGhwL3YzL3l1L2wvMCxjcm9zcy9uRGJUa3FsdkdQUC5jc3M/X25jX3g9SWozV3A4bGc1S3pCAl8DEgNQLzHv8WU4aQ0sObAC/4IBMi9yc3JjLnBocC92My95Si9yL3p0VWdhZ3VwRGxPLmpzP19uY194PUlqM1dwOGxnNUt6QgKNExIDUC8x7/FlOGkNLTmwAv+CASEvcnNyYy5waHAvdjMveVAvci9yWVpxUENCYUc3MC5wbmdCAicBEgNQLzHv8WU4aQ0uObAC/4IBjy9zdGF0aWNfcmVzb3VyY2VzL3dlYndvcmtlcl92MS9pbml0X3NjcmlwdC8/X19ocz0xOTc5NS5IWVAlM0F3aGF0c2FwcF9jb21ldF9wa2cuMi4xLi4wLjEmX19zcGluX3I9MTAxMjAyNDM4MSZfX3NwaW5fYj10cnVuayZfX3NwaW5fdD0xNzEwMzU0MTkxQgIKARIDUC8x7/FlOGkNLzmwAv+CAUcvcnNyYy5waHAvdjNpVHZ5NC95SS9sL21ha2VoYXN0ZV9qaGFzaC94NjhaRFpMSlFLMi5qcz9fbmNfeD1JajNXcDhsZzVLekICxw8SA1AvMe/xZThpDTA57hD/UgVPlq0TUgSViQQAMgMIMgIGUC857/FlOGkNMTnuEP9SBU+WrRNSBLSoBAAyAwYyAgg=",
	"base64"
);
writeFileSync("./test.payload", buf);
const { header, data } = decodeData(buf);
console.log(header, data);
