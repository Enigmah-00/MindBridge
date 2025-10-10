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

  // Real doctors from Bangladesh (data inspired by doctorbangladesh.com)
  const realDoctors = [
    {
      username: "dr_zaman",
      email: "drzaman@example.com",
      name: "Dr. Mohammad Zaman",
      city: "Dhaka",
      country: "Bangladesh",
      latitude: 23.7808875,
      longitude: 90.4009246,
      telehealth: true,
      specialties: [psychiatry, therapy],
    },
    {
      username: "dr_ahmed",
      email: "drahmed@example.com",
      name: "Dr. Farhana Ahmed",
      city: "Chittagong",
      country: "Bangladesh",
      latitude: 22.356851,
      longitude: 91.783182,
      telehealth: true,
      specialties: [psychiatry],
    },
    {
      username: "dr_rahman",
      email: "drrahman@example.com",
      name: "Dr. Abdul Rahman",
      city: "Sylhet",
      country: "Bangladesh",
      latitude: 24.8949,
      longitude: 91.8687,
      telehealth: false,
      specialties: [therapy, sleep],
    },
    {
      username: "dr_sultana",
      email: "drsultana@example.com",
      name: "Dr. Nasrin Sultana",
      city: "Dhaka",
      country: "Bangladesh",
      latitude: 23.8103,
      longitude: 90.4125,
      telehealth: true,
      specialties: [psychiatry, therapy, sleep],
    },
    {
      username: "dr_islam",
      email: "drislam@example.com",
      name: "Dr. Md. Aminul Islam",
      city: "Rajshahi",
      country: "Bangladesh",
      latitude: 24.3745,
      longitude: 88.6042,
      telehealth: true,
      specialties: [psychiatry],
    },
    {
      username: "dr_hossain",
      email: "drhossain@example.com",
      name: "Dr. Kamrul Hossain",
      city: "Khulna",
      country: "Bangladesh",
      latitude: 22.8456,
      longitude: 89.5403,
      telehealth: false,
      specialties: [therapy],
    },
    {
      username: "dr_begum",
      email: "drbegum@example.com",
      name: "Dr. Taslima Begum",
      city: "Dhaka",
      country: "Bangladesh",
      latitude: 23.7644,
      longitude: 90.3688,
      telehealth: true,
      specialties: [psychiatry, sleep],
    },
    {
      username: "dr_chowdhury",
      email: "drchowdhury@example.com",
      name: "Dr. Ashraf Chowdhury",
      city: "Comilla",
      country: "Bangladesh",
      latitude: 23.4607,
      longitude: 91.1809,
      telehealth: true,
      specialties: [therapy],
    },
  ];

  for (const doctorData of realDoctors) {
    const docUser = await prisma.user.upsert({
      where: { username: doctorData.username },
      update: {},
      create: {
        username: doctorData.username,
        email: doctorData.email,
        passwordHash:
          "$argon2id$v=19$m=65536,t=3,p=1$zFqQq2Sk8mYQmH2r2cP1EA$z0gTQqt5kY8T5mJXW8Yy3oD0+5qorZkqck2/7Qv+Kj0",
        role: "DOCTOR",
      },
    });

    const doctor = await prisma.doctor.upsert({
      where: { userId: docUser.id },
      update: {},
      create: {
        userId: docUser.id,
        name: doctorData.name,
        city: doctorData.city,
        country: doctorData.country,
        latitude: doctorData.latitude,
        longitude: doctorData.longitude,
        telehealth: doctorData.telehealth,
      },
    });

    await prisma.doctorSpecialty.createMany({
      data: doctorData.specialties.map((spec) => ({
        doctorId: doctor.id,
        specialtyId: spec.id,
      })),
      skipDuplicates: true,
    });

    // Availability: Mon–Fri, 9:00–17:00, 30-min slots
    for (const weekday of [1, 2, 3, 4, 5]) {
      const existing = await prisma.doctorWeeklyAvailability.findFirst({
        where: {
          doctorId: doctor.id,
          weekday,
          startMinute: 9 * 60,
          endMinute: 17 * 60,
        },
      });
      if (!existing) {
        await prisma.doctorWeeklyAvailability.create({
          data: {
            doctorId: doctor.id,
            weekday,
            startMinute: 9 * 60,
            endMinute: 17 * 60,
            slotMinutes: 30,
            timezone: "Asia/Dhaka",
          },
        });
      }
    }
  }

  // Quizzes
  const phq = await prisma.quiz.upsert({
    where: { key: "PHQ-9" },
    update: {},
    create: {
      key: "PHQ-9",
      title: "PHQ-9 Depression Questionnaire",
      description: "Screening for depression symptoms",
    },
  });

  const gad = await prisma.quiz.upsert({
    where: { key: "GAD-7" },
    update: {},
    create: {
      key: "GAD-7",
      title: "GAD-7 Anxiety Questionnaire",
      description: "Screening for generalized anxiety",
    },
  });

  const phqQuestions: readonly string[] = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself",
    "Trouble concentrating",
    "Moving/speaking slowly or being fidgety/restless",
    "Thoughts that you would be better off dead or of hurting yourself",
  ];

  for (const [i, text] of phqQuestions.entries()) {
    const q = await prisma.question.create({
      data: { quizId: phq.id, order: i + 1, text },
    });
    await prisma.option.createMany({
      data: [
        { questionId: q.id, label: "Not at all", value: 0 },
        { questionId: q.id, label: "Several days", value: 1 },
        { questionId: q.id, label: "More than half the days", value: 2 },
        { questionId: q.id, label: "Nearly every day", value: 3 },
      ],
      skipDuplicates: true,
    });
  }

  const gadQuestions: readonly string[] = [
    "Feeling nervous, anxious or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
  ];

  for (const [i, text] of gadQuestions.entries()) {
    const q = await prisma.question.create({
      data: { quizId: gad.id, order: i + 1, text },
    });
    await prisma.option.createMany({
      data: [
        { questionId: q.id, label: "Not at all", value: 0 },
        { questionId: q.id, label: "Several days", value: 1 },
        { questionId: q.id, label: "More than half the days", value: 2 },
        { questionId: q.id, label: "Nearly every day", value: 3 },
      ],
      skipDuplicates: true,
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });