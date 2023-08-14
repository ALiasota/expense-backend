import { Injectable } from '@nestjs/common';
import { Transaction } from './transactions.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  async createTransaction(userId: string, dto: CreateTransactionDto) {
    const transaction = await (
      await this.transactionModel.create({
        user: userId,
        ...dto,
      })
    ).populate('category');
    return {
      id: transaction._id,
      category: transaction.category.label,
      amount: transaction.amount,
      date: transaction.date,
    };
  }

  async getUserTransactions(userId: string) {
    const transactionsBD = await this.transactionModel
      .find({
        user: userId,
      })
      .populate('category');
    const transactions = transactionsBD.map((transaction) => ({
      id: transaction._id,
      category: transaction.category.label,
      amount: transaction.amount,
      date: transaction.date,
    }));
    return transactions;
  }

  async getUserTransactionsByCategoryId(categoryId: string) {
    const transactionsBD = await this.transactionModel
      .find({
        category: categoryId,
      })
      .populate('category');
    const transactions = transactionsBD.map((transaction) => ({
      id: transaction._id,
      category: transaction.category.label,
      amount: transaction.amount,
      date: transaction.date,
    }));
    return transactions;
  }

  async getAllTransactions() {
    const transactionsBD = await this.transactionModel
      .find()
      .populate('category');
    const transactions = transactionsBD.map((transaction) => ({
      id: transaction._id,
      category: transaction.category.label,
      amount: transaction.amount,
      date: transaction.date,
    }));
    return transactions;
  }

  async updateUserTransactionsByCategoryId(
    categoryId: string,
    newCategoryId: string,
  ) {
    return await this.transactionModel.updateMany(
      {
        category: categoryId,
      },
      { $set: { category: newCategoryId } },
    );
  }
}
