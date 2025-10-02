import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export interface Product {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    inStock: number;
    isDeleted?: boolean;
}

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }
    async create(createProductData: Product) {
        const data = await this.prisma.product.create({
            data: createProductData,
        });
        return data;
    }

    async findAll(page: number, limit: number) {
        const data = await this.prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc"
            },
        });
        return data;
    }

    async update(id: string, updateProductDto: any) {
        const data = await this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
        return data;
    }

    async remove(id: string) {
        const data = await this.prisma.product.update({
            where: { id },
            data: { isDeleted: true }
        });
        return data;
    }
}
