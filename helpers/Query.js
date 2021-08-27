const pg = require('pg');
require('dotenv').config();
const dotenv = require('dotenv');
const fs = require('fs');
const sqlconnect = require('@model/db');

class QueryGenerator {
    #columns

    #params

    #returning

    #client

    #whereParams

    #whereColumns

    #orderBy

    #result

    #query

    constructor() {
        this.#query = '';
        this.#columns = '';
        this.#params = '';
        this.#result = {
            error: {
                transaction: false,
                commit: false,
                rollback: false,
                params: false,
            },
            data: false,
        };
    }

    #SetClient = () => {
        dotenv.config();

        this.#client = new pg.Client({
            ...sqlconnect.sqlconnect,
        });
    }

    Insert(_table, _columnsValues, _returning) {
        this.#SetClient();
        this.#result = {
            error: {
                transaction: false,
                commit: false,
                rollback: false,
                params: false,
            },
            data: false,
        };
        const table = _table;
        const columnsValues = _columnsValues;
        const returning = _returning;

        if (
            columnsValues instanceof Object
            && !(columnsValues instanceof Array)
        ) {
            const start = Date.now();
            const columns = Object.keys(columnsValues);
            this.#columns = columns.join(', ');
            const params = [];
            const values = [];

            for (let i = 0; i < columns.length; i++) {
                params.push(`$${i + 1}`);
            }

            columns.forEach((column) => {
                values.push(columnsValues[column]);
            });

            this.#params = params.join(', ');

            if (returning) {
                if (Array.isArray(returning)) {
                    this.#returning = returning.join(', ');
                } else {
                    throw new Error('Returning must be an array');
                }
            }

            const result = this.#client
                .connect()
                .then(() => this.#client.query('BEGIN;'))
                .then(() => this.#client.query(
                    `INSERT INTO ${table} (${this.#columns}) VALUES (${
                        this.#params
                    }) ${returning ? `RETURNING ${this.#returning}` : ''}`,
                    values,
                ))
                .then(async (result) => {
                    this.#result.data = result.rows;

                    await this.#client
                        .query('COMMIT')
                        .then(() => console.log('COMMIT SUCCESSFUL'))
                        .catch((err) => (this.#result.error.commit = err));
                    return this.#result;
                })
                .catch(async (err) => {
                    this.#result.error.transaction = err.message;
                    await this.#client
                        .query('ROLLBACK')
                        .then(() => console.log('ERROR, ROLLBACK'))
                        .catch(() => (this.#result.error.rollback = true));
                    return this.#result;
                })
                .finally(() => {
                    this.#client.end();
                    const duration = Date.now() - start;
                    fs.appendFileSync(
                        './logs/queries_log.log',
                        `executed query: { INSERT INTO ${table} (${
                            this.#columns
                        }) VALUES (${this.#params}) ${
                            returning ? `RETURNING ${this.#returning}` : ''
                        }, params: ${values}; duration: ${duration}ms }\n`,
                    );
                    this.#columns = '';
                    this.#params = '';
                    this.#returning = '';
                    this.#whereParams = '';
                    this.#whereColumns = '';
                    this.#orderBy = '';
                });

            return result;
        }
        this.#result.error.params = 'Columns and values must be arrays';
        return this.#result;
    }

    Select(_table, _columns, _whereColumnsValues, _logicalOperators, _orderBy) {
        this.#SetClient();
        this.#result = {
            error: {
                transaction: false,
                commit: false,
                rollback: false,
                params: false,
            },
            data: false,
        };
        const start = Date.now();
        const table = _table;
        const columns = _columns;
        const whereColumnsValues = _whereColumnsValues;
        const logicalOperators = _logicalOperators;
        const whereColumns = [];
        const values = [];
        const orderBy = _orderBy;

        if (Array.isArray(columns)) {
            this.#columns = columns.join(', ');

            let param = 1;

            if (
                whereColumnsValues instanceof Object
                && !(whereColumnsValues instanceof Array)
                && Array.isArray(logicalOperators)
            ) {
                whereColumns.push(...Object.keys(whereColumnsValues));
                this.#whereColumns = whereColumns.join(', ');
                const whereParams = [];

                if (whereColumns.length !== 0) {
                    whereColumns.forEach((_column, _index) => {
                        const regex = /=$|!=$|>$|>=$|<$|<=$|between$|not between$|like$|is$|is not$|not like$|in$|not in$/i;

                        const { operator } = whereColumnsValues[_column];
                        const isValidOperator = regex.test(operator);

                        if (isValidOperator) {
                            if (
                                operator.toLowerCase() === 'like'
                                || operator.toLowerCase() === 'not like'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} '%'||$${param}||'%' ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                values.push(whereColumnsValues[_column].value);
                                param++;
                            } else if (
                                operator.toLowerCase() === 'between'
                                || operator.toLowerCase() === 'not between'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} $${param} AND $${
                                        param + 1
                                    } ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                values.push(
                                    whereColumnsValues[_column].value[0],
                                    whereColumnsValues[_column].value[1],
                                );
                                param += 2;
                            } else if (
                                operator.toLowerCase() === 'is'
                                || operator.toLowerCase() === 'is not'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} ${
                                        whereColumnsValues[_column].value
                                    } ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                // values.push(whereColumnsValues[_column].value);
                                param++;
                            } else if (
                                operator.toLowerCase() === 'in'
                                || operator.toLowerCase() === 'not in'
                            ) {
                                let inValues = null;

                                whereColumnsValues[_column].value.forEach(
                                    (_value, _index) => {
                                        if (_index === 0) {
                                            inValues = `(${whereColumnsValues[_column].value[_index]}`;
                                        } else {
                                            inValues += `, ${whereColumnsValues[_column].value[_index]}`;
                                        }

                                        if (
                                            _index
                                            === whereColumnsValues[_column].value
                                                .length
                                                - 1
                                        ) {
                                            inValues += ')';
                                        }
                                    },
                                );

                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} ${inValues} ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                            } else {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} $${param} ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                values.push(whereColumnsValues[_column].value);
                                param++;
                            }
                        } else {
                            this.#result.error.params = 'Invalid operator on WHERE params';
                            return this.#result;
                        }
                    });
                    this.#whereParams = whereParams.join(' ');
                }
            }

            if (orderBy) {
                if (Array.isArray(orderBy)) {
                    this.#orderBy = orderBy.join(', ');
                }
            }

            const result = this.#client
                .connect()
                .then(() => this.#client.query(
                    `SELECT ${this.#columns} FROM ${table} ${
                        whereColumns.length !== 0
                            ? `WHERE ${this.#whereParams}`
                            : ''
                    } ${orderBy ? `ORDER BY ${this.#orderBy}` : ''}`,
                    values,
                ))
                .then((result) => {
                    this.#result.data = result.rows;
                    return this.#result;
                })
                .catch((err) => (this.#result.transaction = err.message))
                .finally(() => {
                    this.#client.end();
                    const duration = Date.now() - start;
                    fs.appendFileSync(
                        './logs/queries_log.log',
                        `executed query: { SELECT ${
                            this.#columns
                        } FROM ${table} ${
                            whereColumns.length !== 0
                                ? `WHERE ${this.#whereParams}`
                                : ''
                        } ${
                            orderBy ? `ORDER BY ${this.#orderBy}` : ''
                        }, params: ${values}; duration: ${duration}ms }\n`,
                    );
                    this.#columns = '';
                    this.#params = '';
                    this.#returning = '';
                    this.#whereParams = '';
                    this.#whereColumns = '';
                    this.#orderBy = '';
                });
            return result;
        }
        this.#result.error.params = 'Columns, values and logical operators must be arrays';
        return this.#result;
    }

    Update(
        _table,
        _columnsValues,
        _returning,
        _whereColumnsValues,
        _logicalOperators,
    ) {
        this.#SetClient();
        this.#result = {
            error: {
                transaction: false,
                commit: false,
                rollback: false,
                params: false,
            },
            data: false,
        };
        const table = _table;
        const values = [];
        const columnsValues = _columnsValues;
        const columns = [];
        const returning = _returning;
        const whereColumnsValues = _whereColumnsValues;
        const whereColumns = [];
        const logicalOperators = _logicalOperators;

        if (
            columnsValues instanceof Object
            && !(columnsValues instanceof Array)
        ) {
            columns.push(...Object.keys(columnsValues));
            this.#columns = columns.join(', ');
            const params = [];

            let param = 1;
            const start = Date.now();

            columns.forEach((_column) => {
                params.push(`${_column} = $${param}`);
                values.push(columnsValues[_column]);
                param++;
            });

            this.#params = params.join(', ');

            if (returning) {
                if (Array.isArray(returning)) {
                    this.#returning = returning.join(', ');
                } else {
                    this.#result.error.params = 'Returning must be an array';
                    return this.#result;
                }
            }

            if (
                whereColumnsValues instanceof Object
                && !(whereColumnsValues instanceof Array)
                && Array.isArray(logicalOperators)
            ) {
                whereColumns.push(...Object.keys(whereColumnsValues));
                this.#whereColumns = whereColumns.join(', ');
                const whereParams = [];

                if (whereColumns.length !== 0) {
                    whereColumns.forEach((_column, _index) => {
                        const regex = /=$|!=$|>$|>=$|<$|<=$|between$|not between$|like$|is$|is not$|not like$/i;

                        const { operator } = whereColumnsValues[_column];
                        const isValidOperator = regex.test(operator);

                        if (isValidOperator) {
                            if (
                                operator.toLowerCase() === 'like'
                                || operator.toLowerCase() === 'not like'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} '%'||$${param}||'%' `,
                                );
                                values.push(whereColumnsValues[_column].value);
                                param++;
                            } else if (
                                operator.toLowerCase() === 'between'
                                || operator.toLowerCase() === 'not between'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} $${param} AND $${
                                        param + 1
                                    } ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                values.push(
                                    whereColumnsValues[_column].value[0],
                                    whereColumnsValues[_column].value[1],
                                );
                                param += 2;
                            } else if (
                                operator.toLowerCase() === 'is'
                                || operator.toLowerCase() === 'is not'
                            ) {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} ${
                                        whereColumnsValues[_column].value
                                    } ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                // values.push(whereColumnsValues[_column].value);
                                param++;
                            } else {
                                whereParams.push(
                                    `${_column} ${operator.toUpperCase()} $${param} ${
                                        logicalOperators[_index]
                                            ? logicalOperators[_index]
                                            : ''
                                    }`,
                                );
                                values.push(whereColumnsValues[_column].value);
                                param++;
                            }
                        } else {
                            this.#result.error.params = 'Invalid operator on WHERE params';
                            return this.#result;
                        }
                    });

                    this.#whereParams = whereParams.join(' ');
                }
            }

            const result = this.#client
                .connect()
                .then(() => this.#client.query('BEGIN;'))
                .then(() => this.#client.query(
                    `UPDATE ${table} SET ${this.#params} ${
                        whereColumns ? `WHERE ${this.#whereParams}` : ''
                    } ${returning ? `RETURNING ${this.#returning}` : ''}`,
                    values,
                ))
                .then(async (result) => {
                    this.#result.data = result.rows;
                    await this.#client
                        .query('COMMIT;')
                        .then(() => console.log('COMMIT SUCCESSFUL'))
                        .catch((err) => (this.#result.error.commit = err));

                    return this.#result;
                })
                .catch(async (err) => {
                    this.#result.error.transaction = err.message;

                    await this.#client
                        .query('ROLLBACK;')
                        .then(() => console.log('ERROR, ROLLBACK'))
                        .catch(() => (this.#result.error.rollback = true));

                    return this.#result;
                })
                .finally(() => {
                    this.#client.end();
                    const duration = Date.now() - start;
                    fs.appendFileSync(
                        './logs/queries_log.log',
                        `executed query: { UPDATE ${table} SET ${this.params} ${
                            whereColumns ? `WHERE ${this.#whereParams}` : ''
                        } ${
                            returning ? `RETURNING ${this.#returning}` : ''
                        }, params: ${values}; duration: ${duration}ms }\n`,
                    );
                    this.#columns = '';
                    this.#params = '';
                    this.#returning = '';
                    this.#whereParams = '';
                    this.#whereColumns = '';
                    this.#orderBy = '';
                });

            return result;
        }
        this.#result.error.params = 'Columns and values must be arrays';
        return this.#result;
    }

    InsertSale(_table, _columnsValues, _returning, _allow) {
        this.#SetClient();
        this.#result = {
            error: {
                transaction: false,
                commit: false,
                rollback: false,
                params: false,
            },
            data: false,
        };
        const table = _table;
        const columnsValues = _columnsValues;
        const returning = _returning;
        const allowcommit = _allow;

        if (allowcommit === true) {
            this.#client.connect().then(() => this.#client.query('COMMIT;'))
                .then(() => true);
        }

        if (
            columnsValues instanceof Object
            && !(columnsValues instanceof Array)
        ) {
            const start = Date.now();
            const columns = Object.keys(columnsValues);
            this.#columns = columns.join(', ');
            const params = [];
            const values = [];

            for (let i = 0; i < columns.length; i++) {
                params.push(`$${i + 1}`);
            }

            columns.forEach((column) => {
                values.push(columnsValues[column]);
            });

            this.#params = params.join(', ');

            if (returning) {
                if (Array.isArray(returning)) {
                    this.#returning = returning.join(', ');
                } else {
                    throw new Error('Returning must be an array');
                }
            }

            const result = this.#client
                .connect()
                .then(() => this.#client.query('BEGIN;'))
                .then(() => this.#client.query(
                    `INSERT INTO ${table} (${this.#columns}) VALUES (${
                        this.#params
                    }) ${returning ? `RETURNING ${this.#returning}` : ''}`,
                    values,
                ))
                .then(async (result) => {
                    this.#result.data = result.rows;

                    return this.#result;
                })
                .catch(async (err) => {
                    this.#result.error.transaction = err.message;
                    await this.#client
                        .query('ROLLBACK')
                        .then(() => {
                            console.log('ERROR, ROLLBACK');
                            console.log(err);
                        })
                        .catch(() => (this.#result.error.rollback = true));
                    return this.#result;
                })
                .finally(() => {
                    this.#client.end();
                    const duration = Date.now() - start;
                    fs.appendFileSync(
                        './logs/queries_log.log',
                        `executed query: { INSERT INTO ${table} (${
                            this.#columns
                        }) VALUES (${this.#params}) ${
                            returning ? `RETURNING ${this.#returning}` : ''
                        }, params: ${values}; duration: ${duration}ms }\n`,
                    );
                    this.#columns = '';
                    this.#params = '';
                    this.#returning = '';
                    this.#whereParams = '';
                    this.#whereColumns = '';
                    this.#orderBy = '';
                });

            return result;
        }
        this.#result.error.params = 'Columns and values must be arrays';
        return this.#result;
    }
}

const Query = new QueryGenerator();
module.exports = Query;
