export const getEndOfUUIDV4 = (id: string) => {
  return id.split("-")[4];
}