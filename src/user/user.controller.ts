import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel, Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(
    @Body() userData: Prisma.UserCreateInput,
  ): Promise<UserModel> {
    console.log('Received user data:', userData);
    console.log('Request body type:', typeof userData);
    console.log(
      'Request body keys:',
      userData ? Object.keys(userData) : 'undefined',
    );

    if (!userData) {
      throw new Error('Request body is required');
    }

    try {
      const result = await this.userService.createUser(userData);
      console.log('User created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  @Get('test')
  async testConnection(): Promise<{ status: string; message: string }> {
    try {
      // 测试数据库连接
      await this.userService.users({ take: 1 });
      return { status: 'success', message: 'Database connection is working' };
    } catch (error) {
      console.error('Database connection test failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'error',
        message: `Database connection failed: ${errorMessage}`,
      };
    }
  }
}
