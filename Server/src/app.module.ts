import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'; 
import { AuthUsers } from './auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'monabbirhasan',
      database: 'bizmate',
      entities: [AuthUsers],
      synchronize: true, 
    }),
    AuthModule, 
  ],
})
export class AppModule {}
