import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    price:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    inStock:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    category:string;
}
