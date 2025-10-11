import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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

  // Hash the default password once before the loop
  const defaultPasswordHash = await bcrypt.hash("doctor123", 10);

  for (const doctorData of realDoctors) {
    const docUser = await prisma.user.upsert({
      where: { username: doctorData.username },
      update: {},
      create: {
        username: doctorData.username,
        email: doctorData.email,
        passwordHash: defaultPasswordHash,
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

    // Only set availability for the first 3 doctors (dr_zaman, dr_ahmed, dr_rahman)
    // This way, other doctors will show "Availability not set yet" until they log in and set it
    const doctorsWithAvailability = ["dr_zaman", "dr_ahmed", "dr_rahman"];
    if (doctorsWithAvailability.includes(doctorData.username)) {
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
  }

  // ALL 8 QUIZZES
  const phq = await prisma.quiz.upsert({
    where: { key: "PHQ-9" },
    update: {},
    create: {
      key: "PHQ-9",
      title: "PHQ-9 Depression Questionnaire",
      description: "Screening for depression severity",
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

  const pss = await prisma.quiz.upsert({
    where: { key: "PSS-10" },
    update: {},
    create: {
      key: "PSS-10",
      title: "Perceived Stress Scale",
      description: "Measure your stress levels",
    },
  });

  const spin = await prisma.quiz.upsert({
    where: { key: "SPIN" },
    update: {},
    create: {
      key: "SPIN",
      title: "Social Phobia Inventory",
      description: "Screen for social anxiety disorder",
    },
  });

  const pdss = await prisma.quiz.upsert({
    where: { key: "PDSS" },
    update: {},
    create: {
      key: "PDSS",
      title: "Panic Disorder Severity Scale",
      description: "Assess panic disorder symptoms",
    },
  });

  const asrs = await prisma.quiz.upsert({
    where: { key: "ASRS" },
    update: {},
    create: {
      key: "ASRS",
      title: "Adult ADHD Self-Report Scale",
      description: "Screen for ADHD in adults",
    },
  });

  const oci = await prisma.quiz.upsert({
    where: { key: "OCI-R" },
    update: {},
    create: {
      key: "OCI-R",
      title: "Obsessive-Compulsive Inventory",
      description: "Screen for OCD symptoms",
    },
  });

  const pcl5 = await prisma.quiz.upsert({
    where: { key: "PCL-5" },
    update: {},
    create: {
      key: "PCL-5",
      title: "PTSD Checklist",
      description: "Screen for PTSD symptoms",
    },
  });

  // PHQ-9 Questions (9 questions)
  const phqQuestions = [
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
    const existingQ = await prisma.question.findFirst({
      where: { quizId: phq.id, order: i + 1 }
    });

    if (!existingQ) {
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
  }

  // GAD-7 Questions (7 questions)
  const gadQuestions = [
    "Feeling nervous, anxious or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
  ];

  for (const [i, text] of gadQuestions.entries()) {
    const existingQ = await prisma.question.findFirst({
      where: { quizId: gad.id, order: i + 1 }
    });

    if (!existingQ) {
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
  }

  // PSS-10 Questions (10 questions)
  const pssQuestions = [
    "How often have you been upset because of something that happened unexpectedly?",
    "How often have you felt that you were unable to control important things in your life?",
    "How often have you felt nervous and stressed?",
    "How often have you felt confident about your ability to handle your personal problems?",
    "How often have you felt that things were going your way?",
    "How often have you found that you could not cope with all the things you had to do?",
    "How often have you been able to control irritations in your life?",
    "How often have you felt that you were on top of things?",
    "How often have you been angered because of things outside of your control?",
    "How often have you felt difficulties were piling up so high that you could not overcome them?",
  ];

  for (const [i, text] of pssQuestions.entries()) {
    const existingQ = await prisma.question.findFirst({
      where: { quizId: pss.id, order: i + 1 }
    });

    if (!existingQ) {
      const q = await prisma.question.create({
        data: { quizId: pss.id, order: i + 1, text },
      });
      await prisma.option.createMany({
        data: [
          { questionId: q.id, label: "Never", value: 0 },
          { questionId: q.id, label: "Almost never", value: 1 },
          { questionId: q.id, label: "Sometimes", value: 2 },
          { questionId: q.id, label: "Fairly often", value: 3 },
          { questionId: q.id, label: "Very often", value: 4 },
        ],
        skipDuplicates: true,
      });
    }
  }

  // SPIN Questions (17 questions - Social Phobia)
  const spinQuestions = [
    "I am afraid of people in authority",
    "I am bothered by blushing in front of people",
    "Parties and social events scare me",
    "I avoid talking to people I don't know",
    "Being criticized scares me a lot",
    "I avoid doing things or speaking to people for fear of embarrassment",
    "Sweating in front of people causes me distress",
    "I avoid going to parties",
    "I avoid activities in which I am the center of attention",
    "Talking to strangers scares me",
    "I avoid having to give speeches",
    "I would do anything to avoid being criticized",
    "Heart palpitations bother me when I am around people",
    "I am afraid of doing things when people might be watching",
    "Being embarrassed or looking stupid are among my worst fears",
    "I avoid speaking to anyone in authority",
    "Trembling or shaking in front of others is distressing to me",
  ];

  for (const [i, text] of spinQuestions.entries()) {
    const existingQ = await prisma.question.findFirst({
      where: { quizId: spin.id, order: i + 1 }
    });

    if (!existingQ) {
      const q = await prisma.question.create({
        data: { quizId: spin.id, order: i + 1, text },
      });
      await prisma.option.createMany({
        data: [
          { questionId: q.id, label: "Not at all", value: 0 },
          { questionId: q.id, label: "A little bit", value: 1 },
          { questionId: q.id, label: "Somewhat", value: 2 },
          { questionId: q.id, label: "Very much", value: 3 },
          { questionId: q.id, label: "Extremely", value: 4 },
        ],
        skipDuplicates: true,
      });
    }
  }

  // PDSS Questions (7 questions - Panic Disorder)
  const pdssQuestions = [
    "How many panic and limited symptom attacks did you have during the week?",
    "If you had any panic attacks, how distressing were they?",
    "During the past week, how much have you worried or felt anxious about when your next panic attack would occur?",
    "During the past week, were there any places or situations you avoided?",
    "During the past week, were there any activities you avoided?",
    "During the past week, how much did the above symptoms interfere with your ability to work?",
    "During the past week, how much did the symptoms interfere with your social life?",
  ];

  for (const [i, text] of pdssQuestions.entries()) {
    const existingQ = await prisma.question.findFirst({
      where: { quizId: pdss.id, order: i + 1 }
    });

    if (!existingQ) {
      const q = await prisma.question.create({
        data: { quizId: pdss.id, order: i + 1, text },
      });
      await prisma.option.createMany({
        data: [
          { questionId: q.id, label: "None", value: 0 },
          { questionId: q.id, label: "Mild", value: 1 },
          { questionId: q.id, label: "Moderate", value: 2 },
          { questionId: q.id, label: "Severe", value: 3 },
          { questionId: q.id, label: "Extreme", value: 4 },
        ],
        skipDuplicates: true,
      });
    }
  }

  // ASRS Questions (6 questions - ADHD)
  const asrsQuestions = [
    "How often do you have trouble wrapping up the final details of a project?",
    "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    "How often do you have problems remembering appointments or obligations?",
    "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    "How often do you feel overly active and compelled to do things?",
  ];

  for (const [i, text] of asrsQuestions.entries()) {
    const existingQ = await prisma.question.findFirst({
      where: { quizId: asrs.id, order: i + 1 }
    });

    if (!existingQ) {
      const q = await prisma.question.create({
        data: { quizId: asrs.id, order: i + 1, text },
      });
      await prisma.option.createMany({
        data: [
          { questionId: q.id, label: "Never", value: 0 },
          { questionId: q.id, label: "Rarely", value: 1 },
          { questionId: q.id, label: "Sometimes", value: 2 },
          { questionId: q.id, label: "Often", value: 3 },
          { questionId: q.id, label: "Very Often", value: 4 },
        ],
        skipDuplicates: true,
      });
    }
  }

  // OCI-R Questions (18 questions - OCD)
  const ociQuestions = [
    "I have saved up so many things that they get in the way",
    "I check things more often than necessary",
    "I get upset if objects are not arranged properly",
    "I feel compelled to count while I am doing things",
    "I find it difficult to touch an object when I know it has been touched by strangers",
    "I find it difficult to control my own thoughts",
    "I collect things I don't need",
    "I repeatedly check doors, windows, drawers, etc.",
    "I get upset if others change the way I have arranged things",
    "I feel I have to repeat certain numbers",
    "I sometimes have to wash or clean myself simply because I feel contaminated",
    "I am upset by unpleasant thoughts that come into my mind against my will",
    "I avoid throwing things away because I am afraid I might need them later",
    "I repeatedly check gas and water taps and light switches after turning them off",
    "I need things to be arranged in a particular order",
    "I feel that there are good and bad numbers",
    "I wash my hands more often and longer than necessary",
    "I frequently get nasty thoughts and have difficulty getting rid of them",
  ];

  for (const [i, text] of ociQuestions.entries()) {
    const existingQ = await prisma.question.findFirst({
      where: { quizId: oci.id, order: i + 1 }
    });

    if (!existingQ) {
      const q = await prisma.question.create({
        data: { quizId: oci.id, order: i + 1, text },
      });
      await prisma.option.createMany({
        data: [
          { questionId: q.id, label: "Not at all", value: 0 },
          { questionId: q.id, label: "A little", value: 1 },
          { questionId: q.id, label: "Moderately", value: 2 },
          { questionId: q.id, label: "A lot", value: 3 },
          { questionId: q.id, label: "Extremely", value: 4 },
        ],
        skipDuplicates: true,
      });
    }
  }

  // PCL-5 Questions (20 questions - PTSD)
  const pcl5Questions = [
    "Repeated, disturbing, and unwanted memories of the stressful experience?",
    "Repeated, disturbing dreams of the stressful experience?",
    "Suddenly feeling or acting as if the stressful experience were actually happening again?",
    "Feeling very upset when something reminded you of the stressful experience?",
    "Having strong physical reactions when something reminded you of the stressful experience?",
    "Avoiding memories, thoughts, or feelings related to the stressful experience?",
    "Avoiding external reminders of the stressful experience?",
    "Trouble remembering important parts of the stressful experience?",
    "Having strong negative beliefs about yourself, other people, or the world?",
    "Blaming yourself or someone else for the stressful experience or what happened after it?",
    "Having strong negative feelings such as fear, horror, anger, guilt, or shame?",
    "Loss of interest in activities that you used to enjoy?",
    "Feeling distant or cut off from other people?",
    "Trouble experiencing positive feelings?",
    "Irritable behavior, angry outbursts, or acting aggressively?",
    "Taking too many risks or doing things that could cause you harm?",
    "Being 'superalert' or watchful or on guard?",
    "Feeling jumpy or easily startled?",
    "Having difficulty concentrating?",
    "Trouble falling or staying asleep?",
  ];

  for (const [i, text] of pcl5Questions.entries()) {
    const existingQ = await prisma.question.findFirst({
      where: { quizId: pcl5.id, order: i + 1 }
    });

    if (!existingQ) {
      const q = await prisma.question.create({
        data: { quizId: pcl5.id, order: i + 1, text },
      });
      await prisma.option.createMany({
        data: [
          { questionId: q.id, label: "Not at all", value: 0 },
          { questionId: q.id, label: "A little bit", value: 1 },
          { questionId: q.id, label: "Moderately", value: 2 },
          { questionId: q.id, label: "Quite a bit", value: 3 },
          { questionId: q.id, label: "Extremely", value: 4 },
        ],
        skipDuplicates: true,
      });
    }
  }

  const finalDoctors = await prisma.doctor.count();
  const finalQuizzes = await prisma.quiz.count();
  const finalQuestions = await prisma.question.count();

  console.log("✅ Seed complete!");
  console.log(`   Doctors: ${finalDoctors}`);
  console.log(`   Quizzes: ${finalQuizzes}`);
  console.log(`   Questions: ${finalQuestions}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });