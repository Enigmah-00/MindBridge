import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Specialties
  const [psychiatry, therapy, sleep] = await Promise.all([
    prisma.specialty.upsert({
      where: { key: "psychiatry" },
      update: {},
      create: { key: "psychiatry", name: "Psychiatry" },
    }),
    prisma.specialty.upsert({
      where: { key: "therapy-cbt" },
      update: {},
      create: { key: "therapy-cbt", name: "Therapy (CBT)" },
    }),
    prisma.specialty.upsert({
      where: { key: "sleep-medicine" },
      update: {},
      create: { key: "sleep-medicine", name: "Sleep Medicine" },
    }),
  ]);

  // Sample doctor user
  const docUser = await prisma.user.upsert({
    where: { username: "dr_smith" },
    update: {},
    create: {
      username: "dr_smith",
      email: "drsmith@example.com",
      passwordHash: "$argon2id$v=19$m=65536,t=3,p=1$zFqQq2Sk8mYQmH2r2cP1EA$z0gTQqt5kY8T5mJXW8Yy3oD0+5qorZkqck2/7Qv+Kj0", // placeholder hash, not used
      role: "DOCTOR",
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: docUser.id },
    update: {},
    create: {
      userId: docUser.id,
      name: "Dr. Alex Smith",
      city: "Dhaka",
      country: "Bangladesh",
      latitude: 23.7808875,
      longitude: 90.2792371,
      telehealth: true,
    },
  });

  await prisma.doctorSpecialty.createMany({
    data: [
      { doctorId: doctor.id, specialtyId: psychiatry.id },
      { doctorId: doctor.id, specialtyId: therapy.id },
      { doctorId: doctor.id, specialtyId: sleep.id },
    ],
    skipDuplicates: true,
  });

  // Availability: Mon-Fri, 9:00-12:00, 20-min slots
  for (const weekday of [1, 2, 3, 4, 5]) {
    await prisma.doctorWeeklyAvailability.create({
      data: {
        doctorId: doctor.id,
        weekday,
        startMinute: 9 * 60,
        endMinute: 12 * 60,
        slotMinutes: 20,
        timezone: "Asia/Dhaka",
      },
    });
  }

  // Quizzes: PHQ-9 and GAD-7 minimal seed
  const phq = await prisma.quiz.upsert({
    where: { key: "PHQ-9" },
    update: {},
    create: { key: "PHQ-9", title: "PHQ-9 Depression Questionnaire", description: "Screening for depression symptoms" },
  });
  const gad = await prisma.quiz.upsert({
    where: { key: "GAD-7" },
    update: {},
    create: { key: "GAD-7", title: "GAD-7 Anxiety Questionnaire", description: "Screening for generalized anxiety" },
  });

  const phqQuestions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself",
    "Trouble concentrating",
    "Moving/speaking slowly or being fidgety/restless",
    "Thoughts that you would be better off dead or of hurting yourself"
  ];
  for (let i = 0; i < phqQuestions.length; i++) {
    const q = await prisma.question.create({
      data: { quizId: phq.id, order: i + 1, text: phqQuestions[i] },
    });
    await prisma.option.createMany({
      data: [
        { questionId: q.id, label: "Not at all", value: 0 },
        { questionId: q.id, label: "Several days", value: 1 },
        { questionId: q.id, label: "More than half the days", value: 2 },
        { questionId: q.id, label: "Nearly every day", value: 3 },
      ],
    });
  }

  const gadQuestions = [
    "Feeling nervous, anxious or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen"
  ];
  for (let i = 0; i < gadQuestions.length; i++) {
    const q = await prisma.question.create({
      data: { quizId: gad.id, order: i + 1, text: gadQuestions[i] },
    });
    await prisma.option.createMany({
      data: [
        { questionId: q.id, label: "Not at all", value: 0 },
        { questionId: q.id, label: "Several days", value: 1 },
        { questionId: q.id, label: "More than half the days", value: 2 },
        { questionId: q.id, label: "Nearly every day", value: 3 },
      ],
    });
  }

  console.log("Seed complete");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});