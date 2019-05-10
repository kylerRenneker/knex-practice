const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping list service object`, function() {
    let db
    let testItems = [
        {
            id: 1,
            name: 'cream corn',
            price: 2.50,
            date_added: new Date(),
            checked: false,
            category: breakfast

        },
        {
            id: 2,
            name: 'hot dogs',
            price: 4.50,
            date_added: new Date(),
            checked: true,
            category: snack

        },
        {
            id: 3,
            name: 'Apple pie',
            price: 12.00,
            date_added: new Date(),
            checked: true,
            category: main

        },
    ] 

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db 
                .into('shopping_list')
                .insert(testItems)
        })
        it(`getAllItems() resolves all items from 'shopping_list`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems.map(item => ({
                        ...item,
                        date_added: new Date(item.date_added)
                    })))
                })
        })
        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const secondId = 2
            const secondTestItem = testItems[second - 1]
            return ShoppingListService.getById(db, secondId)
            .then(actual => {
                expect(actual).to.eql({
                    id: secondId,
                    name: secondTestItem.name,
                    price: secondTestItem.price,
                    date_added: secondTestItem.date_added,
                    checked: secondTestItem.checked,
                    category: secondTestItem.category
                })
            })
        })
        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 2
            return ShoppingListService.deleteItem(db, itemId)
            .then(() => ShoppingListService.getAllItems(db))
            .then(items => {
                const expected = testItems.filter(item => item.id !== itemId)
                expect(items).to.eql(expected)
            })
        })
        it(`updateItem() updates an item from 'shopping_list' table`, () => {
            const idOfItemToUpdate = 2
            const newItemData = {
                name: 'updated name',
                price: 'updated price',
                date_added: new Date(),
                checked: 'false',
                category: 'updated category'
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                    id: secondId,
                    ...newItemData
                    })
                })
        })
    })
    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Test new name',
                price: 'Test new price',
                date_added: new Date(),
                checked: 'true',
                category: 'Test new category'
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: new Date(newItem.date_added),
                        checked: newItem.checked,
                        category: newItem.category
                    })
                })
        })
    })
})