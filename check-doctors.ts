import { prisma } from "./src/lib/prisma.js";

async function checkDoctors() {
  const doctors = await prisma.doctor.findMany({
    select: {
      name: true,
      avgRating: true,
      totalReviews: true,
      feePerVisit: true,
      appointments: {
        select: {
          id: true,
          rating: true,
        }
      }
    },
    orderBy: {
      avgRating: 'desc'
    }
  });

  console.log('\n=== ALL DOCTORS IN DATABASE ===\n');
  doctors.forEach(d => {
    console.log(`${d.name}:`);
    console.log(`  avgRating: ${d.avgRating}`);
    console.log(`  totalReviews: ${d.totalReviews}`);
    console.log(`  feePerVisit: ${d.feePerVisit}`);
    console.log(`  appointments: ${d.appointments.length}`);
    console.log(`  appointment ratings: ${d.appointments.map(a => a.rating).filter(r => r !== null).join(', ') || 'none'}`);
    console.log('');
  });

  await prisma.$disconnect();
}

checkDoctors().catch(console.error);
