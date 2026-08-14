import { getSiteConfig } from "./site-config"

export async function getSiteName(): Promise<string> {
  return (await getSiteConfig()).siteName
}
