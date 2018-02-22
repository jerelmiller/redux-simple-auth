export default ({ access_token: accessToken }, header) => {
  if (accessToken) {
    header('Authorization', `Bearer ${accessToken}`)
  }
}
