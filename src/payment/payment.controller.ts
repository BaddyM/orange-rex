import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { Payment, PaymentService } from './payment.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    create(@Req() req: any) {
        const body: Payment = req.body;
        return this.paymentService.createPayment(body);
    }

    @Get()
    @ApiQuery({ name: "limit" })
    @ApiQuery({ name: "page" })
    findAll(
        @Query("page") page: string,
        @Query("limit") limit: string,
    ) {
        const currentPage = page ?? 1;
        const currentLimit = limit ?? 10;
        return this.paymentService.findAll(parseInt(currentPage), parseInt(currentLimit));
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.paymentService.remove(id);
    }
}
