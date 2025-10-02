import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
const bcrypt = require("bcrypt");

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }
    async create(createUserDto: CreateUserDto) {
        const password = await bcrypt.hash(createUserDto.password, 10);
        const data = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password,
            }
        });
        return data;
    }

    async findAll() {
        const data = await this.prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        return data;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const data = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
        return data;
    }

    async remove(id: string) {
        const data = await this.prisma.user.delete({
            where: { id }
        });
        return data;
    }

    async login(loginData: LoginUserDto) {
        //Check user exists
        const exists = await this.prisma.user.count({
            where: { email: loginData.email }
        });
        if (exists > 0) {
            //Check password
            const data = await this.prisma.user.findUnique({
                where: { email: loginData.email }
            });
            const checkPassword = await bcrypt.compare(loginData.password, data!.password);
            if (checkPassword) {
                return {
                    email: data?.email,
                    name: data?.name,
                }
            } else {
                throw new UnauthorizedException({
                    success: false,
                    error: `Incorrect credentials.`
                });
            }
        } else {
            throw new UnauthorizedException({
                success: false,
                error: `User doesn't exist`
            });
        }
    }

}