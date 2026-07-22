export function serializeListing(listing: any) {
  if (!listing) return listing
  return JSON.parse(JSON.stringify(listing, (key, value) => {
    if (typeof value === 'object' && value !== null && 'toNumber' in value && typeof value.toNumber === 'function') {
      return value.toNumber()
    }
    return value
  }))
}

export function serializeListings(listings: any[]) {
  return listings.map(serializeListing)
}
