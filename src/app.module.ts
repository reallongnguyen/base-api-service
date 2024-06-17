import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { AppController } from './app.controller';
import { FileModule } from './modules/file/file.module';
import { CommonModule } from './common/common.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    CommonModule,
    // Register business modules here
    UserModule,
    FileModule,
    NotificationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
