require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})
// const qry = knexInstance.from('amazong_products')
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .where({ name: 'Point of view gun' })
//     .first()
//     // .then(result => {
//     //     console.log(result)
//     // })
//     .toQuery()
// console.log(qry)

function searchByProductName(searchTerm) {
    knexInstance
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .where('name', 'Ilike', `%${searchTerm}%`)
        .then(results => {
            console.log(results)
        })
}

searchByProductName('holo')

function paginateProducts(page) {
    const productsPerPage = 10;
    const offset = productsPerPage * (page - 1)
    knexInstance
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .limit(productsPerPage)
        .offset(offset)
        .then(results => {
            console.log(`This is the number ${page} page of products: `)
            console.log(results)
        })
}

paginateProducts(1)

function getProductsWithImages() {
    knexInstance
        .select('product_id', 'name', 'price', 'category', 'image')
        .from('amazong_products')
        .whereNotNull('image')
        .then(result => {
            console.log('This is the list of products with images: ')
            console.log(result)
        })
}

getProductsWithImages()

function mostPopularVideosForDays(days) {
    knexInstance
        .select('video_name', 'region')
        .count('date_viewed AS views')
        .where(
            'date_viewed',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
        )
        .from('whopipe_video_views')
        .groupBy('video_name', 'region')
        .orderBy([
            { column: 'region', order: 'ASC' },
            { column: 'views', order: 'DESC' },
        ])
        .then(result => {
            console.log(result)
        })
}

mostPopularVideosForDays(30)

console.log('connection successful');