import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryModule } from './delivery/delivery.module';
import { VoucherModule } from './voucher/voucher.module';
import { CustomerModule } from './customer/customer.module';
import { AddressModule } from './address/address.module';
import { PayoutModule } from './payout/payout.module';
import { TipModule } from './tip/tip.module';
import { SettlementModule } from './settlement/settlement.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PlaceModule } from './place/place.module';
import { WorkTimeModule } from './work-time/work-time.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    VoucherModule,
    DeliveryModule,
    AddressModule,
    CustomerModule,
    PayoutModule,
    SettlementModule,
    TipModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 10,
          blockDuration: 5000,
        },
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Neon usa certificado próprio
      },
      autoLoadEntities: true, // se já usa isso, mantém
      synchronize: false, // NUNCA true em produção
    }),
    PlaceModule,
    WorkTimeModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
