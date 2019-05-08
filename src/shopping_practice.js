require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function nameSearch(searchTerm){
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%` )
        .then(result => {
            console.log(result)
        })
}

nameSearch('ham')

function paginatedProducts(pageNumber){
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber - 1)
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then( result => {
      console.log(result)
    })

}

paginatedProducts(3)