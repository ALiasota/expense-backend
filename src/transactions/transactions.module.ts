import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { Transaction, TransactionSchema } from './transactions.schema';
import { JwtModule } from '@nestjs/jwt';

config();

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
