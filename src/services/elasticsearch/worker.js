import client from './client.js'

const indexUser = async(document) => {
  const indexingDocuments = [
    client.indexDocument("users", document.id, document)
  ]

  try{
    return await Promise.all(indexingDocuments)
  }catch(e){
    console.log(e)
  }
}

export const indexDocument = async ({ type, document }) => {

  const indexMapping = {
    user_update: indexUser,
    user_create: indexUser
  }

  if(indexMapping[type]) return await indexMapping[type];

}
