// import { Cron } from '@nestjs/schedule';

// @Injectable()
// export class UsageResetCron {

//   constructor(
//     private readonly usageRepo: Repository<SubscriptionUsage>,
//   ) {}

//   // Runs every day at midnight
//   @Cron('0 0 * * *')
//   async handleDailyCheck() {

//     const now = new Date();

//     const usages = await this.usageRepo.find();

//     for (const usage of usages) {

//       if (now > usage.periodEnd) {

//         usage.used = 0;

//         // move to next period
//         const newStart = new Date();
//         const newEnd = this.getNextPeriod(usage.periodType);

//         usage.periodStart = newStart;
//         usage.periodEnd = newEnd;

//         await this.usageRepo.save(usage);
//       }
//     }
//   }

//   private getNextPeriod(type: string): Date {

//     const now = new Date();

//     if (type === 'daily') {
//       return new Date(now.setDate(now.getDate() + 1));
//     }

//     if (type === 'monthly') {
//       return new Date(now.setMonth(now.getMonth() + 1));
//     }

//     return new Date('2099-12-31'); // lifetime
//   }
// }
// // SELECT * FROM subscription_usage
// // WHERE period_end < NOW()



// // async checkQuota(subscriptionId, usageKey, plan) {

// //   const usage = await this.repo.findOne({
// //     where: { subscriptionId, usageKey }
// //   });

// //   const limit = plan.quota[usageKey].limit;
// //   const periodEnd = usage.periodEnd;

// //   // 🧠 STEP 1: lazy reset check
// //   if (new Date() > periodEnd) {

// //     usage.used = 0;

// //     usage.periodStart = new Date();
// //     usage.periodEnd = this.getNextPeriod(plan.quota[usageKey].period);

// //     await this.repo.save(usage);
// //   }

// //   // 🧠 STEP 2: check limit after reset
// //   if (usage.used >= limit) {
// //     throw new Error("Quota exceeded");
// //   }

// //   return true;
// // }