import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

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

  console.log("✅ Specialties created");

  // Hash the default password once
  const defaultPasswordHash = await bcrypt.hash("doctor123", 10);

  // Real doctors from Bangladesh
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
  ];

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

    // Set availability for first 3 doctors
    const doctorsWithAvailability = ["dr_zaman", "dr_ahmed", "dr_rahman"];
    if (doctorsWithAvailability.includes(doctorData.username)) {
      for (const weekday of [1, 2, 3, 4, 5]) {
        const existing = await prisma.doctorWeeklyAvailability.findFirst({
          where: { doctorId: doctor.id, weekday, startMinute: 9 * 60, endMinute: 17 * 60 },
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

  console.log("✅ Doctors created with availability");

  // ==================== QUIZZES ====================

  // 1. GAD-7 (Anxiety)
  const gad7 = await prisma.quiz.upsert({
    where: { key: "GAD-7" },
    update: {},
    create: {
      key: "GAD-7",
      title: "Anxiety Assessment (GAD-7)",
      description: "Based on GAD-7. Take our comprehensive anxiety assessment to understand your symptoms and receive personalized recommendations.",
    },
  });

  const gad7Questions = [
    "Feeling nervous, anxious or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen",
  ];

  for (const [i, text] of gad7Questions.entries()) {
    const q = await prisma.question.upsert({
      where: { id: `gad7-q${i + 1}` },
      update: { text, order: i + 1 },
      create: { id: `gad7-q${i + 1}`, quizId: gad7.id, order: i + 1, text },
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

  console.log("✅ GAD-7 (Anxiety) quiz created");

  // 2. PHQ-9 (Depression)
  const phq9 = await prisma.quiz.upsert({
    where: { key: "PHQ-9" },
    update: {},
    create: {
      key: "PHQ-9",
      title: "Depression Screening (PHQ-9)",
      description: "Based on PHQ-9. Identify the signs and symptoms of depression with our screening tool and get guidance on next steps.",
    },
  });

  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed - or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead or of hurting yourself in some way",
  ];

  for (const [i, text] of phq9Questions.entries()) {
    const q = await prisma.question.upsert({
      where: { id: `phq9-q${i + 1}` },
      update: { text, order: i + 1 },
      create: { id: `phq9-q${i + 1}`, quizId: phq9.id, order: i + 1, text },
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

  console.log("✅ PHQ-9 (Depression) quiz created");

  // 3. PSS-10 (Stress)
  const pss10 = await prisma.quiz.upsert({
    where: { key: "PSS-10" },
    update: {},
    create: {
      key: "PSS-10",
      title: "Stress Evaluation (PSS-10)",
      description: "Based on PSS-10. Assess your stress levels and learn personalized strategies to manage stress more effectively and efficiently.",
    },
  });

  const pss10Questions = [
    "In the last month, how often have you been upset because of something that happened unexpectedly?",
    "In the last month, how often have you felt that you were unable to control the important things in your life?",
    "In the last month, how often have you felt nervous and stressed?",
    "In the last month, how often have you felt confident about your ability to handle your personal problems?",
    "In the last month, how often have you felt that things were going your way?",
    "In the last month, how often have you found that you could not cope with all the things that you had to do?",
    "In the last month, how often have you been able to control irritations in your life?",
    "In the last month, how often have you felt that you were on top of things?",
    "In the last month, how often have you been angered because of things that happened that were outside of your control?",
    "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
  ];

  for (const [i, text] of pss10Questions.entries()) {
    const q = await prisma.question.upsert({
      where: { id: `pss10-q${i + 1}` },
      update: { text, order: i + 1 },
      create: { id: `pss10-q${i + 1}`, quizId: pss10.id, order: i + 1, text },
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

  console.log("✅ PSS-10 (Stress) quiz created");

  // 4. SPIN (Social Anxiety)
  const spin = await prisma.quiz.upsert({
    where: { key: "SPIN" },
    update: {},
    create: {
      key: "SPIN",
      title: "Social Anxiety Evaluation (SPIN)",
      description: "Based on SPIN. Assess your social anxiety levels and uncover personalized strategies to help you navigate social interactions with greater confidence and ease.",
    },
  });

  const spinQuestions = [
    "I am afraid of people in authority",
    "I am bothered by blushing in front of people",
    "Parties and social events scare me",
    "I avoid talking to people I don't know",
    "Being criticized scares me a lot",
    "Fear of embarrassment causes me to avoid doing things or speaking to people",
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
    const q = await prisma.question.upsert({
      where: { id: `spin-q${i + 1}` },
      update: { text, order: i + 1 },
      create: { id: `spin-q${i + 1}`, quizId: spin.id, order: i + 1, text },
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

  console.log("✅ SPIN (Social Anxiety) quiz created");

  // 5. PDSS (Panic Disorder)
  const pdss = await prisma.quiz.upsert({
    where: { key: "PDSS" },
    update: {},
    create: {
      key: "PDSS",
      title: "Panic Monitor (PDSS)",
      description: "Based on PDSS. Evaluate the intensity and frequency of your panic episodes, and get personalized techniques to help you manage and reduce panic attacks effectively.",
    },
  });

  const pdssQuestions = [
    "How many panic and limited symptom attacks did you have during the week?",
    "If you had any panic attacks during the past week, how distressing (uncomfortable, frightening) were they while they were happening?",
    "During the past week, how much have you worried or felt anxious about when your next panic attack would occur or about fears related to the attacks?",
    "During the past week, were there any places or situations (e.g., public transportation, movie theaters, crowds, bridges, tunnels, shopping malls, being alone) you avoided, or felt afraid of (uncomfortable in, wanted to avoid or leave), because of fear of having a panic attack?",
    "During the past week, were there any activities (e.g., physical exertion, sexual relations, taking a hot shower or bath, drinking coffee, watching an exciting or scary movie) that you avoided, or felt afraid of (uncomfortable doing, wanted to avoid or stop), because they caused physical sensations like those you feel during panic attacks or that you were afraid might trigger a panic attack?",
    "During the past week, how much did the above symptoms altogether (panic and limited symptom attacks, worry about attacks, and fear of situations and activities because of attacks) interfere with your ability to work or carry out your responsibilities at home?",
    "During the past week, how much did panic and limited symptom attacks, worry about attacks and fear of situations and activities because of attacks interfere with your social life?",
  ];

  for (const [i, text] of pdssQuestions.entries()) {
    const q = await prisma.question.upsert({
      where: { id: `pdss-q${i + 1}` },
      update: { text, order: i + 1 },
      create: { id: `pdss-q${i + 1}`, quizId: pdss.id, order: i + 1, text },
    });
    
    await prisma.option.createMany({
      data: [
        { questionId: q.id, label: "None / Not at all", value: 0 },
        { questionId: q.id, label: "Mild / Slightly", value: 1 },
        { questionId: q.id, label: "Moderate / Somewhat", value: 2 },
        { questionId: q.id, label: "Severe / Very", value: 3 },
        { questionId: q.id, label: "Extreme / Extremely", value: 4 },
      ],
      skipDuplicates: true,
    });
  }

  console.log("✅ PDSS (Panic Disorder) quiz created");

  // 6. ASRS (ADHD)
  const asrs = await prisma.quiz.upsert({
    where: { key: "ASRS" },
    update: {},
    create: {
      key: "ASRS",
      title: "Attention and Focus (ADHD) Clarity Check (ASRS)",
      description: "Based on ASRS-v1.1. Gauge your attention and focus levels with this ADHD assessment, and receive tailored strategies to improve clarity, concentration, and impulse control.",
    },
  });

  const asrsQuestions = [
    "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    "How often do you have problems remembering appointments or obligations?",
    "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
  ];

  for (const [i, text] of asrsQuestions.entries()) {
    const q = await prisma.question.upsert({
      where: { id: `asrs-q${i + 1}` },
      update: { text, order: i + 1 },
      create: { id: `asrs-q${i + 1}`, quizId: asrs.id, order: i + 1, text },
    });
    
    await prisma.option.createMany({
      data: [
        { questionId: q.id, label: "Never", value: 0 },
        { questionId: q.id, label: "Rarely", value: 1 },
        { questionId: q.id, label: "Sometimes", value: 2 },
        { questionId: q.id, label: "Often", value: 3 },
        { questionId: q.id, label: "Very often", value: 4 },
      ],
      skipDuplicates: true,
    });
  }

  console.log("✅ ASRS (ADHD) quiz created");

  // 7. OCI-R (OCD)
  const oci = await prisma.quiz.upsert({
    where: { key: "OCI-R" },
    update: {},
    create: {
      key: "OCI-R",
      title: "OCD Check (OCI-R)",
      description: "Based on OCI-R. Assess your behaviors and thoughts with this OCD evaluation, and get customized strategies to reduce obsessive patterns and manage compulsive actions effectively.",
    },
  });

  const ociQuestions = [
    "I have saved up so many things that they get in the way",
    "I check things more often than necessary",
    "I get upset if objects are not arranged properly",
    "I feel compelled to count while I am doing things",
    "I find it difficult to touch an object when I know it has been touched by strangers or certain people",
    "I find it difficult to control my own thoughts",
    "I collect things I don't need",
    "I repeatedly check doors, windows, drawers, etc.",
    "I get upset if others change the way I have arranged things",
    "I feel I have to repeat certain numbers",
    "I sometimes have to wash or clean myself simply because I feel contaminated",
    "I am upset by unpleasant thoughts that come into my mind against my will",
    "I avoid throwing things away because I am afraid I might need them later",
    "I repeatedly check gas and water taps and light switches after turning them off",
    "I need things to be arranged in a particular way",
    "I feel that there are good and bad numbers",
    "I wash my hands more often and longer than necessary",
    "I frequently get nasty thoughts and have difficulty in getting rid of them",
  ];

  for (const [i, text] of ociQuestions.entries()) {
    const q = await prisma.question.upsert({
      where: { id: `oci-q${i + 1}` },
      update: { text, order: i + 1 },
      create: { id: `oci-q${i + 1}`, quizId: oci.id, order: i + 1, text },
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

  console.log("✅ OCI-R (OCD) quiz created");

  // 8. PCL-5 (PTSD)
  const pcl5 = await prisma.quiz.upsert({
    where: { key: "PCL-5" },
    update: {},
    create: {
      key: "PCL-5",
      title: "PTSD Clarity Check (PCL-5)",
      description: "Based on PCL-5. Evaluate your stress and trauma responses with this PTSD assessment, and receive personalized strategies to manage flashbacks, anxiety, and emotional resilience.",
    },
  });

  const pcl5Questions = [
    "Repeated, disturbing, and unwanted memories of the stressful experience?",
    "Repeated, disturbing dreams of the stressful experience?",
    "Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were actually back there reliving it)?",
    "Feeling very upset when something reminded you of the stressful experience?",
    "Having strong physical reactions when something reminded you of the stressful experience (for example, heart pounding, trouble breathing, sweating)?",
    "Avoiding memories, thoughts, or feelings related to the stressful experience?",
    "Avoiding external reminders of the stressful experience (for example, people, places, conversations, activities, objects, or situations)?",
    "Trouble remembering important parts of the stressful experience?",
    "Having strong negative beliefs about yourself, other people, or the world (for example, having thoughts such as: I am bad, there is something seriously wrong with me, no one can be trusted, the world is completely dangerous)?",
    "Blaming yourself or someone else for the stressful experience or what happened after it?",
    "Having strong negative feelings such as fear, horror, anger, guilt, or shame?",
    "Loss of interest in activities that you used to enjoy?",
    "Feeling distant or cut off from other people?",
    "Trouble experiencing positive feelings (for example, being unable to feel happiness or have loving feelings for people close to you)?",
    "Irritable behavior, angry outbursts, or acting aggressively?",
    "Taking too many risks or doing things that could cause you harm?",
    "Being 'superalert' or watchful or on guard?",
    "Feeling jumpy or easily startled?",
    "Having difficulty concentrating?",
    "Trouble falling or staying asleep?",
  ];

  for (const [i, text] of pcl5Questions.entries()) {
    const q = await prisma.question.upsert({
      where: { id: `pcl5-q${i + 1}` },
      update: { text, order: i + 1 },
      create: { id: `pcl5-q${i + 1}`, quizId: pcl5.id, order: i + 1, text },
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

  console.log("✅ PCL-5 (PTSD) quiz created");

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
