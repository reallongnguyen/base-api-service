import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { AppController } from './app.controller';
import { FileModule } from './modules/file/file.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    // Register business modules here
    UserModule,
    FileModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
