import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, BadRequestException, Res, UploadedFiles, Query } from '@nestjs/common';
import { Product, ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from "multer";
const fs = require("fs");
import * as path from 'path';
import { randomBytes } from 'crypto';
import { Response } from 'express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    @UseInterceptors(
        FilesInterceptor('image', 8, {
            storage: memoryStorage(),
            limits: {
                fileSize: 1 * 1024 * 1024
            },
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    return cb(new BadRequestException('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async create(
        @Body() createProductDto: CreateProductDto,
        @Res() res: Response,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        try {
            let fileArray: string[] = [];
            files.forEach(file => {
                const ext = path.extname(file.originalname); // keep the original file extension
                const randomPart = randomBytes(6).toString('hex'); // e.g. 'a3f4c9d2'
                const timestamp = Date.now();
                const newFileName = `item_${timestamp}_${randomPart}${ext}`;
                const uploadPath = `./uploads/${newFileName}`;
                fileArray.push(uploadPath);
                fs.writeFileSync(uploadPath, file.buffer); // Save the file manually
            });
            const dataUpload: Product = {
                name: createProductDto.name,
                price: parseInt(createProductDto.price),
                description: createProductDto.description,
                image: fileArray.join(","),
                inStock: parseInt(createProductDto.inStock),
                category: createProductDto.category,
            }
            const data = await this.productService.create(dataUpload);
            return res.status(200).json({
                success: true,
                data: data,
            });
        } catch (e) {
            console.log(e);
            throw new BadRequestException({
                success: false,
                error: `Error:${e}`
            });
        }
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
        return this.productService.findAll(parseInt(currentPage), parseInt(currentLimit));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }
}
