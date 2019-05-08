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
            console.log('results limited by name: ')
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
      console.log('results limited by page number: ')
      console.log(result)
    })

}

paginatedProducts(3)

function getItemsFromDate(daysAgo) {
  knexInstance
    .select('*')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .then(result => {
      console.log('These are the results from limited dates: ')
      console.log(result)
    })
}

getItemsFromDate(5)

function getSumOfCategories() {
  knexInstance
    .select('category')
    .from('shopping_list')
    .sum('price')
    .groupBy('category')
    .then(result => {
      console.log('Items grouped by category: ')
      console.log(result)
    })
}

getSumOfCategories();