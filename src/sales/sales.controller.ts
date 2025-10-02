import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { Sales, SalesService } from './sales.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    create(@Req() req: any) {
        const data: Sales[] = req.body
        return this.salesService.create(data);
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
        return this.salesService.findAll(parseInt(currentPage), parseInt(currentLimit));
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.salesService.remove(id);
    }
}
