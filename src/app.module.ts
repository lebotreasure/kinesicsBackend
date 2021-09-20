import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlacklistedTModule } from './blacklisted-t/blacklisted-t.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WordModule } from './signs/word/word.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { RequestedsignsModule } from './requestedsigns/requestedsigns.module';

const uri = 'mongodb+srv://Kat:Commula@cluster0.nzqb8.mongodb.net/SignLanguage?retryWrites=true&w=majority';





@Module({
  imports: [BlacklistedTModule,RequestedsignsModule,
    WordModule,MongooseModule.forRoot(uri), MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
  
    AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
