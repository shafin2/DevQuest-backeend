import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '../../.env') });

const cleanDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const collections = await mongoose.connection.db.collections();
    
    console.log('\n🗑️  Cleaning database...\n');
    
    for (let collection of collections) {
      const count = await collection.countDocuments();
      await collection.deleteMany({});
      console.log(`✅ Deleted ${count} documents from ${collection.collectionName}`);
    }

    console.log('\n✨ Database cleaned successfully!');
    console.log('\n📝 You can now start fresh with:');
    console.log('   1. Register new users');
    console.log('   2. Create projects');
    console.log('   3. Add tasks');
    console.log('   4. Earn XP!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  }
};

cleanDatabase();
