export const loginUser = async (data: {
  email: string
  password: string
}) => {
  // replace with real API later
  await new Promise((res) => setTimeout(res, 1000))

  return {
    token: "fake-token",
    user: { email: data.email },
  }
}