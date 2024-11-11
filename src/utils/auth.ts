export const getAuthHeaders = (token: string) => ({
  "Authorization": `Token ${token}`,
  "Content-Type": "application/json",
});
