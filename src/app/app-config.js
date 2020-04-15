export const appConfig = {
    'data_table_width': '70',
    'sort': {
        'enableSorting': true,
        'sortableFields': ['name', 'age', 'subjects', 'rating', 'joineddate', 'salary']
    },
    'fields_to_include': ['name', 'age', 'subjects', 'rating', 'joineddate', 'salary'],
    'enableEditing': true,
    'filtering': {
        'enableFiltering': true,
        'fieldstofilter': ['name', 'age', 'subjects', 'rating', 'joineddate', 'salary']
    },
    'pagination': {
        'defaultNoofPages': 25,
        'listOfPages': [5, 10, 25, 50, 100]
    },
    'includeSearch': true,
}