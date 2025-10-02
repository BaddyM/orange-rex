import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    price: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    inStock: number;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isDeleted: boolean;
}
