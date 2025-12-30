// Run this script to initialize the database
// Usage: node run_init_sql.js YOUR_DATABASE_URL

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.argv[2];

if (!DATABASE_URL) {
    console.log('\n❌ Please provide DATABASE_URL as argument!\n');
    console.log('Usage: node run_init_sql.js "postgresql://user:pass@host:port/db"\n');
    console.log('Get the DATABASE_URL from Railway:');
    console.log('1. Click on PostgreSQL service');
    console.log('2. Click "Connect" button');
    console.log('3. Copy Public Network Connection URL');
    process.exit(1);
}

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function runInit() {
    console.log('\n🚀 Connecting to database...');
    
    try {
        const sqlPath = path.join(__dirname, 'database', 'init.sql');
        let sql = fs.readFileSync(sqlPath, 'utf8');
        
        // Remove GRANT statements that reference raymond_admin (Railway uses postgres user)
        sql = sql.replace(/GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO raymond_admin;/g, '-- Skipped: GRANT for raymond_admin');
        sql = sql.replace(/GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO raymond_admin;/g, '-- Skipped: GRANT for raymond_admin');
        sql = sql.replace(/GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO raymond_admin;/g, '-- Skipped: GRANT for raymond_admin');
        
        console.log('📄 Running init.sql...\n');
        
        await pool.query(sql);
        
        console.log('✅ Database initialized successfully!\n');
        console.log('Default login credentials:');
        console.log('  Email: admin@raymond.com');
        console.log('  Password: Admin@123\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

runInit();
