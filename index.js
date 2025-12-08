const mysql = require('mysql2/promise');

const defaultDbPrefix = 'env_check_db_';

function resolveDatabaseName() {
    if (process.env.MYSQL_DATABASE && process.env.MYSQL_DATABASE.trim() !== '') {
        return process.env.MYSQL_DATABASE.trim();
    }
    return `${defaultDbPrefix}${Date.now().toString(36)}`;
}

async function main() {
    const config = {
        host: process.env.MYSQL_HOST || 'db',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        multipleStatements: false
    };

    const databaseName = resolveDatabaseName();
    const tableName = `env_check_${Date.now().toString(36)}`;

    let connection;
    let databaseReady = false;
    let tableReady = false;

    try {
        connection = await mysql.createConnection(config);
        console.log(`Connected to MySQL at ${config.host}:${config.port} as ${config.user}`);

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
        databaseReady = true;
        console.log(`Database ${databaseName} is ready.`);

        await connection.query(`USE \`${databaseName}\``);
        await connection.query(
            `CREATE TABLE \`${tableName}\` (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        label VARCHAR(255) NOT NULL,
        note VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
        );
        tableReady = true;
        console.log(`Table ${tableName} created.`);

        const sampleRows = [
            ['alpha', 'First probe row'],
            ['beta', 'Second probe row']
        ];

        for (const [label, note] of sampleRows) {
            await connection.execute(
                `INSERT INTO \`${tableName}\` (label, note) VALUES (?, ?)`,
                [label, note]
            );
        }
        console.log(`Inserted ${sampleRows.length} rows.`);

        const [rows] = await connection.query(
            `SELECT id, label, note, created_at FROM \`${tableName}\` ORDER BY id ASC`
        );

        console.log('Rows read from MySQL:');
        for (const row of rows) {
            console.log(row);
        }
    } catch (error) {
        console.error('Verification failed:', error.message);
        console.error(error);
        process.exitCode = 1;
    } finally {
        if (connection) {
            try {
                if (tableReady) {
                    await connection.query(
                        `DROP TABLE IF EXISTS \`${databaseName}\`.\`${tableName}\``
                    );
                    console.log(`Dropped table ${databaseName}.${tableName}.`);
                }

                if (databaseReady) {
                    await connection.query(`DROP DATABASE IF EXISTS \`${databaseName}\``);
                    console.log(`Dropped database ${databaseName}.`);
                }
            } catch (cleanupError) {
                console.error('Cleanup failed:', cleanupError.message);
            } finally {
                await connection.end();
            }
        }
    }
}

main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
