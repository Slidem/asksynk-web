import { oidcSpa } from "oidc-spa/react-spa";
import { z } from "zod";

const decodedIdTokenSchema = z.object({
  sub: z.string(),
  email: z.string().optional(),
  preferred_username: z.string().optional(),
  name: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
});

export const {
  bootstrapOidc,
  useOidc,
  getOidc,
  OidcInitializationGate,
  enforceLogin,
  withLoginEnforced,
} = oidcSpa
  .withExpectedDecodedIdTokenShape({ decodedIdTokenSchema })
  .createUtils();

export type DecodedIdToken = z.infer<typeof decodedIdTokenSchema>;

export function getOidcConfig() {
  return {
    implementation: "real" as const,
    issuerUri: `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}`,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  };
}
