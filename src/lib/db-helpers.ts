export async function safeDbQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query()
  } catch (error) {
    console.warn("Database query failed, using fallback:", error)
    return fallback
  }
}
