import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Role } from '../databases/mysql-database/model/role.model';
import { UserRole } from '../databases/mysql-database/model/user-role.model';
import { User } from '../databases/mysql-database/model/user.model';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('Starting data initialization...');

    // 1. Check/Create SUPERADMIN role
    let superAdminRole = await Role.findOne({
      where: { role_key: 'SUPERADMIN' },
    });

    if (!superAdminRole) {
      console.log('Creating SUPERADMIN role...');
      superAdminRole = await Role.create({
        role_name: '超级管理员',
        role_key: 'SUPERADMIN',
        role_sort: 1,
        status: '0',
        remark: '拥有所有权限的超级管理员',
      } as any);
      console.log('SUPERADMIN role created.');
    } else {
      console.log('SUPERADMIN role already exists.');
    }

    // 2. Assign to User 1
    const userId = 1;
    const user = await User.findByPk(userId);
    if (!user) {
      console.error(
        `User with ID ${userId} not found! Please ensure database is initialized with at least one user.`,
      );
    } else {
      const existingRelation = await UserRole.findOne({
        where: {
          user_id: userId,
          role_id: superAdminRole.role_id,
        },
      });

      if (!existingRelation) {
        console.log(`Assigning SUPERADMIN role to user ${userId}...`);
        await UserRole.create({
          user_id: userId,
          role_id: superAdminRole.role_id,
        } as any);
        console.log('Role assigned successfully.');
      } else {
        console.log('User already has SUPERADMIN role.');
      }
    }
  } catch (error) {
    console.error('Error during initialization:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
