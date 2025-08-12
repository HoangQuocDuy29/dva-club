// recreate-admin.ts
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { UserProfile } from '../src/entities/user-profile.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface AdminUserData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

class AdminRecreator {
  private dataSource: DataSource;

  constructor() {
  this.dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || process.env.DB_USERNAME,
    password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME || process.env.DB_DATABASE,
    entities: [User, UserProfile],
    synchronize: false,
    logging: false,
  });
}

  async recreateAdminUser(): Promise<void> {
    console.log('🔄 Recreating admin user with TypeScript...');

    try {
      // 1. Connect to database
      await this.dataSource.initialize();
      console.log('✅ Database connected');

      // 2. Define admin user data
      const adminData: AdminUserData = {
        email: 'quocduyhoang42@gmail.com',
        username: 'admin',
        firstName: 'DVA',
        lastName: 'Club',
        password: '123456',
        role: 'admin'
      };

      // 3. Generate password hash
      const saltRounds: number = 12;
      const hashedPassword: string = await bcrypt.hash(adminData.password, saltRounds);
      
      console.log('Password:', adminData.password);
      console.log('Generated hash:', hashedPassword);

      // 4. Test hash validity immediately
      const isHashValid: boolean = await bcrypt.compare(adminData.password, hashedPassword);
      console.log('Hash validation test:', isHashValid ? '✅ VALID' : '❌ INVALID');

      if (!isHashValid) {
        throw new Error('Generated hash is invalid!');
      }

      // 5. Get repositories
      const userRepository = this.dataSource.getRepository(User);
      const profileRepository = this.dataSource.getRepository(UserProfile);

      // 6. Check if admin already exists
      const existingAdmin = await userRepository.findOne({
        where: { email: adminData.email }
      });

      if (existingAdmin) {
        console.log('👤 Admin user already exists, updating password...');
        
        // Update existing user's password
        await userRepository.update(
          { email: adminData.email },
          { 
            passwordHash: hashedPassword,
            isActive: true,
            updatedAt: new Date()
          }
        );
        console.log('✅ Admin password updated successfully');
      } else {
        console.log('👤 Creating new admin user...');
        
        // Create new admin user
        const newAdmin = userRepository.create({
          email: adminData.email,
          username: adminData.username,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          passwordHash: hashedPassword,
          role: adminData.role,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        const savedAdmin = await userRepository.save(newAdmin);
        console.log('✅ Admin user created with ID:', savedAdmin.id);

        // Create admin profile
        const adminProfile = profileRepository.create({
          userId: savedAdmin.id,
          bio: 'System Administrator for Volleyball Club Management',
          createdAt: new Date(),
          updatedAt: new Date()
        });

        await profileRepository.save(adminProfile);
        console.log('✅ Admin profile created');
      }

      // 7. Generate SQL statement for manual update (backup option)
      console.log('\n--- MANUAL SQL UPDATE (if needed) ---');
      console.log(`UPDATE tbl_users`);
      console.log(`SET password_hash = '${hashedPassword}',`);
      console.log(`    is_active = true,`);
      console.log(`    updated_at = NOW()`);
      console.log(`WHERE email = '${adminData.email}';`);

      // 8. Final verification
      const updatedAdmin = await userRepository.findOne({
        where: { email: adminData.email },
        relations: ['profile']
      });

      if (updatedAdmin) {
        const finalTest = await bcrypt.compare(adminData.password, updatedAdmin.passwordHash);
        console.log('\n--- FINAL VERIFICATION ---');
        console.log('Admin email:', updatedAdmin.email);
        console.log('Admin active:', updatedAdmin.isActive);
        console.log('Password hash test:', finalTest ? '✅ VALID' : '❌ INVALID');
        console.log('Profile exists:', !!updatedAdmin.profile);
      }

      console.log('\n🎉 Admin user recreation completed!');
      console.log('You can now login with:');
      console.log(`Email: ${adminData.email}`);
      console.log(`Password: ${adminData.password}`);

    } catch (error) {
      console.error('❌ Error recreating admin user:', error);
      throw error;
    } finally {
      // 9. Close database connection
      await this.dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }

  // Additional method to test login after recreation
  async testLogin(): Promise<boolean> {
    try {
      await this.dataSource.initialize();
      
      const userRepository = this.dataSource.getRepository(User);
      const admin = await userRepository.findOne({
        where: { email: 'admin@volleyball.com' }
      });

      if (admin) {
        const isValid = await bcrypt.compare('Admin123!', admin.passwordHash);
        console.log('Login test result:', isValid ? '✅ SUCCESS' : '❌ FAILED');
        return isValid;
      }

      return false;
    } catch (error) {
      console.error('Login test error:', error);
      return false;
    } finally {
      await this.dataSource.destroy();
    }
  }
}

// Main execution function
async function main(): Promise<void> {
  const recreator = new AdminRecreator();
  
  try {
    await recreator.recreateAdminUser();
    
    // Optional: Test login immediately
    console.log('\n--- TESTING LOGIN ---');
    await recreator.testLogin();
    
  } catch (error) {
    console.error('Script execution failed:', error);
    process.exit(1);
  }
}

// Execute if this file is run directly
if (require.main === module) {
  main().catch(console.error);
}

export { AdminRecreator };
