exports.handler = async function (event,context) {
  return {
    statusCode:200,
    body: JSON.stringify({
      name:'Helopy',
      age:43,
      email:'wef@thekary.com'
    })
  }
}