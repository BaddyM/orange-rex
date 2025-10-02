import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid4 } from "uuid";
import axios from "axios";

export interface Payment {
    salesId: string;
    status?: string;
    amount: number;
}

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) { }
    async createPayment(paymentData: Payment) {
        //Pesapal Auth Token
        const authTokenResponse = await axios.post("https://pay.pesapal.com/v3/api/Auth/RequestToken",
            {
                "consumer_key": process.env.PESAPAL_CONSUMER_KEY,
                "consumer_secret": process.env.PESAPAL_CONSUMER_SECRET
            },
            {
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        if (authTokenResponse.data.status == 200) {
            const authToken = authTokenResponse.data.token;

            //Get IPN
            const ipnIdResponse = await axios.get("https://pay.pesapal.com/v3/api/URLSetup/GetIpnList",
                {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Content-type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );
            console.log(ipnIdResponse.data)
            const ipnId = ipnIdResponse.data[0].ipn_id;
            const id = uuid4();
            const salesData = await this.prisma.sales.findFirst({
                where: { salesId: paymentData.salesId },
            })

            //Create SubmitOrder Request
            const order = {
                id: id,
                currency: "UGX",
                amount: paymentData.amount,
                description: `Payment for Goodies`,
                callback_url: "http://localhost:8081",
                cancellation_url: "http://localhost:8081",
                notification_id: ipnId,
                branch: "RStore HQ",
                billing_address: {
                    phone_number: salesData?.phone,
                    email_address: salesData?.address,
                },
            }

            const orderRequest = await axios.post("https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest", order,
                {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        "Content-type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );

            console.log(orderRequest.data)

            if (orderRequest.data.status == 500) {
                throw new InternalServerErrorException({
                    success: false,
                    message: orderRequest.data.error.message,
                });
            }

            const data = await this.prisma.payments.create({
                data: {
                    salesId: paymentData.salesId,
                    amount: paymentData.amount,
                    merchantReference: orderRequest.data.merchant_reference,
                    orderTrackingId: orderRequest.data.order_tracking_id,
                }
            });

            return {
                data: data,
                paymentInfo: orderRequest.data,
            };
        }
        throw new InternalServerErrorException({
            success: false,
            message: "Failed to make payment",
        });
    }

    async findAll(page: number, limit: number) {
        const data = await this.prisma.payments.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        });
        return data;
    }

    async remove(id: string) {
        const data = await this.prisma.payments.delete({
            where: { id },
        });
        return data;
    }
}
