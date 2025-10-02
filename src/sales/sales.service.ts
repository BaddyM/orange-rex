import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 } from "uuid";

export interface Sales {
    productId: string;
    name: string;
    email?: string;
    phone: string;
    qty: number;
    address: string;
}

@Injectable()
export class SalesService {
    constructor(private prisma: PrismaService) { }
    async create(createSaleData: Sales[]) {
        const salesId = v4()
        for (let i = 0; i < createSaleData.length; i++) {
            //Deduct from stock
            const currentStock = await this.prisma.product.findUnique({
                where: { id: createSaleData[i].productId },
                select: { inStock: true }
            });
            const newStock = (currentStock!.inStock - createSaleData[i].qty);

            //Update Stock
            await this.prisma.product.update({
                where: { id: createSaleData[i].productId },
                data: { inStock: newStock }
            });

            const data = await this.prisma.sales.create({
                data: {
                    ...createSaleData[i],
                    salesId,
                },
            });
        }
        return {salesId};
    }

    async findAll(page: number, limit: number) {
        const data = await this.prisma.sales.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
        });
        return data;
    }

    async remove(id: string) {
        const data = await this.prisma.sales.deleteMany({
            where: { salesId: id }
        });
        return data;
    }
}
